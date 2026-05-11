/**
 * Glue that runs the rate limiter and turns a 429 into a structured error
 * response, returning either the unsuccessful response or a record of the
 * headers the handler should merge into its own response.
 */

import type { NextRequest } from "next/server";
import { checkRateLimit, rateLimitHeaders } from "./rate-limit";
import { errorResponse } from "./response";

export function guard(req: NextRequest | Request): { ok: true; headers: Record<string, string> } | { ok: false; response: Response } {
  const result = checkRateLimit(req);
  const headers = rateLimitHeaders(result);
  if (!result.ok) {
    return {
      ok: false,
      response: errorResponse(
        "rate_limited",
        "Rate limit exceeded. Try again in a moment, or supply an X-API-Key header.",
        429,
        headers,
      ),
    };
  }
  return { ok: true, headers };
}
