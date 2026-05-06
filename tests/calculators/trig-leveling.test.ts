import { describe, it, expect } from "vitest";
import { trigLeveling } from "../../mcp-server/src/calculators/trig-leveling.js";

describe("trigLeveling", () => {
  it("ZA=45°, S=141.4214 ft, HI=5, HT=6, known=100 yields H=100, V=100, remote=199", () => {
    const r = trigLeveling({
      slope_distance_ft: 141.4214,
      zenith_angle_deg: 45,
      instrument_height_ft: 5,
      target_height_ft: 6,
      known_elevation_ft: 100,
    });
    expect(r.horizontal_distance_ft).toBeCloseTo(100, 3);
    expect(r.vertical_difference_ft).toBeCloseTo(100, 3);
    expect(r.remote_elevation_ft).toBeCloseTo(199, 3);
    // No C&R applied
    expect(r.curvature_refraction_ft).toBeNull();
  });

  it("horizontal sight (ZA=90°) yields V=0; remote = known + HI - HT", () => {
    const r = trigLeveling({
      slope_distance_ft: 500,
      zenith_angle_deg: 90,
      instrument_height_ft: 5,
      target_height_ft: 5,
      known_elevation_ft: 100,
    });
    expect(r.horizontal_distance_ft).toBeCloseTo(500, 4);
    expect(r.vertical_difference_ft).toBeCloseTo(0, 6);
    expect(r.remote_elevation_ft).toBeCloseTo(100, 4);
  });

  it("C&R correction at H=5280 (1 mile) is 0.0206*(5.28)^2 = 0.5743 ft", () => {
    const r = trigLeveling({
      slope_distance_ft: 5280,
      zenith_angle_deg: 90,
      instrument_height_ft: 0,
      target_height_ft: 0,
      known_elevation_ft: 0,
      apply_curvature_refraction: true,
    });
    // C&R = 0.0206 * (5280/1000)^2 = 0.0206 * 27.8784 = 0.5743
    expect(r.curvature_refraction_ft).toBeCloseTo(0.5743, 3);
  });

  it("throws on negative slope distance (input validation)", () => {
    expect(() =>
      trigLeveling({
        slope_distance_ft: -100,
        zenith_angle_deg: 45,
        instrument_height_ft: 5,
        target_height_ft: 5,
        known_elevation_ft: 100,
      }),
    ).toThrow();
  });
});
