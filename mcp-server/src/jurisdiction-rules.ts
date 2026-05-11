// jurisdiction-rules.ts
//
// Implements the get_jurisdiction_rules MCP tool.
//
// Two input modes:
//   1. slug:    explicit jurisdictions/... path → load that page.
//   2. lat/lng: walk all jurisdiction pages, find the most-specific page whose
//               frontmatter `bounds` (a [west, south, east, north] bbox) or
//               `polygon` (an ordered ring of [lng, lat] pairs) contains the
//               point. Most-specific = the longest matching hierarchy.
//
// For fields not present on the matched page, we cascade upward through the
// hierarchy (municipality → county → state) and return the first non-null
// match. Fields still missing after the cascade are returned as `null`.
//
// All typed payloads are defensive: every field is optional, and we coerce
// arrays/objects with `Array.isArray` / `typeof === "object"` guards. A page
// that has none of the typed fields will simply return nulls — no throws.

import {
  resolveKbRoot,
  loadAllPages,
  getPage,
  normalizeSlug,
  type PageRecord,
  type Frontmatter,
} from "./content.js";

// ---------------------------------------------------------------------------
// Typed payload shapes that 5A-Schema is adding to Frontmatter.
// We define them locally and read them defensively so this file works whether
// or not 5A-Schema has shipped.
// ---------------------------------------------------------------------------

export interface ChecklistItem {
  id?: string;
  label: string;
  required?: boolean;
  notes?: string;
  source?: string;
}

export interface JurisdictionSetbacks {
  // Free-form keyed structure: e.g. { residential: { front_ft: 25, side_ft: 6 } }
  [zoningOrUse: string]: unknown;
}

export interface StormwaterThresholds {
  disturbance_acres_trigger?: number;
  water_quality_volume_in?: number;
  detention_release_rate?: string;
  manual_title?: string;
  manual_url?: string;
  [k: string]: unknown;
}

export interface RecordingRequirements {
  recorder_office?: string;
  recorder_url?: string;
  fee_schedule_url?: string;
  margins?: string;
  signatures?: string[];
  [k: string]: unknown;
}

export interface PlatRequirement {
  id?: string;
  label: string;
  citation?: string;
  notes?: string;
}

export interface JurisdictionRulesInput {
  lat?: number;
  lng?: number;
  slug?: string;
}

export interface JurisdictionRulesResult {
  slug: string;
  title: string;
  hierarchy: string[];
  submittal_checklist: ChecklistItem[] | null;
  setbacks: JurisdictionSetbacks | null;
  stormwater_thresholds: StormwaterThresholds | null;
  recording_requirements: RecordingRequirements | null;
  plat_requirements: PlatRequirement[] | null;
  sources: { title?: string; url?: string; verified?: string }[];
}

// ---------------------------------------------------------------------------
// Hierarchy parsing
// ---------------------------------------------------------------------------

/**
 * Turn a jurisdiction page's relPath into an ordered hierarchy of slugs:
 *   jurisdictions/indiana/index.md                                            → ["indiana"]
 *   jurisdictions/indiana/hamilton-county/index.md                            → ["indiana", "hamilton-county"]
 *   jurisdictions/indiana/hamilton-county/municipalities/carmel/index.md      → ["indiana", "hamilton-county", "carmel"]
 *
 * Returns null for any path that does not live under jurisdictions/.
 */
export function hierarchyForRelPath(relPath: string): string[] | null {
  if (!relPath.startsWith("jurisdictions/")) return null;
  const parts = relPath.split("/");
  // parts[0] = "jurisdictions", parts[1] = state
  const out: string[] = [];
  const state = parts[1];
  if (!state) return null;
  out.push(state);
  // skip parts[2] === "state" (state-level pages share the state slug only)
  // skip when parts[2] is an .md filename rather than a directory (county dir)
  if (
    parts[2] &&
    parts[2] !== "state" &&
    !parts[2].toLowerCase().endsWith(".md")
  ) {
    out.push(parts[2]); // county
  }
  const muniIdx = parts.indexOf("municipalities");
  if (muniIdx >= 0 && parts[muniIdx + 1] && !parts[muniIdx + 1]!.toLowerCase().endsWith(".md")) {
    out.push(parts[muniIdx + 1]!);
  }
  return out;
}

/**
 * Return the canonical "index" page slug for a jurisdiction hierarchy.
 * E.g. ["indiana","hamilton-county","carmel"] →
 *      "jurisdictions/indiana/hamilton-county/municipalities/carmel"
 */
