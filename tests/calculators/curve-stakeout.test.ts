import { describe, it, expect } from "vitest";
import { curveStakeout } from "../../mcp-server/src/calculators/curve-stakeout.js";

describe("curveStakeout", () => {
  it("R=500 ft, delta=30°, PC=1000 ft produces standard geometry and stakeout rows", () => {
    const r = curveStakeout({
      radius_ft: 500,
      delta_deg: 30,
      pc_station_ft: 1000,
      stake_interval_ft: 50,
    });
    // L = R*delta(rad) = 500 * pi/6 = 261.7994
    expect(r.curve_length_ft).toBeCloseTo(261.7994, 3);
    // T = R * tan(15°) = 133.9746
    expect(r.tangent_ft).toBeCloseTo(133.9746, 3);
    // LC = 2*R*sin(15°) = 258.8190
    expect(r.long_chord_ft).toBeCloseTo(258.8190, 3);
    // mid ordinate = R*(1 - cos(15°)) = 17.0371
    expect(r.mid_ordinate_ft).toBeCloseTo(17.0371, 3);
    // First row should be at PC (station 1000), zero deflection
    expect(r.stakeout_table[0].station).toBeCloseTo(1000, 4);
    expect(r.stakeout_table[0].deflection_deg).toBeCloseTo(0, 4);
    // Last row at PT
    const last = r.stakeout_table[r.stakeout_table.length - 1];
    expect(last.station).toBeCloseTo(1261.7994, 2);
  });

  it("very small delta (1°) produces a short curve (edge case)", () => {
    const r = curveStakeout({ radius_ft: 1000, delta_deg: 1, pc_station_ft: 0 });
    expect(r.curve_length_ft).toBeCloseTo(17.4533, 3);
  });

  it("throws on negative radius (input validation)", () => {
    expect(() =>
      curveStakeout({ radius_ft: -100, delta_deg: 30, pc_station_ft: 0 }),
    ).toThrow();
  });
});
