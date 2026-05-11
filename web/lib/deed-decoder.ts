// Wrapper around the sibling `@civil3d-master-guide/deed-parser` and
// `@civil3d-master-guide/deed-plotter` packages. Those packages may not yet
// be merged into the worktree; this module imports them dynamically and
// gracefully degrades when they are absent.
//
// Types are re-declared here as a structural mirror of the package
// contracts (per Phase 4B-1 / 4B-2 specs). When the real packages are
// installed, their `import type` shapes should match these definitions.

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
  n: number;
  e: number;
}

export interface ClosureReport {
  perimeterFt: number;
  closureErrorN: number;
  closureErrorE: number;
  linearClosureFt: number;
  precisionRatio: number;
  areaSqFt: number;
  areaAcres: number;
}

export interface Anomaly {
  severity: "info" | "warning" | "error";
  message: string;
  courseIndex?: number;
}

export interface PlottedCourse {
  courseIndex: number;
  start: Point;
  end: Point;
  type: "line" | "curve";
  // For curves, the SVG path may need additional metadata. We treat this as
  // opaque here — the renderer in the package handles it.
  midpoints?: Point[];
}

export interface PlottedTraverse {
  courses: PlottedCourse[];
  closure: ClosureReport;
  anomalies: Anomaly[];
  bbox: { minN: number; minE: number; maxN: number; maxE: number };
}

type ParserModule = {
  parseDeedText(raw: string): ParsedTraverse;
};

type PlotterModule = {
  plotTraverse(parsed: ParsedTraverse, startNE?: Point): PlottedTraverse;
  renderSvg?(plotted: PlottedTraverse, options?: unknown): string;
};

let parserPromise: Promise<ParserModule | null> | null = null;
let plotterPromise: Promise<PlotterModule | null> | null = null;

export async function loadParser(): Promise<ParserModule | null> {
  if (!parserPromise) {
    parserPromise = (async () => {
      try {
        // The dynamic specifier is intentional — we do NOT want the bundler
        // to fail if the package is absent.
        const mod = (await import(
          /* webpackIgnore: true */
          "@civil3d-master-guide/deed-parser" as string
        ).catch(() => null)) as ParserModule | null;
        return mod;
      } catch {
        return null;
      }
    })();
  }
  return parserPromise;
}

export async function loadPlotter(): Promise<PlotterModule | null> {
  if (!plotterPromise) {
    plotterPromise = (async () => {
      try {
        const mod = (await import(
          /* webpackIgnore: true */
          "@civil3d-master-guide/deed-plotter" as string
        ).catch(() => null)) as PlotterModule | null;
        return mod;
      } catch {
        return null;
      }
    })();
  }
  return plotterPromise;
}

/**
 * Are both sibling packages available? Used by the UI to decide whether to
 * show a "package not yet integrated" banner.
 */
export async function packagesAvailable(): Promise<{
  parser: boolean;
  plotter: boolean;
}> {
  const [p, pl] = await Promise.all([loadParser(), loadPlotter()]);
  return { parser: !!p, plotter: !!pl };
}
