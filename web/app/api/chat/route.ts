import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { retrieve } from "@/lib/rag";

export const runtime = "nodejs";
// Stream output token-by-token; do not pre-render in Edge cache.
export const dynamic = "force-dynamic";

const MODEL = "claude-haiku-4-5";

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

function sse(eventObj: unknown): string {
  return `data: ${JSON.stringify(eventObj)}\n\n`;
}

function jsonError(status: number, message: string) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  let body: { messages?: ClientMessage[] };
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "Invalid JSON body.");
  }

  const messages = (body.messages ?? []).filter(
    (m) =>
      m &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string",
  );
  if (!messages.length) {
    return jsonError(400, "At least one message is required.");
  }
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return jsonError(400, "The last message must come from the user.");
  }

  // BYOK: client sends the user's Anthropic key in a header. Operator key is
  // intentionally NOT used as a fallback; we don't want to spend operator
  // tokens until a paid pool is set up explicitly.
  const apiKey = req.headers.get("x-anthropic-api-key");
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        message:
          "No Anthropic API key supplied. The operator-funded free pool is not configured yet. Add your own key in the chat panel — it is stored only in your browser.",
      }),
      {
        status: 402,
        headers: { "content-type": "application/json" },
      },
    );
  }

  const sources = await retrieve(lastUser.content, 5);

  const ragBlock =
    sources.length > 0
      ? "Retrieved excerpts from the Civil 3D Master Guide. Cite these by URL when you draw on them:\n\n" +
        sources
          .map(
            (s, i) =>
              `[${i + 1}] ${s.title} (${s.path})\n${s.excerpt}`,
          )
          .join("\n\n")
      : "No relevant excerpts were retrieved. Tell the user the guide does not currently cover the question rather than guessing.";

  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      // Emit retrieved sources first so the UI can render the citations
      // panel before the streamed text begins.
      controller.enqueue(encoder.encode(sse({ type: "sources", items: sources })));

      try {
        // Prompt caching breakpoints on the system prompt: the static rules
        // block is stable across requests; the per-turn retrieval is not.
        const result = await client.messages.create({
          model: MODEL,
          max_tokens: 1024,
          system: [
            {
              type: "text",
              text: SYSTEM_PROMPT,
            } as const,
            {
              type: "text",
              text: ragBlock,
            },
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
              encoder.encode(
                sse({ type: "text", delta: event.delta.text }),
              ),
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

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
    },
  });
}
