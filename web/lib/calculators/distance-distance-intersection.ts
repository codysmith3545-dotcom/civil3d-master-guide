/**
 * Distance-distance intersection calculator.
 *
 * Pure functions; no DOM or React.
 *
 * Given two known points and a distance (radius) from each, computes the
 * intersection(s) of the two circles. Returns 0, 1, or 2 solutions.
 *
 * Method: standard two-circle intersection geometry.
 *
 * Reference: Wolf & Ghilani, Elementary Surveying, Ch. 11.
 */

export type DistanceDistanceInput = {
  n1: number;
  e1: number;
  /** Distance (radius) from point 1, ft. */
  d1_ft: number;
  n2: number;
  e2: number;
  /** Distance (radius) from point 2, ft. */
  d2_ft: number;
};

export type Solution = {
  n: number;
  e: number;
};

export type DistanceDistanceOutput = {
  solutions: Solution[];
  notes: string[];
};

export function compute(input: DistanceDistanceInput): DistanceDistanceOutput {
  const notes: string[] = [];

  if (input.d1_ft <= 0 || input.d2_ft <= 0) {
    notes.push("Both distances must be positive.");
    return { solutions: [], notes };
  }

  const dn = input.n2 - input.n1;
  const de = input.e2 - input.e1;
  const d = Math.sqrt(dn * dn + de * de);

  if (d < 1e-10) {
    notes.push("Points are coincident; infinite solutions exist if radii match, none otherwise.");
    return { solutions: [], notes };
  }

  const r1 = input.d1_ft;
  const r2 = input.d2_ft;

  if (d > r1 + r2 + 1e-8) {
    notes.push(
      "Circles do not intersect: the points are farther apart than the sum of the radii.",
    );
    return { solutions: [], notes };
  }
  if (d < Math.abs(r1 - r2) - 1e-8) {
    notes.push(
      "One circle is entirely inside the other; no intersection.",
    );
    return { solutions: [], notes };
  }

  // a = distance along the line P1-P2 to the perpendicular through the chord.
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const hSq = r1 * r1 - a * a;

  const solutions: Solution[] = [];

  if (hSq < -1e-8) {
    notes.push("No real intersection (numerical edge case).");
    return { solutions: [], notes };
  }

  const h = hSq < 0 ? 0 : Math.sqrt(hSq);

  // Midpoint of chord.
  const mN = input.n1 + a * (dn / d);
  const mE = input.e1 + a * (de / d);

  if (h < 1e-8) {
    // Tangent — one solution.
    solutions.push({ n: roundTo(mN, 4), e: roundTo(mE, 4) });
    notes.push("Tangent case: circles touch at exactly one point.");
  } else {
    // Perpendicular offset direction.
    const offN = h * (-de / d);
    const offE = h * (dn / d);
    solutions.push({
      n: roundTo(mN + offN, 4),
      e: roundTo(mE + offE, 4),
    });
    solutions.push({
      n: roundTo(mN - offN, 4),
      e: roundTo(mE - offE, 4),
    });
  }

  return { solutions, notes };
}

function roundTo(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}
