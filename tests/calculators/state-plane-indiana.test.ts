import { describe, it, expect } from "vitest";
import { statePlaneIndianaCsf } from "../../mcp-server/src/calculators/state-plane-indiana.js";

describe("statePlaneIndianaCsf", () => {
  it("at the East-zone central meridian (lon=-85.6667°, elev=0), grid scale equals k0", () => {
    const r = statePlaneIndianaCsf({ lat: 40, lon: -85.6667, elev_ft: 0 });
    expect(r.zone).toBe("Indiana East (1301)");
    expect(r.grid_scale).toBeCloseTo(0.999966667, 8);
    expect(r.elevation_factor).toBeCloseTo(1.0, 8);
    expect(r.csf).toBeCloseTo(0.999966667, 8);
  });

  it("Indianapolis (lon=-86.15°) is in the East zone; elevation factor < 1 at h=800 ft", () => {
    const r = statePlaneIndianaCsf({ lat: 39.7684, lon: -86.1581, elev_ft: 800 });
    expect(r.zone).toBe("Indiana East (1301)");
    // elevation_factor = R/(R+h) = 20906000/(20906000+800) = 0.99996175...
    expect(r.elevation_factor).toBeCloseTo(0.999961733, 7);
    expect(r.csf).toBeLessThan(1.0);
  });

  it("West-zone selection: lon=-87.5° picks Indiana West (1302)", () => {
    const r = statePlaneIndianaCsf({ lat: 40, lon: -87.5, elev_ft: 500 });
    expect(r.zone).toBe("Indiana West (1302)");
  });

  it("throws on out-of-range latitude (input validation)", () => {
    expect(() => statePlaneIndianaCsf({ lat: 200, lon: -86, elev_ft: 0 })).toThrow();
  });
});
