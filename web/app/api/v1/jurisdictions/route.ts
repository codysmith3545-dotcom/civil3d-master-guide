import type { NextRequest } from "next/server";
import { listJurisdictionEntries, buildJurisdictionTree } from "@/lib/api/jurisdictions";
import { jsonResponse, optionsResponse } from "@/lib/api/response";
import { guard } from "@/lib/api/guard";

export const runtime = "nodejs";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(req: NextRequest) {
  const g = guard(req);
  if (!g.ok) return g.response;
  const { searchParams } = new URL(req.url);
  const stateFilter = searchParams.get("state")?.trim() || undefined;
  const flat = listJurisdictionEntries(stateFilter);
  const tree = buildJurisdictionTree(flat);
  return jsonResponse(
    { states: tree.states, flat: tree.flat, count: tree.flat.length },
    { extraHeaders: g.headers },
  );
}
