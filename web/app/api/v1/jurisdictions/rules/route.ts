import type { NextRequest } from "next/server";
import {
  findJurisdictionAt,
  getJurisdictionRulesBySlug,
} from "@/lib/api/jurisdictions";
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
  const slugRaw = searchParams.get("slug")?.trim() || null;
  const latRaw = searchParams.get("lat");
  const lngRaw = searchParams.get("lng");

  let slug = slugRaw;
  if (!slug && latRaw !== null && lngRaw !== null) {
    const lat = Number(latRaw);
    const lng = Number(lngRaw);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      return errorResponse("invalid_input", "`lat` is invalid", 400, g.headers);
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      return errorResponse("invalid_input", "`lng` is invalid", 400, g.headers);
    }
    const hit = findJurisdictionAt(lat, lng);
    if (!hit.match) {
      return jsonResponse(
        {
          query: { lat, lng },
          match: null,
          hint: hit.hint,
          rules: null,
        },
        { extraHeaders: g.headers },
      );
    }
    // Map the match to a rule-lookup slug (drop the "/index" suffix).
    slug = hit.match.slug.replace(/\/index$/, "");
  }
  if (!slug) {
    return errorResponse(
      "invalid_input",
      "Provide either `slug` or both `lat` and `lng` query parameters.",
      400,
      g.headers,
    );
  }

  const result = getJurisdictionRulesBySlug(slug);
  if (!result) {
    return errorResponse("not_found", `Jurisdiction not found: ${slug}`, 404, g.headers);
  }
  return jsonResponse(
    { slug: result.slug, rules: result.rules, sources: result.sources },
    { extraHeaders: g.headers },
  );
}
