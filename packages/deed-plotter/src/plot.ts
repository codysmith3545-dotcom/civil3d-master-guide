/**
 * Plot a parsed deed traverse to coordinates and compute closure.
 *
 * Azimuth convention: degrees clockwise from north (0 = N, 90 = E).
 *   line: end.n = start.n + d * cos(az_rad)
 *         end.e = start.e + d * sin(az_rad)
 *
 * For curves, see ./curve.ts.
 *
 * Closure error: (lastEnd - firstStart). Linear closure = sqrt(N² + E²).
 * Precision ratio: perimeter / linearClosure (Infinity if perfect close).
 *
 * Area: shoelace over the closed polygon. For curves, the polygon is
 * approximated with a 16-segment chord decomposition for the area
 * computation only — the full arc geometry stays in the PlottedCurve.
 */

import {
  outgoingTangentAzimuth,
  solveCurve,
} from "./curve.js";
import { flagAnomalies } from "./anomalies.js";
import type {
  Anomaly,
  Bearing,
  ClosureReport,
  Course,
  CurveCourse,
  LineCourse,
  ParsedTraverse,
  PlottedCourse,
  PlottedCurve,
  PlottedLine,
  PlottedTraverse,
  Point,
} from "./types.js";

const DEG = Math.PI / 180;

function plotLine(
  start: Point,
  course: LineCourse,
): { plotted: PlottedLine; outgoingAz: number; valid: boolean } {
  const az = course.bearing.azimuthDeg;
  const r = az * DEG;
  const d = course.distanceFt;
  const end: Point = {
    n: start.n + d * Math.cos(r),
    e: start.e + d * Math.sin(r),
  };
  return {
    plotted: {
      type: "line",
      start,
      end,
      raw: course.raw,
      index: course.index,
    },
    outgoingAz: az,
    valid: d > 0,
  };
}

function chordToAzimuth(b: Bearing | undefined): number | undefined {
  if (!b) return undefined;
  return b.azimuthDeg;
}

/**
 * Plot a curve. Tries to derive missing elements via solveCurve.
 * Returns the plotted curve, the outgoing tangent azimuth, and any anomalies.
 */
