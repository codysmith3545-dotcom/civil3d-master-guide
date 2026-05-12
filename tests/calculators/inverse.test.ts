import { describe, it, expect } from "vitest";
import { inverse } from "../../mcp-server/src/calculators/inverse.js";

describe("inverse", () => {
  it("from (0,0) to (100,100) produces azimuth 45°, distance 141.4214 ft, bearing N 45°00'00\" E", () => {
    const r = inverse({ n1: 0, e1: 0, n2: 100, e2: 100 });
    expect(r.azimuth_deg).toBeCloseTo(45, 4);
    expect(r.distance_ft).toBeCloseTo(141.4214, 3);
    expect(r.delta_northing).toBeCloseTo(100, 4);
    expect(r.delta_easting).toBeCloseTo(100, 4);
    expect(r.bearing_quadrant).toBe('N 45°00\'00" E');
  });

  it("from (0,0) to (-100, -100) produces azimuth 225° / S 45°00'00\" W", () => {
    const r = inverse({ n1: 0, e1: 0, n2: -100, e2: -100 });
    expect(r.azimuth_deg).toBeCloseTo(225, 4);
    expect(r.bearing_quadrant).toBe('S 45°00\'00" W');
  });

  it("coincident points returns zero distance with a 'coincident' note (edge case)", () => {
    const r = inverse({ n1: 50, e1: 50, n2: 50, e2: 50 });
    expect(r.distance_ft).toBe(0);
    expect(r.notes.some((n) => n.toLowerCase().includes("coincident"))).toBe(true);
  });

  it("throws on non-numeric coordinates (input validation)", () => {
    // @ts-expect-error testing runtime validation
    expect(() => inverse({ n1: "x", e1: 0, n2: 100, e2: 100 })).toThrow();
  });
});
