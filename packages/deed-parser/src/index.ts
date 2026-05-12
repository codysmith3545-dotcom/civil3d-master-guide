/**
 * @civil3d-master-guide/deed-parser
 *
 * Zero-dependency TypeScript library that parses the metes-and-bounds portion
 * of a U.S. legal description into a normalized ordered list of line and
 * curve courses.
 *
 * Public API:
 *
 *   import { parseDeedText, parseBearing, parseCurveCall } from
 *     "@civil3d-master-guide/deed-parser";
 *
 *   const t = parseDeedText("Beginning at a point ... thence N 45°00'00\" E,
 *     100.00 feet; thence S 45°00'00\" E, 100.00 feet; thence S 45°00'00\" W,
 *     100.00 feet; thence N 45°00'00\" W, 100.00 feet to the point of
 *     beginning.");
 *   // t.courses = [LineCourse, LineCourse, LineCourse, LineCourse]
 *
 * The package does NOT compute geometry (closure error, area, missing curve
 * elements). For that, downstream consumers should feed the parsed traverse
 * into the calculators in @civil3d-master-guide/sdk or the MCP server.
 */

export { parseDeedText } from "./parse.js";
export { parseBearing, azimuthFromQuadrant } from "./bearing.js";
export { parseCurveCall } from "./curve.js";
export { parseDistance } from "./distance.js";
export { normalizeDeedText } from "./normalize.js";

export type {
  Bearing,
  BearingQuadrant,
  Course,
  LineCourse,
  CurveCourse,
  ParsedTraverse,
  UnparsedFragment,
} from "./types.js";

export type { ParsedDistance } from "./distance.js";
