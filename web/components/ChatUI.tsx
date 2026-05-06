"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Source = { path: string; title: string; excerpt: string };
type Message =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; sources?: Source[] };

const KEY_STORAGE = "kb_anthropic_api_key";

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setApiKey(localStorage.getItem(KEY_STORAGE) ?? "");
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function saveKey(k: string) {
    setApiKey(k);
    localStorage.setItem(KEY_STORAGE, k);
  }

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;
    setError(null);
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(apiKey ? { "x-anthropic-api-key": apiKey } : {}),
        },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.status === 402 || !res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(
          (body as { message?: string })?.message ??
            "Request failed. Add your Anthropic API key above and try again.",
        );
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setStreaming(false);
        return;
      }
      const decoder = new TextDecoder();
      let buf = "";
      let assistantText = "";
      let assistantSources: Source[] | undefined;
      // Push a placeholder assistant message we will mutate as the stream lands.
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const events = buf.split("\n\n");
        buf = events.pop() ?? "";
        for (const evt of events) {
          const line = evt.trim();
          if (!line.startsWith("data:")) continue;
          const json = line.slice(5).trim();
          if (!json || json === "[DONE]") continue;
          try {
            const parsed = JSON.parse(json);
            if (parsed.type === "sources") {
              assistantSources = parsed.items as Source[];
              setMessages((m) => {
                const copy = [...m];
                const last = copy[copy.length - 1];
                if (last && last.role === "assistant") {
                  copy[copy.length - 1] = {
                    role: "assistant",
                    content: assistantText,
                    sources: assistantSources,
                  };
                }
                return copy;
              });
            } else if (parsed.type === "text") {
              assistantText += parsed.delta as string;
              setMessages((m) => {
                const copy = [...m];
                const last = copy[copy.length - 1];
                if (last && last.role === "assistant") {
                  copy[copy.length - 1] = {
                    role: "assistant",
                    content: assistantText,
                    sources: assistantSources,
                  };
                }
                return copy;
              });
            } else if (parsed.type === "error") {
              setError(parsed.message ?? "Stream error.");
            }
          } catch {
            // ignore malformed events
          }
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8">
      <div className="rounded-md border border-ink-200 bg-ink-50 p-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-ink-700">
            This assistant uses your Anthropic API key — operator funds are not
            spent. The key is stored in your browser only.
          </p>
          <button
            type="button"
            className="btn"
            onClick={() => setShowKey((s) => !s)}
          >
            {apiKey ? "Update key" : "Add key"}
          </button>
        </div>
        {showKey ? (
          <div className="mt-3 flex gap-2">
            <input
              type="password"
              autoComplete="off"
              defaultValue={apiKey}
              placeholder="sk-ant-…"
              className="flex-1 rounded-md border border-ink-200 px-2 py-1.5 text-sm"
              onChange={(e) => saveKey(e.target.value)}
            />
            <button
              type="button"
              className="btn"
              onClick={() => {
                saveKey("");
                setShowKey(false);
              }}
            >
              Clear
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="rounded-md border border-dashed border-ink-200 p-6 text-center text-sm text-ink-500">
            Ask something like &quot;What does Carmel require for stormwater
            detention?&quot; or &quot;K-value for a 45 mph crest curve&quot;.
          </div>
        ) : null}
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>

      {error ? (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          {error}
        </div>
      ) : null}

      <form
        className="flex items-end gap-2 border-t border-ink-100 pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          rows={2}
          placeholder="Ask the guide…"
          className="flex-1 resize-none rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-ink-400"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="btn btn-primary disabled:opacity-50"
        >
          {streaming ? "Thinking…" : "Send"}
        </button>
      </form>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="self-end rounded-lg bg-[--accent] px-3 py-2 text-sm text-white max-w-[80%] whitespace-pre-wrap">
        {message.content}
      </div>
    );
  }
  return (
    <div className="self-start max-w-[90%] space-y-2">
      <div className="whitespace-pre-wrap rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900">
        {message.content || <span className="text-ink-400">…</span>}
      </div>
      {message.sources && message.sources.length > 0 ? (
        <div className="rounded-md border border-ink-100 bg-ink-50 p-3 text-xs">
          <p className="mb-1 font-medium uppercase tracking-wider text-ink-500">
            Sources
          </p>
          <ul className="space-y-1">
            {message.sources.map((s) => (
              <li key={s.path}>
                <Link href={s.path} className="text-[--accent] underline">
                  {s.title}
                </Link>
                <span className="text-ink-500"> — {s.excerpt}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