export function slugForHierarchy(hierarchy: string[]): string {
  const [state, county, muni] = hierarchy;
  if (!state) return "jurisdictions";
  let s = `jurisdictions/${state}`;
  if (county) s += `/${county}`;
  if (muni) s += `/municipalities/${muni}`;
  return s;
}

// ---------------------------------------------------------------------------
// Point-in-bounds matching
// ---------------------------------------------------------------------------

/**
 * Lightweight bounding-box test. `bounds` is [west, south, east, north].
 */
export function pointInBbox(lat: number, lng: number, bbox: unknown): boolean {
  if (!Array.isArray(bbox) || bbox.length !== 4) return false;
  const [w, s, e, n] = bbox as [unknown, unknown, unknown, unknown];
  if (
    typeof w !== "number" ||
    typeof s !== "number" ||
    typeof e !== "number" ||
    typeof n !== "number"
  ) {
    return false;
  }
  return lng >= w && lng <= e && lat >= s && lat <= n;
}

/**
 * Ray-casting point-in-polygon. Polygon is [[lng, lat], ...].
 * Auto-closing (last point need not equal first).
 */
export function pointInPolygon(lat: number, lng: number, polygon: unknown): boolean {
  if (!Array.isArray(polygon) || polygon.length < 3) return false;
  const ring: [number, number][] = [];
  for (const pt of polygon) {
    if (!Array.isArray(pt) || pt.length < 2) return false;
    const x = pt[0];
    const y = pt[1];
    if (typeof x !== "number" || typeof y !== "number") return false;
    ring.push([x, y]);
  }
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]!;
    const [xj, yj] = ring[j]!;
    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / ((yj - yi) || Number.EPSILON) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** Returns true if the page's frontmatter bounds/polygon contain (lat,lng). */
function pageContains(fm: Frontmatter, lat: number, lng: number): boolean {
  if (pointInBbox(lat, lng, fm.bounds)) return true;
  if (pointInBbox(lat, lng, fm.bbox)) return true;
  if (pointInPolygon(lat, lng, fm.polygon)) return true;
  return false;
}

// ---------------------------------------------------------------------------
// Defensive field extraction
// ---------------------------------------------------------------------------

function extractChecklist(fm: Frontmatter): ChecklistItem[] | null {
  const raw = (fm as Record<string, unknown>)["submittal_checklist"];
  if (!Array.isArray(raw)) return null;
  const items: ChecklistItem[] = [];
  for (const r of raw) {
    if (typeof r === "string") {
      items.push({ label: r });
    } else if (r && typeof r === "object") {
      const o = r as Record<string, unknown>;
      const label = typeof o.label === "string" ? o.label : typeof o.id === "string" ? o.id : null;
      if (!label) continue;
      const item: ChecklistItem = { label };
      if (typeof o.id === "string") item.id = o.id;
      if (typeof o.required === "boolean") item.required = o.required;
      if (typeof o.notes === "string") item.notes = o.notes;
      if (typeof o.source === "string") item.source = o.source;
      items.push(item);
    }
  }
  return items.length > 0 ? items : null;
}

function extractSetbacks(fm: Frontmatter): JurisdictionSetbacks | null {
  const raw = (fm as Record<string, unknown>)["setbacks"];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  return raw as JurisdictionSetbacks;
}

function extractStormwater(fm: Frontmatter): StormwaterThresholds | null {
  const raw = (fm as Record<string, unknown>)["stormwater_thresholds"];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  return raw as StormwaterThresholds;
}

function extractRecording(fm: Frontmatter): RecordingRequirements | null {
  const raw = (fm as Record<string, unknown>)["recording_requirements"];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  return raw as RecordingRequirements;
}

function extractPlatRequirements(fm: Frontmatter): PlatRequirement[] | null {
  const raw = (fm as Record<string, unknown>)["plat_requirements"];
  if (!Array.isArray(raw)) return null;
  const out: PlatRequirement[] = [];
  for (const r of raw) {
    if (typeof r === "string") {
      out.push({ label: r });
    } else if (r && typeof r === "object") {
      const o = r as Record<string, unknown>;
      const label = typeof o.label === "string" ? o.label : typeof o.id === "string" ? o.id : null;
      if (!label) continue;
      const item: PlatRequirement = { label };
      if (typeof o.id === "string") item.id = o.id;
      if (typeof o.citation === "string") item.citation = o.citation;
      if (typeof o.notes === "string") item.notes = o.notes;
      out.push(item);
    }
  }
  return out.length > 0 ? out : null;
}

