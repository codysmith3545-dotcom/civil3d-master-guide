/**
 * Level loop adjustment calculator.
 *
 * Pure functions; no DOM or React.
 *
 * Input: a set of benchmarks (some with known elevations) and differential
 * leveling observations (from, to, delta_h, optional distance). The
 * calculator distributes closure error proportionally by distance (weighted)
 * or equally (unweighted) to produce adjusted elevations for all points.
 *
 * Method:
 *   - Weighted: correction per obs = -(closure * obs_dist / total_dist)
 *   - Unweighted: correction per obs = -(closure / num_obs)
 *
 * Reference: Wolf & Ghilani, Elementary Surveying, Ch. 4-5.
 */

export type Benchmark = {
  name: string;
  /** Known elevation (ft). Optional — at least one must be given. */
  elevation?: number;
};

export type Observation = {
  from: string;
  to: string;
  /** Observed height difference (to - from), ft. */
  delta_h: number;
  /** Distance of the level run, ft. Optional; used for weighted adjustment. */
  distance?: number;
};

export type LevelLoopInput = {
  benchmarks: Benchmark[];
  observations: Observation[];
};

export type LevelLoopOutput = {
  /** Adjusted elevation for each point name. */
  elevations: Record<string, number>;
  /** Misclosure before adjustment, ft. */
  closure_ft: number;
  /** Method used for adjustment. */
  method: "weighted" | "unweighted";
  notes: string[];
};

export function compute(input: LevelLoopInput): LevelLoopOutput {
  const notes: string[] = [];

  // Build known-elevation map.
  const knownElev: Record<string, number> = {};
  for (const bm of input.benchmarks) {
    if (bm.elevation != null) {
      knownElev[bm.name] = bm.elevation;
    }
  }

  if (Object.keys(knownElev).length === 0) {
    notes.push("At least one benchmark must have a known elevation.");
    return { elevations: {}, closure_ft: 0, method: "unweighted", notes };
  }
  if (input.observations.length === 0) {
    notes.push("No observations provided.");
    return { elevations: knownElev, closure_ft: 0, method: "unweighted", notes };
  }

  // Determine if we can do weighted adjustment.
  const allHaveDist = input.observations.every(
    (o) => o.distance != null && o.distance > 0,
  );
  const method: "weighted" | "unweighted" = allHaveDist
    ? "weighted"
    : "unweighted";

  if (!allHaveDist) {
    notes.push(
      "Not all observations have distances; using unweighted (equal) adjustment.",
    );
  }

  // Forward pass: propagate elevations from known benchmarks.
  const elevations: Record<string, number> = { ...knownElev };
  const orderedObs = [...input.observations];

  // Iterate multiple times to propagate through the network.
  for (let pass = 0; pass < orderedObs.length + 1; pass++) {
    for (const obs of orderedObs) {
      if (elevations[obs.from] != null && elevations[obs.to] == null) {
        elevations[obs.to] = elevations[obs.from] + obs.delta_h;
      }
      if (elevations[obs.to] != null && elevations[obs.from] == null) {
        elevations[obs.from] = elevations[obs.to] - obs.delta_h;
      }
    }
  }

  // Compute closure: sum of delta_h around the loop.
  // For a closed loop starting and ending at a known BM, the closure is the
  // sum of all delta_h minus the expected difference.
  let closure = 0;
  const startBM = input.observations[0].from;
  const endBM = input.observations[input.observations.length - 1].to;

  if (knownElev[startBM] != null && knownElev[endBM] != null) {
    const sumDeltaH = input.observations.reduce((s, o) => s + o.delta_h, 0);
    const expectedDiff = knownElev[endBM] - knownElev[startBM];
    closure = sumDeltaH - expectedDiff;
  } else {
    // Try loop closure (start == end).
    const sumDeltaH = input.observations.reduce((s, o) => s + o.delta_h, 0);
    closure = sumDeltaH;
    if (startBM !== endBM) {
      notes.push(
        "Loop does not close to a known benchmark. Closure shown is the raw sum of delta_h.",
      );
    }
  }

  // Distribute correction.
  const totalDist = allHaveDist
    ? input.observations.reduce((s, o) => s + (o.distance ?? 0), 0)
    : 0;
  const numObs = input.observations.length;

  // Re-propagate with corrections.
  const adjusted: Record<string, number> = { ...knownElev };
  let cumCorr = 0;

  for (const obs of orderedObs) {
    const corr =
      method === "weighted" && totalDist > 0
        ? -closure * ((obs.distance ?? 0) / totalDist)
        : -closure / numObs;
    cumCorr += corr;

    if (adjusted[obs.from] != null) {
      adjusted[obs.to] = roundTo(
        adjusted[obs.from] + obs.delta_h + corr,
        4,
      );
    }
  }

  // Overwrite known benchmarks (they don't change).
  for (const [name, elev] of Object.entries(knownElev)) {
    adjusted[name] = elev;
  }

  return {
    elevations: adjusted,
    closure_ft: roundTo(closure, 4),
    method,
    notes,
  };
}

function roundTo(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}
