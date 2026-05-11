import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { parseDeedText } from "../src/parse.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = resolve(__dirname, "fixtures");

function loadFixture(name: string): string {
  return readFileSync(resolve(fixturesDir, name), "utf8");
}

interface FixtureExpect {
  filename: string;
  expectedCourses: number;
  expectedLines?: number;
  expectedCurves?: number;
  firstCourse?: {
    bearingAzimuthDeg?: number;
    distanceFt?: number;
  };
  unparsedAtLeast?: number;
}

const FIXTURES: FixtureExpect[] = [
  // ---- 5 simple all-line traverses ----
  {
    filename: "hamilton-residential-1.txt",
    expectedCourses: 4,
    expectedLines: 4,
    expectedCurves: 0,
    firstCourse: { bearingAzimuthDeg: 89.75, distanceFt: 150.0 },
  },
  {
    filename: "hamilton-residential-2.txt",
    expectedCourses: 4,
    expectedLines: 4,
    firstCourse: { bearingAzimuthDeg: 180 - 12.5, distanceFt: 250.0 },
  },
  {
    filename: "marion-lot-1.txt",
    expectedCourses: 5,
    expectedLines: 5,
    firstCourse: { bearingAzimuthDeg: 0, distanceFt: 100.0 },
  },
  {
    filename: "boone-rural-1.txt",
    expectedCourses: 4,
    expectedLines: 4,
    firstCourse: { bearingAzimuthDeg: 45 + 15 / 60 + 30 / 3600, distanceFt: 330.0 },
  },
  {
    filename: "hendricks-commercial-1.txt",
    expectedCourses: 4,
    expectedLines: 4,
    // S 02°15'00" W is in SW quadrant: 180 + 2.25 = 182.25.
    firstCourse: { bearingAzimuthDeg: 180 + (2 + 15 / 60), distanceFt: 425.5 },
  },

  // ---- 5 with curve calls ----
  {
    filename: "curve-cul-de-sac-1.txt",
    expectedCourses: 5,
    expectedCurves: 1,
  },
  {
    filename: "curve-road-frontage-1.txt",
    expectedCourses: 5,
    expectedCurves: 1,
  },
  {
    filename: "curve-double-1.txt",
    expectedCourses: 5,
    expectedCurves: 2,
  },
  {
    filename: "curve-radius-delta-1.txt",
    expectedCourses: 4,
    expectedCurves: 1,
  },
  {
    filename: "curve-tangent-1.txt",
    expectedCourses: 4,
    expectedCurves: 1,
  },

  // ---- 3 long ----
  { filename: "long-traverse-1.txt", expectedCourses: 16 },
  { filename: "long-traverse-2.txt", expectedCourses: 18 },
  { filename: "long-traverse-3.txt", expectedCourses: 15 },

  // ---- 3 ambiguous ----
  {
    filename: "ambiguous-missing-seconds.txt",
    expectedCourses: 4,
    expectedLines: 4,
    firstCourse: { bearingAzimuthDeg: 45.5, distanceFt: 200.0 },
  },
  {
    filename: "ambiguous-more-or-less.txt",
    expectedCourses: 4,
    expectedLines: 4,
  },
  {
    filename: "ambiguous-due-north.txt",
    expectedCourses: 4,
    expectedLines: 4,
    firstCourse: { bearingAzimuthDeg: 0, distanceFt: 660.0 },
  },

  // ---- 2 OCR ----
  {
    filename: "ocr-smart-quotes.txt",
    expectedCourses: 4,
    expectedLines: 4,
  },
  {
    // The spelled-out first course should NOT parse; we expect 3 parsed
    // courses plus the spelled-out clause logged to `unparsed`.
    filename: "ocr-spelled-out.txt",
    expectedCourses: 3,
    unparsedAtLeast: 1,
  },

  // ---- 2 edge ----
  {
    filename: "edge-exact-east.txt",
    expectedCourses: 4,
    firstCourse: { bearingAzimuthDeg: 90, distanceFt: 200.0 },
  },
  {
    filename: "edge-exact-south.txt",
    expectedCourses: 4,
    firstCourse: { bearingAzimuthDeg: 180, distanceFt: 660.0 },
  },
];

