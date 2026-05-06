"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

type Props = {
  messageId: string;
  query?: string;
};

type StoredFeedback = {
  messageId: string;
  rating: "up" | "down";
  reason?: string;
  timestamp: number;
  query?: string;
};

const STORAGE_KEY = "c3d_chat_feedback";
const REASONS = ["Wrong info", "Missing detail", "Off-topic"] as const;
type Reason = (typeof REASONS)[number];

function appendFeedback(entry: StoredFeedback) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr: StoredFeedback[] = raw ? JSON.parse(raw) : [];
    arr.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // localStorage may be unavailable; silently ignore
  }
}

export default function ChatFeedback({ messageId, query }: Props) {
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [showThanks, setShowThanks] = useState(false);
  const [askReason, setAskReason] = useState(false);

  useEffect(() => {
    if (!showThanks) return;
    const t = setTimeout(() => setShowThanks(false), 2000);
    return () => clearTimeout(t);
  }, [showThanks]);

  function handleUp() {
    if (rating) return;
    setRating("up");
    appendFeedback({
      messageId,
      rating: "up",
      timestamp: Date.now(),
      query,
    });
    setShowThanks(true);
  }

  function handleDown() {
    if (rating) return;
    setRating("down");
    appendFeedback({
      messageId,
      rating: "down",
      timestamp: Date.now(),
      query,
    });
    setAskReason(true);
  }

  function pickReason(reason: Reason) {
    appendFeedback({
      messageId,
      rating: "down",
      reason,
      timestamp: Date.now(),
      query,
    });
    setAskReason(false);
    setShowThanks(true);
  }

  return (
    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-500">
      <button
        type="button"
        onClick={handleUp}
        disabled={rating !== null}
        aria-label="Helpful"
        className={`inline-flex h-7 min-h-[44px] min-w-[44px] items-center justify-center rounded border border-ink-100 px-2 hover:bg-ink-50 disabled:opacity-50 md:min-h-0 md:min-w-0 ${
          rating === "up" ? "border-emerald-300 bg-emerald-50 text-emerald-700" : ""
        }`}
      >
        <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={handleDown}
        disabled={rating !== null}
        aria-label="Not helpful"
        className={`inline-flex h-7 min-h-[44px] min-w-[44px] items-center justify-center rounded border border-ink-100 px-2 hover:bg-ink-50 disabled:opacity-50 md:min-h-0 md:min-w-0 ${
          rating === "down" ? "border-amber-300 bg-amber-50 text-amber-700" : ""
        }`}
      >
        <ThumbsDown className="h-3.5 w-3.5" aria-hidden />
      </button>

      {askReason ? (
        <span className="flex flex-wrap items-center gap-1">
          <span className="text-ink-500">What was wrong?</span>
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => pickReason(r)}
              className="rounded-full border border-ink-200 px-2 py-0.5 text-xs hover:bg-ink-50"
            >
              {r}
            </button>
          ))}
        </span>
      ) : null}

      {showThanks ? <span className="text-ink-500">Thanks!</span> : null}
    </div>
  );
}
