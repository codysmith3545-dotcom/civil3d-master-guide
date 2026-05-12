/**
 * Verifies that scripts/build-offline-data.mjs produces a well-formed JSON
 * payload covering every Indiana county under content/jurisdictions/indiana.
 *
 * Runs the build script as a subprocess so we exercise the real entry point.
 *
 * Run with:  node --test web/__tests__/offline-data-build.test.mjs
 */

import { test, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const OUT = join(ROOT, "web/public/offline-data/jurisdictions.json");
const SRC = join(ROOT, "content/jurisdictions/indiana");

let payload;

before(() => {
  execFileSync("node", ["scripts/build-offline-data.mjs"], { cwd: ROOT });
  payload = JSON.parse(readFileSync(OUT, "utf8"));
});

test("produces a JSON file with state and counties", () => {
  assert.ok(payload.generatedAt, "generatedAt should be set");
  assert.ok(payload.state, "state should be present");
  assert.ok(Array.isArray(payload.counties));
  assert.ok(payload.counties.length >= 7, "at least 7 counties expected");
});

test("includes every county directory that has an index.md", () => {
  const expected = readdirSync(SRC)
    .filter((d) => {
      const p = join(SRC, d);
      return (
        statSync(p).isDirectory() &&
        d !== "state" &&
        existsSync(join(p, "index.md"))
      );
    })
    .sort();
  const actual = payload.counties.map((c) => c.slug).sort();
  assert.deepEqual(actual, expected);
});

test("attaches a sane GPS bounding box to known counties", () => {
  for (const slug of ["marion-county", "hamilton-county"]) {
    const c = payload.counties.find((x) => x.slug === slug);
    if (!c) continue;
    assert.ok(c.bounds, `bounds missing for ${slug}`);
    assert.equal(typeof c.bounds.west, "number");
    assert.equal(typeof c.bounds.south, "number");
    assert.ok(c.bounds.east > c.bounds.west);
    assert.ok(c.bounds.north > c.bounds.south);
  }
});

test("keeps the payload under 200 KB so it fits in the SW pre-cache", () => {
  const bytes = readFileSync(OUT).length;
  assert.ok(bytes < 200 * 1024, `payload is ${bytes} bytes`);
});

test("emits a rules object on every county (possibly empty)", () => {
  for (const c of payload.counties) {
    assert.ok(Object.prototype.hasOwnProperty.call(c, "rules"));
    assert.equal(typeof c.rules, "object");
  }
});
