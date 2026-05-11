/**
 * Thin barrel that re-exports the public surface of the sibling deed-parser
 * and deed-plotter workspace packages. The UI imports from here so the
 * dependency direction stays one-way and so future swaps (e.g. server-side
 * parsing) only touch one file.
 */

import { parseDeedText } from "@civil3d-master-guide/deed-parser";
import { plotTraverse } from "@civil3d-master-guide/deed-plotter";

export { parseDeedText, plotTraverse };

export type {
  Bearing,
  BearingQuadrant,
  Course,
  LineCourse,
  CurveCourse,
  ParsedTraverse,
  UnparsedFragment,
} from "@civil3d-master-guide/deed-parser";

export type {
  Point,
  PlottedCourse,
  PlottedLine,
  PlottedCurve,
  PlottedTraverse,
  ClosureReport,
  Anomaly,
} from "@civil3d-master-guide/deed-plotter";
