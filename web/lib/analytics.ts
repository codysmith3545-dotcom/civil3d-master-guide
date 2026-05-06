/**
 * Privacy-respecting client-side analytics.
 *
 * Design constraints:
 * - No PII. No IP collection here, no user agent, no cookies tied to identity.
 * - A random session UUID is generated per browser session (sessionStorage).
 *   It is not a user ID and resets when the tab/session closes.
 * - Events are queued and flushed every 5 seconds, on visibility change, and
 *   on page unload.
 * - Transport: navigator.sendBeacon when available, otherwise fetch with
 *   keepalive: true.
 * - No third-party SDKs (no GA, no Plausible). Self-hosted, minimal.
 */
"use client";

export type AnalyticsEventName =
  | "page_view"
  | "search"
  | "calculator_use"
  | "chat_message"
  | string;

export interface AnalyticsEvent {
  /** ISO timestamp (UTC). */
  ts: string;
  /** Random session UUID. NOT a user ID. */
  sessionId: string;
  /** Event name. */
  event: AnalyticsEventName;
  /** Free-form, must be JSON-serializable, must contain no PII. */
  props: Record<string, string | number | boolean>;
}

const SESSION_KEY = "c3dmg_anon_session";
const FLUSH_INTERVAL_MS = 5000;
const MAX_QUEUE = 100;
const ENDPOINT = "/api/analytics";

let queue: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let listenersWired = false;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function generateUuid(): string {
  if (isBrowser() && typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // RFC4122-ish fallback.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getSessionId(): string {
  if (!isBrowser()) return "server";
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = generateUuid();
    sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    // sessionStorage may be blocked; degrade silently.
    return "no-storage";
  }
}

function ensureWired(): void {
  if (!isBrowser() || listenersWired) return;
  listenersWired = true;

  flushTimer = setInterval(() => {
    void flush();
  }, FLUSH_INTERVAL_MS);

  // Flush on tab hide / unload to avoid losing events.
  const flushNow = () => {
    void flush(true);
  };
  window.addEventListener("pagehide", flushNow);
  window.addEventListener("beforeunload", flushNow);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushNow();
  });
}

async function flush(useBeacon = false): Promise<void> {
  if (!isBrowser() || queue.length === 0) return;
  const batch = queue.splice(0, queue.length);
  const body = JSON.stringify(batch);

  // Prefer sendBeacon for reliability during unload.
  if (useBeacon && typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    try {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon(ENDPOINT, blob);
      if (ok) return;
    } catch {
      // fall through to fetch
    }
  }

  try {
    await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // Drop the batch on failure. Re-queueing risks unbounded growth.
  }
}

function enqueue(name: AnalyticsEventName, props: Record<string, string | number | boolean> = {}): void {
  if (!isBrowser()) return;
  ensureWired();
  if (queue.length >= MAX_QUEUE) {
    // Drop oldest to keep the queue bounded.
    queue.shift();
  }
  queue.push({
    ts: new Date().toISOString(),
    sessionId: getSessionId(),
    event: name,
    props,
  });
}

export function trackPageView(path: string): void {
  enqueue("page_view", { path });
}

export function trackSearch(query: string, resultCount: number, latencyMs: number): void {
  enqueue("search", {
    query: query.slice(0, 200),
    resultCount,
    latencyMs: Math.round(latencyMs),
  });
}

export function trackCalculator(name: string): void {
  enqueue("calculator_use", { name });
}

export function trackChatMessage(messageLength: number, hasOwnKey: boolean): void {
  enqueue("chat_message", { messageLength, hasOwnKey });
}

export function trackEvent(
  name: string,
  props: Record<string, string | number | boolean> = {},
): void {
  enqueue(name, props);
}

/** Test/SSR helper. */
export function _resetAnalyticsForTests(): void {
  queue = [];
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
  listenersWired = false;
}
