/**
 * Grid-to-ground (and ground-to-grid) distance conversion.
 *
 * Pure functions; no DOM or React.
 *
 * Given a Combined Scale Factor (CSF) and a distance, converts between
 * State Plane grid distances and ground (surface) distances.
 *
 *   ground = grid / CSF
 *   grid   = ground * CSF
 *
 * Reference: Stem, J.E., "State Plane Coordinate System of 1983,"
 * NOAA Manual NOS NGS 5.
 */

export type GridToGroundMode = "grid-to-ground" | "ground-to-grid";

export type GridToGroundInput = {
  mode: GridToGroundMode;
  /** Combined Scale Factor (dimensionless, typically near 1.0). */
  csf: number;
  /** Distance to convert, ft. */
  distance_ft: number;
};

export type GridToGroundOutput = {
  /** Converted distance, ft. */
  converted_ft: number;
  notes: string[];
};

export function compute(input: GridToGroundInput): GridToGroundOutput {
  const notes: string[] = [];

  if (input.csf <= 0) {
    notes.push("CSF must be positive.");
    return { converted_ft: 0, notes };
  }
  if (input.distance_ft < 0) {
    notes.push("Distance should be non-negative.");
  }

  if (Math.abs(input.csf - 1.0) > 0.01) {
    notes.push(
      "CSF deviates from 1.0 by more than 0.01; double-check the value.",
    );
  }

  let converted: number;
  if (input.mode === "grid-to-ground") {
    converted = input.distance_ft / input.csf;
  } else {
    converted = input.distance_ft * input.csf;
  }

  return {
    converted_ft: roundTo(converted, 4),
    notes,
  };
}

function roundTo(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}
