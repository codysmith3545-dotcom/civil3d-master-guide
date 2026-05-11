/**
 * Integration test for the Deed Decoder pipeline.
 *
 * Exercises the same path the web UI takes:
 *   sample-deed.txt -> parseDeedText -> plotTraverse
 * and asserts the result is sane. Uses the real workspace packages.
 */

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseDeedText } from "@civil3d-master-guide/deed-parser";
import { plotTraverse } from "@civil3d-master-guide/deed-plotter";

describe("Deed Decoder integration (sample-deed.txt)", () => {
  const fixturePath = join(
    __dirname,
    "..",
    "public",
    "fixtures",
    "sample-deed.txt",
  );
  const text = readFileSync(fixturePath, "utf8");

  it("parses the sample fixture and produces a closed traverse", () => {
    const parsed = parseDeedText(text);

    // At least 4 courses parsed.
    expect(parsed.courses.length).toBeGreaterThanOrEqual(4);

    const plotted = plotTraverse(parsed);

    // Same number of plotted courses as parsed.
    expect(plotted.courses.length).toBe(parsed.courses.length);

    // Precision ratio is finite OR infinite (perfect closure). Either way
    // it must be a real number (not NaN).
    expect(Number.isNaN(plotted.closure.precisionRatio)).toBe(false);

    // No anomalies more severe than 'warning'.
    const errorAnomalies = plotted.anomalies.filter(
      (a) => a.severity === "error",
    );
    expect(errorAnomalies).toEqual([]);

    // Positive area.
    expect(plotted.closure.areaSqFt).toBeGreaterThan(0);
    expect(plotted.closure.areaAcres).toBeGreaterThan(0);
  });
});
