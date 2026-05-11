import { describe, expect, it } from "vitest";
import { plotTraverse } from "../src/plot.js";
import { flagAnomalies } from "../src/anomalies.js";
import {
  underspecifiedCurve,
  inconsistentCurve,
  impossibleDistance,
  badClosure,
  ocrDirty,
  smallSquare,
} from "./fixtures/index.js";

function codes(plotted: { anomalies: { code: string }[] }): string[] {
  return plotted.anomalies.map((a) => a.code);
}

describe("anomaly codes", () => {
  it("MISSING_CURVE_ELEMENTS fires when curve has < 2 elements", () => {
    const p = plotTraverse(underspecifiedCurve);
    expect(codes(p)).toContain("MISSING_CURVE_ELEMENTS");
    const err = p.anomalies.find((a) => a.code === "MISSING_CURVE_ELEMENTS");
    expect(err?.severity).toBe("error");
  });

  it("INCONSISTENT_CURVE fires when over-specified curve disagrees", () => {
    const p = plotTraverse(inconsistentCurve);
    expect(codes(p)).toContain("INCONSISTENT_CURVE");
  });

  it("IMPOSSIBLE_DISTANCE fires on a zero-distance line", () => {
    const p = plotTraverse(impossibleDistance);
    expect(codes(p)).toContain("IMPOSSIBLE_DISTANCE");
  });

  it("GROSS_CLOSURE_ERROR fires on a 5-ft miss in a 400-ft traverse", () => {
    const p = plotTraverse(badClosure);
    expect(codes(p)).toContain("GROSS_CLOSURE_ERROR");
    const a = p.anomalies.find((x) => x.code === "GROSS_CLOSURE_ERROR");
    expect(a?.severity).toBe("warning");
  });

  it("does NOT fire GROSS_CLOSURE_ERROR on a perfect close", () => {
    const p = plotTraverse(smallSquare);
    expect(codes(p)).not.toContain("GROSS_CLOSURE_ERROR");
  });

  it("MANY_UNPARSED_TOKENS fires when parsed.unparsed > courses", () => {
    const p = plotTraverse(ocrDirty);
    expect(codes(p)).toContain("MANY_UNPARSED_TOKENS");
  });

  it("LARGE_BBOX fires when traverse exceeds 1 mile in either direction", () => {
    // Build a 2-mile square at the type level (without using fixtures).
    const tooBig = {
      courses: [
        {
          type: "line" as const,
          bearing: {
            raw: "N",
            quadrant: "NE" as const,
            degrees: 0,
            minutes: 0,
            seconds: 0,
            azimuthDeg: 0,
          },
          distanceFt: 10000,
          raw: "10000 ft N",
          index: 0,
        },
      ],
      unparsed: [],
      normalizedText: "",
    };
    const p = plotTraverse(tooBig);
    expect(codes(p)).toContain("LARGE_BBOX");
  });
});

describe("flagAnomalies stand-alone", () => {
  it("can be called independently on a plotted traverse", () => {
    const p = plotTraverse(smallSquare);
    const out = flagAnomalies(p);
    expect(Array.isArray(out)).toBe(true);
  });
});
