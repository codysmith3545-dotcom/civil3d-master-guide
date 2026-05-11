/**
 * Public types for @civil3d-master-guide/deed-parser.
 *
 * A "course" is one ordered call in a metes-and-bounds legal description —
 * either a straight line (bearing + distance) or a curve (with some subset
 * of radius / arc / delta / chord / chordBearing / tangent).
 *
 * Azimuth convention (decimal degrees, clockwise from north):
 *   0 = due north, 90 = due east, 180 = due south, 270 = due west.
 * This matches the convention used by mcp-server/src/calculators/traverse-closure.ts.
 */

export type BearingQuadrant = "NE" | "NW" | "SE" | "SW";

export interface Bearing {
  /** Original text as it appeared, e.g. "N 45°30'00\" E". */
  raw: string;
  /** Quadrant bearing decomposed. */
  quadrant: BearingQuadrant;
  degrees: number;
  minutes: number;
  seconds: number;
  /** Azimuth in decimal degrees from north, clockwise (0..360). */
  azimuthDeg: number;
}

export interface LineCourse {
  type: "line";
  bearing: Bearing;
  distanceFt: number;
  /** Full source text for this course (after normalization). */
  raw: string;
  /** Position in the deed: 0-based ordinal among parsed courses. */
  index: number;
}

export interface CurveCourse {
  type: "curve";
  /** Direction of curvature. */
  direction: "left" | "right";
  /** Chord bearing if specified. */
  chordBearing?: Bearing;
  chordFt?: number;
  radiusFt: number;
  arcLengthFt?: number;
  /** Delta (central angle) in decimal degrees. */
  deltaDeg?: number;
  /** Tangent length if specified. */
  tangentFt?: number;
  /** Full source text for this course (after normalization). */
  raw: string;
  /** Position in the deed: 0-based ordinal among parsed courses. */
  index: number;
}

export type Course = LineCourse | CurveCourse;

export interface UnparsedFragment {
  text: string;
  /** Byte offset in the original (pre-normalization is unreliable) — offset into normalizedText. */
  offset: number;
}

export interface ParsedTraverse {
  courses: Course[];
  /** Words/phrases the parser couldn't classify. Offsets are into normalizedText. */
  unparsed: UnparsedFragment[];
  /** Original input after whitespace + unicode normalization. */
  normalizedText: string;
}
