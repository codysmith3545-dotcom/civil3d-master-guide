/**
 * Metes-and-bounds legal-description writer.
 *
 * Takes an array of {northing, easting} coordinates (in feet) forming a
 * closed polygon and produces a metes-and-bounds legal description string
 * in the conventional U.S. format:
 *
 *   "Beginning at a point ...; thence [bearing] [distance] feet to a point;
 *    thence ... to the Point of Beginning, containing [area] acres, more or
 *    less."
 *
 * Bearing format: quadrant notation (e.g. N 45°00'00" E).
 * Area computed via the surveyor's (shoelace) formula.
 *
 * Reference: standard survey practice; BLM Manual of Surveying Instructions
 * (2009), §3-100 et seq. for metes-and-bounds conventions.
 */

export interface Coordinate {
  northing: number;
  easting: number;
}

export interface MetesAndBoundsInput {
  /** Ordered polygon vertices. The polygon is auto-closed: the last point
   *  connects back to the first. Do not duplicate the first point at the end. */
  coordinates: Coordinate[];
}

export interface MetesAndBoundsResult {
  description: string;
  area_sqft: number;
  area_acres: number;
  perimeter_ft: number;
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

/**
 * Convert a delta-northing / delta-easting into a quadrant bearing string.
 * Returns e.g. "N 45°12'30\" E".
 */
function azimuthToQuadrant(dN: number, dE: number): string {
  // Determine quadrant prefix and suffix.
  let ns: string;
  let ew: string;

  if (dN >= 0) {
    ns = "N";
  } else {
    ns = "S";
  }
  if (dE >= 0) {
    ew = "E";
  } else {
    ew = "W";
  }

  // The angle is measured from the N-S axis toward the E-W axis.
  const absDN = Math.abs(dN);
  const absDE = Math.abs(dE);
  const angleDeg = Math.atan2(absDE, absDN) * (180 / Math.PI);

  const deg = Math.floor(angleDeg);
  const minFloat = (angleDeg - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60);

  // Handle 60-second rollover.
  let adjSec = sec;
  let adjMin = min;
  let adjDeg = deg;
  if (adjSec === 60) {
    adjSec = 0;
    adjMin += 1;
  }
  if (adjMin === 60) {
    adjMin = 0;
    adjDeg += 1;
  }

  const degStr = String(adjDeg).padStart(2, "0");
  const minStr = String(adjMin).padStart(2, "0");
  const secStr = String(adjSec).padStart(2, "0");

  return `${ns} ${degStr}°${minStr}'${secStr}" ${ew}`;
}

/**
 * Signed area of a polygon using the surveyor's (shoelace) formula.
 * Positive if vertices are counterclockwise.
 */
function signedArea(coords: Coordinate[]): number {
  let area = 0;
  const n = coords.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += coords[i].easting * coords[j].northing;
    area -= coords[j].easting * coords[i].northing;
  }
  return area / 2;
}

function r4(x: number): number {
  return Math.round(x * 1e4) / 1e4;
}

function r2(x: number): number {
  return Math.round(x * 100) / 100;
}

export function metesAndBoundsWriter(
  input: MetesAndBoundsInput,
): MetesAndBoundsResult {
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
  const parts: string[] = [];
  let perimeter = 0;

  for (let i = 0; i < n; i++) {
    const from = coords[i];
    const to = coords[(i + 1) % n];
    const dN = to.northing - from.northing;
    const dE = to.easting - from.easting;
    const dist = Math.sqrt(dN ** 2 + dE ** 2);
    perimeter += dist;

    const bearing = azimuthToQuadrant(dN, dE);
    const distStr = r2(dist).toFixed(2);

    if (i === 0) {
      parts.push(
        `Beginning at a point; thence ${bearing} a distance of ${distStr} feet to a point`,
      );
    } else if (i === n - 1) {
      parts.push(
        `thence ${bearing} a distance of ${distStr} feet to the Point of Beginning`,
      );
    } else {
      parts.push(
        `thence ${bearing} a distance of ${distStr} feet to a point`,
      );
    }
  }

  const areaSqft = Math.abs(signedArea(coords));
  const areaAcres = areaSqft / 43560;

  const description =
    parts.join("; ") +
    `, containing ${r4(areaAcres)} acres (${r2(areaSqft).toLocaleString("en-US")} sq ft), more or less.`;

  notes.push(
    "Bearings are in quadrant notation relative to the coordinate grid. " +
      "For a recorded legal description, bearings should reference a stated basis of bearing.",
  );
  notes.push(
    "Area computed by the coordinate (shoelace) method. Verify against CAD or plat computations.",
  );

  const result: MetesAndBoundsResult = {
    description,
    area_sqft: r2(areaSqft),
    area_acres: r4(areaAcres),
    perimeter_ft: r2(perimeter),
    source:
      "Standard metes-and-bounds format; area by coordinate method. " +
      "Reference: BLM Manual of Surveying Instructions (2009).",
    notes,
    relatedContent: "field-and-boundary/legal-descriptions/writing-metes-and-bounds",
  };

  for (const key of ["area_sqft", "area_acres", "perimeter_ft"] as const) {
    if (!Number.isFinite(result[key])) {
      throw new Error(`Calculation produced non-finite result for ${key}: check inputs`);
    }
  }

  return result;
}
