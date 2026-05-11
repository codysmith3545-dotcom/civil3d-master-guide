/**
 * Build a LandXmlSummary from a parsed root element.
 */

import type { LandXmlElement, LandXmlSummary, ValidationIssue } from "./types.js";
import { childrenNamed, findAll, findFirst } from "./parser.js";
import { parseCoordTriples, parseCoordPairs } from "./coords.js";
import { validate } from "./validate.js";

const METRIC_LINEAR = new Set(["meter", "metre", "millimeter", "kilometer"]);
const IMPERIAL_LINEAR = new Set(["foot", "USSurveyFoot", "InternationalFoot", "inch"]);

function attrAsNumber(el: LandXmlElement, name: string): number | undefined {
  const v = el.attrs[name];
  if (v === undefined || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function readApplication(root: LandXmlElement): LandXmlSummary["application"] {
  const a = findFirst(root, "Application");
  if (!a) return undefined;
  return {
    name: a.attrs["name"] || undefined,
    version: a.attrs["version"] || undefined,
    manufacturer: a.attrs["manufacturer"] || undefined,
  };
}

function readUnits(root: LandXmlElement): LandXmlSummary["units"] {
  const units = findFirst(root, "Units");
  if (!units) return undefined;
  // Inside <Units> there's typically one of <Imperial> or <Metric>.
  const candidate =
    findFirst(units, "Imperial", true) ||
    findFirst(units, "Metric", true) ||
    units;
  if (!candidate) return undefined;
  // We treat <Imperial> / <Metric> children as carrying the unit names.
  const linear = candidate.attrs["linearUnit"];
  const area = candidate.attrs["areaUnit"];
  const volume = candidate.attrs["volumeUnit"];
  const angular = candidate.attrs["angularUnit"];
  if (!linear && !area && !volume && !angular) return undefined;
  return { linear, area, volume, angular };
}

function summarizeSurface(s: LandXmlElement): LandXmlSummary["surfaces"][number] {
  const name = s.attrs["name"] || "(unnamed)";
  const pntsParent = findFirst(s, "Pnts");
  const facesParent = findFirst(s, "Faces");
  const points = pntsParent ? childrenNamed(pntsParent, "P") : [];
  const faces = facesParent ? childrenNamed(facesParent, "F") : [];

  let minElev: number | undefined;
  let maxElev: number | undefined;
  for (const p of points) {
    const triple = parseCoordTriples(p.text || "");
    if (!triple || triple.length < 1) continue;
    const z = triple[0]![2];
    if (!Number.isFinite(z)) continue;
    if (minElev === undefined || z < minElev) minElev = z;
    if (maxElev === undefined || z > maxElev) maxElev = z;
  }
  return {
    name,
    pntCount: points.length,
    faceCount: faces.length,
    minElev,
    maxElev,
  };
}

function summarizeAlignment(
  a: LandXmlElement,
): LandXmlSummary["alignments"][number] {
  const name = a.attrs["name"] || "(unnamed)";
  const staStart = attrAsNumber(a, "staStart") ?? 0;
  const length = attrAsNumber(a, "length") ?? 0;
  const staEnd = staStart + length;
  // PVIs live under ProfAlign nodes inside Profile children.
  const profAligns = findAll(a, "ProfAlign");
  let pviCount = 0;
  for (const pa of profAligns) pviCount += childrenNamed(pa, "PVI").length;
  return { name, staStart, staEnd, pviCount };
}

function summarizeParcel(p: LandXmlElement): LandXmlSummary["parcels"][number] {
  const name = p.attrs["name"] || "(unnamed)";
  const area = attrAsNumber(p, "area");
  const coordGeom = findFirst(p, "CoordGeom");
  let coordCount = 0;
  if (coordGeom) {
    for (const child of coordGeom.children) {
      // Lines and curves carry Start/End/Center Point children with text bodies.
      coordCount += findAll(child, "Start", true).length +
        findAll(child, "End", true).length;
    }
  }
  // Some files put coords directly under <PntList2D> or <PntList3D>.
  const list = findFirst(p, "PntList2D") || findFirst(p, "PntList3D");
  if (list && list.text) {
    const pairs = parseCoordPairs(list.text);
    coordCount = Math.max(coordCount, pairs.length);
  }
  return { name, areaSqFt: area, coordCount };
}

function summarizeSurvey(s: LandXmlElement): LandXmlSummary["surveys"][number] {
  const name =
    s.attrs["name"] ||
    findFirst(s, "SurveyHeader")?.attrs["name"] ||
    "(unnamed)";
  const instrumentCount = findAll(s, "InstrumentSetup").length;
  const observationCount =
    findAll(s, "RawObservation").length +
    findAll(s, "ReducedObservation").length +
    findAll(s, "ReducedArcObservation").length;
  return { name, instrumentCount, observationCount };
}

function summarizeCgPoints(root: LandXmlElement): LandXmlSummary["cgPoints"] {
  const cgPointsParent = findFirst(root, "CgPoints");
  const points = cgPointsParent
    ? childrenNamed(cgPointsParent, "CgPoint")
    : [];
  let minN = Infinity;
  let maxN = -Infinity;
  let minE = Infinity;
  let maxE = -Infinity;
  let counted = 0;
  for (const p of points) {
    const triples = parseCoordTriples(p.text || "");
    if (!triples || triples.length < 1) continue;
    const [n, e] = triples[0]!;
    if (!Number.isFinite(n) || !Number.isFinite(e)) continue;
    counted++;
    if (n < minN) minN = n;
    if (n > maxN) maxN = n;
    if (e < minE) minE = e;
    if (e > maxE) maxE = e;
  }
  if (counted === 0) {
    return {
      count: points.length,
      minNorthing: 0,
      maxNorthing: 0,
      minEasting: 0,
      maxEasting: 0,
    };
  }
  return {
    count: points.length,
    minNorthing: minN,
    maxNorthing: maxN,
    minEasting: minE,
    maxEasting: maxE,
  };
}

export function summarize(root: LandXmlElement): LandXmlSummary {
  const schemaVersion = root.attrs["version"] || "";
  const surfaces = findAll(root, "Surface").map(summarizeSurface);
  const alignments = findAll(root, "Alignment").map(summarizeAlignment);
  const parcels = findAll(root, "Parcel").map(summarizeParcel);
  const surveys = findAll(root, "Survey").map(summarizeSurvey);
  const cgPoints = summarizeCgPoints(root);

  const allIssues = validate(root);
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  for (const i of allIssues) {
    if (i.severity === "error") errors.push(i);
    else warnings.push(i);
  }

  return {
    schemaVersion,
    application: readApplication(root),
    units: readUnits(root),
    surfaces,
    alignments,
    parcels,
    surveys,
    cgPoints,
    warnings,
    errors,
  };
}

// Re-export the unit-classification helpers so other modules (validator)
// share the same definitions.
export { METRIC_LINEAR, IMPERIAL_LINEAR };
