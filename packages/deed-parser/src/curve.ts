/**
 * Curve call parser.
 *
 * A curve call in a metes-and-bounds description states a subset of:
 *   - direction of curvature (left / right) or concavity (concave to <dir>)
 *   - radius
 *   - arc length
 *   - delta (central angle)
 *   - chord bearing
 *   - chord length
 *   - tangent length
 *
 * This parser extracts whichever elements are stated and returns a partial
 * {@link CurveCourse}. It does NOT compute missing elements — that's a job
 * for downstream consumers (e.g. the plotting package, Agent 4B-2).
 *
 * Examples:
 *   "thence along a curve to the right having a radius of 250.00 feet,
 *    an arc length of 75.00 feet, and a chord bearing N 30°15'00" E,
 *    74.50 feet"
 *
 *   "thence southeasterly along a curve concave to the southwest,
 *    radius 250.00 feet, delta 17°10'00", chord bearing S 30°15'00" E,
 *    74.50 feet"
 *
 * Returns `null` if no curve markers are found.
 */

import type { Bearing, CurveCourse } from "./types.js";
import { parseBearing } from "./bearing.js";

const NUMBER_SRC = `\\d+(?:,\\d{3})*(?:\\.\\d+)?`;
const FEET_SRC = `(?:feet|foot|ft\\.?|')`;

function parseFeetAfter(label: RegExp, text: string): number | undefined {
  const re = new RegExp(
    label.source + `\\s*(?:of\\s+)?(${NUMBER_SRC})\\s*(?:${FEET_SRC})?`,
    "i",
  );
  const m = re.exec(text);
  if (!m) return undefined;
  const n = Number(m[1].replace(/,/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function parseDeltaDeg(text: string): number | undefined {
  // Forms: "delta 17°10'00\"", "central angle of 17 degrees 10 minutes",
  // or just "Δ 17°10'00\"".
  const dmsRe =
    /(?:delta|central\s+angle|Δ)[^0-9]{0,15}(\d{1,3}(?:\.\d+)?)\s*(?:°|deg(?:rees?)?\b)\s*(?:(\d{1,2}(?:\.\d+)?)\s*(?:'|min(?:utes?)?\b))?\s*(?:(\d{1,2}(?:\.\d+)?)\s*(?:"|sec(?:onds?)?\b))?/i;
  const m = dmsRe.exec(text);
  if (!m) return undefined;
  const d = Number(m[1]);
  const min = m[2] === undefined ? 0 : Number(m[2]);
  const s = m[3] === undefined ? 0 : Number(m[3]);
  if (!Number.isFinite(d) || !Number.isFinite(min) || !Number.isFinite(s)) return undefined;
  return d + min / 60 + s / 3600;
}

function parseChordBearing(text: string): Bearing | undefined {
  // "chord bearing N 30°15'00\" E" or "chord N 30 deg 15 min E"
  const re =
    /chord\s+bearing\s+([NS][^,;]+?[EW])(?=\s*(?:,|;|of|having|with|and|having a chord length|chord\s+length|\d|$))/i;
  const m = re.exec(text);
  if (m) {
    const b = parseBearing(m[1].trim());
    if (b) return b;
  }
  // Looser fallback: capture up to "feet" or comma or end.
  const re2 =
    /chord\s+bearing\s+(?:of\s+)?((?:N|North|S|South)\s*\.?\s*\d[^,]*?(?:E|W|East|West)\b\.?)/i;
  const m2 = re2.exec(text);
  if (m2) {
    return parseBearing(m2[1].trim()) ?? undefined;
  }
  return undefined;
}

function parseDirection(text: string): "left" | "right" | null {
  // Direct: "curve to the right" / "curve to the left" / "curving to the right"
  if (/curv\w*\s+to\s+the\s+right/i.test(text)) return "right";
  if (/curv\w*\s+to\s+the\s+left/i.test(text)) return "left";
  // "turning to the right"
  if (/turning\s+to\s+the\s+right/i.test(text)) return "right";
  if (/turning\s+to\s+the\s+left/i.test(text)) return "left";

  // "concave to the <southwest|northeast|...>" + general heading.
  // For a deed traveling northeasterly along a curve concave to the southeast,
  // the curve bends right. We DON'T try to infer here — too error-prone.
  // Instead, check for explicit "right" / "left" anywhere in the curve call.
  if (/\bbearing\s+to\s+the\s+right\b/i.test(text)) return "right";
  if (/\bbearing\s+to\s+the\s+left\b/i.test(text)) return "left";

  // Concave-to-direction inference (very limited): if we see "<heading>erly
  // along a curve concave to the <opposite>" pair, we can decide.
  // Conservative default: null (caller can mark as ambiguous).
  return null;
}

/**
 * Parse a single curve-call clause. Returns a partial CurveCourse (without
 * `index` and with caller-supplied `raw`), or null if no recognizable curve
 * markers exist in the text.
 */
export function parseCurveCall(
  text: string,
): Omit<CurveCourse, "index"> | null {
  if (typeof text !== "string") return null;
  // Must look like a curve call.
  if (!/\bcurv|\barc\b|\bradius\b|\bdelta\b|\bchord\b/i.test(text)) return null;

  const radius = parseFeetAfter(/\bradius\b/, text);
  if (radius === undefined) {
    // A real curve call must state a radius. If not stated, return null so
    // upstream callers can choose to log it as unparsed rather than a half
    // curve.
    return null;
  }

  const arcLen = parseFeetAfter(/\barc\s+(?:length|distance)\b/, text);
  // Some deeds say "an arc distance of N feet" or just "length of N feet".
  const arcLenFallback =
    arcLen === undefined ? parseFeetAfter(/\blength\b/, text) : undefined;
  const arcLengthFt = arcLen ?? arcLenFallback;

  const chordFt = parseChordLength(text);
  const tangentFt = parseFeetAfter(/\btangent\b/, text);

  const deltaDeg = parseDeltaDeg(text);
  const chordBearing = parseChordBearing(text);

  let direction = parseDirection(text);
  if (direction === null) {
    // Default unknown to "right" but mark via raw text. Honest answer: we
    // can't always tell. We'll set to "right" only if no opposing keyword.
    // Better: bail out so caller can log to `unparsed`.
    return null;
  }

  const out: Omit<CurveCourse, "index"> = {
    type: "curve",
    direction,
    radiusFt: radius,
    raw: text.trim(),
  };
  if (arcLengthFt !== undefined) out.arcLengthFt = arcLengthFt;
  if (chordFt !== undefined) out.chordFt = chordFt;
  if (tangentFt !== undefined) out.tangentFt = tangentFt;
  if (deltaDeg !== undefined) out.deltaDeg = deltaDeg;
  if (chordBearing) out.chordBearing = chordBearing;
  return out;
}

/**
 * Chord length detection. Searches for explicit "chord length" / "chord
 * distance" phrasing first, then falls back to "...chord bearing <B>, N feet"
 * pattern.
 */
function parseChordLength(text: string): number | undefined {
  const explicit = parseFeetAfter(/\bchord\s+(?:length|distance)\b/, text);
  if (explicit !== undefined) return explicit;

  // Pattern: "chord bearing <bearing>, NN.NN feet"
  const re = new RegExp(
    `chord\\s+bearing\\s+[NS][^,]*?[EW]\\b\\.?\\s*,?\\s*(${NUMBER_SRC})\\s*${FEET_SRC}`,
    "i",
  );
  const m = re.exec(text);
  if (m) {
    const n = Number(m[1].replace(/,/g, ""));
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}
