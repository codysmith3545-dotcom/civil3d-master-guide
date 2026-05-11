import type { NextRequest } from "next/server";
import { decodeDeed } from "@/lib/api/decode-deed";
import { jsonResponse, errorResponse, optionsResponse } from "@/lib/api/response";
import { guard } from "@/lib/api/guard";

export const runtime = "nodejs";

const MAX_TEXT = 50_000;

export async function OPTIONS() {
  return optionsResponse();
}

export async function POST(req: NextRequest) {
  const g = guard(req);
  if (!g.ok) return g.response;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("invalid_input", "Body must be valid JSON", 400, g.headers);
  }
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    typeof (body as Record<string, unknown>)["text"] !== "string"
  ) {
    return errorResponse(
      "invalid_input",
      "Body must be an object with a `text` string field",
      400,
      g.headers,
    );
  }
  const text = (body as Record<string, unknown>)["text"] as string;
  if (text.length === 0) {
    return errorResponse("invalid_input", "`text` must not be empty", 400, g.headers);
  }
  if (text.length > MAX_TEXT) {
    return errorResponse(
      "invalid_input",
      `\`text\` exceeds the ${MAX_TEXT}-character limit`,
      400,
      g.headers,
    );
  }
  const result = decodeDeed(text);
  return jsonResponse(result, { cache: false, extraHeaders: g.headers });
}
