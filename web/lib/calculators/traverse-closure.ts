/**
 * Traverse closure calculator with Compass (Bowditch) adjustment.
 *
 * Pure functions; no DOM or React.
 *
 * Input: an array of legs, each with a bearing (decimal degrees from north,
 * clockwise 0-360) and a horizontal distance in feet.
 *
 * Output: latitude, departure, adjusted coordinates, closure error, and
 * precision ratio.
 *
 * Adjustment method: Compass Rule (Bowditch) — corrections proportional to
 * leg distance / total perimeter.
 *
 * Reference: Wolf & Ghilani, Elementary Surveying, Ch. 10.
 */

export type TraverseLeg = {
  /** Bearing / azimuth in decimal degrees, 0-360 clockwise from north. */
  bearing_deg: number;
  /** Horizontal distance, ft. */
  distance_ft: number;
};

export type TraverseClosureInput = {
  legs: TraverseLeg[];
};

export type AdjustedLeg = {
  bearing_deg: number;
  distance_ft: number;
  latitude: number;
  departure: number;
  adj_latitude: number;
  adj_departure: number;
};

export type TraverseClosureOutput = {
  perimeter_ft: number;
  legs: AdjustedLeg[];
  closure_error_north: number;
  closure_error_east: number;
  linear_closure_ft: number;
  precision_ratio: string;
  notes: string[];
};

const DEG = Math.PI / 180;

export function compute(input: TraverseClosureInput): TraverseClosureOutput {
  const notes: string[] = [];

  if (input.legs.length < 2) {
    notes.push("At least two legs are required for a traverse.");
    return {
      perimeter_ft: 0,
      legs: [],
      closure_error_north: 0,
      closure_error_east: 0,
      linear_closure_ft: 0,
      precision_ratio: "N/A",
      notes,
    };
  }

  // Compute raw latitudes and departures.
  const rawLegs = input.legs.map((leg) => {
    const az = leg.bearing_deg * DEG;
    const lat = leg.distance_ft * Math.cos(az);
    const dep = leg.distance_ft * Math.sin(az);
    return { ...leg, latitude: lat, departure: dep };
  });

  const perimeter = rawLegs.reduce((s, l) => s + l.distance_ft, 0);
  const sumLat = rawLegs.reduce((s, l) => s + l.latitude, 0);
  const sumDep = rawLegs.reduce((s, l) => s + l.departure, 0);

  // Compass (Bowditch) adjustment.
  const adjusted: AdjustedLeg[] = rawLegs.map((l) => {
    const corrLat = l.latitude - (sumLat * l.distance_ft) / perimeter;
    const corrDep = l.departure - (sumDep * l.distance_ft) / perimeter;
    return {
      bearing_deg: l.bearing_deg,
      distance_ft: l.distance_ft,
      latitude: roundTo(l.latitude, 4),
      departure: roundTo(l.departure, 4),
      adj_latitude: roundTo(corrLat, 4),
      adj_departure: roundTo(corrDep, 4),
    };
  });

  const linearClosure = Math.sqrt(sumLat * sumLat + sumDep * sumDep);
  const ratio =
    linearClosure > 0 ? Math.round(perimeter / linearClosure) : Infinity;
  const precisionRatio =
    ratio === Infinity ? "Perfect closure" : `1:${ratio.toLocaleString()}`;

  return {
    perimeter_ft: roundTo(perimeter, 3),
    legs: adjusted,
    closure_error_north: roundTo(sumLat, 4),
    closure_error_east: roundTo(sumDep, 4),
    linear_closure_ft: roundTo(linearClosure, 4),
    precision_ratio: precisionRatio,
    notes,
  };
}

function roundTo(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}
