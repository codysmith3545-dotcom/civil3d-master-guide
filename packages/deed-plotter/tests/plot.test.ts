import { describe, expect, it } from "vitest";
import { plotTraverse } from "../src/plot.js";
import {
  smallSquare,
  rightTriangle,
  oneMileSquare,
  badClosure,
  curveHeavy,
} from "./fixtures/index.js";

describe("plotTraverse: line-only traverses", () => {
  it("closes a perfect square exactly", () => {
    const p = plotTraverse(smallSquare);
    expect(p.courses).toHaveLength(4);
    expect(p.closure.closureErrorN).toBeCloseTo(0, 6);
    expect(p.closure.closureErrorE).toBeCloseTo(0, 6);
    expect(p.closure.linearClosureFt).toBeCloseTo(0, 6);
    expect(p.closure.precisionRatio).toBe(Infinity);
  });

  it("computes the perimeter of a square as 400 ft", () => {
    const p = plotTraverse(smallSquare);
    expect(p.closure.perimeterFt).toBeCloseTo(400, 6);
  });

  it("computes area of a 100x100 square as 10000 sqft", () => {
    const p = plotTraverse(smallSquare);
    expect(p.closure.areaSqFt).toBeCloseTo(10000, 3);
    expect(p.closure.areaAcres).toBeCloseTo(10000 / 43560, 6);
  });

  it("computes area of a 3-4-5 right triangle as 60000 sqft", () => {
    const p = plotTraverse(rightTriangle);
    expect(p.closure.areaSqFt).toBeCloseTo(60000, 1);
  });

  it("traverses each square vertex correctly (clockwise from origin)", () => {
    const p = plotTraverse(smallSquare);
    expect(p.courses[0].start).toEqual({ n: 0, e: 0 });
    expect(p.courses[0].end.n).toBeCloseTo(100, 6);
    expect(p.courses[0].end.e).toBeCloseTo(0, 6);
    expect(p.courses[1].end.n).toBeCloseTo(100, 6);
    expect(p.courses[1].end.e).toBeCloseTo(100, 6);
    expect(p.courses[2].end.n).toBeCloseTo(0, 6);
    expect(p.courses[2].end.e).toBeCloseTo(100, 6);
    expect(p.courses[3].end.n).toBeCloseTo(0, 6);
    expect(p.courses[3].end.e).toBeCloseTo(0, 6);
  });

  it("respects a non-default start point", () => {
    const p = plotTraverse(smallSquare, { n: 1000, e: 2000 });
    expect(p.courses[0].start).toEqual({ n: 1000, e: 2000 });
    expect(p.courses[2].end.n).toBeCloseTo(1000, 6);
    expect(p.courses[2].end.e).toBeCloseTo(2100, 6);
  });

  it("plots a one-mile traverse correctly", () => {
    const p = plotTraverse(oneMileSquare);
    expect(p.courses[1].end.n).toBeCloseTo(5280, 3);
    expect(p.courses[1].end.e).toBeCloseTo(5280, 3);
    // Big-bbox info should fire on a 1-mi parcel (span = 5280 ≤ 5280, not exceeded).
    // The fixture is exactly 1 mile so LARGE_BBOX should NOT fire (uses >).
    expect(p.anomalies.find((a) => a.code === "LARGE_BBOX")).toBeUndefined();
  });

  it("detects bad closure on a square missing 5 ft", () => {
    const p = plotTraverse(badClosure);
    expect(p.closure.linearClosureFt).toBeGreaterThan(0);
    expect(p.closure.linearClosureFt).toBeCloseTo(5, 3);
    // 395 perimeter / 5 closure = 79. Below 5000.
    expect(p.closure.precisionRatio).toBeLessThan(5000);
  });

  it("computes signed area >0 regardless of direction", () => {
    // counterclockwise variant (reverse the square).
    const ccw = {
      ...smallSquare,
      courses: [...smallSquare.courses].reverse().map((c, i) => ({ ...c, index: i })),
    };
    const p = plotTraverse(ccw);
    // Area should still be positive — but the polygon may not close from same start point.
    expect(p.closure.areaSqFt).toBeGreaterThan(0);
  });

  it("returns empty bbox for empty traverse", () => {
    const p = plotTraverse({ courses: [], unparsed: [], normalizedText: "" });
    expect(p.courses).toHaveLength(0);
    expect(p.closure.perimeterFt).toBe(0);
    expect(p.closure.linearClosureFt).toBeCloseTo(0, 6);
  });
});

describe("plotTraverse: with curves", () => {
  it("plots a curve-heavy traverse and produces sensible coordinates", () => {
    const p = plotTraverse(curveHeavy);
    expect(p.courses).toHaveLength(4);
    // After the 90° right curve from (200,0), with chord bearing N45E, we
    // should end at (300, 100): the curve travels 100 ft east + 100 ft north.
    const c1 = p.courses[1];
    expect(c1.type).toBe("curve");
    if (c1.type === "curve") {
      expect(c1.end.n).toBeCloseTo(300, 3);
      expect(c1.end.e).toBeCloseTo(100, 3);
      expect(c1.radiusFt).toBeCloseTo(100, 6);
      expect(c1.deltaDeg).toBeCloseTo(90, 6);
      expect(c1.arcLengthFt).toBeCloseTo((Math.PI / 2) * 100, 4);
    }
  });

  it("includes curve in perimeter using arc length not chord", () => {
    const p = plotTraverse(curveHeavy);
    // 200 + arc(πR/2 = 157.08) + 200 + 424.264 ≈ 981.34
    const expected = 200 + (Math.PI / 2) * 100 + 200 + Math.sqrt(2) * 300;
    expect(p.closure.perimeterFt).toBeCloseTo(expected, 3);
  });
});
