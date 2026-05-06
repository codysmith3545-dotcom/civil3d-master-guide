/**
 * Inverse computation between two coordinate pairs.
 *
 * Pure functions; no DOM or React.
 *
 * Given two points (N1, E1) and (N2, E2) in survey feet, computes the
 * azimuth, quadrant bearing, horizontal distance, and coordinate deltas.
 *
 * Reference: Wolf & Ghilani, Elementary Surveying, Ch. 11.
 */

export type InverseInput = {
  n1: number;
  e1: number;
  n2: number;
  e2: number;
};

export type InverseOutput = {
  /** Azimuth from point 1 to point 2, decimal degrees (0-360, clockwise from north). */
  azimuth_deg: number;
  /** Quadrant bearing string, e.g. "N 45d 30' 15\" E". */
  bearing_quadrant: string;
  /** Horizontal distance, ft. */
  distance_ft: number;
  /** Change in northing (N2 - N1). */
  delta_n: number;
  /** Change in easting (E2 - E1). */
  delta_e: number;
  notes: string[];
};

export function compute(input: InverseInput): InverseOutput {
  const notes: string[] = [];
  const dn = input.n2 - input.n1;
  const de = input.e2 - input.e1;
  const dist = Math.sqrt(dn * dn + de * de);

  if (dist < 1e-10) {
    notes.push("Points are coincident or nearly so.");
    return {
      azimuth_deg: 0,
      bearing_quadrant: "N 00d 00' 00\" E",
      distance_ft: 0,
      delta_n: 0,
      delta_e: 0,
      notes,
    };
  }

  let azDeg = Math.atan2(de, dn) * (180 / Math.PI);
  if (azDeg < 0) azDeg += 360;

  const bearing = formatBearing(azDeg);

  return {
    azimuth_deg: roundTo(azDeg, 6),
    bearing_quadrant: bearing,
    distance_ft: roundTo(dist, 4),
    delta_n: roundTo(dn, 4),
    delta_e: roundTo(de, 4),
    notes,
  };
}

function formatBearing(azDeg: number): string {
  let ns: string;
  let ew: string;
  let angle: number;

  if (azDeg >= 0 && azDeg < 90) {
    ns = "N";
    ew = "E";
    angle = azDeg;
  } else if (azDeg >= 90 && azDeg < 180) {
    ns = "S";
    ew = "E";
    angle = 180 - azDeg;
  } else if (azDeg >= 180 && azDeg < 270) {
    ns = "S";
    ew = "W";
    angle = azDeg - 180;
  } else {
    ns = "N";
    ew = "W";
    angle = 360 - azDeg;
  }

  const deg = Math.floor(angle);
  const minFloat = (angle - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = (minFloat - min) * 60;

  return `${ns} ${deg.toString().padStart(2, "0")}d ${min.toString().padStart(2, "0")}' ${sec.toFixed(0).padStart(2, "0")}" ${ew}`;
}

function roundTo(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}
