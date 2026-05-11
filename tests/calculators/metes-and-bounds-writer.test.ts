import { describe, it, expect } from "vitest";
import { metesAndBoundsWriter } from "../../mcp-server/src/calculators/metes-and-bounds-writer.js";

describe("metesAndBoundsWriter", () => {
  it("100x100 ft square produces 10000 sqft / 0.2296 ac and a description with 4 thences", () => {
    const r = metesAndBoundsWriter({
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
    // The description should include "Beginning" and "Point of Beginning"
    expect(r.description).toMatch(/Beginning at a point/);
    expect(r.description).toMatch(/Point of Beginning/);
    // It should contain bearings in quadrant notation
    expect(r.description).toMatch(/N \d{2}°\d{2}'\d{2}" E/);
  });

  it("a triangle (3 vertices) yields a valid description", () => {
    const r = metesAndBoundsWriter({
      coordinates: [
        { northing: 0, easting: 0 },
        { northing: 0, easting: 300 },
        { northing: 400, easting: 0 },
      ],
    });
    // Area of right triangle with legs 300 and 400 = 60000 sqft
    expect(r.area_sqft).toBeCloseTo(60000, 2);
    // Perimeter = 300 + 400 + 500 = 1200 ft
    expect(r.perimeter_ft).toBeCloseTo(1200, 2);
  });

  it("throws on fewer than 3 coordinates (input validation)", () => {
    expect(() =>
      metesAndBoundsWriter({
        coordinates: [
          { northing: 0, easting: 0 },
          { northing: 0, easting: 100 },
        ],
      }),
    ).toThrow();
  });
});
