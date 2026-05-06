/**
 * Trigonometric leveling calculator.
 *
 * Pure functions; no DOM or React.
 *
 * Given slope distance, zenith angle, instrument height (HI), target
 * height (HT), and a known elevation, computes horizontal distance,
 * elevation difference, and remote-point elevation.
 *
 *   horiz_dist = slope_dist * sin(zenith)
 *   delta_elev = slope_dist * cos(zenith) + HI - HT
 *   remote_elev = known_elev + delta_elev
 *
 * Reference: Wolf & Ghilani, Elementary Surveying, Ch. 4.
 */

export type TrigLevelingInput = {
  /** Slope distance, ft. */
  slope_dist_ft: number;
  /** Zenith angle, degrees (0 = straight up, 90 = horizontal). */
  zenith_deg: number;
  /** Instrument height above the known-elevation point, ft. */
  hi_ft: number;
  /** Target (prism/reflector) height at the remote point, ft. */
  ht_ft: number;
  /** Known elevation of the instrument point, ft. */
  known_elev_ft: number;
};

export type TrigLevelingOutput = {
  /** Horizontal distance, ft. */
  horiz_dist_ft: number;
  /** Elevation difference (remote - known), ft. */
  delta_elev_ft: number;
  /** Elevation of the remote point, ft. */
  remote_elev_ft: number;
  notes: string[];
};

const DEG = Math.PI / 180;

export function compute(input: TrigLevelingInput): TrigLevelingOutput {
  const notes: string[] = [];

  if (input.slope_dist_ft <= 0) notes.push("Slope distance must be positive.");
  if (input.zenith_deg < 0 || input.zenith_deg > 180) {
    notes.push("Zenith angle should be between 0 and 180 degrees.");
  }

  const zenRad = input.zenith_deg * DEG;
  const horizDist = input.slope_dist_ft * Math.sin(zenRad);
  const vertComponent = input.slope_dist_ft * Math.cos(zenRad);
  const deltaElev = vertComponent + input.hi_ft - input.ht_ft;
  const remoteElev = input.known_elev_ft + deltaElev;

  if (input.slope_dist_ft > 3000) {
    notes.push(
      "For distances over 3000 ft, earth curvature and refraction corrections may be significant. This calculator does not apply those corrections.",
    );
  }

  return {
    horiz_dist_ft: roundTo(horizDist, 3),
    delta_elev_ft: roundTo(deltaElev, 3),
    remote_elev_ft: roundTo(remoteElev, 3),
    notes,
  };
}

function roundTo(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}
