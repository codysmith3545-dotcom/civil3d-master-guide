/**
 * Synthetic ParsedTraverse fixtures used by the test suite.
 *
 * Each fixture mirrors what @civil3d-master-guide/deed-parser would emit
 * for a representative deed. JSON snapshots are exported via JSON.stringify
 * if needed; tests import the objects directly for type safety.
 */

import { line, curve, traverse, bearingFromAzimuth } from "./helpers.js";

// 1) Perfect 100 ft square (closes exactly), traversed clockwise.
export const smallSquare = traverse([
  line(0, 0, 100), // N
  line(1, 90, 100), // E
  line(2, 180, 100), // S
  line(3, 270, 100), // W
]);

// 2) Right triangle: legs 300 N, 400 E, then 500 hypotenuse back. Area = 60,000 sqft.
export const rightTriangle = traverse([
  line(0, 0, 300), // due N
  line(1, 90, 400), // due E
  // back to origin: from (300, 400) to (0,0): bearing = atan2(-400,-300) = SW quadrant.
  // azimuth = 180 + atan2(400, 300) deg = 180 + 53.13° = 233.13°.
  line(2, 180 + (Math.atan2(400, 300) * 180) / Math.PI, 500),
]);

// 3) One-mile square traverse (large parcel). 5280 ft per side.
export const oneMileSquare = traverse([
  line(0, 0, 5280),
  line(1, 90, 5280),
  line(2, 180, 5280),
  line(3, 270, 5280),
]);

// 4) Curve-heavy fixture: lot with two curves and two tangents.
//    Tangent (north 200'), right curve 90° R=100 (chord bearing N45E, chord 141.42),
//    Tangent (east 200'), then back home via a SW tangent.
// We deliberately leave the closure imperfect for the test to inspect.
export const curveHeavy = traverse([
  line(0, 0, 200), // N
  curve(1, "right", {
    radiusFt: 100,
    deltaDeg: 90,
    chordBearing: bearingFromAzimuth(45),
  }),
  line(2, 90, 200), // E
  // Close back: from (300, 300) -> (0,0): SW, azimuth=225, dist=sqrt(300²+300²)=424.264
  line(3, 225, Math.sqrt(2) * 300),
]);

// 5) Underspecified curve (only R provided) — should trigger MISSING_CURVE_ELEMENTS.
export const underspecifiedCurve = traverse([
  line(0, 0, 100),
  curve(1, "right", { radiusFt: 50 }), // only R — needs second element
  line(2, 90, 100),
  line(3, 180, 100),
  line(4, 270, 100),
]);

// 6) OCR-dirty: lots of unparsed tokens.
export const ocrDirty = (() => {
  const t = traverse([line(0, 0, 100), line(1, 90, 100), line(2, 180, 100), line(3, 270, 100)]);
  // Inject many unparsed tokens.
  t.unparsed = Array.from({ length: 12 }, (_, i) => ({ text: `?token${i}`, offset: i * 5 }));
  return t;
})();

// 7) Bad closure: square but the last leg is short by 5 ft.
export const badClosure = traverse([
  line(0, 0, 100),
  line(1, 90, 100),
  line(2, 180, 100),
  line(3, 270, 95), // short
]);

// 8) Curve as first course (no incoming tangent). Has chord bearing, R, delta.
export const curveFirst = traverse([
  curve(0, "right", {
    radiusFt: 100,
    deltaDeg: 90,
    chordBearing: bearingFromAzimuth(45),
  }),
  line(1, 90, 200),
  // Close back to origin from (100-100=...) — we don't check closure here.
  line(2, 225, 250),
]);

// 9) Impossible distance fixture.
export const impossibleDistance = traverse([
  line(0, 0, 100),
  line(1, 90, 0), // zero distance — should be flagged
  line(2, 180, 100),
  line(3, 270, 100),
]);

// 10) Over-specified curve with inconsistent values.
//     R=100, delta=90 implies L=π/2*100 = 157.0796..., chord=141.421.
//     We pass R, delta, AND a wrong chord = 200 to trigger INCONSISTENT_CURVE.
export const inconsistentCurve = traverse([
  line(0, 0, 200),
  curve(1, "right", {
    radiusFt: 100,
    deltaDeg: 90,
    chordFt: 200, // wrong
    chordBearing: bearingFromAzimuth(45),
  }),
  line(2, 90, 200),
  line(3, 225, Math.sqrt(2) * 300),
]);
