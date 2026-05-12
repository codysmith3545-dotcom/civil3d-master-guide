import { describe, it, expect } from "vitest";
import { horizontalCurve } from "../../mcp-server/src/calculators/horizontal-curve.js";

describe("horizontalCurve", () => {
  it("R=1000, delta=30, PI=10000 produces standard textbook geometry", () => {
    const r = horizontalCurve({ r_ft: 1000, delta_deg: 30, pi_station_ft: 10000 });
    // T = R*tan(delta/2) = 1000 * tan(15°) = 267.9491924
    expect(r.t).toBeCloseTo(267.9492, 3);
    // L = R*delta(rad) = 1000 * pi/6 = 523.5987756
    expect(r.l).toBeCloseTo(523.5988, 3);
    // M = R*(1 - cos(15°)) = 34.0741737
    expect(r.m).toBeCloseTo(34.0742, 3);
    // E = R*(1/cos(15°) - 1) = 35.2761774
    expect(r.e).toBeCloseTo(35.2762, 3);
    // LC = 2*R*sin(15°) = 517.6380902
    expect(r.lc).toBeCloseTo(517.6381, 3);
    expect(r.pc_station).toBeCloseTo(9732.0508, 3);
    expect(r.pt_station).toBeCloseTo(10255.6496, 3);
  });

  it("very large radius (R=100000, delta=1°) is nearly tangent and short", () => {
    const r = horizontalCurve({ r_ft: 100000, delta_deg: 1, pi_station_ft: 0 });
    // L = 100000 * (pi/180) = 1745.3293
    expect(r.l).toBeCloseTo(1745.3293, 2);
    // T = 100000 * tan(0.5°) = 872.6867
    expect(r.t).toBeCloseTo(872.6867, 2);
  });

  it("throws on negative radius (input validation)", () => {
    expect(() =>
      horizontalCurve({ r_ft: -100, delta_deg: 30, pi_station_ft: 0 }),
    ).toThrow();
  });
});
