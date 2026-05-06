/**
 * Area-by-coordinates (shoelace / coordinate method) calculator.
 *
 * Pure functions; no DOM or React.
 *
 * Input: an ordered array of coordinate pairs (northing, easting) defining
 * a closed polygon in survey feet.
 *
 * Output: area in sq ft and acres, plus perimeter.
 *
 * Formula (shoelace):
 *   2A = |Σ (E_i * N_{i+1} - E_{i+1} * N_i)|
 *
 * Reference: Wolf & Ghilani, Elementary Surveying, Ch. 12.
 */

export type Coordinate = {
  northing: number;
  easting: number;
};

export type AreaByCoordinatesInput = {
  coordinates: Coordinate[];
};

export type AreaByCoordinatesOutput = {
  area_sqft: number;
  area_acres: number;
  perimeter_ft: number;
  notes: string[];
};

export function compute(input: AreaByCoordinatesInput): AreaByCoordinatesOutput {
  const notes: string[] = [];
  const coords = input.coordinates;

  if (coords.length < 3) {
    notes.push("At least three coordinate pairs are required to define an area.");
    return { area_sqft: 0, area_acres: 0, perimeter_ft: 0, notes };
  }

  // Shoelace formula.
  let twiceArea = 0;
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    twiceArea +=
      coords[i].easting * coords[j].northing -
      coords[j].easting * coords[i].northing;
  }
  const areaSqft = Math.abs(twiceArea) / 2;
  const areaAcres = areaSqft / 43560;

  // Perimeter.
  let perimeter = 0;
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    const dn = coords[j].northing - coords[i].northing;
    const de = coords[j].easting - coords[i].easting;
    perimeter += Math.sqrt(dn * dn + de * de);
  }

  return {
    area_sqft: roundTo(areaSqft, 2),
    area_acres: roundTo(areaAcres, 4),
    perimeter_ft: roundTo(perimeter, 2),
    notes,
  };
}

function roundTo(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}
