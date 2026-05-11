/**
 * Lightweight jurisdiction lookup used by the project-RAG layer.
 *
 * Given a lat/lng (typically the centroid of a project's bounds), return a
 * coarse jurisdiction summary. This intentionally avoids GIS libraries; it
 * is a simple county-centroid + bounding-box test for the 8 Indiana counties
 * the guide covers. If 5A-MCP later ships a real `getJurisdictionRules` in
 * `mcp-server/src/jurisdiction-rules.ts`, this can re-export from there.
 *
 * NOTE: This is a "best-effort" classifier — final jurisdictional review
 * still belongs to the engineer of record. The structured summary is fed
 * to the LLM as context, not used to make permitting decisions.
 */

export interface JurisdictionRulesResult {
  state: string;
  county?: string;
  municipality?: string;
  summary: string;
  contentRefs: string[]; // slugs under content/jurisdictions/...
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

// Bounding boxes are coarse (county-scale). These are not survey-grade; they
// are good enough to route a project to the right county content page.
const INDIANA_COUNTIES: CountyBox[] = [
  // Approximate envelopes — Indianapolis metro + surrounding 7 counties.
  { slug: "marion-county",    name: "Marion County",    minLat: 39.63, maxLat: 39.93, minLng: -86.33, maxLng: -85.94 },
  { slug: "hamilton-county",  name: "Hamilton County",  minLat: 39.93, maxLat: 40.20, minLng: -86.27, maxLng: -85.81 },
  { slug: "hendricks-county", name: "Hendricks County", minLat: 39.62, maxLat: 39.95, minLng: -86.72, maxLng: -86.33 },
  { slug: "boone-county",     name: "Boone County",     minLat: 39.95, maxLat: 40.30, minLng: -86.70, maxLng: -86.27 },
  { slug: "hancock-county",   name: "Hancock County",   minLat: 39.69, maxLat: 39.99, minLng: -85.94, maxLng: -85.66 },
  { slug: "shelby-county",    name: "Shelby County",    minLat: 39.42, maxLat: 39.72, minLng: -86.04, maxLng: -85.62 },
  { slug: "johnson-county",   name: "Johnson County",   minLat: 39.40, maxLat: 39.67, minLng: -86.30, maxLng: -85.93 },
  { slug: "morgan-county",    name: "Morgan County",    minLat: 39.34, maxLat: 39.67, minLng: -86.62, maxLng: -86.22 },
];

// Indiana state envelope (very coarse; just used to determine "is this Indiana?").
const INDIANA_BOX = {
  minLat: 37.77,
  maxLat: 41.76,
  minLng: -88.10,
  maxLng: -84.78,
};

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
      `Refer to the county page for stormwater, drainage, and survey-coordination requirements, ` +
      `then drill down to the specific municipality if the project is inside an incorporated area.`,
    contentRefs: [
      `jurisdictions/indiana/${county.slug}/index`,
      "jurisdictions/indiana/index",
      "jurisdictions/indiana/state/state-plane-indiana",
    ],
    notes: [
      "Bounding-box match is coarse — verify the actual municipality before submitting plans.",
    ],
  };
}

/**
 * Compute a rough centroid of a GeoJSON Polygon / MultiPolygon / Feature /
 * FeatureCollection. We do an arithmetic mean of vertex coordinates, which is
 * imperfect for non-convex polygons but is fine for routing a project to a
 * county-scale page.
 */
export function centroidOfGeoJSON(geo: unknown): { lat: number; lng: number } | null {
  const coords = collectCoords(geo);
  if (coords.length === 0) return null;
  let sx = 0;
  let sy = 0;
  for (const [x, y] of coords) {
    sx += x;
    sy += y;
  }
  // GeoJSON uses [lng, lat] order.
  return { lng: sx / coords.length, lat: sy / coords.length };
}

function collectCoords(node: unknown): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  walk(node, out);
  return out;
}

function walk(node: unknown, out: Array<[number, number]>): void {
  if (node == null) return;
  if (Array.isArray(node)) {
    // Leaf coordinate pair: [lng, lat] or [lng, lat, elev]
    if (
      node.length >= 2 &&
      typeof node[0] === "number" &&
      typeof node[1] === "number"
    ) {
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
