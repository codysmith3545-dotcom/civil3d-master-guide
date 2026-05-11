/**
 * Sliding-window, in-memory IP rate limiter. Adequate for a single-instance
 * deployment. For multi-instance setups this should be replaced with a
 * Redis-backed limiter, but the call sites here stay the same.
 *
 * NOTE: this module is intentionally framework-agnostic. The Next.js
 * middleware in `web/middleware.ts` wraps `check()` for HTTP requests.
 */

export interface RateLimitOptions {
  /** Max requests permitted within `windowMs`. */
  limit: number;
  /** Sliding-window size in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  /** Requests remaining in the current window for this key. */
  remaining: number;
  /** Epoch-millis at which the oldest tracked request will fall out. */
  resetAt: number;
}

// One bucket map per `bucketKey` (e.g. "chat", "vision"). Each bucket holds a
// per-IP sliding window of request timestamps.
const buckets = new Map<string, Map<string, number[]>>();

function getBucket(name: string): Map<string, number[]> {
  let b = buckets.get(name);
  if (!b) {
    b = new Map();
    buckets.set(name, b);
  }
  return b;
}

/** Reset all rate-limit state. Intended for tests. */
export function _resetRateLimit(): void {
  buckets.clear();
}

/**
 * Check whether `key` (typically a client IP) may make another request under
 * the supplied limit. Records the attempt when `ok` is true. Returns a
 * `RateLimitResult` either way.
 */
export function check(
  bucketKey: string,
  key: string,
  opts: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - opts.windowMs;
  const bucket = getBucket(bucketKey);
  let timestamps = bucket.get(key);
  if (!timestamps) {
    timestamps = [];
    bucket.set(key, timestamps);
  }
  // Drop expired entries from the head of the array.
  while (timestamps.length > 0 && timestamps[0] <= cutoff) {
    timestamps.shift();
  }

  if (timestamps.length >= opts.limit) {
    const resetAt = (timestamps[0] ?? now) + opts.windowMs;
    return { ok: false, remaining: 0, resetAt };
  }
  timestamps.push(now);
  return {
    ok: true,
    remaining: Math.max(0, opts.limit - timestamps.length),
    resetAt: now + opts.windowMs,
  };
}

/**
 * Extract a best-effort client IP from a Next.js `Request`. Prefers
 * `x-forwarded-for` (first hop) and falls back to `x-real-ip`, then `req.ip`.
 */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const xrip = req.headers.get("x-real-ip");
  if (xrip) return xrip;
  // `NextRequest` exposes `.ip` but the value is not part of the standard
  // Request type. Try to read it defensively.
  const maybeIp = (req as unknown as { ip?: string }).ip;
  if (maybeIp) return maybeIp;
  return "unknown";
}
