/**
 * Vitest-style unit tests for the jurisdictions library.
 *
 * No test runner is currently wired up in the workspace; these tests
 * are written against `vitest` so they can be picked up the moment
 * Vitest is added to `web/`. They import only from `../jurisdictions`
 * (and not from `next/server` or `fs`) so they can run in a plain
 * Node environment.
 */
import { describe, it, expect } from "vitest";
import {
  boundsArea,
  diffJurisdictions,
  isValidLatLng,
  jurisdictionAt,
  parseLatLng,
  pointInBounds,
  type JurisdictionPage,
} from "../jurisdictions-types";

const indiana: JurisdictionPage = makeJurisdiction({
  slug: "indiana",
  breadcrumb: ["Indiana"],
  level: "county",
  bounds: { minLat: 37.7, minLng: -88.1, maxLat: 41.8, maxLng: -84.7 },
});

const hamiltonCounty: JurisdictionPage = makeJurisdiction({
  slug: "indiana/hamilton-county",
  breadcrumb: ["Indiana", "Hamilton County"],
  level: "county",
  bounds: { minLat: 39.927, minLng: -86.246, maxLat: 40.193, maxLng: -85.823 },
  fm: {
    setbacks: { front_ft: 35, side_ft: 8, rear_ft: 25 },
    stormwater_thresholds: { detention_trigger_sqft: 20000 },
    recording_requirements: { paper_size: "24x36" },
    plat_requirements: [{ label: "Surveyor signature" }],
  },
});

const carmel: JurisdictionPage = makeJurisdiction({
  slug: "indiana/hamilton-county/municipalities/carmel",
  breadcrumb: ["Indiana", "Hamilton County", "Carmel"],
  level: "municipality",
  bounds: { minLat: 39.927, minLng: -86.247, maxLat: 40.030, maxLng: -86.025 },
  fm: {
    setbacks: { front_ft: 25, side_ft: 6, rear_ft: 25 },
    stormwater_thresholds: { detention_trigger_sqft: 10000 },
    recording_requirements: { paper_size: "24x36" },
    plat_requirements: [
      { label: "Surveyor signature" },
      { label: "City engineer signature" },
    ],
  },
});

const pool = [indiana, hamiltonCounty, carmel];

describe("pointInBounds", () => {
  it("returns true when the point is inside", () => {
    expect(
      pointInBounds(39.9784, -86.118, carmel.bounds!),
    ).toBe(true);
  });

  it("returns false when the point is outside", () => {
    expect(
      pointInBounds(41.5, -86.0, carmel.bounds!),
    ).toBe(false);
  });

  it("is inclusive on the edges", () => {
    expect(
      pointInBounds(carmel.bounds!.minLat, carmel.bounds!.minLng, carmel.bounds!),
    ).toBe(true);
  });
});

describe("boundsArea", () => {
  it("computes lat*lng for a box", () => {
    expect(boundsArea({ minLat: 0, minLng: 0, maxLat: 1, maxLng: 2 })).toBe(2);
  });
  it("clamps negative-size boxes to zero", () => {
    expect(boundsArea({ minLat: 1, minLng: 0, maxLat: 0, maxLng: 2 })).toBe(0);
  });
});

describe("jurisdictionAt", () => {
  it("picks the most-specific containing jurisdiction", () => {
    const { best, containing } = jurisdictionAt(39.9784, -86.118, pool);
    expect(best?.jurisdictionSlug).toBe(
      "indiana/hamilton-county/municipalities/carmel",
    );
    // All three should be in `containing` because their boxes nest.
    const slugs = containing.map((j) => j.jurisdictionSlug).sort();
    expect(slugs).toContain("indiana/hamilton-county");
    expect(slugs).toContain(
      "indiana/hamilton-county/municipalities/carmel",
    );
  });

  it("falls back to the county when the point is outside any city", () => {
    // a Hamilton-County-only spot (Westfield-ish, but outside our Carmel box)
    const { best } = jurisdictionAt(40.18, -85.95, pool);
    expect(best?.jurisdictionSlug).toBe("indiana/hamilton-county");
  });

  it("returns null when no jurisdiction matches", () => {
    const { best, containing } = jurisdictionAt(0, 0, pool);
    expect(best).toBeNull();
    expect(containing).toHaveLength(0);
  });
});

describe("isValidLatLng / parseLatLng", () => {
  it("accepts valid numbers", () => {
    expect(isValidLatLng(39.97, -86.12)).toBe(true);
  });
  it("rejects out-of-range values", () => {
    expect(isValidLatLng(95, 0)).toBe(false);
    expect(isValidLatLng(0, 181)).toBe(false);
  });
  it("rejects non-numbers", () => {
    expect(isValidLatLng("39" as unknown, -86)).toBe(false);
  });
  it("parseLatLng parses strings", () => {
    expect(parseLatLng("39.9784", "-86.118")).toEqual({
      lat: 39.9784,
      lng: -86.118,
    });
    expect(parseLatLng("not", "a-number")).toBeNull();
  });
});

describe("diffJurisdictions", () => {
  it("lists every field that differs", () => {
    const rows = diffJurisdictions(hamiltonCounty, carmel);
    const keys = rows.map((r) => r.key);
    expect(keys).toContain("setbacks.front_ft");
    expect(keys).toContain("setbacks.side_ft");
    expect(keys).toContain("stormwater.detention_trigger_sqft");
    expect(keys).toContain("plat_requirements.count");
    expect(keys).not.toContain("recording.paper_size"); // matches
  });

  it("returns no rows when frontmatter is empty on both sides", () => {
    const empty = makeJurisdiction({
      slug: "indiana/empty-a",
      breadcrumb: ["Indiana", "Empty A"],
      level: "county",
    });
    const empty2 = makeJurisdiction({
      slug: "indiana/empty-b",
      breadcrumb: ["Indiana", "Empty B"],
      level: "county",
    });
    expect(diffJurisdictions(empty, empty2)).toHaveLength(0);
  });
});

// ---- helpers --------------------------------------------------------------

function makeJurisdiction(args: {
  slug: string;
  breadcrumb: string[];
  level: JurisdictionPage["level"];
  bounds?: JurisdictionPage["bounds"];
  fm?: Partial<JurisdictionPage["fm"]>;
}): JurisdictionPage {
  return {
    slug: `jurisdictions/${args.slug}/index`,
    href: `/docs/jurisdictions/${args.slug}`,
    filePath: `/fake/${args.slug}/index.md`,
    frontmatter: (args.fm ?? {}) as JurisdictionPage["frontmatter"],
    body: "",
    jurisdictionSlug: args.slug,
    breadcrumb: args.breadcrumb,
    level: args.level,
    bounds: args.bounds,
    fm: (args.fm ?? {}) as JurisdictionPage["fm"],
  };
}