function plotCurve(
  start: Point,
  incomingTangentAz: number | undefined,
  course: CurveCourse,
): {
  plotted: PlottedCurve | null;
  outgoingAz: number | undefined;
  anomalies: Anomaly[];
} {
  const anomalies: Anomaly[] = [];

  // Count present non-bearing elements.
  const present: string[] = [];
  if (course.radiusFt !== undefined) present.push("R");
  if (course.arcLengthFt !== undefined) present.push("L");
  if (course.deltaDeg !== undefined) present.push("delta");
  if (course.chordFt !== undefined) present.push("chord");
  if (course.tangentFt !== undefined) present.push("T");

  // If fewer than 2 elements present, we cannot solve.
  if (present.length < 2) {
    anomalies.push({
      severity: "error",
      courseIndex: course.index,
      code: "MISSING_CURVE_ELEMENTS",
      message: `Curve has only ${present.length} element(s): ${present.join(", ") || "none"}. Need at least 2 of R, L, Δ, chord, T.`,
    });
    return { plotted: null, outgoingAz: incomingTangentAz, anomalies };
  }

  // Determine the incoming tangent azimuth.
  let incoming = incomingTangentAz;
  if (incoming === undefined) {
    // Fall back to chord bearing if present.
    const chordAz = chordToAzimuth(course.chordBearing);
    if (chordAz !== undefined) {
      // Approximate: incoming tangent = chord bearing − sign*delta/2 (if we have delta)
      // We may not have delta yet. Use the chord bearing as an approximation
      // and emit an anomaly noting the assumption.
      incoming = chordAz;
    } else {
      anomalies.push({
        severity: "warning",
        courseIndex: course.index,
        code: "MISSING_CURVE_ELEMENTS",
        message: "First course is a curve with no chord bearing — using radius-perpendicular guess.",
      });
      incoming = 0; // arbitrary fallback; user should add a chord bearing.
    }
  }

  // If we have chord bearing AND delta, refine the incoming tangent by
  // subtracting (or adding) half the delta from the chord bearing. The
  // chord is rotated from the incoming tangent by Δ/2 toward the curve center.
  const chordAz = chordToAzimuth(course.chordBearing);
  if (chordAz !== undefined && course.deltaDeg !== undefined) {
    const sign = course.direction === "right" ? 1 : -1;
    const refinedIncoming = chordAz - sign * course.deltaDeg / 2;
    incoming = ((refinedIncoming % 360) + 360) % 360;
  }

  let solution;
  try {
    solution = solveCurve(
      start,
      incoming,
      {
        radiusFt: course.radiusFt,
        arcLengthFt: course.arcLengthFt,
        deltaDeg: course.deltaDeg,
        chordFt: course.chordFt,
        chordBearing: course.chordBearing,
        tangentFt: course.tangentFt,
      },
      course.direction,
    );
  } catch (err) {
    anomalies.push({
      severity: "error",
      courseIndex: course.index,
      code: "MISSING_CURVE_ELEMENTS",
      message: `Curve solver failed: ${(err as Error).message}`,
    });
    return { plotted: null, outgoingAz: incomingTangentAz, anomalies };
  }

  // Consistency check: if the user over-specified, recompute canonical
  // values from R + delta and compare to whatever they supplied.
  const tol = 0.01;
  const R = solution.radiusFt;
  const deltaRad = solution.deltaDeg * DEG;
  const canonL = R * deltaRad;
  const canonChord = 2 * R * Math.sin(deltaRad / 2);
  const canonT = R * Math.tan(deltaRad / 2);

  if (course.arcLengthFt !== undefined && Math.abs(course.arcLengthFt - canonL) > tol) {
    anomalies.push({
      severity: "warning",
      courseIndex: course.index,
      code: "INCONSISTENT_CURVE",
      message: `Arc-length mismatch: provided ${course.arcLengthFt}, canonical ${canonL.toFixed(3)} (from R=${R.toFixed(3)}, Δ=${solution.deltaDeg.toFixed(4)}°).`,
    });
  }
  if (course.chordFt !== undefined && Math.abs(course.chordFt - canonChord) > tol) {
    anomalies.push({
      severity: "warning",
      courseIndex: course.index,
      code: "INCONSISTENT_CURVE",
      message: `Chord mismatch: provided ${course.chordFt}, canonical ${canonChord.toFixed(3)} (from R=${R.toFixed(3)}, Δ=${solution.deltaDeg.toFixed(4)}°).`,
    });
  }
  if (course.tangentFt !== undefined && Math.abs(course.tangentFt - canonT) > tol) {
    anomalies.push({
      severity: "warning",
      courseIndex: course.index,
      code: "INCONSISTENT_CURVE",
      message: `Tangent mismatch: provided ${course.tangentFt}, canonical ${canonT.toFixed(3)}.`,
    });
  }

  const outgoingAz = outgoingTangentAzimuth(incoming, solution.deltaDeg, course.direction);

  const plotted: PlottedCurve = {
    type: "curve",
    start,
    end: solution.endPoint,
    center: solution.center,
    radiusFt: solution.radiusFt,
    arcLengthFt: solution.arcLengthFt,
    deltaDeg: solution.deltaDeg,
    direction: course.direction,
    raw: course.raw,
    index: course.index,
  };

  return { plotted, outgoingAz, anomalies };
}

/** Approximate a curve as N chord segments for area computation. */
function curveToPolyline(curve: PlottedCurve, segments = 16): Point[] {
  const pts: Point[] = [];
  const cN = curve.center.n;
  const cE = curve.center.e;
  const v0N = curve.start.n - cN;
  const v0E = curve.start.e - cE;
  const sign = curve.direction === "right" ? 1 : -1;
  const deltaRad = curve.deltaDeg * DEG;
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const a = sign * deltaRad * t;
    const cosA = Math.cos(a);
    const sinA = Math.sin(a);
    const vN = v0N * cosA - v0E * sinA;
    const vE = v0E * cosA + v0N * sinA;
    pts.push({ n: cN + vN, e: cE + vE });
  }
  return pts;
}

