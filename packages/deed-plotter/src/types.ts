/**
 * Types for the deed-plotter package.
 *
 * Input types (Bearing, Course, ParsedTraverse) mirror the public contract
 * of @civil3d-master-guide/deed-parser (Agent 4B-1). They are re-declared
 * here so this package has zero runtime dependencies. Pass any plain object
 * matching ParsedTraverse to plotTraverse.
 *
 * Coordinate convention: north (n) and east (e) in feet. Azimuth is degrees
 * clockwise from north (0 = N, 90 = E, 180 = S, 270 = W).
 */

// ---------------------------------------------------------------------------
// Input types — must structurally match @civil3d-master-guide/deed-parser.
// ---------------------------------------------------------------------------

export type BearingQuadrant = "NE" | "NW" | "SE" | "SW";

export interface Bearing {
  raw: string;
  quadrant: BearingQuadrant;
  degrees: number;
  minutes: number;
  seconds: number;
  /** Azimuth in degrees; 0 = N, clockwise. */
  azimuthDeg: number;
}

export interface LineCourse {
  type: "line";
  bearing: Bearing;
  distanceFt: number;
  raw: string;
  index: number;
}

export interface CurveCourse {
  type: "curve";
  direction: "left" | "right";
  chordBearing?: Bearing;
  chordFt?: number;
  radiusFt: number;
  arcLengthFt?: number;
  deltaDeg?: number;
  tangentFt?: number;
  raw: string;
  index: number;
}

export type Course = LineCourse | CurveCourse;

export interface ParsedTraverse {
  courses: Course[];
  unparsed: { text: string; offset: number }[];
  normalizedText: string;
}

// ---------------------------------------------------------------------------
// Output types — produced by this package.
// ---------------------------------------------------------------------------

export interface Point {
  /** Northing, feet. */
  n: number;
  /** Easting, feet. */
  e: number;
}

export interface PlottedLine {
  type: "line";
  start: Point;
  end: Point;
  raw: string;
  index: number;
}

export interface PlottedCurve {
  type: "curve";
  start: Point;
  end: Point;
  center: Point;
  radiusFt: number;
  arcLengthFt: number;
  deltaDeg: number;
  direction: "left" | "right";
  raw: string;
  index: number;
}

export type PlottedCourse = PlottedLine | PlottedCurve;

export interface ClosureReport {
  perimeterFt: number;
  /** north residual = lastEnd.n - firstStart.n */
  closureErrorN: number;
  /** east residual = lastEnd.e - firstStart.e */
  closureErrorE: number;
  linearClosureFt: number;
  /** perimeter / linearClosure. Infinity when linearClosure is below 1e-9. */
  precisionRatio: number;
  /** Absolute area in square feet (shoelace). */
  areaSqFt: number;
  areaAcres: number;
}

export interface Anomaly {
  severity: "info" | "warning" | "error";
  courseIndex?: number;
  code: string;
  message: string;
}

export interface PlottedTraverse {
  courses: PlottedCourse[];
  closure: ClosureReport;
  anomalies: Anomaly[];
  bbox: { minN: number; minE: number; maxN: number; maxE: number };
}

export interface CurveSolution {
  radiusFt: number;
  arcLengthFt: number;
  deltaDeg: number;
  chordFt: number;
  /** Chord bearing — either passed through or computed from geometry. */
  chordBearing: Bearing;
  tangentFt: number;
  center: Point;
  endPoint: Point;
}

export interface SvgOptions {
  widthPx?: number;
  heightPx?: number;
  paddingPx?: number;
  showLabels?: boolean;
  showClosureError?: boolean;
  monumentPoints?: { point: Point; label?: string }[];
}
