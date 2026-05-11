import type { NextRequest } from "next/server";
import { searchKb } from "@/lib/api/search";
import { jsonResponse, errorResponse, optionsResponse } from "@/lib/api/response";
import { guard } from "@/lib/api/guard";

export const runtime = "nodejs";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(req: NextRequest) {
  const g = guard(req);
  if (!g.ok) return g.response;

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (!q) {
    return errorResponse("invalid_input", "Query parameter `q` is required", 400, g.headers);
  }
  const limitRaw = searchParams.get("limit");
  let limit = 10;
  if (limitRaw !== null) {
    const n = Number(limitRaw);
    if (!Number.isFinite(n) || n < 1 || n > 50 || !Number.isInteger(n)) {
      return errorResponse(
        "invalid_input",
        "`limit` must be an integer between 1 and 50",
        400,
        g.headers,
      );
    }
    limit = n;
  }
  const hits = searchKb(q, limit);
  return jsonResponse(
    { query: q, count: hits.length, hits },
    { extraHeaders: g.headers },
  );
}
