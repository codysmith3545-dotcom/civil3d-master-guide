import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { retrieve } from "@/lib/rag";
import { serverEnv } from "@/lib/config";

export const runtime = "nodejs";
// Stream output token-by-token; do not pre-render in Edge cache.
export const dynamic = "force-dynamic";

// Default model when the user brings their own key.
const USER_MODEL = "claude-haiku-4-5";
// Cheaper model used when spending operator funds.
const OPERATOR_MODEL = "claude-haiku-4-5-20251001";

const MAX_MESSAGE_CHARS = 4000;
const MAX_CONVERSATION_LENGTH = 20;

const SYSTEM_PROMPT = `You are the assistant for the Civil 3D Master Guide, a working reference for land surveyors and civil engineers using Autodesk Civil 3D, with a U.S. (AASHTO/ALTA/NCS) and Indiana jurisdictional focus.

Rules:

1. Cite the source page for every numeric standard, regulation, or Civil 3D behavior you state. Use the URLs in the retrieved context. If the user asks something that isn't covered by the retrieved context, say so plainly rather than guessing.
2. Never invent Civil 3D command names, ribbon paths, or numeric design standards. If you don't know an exact value, say so.
3. Keep prose plain and professional. No emoji. No marketing voice. Numeric standards always include units.
4. Spell out acronyms on first use (e.g. "Triangulated Irregular Network (TIN)").
5. When answering jurisdictional questions, prefer the most specific level (municipality > county > state) and link the source.
6. If the question is operational ("how do I do X in Civil 3D"), structure your answer as: short summary first, then numbered steps, then caveats.

You are not a substitute for a licensed engineer or surveyor of record. Recommend the user verify against the cited primary source for any decision that affects life safety, property, or a permit.`;

type ClientMessage = {
  role: "user" | "assistant";
  content: string;
};

// Per-IP daily quota for the operator-funded fallback. Same in-memory caveat
// as middleware.ts: per-instance only. Acceptable for v1.
type QuotaEntry = { day: string; count: number };
const operatorQuota: Map<string, QuotaEntry> = new Map();

function utcDay(now = new Date()): string {
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req as any).ip ?? "unknown";
}

function sse(eventObj: unknown): string {
  return `data: ${JSON.stringify(eventObj)}\n\n`;
}

function jsonError(
  status: number,
  body: Record<string, unknown>,
  extraHeaders: Record<string, string> = {},
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extraHeaders },
  });
}

function sanitize(text: string): string {
  // Strip C0 control characters (incl. null bytes) - some clients leak them
  // through copy/paste from PDFs. Newlines are preserved for code blocks.
  // Then collapse runs of horizontal whitespace into a single space.
  // eslint-disable-next-line no-control-regex
  const noControl = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  return noControl.replace(/[ \t]+/g, " ").trim();
}

export async function POST(req: NextRequest) {
  let body: { messages?: ClientMessage[]; apiKey?: string };
  try {
    body = await req.json();
  } catch {
    return jsonError(400, { message: "Invalid JSON body." });
  }

  const rawMessages = (body.messages ?? []).filter(
    (m) =>
      m &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string",
  );

  if (rawMessages.length > MAX_CONVERSATION_LENGTH) {
    return jsonError(400, {
      error: "conversation_too_long",
      message: `Conversations are capped at ${MAX_CONVERSATION_LENGTH} messages. Start a new conversation to continue.`,
    });
  }

  const messages: ClientMessage[] = [];
  for (const m of rawMessages) {
    const cleaned = sanitize(m.content);
    if (cleaned.length > MAX_MESSAGE_CHARS) {
      return jsonError(400, {
        error: "message_too_long",
        message: `Each message is capped at ${MAX_MESSAGE_CHARS} characters.`,
      });
    }
    messages.push({ role: m.role, content: cleaned });
  }
  if (!messages.length) {
    return jsonError(400, { message: "At least one message is required." });
  }
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return jsonError(400, {
      message: "The last message must come from the user.",
    });
  }

  // BYOK: header preserves the existing client contract; body.apiKey is the
  // newer path documented in the v2 task.
  const headerKey = req.headers.get("x-anthropic-api-key");
  const userApiKey = (body.apiKey ?? headerKey ?? "").trim();
  const operatorKey = serverEnv.ANTHROPIC_API_KEY;

  let effectiveKey: string;
  let model: string;
  let isOperatorFunded = false;
  let quotaRemaining: number | null = null;

  if (userApiKey) {
    effectiveKey = userApiKey;
    model = USER_MODEL;
  } else if (operatorKey) {
    // Anonymous user → spend operator funds, but cap by IP/day.
    const ip = clientIp(req);
    const today = utcDay();
    const limit = serverEnv.OPERATOR_CHAT_DAILY_LIMIT;
    const entry = operatorQuota.get(ip);
    const current =
      entry && entry.day === today ? entry.count : 0;
    if (current >= limit) {
      return jsonError(
        402,
        {
          error: "quota_exceeded",
          message:
            "Free tier exhausted. Add your own API key in settings.",
        },
        { "x-quota-remaining": "0" },
      );
    }
    operatorQuota.set(ip, { day: today, count: current + 1 });
    quotaRemaining = Math.max(0, limit - (current + 1));
    effectiveKey = operatorKey;
    model = OPERATOR_MODEL;
    isOperatorFunded = true;
  } else {
    return jsonError(402, {
      error: "no_api_key",
      message:
        "No Anthropic API key supplied. Add your own key in the chat panel — it is stored only in your browser.",
    });
  }

  const sources = await retrieve(lastUser.content, 5);

  const ragBlock =
    sources.length > 0
      ? "Retrieved excerpts from the Civil 3D Master Guide. Cite these by URL when you draw on them:\n\n" +
        sources
          .map((s, i) => `[${i + 1}] ${s.title} (${s.path})\n${s.excerpt}`)
          .join("\n\n")
      : "No relevant excerpts were retrieved. Tell the user the guide does not currently cover the question rather than guessing.";

  const client = new Anthropic({ apiKey: effectiveKey });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(sse({ type: "sources", items: sources })),
      );

      try {
        const result = await client.messages.create({
          model,
          max_tokens: 1024,
          system: [
            { type: "text", text: SYSTEM_PROMPT } as const,
            { type: "text", text: ragBlock },
          ],
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          stream: true,
        });

        for await (const event of result) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(sse({ type: "text", delta: event.delta.text })),
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err: unknown) {
        const message =
          err instanceof Anthropic.APIError
            ? `Anthropic API error ${err.status}: ${err.message}`
            : err instanceof Error
              ? err.message
              : "Unknown error";
        controller.enqueue(encoder.encode(sse({ type: "error", message })));
      } finally {
        controller.close();
      }
    },
  });

  const headers: Record<string, string> = {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    "x-accel-buffering": "no",
  };
  if (isOperatorFunded && quotaRemaining !== null) {
    headers["x-quota-remaining"] = String(quotaRemaining);
  }

  return new Response(stream, { headers });
}
