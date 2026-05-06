/**
 * Bearing-bearing intersection calculator.
 *
 * Pure functions; no DOM or React.
 *
 * Given two known points and two bearings (azimuths), computes the
 * intersection point. Returns null if the bearings are parallel.
 *
 * Method: parametric line intersection.
 *   P = P1 + t1 * d1   and   P = P2 + t2 * d2
 * where d_i = (sin(az_i), cos(az_i)) expressed in (easting, northing).
 *
 * Reference: Wolf & Ghilani, Elementary Surveying, Ch. 11.
 */

export type BearingBearingInput = {
  n1: number;
  e1: number;
  /** Azimuth from point 1, decimal degrees 0-360. */
  bearing1_deg: number;
  n2: number;
  e2: number;
  /** Azimuth from point 2, decimal degrees 0-360. */
  bearing2_deg: number;
};

export type BearingBearingOutput = {
  /** Intersection northing, or null if no solution. */
  n: number | null;
  /** Intersection easting, or null if no solution. */
  e: number | null;
  /** Distance from point 1 to the intersection, ft. */
  dist_from_p1: number | null;
  /** Distance from point 2 to the intersection, ft. */
  dist_from_p2: number | null;
  notes: string[];
};

const DEG = Math.PI / 180;

export function compute(input: BearingBearingInput): BearingBearingOutput {
  const notes: string[] = [];

  const az1 = input.bearing1_deg * DEG;
  const az2 = input.bearing2_deg * DEG;

  // Direction vectors (easting, northing).
  const dx1 = Math.sin(az1);
  const dy1 = Math.cos(az1);
  const dx2 = Math.sin(az2);
  const dy2 = Math.cos(az2);

  // Solve P1 + t1*d1 = P2 + t2*d2 via cross product (2D determinant).
  const denom = dx1 * dy2 - dy1 * dx2;

  if (Math.abs(denom) < 1e-12) {
    notes.push(
      "Bearings are parallel or nearly parallel; no unique intersection exists.",
    );
    return { n: null, e: null, dist_from_p1: null, dist_from_p2: null, notes };
  }

  const diffE = input.e2 - input.e1;
  const diffN = input.n2 - input.n1;

  const t1 = (diffE * dy2 - diffN * dx2) / denom;
  const t2 = (diffE * dy1 - diffN * dx1) / denom;

  const intE = input.e1 + t1 * dx1;
  const intN = input.n1 + t1 * dy1;

  if (t1 < 0) {
    notes.push(
      "Intersection is behind point 1 (opposite the bearing direction).",
    );
  }
  if (t2 < 0) {
    notes.push(
      "Intersection is behind point 2 (opposite the bearing direction).",
    );
  }

  const d1 = Math.abs(t1);
  const d2 = Math.abs(t2);

  return {
    n: roundTo(intN, 4),
    e: roundTo(intE, 4),
    dist_from_p1: roundTo(d1, 4),
    dist_from_p2: roundTo(d2, 4),
    notes,
  };
}

function roundTo(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}
