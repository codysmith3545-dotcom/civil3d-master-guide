/**
 * Rational method peak-flow calculator.
 *
 *   Q = C · i · A           (English / customary units)
 *
 * Where Q is peak discharge in cfs, C is the dimensionless runoff coefficient,
 * i is rainfall intensity in inches per hour for a duration equal to tc, and
 * A is the contributing drainage area in acres. The conventional "Q = CiA"
 * statement of the equation embeds the unit conversion factor of 1.008 that
 * makes the right side land in cfs; this is treated as 1.0 in practice.
 *
 * Time-of-concentration helper uses the Kirpich equation (overland flow):
 *
 *   tc (min) = 0.0078 · L^0.77 · S^-0.385       (L in feet, S in ft/ft)
 *
 * Kirpich was developed for small agricultural watersheds; treat results
 * outside ~1–200 acres or with very flat slopes as suspect.
 */

export type RationalInput = {
  /** Runoff coefficient C, dimensionless (0–1). */
  C: number;
  /** Rainfall intensity i, inches per hour. */
  intensityInPerHr: number;
  /** Drainage area A, acres. */
  areaAcres: number;
};

export type RationalOutput = {
  /** Peak flow in cfs. */
  Q: number;
  notes: string[];
};

export function compute(input: RationalInput): RationalOutput {
  const notes: string[] = [];
  if (input.C < 0 || input.C > 1)
    notes.push("C is dimensionless and should fall between 0 and 1.");
  if (input.areaAcres > 200)
    notes.push(
      "Drainage area exceeds 200 acres. The Rational Method is conventionally limited to small watersheds; consider SCS / NRCS unit hydrograph methods.",
    );
  const Q = input.C * input.intensityInPerHr * input.areaAcres;
  return { Q: roundTo(Q, 3), notes };
}

export type KirpichInput = {
  /** Hydraulic length L, feet. */
  lengthFt: number;
  /** Average slope along that length, ft/ft (e.g. 0.02 for 2%). */
  slopeFtPerFt: number;
};

export type KirpichOutput = {
  /** Time of concentration in minutes. */
  tcMinutes: number;
  notes: string[];
};

export function kirpichTc(input: KirpichInput): KirpichOutput {
  const notes: string[] = [];
  const L = input.lengthFt;
  const S = input.slopeFtPerFt;
  if (L <= 0) notes.push("Length must be positive.");
  if (S <= 0) notes.push("Slope must be positive (ft/ft).");
  if (S > 0 && S < 0.0005)
    notes.push(
      "Slopes below 0.05% give Kirpich tc values that are unreliable; use SCS sheet/shallow flow components for very flat ground.",
    );
  const tc = 0.0078 * Math.pow(L, 0.77) * Math.pow(S, -0.385);
  return { tcMinutes: roundTo(tc, 2), notes };
}

function roundTo(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}
