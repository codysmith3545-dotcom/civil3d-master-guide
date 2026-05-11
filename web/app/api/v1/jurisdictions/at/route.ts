import type { NextRequest } from "next/server";
import { findJurisdictionAt } from "@/lib/api/jurisdictions";
import { jsonResponse, errorResponse, optionsResponse } from "@/lib/api/response";
import { guard } from "@/lib/api/guard";

export const runtime = "nodejs";

export async function OPTIONS() {
  return optionsResponse();
}

function parseDegrees(raw: string | null, label: string, min: number, max: number): number | string {
  if (raw === null) return `${label} is required`;
  const n = Number(raw);
  if (!Number.isFinite(n)) return `${label} must be a finite number`;
  if (n < min || n > max) return `${label} must be between ${min} and ${max}`;
  return n;
}

export async function GET(req: NextRequest) {
  const g = guard(req);
  if (!g.ok) return g.response;

  const { searchParams } = new URL(req.url);
  const lat = parseDegrees(searchParams.get("lat"), "lat", -90, 90);
  if (typeof lat === "string") return errorResponse("invalid_input", lat, 400, g.headers);
  const lng = parseDegrees(searchParams.get("lng"), "lng", -180, 180);
  if (typeof lng === "string") return errorResponse("invalid_input", lng, 400, g.headers);

  const result = findJurisdictionAt(lat, lng);
  return jsonResponse(
    {
      query: { lat, lng },
      match: result.match,
      parents: result.parents,
      hint: result.hint,
      candidatesEvaluated: result.candidatesEvaluated,
    },
    { extraHeaders: g.headers },
  );
}
