import { describe, it, expect } from "vitest";
import { verticalCurve } from "../../mcp-server/src/calculators/vertical-curve.js";

describe("verticalCurve", () => {
  it("crest SSD at 60 mph with G1=+2, G2=-3 yields K=151 and L=755 ft (AASHTO Table 3-34)", () => {
    const r = verticalCurve({
      g1: 2,
      g2: -3,
      design_speed_mph: 60,
      type: "crest",
      criterion: "ssd",
    });
    // |A| = |(-3) - 2| = 5%
    expect(r.algebraic_difference_percent).toBeCloseTo(5, 4);
    expect(r.k_required).toBe(151);
    // L = K * A = 151 * 5 = 755 ft
    expect(r.l_required_ft).toBeCloseTo(755, 4);
  });

  it("returns zero curve when grades are equal (edge case)", () => {
    const r = verticalCurve({
      g1: 1.5,
      g2: 1.5,
      design_speed_mph: 50,
      type: "sag",
      criterion: "ssd",
    });
    expect(r.algebraic_difference_percent).toBe(0);
    expect(r.l_required_ft).toBe(0);
    expect(r.k_required).toBe(0);
  });

  it("sag comfort criterion uses K = V^2 / 46.5", () => {
    const r = verticalCurve({
      g1: -2,
      g2: 2,
      design_speed_mph: 50,
      type: "sag",
      criterion: "comfort",
    });
    // K = 50^2 / 46.5 = 53.7634
    expect(r.k_required).toBeCloseTo(53.76, 1);
  });

  it("throws on invalid (negative) design speed (input validation)", () => {
    expect(() =>
      verticalCurve({
        g1: 2,
        g2: -3,
        design_speed_mph: -10,
        type: "crest",
        criterion: "ssd",
      }),
    ).toThrow();
  });
});
