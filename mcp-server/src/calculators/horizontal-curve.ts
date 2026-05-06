/**
 * Simple circular horizontal curve geometry.
 *
 * Inputs:
 *   r_ft        - radius (ft)
 *   delta_deg   - deflection angle (degrees)
 *   pi_station_ft - station of the PI (ft)
 *
 * Outputs (US customary, feet, decimal):
 *   t  = R * tan(delta/2)            (Tangent)
 *   l  = R * delta(rad)              (Length of curve)
 *   m  = R * (1 - cos(delta/2))      (Middle ordinate)
 *   e  = R * (1/cos(delta/2) - 1)    (External)
 *   lc = 2 * R * sin(delta/2)        (Long chord)
 *   PC station = PI - T
 *   PT station = PC + L
 *
 * Reference: standard surveying texts (Wolf & Ghilani, Elementary Surveying;
 * Brinker & Wolf, Elementary Surveying §24).
 */

export interface HorizontalCurveInput {
  r_ft: number;
  delta_deg: number;
  pi_station_ft: number;
}

export interface HorizontalCurveResult {
  t: number;
  l: number;
  m: number;
  e: number;
  lc: number;
  pc_station: number;
  pt_station: number;
  source: string;
}

const r2 = (x: number): number => Math.round(x * 1e4) / 1e4;

export function horizontalCurve(input: HorizontalCurveInput): HorizontalCurveResult {
  const R = input.r_ft;
  const delta = (input.delta_deg * Math.PI) / 180;
  const half = delta / 2;

  const t = R * Math.tan(half);
  const l = R * delta;
  const m = R * (1 - Math.cos(half));
  const e = R * (1 / Math.cos(half) - 1);
  const lc = 2 * R * Math.sin(half);

  const pc = input.pi_station_ft - t;
  const pt = pc + l;

  return {
    t: r2(t),
    l: r2(l),
    m: r2(m),
    e: r2(e),
    lc: r2(lc),
    pc_station: r2(pc),
    pt_station: r2(pt),
    source: "Standard horizontal-curve formulas (Wolf & Ghilani, Elementary Surveying).",
  };
}
