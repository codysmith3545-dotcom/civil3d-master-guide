/**
 * Shared response helpers for the public REST API at /api/v1/*.
 *
 * Concerns handled here:
 *   - Permissive CORS (the API is intentionally public read-only).
 *   - Cache-Control headers for GETs (default: 5 min public, 1 hr SWR).
 *   - A structured JSON error envelope so clients can branch on
 *     { error: { code, message } } without sniffing status codes alone.
 */

export type ApiErrorCode =
  | "invalid_input"
  | "not_found"
  | "rate_limited"
  | "internal";

const DEFAULT_CACHE = "public, max-age=300, stale-while-revalidate=3600";

function corsHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type, x-api-key",
    "access-control-max-age": "600",
    ...extra,
  };
}

export function jsonResponse(
  data: unknown,
  init: { status?: number; cache?: string | false; extraHeaders?: Record<string, string> } = {},
): Response {
  const headers: Record<string, string> = {
    "content-type": "application/json; charset=utf-8",
    ...corsHeaders(),
    ...(init.extraHeaders ?? {}),
  };
  if (init.cache === false) {
    headers["cache-control"] = "no-store";
  } else if (typeof init.cache === "string") {
    headers["cache-control"] = init.cache;
  } else if (init.status === undefined || init.status === 200) {
    headers["cache-control"] = DEFAULT_CACHE;
  } else {
    headers["cache-control"] = "no-store";
  }
  return new Response(JSON.stringify(data), {
    status: init.status ?? 200,
    headers,
  });
}

export function errorResponse(
  code: ApiErrorCode,
  message: string,
  status: number,
  extraHeaders: Record<string, string> = {},
): Response {
  return jsonResponse(
    { error: { code, message } },
    { status, cache: false, extraHeaders },
  );
}

export function optionsResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders({ "content-length": "0" }),
  });
}
