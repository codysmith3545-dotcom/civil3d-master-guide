/**
 * Bearing-distance intersection calculator.
 *
 * Pure functions; no DOM or React.
 *
 * Given a point with a bearing (azimuth) and a second point with a distance
 * (radius), computes the intersection(s) of the ray/line with the circle.
 * Returns 0, 1, or 2 solutions.
 *
 * Method: parametric line vs circle. The line from P1 in direction az1 is
 *   P = P1 + t * d1
 * The circle centered at P2 with radius r satisfies
 *   |P - P2|^2 = r^2
 * Substituting gives a quadratic in t.
 *
 * Reference: Wolf & Ghilani, Elementary Surveying, Ch. 11.
 */

export type BearingDistanceInput = {
  n1: number;
  e1: number;
  /** Azimuth from point 1, decimal degrees 0-360. */
  bearing_deg: number;
  n2: number;
  e2: number;
  /** Distance (radius) from point 2, ft. */
  distance_ft: number;
};

export type Solution = {
  n: number;
  e: number;
};

export type BearingDistanceOutput = {
  solutions: Solution[];
  notes: string[];
};

const DEG = Math.PI / 180;

export function compute(input: BearingDistanceInput): BearingDistanceOutput {
  const notes: string[] = [];

  if (input.distance_ft <= 0) {
    notes.push("Distance must be positive.");
    return { solutions: [], notes };
  }

  const az = input.bearing_deg * DEG;
  const dx = Math.sin(az);
  const dy = Math.cos(az);

  // Vector from P1 to P2.
  const fe = input.e2 - input.e1;
  const fn = input.n2 - input.n1;

  // Quadratic coefficients: a*t^2 + b*t + c = 0
  // a = dx^2 + dy^2 = 1  (unit direction)
  const b = -2 * (fe * dx + fn * dy);
  const c = fe * fe + fn * fn - input.distance_ft * input.distance_ft;
  const disc = b * b - 4 * c;

  if (disc < -1e-8) {
    notes.push(
      "No intersection: the bearing line does not reach the circle defined by the distance.",
    );
    return { solutions: [], notes };
  }

  const solutions: Solution[] = [];

  if (Math.abs(disc) < 1e-8) {
    // Tangent — one solution.
    const t = -b / 2;
    solutions.push({
      n: roundTo(input.n1 + t * dy, 4),
      e: roundTo(input.e1 + t * dx, 4),
    });
    notes.push("Tangent case: exactly one intersection.");
  } else {
    const sqrtDisc = Math.sqrt(disc);
    const t1 = (-b + sqrtDisc) / 2;
    const t2 = (-b - sqrtDisc) / 2;
    solutions.push({
      n: roundTo(input.n1 + t1 * dy, 4),
      e: roundTo(input.e1 + t1 * dx, 4),
    });
    solutions.push({
      n: roundTo(input.n1 + t2 * dy, 4),
      e: roundTo(input.e1 + t2 * dx, 4),
    });

    // Note if any solution is behind P1.
    if (t1 < 0 || t2 < 0) {
      notes.push(
        "One or both solutions are behind point 1 (opposite the bearing direction).",
      );
    }
  }

  return { solutions, notes };
}

function roundTo(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}