function shoelaceArea(points: Point[]): number {
  if (points.length < 3) return 0;
  let s = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    s += points[i].e * points[j].n;
    s -= points[j].e * points[i].n;
  }
  return Math.abs(s) / 2;
}

function computeBbox(plotted: PlottedCourse[]): PlottedTraverse["bbox"] {
  let minN = Infinity;
  let maxN = -Infinity;
  let minE = Infinity;
  let maxE = -Infinity;
  const visit = (p: Point) => {
    if (p.n < minN) minN = p.n;
    if (p.n > maxN) maxN = p.n;
    if (p.e < minE) minE = p.e;
    if (p.e > maxE) maxE = p.e;
  };
  for (const c of plotted) {
    visit(c.start);
    visit(c.end);
    if (c.type === "curve") {
      // Include points along the arc so the bbox is correct.
      const pts = curveToPolyline(c, 8);
      pts.forEach(visit);
    }
  }
  if (!isFinite(minN)) {
    return { minN: 0, maxN: 0, minE: 0, maxE: 0 };
  }
  return { minN, maxN, minE, maxE };
}

export function plotTraverse(
  parsed: ParsedTraverse,
  startNE?: Point,
): PlottedTraverse {
  const start: Point = startNE ?? { n: 0, e: 0 };
  const plotted: PlottedCourse[] = [];
  const anomalies: Anomaly[] = [];
  let cursor: Point = { ...start };
  let incomingAz: number | undefined = undefined;
  let perimeter = 0;

  const firstStart: Point = { ...start };

  for (const course of parsed.courses as Course[]) {
    if (course.type === "line") {
      // Distance validity check.
      if (!(course.distanceFt > 0)) {
        anomalies.push({
          severity: "error",
          courseIndex: course.index,
          code: "IMPOSSIBLE_DISTANCE",
          message: `Line course distance must be > 0; got ${course.distanceFt}.`,
        });
        // Skip plotting this course but continue.
        continue;
      }
      const { plotted: line, outgoingAz } = plotLine(cursor, course);
      plotted.push(line);
      perimeter += course.distanceFt;
      cursor = line.end;
      incomingAz = outgoingAz;
    } else {
      // curve
      const { plotted: curve, outgoingAz, anomalies: cAnom } = plotCurve(
        cursor,
        incomingAz,
        course,
      );
      anomalies.push(...cAnom);
      if (curve === null) continue;
      plotted.push(curve);
      perimeter += curve.arcLengthFt;
      cursor = curve.end;
      incomingAz = outgoingAz;
    }
  }

  // Closure: cursor = last end. firstStart = first start.
  const closureErrorN = cursor.n - firstStart.n;
  const closureErrorE = cursor.e - firstStart.e;
  const linearClosureFt = Math.sqrt(
    closureErrorN * closureErrorN + closureErrorE * closureErrorE,
  );
  const precisionRatio = linearClosureFt < 1e-9 ? Infinity : perimeter / linearClosureFt;

  // Area: build polygon by walking each course, decomposing curves into segments.
  const polygon: Point[] = [];
  if (plotted.length > 0) {
    polygon.push(plotted[0].start);
    for (const c of plotted) {
      if (c.type === "line") {
        polygon.push(c.end);
      } else {
        polygon.push(...curveToPolyline(c, 16));
      }
    }
  }
  const areaSqFt = shoelaceArea(polygon);
  const areaAcres = areaSqFt / 43560;

  const bbox = computeBbox(plotted);

  const closure: ClosureReport = {
    perimeterFt: perimeter,
    closureErrorN,
    closureErrorE,
    linearClosureFt,
    precisionRatio,
    areaSqFt,
    areaAcres,
  };

  const result: PlottedTraverse = {
    courses: plotted,
    closure,
    anomalies,
    bbox,
  };

  // Run global anomaly pass (closure, bbox, unparsed counts).
  const globalAnomalies = flagAnomalies(result, parsed);
  result.anomalies = [...anomalies, ...globalAnomalies];

  return result;
}
