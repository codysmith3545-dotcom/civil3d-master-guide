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
  relatedContent: string | null;
}

function requireFinite(value: unknown, name: string): number {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`Invalid input for ${name}: must be a finite number`);
  }
  return value;
}

const AREA_RELATED = "civil3d/parcels/parcel-sizing";

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
  if (!input || !Array.isArray(input.coordinates)) {
    throw new Error("Invalid input: coordinates must be an array");
  }
  const coords = input.coordinates;
  for (let i = 0; i < coords.length; i++) {
    requireFinite(coords[i]?.northing, `coordinates[${i}].northing`);
    requireFinite(coords[i]?.easting, `coordinates[${i}].easting`);
  }

  if (coords.length < 3) {
    throw new Error("At least three coordinates are required to form a closed polygon.");
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

  const result: AreaByCoordinatesResult = {
    area_sqft: r6(area),
    area_acres: r4(acres),
    perimeter_ft: r6(perimeter),
    is_clockwise: isClockwise,
    source:
      "Shoelace (Gauss's area) formula. Reference: Wolf & Ghilani, Elementary Surveying, Ch. 12.",
    notes,
    relatedContent: AREA_RELATED,
  };

  for (const key of ["area_sqft", "area_acres", "perimeter_ft"] as const) {
    if (!Number.isFinite(result[key])) {
      throw new Error(`Calculation produced non-finite result for ${key}: check inputs`);
    }
  }

  return result;
}
