/**
 * Manning's equation for open-channel flow (US customary):
 *
 *   V = (1.486 / n) * R^(2/3) * S^(1/2)
 *   Q = V * A
 *
 * Where:
 *   V = velocity (ft/s)
 *   A = flow area (ft²)
 *   R = hydraulic radius (ft)
 *   S = energy/channel slope (ft/ft)
 *   n = Manning roughness
 *
 * Reference: Chow, Open-Channel Hydraulics (1959), §5; FHWA HDS-5.
 */

export interface ManningsOpenChannelInput {
  n: number;
  area_sqft: number;
  hyd_radius_ft: number;
  slope_ft_ft: number;
}

export interface ManningsOpenChannelResult {
  q_cfs: number;
  v_fps: number;
  source: string;
  relatedContent: string | null;
}

function requireFinite(value: unknown, name: string): number {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`Invalid input for ${name}: must be a finite number`);
  }
  return value;
}

export function manningsOpenChannel(input: ManningsOpenChannelInput): ManningsOpenChannelResult {
  const n = requireFinite(input?.n, "n");
  const area = requireFinite(input?.area_sqft, "area_sqft");
  const r = requireFinite(input?.hyd_radius_ft, "hyd_radius_ft");
  const s = requireFinite(input?.slope_ft_ft, "slope_ft_ft");

  if (n <= 0) throw new Error("Manning's n must be greater than 0");
  if (area <= 0) throw new Error("area_sqft must be greater than 0");
  if (r <= 0) throw new Error("hyd_radius_ft must be greater than 0");
  if (s <= 0) throw new Error("slope_ft_ft must be greater than 0");

  const v = (1.486 / n) * Math.pow(r, 2 / 3) * Math.sqrt(s);
  const q = v * area;

  const result: ManningsOpenChannelResult = {
    v_fps: Math.round(v * 1000) / 1000,
    q_cfs: Math.round(q * 1000) / 1000,
    source:
      "Manning's equation, US customary form V = (1.486/n)·R^(2/3)·S^(1/2). Reference: Chow, Open-Channel Hydraulics; FHWA HDS-5.",
    relatedContent: "engineering/hydraulics/mannings-reference",
  };

  for (const [key, val] of [
    ["v_fps", result.v_fps],
    ["q_cfs", result.q_cfs],
  ] as const) {
    if (!Number.isFinite(val)) {
      throw new Error(`Calculation produced non-finite result for ${key}: check inputs`);
    }
  }

  return result;
}
