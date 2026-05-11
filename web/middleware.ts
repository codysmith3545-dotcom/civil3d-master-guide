import { NextRequest, NextResponse } from "next/server";
import { check, clientIp } from "@/lib/rate-limit";

/**
 * Edge middleware that applies IP-keyed sliding-window rate limiting to the
 * write-heavy / cost-heavy API surface. Limits land before any handler runs,
 * which also means before any LLM token is spent.
 *
 * Buckets:
 *   - `chat`   30 req/min — `/api/chat`
 *   - `vision` 10 req/min — `/api/deed-decode` (AI vision)
 *   - `raw`    60 req/min — `/api/raw/*` (cheap but worth limiting)
 *   - `projects` 60 req/min — `/api/projects/*` (writes to storage)
 */
type Rule = { bucket: string; limit: number; windowMs: number };

function ruleFor(pathname: string): Rule | null {
  if (pathname === "/api/chat" || pathname.startsWith("/api/chat/")) {
    return { bucket: "chat", limit: 30, windowMs: 60_000 };
  }
  if (
    pathname === "/api/deed-decode" ||
    pathname.startsWith("/api/deed-decode/")
  ) {
    return { bucket: "vision", limit: 10, windowMs: 60_000 };
  }
  if (pathname.startsWith("/api/raw/")) {
    return { bucket: "raw", limit: 60, windowMs: 60_000 };
  }
  if (pathname.startsWith("/api/projects")) {
    return { bucket: "projects", limit: 60, windowMs: 60_000 };
  }
  return null;
}

export function middleware(req: NextRequest) {
  const rule = ruleFor(req.nextUrl.pathname);
  if (!rule) return NextResponse.next();

  const ip = clientIp(req);
  const result = check(rule.bucket, ip, {
    limit: rule.limit,
    windowMs: rule.windowMs,
  });

  if (!result.ok) {
    const retryAfter = Math.max(
      1,
      Math.ceil((result.resetAt - Date.now()) / 1000),
    );
    return new NextResponse(
      JSON.stringify({
        message:
          "Rate limit exceeded. Please slow down and retry shortly.",
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          "content-type": "application/json",
          "retry-after": String(retryAfter),
          "x-ratelimit-limit": String(rule.limit),
          "x-ratelimit-remaining": "0",
          "x-ratelimit-reset": String(Math.ceil(result.resetAt / 1000)),
        },
      },
    );
  }

  const res = NextResponse.next();
  res.headers.set("x-ratelimit-limit", String(rule.limit));
  res.headers.set("x-ratelimit-remaining", String(result.remaining));
  res.headers.set("x-ratelimit-reset", String(Math.ceil(result.resetAt / 1000)));
  return res;
}

export const config = {
  matcher: [
    "/api/chat/:path*",
    "/api/chat",
    "/api/deed-decode/:path*",
    "/api/deed-decode",
    "/api/raw/:path*",
    "/api/projects/:path*",
    "/api/projects",
  ],
};
