// Tiny in-memory sliding-window rate limiter, keyed by an arbitrary string
// (typically a client IP). Sufficient for a single-replica deployment.
//
// If/when the app needs to run multi-replica, swap this for a Redis-backed
// implementation — the call sites use only the public `consume` function.

interface Bucket {
  // Timestamps (ms) of recent requests, oldest first.
  hits: number[];
}

const BUCKETS: Map<string, Bucket> = new Map();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  limit: number;
  retryAfterSeconds: number;
}

/**
 * Consume one request slot for the given key.
 *
 * @param key      Stable identifier (e.g. IP + route).
 * @param limit    Max requests in the window.
 * @param windowMs Window size in milliseconds.
 */
export function consume(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;
  let bucket = BUCKETS.get(key);
  if (!bucket) {
    bucket = { hits: [] };
    BUCKETS.set(key, bucket);
  }
  // Drop expired hits.
  while (bucket.hits.length > 0 && bucket.hits[0] < cutoff) {
    bucket.hits.shift();
  }
  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0];
    const retry = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      ok: false,
      remaining: 0,
      limit,
      retryAfterSeconds: retry,
    };
  }
  bucket.hits.push(now);
  return {
    ok: true,
    remaining: limit - bucket.hits.length,
    limit,
    retryAfterSeconds: 0,
  };
}

/**
 * Best-effort client IP from common proxy headers, falling back to a
 * stable but coarse "unknown" key.
 */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
