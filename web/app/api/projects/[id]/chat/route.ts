import { NextRequest } from "next/server";
import { hasValidInvite } from "@/lib/access";
import {
  loadChat,
  supabaseConfigured,
  SUPABASE_PLACEHOLDER_MESSAGE,
  type ProjectChatTurn,
} from "@/lib/project-backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sse(eventObj: unknown): string {
  return `data: ${JSON.stringify(eventObj)}\n\n`;
}

function jsonError(status: number, message: string) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await hasValidInvite())) return jsonError(401, "Invite required.");
  if (!supabaseConfigured())
    return jsonError(503, SUPABASE_PLACEHOLDER_MESSAGE);

  let body: { message?: unknown; history?: unknown };
  try {
    body = (await req.json()) as { message?: unknown; history?: unknown };
  } catch {
    return jsonError(400, "Invalid JSON body.");
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return jsonError(400, "message is required.");

  const history: ProjectChatTurn[] = Array.isArray(body.history)
    ? (body.history as unknown[])
        .filter(
          (m): m is ProjectChatTurn =>
            !!m &&
            typeof m === "object" &&
            (("role" in m && (m as ProjectChatTurn).role === "user") ||
              (m as ProjectChatTurn).role === "assistant") &&
            typeof (m as ProjectChatTurn).content === "string",
        )
        .map((m) => ({ role: m.role, content: m.content }))
    : [];

  const loaded = loadChat();
  if (!loaded.ok) return jsonError(503, loaded.reason);
  if (!loaded.mod.chatWithProject) {
    return jsonError(503, "chatWithProject is not implemented yet.");
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const iter = loaded.mod.chatWithProject!({
          projectId: params.id,
          message,
          history,
        });
        for await (const evt of iter) {
          if (evt.type === "text") {
            controller.enqueue(
              encoder.encode(sse({ type: "text", delta: evt.delta })),
            );
          } else if (evt.type === "citations") {
            controller.enqueue(
              encoder.encode(sse({ type: "citations", items: evt.items })),
            );
          } else if (evt.type === "error") {
            controller.enqueue(
              encoder.encode(sse({ type: "error", message: evt.message })),
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        const messageText =
          err instanceof Error ? err.message : "Chat backend error.";
        controller.enqueue(
          encoder.encode(sse({ type: "error", message: messageText })),
        );
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
