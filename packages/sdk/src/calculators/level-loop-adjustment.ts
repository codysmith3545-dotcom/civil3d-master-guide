/**
 * Level loop adjustment calculator.
 *
 * Adjusts a network of differential-leveling observations starting from one
 * or more benchmarks with known elevations. Distributes the loop misclosure
 * either proportionally by distance or equally across all observations
 * (equal weight).
 *
 * At least one benchmark must have a known elevation. If distances are
 * provided the "proportional_by_distance" method is used; otherwise the
 * "equal_weight" method distributes the error evenly.
 *
 * Reference: Wolf & Ghilani, *Elementary Surveying*, Ch. 5 (Leveling);
 * FGCS Standards and Specifications for Geodetic Control Networks.
 */

export interface Benchmark {
  /** Point name. */
  name: string;
  /** Known elevation in feet (if this is a control benchmark). */
  known_elevation_ft?: number;
}

export interface LevelObservation {
  /** Name of the station observed from. */
  from: string;
  /** Name of the station observed to. */
  to: string;
  /** Observed elevation difference in feet (positive = up). */
  delta_h_ft: number;
  /** Distance of the level run in feet (optional; used for weighted adjustment). */
  distance_ft?: number;
}

export interface LevelLoopAdjustmentInput {
  benchmarks: Benchmark[];
  observations: LevelObservation[];
}

export interface LevelLoopAdjustmentResult {
  adjusted_elevations: Record<string, number>;
  loop_closure_ft: number;
  allowable_closure_ft: number | null;
  method: "proportional_by_distance" | "equal_weight";
  source: string;
  notes: string[];
}

function r6(x: number): number {
  return Math.round(x * 1e6) / 1e6;
}

