/**
 * Distance–distance intersection (two-circle intersection) calculator.
 *
 * Given two known points P1 and P2 and a distance from each, computes the
 * intersection point(s) of the two circles. Returns 0, 1, or 2 solutions.
 *
 * Formula: standard two-circle intersection (see derivation below).
 *
 * Reference: Wolf & Ghilani, *Elementary Surveying*, Ch. 10 (COGO);
 * Kavanagh & Mastin, *Surveying: Principles and Applications*, Ch. 11.
 */

export interface DistanceDistanceIntersectionInput {
  /** Northing of point 1 in feet. */
  n1: number;
  /** Easting of point 1 in feet. */
  e1: number;
  /** Distance from point 1 in feet. */
  d1_ft: number;
  /** Northing of point 2 in feet. */
  n2: number;
  /** Easting of point 2 in feet. */
  e2: number;
  /** Distance from point 2 in feet. */
  d2_ft: number;
}

export interface DistanceDistanceSolution {
  northing: number;
  easting: number;
}

export interface DistanceDistanceIntersectionResult {
  solutions: DistanceDistanceSolution[];
  source: string;
  notes: string[];
}

function r6(x: number): number {
  return Math.round(x * 1e6) / 1e6;
}

export function distanceDistanceIntersection(
  input: DistanceDistanceIntersectionInput,
): DistanceDistanceIntersectionResult {
  const notes: string[] = [];

  const dN = input.n2 - input.n1;
  const dE = input.e2 - input.e1;
  const d = Math.sqrt(dN ** 2 + dE ** 2);
  const r1 = input.d1_ft;
  const r2 = input.d2_ft;

  if (d < 1e-9) {
    if (Math.abs(r1 - r2) < 1e-9) {
      notes.push(
        "Points are coincident and distances are equal; infinite solutions exist (concentric circles).",
      );
    } else {
      notes.push(
        "Points are coincident but distances differ; no intersection exists.",
      );
    }
    return {
      solutions: [],
      source:
        "Distance–distance intersection (two-circle). " +
        "Reference: Wolf & Ghilani, Elementary Surveying, Ch. 10.",
      notes,
    };
  }

  // Check if circles are too far apart or one is inside the other
  if (d > r1 + r2 + 1e-9) {
    notes.push(
      "No intersection: the circles are too far apart (d > r1 + r2).",
    );
    return {
      solutions: [],
      source:
        "Distance–distance intersection (two-circle). " +
        "Reference: Wolf & Ghilani, Elementary Surveying, Ch. 10.",
      notes,
    };
  }
  if (d < Math.abs(r1 - r2) - 1e-9) {
    notes.push(
      "No intersection: one circle is entirely inside the other (d < |r1 - r2|).",
    );
    return {
      solutions: [],
      source:
        "Distance–distance intersection (two-circle). " +
        "Reference: Wolf & Ghilani, Elementary Surveying, Ch. 10.",
      notes,
    };
  }

  // a = distance from P1 to the line through the two intersection points
  // a = (d^2 + r1^2 - r2^2) / (2*d)
  const a = (d * d + r1 * r1 - r2 * r2) / (2 * d);

  // h = height from the P1-P2 line to the intersection points
  const hSquared = r1 * r1 - a * a;

  // Unit vector from P1 to P2
  const uN = dN / d;
  const uE = dE / d;

  // Midpoint on the P1-P2 line at distance a from P1
  const midN = input.n1 + a * uN;
  const midE = input.e1 + a * uE;

  const solutions: DistanceDistanceSolution[] = [];

  if (hSquared < 1e-9) {
    // Tangent case: single intersection
    solutions.push({
      northing: r6(midN),
      easting: r6(midE),
    });
    notes.push("Circles are tangent; exactly one intersection point.");
  } else {
    const h = Math.sqrt(hSquared);

    // Perpendicular direction (rotate unit vector 90°)
    const perpN = -uE;
    const perpE = uN;

    solutions.push({
      northing: r6(midN + h * perpN),
      easting: r6(midE + h * perpE),
    });
    solutions.push({
      northing: r6(midN - h * perpN),
      easting: r6(midE - h * perpE),
    });
  }

  return {
    solutions,
    source:
      "Distance–distance intersection (two-circle). " +
      "Reference: Wolf & Ghilani, Elementary Surveying, Ch. 10.",
    notes,
  };
}
