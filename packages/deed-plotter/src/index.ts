/**
 * @civil3d-master-guide/deed-plotter
 *
 * Plot a parsed deed traverse (from @civil3d-master-guide/deed-parser, or any
 * structurally equivalent input) to coordinates and SVG, with closure
 * statistics and anomaly detection.
 */

export { plotTraverse } from "./plot.js";
export { solveCurve, outgoingTangentAzimuth, azimuthToBearing } from "./curve.js";
export { flagAnomalies } from "./anomalies.js";
export { renderSvg } from "./svg.js";

export type {
  Bearing,
  BearingQuadrant,
  Course,
  CurveCourse,
  LineCourse,
  ParsedTraverse,
  Point,
  PlottedCourse,
  PlottedCurve,
  PlottedLine,
  PlottedTraverse,
  ClosureReport,
  Anomaly,
  CurveSolution,
  SvgOptions,
} from "./types.js";

export type { CurveInput } from "./curve.js";
