// MCP tool implementation: decode_deed
//
// Parses a metes-and-bounds deed description into a structured traverse, and
// (when the sibling deed-plotter package is available) plots it and computes
// closure metrics.
//
// Sibling packages from Phase 4B:
//   - @civil3d-master-guide/deed-parser  (4B-1) -> parseDeedText()
//   - @civil3d-master-guide/deed-plotter (4B-2) -> plotTraverse()
//
// At the time this file was authored those packages might not yet be merged
// into the workspace. This module imports them with a runtime try/catch
// fallback. When the parser is missing we use a built-in minimal parser so the
// MCP tool still returns useful data; when the plotter is missing we skip the
// plot/closure section and report that explicitly in `summary`.

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Public types (must match the 4B-1 / 4B-2 contracts)
// ---------------------------------------------------------------------------

export interface Bearing {
  raw: string;
  quadrant: "NE" | "NW" | "SE" | "SW";
  degrees: number;
  minutes: number;
  seconds: number;
  azimuthDeg: number;
}

export interface LineCourse {
  type: "line";
  bearing: Bearing;
  distanceFt: number;
  raw: string;
  index: number;
}

export interface CurveCourse {
  type: "curve";
  direction: "left" | "right";
  chordBearing?: Bearing;
  chordFt?: number;
  radiusFt: number;
  arcLengthFt?: number;
  deltaDeg?: number;
  tangentFt?: number;
  raw: string;
  index: number;
}

export type Course = LineCourse | CurveCourse;

export interface ParsedTraverse {
  courses: Course[];
  unparsed: { text: string; offset: number }[];
  normalizedText: string;
}

export interface Point {
  northing: number;
  easting: number;
}

export interface PlottedTraverse {
  vertices: Point[];
  perimeterFt: number;
  closureFt: number;
  precisionRatio: number;
  areaSqFt: number;
  areaAcres: number;
}

export interface DecodeDeedInput {
  text: string;
}

export interface DecodeDeedResult {
  parsed: ParsedTraverse;
  plotted?: PlottedTraverse;
  summary: {
    courseCount: number;
    lineCourses: number;
    curveCourses: number;
    unparsedFragments: number;
    perimeterFt?: number;
    precisionRatio?: number;
    areaAcres?: number;
    parserSource: "sibling" | "fallback";
    plotterSource: "sibling" | "fallback" | "unavailable";
  };
}

// ---------------------------------------------------------------------------
// Sibling-package lazy loaders
// ---------------------------------------------------------------------------

interface ParserModule {
  parseDeedText: (raw: string) => ParsedTraverse;
}
interface PlotterModule {
  plotTraverse: (parsed: ParsedTraverse, startNE?: Point) => PlottedTraverse;
}

let parserCache: { mod: ParserModule | null; loaded: boolean } = {
  mod: null,
  loaded: false,
};
let plotterCache: { mod: PlotterModule | null; loaded: boolean } = {
  mod: null,
  loaded: false,
};

async function loadParser(): Promise<ParserModule | null> {
  if (parserCache.loaded) return parserCache.mod;
  try {
    // dynamic import via string variable so tsc does not type-check the path
    const name = "@civil3d-master-guide/deed-parser";
    const mod = (await import(/* @vite-ignore */ name)) as ParserModule;
    if (typeof mod.parseDeedText === "function") {
      parserCache = { mod, loaded: true };
      return mod;
    }
  } catch {
    // package not installed yet
  }
  parserCache = { mod: null, loaded: true };
  return null;
}

async function loadPlotter(): Promise<PlotterModule | null> {
  if (plotterCache.loaded) return plotterCache.mod;
  try {
    const name = "@civil3d-master-guide/deed-plotter";
    const mod = (await import(/* @vite-ignore */ name)) as PlotterModule;
    if (typeof mod.plotTraverse === "function") {
      plotterCache = { mod, loaded: true };
      return mod;
    }
  } catch {
    // package not installed yet
  }
  plotterCache = { mod: null, loaded: true };
  return null;
}

