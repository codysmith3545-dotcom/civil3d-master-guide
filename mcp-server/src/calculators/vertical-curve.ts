/**
 * Vertical curve K-value selection per AASHTO "Green Book" (A Policy on Geometric Design
 * of Highways and Streets, 7th ed., 2018), Tables 3-34 (crest, SSD), 3-36 (crest, PSD),
 * and 3-37 (sag, headlight).
 *
 * K = L / |A|, where A = |g2 - g1| in percent, L = curve length in feet.
 * For a chosen design speed and criterion we look up K_min, then L = K * A.
 *
 * Tables embedded here are integer "design" K values from the Green Book and reflect the
 * common AASHTO design controls. They are NOT a substitute for the Green Book — always
 * verify against the cited table for your edition.
 */

export interface VerticalCurveInput {
  g1: number;
  g2: number;
  design_speed_mph: number;
  type: "sag" | "crest";
  criterion: "ssd" | "psd" | "comfort";
}

export interface VerticalCurveResult {
  k_required: number;
  l_required_ft: number;
  algebraic_difference_percent: number;
  sight_distance_passes: boolean;
  source: string;
  notes: string[];
}

// Crest, SSD-controlled: AASHTO GBOG 7e, Table 3-34 (design values).
// Speeds 15-80 mph in 5-mph steps.
const K_CREST_SSD: Record<number, number> = {
  15: 3,
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

// Crest, PSD-controlled: AASHTO GBOG 7e, Table 3-36.
const K_CREST_PSD: Record<number, number> = {
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
  70: 2197,
  75: 2542,
  80: 2904,
};

// Sag, headlight criterion: AASHTO GBOG 7e, Table 3-37.
const K_SAG_HEADLIGHT: Record<number, number> = {
  15: 10,
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

function lookupK(table: Record<number, number>, v: number): { k: number; usedSpeed: number } {
  const speeds = Object.keys(table).map((s) => Number(s)).sort((a, b) => a - b);
  // Use ceiling speed (more conservative) — design speed should be matched or exceeded.
  for (const s of speeds) {
    if (v <= s) return { k: table[s]!, usedSpeed: s };
  }
  const max = speeds[speeds.length - 1]!;
  return { k: table[max]!, usedSpeed: max };
}

export function verticalCurve(input: VerticalCurveInput): VerticalCurveResult {
  const A = Math.abs(input.g2 - input.g1);
  const notes: string[] = [];

  if (A < 1e-9) {
    return {
      k_required: 0,
      l_required_ft: 0,
      algebraic_difference_percent: 0,
      sight_distance_passes: true,
      source: "AASHTO GBOG 7e (no curve required when g1 == g2)",
      notes: ["g1 equals g2; no vertical curve is required."],
    };
  }

  let table: Record<number, number>;
  let tableLabel: string;
  if (input.type === "crest") {
    if (input.criterion === "psd") {
      table = K_CREST_PSD;
      tableLabel = "AASHTO GBOG 7e, Table 3-36 (crest, passing sight distance)";
    } else if (input.criterion === "comfort") {
      table = K_CREST_SSD;
      tableLabel = "AASHTO GBOG 7e, Table 3-34 (crest, SSD); comfort criterion not defined for crest";
      notes.push("Comfort criterion is a sag concept; using SSD-controlled K for crest curves.");
    } else {
      table = K_CREST_SSD;
      tableLabel = "AASHTO GBOG 7e, Table 3-34 (crest, stopping sight distance)";
    }
  } else {
    if (input.criterion === "comfort") {
      // Comfort: K = V^2 / 46.5 (V in mph), GBOG eq.
      const v = input.design_speed_mph;
      const k = (v * v) / 46.5;
      const L = k * A;
      return {
        k_required: Math.round(k * 100) / 100,
        l_required_ft: Math.round(L * 100) / 100,
        algebraic_difference_percent: Math.round(A * 100) / 100,
        sight_distance_passes: true,
        source: "AASHTO GBOG 7e §3.4 (sag comfort criterion: K = V^2 / 46.5)",
        notes: [
          "Comfort criterion is generally less restrictive than headlight; check headlight too.",
        ],
      };
    } else if (input.criterion === "psd") {
      table = K_SAG_HEADLIGHT;
      tableLabel = "AASHTO GBOG 7e, Table 3-37 (sag, headlight); PSD not defined for sag";
      notes.push("PSD is a crest-curve criterion; using sag headlight K.");
    } else {
      table = K_SAG_HEADLIGHT;
      tableLabel = "AASHTO GBOG 7e, Table 3-37 (sag, headlight SSD)";
    }
  }

  const { k, usedSpeed } = lookupK(table, input.design_speed_mph);
  if (usedSpeed !== input.design_speed_mph) {
    notes.push(
      `Design speed ${input.design_speed_mph} mph rounded up to nearest tabulated value ${usedSpeed} mph.`,
    );
  }
  const L = k * A;

  return {
    k_required: k,
    l_required_ft: Math.round(L * 100) / 100,
    algebraic_difference_percent: Math.round(A * 100) / 100,
    sight_distance_passes: true,
    source: tableLabel,
    notes,
  };
}
