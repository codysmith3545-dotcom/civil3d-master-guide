import { NextRequest, NextResponse } from "next/server";

// In-memory sliding-window rate limiter.
//
// Caveat: on Vercel (and any horizontally scaled deployment) each instance
// holds its own Map, so an attacker hitting many edges can exceed the limit
// proportionally to the instance count. This is acceptable for v1 of a small
// reference site; swap in Upstash / Redis when traffic warrants it.

type Bucket = {
  /** UNIX-ms timestamps of recent requests. */
  hits: number[];
};

const WINDOW_MS = 60_000;
const CHAT_LIMIT = 10; // /api/chat: external Anthropic call, expensive
const DEFAULT_LIMIT = 30; // other /api/* routes

// Single shared store keyed by `${route}:${ip}`.
const store: Map<string, Bucket> = new Map();

// Best-effort sweep so the Map does not grow unboundedly. Runs at most once
// per request and only does meaningful work when the store is large.
function sweep(now: number) {
  if (store.size < 1024) return;
  for (const [key, bucket] of store) {
    const fresh = bucket.hits.filter((t) => now - t < WINDOW_MS);
    if (fresh.length === 0) {
      store.delete(key);
    } else {
      bucket.hits = fresh;
    }
  }
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    // x-forwarded-for can be a comma-separated chain; the left-most entry is
    // the original client.
    return fwd.split(",")[0]!.trim();
  }
  // NextRequest.ip is populated on Vercel; fall back to a sentinel locally.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const maybeIp = (req as any).ip as string | undefined;
  return maybeIp ?? "unknown";
}

function limitFor(pathname: string): number {
  if (pathname.startsWith("/api/chat")) return CHAT_LIMIT;
  return DEFAULT_LIMIT;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Only enforce on /api/*; the matcher already constrains, but be defensive.
  if (!pathname.startsWith("/api/")) return NextResponse.next();

  const limit = limitFor(pathname);
  const ip = clientIp(req);
  const key = `${pathname.startsWith("/api/chat") ? "chat" : "default"}:${ip}`;
  const now = Date.now();

  sweep(now);

  const bucket = store.get(key) ?? { hits: [] };
  // Drop entries outside the sliding window.
  bucket.hits = bucket.hits.filter((t) => now - t < WINDOW_MS);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0]!;
    const resetMs = oldest + WINDOW_MS - now;
    const retryAfter = Math.max(1, Math.ceil(resetMs / 1000));
    return new NextResponse(
      JSON.stringify({ error: "rate_limited", retryAfter }),
      {
        status: 429,
        headers: {
          "content-type": "application/json",
          "retry-after": String(retryAfter),
          "x-ratelimit-limit": String(limit),
          "x-ratelimit-remaining": "0",
          "x-ratelimit-reset": String(Math.ceil((now + resetMs) / 1000)),
        },
      },
    );
  }

  bucket.hits.push(now);
  store.set(key, bucket);

  const remaining = Math.max(0, limit - bucket.hits.length);
  const resetMs =
    (bucket.hits[0] ?? now) + WINDOW_MS - now;
  const res = NextResponse.next();
  res.headers.set("x-ratelimit-limit", String(limit));
  res.headers.set("x-ratelimit-remaining", String(remaining));
  res.headers.set(
    "x-ratelimit-reset",
    String(Math.ceil((now + resetMs) / 1000)),
  );
  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