// ---------------------------------------------------------------------------
// Fallback parser
//
// Recognizes the common Indiana phrasings:
//   "Thence N 87 degrees 23 minutes 14 seconds E, 256.78 feet"
//   "thence N87°23'14"E 256.78 feet"
//   "South 02d11'06" East 412.30'"
//   "Thence ... along a curve to the [left|right] having a radius of R feet,
//    an arc length of L feet, and a chord bearing <bearing>, <chord> feet"
// Distances are taken in feet only. Smart quotes are normalized.
// ---------------------------------------------------------------------------

function normalizeText(raw: string): string {
  return raw
    .replace(/‘|’|′/g, "'") // single smart quotes + prime -> '
    .replace(/“|”|″/g, '"') // double smart quotes + dblprime -> "
    .replace(/°/g, " degrees ") // ° -> degrees
    .replace(/–|—/g, "-") // dashes
    .replace(/\s+/g, " ")
    .trim();
}

function dirWord(s: string): "N" | "S" | "E" | "W" | null {
  const t = s.trim().toLowerCase();
  if (t === "n" || t === "north") return "N";
  if (t === "s" || t === "south") return "S";
  if (t === "e" || t === "east") return "E";
  if (t === "w" || t === "west") return "W";
  return null;
}

const BEARING_RE = new RegExp(
  // capture group layout (1..6):
  //   1: NS letter
  //   2: degrees
  //   3: minutes (optional)
  //   4: seconds (optional)
  //   5: EW letter
  "\\b(N|S|North|South)\\s*" +
    "(\\d{1,3})\\s*(?:d|deg|degrees|°)?\\s*" +
    "(?:(\\d{1,2})\\s*(?:'|m|min|minutes)?\\s*)?" +
    "(?:(\\d{1,2}(?:\\.\\d+)?)\\s*(?:\"|''|s|sec|seconds)?\\s*)?" +
    "(E|W|East|West)\\b",
  "i",
);

