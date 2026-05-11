/**
 * Lightweight metes-and-bounds deed decoder.
 *
 * Tries to extract a sequence of bearing/distance courses from a freeform
 * deed description. Recognized patterns (case-insensitive):
 *
 *   N 12° 34' 56" E 123.45 feet
 *   S 45-30-00 W 100.0'
 *   North 12 degrees 34 minutes 56 seconds East, distance of 123.45 ft
 *
 * Returns the parsed courses plus optional plotted northing/easting starting
 * from (0, 0). This is intentionally a pragmatic parser — not a full deed-
 * interpretation engine. Curve calls ("thence along a curve…") are flagged
 * but not solved.
 */

export type DeedCourse = {
  index: number;
  bearing_deg: number;
  bearing_text: string;
  distance_ft: number;
  raw: string;
};

export type DeedPlotPoint = { northing: number; easting: number };

export type DeedDecodeResult = {
  courses: DeedCourse[];
  closurePoint: DeedPlotPoint;
  perimeter_ft: number;
  unresolved_curve_calls: string[];
  notes: string[];
};

function dmsToDeg(d: number, m: number, s: number): number {
  return d + m / 60 + s / 3600;
}

function quadrantAzimuth(ns: string, dms: number, ew: string): number {
  const isN = /^n/i.test(ns);
  const isE = /^e/i.test(ew);
  if (isN && isE) return dms;
  if (!isN && isE) return 180 - dms;
  if (!isN && !isE) return 180 + dms;
  return 360 - dms;
}

const BEARING_REGEX = new RegExp(
  // (N|S) <deg> [°|d|deg|deg.] [<min> ['|m|min]] [<sec> ["|s|sec]] (E|W)
  // Followed (in any order, separated by punctuation/spaces) by a distance.
  "\\b" +
    "(N|S|North|South)\\s*" +
    "(\\d{1,3})\\s*(?:°|d|deg(?:rees)?|-)\\s*" +
    "(?:(\\d{1,2})\\s*(?:['′]|m|min(?:utes)?|-)\\s*)?" +
    "(?:(\\d{1,2}(?:\\.\\d+)?)\\s*(?:[\"″]|s|sec(?:onds)?)?\\s*)?" +
    "(E|W|East|West)\\b",
  "gi",
);

const DISTANCE_REGEX = new RegExp(
  "(\\d+(?:\\.\\d+)?)\\s*(?:'|feet|foot|ft\\.?)\\b",
  "i",
);

export function decodeDeed(text: string): DeedDecodeResult {
  const notes: string[] = [];
  const unresolved: string[] = [];
  const courses: DeedCourse[] = [];

  if (!text || text.trim().length === 0) {
    return {
      courses: [],
      closurePoint: { northing: 0, easting: 0 },
      perimeter_ft: 0,
      unresolved_curve_calls: [],
      notes: ["Empty input"],
    };
  }

  // Flag curve calls without trying to solve them.
  for (const m of text.matchAll(/thence[^.]*?(curve|radius|arc|chord)[^.]*\./gi)) {
    unresolved.push(m[0]!.trim());
  }

  // Find every bearing match and look for a distance after it (within ~80 chars).
  let idx = 0;
  for (const m of text.matchAll(BEARING_REGEX)) {
    const ns = m[1]!;
    const deg = Number(m[2]!);
    const min = Number(m[3] ?? 0);
    const sec = Number(m[4] ?? 0);
    const ew = m[5]!;
    const dms = dmsToDeg(deg, min, sec);
    const azimuth = quadrantAzimuth(ns, dms, ew);

    const tail = text.slice(m.index! + m[0]!.length, m.index! + m[0]!.length + 120);
    const dm = tail.match(DISTANCE_REGEX);
    if (!dm) {
      notes.push(`Bearing without a distance near "${m[0]!.slice(0, 40)}…"`);
      continue;
    }
    const distance_ft = Number(dm[1]!);
    courses.push({
      index: idx++,
      bearing_deg: azimuth,
      bearing_text: `${/^n/i.test(ns) ? "N" : "S"} ${deg}° ${min}' ${sec.toFixed(2)}" ${/^e/i.test(ew) ? "E" : "W"}`,
      distance_ft,
      raw: (m[0]! + " " + dm[0]!).trim(),
    });
  }

  // Plot from (0,0).
  let n = 0;
  let e = 0;
  let perimeter = 0;
  for (const c of courses) {
    const rad = (c.bearing_deg * Math.PI) / 180;
    n += Math.cos(rad) * c.distance_ft;
    e += Math.sin(rad) * c.distance_ft;
    perimeter += c.distance_ft;
  }

  return {
    courses,
    closurePoint: { northing: n, easting: e },
    perimeter_ft: perimeter,
    unresolved_curve_calls: unresolved,
    notes,
  };
}