describe("parseDeedText - fixtures", () => {
  for (const fx of FIXTURES) {
    it(`${fx.filename}: parses expected number of courses`, () => {
      const raw = loadFixture(fx.filename);
      const result = parseDeedText(raw);
      expect(result.courses.length, fx.filename).toBe(fx.expectedCourses);
    });

    if (fx.expectedLines !== undefined) {
      it(`${fx.filename}: has ${fx.expectedLines} line course(s)`, () => {
        const raw = loadFixture(fx.filename);
        const result = parseDeedText(raw);
        const lines = result.courses.filter((c) => c.type === "line");
        expect(lines.length).toBe(fx.expectedLines);
      });
    }

    if (fx.expectedCurves !== undefined) {
      it(`${fx.filename}: has ${fx.expectedCurves} curve course(s)`, () => {
        const raw = loadFixture(fx.filename);
        const result = parseDeedText(raw);
        const curves = result.courses.filter((c) => c.type === "curve");
        expect(curves.length).toBe(fx.expectedCurves);
      });
    }

    if (fx.firstCourse) {
      const want = fx.firstCourse;
      it(`${fx.filename}: first course matches expected bearing/distance`, () => {
        const raw = loadFixture(fx.filename);
        const result = parseDeedText(raw);
        const first = result.courses[0];
        expect(first).toBeDefined();
        if (first.type !== "line") {
          throw new Error("expected first course to be a line");
        }
        if (want.bearingAzimuthDeg !== undefined) {
          expect(first.bearing.azimuthDeg).toBeCloseTo(
            want.bearingAzimuthDeg,
            4,
          );
        }
        if (want.distanceFt !== undefined) {
          expect(first.distanceFt).toBeCloseTo(want.distanceFt, 4);
        }
      });
    }

    if (fx.unparsedAtLeast !== undefined) {
      it(`${fx.filename}: at least ${fx.unparsedAtLeast} unparsed fragment(s)`, () => {
        const raw = loadFixture(fx.filename);
        const result = parseDeedText(raw);
        expect(result.unparsed.length).toBeGreaterThanOrEqual(
          fx.unparsedAtLeast!,
        );
      });
    }
  }
});

describe("parseDeedText - synthetic minimal input", () => {
  it("returns empty traverse for empty input", () => {
    const r = parseDeedText("");
    expect(r.courses).toEqual([]);
    expect(r.normalizedText).toBe("");
  });

  it("preserves course order", () => {
    const r = parseDeedText(
      "Beginning at a point; thence N 45°00'00\" E, 100.00 feet; thence S 45°00'00\" E, 50.00 feet; thence S 45°00'00\" W, 100.00 feet; thence N 45°00'00\" W, 50.00 feet to the point of beginning.",
    );
    expect(r.courses).toHaveLength(4);
    expect(r.courses[0].index).toBe(0);
    expect(r.courses[1].index).toBe(1);
    expect(r.courses[2].index).toBe(2);
    expect(r.courses[3].index).toBe(3);
  });

  it("logs spelled-out distance to unparsed when bearing is also spelled out", () => {
    const r = parseDeedText(
      "Beginning at a point; thence N forty-five degrees east one hundred feet to the point of beginning.",
    );
    // The bearing isn't parseable; the whole clause goes to unparsed.
    expect(r.courses).toHaveLength(0);
    expect(r.unparsed.length).toBeGreaterThan(0);
  });

  it("throws on non-string input", () => {
    // @ts-expect-error - testing runtime guard
    expect(() => parseDeedText(123)).toThrow();
  });

  it("returns normalizedText with smart quotes converted", () => {
    const r = parseDeedText(
      "thence N 45°00’00” E, 100.00 feet",
    );
    // Smart single-quote and smart double-quote should both be ASCII now.
    expect(r.normalizedText).not.toMatch(/[’”]/);
  });
});
