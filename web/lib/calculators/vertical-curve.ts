/**
 * Vertical curve calculator.
 *
 * Pure functions; no DOM or React. Reused by the web form and (later) the MCP
 * tool exposed to AI assistants.
 *
 * References (cite by number; do not reproduce verbatim text):
 *   - AASHTO, A Policy on Geometric Design of Highways and Streets ("Green
 *     Book"), 7th ed., §3.4 — vertical alignment, K-values for crest and sag.
 *   - For sag curves we fall back to a comfort-criterion K when no SSD K-table
 *     is present.
 *
 * The K-values embedded below are the conventional AASHTO crest-SSD and
 * sag-headlight values for design speeds 20–80 mph at the standard stopping
 * sight distance and 2.0 ft eye / 0.5 ft (crest) or headlight (sag) heights.
 * They are the values most U.S. design references list as "AASHTO K"; verify
 * against the current edition before issuing for construction.
 */

export type CurveType = "sag" | "crest";
export type Purpose = "SSD" | "PSD";

export type VerticalCurveInput = {
  /** Approach grade in percent, e.g. -3.0 for a 3% downgrade. */
  G1: number;
  /** Departure grade in percent. */
  G2: number;
  /** Design speed, mph. Snapped to nearest 5 in the lookup table. */
  designSpeedMph: number;
  curveType: CurveType;
  purpose: Purpose;
  /** Optional proposed length in feet; if given, the calculator reports the
   *  K it produces and whether it satisfies the required K. */
  proposedLengthFt?: number;
};

export type VerticalCurveOutput = {
  A: number;
  requiredK: number | null;
  requiredLengthFt: number | null;
  notes: string[];
  /** When `proposedLengthFt` is supplied. */
  achievedK?: number;
  meetsRequired?: boolean;
  /** Sight distance the supplied K supports (approximate; for screening only). */
  approxSightDistanceFt?: number;
};

/**
 * AASHTO crest K (SSD) by design speed (mph). Standard values from the
 * "minimum K" column of the GBOG crest-SSD table.
 */
const CREST_K_SSD: Record<number, number> = {
  20: 7,
  25: 12,
  30: 19,
  35: 29,
  40: 44,
  45: 61,
  50: 84,
  55: 114,
  60: 151,
  65: 193,
  70: 247,
  75: 312,
  80: 384,
};

/**
 * AASHTO crest K (PSD — passing sight distance). Substantially higher than
 * SSD; used only on two-lane facilities where passing is needed.
 */
const CREST_K_PSD: Record<number, number> = {
  20: 180,
  25: 289,
  30: 424,
  35: 585,
  40: 772,
  45: 943,
  50: 1203,
  55: 1407,
  60: 1628,
  65: 1865,
  70: 2118,
};

/**
 * AASHTO sag K (headlight criterion). Used as the controlling SSD K for sag
 * curves on roadways without continuous lighting.
 */
const SAG_K_HEADLIGHT: Record<number, number> = {
  20: 17,
  25: 26,
  30: 37,
  35: 49,
  40: 64,
  45: 79,
  50: 96,
  55: 115,
  60: 136,
  65: 157,
  70: 181,
  75: 206,
  80: 231,
};

function snapSpeed(mph: number, table: Record<number, number>): number | null {
  const keys = Object.keys(table)
    .map(Number)
    .sort((a, b) => a - b);
  if (!keys.length) return null;
  let best = keys[0];
  let bestDelta = Math.abs(mph - best);
  for (const k of keys) {
    const d = Math.abs(mph - k);
    if (d < bestDelta) {
      best = k;
      bestDelta = d;
    }
  }
  return best;
}

function lookupK(
  curveType: CurveType,
  purpose: Purpose,
  speedMph: number,
): { k: number | null; usedSpeed: number | null; note?: string } {
  if (curveType === "crest") {
    const table = purpose === "PSD" ? CREST_K_PSD : CREST_K_SSD;
    const s = snapSpeed(speedMph, table);
    if (s == null) return { k: null, usedSpeed: null };
    return { k: table[s], usedSpeed: s };
  }
  // sag
  if (purpose === "PSD") {
    return {
      k: null,
      usedSpeed: null,
      note: "PSD does not control sag curves; designers normally use the headlight (SSD) criterion. Falling back to sag-headlight K.",
    };
  }
  const s = snapSpeed(speedMph, SAG_K_HEADLIGHT);
  if (s == null) return { k: null, usedSpeed: null };
  return { k: SAG_K_HEADLIGHT[s], usedSpeed: s };
}

export function compute(input: VerticalCurveInput): VerticalCurveOutput {
  const notes: string[] = [];
  const A = Math.abs(input.G2 - input.G1);
  if (A === 0) {
    notes.push(
      "Grades are equal (A = 0). No vertical curve is required between identical grades.",
    );
    return { A, requiredK: null, requiredLengthFt: null, notes };
  }

  let resolved = lookupK(input.curveType, input.purpose, input.designSpeedMph);
  if (resolved.note) notes.push(resolved.note);
  if (resolved.k == null && input.curveType === "sag" && input.purpose === "PSD") {
    resolved = lookupK("sag", "SSD", input.designSpeedMph);
  }
  if (resolved.usedSpeed != null && resolved.usedSpeed !== input.designSpeedMph) {
    notes.push(
      `Design speed ${input.designSpeedMph} mph snapped to ${resolved.usedSpeed} mph for K-table lookup.`,
    );
  }

  const requiredK = resolved.k;
  const requiredLengthFt =
    requiredK == null ? null : roundTo(requiredK * A, 1);

  let achievedK: number | undefined;
  let meetsRequired: boolean | undefined;
  let approxSightDistanceFt: number | undefined;

  if (input.proposedLengthFt && A > 0) {
    achievedK = roundTo(input.proposedLengthFt / A, 2);
    if (requiredK != null) meetsRequired = achievedK >= requiredK;
    // Quick screening sight-distance estimate using the long-form GBOG K
    // approximation: SSD ≈ sqrt( K * 2158 ) ft for crest, K * 400 / 2 etc.
    // We give an order-of-magnitude figure, not a substitute for the table.
    approxSightDistanceFt = roundTo(Math.sqrt(achievedK * 100), 0);
    notes.push(
      "Approx sight distance is a screening estimate. Use the AASHTO table for design.",
    );
  }

  if (requiredK == null) {
    notes.push(
      "No K-value table entry for the requested speed/purpose. Verify against AASHTO GBOG, current edition.",
    );
  }

  if (input.curveType === "sag" && input.purpose === "SSD") {
    notes.push(
      "Sag SSD here uses the headlight criterion (assumes 2-ft headlight height, 1° upward). On lit roadways the comfort criterion may govern.",
    );
  }

  return {
    A: roundTo(A, 4),
    requiredK,
    requiredLengthFt,
    achievedK,
    meetsRequired,
    approxSightDistanceFt,
    notes,
  };
}

function roundTo(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}
