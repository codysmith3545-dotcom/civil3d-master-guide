/**
 * Metes-and-bounds legal description writer.
 *
 * Pure functions; no DOM or React.
 *
 * Input: an ordered array of coordinate pairs (northing, easting) defining
 * a closed polygon in survey feet.
 *
 * Output: a text legal description with bearings and distances, plus area
 * (sq ft, acres) and perimeter.
 *
 * Reference: Wolf & Ghilani, Elementary Surveying; Brown, Robillard & Wilson,
 * Evidence and Procedures for Boundary Location.
 */

export type Coordinate = {
  northing: number;
  easting: number;
};

export type MetesAndBoundsInput = {
  coordinates: Coordinate[];
};

export type MetesAndBoundsOutput = {
  /** Formatted metes-and-bounds description. */
  description: string;
  /** Area in square feet via the coordinate (shoelace) method. */
  area_sqft: number;
  /** Area in acres. */
  area_acres: number;
  /** Perimeter in feet. */
  perimeter_ft: number;
  notes: string[];
};

export function compute(input: MetesAndBoundsInput): MetesAndBoundsOutput {
  const notes: string[] = [];
  const coords = input.coordinates;

  if (coords.length < 3) {
    notes.push("At least three coordinate pairs are required.");
    return {
      description: "",
      area_sqft: 0,
      area_acres: 0,
      perimeter_ft: 0,
      notes,
    };
  }

  // Build course descriptions.
  const courses: string[] = [];
  let perimeter = 0;

  for (let i = 0; i < coords.length; i++) {
    const from = coords[i];
    const to = coords[(i + 1) % coords.length];
    const dn = to.northing - from.northing;
    const de = to.easting - from.easting;
    const dist = Math.sqrt(dn * dn + de * de);
    perimeter += dist;

    const bearing = formatBearing(dn, de);
    courses.push(`${bearing}, a distance of ${dist.toFixed(2)} feet`);
  }

  // Area via shoelace.
  let twiceArea = 0;
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    twiceArea +=
      coords[i].easting * coords[j].northing -
      coords[j].easting * coords[i].northing;
  }
  const areaSqft = Math.abs(twiceArea) / 2;
  const areaAcres = areaSqft / 43560;

  const lines = [
    "Beginning at a point,",
    ...courses.map(
      (c, i) =>
        `thence ${c}${i < courses.length - 1 ? ";" : " to the Point of Beginning."}`,
    ),
    "",
    `Containing ${areaSqft.toFixed(1)} square feet (${areaAcres.toFixed(4)} acres), more or less.`,
  ];

  return {
    description: lines.join("\n"),
    area_sqft: roundTo(areaSqft, 2),
    area_acres: roundTo(areaAcres, 4),
    perimeter_ft: roundTo(perimeter, 2),
    notes,
  };
}

/**
 * Format a delta-northing / delta-easting pair as a quadrant bearing string
 * such as "N 45d 30' 15\" E".
 */
function formatBearing(dn: number, de: number): string {
  const azRad = Math.atan2(de, dn);
  let azDeg = azRad * (180 / Math.PI);
  if (azDeg < 0) azDeg += 360;

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
