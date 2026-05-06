/**
 * Curve stakeout calculator.
 *
 * Generates a stakeout table for a simple circular horizontal curve using
 * the deflection-angle method (from the PC) or the chord-offset method.
 *
 * Also computes the basic curve geometry: curve length, tangent, external,
 * middle ordinate, and long chord.
 *
 * Deflection method:
 *   deflection = arc / (2 * R)
 *   chord_from_PC = 2 * R * sin(total_deflection)
 *
 * Chord-offset method:
 *   tangent_offset = R - sqrt(R^2 - x^2)  where x = distance along tangent
 *   radial_offset  = R - sqrt(R^2 - chord^2)
 *
 * Reference: Wolf & Ghilani, *Elementary Surveying*, Ch. 24 (Horizontal
 * curves); Brinker & Wolf, *Elementary Surveying*, §24.
 */

export interface CurveStakeoutInput {
  /** Radius of the circular curve in feet. */
  radius_ft: number;
  /** Central (deflection) angle in decimal degrees. */
  delta_deg: number;
  /** Station of the PC (Point of Curvature) in feet. */
  pc_station_ft: number;
  /** Stakeout interval in feet (default 25). */
  stake_interval_ft?: number;
  /** Method: "deflection" (default) or "chord_offset". */
  method?: "deflection" | "chord_offset";
}

export interface StakeoutRow {
  station: number;
  deflection_deg: number;
  total_deflection_deg: number;
  chord_from_pc_ft: number;
  tangent_offset_ft?: number;
  radial_offset_ft?: number;
}

export interface CurveStakeoutResult {
  curve_length_ft: number;
  tangent_ft: number;
  external_ft: number;
  mid_ordinate_ft: number;
  long_chord_ft: number;
  stakeout_table: StakeoutRow[];
  source: string;
  notes: string[];
}

const DEG = Math.PI / 180;

function r6(x: number): number {
  return Math.round(x * 1e6) / 1e6;
}

function r4(x: number): number {
  return Math.round(x * 1e4) / 1e4;
}

export function curveStakeout(input: CurveStakeoutInput): CurveStakeoutResult {
  const notes: string[] = [];
  const R = input.radius_ft;
  const delta = input.delta_deg * DEG;
  const halfDelta = delta / 2;
  const interval = input.stake_interval_ft ?? 25;
  const method = input.method ?? "deflection";

  // Basic curve geometry
  const curveLength = R * delta;
  const tangent = R * Math.tan(halfDelta);
  const external = R * (1 / Math.cos(halfDelta) - 1);
  const midOrdinate = R * (1 - Math.cos(halfDelta));
  const longChord = 2 * R * Math.sin(halfDelta);

  const pcStation = input.pc_station_ft;
  const ptStation = pcStation + curveLength;

  // Build stakeout stations: start at PC, then at each interval, end at PT
  const stations: number[] = [pcStation];

  // First regular station after PC
  const firstRegular = Math.ceil(pcStation / interval) * interval;
  if (firstRegular > pcStation && firstRegular < ptStation) {
    for (let s = firstRegular; s < ptStation; s += interval) {
      stations.push(s);
    }
  } else if (firstRegular === pcStation) {
    for (let s = pcStation + interval; s < ptStation; s += interval) {
      stations.push(s);
    }
  }

  // Always include PT
  if (stations[stations.length - 1] !== ptStation) {
    stations.push(ptStation);
  }

  const rows: StakeoutRow[] = [];

  for (const sta of stations) {
    const arcFromPC = sta - pcStation;

    // Deflection angle for this arc length: d = arc / (2R)
    const deflRad = arcFromPC / (2 * R);
    const deflDeg = deflRad / DEG;

    // Total deflection from PC tangent (same as deflRad for individual points
    // measured from PC)
    const totalDeflDeg = deflDeg;

    // Chord from PC to this point: C = 2R * sin(deflection)
    const chordFromPC = 2 * R * Math.sin(deflRad);

    const row: StakeoutRow = {
      station: r4(sta),
      deflection_deg: r6(deflDeg),
      total_deflection_deg: r6(totalDeflDeg),
      chord_from_pc_ft: r6(chordFromPC),
    };

    if (method === "chord_offset") {
      // Tangent offset: y = R - sqrt(R^2 - x^2) where x = chord distance along tangent
      const x = R * Math.sin(arcFromPC / R);
      const tangentOffset = R - Math.sqrt(Math.max(0, R * R - x * x));
      row.tangent_offset_ft = r6(tangentOffset);

      // Radial offset from the long chord line
      const radialOffset = R - Math.sqrt(Math.max(0, R * R - chordFromPC * chordFromPC / 4));
      row.radial_offset_ft = r6(radialOffset);
    }

    rows.push(row);
  }

  if (method === "deflection") {
    notes.push(
      "Deflection angles are measured from the tangent at the PC. " +
        "Set the instrument at the PC, sight along the back tangent, then turn the deflection angle.",
    );
  } else {
    notes.push(
      "Chord-offset method: tangent_offset is perpendicular distance from the tangent line; " +
        "radial_offset is perpendicular distance from the long chord.",
    );
  }

  if (curveLength > R * Math.PI) {
    notes.push("Curve subtends more than 180°; verify field procedure for long curves.");
  }

  return {
    curve_length_ft: r6(curveLength),
    tangent_ft: r6(tangent),
    external_ft: r6(external),
    mid_ordinate_ft: r6(midOrdinate),
    long_chord_ft: r6(longChord),
    stakeout_table: rows,
    source:
      "Deflection-angle / chord-offset curve stakeout. " +
      "Reference: Wolf & Ghilani, Elementary Surveying, Ch. 24.",
    notes,
  };
}
