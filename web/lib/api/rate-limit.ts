/**
 * In-memory rate limiter for the public REST API.
 *
 * Caveats:
 *   - Per-process state. On serverless/multi-region deploys each instance
 *     enforces its own bucket; this is acceptable for v1 since the public
 *     API is read-only and abuse-resistant. Swap for KV/Redis when the
 *     deploy topology demands it.
 *   - 60 requests / minute / IP by default.
 *   - Requests carrying a valid `X-API-Key` header (matched against the
 *     comma-separated `PUBLIC_API_KEYS` env var) bypass the limit entirely.
 */

import type { NextRequest } from "next/server";

const WINDOW_MS = 60_000;
const DEFAULT_LIMIT = 60;

type Bucket = { resetAt: number; count: number };
const buckets = new Map<string, Bucket>();

function nowMs(): number {
  return Date.now();
}

function clientIp(req: NextRequest | Request): string {
  const headers =
    req instanceof Request ? req.headers : (req as NextRequest).headers;
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req as any).ip ?? "unknown";
}

function allowedKeys(): Set<string> {
  const raw = process.env.PUBLIC_API_KEYS ?? "";
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

function hasValidApiKey(req: NextRequest | Request): boolean {
  const headers =
    req instanceof Request ? req.headers : (req as NextRequest).headers;
  const key = headers.get("x-api-key");
  if (!key) return false;
  const ok = allowedKeys();
  if (ok.size === 0) return false;
  return ok.has(key.trim());
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
  bypass: boolean;
};

export function checkRateLimit(
  req: NextRequest | Request,
  limit = DEFAULT_LIMIT,
): RateLimitResult {
  if (hasValidApiKey(req)) {
    return { ok: true, remaining: -1, resetAt: 0, bypass: true };
  }
  const ip = clientIp(req);
  const now = nowMs();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + WINDOW_MS;
    buckets.set(ip, { resetAt, count: 1 });
    return { ok: true, remaining: limit - 1, resetAt, bypass: false };
  }
  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt, bypass: false };
  }
  bucket.count += 1;
  return {
    ok: true,
    remaining: limit - bucket.count,
    resetAt: bucket.resetAt,
    bypass: false,
  };
}

export function rateLimitHeaders(result: RateLimitResult, limit = DEFAULT_LIMIT): Record<string, string> {
  if (result.bypass) {
    return { "x-ratelimit-bypass": "api-key" };
  }
  const resetSec = Math.max(0, Math.ceil((result.resetAt - nowMs()) / 1000));
  return {
    "x-ratelimit-limit": String(limit),
    "x-ratelimit-remaining": String(Math.max(0, result.remaining)),
    "x-ratelimit-reset": String(resetSec),
  };
}

/** Reset internal state. For tests only. */
export function __resetRateLimit(): void {
  buckets.clear();
}