export function levelLoopAdjustment(
  input: LevelLoopAdjustmentInput,
): LevelLoopAdjustmentResult {
  const notes: string[] = [];

  // Build a map of known elevations from benchmarks
  const knownElev = new Map<string, number>();
  for (const bm of input.benchmarks) {
    if (bm.known_elevation_ft !== undefined) {
      knownElev.set(bm.name, bm.known_elevation_ft);
    }
  }

  if (knownElev.size === 0) {
    notes.push("At least one benchmark must have a known elevation.");
    return {
      adjusted_elevations: {},
      loop_closure_ft: NaN,
      allowable_closure_ft: null,
      method: "equal_weight",
      source: "Level loop adjustment. Reference: Wolf & Ghilani, Elementary Surveying, Ch. 5.",
      notes,
    };
  }

  // Determine if we have distances for weighted adjustment
  const allHaveDistance = input.observations.every(
    (obs) => obs.distance_ft !== undefined && obs.distance_ft > 0,
  );
  const method: "proportional_by_distance" | "equal_weight" = allHaveDistance
    ? "proportional_by_distance"
    : "equal_weight";

  if (!allHaveDistance && input.observations.some((obs) => obs.distance_ft !== undefined)) {
    notes.push(
      "Some observations have distances and others do not. Using equal-weight adjustment.",
    );
  }

  // Forward-run: propagate elevations from known benchmarks
  // This is a simple sequential approach for a single loop/run
  const rawElev = new Map<string, number>(knownElev);
  const obsOrder = [...input.observations];

  // Try to propagate through the observations sequentially
  let changed = true;
  let passes = 0;
  const maxPasses = input.observations.length + 1;
  while (changed && passes < maxPasses) {
    changed = false;
    passes++;
    for (const obs of obsOrder) {
      if (rawElev.has(obs.from) && !rawElev.has(obs.to)) {
        rawElev.set(obs.to, rawElev.get(obs.from)! + obs.delta_h_ft);
        changed = true;
      } else if (rawElev.has(obs.to) && !rawElev.has(obs.from)) {
        rawElev.set(obs.from, rawElev.get(obs.to)! - obs.delta_h_ft);
        changed = true;
      }
    }
  }

  // Check for unresolvable points
  const allPoints = new Set<string>();
  for (const obs of input.observations) {
    allPoints.add(obs.from);
    allPoints.add(obs.to);
  }
  for (const bm of input.benchmarks) {
    allPoints.add(bm.name);
  }
  for (const pt of allPoints) {
    if (!rawElev.has(pt)) {
      notes.push(`Point "${pt}" could not be reached from any known benchmark.`);
    }
  }

  // Compute loop closure: sum of all observed delta_h should be zero for a
  // closed loop starting and ending at a known benchmark.
  // Look for the closure by checking if the last observation reconnects to a known point.
  let loopClosure = 0;
  let totalDistance = 0;
  const distances: number[] = [];

  for (const obs of input.observations) {
    totalDistance += obs.distance_ft ?? 1;
    distances.push(obs.distance_ft ?? 1);
  }

  // Compute closure: propagated elevation at a known benchmark vs. its known value
  // Use the first benchmark we can check
  let closureFound = false;
  for (const obs of input.observations) {
    if (rawElev.has(obs.from) && knownElev.has(obs.to)) {
      const propagated = rawElev.get(obs.from)! + obs.delta_h_ft;
      const known = knownElev.get(obs.to)!;
      loopClosure = propagated - known;
      closureFound = true;
      break;
    }
  }

  // Fallback: if no observation directly connects back to a known BM,
  // compute closure as sum of all delta_h in the loop
  if (!closureFound) {
    loopClosure = input.observations.reduce((sum, obs) => sum + obs.delta_h_ft, 0);
    if (Math.abs(loopClosure) > 1e-9) {
      closureFound = true;
    }
  }

  // Allowable closure for third-order leveling: 0.05 * sqrt(miles)
  // Convert total distance from feet to miles
  let allowableClosure: number | null = null;
  if (allHaveDistance) {
    const totalMiles = totalDistance / 5280;
    allowableClosure = r6(0.05 * Math.sqrt(totalMiles));
    if (Math.abs(loopClosure) > allowableClosure) {
      notes.push(
        `Loop closure (${r6(loopClosure)} ft) exceeds third-order allowable closure ` +
          `(${allowableClosure} ft = 0.05*sqrt(${r6(totalMiles)} mi)). Check for blunders.`,
      );
    }
  }

  // Apply adjustment: distribute misclosure proportionally
  const adjustedElev = new Map<string, number>(knownElev);
  let cumDist = 0;

  // Re-propagate with correction
  const visited = new Set<string>();
  for (const name of knownElev.keys()) {
    visited.add(name);
  }

  for (let i = 0; i < obsOrder.length; i++) {
    const obs = obsOrder[i];
    cumDist += distances[i];

    if (!visited.has(obs.from)) continue;

    let correction: number;
    if (method === "proportional_by_distance") {
      correction = -loopClosure * (cumDist / totalDistance);
    } else {
      correction = -loopClosure * ((i + 1) / obsOrder.length);
    }

    if (!knownElev.has(obs.to)) {
      const prevCorrection =
        method === "proportional_by_distance"
          ? -loopClosure * ((cumDist - distances[i]) / totalDistance)
          : -loopClosure * (i / obsOrder.length);
      const incrementalCorrection = correction - prevCorrection;
      const rawVal = adjustedElev.get(obs.from)! + obs.delta_h_ft + incrementalCorrection;
      adjustedElev.set(obs.to, r6(rawVal));
    }
    visited.add(obs.to);
  }

  // Build result
  const adjustedElevations: Record<string, number> = {};
  for (const [name, elev] of adjustedElev) {
    adjustedElevations[name] = r6(elev);
  }

  return {
    adjusted_elevations: adjustedElevations,
    loop_closure_ft: r6(loopClosure),
    allowable_closure_ft: allowableClosure,
    method,
    source: "Level loop adjustment. Reference: Wolf & Ghilani, Elementary Surveying, Ch. 5.",
    notes,
  };
}
