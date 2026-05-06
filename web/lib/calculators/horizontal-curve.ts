/**
 * Horizontal (circular) curve calculator.
 *
 * Pure functions; no DOM. Standard arc-definition formulas.
 *
 *   T = R · tan(Δ/2)
 *   L = R · Δ              (Δ in radians)
 *   M = R · (1 − cos(Δ/2)) // middle ordinate
 *   E = R · (sec(Δ/2) − 1) // external
 *   LC = 2 · R · sin(Δ/2)  // long chord
 *
 * Stationing convention: stations are passed as raw feet (no `+`); the caller
 * formats them. PC = PI − T. PT = PC + L.
 */

export type HorizontalCurveInput = {
  /** Radius, ft. */
  R: number;
  /** Deflection angle Δ, degrees. */
  deltaDeg: number;
  /** PI station, in feet (e.g. 12345.67 = STA 123+45.67). */
  piStationFt: number;
  /** Number of intermediate deflection rows in the chord table. Default 5. */
  deflectionRows?: number;
};

export type DeflectionRow = {
  stationFt: number;
  arcFromPCFt: number;
  /** Deflection angle from the PC tangent, in decimal degrees. */
  deflectionDeg: number;
  /** Chord from the PC to this point, in feet. */
  chordFromPCFt: number;
};

export type HorizontalCurveOutput = {
  /** Tangent length, ft. */
  T: number;
  /** Arc length, ft. */
  L: number;
  /** Middle ordinate, ft. */
  M: number;
  /** External, ft. */
  E: number;
  /** Long chord, ft. */
  LC: number;
  pcStationFt: number;
  ptStationFt: number;
  deflectionTable: DeflectionRow[];
  notes: string[];
};

const DEG = Math.PI / 180;

export function compute(input: HorizontalCurveInput): HorizontalCurveOutput {
  const notes: string[] = [];
  const R = input.R;
  const delta = input.deltaDeg;
  if (R <= 0) notes.push("Radius must be positive.");
  if (delta <= 0 || delta >= 180)
    notes.push("Δ should be between 0° and 180°.");

  const halfDelta = (delta * DEG) / 2;
  const T = R * Math.tan(halfDelta);
  const L = R * (delta * DEG);
  const M = R * (1 - Math.cos(halfDelta));
  const E = R * (1 / Math.cos(halfDelta) - 1);
  const LC = 2 * R * Math.sin(halfDelta);

  const pcStationFt = input.piStationFt - T;
  const ptStationFt = pcStationFt + L;

  // Deflection table: divide L into N equal arcs (default 5 + endpoints).
  const rows = Math.max(1, input.deflectionRows ?? 5);
  const deflectionTable: DeflectionRow[] = [];
  for (let i = 0; i <= rows; i++) {
    const arc = (L * i) / rows;
    const angleAtCenter = arc / R; // radians; for a circle, arc = R·θ
    const deflectionRad = angleAtCenter / 2; // PC-tangent deflection is half the central angle
    const chord = 2 * R * Math.sin(deflectionRad);
    deflectionTable.push({
      stationFt: roundTo(pcStationFt + arc, 2),
      arcFromPCFt: roundTo(arc, 2),
      deflectionDeg: roundTo(deflectionRad / DEG, 4),
      chordFromPCFt: roundTo(chord, 3),
    });
  }

  return {
    T: roundTo(T, 3),
    L: roundTo(L, 3),
    M: roundTo(M, 3),
    E: roundTo(E, 3),
    LC: roundTo(LC, 3),
    pcStationFt: roundTo(pcStationFt, 2),
    ptStationFt: roundTo(ptStationFt, 2),
    deflectionTable,
    notes,
  };
}

/** Convenience: format a stationing value in feet as `STA NNN+NN.NN`. */
export function formatStation(ft: number): string {
  const sign = ft < 0 ? "-" : "";
  const abs = Math.abs(ft);
  const hundreds = Math.floor(abs / 100);
  const remainder = abs - hundreds * 100;
  return `${sign}${hundreds}+${remainder.toFixed(2).padStart(5, "0")}`;
}

function roundTo(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}
