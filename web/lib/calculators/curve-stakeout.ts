/**
 * Curve stakeout (deflection angle / chord) table generator.
 *
 * Pure functions; no DOM or React.
 *
 * Given a curve radius, delta angle, PC station, and stakeout interval,
 * computes the full curve length, tangent, and a deflection-chord table
 * for field stakeout.
 *
 * Deflection from the tangent at the PC for a point at arc distance l:
 *   d = l / (2R)          (radians)
 *   chord = 2R sin(d)     (ft)
 *
 * Reference: Wolf & Ghilani, Elementary Surveying, Ch. 24.
 */

export type CurveStakeoutInput = {
  /** Curve radius, ft. */
  radius_ft: number;
  /** Central (delta) angle, degrees. */
  delta_deg: number;
  /** PC station, ft (raw feet, e.g. 12345.67 = STA 123+45.67). */
  pc_station_ft: number;
  /** Stakeout interval, ft (e.g. 25, 50, 100). */
  interval_ft: number;
};

export type StakeoutRow = {
  station_ft: number;
  /** Deflection angle from tangent at PC, degrees. */
  deflection_deg: number;
  /** Chord from PC to this point, ft. */
  chord_ft: number;
};

export type CurveStakeoutOutput = {
  /** Total arc length of curve, ft. */
  curve_length: number;
  /** Tangent length, ft. */
  tangent: number;
  stakeout_table: StakeoutRow[];
  notes: string[];
};

const DEG = Math.PI / 180;

export function compute(input: CurveStakeoutInput): CurveStakeoutOutput {
  const notes: string[] = [];
  const R = input.radius_ft;
  const delta = input.delta_deg;
  const pcSta = input.pc_station_ft;
  const interval = input.interval_ft;

  if (R <= 0) notes.push("Radius must be positive.");
  if (delta <= 0 || delta >= 360) notes.push("Delta should be between 0 and 360 degrees.");
  if (interval <= 0) notes.push("Stakeout interval must be positive.");

  const curveLength = R * delta * DEG;
  const tangent = R * Math.tan((delta * DEG) / 2);
  const ptSta = pcSta + curveLength;

  const table: StakeoutRow[] = [];

  if (R > 0 && delta > 0 && interval > 0) {
    // First row: PC itself.
    table.push({ station_ft: roundTo(pcSta, 2), deflection_deg: 0, chord_ft: 0 });

    // Round up to the next even station.
    const firstEven = Math.ceil(pcSta / interval) * interval;
    let sta = firstEven;
    if (Math.abs(sta - pcSta) < 0.001) sta += interval;

    while (sta < ptSta - 0.001) {
      const arc = sta - pcSta;
      const deflRad = arc / (2 * R);
      const chord = 2 * R * Math.sin(deflRad);
      table.push({
        station_ft: roundTo(sta, 2),
        deflection_deg: roundTo(deflRad / DEG, 4),
        chord_ft: roundTo(chord, 3),
      });
      sta += interval;
    }

    // Last row: PT.
    const arcPt = curveLength;
    const deflPt = arcPt / (2 * R);
    const chordPt = 2 * R * Math.sin(deflPt);
    table.push({
      station_ft: roundTo(ptSta, 2),
      deflection_deg: roundTo(deflPt / DEG, 4),
      chord_ft: roundTo(chordPt, 3),
    });
  }

  return {
    curve_length: roundTo(curveLength, 3),
    tangent: roundTo(tangent, 3),
    stakeout_table: table,
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
