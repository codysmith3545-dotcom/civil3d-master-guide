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
}

export function manningsOpenChannel(input: ManningsOpenChannelInput): ManningsOpenChannelResult {
  const v = (1.486 / input.n) * Math.pow(input.hyd_radius_ft, 2 / 3) * Math.sqrt(input.slope_ft_ft);
  const q = v * input.area_sqft;
  return {
    v_fps: Math.round(v * 1000) / 1000,
    q_cfs: Math.round(q * 1000) / 1000,
    source: "Manning's equation, US customary form V = (1.486/n)·R^(2/3)·S^(1/2). Reference: Chow, Open-Channel Hydraulics; FHWA HDS-5.",
  };
}
