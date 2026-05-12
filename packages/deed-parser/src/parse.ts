/**
 * Top-level deed parser.
 *
 * Splits a metes-and-bounds description into ordered courses by detecting
 * the conventional course delimiter ("thence" and its variants), then
 * parses each clause as either a line course (bearing + distance) or a
 * curve course.
 *
 * Anything we can't classify is recorded in `unparsed`.
 */

import type {
  Course,
  CurveCourse,
  LineCourse,
  ParsedTraverse,
  UnparsedFragment,
} from "./types.js";
import { normalizeDeedText } from "./normalize.js";
import { parseBearing } from "./bearing.js";
import { parseDistance } from "./distance.js";
import { parseCurveCall } from "./curve.js";

/**
 * Words/phrases that delimit one course from the next in a typical deed.
 * Matched case-insensitively at word boundaries. Order matters: longer
 * variants must come first so "thence running" matches before "thence".
 */
const COURSE_DELIMITERS = [
  "thence running",
  "thence, running",
  "thence,",
  "thence;",
  "thence",
  "then,",
  "then",
];

/** Closure markers we strip from the final clause before parsing. */
const CLOSURE_MARKERS = [
  /to\s+the\s+point\s+of\s+beginning/i,
  /to\s+the\s+place\s+of\s+beginning/i,
  /to\s+the\s+pob\b/i,
  /to\s+the\s+true\s+point\s+of\s+beginning/i,
  /to\s+the\s+p\.?\s*o\.?\s*b\.?/i,
];

/** Begin-of-description markers we strip from the first clause. */
const BEGIN_MARKERS = [
  /beginning\s+at\s+(?:a\s+point|an?\s+iron\s+(?:pin|rod|pipe)|the\s+(?:northeast|northwest|southeast|southwest|northerly|southerly|easterly|westerly)\s+corner)[^,;]*[,;]?/i,
  /commencing\s+at[^,;]*[,;]?/i,
  /beginning\s+at[^,;]*[,;]?/i,
];

/**
 * Split text into course clauses using "thence" (and variants) as the
 * delimiter. The first clause is whatever precedes the first "thence".
 *
 * Returns an array of { clause, offset } where offset is the start position
 * inside the normalized input.
 */
function splitOnDelimiters(
  text: string,
): { clause: string; offset: number }[] {
  const lower = text.toLowerCase();
  // Build a combined regex of delimiters at word boundaries.
  const pattern = new RegExp(
    "\\b(" + COURSE_DELIMITERS.map(escapeRegex).join("|") + ")\\b",
    "gi",
  );
  const positions: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(lower)) !== null) {
    positions.push(m.index);
    // Avoid zero-length loops.
    if (m.index === pattern.lastIndex) pattern.lastIndex++;
  }

  const clauses: { clause: string; offset: number }[] = [];
  if (positions.length === 0) {
    clauses.push({ clause: text, offset: 0 });
    return clauses;
  }

  // First clause = everything before the first delimiter.
  if (positions[0] > 0) {
    clauses.push({ clause: text.slice(0, positions[0]), offset: 0 });
  }
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i];
    const end = i + 1 < positions.length ? positions[i + 1] : text.length;
    clauses.push({ clause: text.slice(start, end), offset: start });
  }
  return clauses;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Strip the leading delimiter ("thence", etc.) from a clause for parsing. */
function stripDelimiter(clause: string): string {
  let s = clause;
  for (const d of COURSE_DELIMITERS) {
    const re = new RegExp("^\\s*" + escapeRegex(d) + "\\b[\\s,;]*", "i");
    if (re.test(s)) {
      s = s.replace(re, "");
      break;
    }
  }
  return s;
}

/** Strip Beginning-at preamble. Returns the trimmed remainder. */
function stripBeginPreamble(clause: string): string {
  let s = clause;
  for (const re of BEGIN_MARKERS) {
    const m = re.exec(s);
    if (m && m.index <= 5) {
      s = s.slice(m.index + m[0].length);
      break;
    }
  }
  return s.trim();
}

/** Strip closure markers ("to the point of beginning") from a final clause. */
function stripClosure(clause: string): string {
  let s = clause;
  for (const re of CLOSURE_MARKERS) {
    s = s.replace(re, "");
  }
  return s.trim();
}

/**
 * Attempt to parse a single course clause (delimiter already removed) as a
 * line. Returns null if no bearing + distance can be found.
 */
