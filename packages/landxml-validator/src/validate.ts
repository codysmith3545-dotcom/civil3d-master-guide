/**
 * Validation rules for LandXML.
 *
 * Rule table (matches README + summary):
 *
 *   MISSING_VERSION        error    <LandXML> lacks `version`
 *   UNSUPPORTED_VERSION    warning  version not 1.2 or 2.0
 *   MISSING_UNITS          warning  no <Units> block
 *   MIXED_UNITS            error    metric and imperial children both present
 *   EMPTY_SURFACE          warning  <Surface> has no points
 *   ALIGNMENT_NO_GEOM      error    <Alignment> has no geometry children
 *   PARCEL_NOT_CLOSED      warning  first/last coord differ by > 0.01
 *   NEGATIVE_AREA          warning  area attribute < 0
 *   INVALID_COORD          error    coord with NaN
 *   LARGE_COORD            info     coord > 1e7 (likely lat/lng misclassified)
 */

import type { LandXmlElement, ValidationIssue } from "./types.js";
import { childrenNamed, findAll, findFirst } from "./parser.js";
import { parseCoordPairs, tokenizeNumbers } from "./coords.js";

const SUPPORTED_VERSIONS = new Set(["1.2", "2.0"]);
const COORD_BEARING_ELEMENTS = new Set(["P", "Start", "End", "Center", "PI"]);
const POINT_LIST_ELEMENTS = new Set(["PntList2D", "PntList3D"]);
const LARGE_COORD_THRESHOLD = 1e7;
const PARCEL_CLOSE_TOL = 0.01;

function checkVersion(root: LandXmlElement, issues: ValidationIssue[]): void {
  const v = root.attrs["version"];
  if (v === undefined) {
    issues.push({
      severity: "error",
      code: "MISSING_VERSION",
      message: "<LandXML> root element is missing the required `version` attribute.",
      xpath: "/LandXML",
    });
    return;
  }
  if (!SUPPORTED_VERSIONS.has(v)) {
    issues.push({
      severity: "warning",
      code: "UNSUPPORTED_VERSION",
      message: `LandXML schema version "${v}" is outside the supported set (1.2, 2.0). Downstream tools may reject the file.`,
      xpath: "/LandXML",
    });
  }
}

function checkUnits(root: LandXmlElement, issues: ValidationIssue[]): void {
  const units = findFirst(root, "Units");
  if (!units) {
    issues.push({
      severity: "warning",
      code: "MISSING_UNITS",
      message:
        "No <Units> block found. Consumers will guess units (usually USFt vs Meter) and may misplace geometry.",
      xpath: "/LandXML/Units",
    });
    return;
  }
  const hasMetric = findFirst(units, "Metric", true) !== undefined;
  const hasImperial = findFirst(units, "Imperial", true) !== undefined;
  if (hasMetric && hasImperial) {
    issues.push({
      severity: "error",
      code: "MIXED_UNITS",
      message:
        "<Units> contains both <Metric> and <Imperial> children. The schema permits only one.",
      xpath: "/LandXML/Units",
    });
  }
}

function checkSurfaces(root: LandXmlElement, issues: ValidationIssue[]): void {
  const surfaces = findAll(root, "Surface");
  for (const s of surfaces) {
    const name = s.attrs["name"] || "(unnamed)";
    const pntsParent = findFirst(s, "Pnts");
    const points = pntsParent ? childrenNamed(pntsParent, "P") : [];
    if (points.length === 0) {
      issues.push({
        severity: "warning",
        code: "EMPTY_SURFACE",
        message: `Surface "${name}" has no <Pnts>/<P> point children. The surface will import empty.`,
        xpath: `//Surface[@name='${name}']/Definition/Pnts`,
      });
    }
  }
}

function checkAlignments(root: LandXmlElement, issues: ValidationIssue[]): void {
  const alignments = findAll(root, "Alignment");
  for (const a of alignments) {
    const name = a.attrs["name"] || "(unnamed)";
    const coordGeom = findFirst(a, "CoordGeom");
    const hasGeom =
      coordGeom !== undefined &&
      coordGeom.children.length > 0;
    if (!hasGeom) {
      issues.push({
        severity: "error",
        code: "ALIGNMENT_NO_GEOM",
        message: `Alignment "${name}" has no <CoordGeom> children (Line / Curve / Spiral). It will not produce a usable horizontal alignment.`,
        xpath: `//Alignment[@name='${name}']/CoordGeom`,
      });
    }
  }
}

