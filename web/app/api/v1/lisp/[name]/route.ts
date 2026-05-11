import type { NextRequest } from "next/server";
import { getLispRoutine } from "@/lib/api/lisp";
import { jsonResponse, errorResponse, optionsResponse } from "@/lib/api/response";
import { guard } from "@/lib/api/guard";

export const runtime = "nodejs";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } },
) {
  const g = guard(req);
  if (!g.ok) return g.response;
  const name = decodeURIComponent(params.name);
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(name)) {
    return errorResponse("invalid_input", "Invalid routine name", 400, g.headers);
  }
  const routine = getLispRoutine(name);
  if (!routine) {
    return errorResponse("not_found", `LISP routine not found: ${name}`, 404, g.headers);
  }
  return jsonResponse(routine, { extraHeaders: g.headers });
}