function tryParseLine(
  clauseBody: string,
): { course: Omit<LineCourse, "index"> } | null {
  // Find a bearing somewhere in the clause. Try at the start first, then a
  // tolerant search.
  const bearingMatch = findBearing(clauseBody);
  if (!bearingMatch) return null;

  // Look for a distance AFTER the bearing.
  const rest = clauseBody.slice(bearingMatch.endOffset);
  const distance = findDistance(rest);
  if (!distance) return null;

  return {
    course: {
      type: "line",
      bearing: { ...bearingMatch.bearing },
      distanceFt: distance.feet,
      raw: clauseBody.trim(),
    },
  };
}

function findBearing(text: string): {
  bearing: ReturnType<typeof parseBearing> & object;
  startOffset: number;
  endOffset: number;
} | null {
  // Candidate substrings starting with N/S followed by digit or whitespace+digit
  // and ending with E/W.
  const re =
    /\b(?:N|S|North|South|No\.?|So\.?)\s*\.?\s*\d{1,3}(?:\.\d+)?\s*(?:°|deg(?:rees?)?\b|[-–—])[\s\S]{0,40}?(?:E|W|East|West|Ea\.?|We\.?)\b\.?/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const candidate = m[0];
    const b = parseBearing(candidate);
    if (b) {
      return {
        bearing: b as ReturnType<typeof parseBearing> & object,
        startOffset: m.index,
        endOffset: m.index + candidate.length,
      };
    }
  }

  // Try "due north/east/south/west" cardinals.
  const due = /\bdue\s+(?:north|south|east|west)\b/i.exec(text);
  if (due) {
    const b = parseBearing(due[0]);
    if (b) {
      return {
        bearing: b as ReturnType<typeof parseBearing> & object,
        startOffset: due.index,
        endOffset: due.index + due[0].length,
      };
    }
  }

  return null;
}

function findDistance(
  text: string,
): { feet: number; moreOrLess: boolean; source: string } | null {
  // Try parsing at start (after any leading comma/whitespace/connective words).
  const cleaned = text.replace(
    /^\s*(?:,|;|of|for|a\s+distance\s+of|distance\s+of|along\s+[^,]+,)\s*/i,
    "",
  );
  const d = parseDistance(cleaned);
  if (d) return d;

  // Search for the first number-with-feet pattern within the text.
  const re =
    /(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:feet|foot|ft\.?|')(\s*,?\s*more\s+or\s+less)?/i;
  const m = re.exec(text);
  if (!m) return null;
  const feet = Number(m[1].replace(/,/g, ""));
  if (!Number.isFinite(feet)) return null;
  return { feet, moreOrLess: Boolean(m[2]), source: m[0] };
}

/**
 * Parse the full deed text and return a normalized traverse.
 */
export function parseDeedText(raw: string): ParsedTraverse {
  if (typeof raw !== "string") {
    throw new TypeError("parseDeedText: input must be a string");
  }

  const normalizedText = normalizeDeedText(raw);
  const courses: Course[] = [];
  const unparsed: UnparsedFragment[] = [];

  // Split into clauses by "thence" delimiters.
  const clauses = splitOnDelimiters(normalizedText);

  let courseIndex = 0;
  for (let i = 0; i < clauses.length; i++) {
    const { clause, offset } = clauses[i];
    let body = clause;

    // Strip the leading delimiter from any non-first clause that starts
    // with one.
    body = stripDelimiter(body);

    // First clause: also strip "Beginning at ..." preamble.
    if (i === 0) {
      body = stripBeginPreamble(body);
      // If after stripping nothing meaningful remains, skip.
      if (body.trim() === "") continue;
    }

    // Last clause: strip closure marker if present.
    body = stripClosure(body);

    // Empty / whitespace clause: skip.
    if (body.trim() === "") continue;

    // Try curve first (curve clauses also contain bearings as the chord
    // bearing — we don't want to misclassify them as line courses).
    if (/\bcurv|\barc\b|\bradius\b|\bdelta\b|\bchord\b/i.test(body)) {
      const c = parseCurveCall(body);
      if (c) {
        const cc: CurveCourse = { ...c, index: courseIndex++ };
        courses.push(cc);
        continue;
      }
      // Curve markers present but unparseable -> log to unparsed.
      unparsed.push({ text: body.trim(), offset });
      continue;
    }

    // Try line course.
    const line = tryParseLine(body);
    if (line) {
      const lc: LineCourse = { ...line.course, index: courseIndex++ };
      courses.push(lc);
      continue;
    }

    // Couldn't classify: log it (only if non-trivial).
    if (body.trim().length > 0) {
      unparsed.push({ text: body.trim(), offset });
    }
  }

  return { courses, unparsed, normalizedText };
}
