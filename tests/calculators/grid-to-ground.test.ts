import { describe, it, expect } from "vitest";
import { gridToGround } from "../../mcp-server/src/calculators/grid-to-ground.js";

describe("gridToGround", () => {
  it("grid_to_ground: ground = grid / CSF (1000 ft / 0.9999 ≈ 1000.10001)", () => {
    const r = gridToGround({
      mode: "grid_to_ground",
      csf: 0.9999,
      distance_ft: 1000,
    });
    expect(r.converted_distance_ft).toBeCloseTo(1000.10001, 4);
  });

  it("ground_to_grid: grid = ground * CSF", () => {
    const r = gridToGround({
      mode: "ground_to_grid",
      csf: 0.9999,
      distance_ft: 1000.10001,
    });
    expect(r.converted_distance_ft).toBeCloseTo(1000, 3);
  });

  it("CSF=1 yields no change in distance (edge case)", () => {
    const r = gridToGround({
      mode: "grid_to_ground",
      csf: 1.0,
      distance_ft: 1234.5678,
    });
    expect(r.converted_distance_ft).toBeCloseTo(1234.5678, 4);
  });

  it("coordinate scaling about an origin: (1000-500)/0.9999 + 500 = 1000.05000...", () => {
    const r = gridToGround({
      mode: "grid_to_ground",
      csf: 0.9999,
      grid_northing: 1000,
      grid_easting: 1000,
      origin_northing: 500,
      origin_easting: 500,
    });
    // (1000 - 500) / 0.9999 + 500 = 500.0500050005 + 500 = 1000.05000...
    expect(r.converted_northing).toBeCloseTo(1000.0500050005, 4);
    expect(r.converted_easting).toBeCloseTo(1000.0500050005, 4);
  });

  it("throws on non-positive CSF (input validation)", () => {
    expect(() =>
      gridToGround({ mode: "grid_to_ground", csf: 0, distance_ft: 100 }),
    ).toThrow();
  });
});
