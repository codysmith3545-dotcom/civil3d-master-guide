// jurisdiction-rules.test.ts
//
// Tests for the get_jurisdiction_rules MCP tool. Uses the built-in
// `node:test` runner so no extra deps. Tests are written in TypeScript and
// compiled to dist-tests/ via the `pretest` step (see package.json).

import test from "node:test";
import assert from "node:assert/strict";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getJurisdictionRules,
  hierarchyForRelPath,
  pointInBbox,
  pointInPolygon,
} from "../src/jurisdiction-rules.js";
import { _resetCache } from "../src/content.js";
import { GetJurisdictionRulesInput } from "../src/schemas.js";

const here = path.dirname(fileURLToPath(import.meta.url));
// At runtime this file lives in mcp-server/dist-tests/tests/, so we walk up to
// the mcp-server package root and then into tests/fixtures/.
// fixtures KB root = mcp-server/tests/fixtures (contains a content/ subdir)
const FIXTURE_ROOT = path.resolve(here, "..", "..", "tests", "fixtures");

test("hierarchyForRelPath parses muni / county / state paths", () => {
  assert.deepEqual(hierarchyForRelPath("jurisdictions/indiana/index.md"), ["indiana"]);
  assert.deepEqual(
    hierarchyForRelPath("jurisdictions/indiana/hamilton-county/index.md"),
    ["indiana", "hamilton-county"],
  );
  assert.deepEqual(
    hierarchyForRelPath(
      "jurisdictions/indiana/hamilton-county/municipalities/carmel/index.md",
    ),
    ["indiana", "hamilton-county", "carmel"],
  );
  assert.equal(hierarchyForRelPath("civil3d/commands/index.md"), null);
});

test("pointInBbox accepts [w,s,e,n] tuples", () => {
  // Carmel-ish point
  assert.equal(pointInBbox(39.978, -86.118, [-86.2, 39.93, -86.03, 40.04]), true);
  // Point well outside
  assert.equal(pointInBbox(0, 0, [-86.2, 39.93, -86.03, 40.04]), false);
  // Malformed bbox
  assert.equal(pointInBbox(39.978, -86.118, "nope" as unknown), false);
  assert.equal(pointInBbox(39.978, -86.118, [1, 2, 3] as unknown), false);
});

test("pointInPolygon handles a simple square", () => {
  const square = [
    [-1, -1],
    [-1, 1],
    [1, 1],
    [1, -1],
  ];
  assert.equal(pointInPolygon(0, 0, square), true);
  assert.equal(pointInPolygon(2, 2, square), false);
});

test("getJurisdictionRules by slug returns the page's typed fields", async () => {
  _resetCache();
  const result = await getJurisdictionRules(
    { slug: "jurisdictions/indiana/hamilton-county/municipalities/carmel" },
    FIXTURE_ROOT,
  );
  assert.ok(result);
  assert.equal(result!.title, "Carmel");
  assert.deepEqual(result!.hierarchy, ["indiana", "hamilton-county", "carmel"]);
  assert.ok(result!.submittal_checklist);
  assert.equal(result!.submittal_checklist!.length, 2);
  assert.equal(result!.submittal_checklist![0]!.id, "swppp");
  // Stormwater is overridden by Carmel
  assert.equal(result!.stormwater_thresholds!.disturbance_acres_trigger, 0.5);
  // Setbacks cascade up to Hamilton County
  assert.ok(result!.setbacks);
  assert.equal(
    (result!.setbacks!.residential as { front_ft: number }).front_ft,
    30,
  );
  // Recording requirements cascade up to Indiana state
  assert.ok(result!.recording_requirements);
  assert.equal(result!.recording_requirements!.recorder_office, "County recorder");
  // Plat requirements cascade up to Indiana state
  assert.ok(result!.plat_requirements);
  assert.equal(result!.plat_requirements![0]!.id, "ic-36-2-11-13");
});

test("getJurisdictionRules by lat/lng resolves to the most-specific match (Carmel)", async () => {
  _resetCache();
  const result = await getJurisdictionRules(
    { lat: 39.978, lng: -86.118 },
    FIXTURE_ROOT,
  );
  assert.ok(result);
  assert.equal(result!.title, "Carmel");
  assert.deepEqual(result!.hierarchy, ["indiana", "hamilton-county", "carmel"]);
});

test("getJurisdictionRules cascades missing fields up to the county (Fishers)", async () => {
  _resetCache();
  const result = await getJurisdictionRules(
    { slug: "jurisdictions/indiana/hamilton-county/municipalities/fishers" },
    FIXTURE_ROOT,
  );
  assert.ok(result);
  assert.equal(result!.title, "Fishers");
  // Fishers has no setbacks → should cascade up to Hamilton County
  assert.ok(result!.setbacks);
  assert.equal(
    (result!.setbacks!.residential as { front_ft: number }).front_ft,
    30,
  );
  // Fishers has no stormwater_thresholds → should cascade up to Hamilton County
  assert.equal(
    result!.stormwater_thresholds!.disturbance_acres_trigger,
    1,
  );
  // Its own checklist should win
  assert.equal(result!.submittal_checklist!.length, 1);
});

test("getJurisdictionRules returns null for out-of-range lat/lng", async () => {
  _resetCache();
  const r1 = await getJurisdictionRules({ lat: 999, lng: 0 }, FIXTURE_ROOT);
  assert.equal(r1, null);
  // In-range coords but well outside all fixture bboxes
  const r2 = await getJurisdictionRules({ lat: 0, lng: 0 }, FIXTURE_ROOT);
  assert.equal(r2, null);
});

test("Zod schema rejects input missing both modes", () => {
  assert.throws(() => GetJurisdictionRulesInput.parse({}));
  // lat alone is not enough
  assert.throws(() => GetJurisdictionRulesInput.parse({ lat: 39.978 }));
  // Both lat+lng is enough
  assert.doesNotThrow(() =>
    GetJurisdictionRulesInput.parse({ lat: 39.978, lng: -86.118 }),
  );
  // slug alone is enough
  assert.doesNotThrow(() =>
    GetJurisdictionRulesInput.parse({ slug: "jurisdictions/indiana" }),
  );
});
