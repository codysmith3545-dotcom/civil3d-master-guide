/**
 * Rational method for peak runoff:
 *
 *   Q = C * i * A   (US customary; A in acres, i in in/hr; result Q in cfs)
 *
 * The unit conversion factor (1 acre-in/hr ≈ 1.008 cfs) is treated as 1.0 by
 * convention in the rational method.
 *
 * Reference: AASHTO Highway Drainage Guidelines; FHWA HEC-22 Ch. 3.
 */

export interface RationalMethodInput {
  c: number;
  i_in_hr: number;
  a_acres: number;
}

export interface RationalMethodResult {
  q_cfs: number;
  source: string;
  notes: string[];
  relatedContent: string | null;
}

function requireFinite(value: unknown, name: string): number {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`Invalid input for ${name}: must be a finite number`);
  }
  return value;
}

export function rationalMethod(input: RationalMethodInput): RationalMethodResult {
  const c = requireFinite(input?.c, "c");
  const i = requireFinite(input?.i_in_hr, "i_in_hr");
  const a = requireFinite(input?.a_acres, "a_acres");

  if (c < 0 || c > 1) throw new Error("Runoff coefficient c must be between 0 and 1");
  if (i < 0) throw new Error("i_in_hr (rainfall intensity) must be >= 0");
  if (a < 0) throw new Error("a_acres (drainage area) must be >= 0");

  const q = c * i * a;

  if (!Number.isFinite(q)) {
    throw new Error("Calculation produced non-finite result for q_cfs: check inputs");
  }

  return {
    q_cfs: Math.round(q * 1000) / 1000,
    source:
      "Q = C·i·A (Rational Method). Reference: FHWA HEC-22, Ch. 3; AASHTO Drainage Guidelines.",
    notes: [
      "Valid for drainage areas under ~200 acres with relatively uniform land use.",
      "Use intensity from local IDF curve for the chosen storm frequency and Tc.",
    ],
    relatedContent: "engineering/stormwater/rational-method-and-tc",
  };
}
