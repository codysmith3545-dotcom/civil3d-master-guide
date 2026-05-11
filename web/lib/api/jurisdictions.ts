/**
 * Jurisdiction helpers for the public REST API.
 *
 * Reads jurisdiction metadata from the same markdown files the web app
 * renders (no separate index). Mirrors logic in mcp-server's server.ts so
 * the two surfaces stay consistent.
 */

import { listAll } from "../content";
import type { Page } from "../content";

export type JurisdictionEntry = {
  state: string;
  county?: string;
  municipality?: string;
  title: string;
  path: string;
};

export type MunicipalityNode = { slug: string; title: string; path: string };
export type CountyNode = {
  slug: string;
  title: string;
  path: string;
  municipalities: MunicipalityNode[];
};
export type StateNode = {
  slug: string;
  title: string;
  path: string;
  counties: CountyNode[];
};
export type JurisdictionTree = {
  states: StateNode[];
  flat: JurisdictionEntry[];
};

function parseJurisdictionFromPath(
  rel: string,
  fm: Page["frontmatter"],
): JurisdictionEntry | null {
  const parts = rel.split("/");
  if (parts[0] !== "jurisdictions") return null;
  const state = parts[1];
  if (!state) return null;
  const entry: JurisdictionEntry = {
    state,
    title: typeof fm.title === "string" ? fm.title : rel,
    path: rel,
  };
  if (parts[2] && parts[2] !== "state") entry.county = parts[2];
  const muniIdx = parts.indexOf("municipalities");
  if (muniIdx >= 0 && parts[muniIdx + 1]) entry.municipality = parts[muniIdx + 1]!;
  // frontmatter overrides
  if (typeof fm["state"] === "string") entry.state = fm["state"] as string;
  if (typeof fm["county"] === "string") entry.county = fm["county"] as string;
  if (typeof fm["municipality"] === "string") entry.municipality = fm["municipality"] as string;
  return entry;
}

function relFromSlug(slug: string): string {
  // listAll() returns slugs like "jurisdictions/indiana/index"; we want
  // the markdown-style relative path used by MCP-style consumers.
  return slug.endsWith("/index") ? slug + ".md" : slug + ".md";
}

function isJurisdictionIndex(slug: string): boolean {
  return slug.startsWith("jurisdictions/") && slug.endsWith("/index");
}

export function listJurisdictionEntries(stateFilter?: string): JurisdictionEntry[] {
  const out: JurisdictionEntry[] = [];
  for (const p of listAll()) {
    if (!isJurisdictionIndex(p.slug)) continue;
    const rel = relFromSlug(p.slug);
    const e = parseJurisdictionFromPath(rel, p.frontmatter);
    if (!e) continue;
    if (stateFilter && e.state.toLowerCase() !== stateFilter.toLowerCase()) continue;
    out.push(e);
  }
  out.sort((a, b) => a.path.localeCompare(b.path));
  return out;
}

export function buildJurisdictionTree(flat: JurisdictionEntry[]): JurisdictionTree {
  const stateMap = new Map<string, StateNode>();
  const countyMap = new Map<string, CountyNode>();

  for (const j of flat) {
    if (j.municipality) continue;
    if (j.county) {
      const key = `${j.state}/${j.county}`;
      if (!countyMap.has(key)) {
        countyMap.set(key, {
          slug: j.county,
          title: j.title,
          path: j.path,
          municipalities: [],
        });
      }
    } else {
      if (!stateMap.has(j.state)) {
        stateMap.set(j.state, {
          slug: j.state,
          title: j.title,
          path: j.path,
          counties: [],
        });
      }
    }
  }

  for (const j of flat) {
    if (!stateMap.has(j.state)) {
      stateMap.set(j.state, {
        slug: j.state,
        title: j.state,
        path: `jurisdictions/${j.state}`,
        counties: [],
      });
    }
  }

  for (const j of flat) {
    if (!j.municipality || !j.county) continue;
    const key = `${j.state}/${j.county}`;
    if (!countyMap.has(key)) {
      countyMap.set(key, {
        slug: j.county,
        title: j.county,
        path: `jurisdictions/${j.state}/${j.county}`,
        municipalities: [],
      });
    }
    countyMap.get(key)!.municipalities.push({
      slug: j.municipality,
      title: j.title,
      path: j.path,
    });
  }

  for (const [key, county] of countyMap) {
    const stateSlug = key.split("/")[0]!;
    const state = stateMap.get(stateSlug);
    if (state) state.counties.push(county);
  }

  const states = Array.from(stateMap.values()).sort((a, b) => a.slug.localeCompare(b.slug));
  for (const s of states) {
    s.counties.sort((a, b) => a.slug.localeCompare(b.slug));
    for (const c of s.counties) {
      c.municipalities.sort((a, b) => a.slug.localeCompare(b.slug));
    }
  }
  return { states, flat };
}

