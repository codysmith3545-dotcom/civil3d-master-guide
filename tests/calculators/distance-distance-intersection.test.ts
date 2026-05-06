import { describe, it, expect } from "vitest";
import { distanceDistanceIntersection } from "../../mcp-server/src/calculators/distance-distance-intersection.js";

describe("distanceDistanceIntersection", () => {
  it("two circles r=5 at (0,0) and (0,8) intersect at (±3, 4)", () => {
    const r = distanceDistanceIntersection({
      n1: 0, e1: 0, d1_ft: 5,
      n2: 0, e2: 8, d2_ft: 5,
    });
    expect(r.solutions).toHaveLength(2);
    const northings = r.solutions.map((s) => s.northing).sort((a, b) => a - b);
    expect(northings[0]).toBeCloseTo(-3, 4);
    expect(northings[1]).toBeCloseTo(3, 4);
    r.solutions.forEach((s) => expect(s.easting).toBeCloseTo(4, 4));
  });

  it("tangent circles (d == r1+r2) return one solution (edge case)", () => {
    const r = distanceDistanceIntersection({
      n1: 0, e1: 0, d1_ft: 5,
      n2: 0, e2: 10, d2_ft: 5,
    });
    expect(r.solutions).toHaveLength(1);
    expect(r.solutions[0].easting).toBeCloseTo(5, 4);
    expect(r.solutions[0].northing).toBeCloseTo(0, 4);
  });

  it("non-intersecting circles return zero solutions with a note", () => {
    const r = distanceDistanceIntersection({
      n1: 0, e1: 0, d1_ft: 1,
      n2: 0, e2: 100, d2_ft: 1,
    });
    expect(r.solutions).toHaveLength(0);
  });

  it("throws on negative radius (input validation)", () => {
    expect(() =>
      distanceDistanceIntersection({
        n1: 0, e1: 0, d1_ft: -5,
        n2: 0, e2: 10, d2_ft: 5,
      }),
    ).toThrow();
  });
});
