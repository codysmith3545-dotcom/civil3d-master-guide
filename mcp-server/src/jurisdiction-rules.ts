/**
 * Jurisdiction-rules helper for the MCP server side.
 *
 * Replicated (intentionally, to avoid a cross-package import) from
 * `web/lib/jurisdiction-rules.ts`. If you change one, change the other.
 *
 * Agent 5A-MCP may later add `get_jurisdiction_rules` as a top-level MCP
 * tool that wraps this same function. The project-context tool only needs
 * `getJurisdictionRules` here.
 */

export interface JurisdictionRulesResult {
  state: string;
  county?: string;
  municipality?: string;
  summary: string;
  contentRefs: string[];
  notes?: string[];
}

interface CountyBox {
  slug: string;
  name: string;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

const INDIANA_COUNTIES: CountyBox[] = [
  { slug: "marion-county",    name: "Marion County",    minLat: 39.63, maxLat: 39.93, minLng: -86.33, maxLng: -85.94 },
  { slug: "hamilton-county",  name: "Hamilton County",  minLat: 39.93, maxLat: 40.20, minLng: -86.27, maxLng: -85.81 },
  { slug: "hendricks-county", name: "Hendricks County", minLat: 39.62, maxLat: 39.95, minLng: -86.72, maxLng: -86.33 },
  { slug: "boone-county",     name: "Boone County",     minLat: 39.95, maxLat: 40.30, minLng: -86.70, maxLng: -86.27 },
  { slug: "hancock-county",   name: "Hancock County",   minLat: 39.69, maxLat: 39.99, minLng: -85.94, maxLng: -85.66 },
  { slug: "shelby-county",    name: "Shelby County",    minLat: 39.42, maxLat: 39.72, minLng: -86.04, maxLng: -85.62 },
  { slug: "johnson-county",   name: "Johnson County",   minLat: 39.40, maxLat: 39.67, minLng: -86.30, maxLng: -85.93 },
  { slug: "morgan-county",    name: "Morgan County",    minLat: 39.34, maxLat: 39.67, minLng: -86.62, maxLng: -86.22 },
];

const INDIANA_BOX = { minLat: 37.77, maxLat: 41.76, minLng: -88.10, maxLng: -84.78 };

function inBox(lat: number, lng: number, b: { minLat: number; maxLat: number; minLng: number; maxLng: number }): boolean {
  return lat >= b.minLat && lat <= b.maxLat && lng >= b.minLng && lng <= b.maxLng;
}

export function getJurisdictionRules(input: { lat: number; lng: number }): JurisdictionRulesResult | null {
  const { lat, lng } = input;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  if (!inBox(lat, lng, INDIANA_BOX)) {
    return {
      state: "unknown",
      summary:
        "Project location is outside the Indiana jurisdictional coverage in this knowledge base. " +
        "Defer to federal (AASHTO/ALTA/NCS) standards and the local agency for the project's actual state/county.",
      contentRefs: [],
      notes: ["Only Indiana (Marion + 7 surrounding counties) is mapped today."],
    };
  }

  const county = INDIANA_COUNTIES.find((c) => inBox(lat, lng, c));
  if (!county) {
    return {
      state: "indiana",
      summary:
        "Project is in Indiana but outside the 8-county metro coverage in this knowledge base. " +
        "Use the Indiana state page for state-level guidance (PE licensure, 811, state plane).",
      contentRefs: ["jurisdictions/indiana/index", "jurisdictions/indiana/state/state-plane-indiana"],
    };
  }

  return {
    state: "indiana",
    county: county.slug,
    summary:
      `Project centroid falls within ${county.name}, Indiana. ` +
      `Refer to the county page for stormwater, drainage, and survey-coordination requirements.`,
    contentRefs: [
      `jurisdictions/indiana/${county.slug}/index`,
      "jurisdictions/indiana/index",
      "jurisdictions/indiana/state/state-plane-indiana",
    ],
    notes: ["Bounding-box match is coarse — verify the actual municipality before submitting plans."],
  };
}

export function centroidOfGeoJSON(geo: unknown): { lat: number; lng: number } | null {
  const coords: Array<[number, number]> = [];
  walk(geo, coords);
  if (coords.length === 0) return null;
  let sx = 0;
  let sy = 0;
  for (const [x, y] of coords) {
    sx += x;
    sy += y;
  }
  return { lng: sx / coords.length, lat: sy / coords.length };
}

function walk(node: unknown, out: Array<[number, number]>): void {
  if (node == null) return;
  if (Array.isArray(node)) {
    if (node.length >= 2 && typeof node[0] === "number" && typeof node[1] === "number") {
      out.push([node[0], node[1]]);
      return;
    }
    for (const item of node) walk(item, out);
    return;
  }
  if (typeof node === "object") {
    const obj = node as Record<string, unknown>;
    if ("coordinates" in obj) walk(obj.coordinates, out);
    if ("geometry" in obj) walk(obj.geometry, out);
    if ("features" in obj) walk(obj.features, out);
  }
}