// ---------------------------------------------------------------------------
// Point-in-bounds lookup
// ---------------------------------------------------------------------------

export type JurisdictionLevel = "state" | "county" | "municipality";

export type BoundedJurisdiction = {
  state: string;
  county?: string;
  municipality?: string;
  title: string;
  slug: string;
  path: string;
  bounds: [number, number, number, number];
  level: JurisdictionLevel;
};

function jurisdictionLevel(rel: string): JurisdictionLevel | null {
  if (!rel.startsWith("jurisdictions/")) return null;
  if (!rel.endsWith("/index.md")) return null;
  const parts = rel.split("/");
  if (parts.length === 3) return "state";
  if (parts.length === 4 && parts[2] === "state") return "state";
  if (parts.length === 4) return "county";
  if (parts.length === 6 && parts[3] === "municipalities") return "municipality";
  return null;
}

function pointInBounds(
  lat: number,
  lng: number,
  bounds: [number, number, number, number],
): boolean {
  const [minLng, minLat, maxLng, maxLat] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

function bboxArea(bounds: [number, number, number, number]): number {
  const [minLng, minLat, maxLng, maxLat] = bounds;
  return Math.abs(maxLng - minLng) * Math.abs(maxLat - minLat);
}

export function findJurisdictionAt(
  lat: number,
  lng: number,
): {
  match: BoundedJurisdiction | null;
  parents: BoundedJurisdiction[];
  hint?: string;
  candidatesEvaluated: number;
} {
  const candidates: BoundedJurisdiction[] = [];
  for (const p of listAll()) {
    if (!p.slug.startsWith("jurisdictions/")) continue;
    const rel = relFromSlug(p.slug);
    const level = jurisdictionLevel(rel);
    if (!level) continue;
    const fm = p.frontmatter as Record<string, unknown>;
    const bounds = fm["bounds"];
    if (!Array.isArray(bounds) || bounds.length !== 4) continue;
    if (!bounds.every((n) => typeof n === "number" && Number.isFinite(n))) continue;
    const j = parseJurisdictionFromPath(rel, p.frontmatter);
    if (!j) continue;
    const partsArr = rel.split("/");
    let county: string | undefined;
    let municipality: string | undefined;
    if (level === "county") county = partsArr[2];
    else if (level === "municipality") {
      county = partsArr[2];
      municipality = partsArr[4];
    }
    candidates.push({
      state: j.state,
      county: county ?? (typeof fm["county"] === "string" ? (fm["county"] as string) : undefined),
      municipality:
        municipality ??
        (typeof fm["municipality"] === "string" ? (fm["municipality"] as string) : undefined),
      title: j.title,
      slug: p.slug,
      path: rel,
      bounds: bounds as [number, number, number, number],
      level,
    });
  }

  if (candidates.length === 0) {
    return {
      match: null,
      parents: [],
      hint:
        "No jurisdictions in the knowledge base have `bounds` frontmatter. Add a [minLng, minLat, maxLng, maxLat] bbox to enable GPS lookup.",
      candidatesEvaluated: 0,
    };
  }

  const hits = candidates.filter((c) => pointInBounds(lat, lng, c.bounds));
  if (hits.length === 0) {
    return {
      match: null,
      parents: [],
      hint: `No jurisdiction with defined bounds contains the point (${lat}, ${lng}).`,
      candidatesEvaluated: candidates.length,
    };
  }

  const levelRank: Record<JurisdictionLevel, number> = {
    municipality: 3,
    county: 2,
    state: 1,
  };
  hits.sort((a, b) => {
    const r = levelRank[b.level] - levelRank[a.level];
    if (r !== 0) return r;
    return bboxArea(a.bounds) - bboxArea(b.bounds);
  });
  const match = hits[0]!;
  const parents: BoundedJurisdiction[] = [];
  for (const h of hits) {
    if (h === match) continue;
    if (h.state !== match.state) continue;
    if (match.county && h.county && h.county !== match.county) continue;
    parents.push(h);
  }
  parents.sort((a, b) => levelRank[a.level] - levelRank[b.level]);
  return { match, parents, candidatesEvaluated: candidates.length };
}

// ---------------------------------------------------------------------------
// Typed-rules cascade
// ---------------------------------------------------------------------------

export type JurisdictionRules = {
  submittal_checklist: unknown;
  setbacks: unknown;
  stormwater_thresholds: unknown;
  recording_requirements: unknown;
  plat_requirements: unknown;
};

const RULE_FIELDS: (keyof JurisdictionRules)[] = [
  "submittal_checklist",
  "setbacks",
  "stormwater_thresholds",
  "recording_requirements",
  "plat_requirements",
];

function ruleHierarchyForSlug(slug: string): string[] {
  // slug like "jurisdictions/indiana/hamilton-county/municipalities/carmel"
  // Build the chain narrow → broad as a list of jurisdiction index slugs.
  const cleaned = slug.replace(/^\/+|\/+$/g, "").replace(/\.md$/, "").replace(/\/index$/, "");
  const parts = cleaned.split("/");
  if (parts[0] !== "jurisdictions") return [];
  const chain: string[] = [];
  // municipality level
  const muniIdx = parts.indexOf("municipalities");
  if (muniIdx >= 0 && parts[muniIdx + 1]) {
    chain.push(parts.slice(0, muniIdx + 2).join("/"));
  }
  // county level
  if (parts.length >= 3 && parts[2] && parts[2] !== "state") {
    chain.push(parts.slice(0, 3).join("/"));
  }
  // state level
  if (parts.length >= 2) {
    chain.push(parts.slice(0, 2).join("/"));
  }
  return chain;
}

function pageForJurisdictionSlug(jurSlug: string): Page | null {
  const want = jurSlug + "/index";
  for (const p of listAll()) {
    if (p.slug === want) return p;
  }
  return null;
}

export function getJurisdictionRulesBySlug(slug: string): {
  slug: string;
  rules: Record<string, unknown>;
  sources: { field: string; from: string }[];
} | null {
  const chain = ruleHierarchyForSlug(slug);
  if (chain.length === 0) return null;
  const rules: Record<string, unknown> = {};
  const sources: { field: string; from: string }[] = [];
  let foundAny = false;
  for (const field of RULE_FIELDS) (rules as Record<string, unknown>)[field] = null;
  for (const jurSlug of chain) {
    const page = pageForJurisdictionSlug(jurSlug);
    if (!page) continue;
    foundAny = true;
    const fm = page.frontmatter as Record<string, unknown>;
    for (const field of RULE_FIELDS) {
      if (rules[field] === null && fm[field] !== undefined) {
        rules[field] = fm[field];
        sources.push({ field, from: jurSlug });
      }
    }
  }
  if (!foundAny) return null;
  return { slug: chain[0]!, rules, sources };
}
