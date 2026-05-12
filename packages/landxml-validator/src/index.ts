/**
 * @civil3d-master-guide/landxml-validator
 *
 * Pure TypeScript LandXML parser, summarizer, and validator with zero
 * runtime dependencies. Works in Node.js, browsers, edge runtimes.
 */

export { parseLandXml, findFirst, findAll, childrenNamed, LandXmlParseError } from "./parser.js";
export { summarize } from "./summarize.js";
export { validate } from "./validate.js";
export { emitCanonical } from "./emit.js";
export {
  parseCoordTriples,
  parseCoordPairs,
  tokenizeNumbers,
  type Coord2,
  type Coord3,
} from "./coords.js";

export type {
  LandXmlElement,
  LandXmlSummary,
  ValidationIssue,
  ValidationCode,
  IssueSeverity,
} from "./types.js";
