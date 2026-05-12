/**
 * Anomaly detection on a plotted traverse.
 *
 * Per-course anomalies (MISSING_CURVE_ELEMENTS, INCONSISTENT_CURVE,
 * IMPOSSIBLE_DISTANCE) are emitted during plotting. This module covers the
 * global checks: closure quality, bbox sanity, and parser-output sanity.
 */

import type { Anomaly, ParsedTraverse, PlottedTraverse } from "./types.js";

const ONE_MILE_FT = 5280;

/**
 * Run global anomaly checks. If parsed is supplied, includes parser-related
 * checks (e.g. excessive unparsed tokens).
 */
export function flagAnomalies(
  plotted: PlottedTraverse,
  parsed?: ParsedTraverse,
): Anomaly[] {
  const anomalies: Anomaly[] = [];

  // Closure precision check (only if traverse closes — i.e., we have at least
  // 3 courses; a 1-2-course path isn't expected to close).
  if (plotted.courses.length >= 3) {
    const { precisionRatio, linearClosureFt } = plotted.closure;
    if (linearClosureFt > 1e-9 && precisionRatio < 5000) {
      anomalies.push({
        severity: "warning",
        code: "GROSS_CLOSURE_ERROR",
        message: `Precision ratio is 1:${Math.round(precisionRatio)} (linear closure ${linearClosureFt.toFixed(3)} ft) — below 1:5000.`,
      });
    }
  }

  // Bounding-box sanity.
  const { minN, maxN, minE, maxE } = plotted.bbox;
  const nSpan = maxN - minN;
  const eSpan = maxE - minE;
  // Use a small tolerance to avoid firing on traverses that are exactly one
  // mile wide (floating-point noise can push the bbox a fraction over).
  const tol = 1e-3;
  if (nSpan > ONE_MILE_FT + tol || eSpan > ONE_MILE_FT + tol) {
    anomalies.push({
      severity: "info",
      code: "LARGE_BBOX",
      message: `Bounding box exceeds 1 mile (N span ${nSpan.toFixed(1)} ft, E span ${eSpan.toFixed(1)} ft). Verify distance units.`,
    });
  }

  // Parser sanity.
  if (parsed) {
    if (parsed.unparsed.length > plotted.courses.length) {
      anomalies.push({
        severity: "warning",
        code: "MANY_UNPARSED_TOKENS",
        message: `Parser produced ${parsed.unparsed.length} unparsed tokens vs. ${plotted.courses.length} courses. Review source text.`,
      });
    }
  }

  return anomalies;
}
