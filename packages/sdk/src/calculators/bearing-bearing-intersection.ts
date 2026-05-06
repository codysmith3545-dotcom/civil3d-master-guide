/**
 * Bearing–bearing intersection calculator.
 *
 * Given two known points and an azimuth from each, computes the intersection
 * point of the two bearing lines using parametric line intersection.
 *
 * Input azimuths are in decimal degrees (0 = north, clockwise).
 *
 * Warns when the intersection angle is acute (< 5°), which yields a
 * poorly-conditioned solution.
 *
 * Reference: Wolf & Ghilani, *Elementary Surveying*, Ch. 10 (COGO).
 */

export interface BearingBearingIntersectionInput {
  /** Northing of point 1 in feet. */
  n1: number;
  /** Easting of point 1 in feet. */
  e1: number;
  /** Azimuth from point 1 in decimal degrees (0=north, clockwise). */
  bearing1_deg: number;
  /** Northing of point 2 in feet. */
  n2: number;
  /** Easting of point 2 in feet. */
  e2: number;
  /** Azimuth from point 2 in decimal degrees (0=north, clockwise). */
  bearing2_deg: number;
}

export interface BearingBearingIntersectionResult {
  n_intersection: number;
  e_intersection: number;
  distance_from_p1: number;
  distance_from_p2: number;
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

// TODO: no dedicated doc page yet for bearing-bearing intersection.
const BB_RELATED: string | null = null;

const DEG = Math.PI / 180;

function r6(x: number): number {
  return Math.round(x * 1e6) / 1e6;
}

export function bearingBearingIntersection(
  input: BearingBearingIntersectionInput,
): BearingBearingIntersectionResult {
  const notes: string[] = [];

  const n1 = requireFinite(input?.n1, "n1");
  const e1 = requireFinite(input?.e1, "e1");
  const bearing1 = requireFinite(input?.bearing1_deg, "bearing1_deg");
  const n2 = requireFinite(input?.n2, "n2");
  const e2 = requireFinite(input?.e2, "e2");
  const bearing2 = requireFinite(input?.bearing2_deg, "bearing2_deg");

  // Direction vectors from azimuth: azimuth 0=north means dN=cos, dE=sin
  const az1 = bearing1 * DEG;
  const az2 = bearing2 * DEG;

  const dN1 = Math.cos(az1);
  const dE1 = Math.sin(az1);
  const dN2 = Math.cos(az2);
  const dE2 = Math.sin(az2);

  // Parametric form:
  //   P = P1 + t1 * (dN1, dE1)
  //   P = P2 + t2 * (dN2, dE2)
  //
  //   P1.n + t1*dN1 = P2.n + t2*dN2
  //   P1.e + t1*dE1 = P2.e + t2*dE2
  //
  // Solve for t1 using Cramer's rule:
  //   | dN1  -dN2 | | t1 |   | P2.n - P1.n |
  //   | dE1  -dE2 | | t2 | = | P2.e - P1.e |

  const det = dN1 * (-dE2) - (-dN2) * dE1; // = -(dN1*dE2 - dN2*dE1)

  const crossAngleDeg = Math.abs(Math.asin(Math.min(1, Math.max(-1, det)))) / DEG;

  if (Math.abs(det) < 1e-12) {
    throw new Error(
      "Bearing lines are parallel or nearly parallel; no unique intersection exists",
    );
  }

  if (crossAngleDeg < 5) {
    notes.push(
      `Intersection angle is approximately ${r6(crossAngleDeg)}°, which is less than 5°. ` +
        "The solution is poorly conditioned; small bearing errors produce large position shifts.",
    );
  }

  const bN = n2 - n1;
  const bE = e2 - e1;

  const t1 = (bN * (-dE2) - (-dN2) * bE) / det;
  const t2 = (dN1 * bE - dE1 * bN) / det;

  const nInt = n1 + t1 * dN1;
  const eInt = e1 + t1 * dE1;

  const distP1 = Math.abs(t1);
  const distP2 = Math.abs(t2);

  if (t1 < 0) {
    notes.push(
      "Intersection lies behind P1 (opposite to the bearing direction).",
    );
  }
  if (t2 < 0) {
    notes.push(
      "Intersection lies behind P2 (opposite to the bearing direction).",
    );
  }

  const result: BearingBearingIntersectionResult = {
    n_intersection: r6(nInt),
    e_intersection: r6(eInt),
    distance_from_p1: r6(distP1),
    distance_from_p2: r6(distP2),
    source: "Bearing–bearing intersection (parametric). Reference: Wolf & Ghilani, Elementary Surveying, Ch. 10.",
    notes,
    relatedContent: BB_RELATED,
  };

  for (const key of [
    "n_intersection",
    "e_intersection",
    "distance_from_p1",
    "distance_from_p2",
  ] as const) {
    if (!Number.isFinite(result[key])) {
      throw new Error(`Calculation produced non-finite result for ${key}: check inputs`);
    }
  }

  return result;
}
