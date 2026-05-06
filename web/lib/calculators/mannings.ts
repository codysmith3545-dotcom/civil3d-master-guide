/**
 * Manning's equation calculator.
 *
 * Pure functions; no DOM or React.
 *
 *   V = (1.49 / n) * R^(2/3) * S^(1/2)   (English / customary units)
 *   Q = V * A
 *
 * Where V is velocity in ft/s, n is Manning's roughness coefficient
 * (dimensionless), R is hydraulic radius in ft, S is slope of the energy
 * grade line in ft/ft, A is cross-sectional area of flow in sq ft, and
 * Q is discharge in cfs.
 *
 * The 1.49 constant applies to U.S. customary units only (metric uses 1.0).
 *
 * Reference: Chow, V.T., Open-Channel Hydraulics, 1959; FHWA HDS-4.
 */

export type ManningsInput = {
  /** Manning's roughness coefficient, dimensionless. */
  n: number;
  /** Cross-sectional area of flow, sq ft. */
  area_sqft: number;
  /** Hydraulic radius (A / wetted perimeter), ft. */
  hyd_radius_ft: number;
  /** Slope of energy grade line, ft/ft. */
  slope_ft_ft: number;
};

export type ManningsOutput = {
  /** Flow velocity, ft/s. */
  velocity_fps: number;
  /** Discharge, cfs. */
  flow_cfs: number;
  notes: string[];
};

export function compute(input: ManningsInput): ManningsOutput {
  const notes: string[] = [];
  if (input.n <= 0) notes.push("Manning's n must be positive.");
  if (input.area_sqft <= 0) notes.push("Flow area must be positive.");
  if (input.hyd_radius_ft <= 0) notes.push("Hydraulic radius must be positive.");
  if (input.slope_ft_ft <= 0) notes.push("Slope must be positive.");

  const V =
    input.n > 0 && input.hyd_radius_ft > 0 && input.slope_ft_ft > 0
      ? (1.49 / input.n) *
        Math.pow(input.hyd_radius_ft, 2 / 3) *
        Math.pow(input.slope_ft_ft, 0.5)
      : 0;

  const Q = V * input.area_sqft;

  return {
    velocity_fps: roundTo(V, 4),
    flow_cfs: roundTo(Q, 4),
    notes,
  };
}

function roundTo(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}