const DUE_CARDINAL_RE = /\b(?:due\s+)?(north|south|east|west)\b/i;
const DISTANCE_RE = /(\d+(?:\.\d+)?)\s*(?:feet|foot|ft|')/i;
const COURSE_SPLIT_RE = /\bthence\b/i;
const CURVE_RE = /\bcurve\s+to\s+the\s+(left|right)\b/i;
const RADIUS_RE = /\bradius\s+of\s+(\d+(?:\.\d+)?)\s*(?:feet|foot|ft|')/i;
const ARC_RE = /\b(?:arc\s+length|arc\s+distance|length)\s+of\s+(\d+(?:\.\d+)?)\s*(?:feet|foot|ft|')/i;
const CHORD_DIST_RE = /\bchord\s+(?:bearing\s+[^,]+,\s*)?(\d+(?:\.\d+)?)\s*(?:feet|foot|ft|')/i;
const CHORD_BEARING_RE = /\bchord\s+bearing\s+([^,]+?)(?:,|\sand\s|$)/i;
const DELTA_RE =
  /\b(?:central\s+angle|delta)\s+of\s+(\d+(?:\.\d+)?)\s*(?:degrees|deg|d|°)/i;

function parseBearing(text: string): Bearing | null {
  const m = text.match(BEARING_RE);
  if (m) {
    const ns = dirWord(m[1]!);
    const ew = dirWord(m[5]!);
    if ((ns === "N" || ns === "S") && (ew === "E" || ew === "W")) {
      const deg = Math.min(89, parseInt(m[2]!, 10));
      const min = m[3] ? Math.min(59, parseInt(m[3]!, 10)) : 0;
      const sec = m[4] ? Math.min(59.9999, parseFloat(m[4]!)) : 0;
      const quadrant = `${ns}${ew}` as Bearing["quadrant"];
      const decimal = deg + min / 60 + sec / 3600;
      let azimuthDeg: number;
      switch (quadrant) {
        case "NE":
          azimuthDeg = decimal;
          break;
        case "SE":
          azimuthDeg = 180 - decimal;
          break;
        case "SW":
          azimuthDeg = 180 + decimal;
          break;
        case "NW":
          azimuthDeg = 360 - decimal;
          break;
      }
      return {
        raw: m[0]!,
        quadrant,
        degrees: deg,
        minutes: min,
        seconds: sec,
        azimuthDeg,
      };
    }
  }
  // Handle "due north / south / east / west"
  const d = text.match(DUE_CARDINAL_RE);
  if (d) {
    const w = d[1]!.toLowerCase();
    if (w === "north") {
      return { raw: d[0]!, quadrant: "NE", degrees: 0, minutes: 0, seconds: 0, azimuthDeg: 0 };
    }
    if (w === "south") {
      return { raw: d[0]!, quadrant: "SE", degrees: 0, minutes: 0, seconds: 0, azimuthDeg: 180 };
    }
    if (w === "east") {
      return { raw: d[0]!, quadrant: "NE", degrees: 90, minutes: 0, seconds: 0, azimuthDeg: 90 };
    }
    if (w === "west") {
      return { raw: d[0]!, quadrant: "NW", degrees: 90, minutes: 0, seconds: 0, azimuthDeg: 270 };
    }
  }
  return null;
}

function fallbackParse(raw: string): ParsedTraverse {
  const normalizedText = normalizeText(raw);
  const courses: Course[] = [];
  const unparsed: { text: string; offset: number }[] = [];

  // Split on "thence". The portion before the first "thence" is intro/commencement.
  const parts = normalizedText.split(COURSE_SPLIT_RE);
  // parts[0] is the preamble; courses start at parts[1..]
  let cursor = parts[0]!.length;
  let courseIndex = 0;
  for (let i = 1; i < parts.length; i++) {
    const segment = parts[i]!.trim();
    if (!segment) {
      cursor += "thence".length + 1;
      continue;
    }
    const curveMatch = segment.match(CURVE_RE);
    if (curveMatch) {
      const radM = segment.match(RADIUS_RE);
      const arcM = segment.match(ARC_RE);
      const chordDistM = segment.match(CHORD_DIST_RE);
      const chordBearingM = segment.match(CHORD_BEARING_RE);
      const deltaM = segment.match(DELTA_RE);
      const chordBearing = chordBearingM ? parseBearing(chordBearingM[1]!) : undefined;
      if (radM) {
        const curve: CurveCourse = {
          type: "curve",
          direction: curveMatch[1]!.toLowerCase() as "left" | "right",
          radiusFt: parseFloat(radM[1]!),
          arcLengthFt: arcM ? parseFloat(arcM[1]!) : undefined,
          chordFt: chordDistM ? parseFloat(chordDistM[1]!) : undefined,
          chordBearing: chordBearing ?? undefined,
          deltaDeg: deltaM ? parseFloat(deltaM[1]!) : undefined,
          raw: segment,
          index: courseIndex++,
        };
        courses.push(curve);
        cursor += segment.length + "thence".length;
        continue;
      }
      // curve mentioned but no radius -> unparsed
      unparsed.push({ text: segment, offset: cursor });
      cursor += segment.length + "thence".length;
      continue;
    }

    const bearing = parseBearing(segment);
    const distM = segment.match(DISTANCE_RE);
    if (bearing && distM) {
      const line: LineCourse = {
        type: "line",
        bearing,
        distanceFt: parseFloat(distM[1]!),
        raw: segment,
        index: courseIndex++,
      };
      courses.push(line);
    } else {
      unparsed.push({ text: segment, offset: cursor });
    }
    cursor += segment.length + "thence".length;
  }

  return { courses, unparsed, normalizedText };
}

// ---------------------------------------------------------------------------
// Fallback plotter
// ---------------------------------------------------------------------------

function fallbackPlot(parsed: ParsedTraverse, startNE: Point = { northing: 0, easting: 0 }): PlottedTraverse {
  const vertices: Point[] = [startNE];
  let n = startNE.northing;
  let e = startNE.easting;
  let perimeterFt = 0;
  for (const c of parsed.courses) {
    let az: number;
    let dist: number;
    if (c.type === "line") {
      az = c.bearing.azimuthDeg;
      dist = c.distanceFt;
    } else {
      // Approximate a curve by its chord. If no chord bearing given, skip.
      if (!c.chordBearing || c.chordFt == null) continue;
      az = c.chordBearing.azimuthDeg;
      dist = c.chordFt;
    }
    const rad = (az * Math.PI) / 180;
    const dN = dist * Math.cos(rad);
    const dE = dist * Math.sin(rad);
    n += dN;
    e += dE;
    perimeterFt += dist;
    vertices.push({ northing: n, easting: e });
  }
  const closureFt = Math.hypot(n - startNE.northing, e - startNE.easting);
  const precisionRatio = closureFt > 0 ? perimeterFt / closureFt : Number.POSITIVE_INFINITY;

  // Shoelace area on the polygon (closed back to start)
  const poly = [...vertices, startNE];
  let twiceArea = 0;
  for (let i = 0; i < poly.length - 1; i++) {
    const a = poly[i]!;
    const b = poly[i + 1]!;
    twiceArea += a.easting * b.northing - b.easting * a.northing;
  }
  const areaSqFt = Math.abs(twiceArea) / 2;
  const areaAcres = areaSqFt / 43560;

  return { vertices, perimeterFt, closureFt, precisionRatio, areaSqFt, areaAcres };
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export const MAX_INPUT_BYTES = 100_000;

export async function decodeDeed(input: DecodeDeedInput): Promise<DecodeDeedResult> {
  if (!input || typeof input.text !== "string" || input.text.trim().length === 0) {
    throw new Error("decode_deed: 'text' must be a non-empty string");
  }
  const byteLen = Buffer.byteLength(input.text, "utf8");
  if (byteLen > MAX_INPUT_BYTES) {
    throw new Error(
      `decode_deed: input exceeds ${MAX_INPUT_BYTES} bytes (got ${byteLen}). Split the deed and call repeatedly.`,
    );
  }

  let parserSource: "sibling" | "fallback" = "fallback";
  const parser = await loadParser();
  let parsed: ParsedTraverse;
  if (parser) {
    parsed = parser.parseDeedText(input.text);
    parserSource = "sibling";
  } else {
    parsed = fallbackParse(input.text);
  }

  let plotted: PlottedTraverse | undefined;
  let plotterSource: "sibling" | "fallback" | "unavailable" = "unavailable";
  const plotter = await loadPlotter();
  try {
    if (plotter) {
      plotted = plotter.plotTraverse(parsed);
      plotterSource = "sibling";
    } else if (parsed.courses.length >= 2) {
      plotted = fallbackPlot(parsed);
      plotterSource = "fallback";
    }
  } catch {
    plotted = undefined;
  }

  const lineCourses = parsed.courses.filter((c) => c.type === "line").length;
  const curveCourses = parsed.courses.filter((c) => c.type === "curve").length;

  return {
    parsed,
    plotted,
    summary: {
      courseCount: parsed.courses.length,
      lineCourses,
      curveCourses,
      unparsedFragments: parsed.unparsed.length,
      perimeterFt: plotted?.perimeterFt,
      precisionRatio: plotted?.precisionRatio,
      areaAcres: plotted?.areaAcres,
      parserSource,
      plotterSource,
    },
  };
}

// Exposed for tests
export const __testing = { fallbackParse, fallbackPlot, normalizeText };
