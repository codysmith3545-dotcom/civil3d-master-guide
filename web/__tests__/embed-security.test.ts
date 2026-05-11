/**
 * Embed security tests.
 *
 * Runs under `node --test` (or any compatible test runner) without
 * needing the dev server to be running. Two kinds of checks:
 *
 *  1. Allow-list integrity — every advertised slug exists, unknown
 *     slugs are rejected.
 *  2. Header policy — the headers() entries in next.config.mjs
 *     produce a CSP for /embed/* and remove X-Frame-Options for
 *     /embed/* while leaving it in place for everything else.
 *
 * The header check parses the next config rather than booting Next,
 * so it stays fast and offline.
 */

import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import {
  EMBED_CALCULATORS,
  EMBED_CALCULATOR_SLUGS,
  isEmbeddableCalculator,
} from "../lib/embed-calculators";
import {
  buildEmbedCspHeader,
  getEmbedFrameAncestors,
} from "../lib/config";

// Match the routes that exist under web/app/tools/<slug>/page.tsx.
const EXPECTED_SLUGS = [
  "vertical-curve",
  "horizontal-curve",
  "rational-method",
  "mannings",
  "inverse",
  "bearing-bearing-intersection",
  "bearing-distance-intersection",
  "distance-distance-intersection",
  "traverse-closure",
  "metes-and-bounds",
  "area-by-coordinates",
  "curve-stakeout",
  "level-loop",
  "trig-leveling",
  "solar-observation",
  "grid-to-ground",
  "state-plane-indiana",
];

describe("embed allow-list", () => {
  it("contains exactly the 17 expected calculators", () => {
    assert.equal(EMBED_CALCULATORS.length, 17);
    assert.equal(EXPECTED_SLUGS.length, 17);
    for (const slug of EXPECTED_SLUGS) {
      assert.ok(
        isEmbeddableCalculator(slug),
        `expected ${slug} to be on the embed allow-list`,
      );
    }
  });

  it("rejects unknown slugs (would yield 404 in the embed route)", () => {
    for (const bad of [
      "../../../etc/passwd",
      "..",
      "totally-made-up",
      "",
      "TRAVERSE-CLOSURE", // case-sensitive
      "traverse_closure", // underscore vs hyphen
    ]) {
      assert.equal(
        isEmbeddableCalculator(bad),
        false,
        `expected ${JSON.stringify(bad)} to be rejected`,
      );
    }
  });

  it("has no duplicate slugs", () => {
    assert.equal(
      new Set(EMBED_CALCULATOR_SLUGS).size,
      EMBED_CALCULATOR_SLUGS.length,
    );
  });
});

describe("CSP frame-ancestors", () => {
  it("defaults to 'self' only when env is unset", () => {
    const prev = process.env.EMBED_ALLOWED_FRAME_ANCESTORS;
    delete process.env.EMBED_ALLOWED_FRAME_ANCESTORS;
    try {
      assert.deepEqual(getEmbedFrameAncestors(), ["'self'"]);
      assert.equal(buildEmbedCspHeader(), "frame-ancestors 'self';");
    } finally {
      if (prev !== undefined) process.env.EMBED_ALLOWED_FRAME_ANCESTORS = prev;
    }
  });

  it("includes additional origins from the env var", () => {
    const prev = process.env.EMBED_ALLOWED_FRAME_ANCESTORS;
    process.env.EMBED_ALLOWED_FRAME_ANCESTORS =
      "https://example.edu  https://*.example.edu";
    try {
      const ancestors = getEmbedFrameAncestors();
      assert.ok(ancestors.includes("'self'"));
      assert.ok(ancestors.includes("https://example.edu"));
      assert.ok(ancestors.includes("https://*.example.edu"));
      const header = buildEmbedCspHeader();
      assert.match(header, /^frame-ancestors /);
      assert.match(header, /'self'/);
      assert.match(header, /https:\/\/example\.edu/);
    } finally {
      if (prev === undefined) delete process.env.EMBED_ALLOWED_FRAME_ANCESTORS;
      else process.env.EMBED_ALLOWED_FRAME_ANCESTORS = prev;
    }
  });
});

describe("next.config headers", () => {
  it("emits CSP on /embed/* and X-Frame-Options elsewhere", async () => {
    // Import the actual config and run its headers() function.
    const mod = (await import("../next.config.mjs")) as {
      default: {
        headers?: () => Promise<
          Array<{
            source: string;
            headers: Array<{ key: string; value: string }>;
          }>
        >;
      };
    };
    assert.ok(mod.default.headers, "next config must define headers()");
    const rules = await mod.default.headers!();
    const embedRule = rules.find((r) => r.source.startsWith("/embed"));
    assert.ok(embedRule, "expected a /embed/* headers rule");
    const csp = embedRule!.headers.find(
      (h) => h.key === "Content-Security-Policy",
    );
    assert.ok(csp, "embed rule must set Content-Security-Policy");
    assert.match(csp!.value, /frame-ancestors/);
    // X-Frame-Options must NOT be set on /embed/* (otherwise browsers
    // ignore the CSP and refuse to frame).
    const xfo = embedRule!.headers.find((h) => h.key === "X-Frame-Options");
    assert.equal(
      xfo,
      undefined,
      "X-Frame-Options must not be set on /embed/*",
    );

    const siteRule = rules.find(
      (r) => r.source !== embedRule!.source && /:path/.test(r.source),
    );
    assert.ok(siteRule, "expected a site-wide headers rule");
    const siteXfo = siteRule!.headers.find(
      (h) => h.key === "X-Frame-Options",
    );
    assert.ok(siteXfo, "site-wide rule must set X-Frame-Options");
    assert.equal(siteXfo!.value, "SAMEORIGIN");
    // And the site-wide rule's source pattern must exclude /embed/*.
    assert.match(siteRule!.source, /embed/);
  });
});
