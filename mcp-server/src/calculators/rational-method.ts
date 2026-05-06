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
}

export function rationalMethod(input: RationalMethodInput): RationalMethodResult {
  const q = input.c * input.i_in_hr * input.a_acres;
  return {
    q_cfs: Math.round(q * 1000) / 1000,
    source: "Q = C·i·A (Rational Method). Reference: FHWA HEC-22, Ch. 3; AASHTO Drainage Guidelines.",
    notes: [
      "Valid for drainage areas under ~200 acres with relatively uniform land use.",
      "Use intensity from local IDF curve for the chosen storm frequency and Tc.",
    ],
  };
}
