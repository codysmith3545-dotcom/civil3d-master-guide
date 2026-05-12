import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import {
  getOperatorAnthropicKey,
  getDeedVisionRateLimitPerHour,
} from "@/lib/config";
import {
  checkDeedVisionBudget,
  estimateOpusCostCents,
  recordDeedVisionSpend,
} from "@/lib/operator-budget";
import { check as consume, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const MODEL = "claude-opus-4-7";
const CACHE_DIR = path.join(process.cwd(), ".cache", "deed-decode");

const EXTRACTION_PROMPT = `Extract the metes-and-bounds portion of this legal description verbatim. Preserve every bearing, distance, and curve call exactly as written. Output ONLY the deed text — no commentary.`;

function jsonError(status: number, message: string, extra?: Record<string, unknown>) {
  return new Response(
    JSON.stringify({ message, ...extra }),
    { status, headers: { "content-type": "application/json" } },
  );
}

async function readCache(hash: string): Promise<string | null> {
  try {
    const buf = await fs.readFile(path.join(CACHE_DIR, `${hash}.json`), "utf8");
    const parsed = JSON.parse(buf) as { text?: string };
    return typeof parsed.text === "string" ? parsed.text : null;
  } catch {
    return null;
  }
}

async function writeCache(hash: string, text: string, modelUsed: string) {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(
      path.join(CACHE_DIR, `${hash}.json`),
      JSON.stringify({ text, modelUsed, cachedAt: new Date().toISOString() }),
      "utf8",
    );
  } catch {
    // Cache write failures are non-fatal.
  }
}

function detectMediaType(declared: string, filename: string | null): {
  kind: "image" | "document";
  mediaType: "image/png" | "image/jpeg" | "application/pdf";
} | null {
  const lower = declared.toLowerCase();
  const name = (filename ?? "").toLowerCase();
  if (lower === "application/pdf" || name.endsWith(".pdf")) {
    return { kind: "document", mediaType: "application/pdf" };
  }
  if (lower === "image/png" || name.endsWith(".png")) {
    return { kind: "image", mediaType: "image/png" };
  }
  if (
    lower === "image/jpeg" ||
    lower === "image/jpg" ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg")
  ) {
    return { kind: "image", mediaType: "image/jpeg" };
  }
  return null;
}

export async function POST(req: NextRequest) {
  // 1. Content-Type validation.
  const ctype = req.headers.get("content-type") ?? "";
  if (!ctype.toLowerCase().includes("multipart/form-data")) {
    return jsonError(400, "Content-Type must be multipart/form-data.");
  }

  // 2. Rate limit: N requests/hour per IP.
  const ip = clientIp(req);
  const limit = getDeedVisionRateLimitPerHour();
  const rl = consume("deed-decode", ip, { limit, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) {
    const retryAfterSeconds = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
    return jsonError(429, `Rate limit exceeded. Retry in ${retryAfterSeconds}s.`, {
      retryAfterSeconds,
    });
  }

  // 3. Parse multipart form data.
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError(400, "Could not parse multipart form data.");
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return jsonError(400, "Missing 'file' field.");
  }
  if (file.size > MAX_BYTES) {
    return jsonError(413, `File exceeds ${MAX_BYTES / 1024 / 1024} MB limit.`);
  }
  const media = detectMediaType(file.type, file.name);
  if (!media) {
    return jsonError(
      415,
      "Unsupported file type. Use PDF, PNG, or JPEG.",
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  // 4. Cache check by content hash.
  const hash = crypto.createHash("sha256").update(bytes).digest("hex");
  const cached = await readCache(hash);
  if (cached !== null) {
    return Response.json({ text: cached, modelUsed: MODEL, cached: true });
  }

  // 5. Operator key + budget guard.
  const apiKey = getOperatorAnthropicKey();
  if (!apiKey) {
    return jsonError(
      503,
      "Vision decoding is not configured on this instance (no operator API key). Use the Paste tab instead.",
    );
  }
  const budget = checkDeedVisionBudget();
  if (!budget.ok) {
    return jsonError(
      503,
      `Daily vision budget exceeded (spent ${budget.spentCents}/${budget.limitCents}¢). Resets at ${budget.resetAtUtc}.`,
      { resetAtUtc: budget.resetAtUtc },
    );
  }

  // 6. Call Anthropic vision API.
  const client = new Anthropic({ apiKey });
  const base64 = Buffer.from(bytes).toString("base64");

  // The Anthropic API accepts `document` blocks for PDFs and `image` blocks
  // for raster images. The SDK's typed unions may lag behind the API, so
  // we cast the content array to bypass the narrow client-side typing — the
  // server still validates payload shape.
  const sourceBlock =
    media.kind === "document"
      ? {
          type: "document" as const,
          source: {
            type: "base64" as const,
            media_type: media.mediaType,
            data: base64,
          },
        }
      : {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: media.mediaType,
            data: base64,
          },
        };

  try {
    const result = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          content: [sourceBlock, { type: "text", text: EXTRACTION_PROMPT }] as any,
        },
      ],
    });

    const text = result.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    // Best-effort spend tracking from usage report.
    const usage = result.usage;
    if (usage) {
      const cents = estimateOpusCostCents(
        usage.input_tokens ?? 0,
        usage.output_tokens ?? 0,
      );
      recordDeedVisionSpend(cents);
    }

    await writeCache(hash, text, MODEL);

    return Response.json({ text, modelUsed: MODEL, cached: false });
  } catch (err: unknown) {
    const message =
      err instanceof Anthropic.APIError
        ? `Anthropic API error ${err.status}: ${err.message}`
        : err instanceof Error
          ? err.message
          : "Unknown error";
    return jsonError(502, message);
  }
}
