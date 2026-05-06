/**
 * Traverse closure calculator.
 *
 * Takes an array of traverse legs (bearing in decimal degrees from north
 * clockwise, distance in feet) and computes:
 *   - latitude (north) and departure (east) for each leg
 *   - sum of latitudes, sum of departures
 *   - closure error (north and east components)
 *   - linear closure (distance of the error vector)
 *   - precision ratio (perimeter / linear closure)
 *   - compass-rule adjusted coordinates
 *
 * Bearing convention: 0° = due north, 90° = due east, 180° = due south,
 * 270° = due west. This is azimuth-style, not quadrant-bearing notation.
 *
 * Reference: Wolf & Ghilani, *Elementary Surveying*, Ch. 10 (Traverse
 * computations and adjustments).
 */

export interface TraverseLeg {
  /** Azimuth bearing in decimal degrees (0 = north, clockwise). */
  bearing_deg: number;
  /** Distance in feet. */
  distance_ft: number;
}

export interface TraverseClosureInput {
  legs: TraverseLeg[];
}

export interface AdjustedLeg {
  bearing_deg: number;
  distance_ft: number;
  latitude: number;
  departure: number;
  adj_latitude: number;
  adj_departure: number;
  adj_northing: number;
  adj_easting: number;
}

export interface TraverseClosureResult {
  perimeter_ft: number;
  legs: AdjustedLeg[];
  sum_latitude: number;
  sum_departure: number;
  closure_error_north: number;
  closure_error_east: number;
  linear_closure_ft: number;
  precision_ratio: string;
  source: string;
  notes: string[];
}

const DEG = Math.PI / 180;

function r6(x: number): number {
  return Math.round(x * 1e6) / 1e6;
}

export function traverseClosure(input: TraverseClosureInput): TraverseClosureResult {
  const notes: string[] = [];

  if (input.legs.length < 2) {
    notes.push("A traverse must have at least two legs.");
  }

  // Compute raw latitudes and departures.
  let sumLat = 0;
  let sumDep = 0;
  let perimeter = 0;

  const rawLegs = input.legs.map((leg) => {
    const rad = leg.bearing_deg * DEG;
    const lat = leg.distance_ft * Math.cos(rad);
    const dep = leg.distance_ft * Math.sin(rad);
    sumLat += lat;
    sumDep += dep;
    perimeter += leg.distance_ft;
    return { bearing_deg: leg.bearing_deg, distance_ft: leg.distance_ft, lat, dep };
  });

  // Closure error: for a closed traverse, sum of latitudes and departures
  // should each be zero. The residuals are the closure error.
  const closureNorth = sumLat;
  const closureEast = sumDep;
  const linearClosure = Math.sqrt(closureNorth ** 2 + closureEast ** 2);

  let precisionStr: string;
  if (linearClosure < 1e-9) {
    precisionStr = "perfect (no closure error)";
  } else {
    const ratio = Math.round(perimeter / linearClosure);
    precisionStr = `1:${ratio}`;
  }

  // Compass rule adjustment: distribute the closure error proportionally
  // to each leg's distance / total perimeter.
  const adjustedLegs: AdjustedLeg[] = [];
  let runningNorthing = 0;
  let runningEasting = 0;

  for (const leg of rawLegs) {
    const proportion = leg.distance_ft / perimeter;
    const adjLat = leg.lat - closureNorth * proportion;
    const adjDep = leg.dep - closureEast * proportion;
    runningNorthing += adjLat;
    runningEasting += adjDep;

    adjustedLegs.push({
      bearing_deg: leg.bearing_deg,
      distance_ft: r6(leg.distance_ft),
      latitude: r6(leg.lat),
      departure: r6(leg.dep),
      adj_latitude: r6(adjLat),
      adj_departure: r6(adjDep),
      adj_northing: r6(runningNorthing),
      adj_easting: r6(runningEasting),
    });
  }

  if (input.legs.length >= 3 && linearClosure > 0) {
    const ratio = perimeter / linearClosure;
    if (ratio < 5000) {
      notes.push(
        "Precision ratio is below 1:5000. Check for blunders before adjusting.",
      );
    }
  }

  return {
    perimeter_ft: r6(perimeter),
    legs: adjustedLegs,
    sum_latitude: r6(sumLat),
    sum_departure: r6(sumDep),
    closure_error_north: r6(closureNorth),
    closure_error_east: r6(closureEast),
    linear_closure_ft: r6(linearClosure),
    precision_ratio: precisionStr,
    source:
      "Compass rule adjustment. Reference: Wolf & Ghilani, Elementary Surveying, Ch. 10.",
    notes,
  };
}
