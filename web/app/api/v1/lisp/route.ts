import type { NextRequest } from "next/server";
import { listLispRoutines } from "@/lib/api/lisp";
import { jsonResponse, optionsResponse } from "@/lib/api/response";
import { guard } from "@/lib/api/guard";

export const runtime = "nodejs";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(req: NextRequest) {
  const g = guard(req);
  if (!g.ok) return g.response;
  const items = listLispRoutines();
  return jsonResponse({ count: items.length, items }, { extraHeaders: g.headers });
}
