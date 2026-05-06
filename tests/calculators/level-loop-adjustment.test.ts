import { describe, it, expect } from "vitest";
import { levelLoopAdjustment } from "../../mcp-server/src/calculators/level-loop-adjustment.js";

describe("levelLoopAdjustment", () => {
  it("perfectly closing loop (sum of dH = 0) yields zero closure error", () => {
    const r = levelLoopAdjustment({
      benchmarks: [{ name: "BM1", known_elevation_ft: 100.0 }],
      observations: [
        { from: "BM1", to: "A", delta_h_ft: 1.5 },
        { from: "A", to: "B", delta_h_ft: -0.5 },
        { from: "B", to: "BM1", delta_h_ft: -1.0 },
      ],
    });
    expect(r.loop_closure_ft).toBeCloseTo(0, 6);
    expect(r.adjusted_elevations["BM1"]).toBeCloseTo(100.0, 4);
    expect(r.adjusted_elevations["A"]).toBeCloseTo(101.5, 4);
    expect(r.adjusted_elevations["B"]).toBeCloseTo(101.0, 4);
  });

  it("uses proportional_by_distance method when all observations have distances (edge case)", () => {
    const r = levelLoopAdjustment({
      benchmarks: [{ name: "BM1", known_elevation_ft: 500.0 }],
      observations: [
        { from: "BM1", to: "A", delta_h_ft: 2.0, distance_ft: 1000 },
        { from: "A", to: "B", delta_h_ft: -1.0, distance_ft: 2000 },
        { from: "B", to: "BM1", delta_h_ft: -1.0, distance_ft: 1000 },
      ],
    });
    expect(r.method).toBe("proportional_by_distance");
    // total = 4000 ft = 0.7576 mi; allowable = 0.05 * sqrt(0.7576) = 0.0435
    expect(r.allowable_closure_ft).not.toBeNull();
  });

  it("throws when no benchmark has a known elevation (input validation)", () => {
    expect(() =>
      levelLoopAdjustment({
        benchmarks: [{ name: "BM1" }],
        observations: [{ from: "BM1", to: "A", delta_h_ft: 1.0 }],
      }),
    ).toThrow();
  });
});