function checkParcels(root: LandXmlElement, issues: ValidationIssue[]): void {
  const parcels = findAll(root, "Parcel");
  for (const p of parcels) {
    const name = p.attrs["name"] || "(unnamed)";
    // Negative area
    const areaStr = p.attrs["area"];
    if (areaStr !== undefined && areaStr !== "") {
      const a = Number(areaStr);
      if (Number.isFinite(a) && a < 0) {
        issues.push({
          severity: "warning",
          code: "NEGATIVE_AREA",
          message: `Parcel "${name}" reports a negative area (${a}).`,
          xpath: `//Parcel[@name='${name}']/@area`,
        });
      }
    }
    // Closure check from explicit point list (most common in test fixtures)
    const list = findFirst(p, "PntList2D") || findFirst(p, "PntList3D");
    if (list && list.text) {
      const pairs = parseCoordPairs(list.text);
      if (pairs.length >= 2) {
        const first = pairs[0]!;
        const last = pairs[pairs.length - 1]!;
        const dn = first[0] - last[0];
        const de = first[1] - last[1];
        const d = Math.hypot(dn, de);
        if (d > PARCEL_CLOSE_TOL) {
          issues.push({
            severity: "warning",
            code: "PARCEL_NOT_CLOSED",
            message: `Parcel "${name}" boundary does not close: first/last vertex differ by ${d.toFixed(3)}.`,
            xpath: `//Parcel[@name='${name}']`,
          });
        }
      }
    }
  }
}

interface CoordCheckTarget {
  el: LandXmlElement;
  xpath: string;
}

function collectCoordTextElements(root: LandXmlElement): CoordCheckTarget[] {
  const out: CoordCheckTarget[] = [];
  // BFS over the entire tree, capturing elements whose name suggests
  // numeric coordinate text (single-coord or list).
  const stack: { el: LandXmlElement; path: string }[] = [
    { el: root, path: `/${root.name}` },
  ];
  while (stack.length > 0) {
    const { el, path } = stack.pop()!;
    if (
      (COORD_BEARING_ELEMENTS.has(el.name) || POINT_LIST_ELEMENTS.has(el.name)) &&
      el.text
    ) {
      out.push({ el, xpath: path });
    }
    // Push children for traversal.
    const counts: Record<string, number> = {};
    for (const c of el.children) {
      counts[c.name] = (counts[c.name] ?? 0) + 1;
      const idx = counts[c.name]!;
      stack.push({ el: c, path: `${path}/${c.name}[${idx}]` });
    }
  }
  return out;
}

function checkCoords(root: LandXmlElement, issues: ValidationIssue[]): void {
  const targets = collectCoordTextElements(root);
  for (const t of targets) {
    const nums = tokenizeNumbers(t.el.text || "");
    let badCount = 0;
    let largeCount = 0;
    for (const n of nums) {
      if (Number.isNaN(n)) badCount++;
      else if (Math.abs(n) > LARGE_COORD_THRESHOLD) largeCount++;
    }
    if (badCount > 0) {
      issues.push({
        severity: "error",
        code: "INVALID_COORD",
        message: `<${t.el.name}> contains ${badCount} non-numeric coordinate token(s).`,
        xpath: t.xpath,
      });
    }
    if (largeCount > 0) {
      issues.push({
        severity: "info",
        code: "LARGE_COORD",
        message: `<${t.el.name}> has ${largeCount} coordinate token(s) with |value| > 1e7. Verify units; likely a lat/lng pasted into a state-plane file.`,
        xpath: t.xpath,
      });
    }
  }
}

/**
 * Run all validation rules over the parsed document. Returns issues in
 * declaration order (version, units, surfaces, alignments, parcels, coords).
 */
export function validate(root: LandXmlElement): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  checkVersion(root, issues);
  checkUnits(root, issues);
  checkSurfaces(root, issues);
  checkAlignments(root, issues);
  checkParcels(root, issues);
  checkCoords(root, issues);
  return issues;
}
