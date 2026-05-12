/**
 * Bearing–distance intersection calculator.
 *
 * Given a line from P1 along a bearing (azimuth) and a circle of given radius
 * centered on P2, computes the intersection point(s). Returns 0, 1, or 2
 * solutions depending on whether the line misses, is tangent to, or passes
 * through the circle.
 *
 * Uses the standard line–circle intersection approach: substitute the
 * parametric line equation into the circle equation, solve the resulting
 * quadratic in t.
 *
 * Reference: Wolf & Ghilani, *Elementary Surveying*, Ch. 10 (COGO);
 * Kavanagh & Mastin, *Surveying: Principles and Applications*, Ch. 11.
 */

export interface BearingDistanceIntersectionInput {
  /** Northing of point 1 in feet (line origin). */
  n1: number;
  /** Easting of point 1 in feet (line origin). */
  e1: number;
  /** Azimuth from point 1 in decimal degrees (0=north, clockwise). */
  bearing_deg: number;
  /** Northing of point 2 in feet (circle center). */
  n2: number;
  /** Easting of point 2 in feet (circle center). */
  e2: number;
  /** Radius of the circle centered on P2, in feet. */
  distance_ft: number;
}

export interface BearingDistanceSolution {
  northing: number;
  easting: number;
}

export interface BearingDistanceIntersectionResult {
  solutions: BearingDistanceSolution[];
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

// TODO: no dedicated doc page yet for bearing-distance intersection.
const BD_RELATED: string | null = null;

const DEG = Math.PI / 180;

function r6(x: number): number {
  return Math.round(x * 1e6) / 1e6;
}

export function bearingDistanceIntersection(
  input: BearingDistanceIntersectionInput,
): BearingDistanceIntersectionResult {
  const notes: string[] = [];

  const n1 = requireFinite(input?.n1, "n1");
  const e1 = requireFinite(input?.e1, "e1");
  const bearingDeg = requireFinite(input?.bearing_deg, "bearing_deg");
  const n2 = requireFinite(input?.n2, "n2");
  const e2 = requireFinite(input?.e2, "e2");
  const distance = requireFinite(input?.distance_ft, "distance_ft");
  if (distance < 0) throw new Error("distance_ft must be >= 0");

  const az = bearingDeg * DEG;
  const dN = Math.cos(az); // unit direction northing
  const dE = Math.sin(az); // unit direction easting

  // Line: P(t) = P1 + t*(dN, dE)
  // Circle: (N - N2)^2 + (E - E2)^2 = r^2
  //
  // Substitute:
  //   (N1 + t*dN - N2)^2 + (E1 + t*dE - E2)^2 = r^2
  //
  // Let fN = N1 - N2, fE = E1 - E2:
  //   (fN + t*dN)^2 + (fE + t*dE)^2 = r^2
  //   (dN^2 + dE^2)*t^2 + 2*(fN*dN + fE*dE)*t + (fN^2 + fE^2 - r^2) = 0
  //
  // Since dN^2 + dE^2 = 1 (unit vector):
  //   t^2 + 2*b*t + c = 0  where b = fN*dN + fE*dE, c = fN^2 + fE^2 - r^2

  const fN = n1 - n2;
  const fE = e1 - e2;
  const r = distance;

  const b = fN * dN + fE * dE;
  const c = fN * fN + fE * fE - r * r;

  const disc = b * b - c;

  if (disc < -1e-9) {
    notes.push("No intersection: the bearing line does not intersect the circle.");
    return {
      solutions: [],
      source:
        "Bearing–distance intersection (line–circle). " +
        "Reference: Wolf & Ghilani, Elementary Surveying, Ch. 10.",
      notes,
      relatedContent: BD_RELATED,
    };
  }

  const solutions: BearingDistanceSolution[] = [];

  if (disc < 1e-9) {
    // Tangent case — single solution
    const t = -b;
    if (t < -1e-6) {
      notes.push(
        "The single tangent intersection lies behind P1 (opposite to the bearing direction).",
      );
    }
    solutions.push({
      northing: r6(n1 + t * dN),
      easting: r6(e1 + t * dE),
    });
    notes.push("Line is tangent to the circle; exactly one intersection.");
  } else {
    const sqrtDisc = Math.sqrt(disc);
    const t1 = -b + sqrtDisc;
    const t2v = -b - sqrtDisc;

    // Include both solutions; note if either is behind P1
    for (const [label, t] of [["first", t1], ["second", t2v]] as const) {
      solutions.push({
        northing: r6(n1 + (t as number) * dN),
        easting: r6(e1 + (t as number) * dE),
      });
      if ((t as number) < -1e-6) {
        notes.push(
          `The ${label} solution lies behind P1 (opposite to the bearing direction).`,
        );
      }
    }
  }

  for (const sol of solutions) {
    if (!Number.isFinite(sol.northing) || !Number.isFinite(sol.easting)) {
      throw new Error(
        "Calculation produced non-finite result for solutions: check inputs",
      );
    }
  }

  return {
    solutions,
    source:
      "Bearing–distance intersection (line–circle). " +
      "Reference: Wolf & Ghilani, Elementary Surveying, Ch. 10.",
    notes,
    relatedContent: BD_RELATED,
  };
}
