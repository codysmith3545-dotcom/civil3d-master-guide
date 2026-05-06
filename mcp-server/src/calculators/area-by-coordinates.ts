/**
 * Area by coordinates (shoelace formula) calculator.
 *
 * Takes an ordered polygon defined by {northing, easting} coordinates and
 * computes the enclosed area, perimeter, and winding direction. The polygon
 * is auto-closed (last point connects back to first).
 *
 * Formula: Shoelace / Gauss's area formula.
 *   2A = sum_i (E_i * N_{i+1} - E_{i+1} * N_i)
 *
 * Reference: Wolf & Ghilani, *Elementary Surveying*, Ch. 12 (Area
 * computations by coordinates).
 */

export interface AreaCoordinate {
  northing: number;
  easting: number;
}

export interface AreaByCoordinatesInput {
  /** Ordered polygon vertices. Auto-closed; do not duplicate the first point. */
  coordinates: AreaCoordinate[];
}

export interface AreaByCoordinatesResult {
  area_sqft: number;
  area_acres: number;
  perimeter_ft: number;
  is_clockwise: boolean;
  source: string;
  notes: string[];
}

function r6(x: number): number {
  return Math.round(x * 1e6) / 1e6;
}

function r4(x: number): number {
  return Math.round(x * 1e4) / 1e4;
}

export function areaByCoordinates(
  input: AreaByCoordinatesInput,
): AreaByCoordinatesResult {
  const notes: string[] = [];
  const coords = input.coordinates;

  if (coords.length < 3) {
    notes.push("At least three coordinates are required to form a closed polygon.");
    return {
      area_sqft: 0,
      area_acres: 0,
      perimeter_ft: 0,
      is_clockwise: false,
      source: "",
      notes,
    };
  }

  const n = coords.length;

  // Signed area via shoelace formula
  let signedArea2 = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    signedArea2 += coords[i].easting * coords[j].northing;
    signedArea2 -= coords[j].easting * coords[i].northing;
  }
  const signedArea = signedArea2 / 2;
  const area = Math.abs(signedArea);

  // Clockwise if signed area is negative (in a N-up, E-right system)
  const isClockwise = signedArea < 0;

  // Perimeter
  let perimeter = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const dN = coords[j].northing - coords[i].northing;
    const dE = coords[j].easting - coords[i].easting;
    perimeter += Math.sqrt(dN ** 2 + dE ** 2);
  }

  const acres = area / 43560;

  if (n < 4) {
    notes.push("Triangle (3 vertices). Area is exact for planar coordinates.");
  }

  return {
    area_sqft: r6(area),
    area_acres: r4(acres),
    perimeter_ft: r6(perimeter),
    is_clockwise: isClockwise,
    source:
      "Shoelace (Gauss's area) formula. Reference: Wolf & Ghilani, Elementary Surveying, Ch. 12.",
    notes,
  };
}
