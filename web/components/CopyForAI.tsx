"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

interface CopyForAIProps {
  title: string;
  tldr: string;
  section: string;
}

export default function CopyForAI({ title, tldr, section }: CopyForAIProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const text = `## ${title}\nSection: ${section}\n\n${tldr}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / non-HTTPS
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [title, tldr, section]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-md border border-ink-200 bg-white px-2.5 py-1.5 text-xs font-medium text-ink-600 transition hover:border-ink-300 hover:text-ink-900"
      title="Copy TL;DR for pasting into an AI chat"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-600" />
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>Copy for AI</span>
        </>
      )}
    </button>
  );
}
