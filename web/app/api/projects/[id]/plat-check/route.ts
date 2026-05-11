import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { hasValidInvite } from "@/lib/access";
import {
  loadProjects,
  loadRules,
  supabaseConfigured,
  SUPABASE_PLACEHOLDER_MESSAGE,
  type ChecklistItem,
} from "@/lib/project-backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-haiku-4-5";

const SYSTEM_PROMPT = `You are a plat-submittal reviewer for a U.S. land-surveying practice. You receive:

1. The extracted text of a plat (sometimes incomplete because of OCR).
2. A jurisdictional checklist of required items, each with a stable id and a human label.

For every checklist item, return one of:
  - "pass": the plat text plainly satisfies the requirement.
  - "fail": the plat text plainly contradicts the requirement or omits something legally mandatory.
  - "needs-review": the plat text is silent or ambiguous; a human reviewer must look at the drawing.

Rules:
  - Never invent ordinance text. Quote the plat or say "the extracted text does not mention X".
  - Be conservative. When in doubt, mark "needs-review", not "pass".
  - The rationale must cite the specific phrase from the plat text when possible, or explicitly state that the item could not be confirmed from the extracted text alone.

Return ONLY JSON of the shape:
{
  "items": [
    { "id": "<id>", "label": "<label>", "status": "pass|fail|needs-review", "rationale": "<one or two sentences>" }
  ]
}`;

function jsonError(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

type ModelOutput = {
  items?: Array<{
    id?: unknown;
    label?: unknown;
    status?: unknown;
    rationale?: unknown;
  }>;
};

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await hasValidInvite())) return jsonError(401, "Invite required.");
  if (!supabaseConfigured())
    return jsonError(503, SUPABASE_PLACEHOLDER_MESSAGE);

  let body: { documentId?: unknown; jurisdictionSlug?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return jsonError(400, "Invalid JSON body.");
  }
  const documentId =
    typeof body.documentId === "string" ? body.documentId.trim() : "";
  const jurisdictionSlug =
    typeof body.jurisdictionSlug === "string"
      ? body.jurisdictionSlug.trim()
      : "";
  if (!documentId) return jsonError(400, "documentId is required.");
  if (!jurisdictionSlug) {
    return jsonError(400, "jurisdictionSlug is required.");
  }

  const apiKey =
    req.headers.get("x-anthropic-api-key") ?? process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonError(
      402,
      "No Anthropic API key. Set ANTHROPIC_API_KEY on the server or send x-anthropic-api-key.",
    );
  }

  // 1. Load the document text via 5B-Schema.
  const projects = loadProjects();
  if (!projects.ok) return jsonError(503, projects.reason);
  if (!projects.mod.getProjectDocument) {
    return jsonError(
      503,
      "getProjectDocument is not implemented yet — wait for 5B-Schema.",
    );
  }

  const doc = await projects.mod.getProjectDocument(params.id, documentId);
  if (!doc) return jsonError(404, "Document not found.");
  const plateText = (doc.extractedText ?? "").trim();
  if (!plateText) {
    return jsonError(
      409,
      "Document has no extracted text yet. Wait for processing to finish, then retry.",
    );
  }

  // 2. Load jurisdiction rules via 5A-MCP.
  const rules = loadRules();
  if (!rules.ok) return jsonError(503, rules.reason);
  if (!rules.mod.getJurisdictionRules) {
    return jsonError(
      503,
      "getJurisdictionRules is not implemented yet — wait for 5A-MCP.",
    );
  }
  const jr = await rules.mod.getJurisdictionRules(jurisdictionSlug);
  if (!jr) {
    return jsonError(
      404,
      `No rules found for jurisdiction "${jurisdictionSlug}".`,
    );
  }

  const checklist: ChecklistItem[] = [
    ...(jr.submittal_checklist ?? []),
    ...(jr.plat_requirements ?? []),
  ];
  if (checklist.length === 0) {
    return jsonError(
      409,
      `Jurisdiction "${jurisdictionSlug}" has no submittal_checklist or plat_requirements.`,
    );
  }

  // 3. Call Anthropic with a structured prompt.
  const client = new Anthropic({ apiKey });
  const userPrompt = [
    `Jurisdiction: ${jurisdictionSlug}`,
    "",
    "Checklist (JSON):",
    JSON.stringify(checklist, null, 2),
    "",
    "Plat extracted text:",
    "```",
    plateText.slice(0, 30000), // hard cap to keep tokens bounded
    "```",
    "",
    "Return JSON only, no prose.",
  ].join("\n");

  try {
    const completion = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = completion.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();

    const parsed = parseModelJson(raw);
    if (!parsed) {
      return jsonError(502, "Model did not return valid JSON.");
    }

    const items = (parsed.items ?? []).map((it) => {
      const id = typeof it.id === "string" ? it.id : "";
      const label = typeof it.label === "string" ? it.label : id;
      const status =
        it.status === "pass" || it.status === "fail"
          ? it.status
          : "needs-review";
      const rationale =
        typeof it.rationale === "string" ? it.rationale : "";
      return { id, label, status, rationale };
    });

    return NextResponse.json({
      evaluatedAt: new Date().toISOString(),
      items,
    });
  } catch (err) {
    const message =
      err instanceof Anthropic.APIError
        ? `Anthropic API error ${err.status}: ${err.message}`
        : err instanceof Error
          ? err.message
          : "Unknown error.";
    return jsonError(502, message);
  }
}

function parseModelJson(raw: string): ModelOutput | null {
  try {
    return JSON.parse(raw) as ModelOutput;
  } catch {
    // Some models wrap JSON in a ```json fence. Strip and retry.
    const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (m) {
      try {
        return JSON.parse(m[1]) as ModelOutput;
      } catch {
        return null;
      }
    }
    return null;
  }
}
