"use client";

import { useState } from "react";

type Props = {
  label: string;
  payload: string;
  className?: string;
};

export default function CopyButton({ label, payload, className }: Props) {
  const [copied, setCopied] = useState(false);

  async function onClick() {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-md border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-800 transition hover:border-ink-400 hover:bg-ink-50 " +
        (className ?? "")
      }
    >
      {copied ? "Copied" : label}
    </button>
  );
}
