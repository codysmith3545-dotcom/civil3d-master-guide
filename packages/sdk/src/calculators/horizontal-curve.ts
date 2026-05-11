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
  relatedContent: string | null;
}

const r2 = (x: number): number => Math.round(x * 1e4) / 1e4;

function requireFinite(value: unknown, name: string): number {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`Invalid input for ${name}: must be a finite number`);
  }
  return value;
}

export function horizontalCurve(input: HorizontalCurveInput): HorizontalCurveResult {
  const R = requireFinite(input?.r_ft, "r_ft");
  const deltaDeg = requireFinite(input?.delta_deg, "delta_deg");
  const piStation = requireFinite(input?.pi_station_ft, "pi_station_ft");

  if (R <= 0) throw new Error("r_ft (radius) must be greater than 0");
  if (deltaDeg <= 0 || deltaDeg >= 360) {
    throw new Error("delta_deg must be greater than 0 and less than 360");
  }

  const delta = (deltaDeg * Math.PI) / 180;
  const half = delta / 2;

  const t = R * Math.tan(half);
  const l = R * delta;
  const m = R * (1 - Math.cos(half));
  const e = R * (1 / Math.cos(half) - 1);
  const lc = 2 * R * Math.sin(half);

  const pc = piStation - t;
  const pt = pc + l;

  const result: HorizontalCurveResult = {
    t: r2(t),
    l: r2(l),
    m: r2(m),
    e: r2(e),
    lc: r2(lc),
    pc_station: r2(pc),
    pt_station: r2(pt),
    source: "Standard horizontal-curve formulas (Wolf & Ghilani, Elementary Surveying).",
    relatedContent: "engineering/roadway-design/horizontal-curve-design",
  };

  for (const key of ["t", "l", "m", "e", "lc", "pc_station", "pt_station"] as const) {
    if (!Number.isFinite(result[key])) {
      throw new Error(`Calculation produced non-finite result for ${key}: check inputs`);
    }
  }

  return result;
}
