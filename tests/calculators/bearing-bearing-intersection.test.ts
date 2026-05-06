import { describe, it, expect } from "vitest";
import { bearingBearingIntersection } from "../../mcp-server/src/calculators/bearing-bearing-intersection.js";

describe("bearingBearingIntersection", () => {
  it("two 45° lines from (0,0) and (100,0) intersect at (50,50)", () => {
    const r = bearingBearingIntersection({
      n1: 0, e1: 0, bearing1_deg: 45,
      n2: 0, e2: 100, bearing2_deg: 315,
    });
    expect(r.n_intersection).toBeCloseTo(50, 4);
    expect(r.e_intersection).toBeCloseTo(50, 4);
    // distance from each = sqrt(50^2 + 50^2) = 70.7107
    expect(r.distance_from_p1).toBeCloseTo(70.7107, 3);
    expect(r.distance_from_p2).toBeCloseTo(70.7107, 3);
  });

  it("parallel bearings (both 45°) return NaN with a parallel-lines note (edge case)", () => {
    const r = bearingBearingIntersection({
      n1: 0, e1: 0, bearing1_deg: 45,
      n2: 100, e2: 0, bearing2_deg: 45,
    });
    expect(Number.isNaN(r.n_intersection)).toBe(true);
    expect(r.notes.some((n) => n.toLowerCase().includes("parallel"))).toBe(true);
  });

  it("throws on out-of-range bearing (input validation)", () => {
    expect(() =>
      bearingBearingIntersection({
        n1: 0, e1: 0, bearing1_deg: 999,
        n2: 100, e2: 0, bearing2_deg: 45,
      }),
    ).toThrow();
  });
});
