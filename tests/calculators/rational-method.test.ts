import { describe, it, expect } from "vitest";
import { rationalMethod } from "../../mcp-server/src/calculators/rational-method.js";

describe("rationalMethod", () => {
  it("Q = C*i*A: C=0.85, i=4.5 in/hr, A=2.3 ac yields Q≈8.7975 cfs", () => {
    const r = rationalMethod({ c: 0.85, i_in_hr: 4.5, a_acres: 2.3 });
    // 0.85 * 4.5 * 2.3 = 8.7975 (calculator rounds to 3 decimals -> 8.798)
    expect(r.q_cfs).toBeCloseTo(8.7975, 2);
  });

  it("very small drainage area produces near-zero peak flow (edge case)", () => {
    const r = rationalMethod({ c: 0.5, i_in_hr: 2.0, a_acres: 0.001 });
    // 0.5 * 2.0 * 0.001 = 0.001
    expect(r.q_cfs).toBeCloseTo(0.001, 3);
  });

  it("throws on negative runoff coefficient (input validation)", () => {
    expect(() => rationalMethod({ c: -0.1, i_in_hr: 4.5, a_acres: 2.3 })).toThrow();
  });
});
