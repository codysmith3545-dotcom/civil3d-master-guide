/**
 * Inverse (COGO) calculator.
 *
 * Given two points by northing/easting coordinates (in feet), computes:
 *   - azimuth from P1 to P2 (decimal degrees, north = 0 clockwise)
 *   - quadrant bearing string (e.g. "N 45°12'30\" E")
 *   - horizontal distance (feet)
 *   - delta northing and delta easting
 *
 * This is the fundamental "inverse" computation used in coordinate geometry
 * (COGO). Convention: azimuths measured clockwise from north.
 *
 * Reference: Wolf & Ghilani, *Elementary Surveying*, Ch. 10.
 */

export interface InverseInput {
  /** Northing of point 1 in feet. */
  n1: number;
  /** Easting of point 1 in feet. */
  e1: number;
  /** Northing of point 2 in feet. */
  n2: number;
  /** Easting of point 2 in feet. */
  e2: number;
}

export interface InverseResult {
  azimuth_deg: number;
  bearing_quadrant: string;
  distance_ft: number;
  delta_northing: number;
  delta_easting: number;
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

// TODO: no dedicated doc page; inverse is a generic COGO operation.
const INVERSE_RELATED: string | null = null;

const DEG = Math.PI / 180;

function r6(x: number): number {
  return Math.round(x * 1e6) / 1e6;
}

/**
 * Convert an azimuth (decimal degrees, 0=north, clockwise) to quadrant
 * bearing notation, e.g. "N 45°12'30\" E".
 */
function azimuthToQuadrantBearing(azDeg: number): string {
  // Normalize to [0, 360)
  let az = azDeg % 360;
  if (az < 0) az += 360;

  let ns: string;
  let ew: string;
  let angle: number;

  if (az >= 0 && az <= 90) {
    ns = "N";
    ew = "E";
    angle = az;
  } else if (az > 90 && az <= 180) {
    ns = "S";
    ew = "E";
    angle = 180 - az;
  } else if (az > 180 && az <= 270) {
    ns = "S";
    ew = "W";
    angle = az - 180;
  } else {
    ns = "N";
    ew = "W";
    angle = 360 - az;
  }

  const deg = Math.floor(angle);
  const minFloat = (angle - deg) * 60;
  const min = Math.floor(minFloat);
  let sec = Math.round((minFloat - min) * 60);

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

export function inverse(input: InverseInput): InverseResult {
  const notes: string[] = [];

  const n1 = requireFinite(input?.n1, "n1");
  const e1 = requireFinite(input?.e1, "e1");
  const n2 = requireFinite(input?.n2, "n2");
  const e2 = requireFinite(input?.e2, "e2");

  const dN = n2 - n1;
  const dE = e2 - e1;
  const dist = Math.sqrt(dN ** 2 + dE ** 2);

  if (dist < 1e-9) {
    notes.push("Points are coincident or nearly coincident; azimuth is undefined.");
    return {
      azimuth_deg: 0,
      bearing_quadrant: "N 00°00'00\" E",
      distance_ft: 0,
      delta_northing: 0,
      delta_easting: 0,
      source: "Inverse (COGO) computation. Reference: Wolf & Ghilani, Elementary Surveying, Ch. 10.",
      notes,
      relatedContent: INVERSE_RELATED,
    };
  }

  // atan2(dE, dN) gives angle from north (positive clockwise in standard math
  // convention when x=east, y=north)
  let azRad = Math.atan2(dE, dN);
  if (azRad < 0) azRad += 2 * Math.PI;
  const azDeg = azRad / DEG;

  const bearing = azimuthToQuadrantBearing(azDeg);

  const result: InverseResult = {
    azimuth_deg: r6(azDeg),
    bearing_quadrant: bearing,
    distance_ft: r6(dist),
    delta_northing: r6(dN),
    delta_easting: r6(dE),
    source: "Inverse (COGO) computation. Reference: Wolf & Ghilani, Elementary Surveying, Ch. 10.",
    notes,
    relatedContent: INVERSE_RELATED,
  };

  for (const key of ["azimuth_deg", "distance_ft", "delta_northing", "delta_easting"] as const) {
    if (!Number.isFinite(result[key])) {
      throw new Error(`Calculation produced non-finite result for ${key}: check inputs`);
    }
  }

  return result;
}
