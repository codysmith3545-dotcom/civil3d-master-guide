import type { Metadata } from "next";
import ChatUI from "@/components/ChatUI";

export const metadata: Metadata = {
  title: "Chat",
  description:
    "Ask the Civil 3D Master Guide. BYO Anthropic API key — operator funds not spent.",
};

export default function ChatPage() {
  return (
    <div>
      <header className="border-b border-ink-100 bg-ink-50">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <h1 className="text-2xl font-semibold tracking-tight">Assistant</h1>
          <p className="mt-1 text-sm text-ink-600">
            Retrieval-grounded answers from this knowledge base. Bring your own
            Anthropic API key.
          </p>
        </div>
      </header>
      <ChatUI />
    </div>
  );
}
