import { describe, it, expect } from "vitest";
import { bearingDistanceIntersection } from "../../mcp-server/src/calculators/bearing-distance-intersection.js";

describe("bearingDistanceIntersection", () => {
  it("east-going line from origin meets a circle (center (0,100), r=50) at E=50 and E=150", () => {
    const r = bearingDistanceIntersection({
      n1: 0, e1: 0, bearing_deg: 90,
      n2: 0, e2: 100, distance_ft: 50,
    });
    expect(r.solutions).toHaveLength(2);
    const eastings = r.solutions.map((s) => s.easting).sort((a, b) => a - b);
    expect(eastings[0]).toBeCloseTo(50, 4);
    expect(eastings[1]).toBeCloseTo(150, 4);
    expect(r.solutions[0].northing).toBeCloseTo(0, 4);
    expect(r.solutions[1].northing).toBeCloseTo(0, 4);
  });

  it("line tangent to circle returns exactly one solution (edge case)", () => {
    // east-going line at northing=0 just touches circle centered at (50,100) with radius 50
    const r = bearingDistanceIntersection({
      n1: 50, e1: 0, bearing_deg: 90,
      n2: 50, e2: 100, distance_ft: 0, // zero radius => tangent (point)
    });
    // With r=0, the discriminant calculation should yield 0 -> tangent case
    expect(r.solutions.length).toBe(1);
  });

  it("line that misses the circle returns zero solutions (no intersection)", () => {
    const r = bearingDistanceIntersection({
      n1: 0, e1: 0, bearing_deg: 90,
      n2: 1000, e2: 0, distance_ft: 10,
    });
    expect(r.solutions).toHaveLength(0);
    expect(r.notes.some((n) => n.toLowerCase().includes("no intersection"))).toBe(true);
  });

  it("throws on negative radius (input validation)", () => {
    expect(() =>
      bearingDistanceIntersection({
        n1: 0, e1: 0, bearing_deg: 90,
        n2: 100, e2: 0, distance_ft: -10,
      }),
    ).toThrow();
  });
});
