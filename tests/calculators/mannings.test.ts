import { describe, it, expect } from "vitest";
import { manningsOpenChannel } from "../../mcp-server/src/calculators/mannings.js";

describe("manningsOpenChannel", () => {
  it("full-flow 24-inch concrete pipe (n=0.013, S=0.005) yields V≈5.09 fps and Q≈16 cfs", () => {
    // 24-inch pipe: D = 2 ft. Full flow: A = pi*D^2/4 = pi, R = D/4 = 0.5
    const A = Math.PI;
    const R = 0.5;
    const r = manningsOpenChannel({ n: 0.013, area_sqft: A, hyd_radius_ft: R, slope_ft_ft: 0.005 });
    // V = (1.486/0.013) * 0.5^(2/3) * sqrt(0.005) = 5.0917 fps
    expect(r.v_fps).toBeCloseTo(5.0917, 2);
    // Q = V*A = 5.0917 * pi = 15.9966 cfs
    expect(r.q_cfs).toBeCloseTo(15.9966, 2);
  });

  it("very mild slope (S=1e-5) returns very low velocity (edge case)", () => {
    const r = manningsOpenChannel({ n: 0.013, area_sqft: Math.PI, hyd_radius_ft: 0.5, slope_ft_ft: 1e-5 });
    // V scales with sqrt(S); sqrt(1e-5) = 0.003162. V = 114.308 * 0.62996 * 0.003162 = 0.2277 fps
    expect(r.v_fps).toBeCloseTo(0.228, 2);
  });

  it("throws on zero or negative Manning n (input validation)", () => {
    expect(() =>
      manningsOpenChannel({ n: 0, area_sqft: 1, hyd_radius_ft: 0.5, slope_ft_ft: 0.005 }),
    ).toThrow();
  });
});
