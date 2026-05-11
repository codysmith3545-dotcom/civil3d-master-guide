import { describe, it, expect } from "vitest";
import { areaByCoordinates } from "../../mcp-server/src/calculators/area-by-coordinates.js";

describe("areaByCoordinates", () => {
  it("100x100 ft square (CCW) yields 10000 sqft, 400 ft perimeter, not clockwise", () => {
    const r = areaByCoordinates({
      coordinates: [
        { northing: 0, easting: 0 },
        { northing: 0, easting: 100 },
        { northing: 100, easting: 100 },
        { northing: 100, easting: 0 },
      ],
    });
    expect(r.area_sqft).toBeCloseTo(10000, 2);
    expect(r.area_acres).toBeCloseTo(0.2296, 3);
    expect(r.perimeter_ft).toBeCloseTo(400, 2);
    expect(r.is_clockwise).toBe(false);
  });

  it("clockwise winding (reverse) returns same area but is_clockwise=true (edge case)", () => {
    const r = areaByCoordinates({
      coordinates: [
        { northing: 0, easting: 0 },
        { northing: 100, easting: 0 },
        { northing: 100, easting: 100 },
        { northing: 0, easting: 100 },
      ],
    });
    expect(r.area_sqft).toBeCloseTo(10000, 2);
    expect(r.is_clockwise).toBe(true);
  });

  it("3-4-5 right triangle yields area 6 sqft", () => {
    const r = areaByCoordinates({
      coordinates: [
        { northing: 0, easting: 0 },
        { northing: 0, easting: 3 },
        { northing: 4, easting: 0 },
      ],
    });
    expect(r.area_sqft).toBeCloseTo(6, 4);
    // perimeter = 3 + 4 + 5 = 12
    expect(r.perimeter_ft).toBeCloseTo(12, 4);
  });

  it("throws on fewer than 3 vertices (input validation)", () => {
    expect(() =>
      areaByCoordinates({
        coordinates: [
          { northing: 0, easting: 0 },
          { northing: 100, easting: 100 },
        ],
      }),
    ).toThrow();
  });
});
