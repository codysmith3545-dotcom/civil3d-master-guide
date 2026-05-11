/**
 * Standalone project-aware chat helper.
 *
 * NOTE: This is a NEW helper. The existing public-KB chat route at
 * `web/app/api/chat/route.ts` is owned by Quality-SecurityFixes and is
 * not to be modified. This helper is what the workspace UI
 * (Agent 5B-Workspace) will eventually call from a separate route like
 * `/api/projects/[id]/chat`.
 *
 * Behaviour:
 *   - Build the project context (public KB + project docs + jurisdiction).
 *   - Compose a single system prompt with each context block wrapped in a
 *     stable XML-style tag so the model can cite them.
 *   - Call the Anthropic SDK with `claude-opus-4-7`.
 *   - Parse `<cite>` tags out of the response and return them alongside
 *     the cleaned assistant text.
 *
 * BYOK is honoured first; if the caller supplies a per-user key we use it.
 * If not, and `ANTHROPIC_API_KEY` is set as an operator-side env var, we
 * use that. If neither is available we throw — let the caller surface the
 * 402-style "bring your own key" UX (the public chat route does this).
 */

import Anthropic from "@anthropic-ai/sdk";
import { buildProjectContext, type ProjectContext } from "@/lib/project-context";

const MODEL = "claude-opus-4-7";
const MAX_TOKENS = 1024;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Citation {
  /** Source identifier as it appeared in the prompt's `source=` attribute. */
  source: string;
  /** Optional document id (set for project-document citations). */
  documentId?: string;
  /** Origin channel — useful for the UI to render different chips. */
  kind: "kb" | "project" | "jurisdiction" | "unknown";
  /** Verbatim text the model placed inside the cite tag. */
  quote?: string;
}

export interface ChatWithProjectInput {
  projectId: string;
  userId: string;
  message: string;
  history?: ChatMessage[];
  /** BYOK first; operator fallback via ANTHROPIC_API_KEY when absent. */
  apiKey?: string;
}

export interface ChatWithProjectOutput {
  text: string;
  citations: Citation[];
}

const BASE_SYSTEM = `You are the project-aware assistant for the Civil 3D Master Guide. You answer survey, civil-engineering, and Civil 3D questions in the context of a specific user project.

Rules:
1. The user's question is always framed against their CURRENT project. When relevant project documents are supplied (in <project_document> blocks), prefer them over the public knowledge base.
2. Public knowledge-base excerpts arrive in <retrieved_kb_chunk> blocks. Cite anything you draw from them.
3. If a <jurisdiction_rules> block is present, it represents the jurisdiction the project's bounds fall in. Use it to choose the right county/municipality content rather than guessing from text alone.
4. Cite every numeric standard, regulation, or Civil 3D behaviour using a <cite source="..."> tag. For project documents use <cite source="..." doc_id="...">. Place the cite tag at the end of the sentence it supports. Multiple cites per sentence are fine.
5. Never invent Civil 3D command names, ribbon paths, or numeric design standards. If you do not know an exact value, say so.
6. Plain prose. No emoji. No marketing voice. Numeric standards always include units.
7. You are not a substitute for a licensed engineer or surveyor of record. Recommend the user verify against the cited primary source for any decision that affects life safety, property, or a permit.`;

export async function chatWithProject(
  input: ChatWithProjectInput,
): Promise<ChatWithProjectOutput> {
  const ctx = await buildProjectContext(input.projectId, input.message, {
    userId: input.userId,
  });

  const systemPrompt = composeSystemPrompt(ctx);

  const apiKey = input.apiKey ?? process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "No Anthropic API key supplied (neither BYOK input.apiKey nor operator ANTHROPIC_API_KEY).",
    );
  }

  const client = new Anthropic({ apiKey });

  const messages: { role: "user" | "assistant"; content: string }[] = [];
  if (input.history) {
    for (const h of input.history) {
      if (h.role !== "user" && h.role !== "assistant") continue;
      if (typeof h.content !== "string") continue;
      messages.push({ role: h.role, content: h.content });
    }
  }
  messages.push({ role: "user", content: input.message });

  const result = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: [{ type: "text", text: systemPrompt }],
    messages,
  });

  const rawText = result.content
    .filter((block): block is { type: "text"; text: string } => block.type === "text")
    .map((b) => b.text)
    .join("");

  const citations = parseCitations(rawText, ctx);
  const text = stripCiteTags(rawText);

  return { text, citations };
}

/**
 * Compose the system prompt. Exposed for snapshot testing.
 */
export function composeSystemPrompt(ctx: ProjectContext): string {
  const parts: string[] = [BASE_SYSTEM];

  parts.push(`\n<project_id>${ctx.projectId}</project_id>`);

  if (ctx.kbChunks.length) {
    parts.push("\nPublic knowledge-base excerpts:");
    for (const k of ctx.kbChunks) {
      parts.push(
        `<retrieved_kb_chunk source="${escapeAttr(k.source)}">\n${k.text}\n</retrieved_kb_chunk>`,
      );
    }
  } else {
    parts.push(
      "\nNo public knowledge-base excerpts were retrieved for this query. If the question depends on standards, say so plainly rather than guessing.",
    );
  }

  if (ctx.projectChunks.length) {
    parts.push("\nProject documents:");
    for (const p of ctx.projectChunks) {
      parts.push(
        `<project_document source="${escapeAttr(p.source)}" doc_id="${escapeAttr(p.documentId)}">\n${p.text}\n</project_document>`,
      );
    }
  }

  if (ctx.jurisdictionRules) {
    const j = ctx.jurisdictionRules;
    const refs = j.contentRefs.join(", ");
    parts.push(
      `\n<jurisdiction_rules>\nstate=${j.state}${j.county ? `; county=${j.county}` : ""}${j.municipality ? `; municipality=${j.municipality}` : ""}\nsummary: ${j.summary}\ncontent_refs: ${refs}\n</jurisdiction_rules>`,
    );
  }

  return parts.join("\n");
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, "&quot;").replace(/\n/g, " ");
}

/**
 * Extract `<cite source="..." doc_id="...">...</cite>` from the model
 * response and classify each one by origin.
 */
export function parseCitations(rawText: string, ctx: ProjectContext): Citation[] {
  const out: Citation[] = [];
  const re = /<cite\b([^>]*)>([\s\S]*?)<\/cite>/gi;
  const kbSources = new Set(ctx.kbChunks.map((c) => c.source));
  const projectSources = new Set(ctx.projectChunks.map((c) => c.source));
  let m: RegExpExecArray | null;
  while ((m = re.exec(rawText)) !== null) {
    const attrs = m[1] ?? "";
    const quote = (m[2] ?? "").trim() || undefined;
    const source = attrMatch(attrs, "source") ?? "";
    const documentId = attrMatch(attrs, "doc_id") ?? undefined;
    let kind: Citation["kind"] = "unknown";
    if (documentId || projectSources.has(source)) kind = "project";
    else if (kbSources.has(source)) kind = "kb";
    else if (source === "jurisdiction_rules" || /jurisdiction/i.test(source)) kind = "jurisdiction";
    out.push({ source, documentId, kind, quote });
  }
  return out;
}

function attrMatch(attrs: string, name: string): string | null {
  const re = new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i");
  const m = attrs.match(re);
  return m ? m[1]! : null;
}

function stripCiteTags(s: string): string {
  // Keep the inner text, drop the wrapping tag. This matches the public
  // chat route's behaviour: citations are surfaced structurally next to
  // the text rather than as raw XML.
  return s.replace(/<cite\b[^>]*>([\s\S]*?)<\/cite>/gi, "$1").trim();
}
