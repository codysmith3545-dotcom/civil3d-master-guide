import { describe, it, expect } from "vitest";
import { traverseClosure } from "../../mcp-server/src/calculators/traverse-closure.js";

describe("traverseClosure", () => {
  it("a perfect 100x100 ft square traverse closes exactly", () => {
    const r = traverseClosure({
      legs: [
        { bearing_deg: 0, distance_ft: 100 },   // N
        { bearing_deg: 90, distance_ft: 100 },  // E
        { bearing_deg: 180, distance_ft: 100 }, // S
        { bearing_deg: 270, distance_ft: 100 }, // W
      ],
    });
    expect(r.perimeter_ft).toBeCloseTo(400, 4);
    expect(r.linear_closure_ft).toBeCloseTo(0, 6);
    expect(r.precision_ratio).toMatch(/perfect/);
    // The first leg N for 100 ft has lat=100, dep=0
    expect(r.legs[0].latitude).toBeCloseTo(100, 4);
    expect(r.legs[0].departure).toBeCloseTo(0, 6);
  });

  it("a 3-4-5 right triangle closes exactly (edge: minimum-leg traverse)", () => {
    // 3 legs forming a right triangle at the origin
    // Leg A: bearing 90 (east), 4 ft -> dep=+4
    // Leg B: bearing 0   (north), 3 ft -> lat=+3
    // Leg C: from (3,4) back to origin -> distance 5, bearing = 180+atan2(-4,-3)
    // azimuth from N clockwise of vector (-3,-4) is 180 + atan2(4,3) = 180 + 53.1301° = 233.1301°
    const r = traverseClosure({
      legs: [
        { bearing_deg: 90, distance_ft: 4 },
        { bearing_deg: 0, distance_ft: 3 },
        { bearing_deg: 233.1301023541, distance_ft: 5 },
      ],
    });
    expect(r.perimeter_ft).toBeCloseTo(12, 4);
    expect(r.linear_closure_ft).toBeLessThan(1e-4);
  });

  it("throws on empty legs array (input validation)", () => {
    expect(() => traverseClosure({ legs: [] })).toThrow();
  });
});
