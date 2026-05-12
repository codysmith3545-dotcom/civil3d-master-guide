/**
 * Trigonometric leveling calculator.
 *
 * Computes the elevation of a remote point from a total-station observation
 * (slope distance + zenith angle), given the known elevation at the
 * instrument point.
 *
 * Formulas:
 *   H = S * sin(ZA)           (horizontal distance)
 *   V = S * cos(ZA)           (vertical difference, instrument-to-target)
 *   Remote elev = Known elev + HI + V - HT
 *
 * Optional curvature-and-refraction correction:
 *   C&R = 0.0206 * F^2        (F in thousands of feet, result in feet)
 *       = 0.0206 * (H/1000)^2
 *   Or equivalently: C&R = 0.0206 * H^2 / 1,000,000
 *
 * The 0.0206 factor assumes a refraction coefficient of 0.07 (standard
 * atmosphere). This is the combined curvature-minus-refraction value
 * commonly used in U.S. surveying practice.
 *
 * Reference: Wolf & Ghilani, *Elementary Surveying*, Ch. 4 (Leveling) and
 * Ch. 6 (Distance and angle measurement); Kavanagh & Mastin, *Surveying*.
 */

export interface TrigLevelingInput {
  /** Slope distance from instrument to target in feet. */
  slope_distance_ft: number;
  /** Zenith angle in decimal degrees (0 = straight up, 90 = horizontal). */
  zenith_angle_deg: number;
  /** Height of instrument (HI) above the station mark in feet. */
  instrument_height_ft: number;
  /** Height of target/prism (HT) above the remote station in feet. */
  target_height_ft: number;
  /** Known elevation of the instrument station in feet. */
  known_elevation_ft: number;
  /** Whether to apply curvature-and-refraction correction (default false). */
  apply_curvature_refraction?: boolean;
}

export interface TrigLevelingResult {
  horizontal_distance_ft: number;
  vertical_difference_ft: number;
  remote_elevation_ft: number;
  curvature_refraction_ft: number | null;
  source: string;
  notes: string[];
  relatedContent: string | null;
}

function requireFinite(value: unknown, name: string): number {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`Invalid input for ${name}: must be a finite number`);
  }
  return value;
}

// TODO: no dedicated trigonometric-leveling page; nearest is level-networks.
const TRIG_LEVELING_RELATED = "field-and-boundary/control-networks/level-networks";

const DEG = Math.PI / 180;

function r6(x: number): number {
  return Math.round(x * 1e6) / 1e6;
}

export function trigLeveling(input: TrigLevelingInput): TrigLevelingResult {
  const notes: string[] = [];

  const slopeDist = requireFinite(input?.slope_distance_ft, "slope_distance_ft");
  const zenithDeg = requireFinite(input?.zenith_angle_deg, "zenith_angle_deg");
  const hi = requireFinite(input?.instrument_height_ft, "instrument_height_ft");
  const ht = requireFinite(input?.target_height_ft, "target_height_ft");
  const knownElev = requireFinite(input?.known_elevation_ft, "known_elevation_ft");
  if (slopeDist < 0) throw new Error("slope_distance_ft must be >= 0");

  const za = zenithDeg * DEG;
  const S = slopeDist;

  // Horizontal distance
  const H = S * Math.sin(za);

  // Vertical difference (from instrument axis to target)
  const V = S * Math.cos(za);

  // Curvature and refraction correction
  let crCorrection: number | null = null;
  let crValue = 0;

  if (input.apply_curvature_refraction) {
    // C&R = 0.0206 * (H/1000)^2  in feet
    crValue = 0.0206 * (H / 1000) ** 2;
    crCorrection = r6(crValue);

    if (H > 5280) {
      notes.push(
        "Horizontal distance exceeds 1 mile. The standard C&R factor (k=0.07) may not " +
          "be accurate over long distances or in non-standard atmospheric conditions.",
      );
    }
  }

  // Remote elevation:
  // Elev_remote = Elev_known + HI + V - HT + C&R
  // C&R is positive because curvature makes the earth fall away (target appears
  // lower than it actually is), so we add the correction.
  const remoteElev = knownElev + hi + V - ht + crValue;

  if (zenithDeg < 0 || zenithDeg > 180) {
    notes.push(
      "Zenith angle should be between 0° (straight up) and 180° (straight down). " +
        "Check the input value.",
    );
  }

  if (Math.abs(zenithDeg - 90) < 0.001) {
    notes.push("Zenith angle is nearly horizontal (90°); vertical difference is near zero.");
  }

  const result: TrigLevelingResult = {
    horizontal_distance_ft: r6(H),
    vertical_difference_ft: r6(V),
    remote_elevation_ft: r6(remoteElev),
    curvature_refraction_ft: crCorrection,
    source:
      "Trigonometric leveling: H = S*sin(ZA), V = S*cos(ZA). " +
      "C&R = 0.0206*(H/1000)^2. " +
      "Reference: Wolf & Ghilani, Elementary Surveying, Ch. 4 & 6.",
    notes,
    relatedContent: TRIG_LEVELING_RELATED,
  };

  for (const key of [
    "horizontal_distance_ft",
    "vertical_difference_ft",
    "remote_elevation_ft",
  ] as const) {
    if (!Number.isFinite(result[key])) {
      throw new Error(`Calculation produced non-finite result for ${key}: check inputs`);
    }
  }
  if (result.curvature_refraction_ft !== null && !Number.isFinite(result.curvature_refraction_ft)) {
    throw new Error(
      "Calculation produced non-finite result for curvature_refraction_ft: check inputs",
    );
  }

  return result;
}