// ---------------------------------------------------------------------------
// Hierarchy resolution & cascade
// ---------------------------------------------------------------------------

/**
 * Given a target hierarchy, return all "index" pages for it AND its ancestors
 * (e.g. for ["indiana","hamilton-county","carmel"] we return the carmel,
 * hamilton-county, and indiana index pages in *that order*: most-specific first).
 *
 * Pages that don't exist are skipped.
 */
async function pagesForHierarchy(root: string, hierarchy: string[]): Promise<PageRecord[]> {
  const slugs: string[] = [];
  for (let i = hierarchy.length; i >= 1; i--) {
    slugs.push(slugForHierarchy(hierarchy.slice(0, i)));
  }
  const out: PageRecord[] = [];
  for (const slug of slugs) {
    const p = await getPage(root, slug);
    if (p) out.push(p);
  }
  return out;
}

/**
 * Walk an ordered list of pages (most-specific first) and assemble a result by
 * pulling each field from the first page that has a non-null value.
 */
function cascadeFields(pages: PageRecord[]): Pick<
  JurisdictionRulesResult,
  | "submittal_checklist"
  | "setbacks"
  | "stormwater_thresholds"
  | "recording_requirements"
  | "plat_requirements"
> {
  let submittal: ChecklistItem[] | null = null;
  let setbacks: JurisdictionSetbacks | null = null;
  let stormwater: StormwaterThresholds | null = null;
  let recording: RecordingRequirements | null = null;
  let plat: PlatRequirement[] | null = null;

  for (const p of pages) {
    if (submittal === null) submittal = extractChecklist(p.frontmatter);
    if (setbacks === null) setbacks = extractSetbacks(p.frontmatter);
    if (stormwater === null) stormwater = extractStormwater(p.frontmatter);
    if (recording === null) recording = extractRecording(p.frontmatter);
    if (plat === null) plat = extractPlatRequirements(p.frontmatter);
    if (submittal && setbacks && stormwater && recording && plat) break;
  }

  return {
    submittal_checklist: submittal,
    setbacks: setbacks,
    stormwater_thresholds: stormwater,
    recording_requirements: recording,
    plat_requirements: plat,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Look up jurisdictional rules for an input (either by slug or by lat/lng).
 *
 * Returns null if no matching page is found.
 *
 * `root` is optional; if omitted, the KB root is auto-resolved (the normal
 * runtime path). Tests pass an explicit root pointing at a fixtures dir.
 */
export async function getJurisdictionRules(
  input: JurisdictionRulesInput,
  root?: string,
): Promise<JurisdictionRulesResult | null> {
  const kbRoot = root ?? (await resolveKbRoot());

  let primary: PageRecord | null = null;

  if (input.slug) {
    primary = await getPage(kbRoot, normalizeSlug(input.slug));
    if (!primary) return null;
    if (!primary.relPath.startsWith("jurisdictions/")) {
      // Not a jurisdiction page; we won't return rules for it.
      return null;
    }
  } else if (typeof input.lat === "number" && typeof input.lng === "number") {
    const { lat, lng } = input;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

    const pages = await loadAllPages(kbRoot);
    // Find the deepest hierarchy that contains the point.
    let bestPage: PageRecord | null = null;
    let bestDepth = -1;
    for (const p of pages) {
      if (!p.relPath.startsWith("jurisdictions/")) continue;
      if (!pageContains(p.frontmatter, lat, lng)) continue;
      const h = hierarchyForRelPath(p.relPath);
      if (!h) continue;
      if (h.length > bestDepth) {
        bestDepth = h.length;
        bestPage = p;
      }
    }
    primary = bestPage;
  } else {
    return null;
  }

  if (!primary) return null;

  const hierarchy = hierarchyForRelPath(primary.relPath) ?? [];
  const ancestorPages = await pagesForHierarchy(kbRoot, hierarchy);

  // Ensure the primary page is first in the cascade. (pagesForHierarchy already
  // returns most-specific-first, but the primary may be a non-index page in
  // some setups; guard against that.)
  const cascadePages: PageRecord[] = [];
  const seenSlugs = new Set<string>();
  for (const p of [primary, ...ancestorPages]) {
    if (seenSlugs.has(p.relPath)) continue;
    seenSlugs.add(p.relPath);
    cascadePages.push(p);
  }

  const fields = cascadeFields(cascadePages);

  return {
    slug: primary.slug,
    title: primary.title,
    hierarchy,
    ...fields,
    sources: primary.sources ?? [],
  };
}
