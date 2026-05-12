import type { NextRequest } from "next/server";
import { buildResourceIndex } from "@/lib/api/resources";
import { jsonResponse, optionsResponse } from "@/lib/api/response";
import { guard } from "@/lib/api/guard";

export const runtime = "nodejs";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(req: NextRequest) {
  const g = guard(req);
  if (!g.ok) return g.response;
  const index = buildResourceIndex();
  return jsonResponse(index, { extraHeaders: g.headers });
}
