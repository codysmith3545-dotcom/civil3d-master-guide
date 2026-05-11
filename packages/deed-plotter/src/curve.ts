/**
 * Circular-curve solver.
 *
 * Given a start point, an incoming-tangent azimuth, and any 2+ of
 * { radius, arcLength, delta, chord, tangent }, derive the remaining
 * elements plus the curve center and end point.
 *
 * Curve geometry conventions:
 *   - Azimuth: degrees clockwise from north (0 = N, 90 = E).
 *   - Center is offset perpendicular to the incoming tangent by R:
 *       right-perpendicular for a right-curving curve,
 *       left-perpendicular for a left-curving curve.
 *   - End point: rotate start around center by delta (signed by direction).
 *   - Outgoing tangent azimuth = incoming + delta (right) or − delta (left).
 *
 * Standard relationships (with delta in radians):
 *   L     = R * delta
 *   chord = 2 * R * sin(delta/2)
 *   T     = R * tan(delta/2)
 */

import type { Bearing, CurveSolution, Point } from "./types.js";

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;
const TWO_PI = 2 * Math.PI;

export interface CurveInput {
  radiusFt?: number;
  arcLengthFt?: number;
  deltaDeg?: number;
  chordFt?: number;
  chordBearing?: Bearing;
  tangentFt?: number;
}

function azimuthToBearing(azimuthDeg: number): Bearing {
  let az = ((azimuthDeg % 360) + 360) % 360;
  let quadrant: Bearing["quadrant"];
  let theta: number;
  if (az <= 90) {
    quadrant = "NE";
    theta = az;
  } else if (az <= 180) {
    quadrant = "SE";
    theta = 180 - az;
  } else if (az <= 270) {
    quadrant = "SW";
    theta = az - 180;
  } else {
    quadrant = "NW";
    theta = 360 - az;
  }
  const degrees = Math.floor(theta);
  const minutesFloat = (theta - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.round((minutesFloat - minutes) * 60 * 100) / 100;
  const raw = `${quadrant[0]} ${degrees}°${minutes}'${seconds.toFixed(2)}" ${quadrant[1]}`;
  return { raw, quadrant, degrees, minutes, seconds, azimuthDeg: az };
}

/**
 * Solve for the missing curve elements.
 *
 * Need at least one of: R, or (L and Δ), or (chord and Δ), or (chord and L), etc.
 * Throws if fewer than 2 independent elements are provided and R is missing.
 */
export function solveCurve(
  start: Point,
  incomingTangentAzimuth: number,
  input: CurveInput,
  direction: "left" | "right",
): CurveSolution {
  let { radiusFt: R, arcLengthFt: L, deltaDeg: deltaD, chordFt: chord, tangentFt: T } = input;

  // Derive missing elements. We'll iterate until everything is filled or we
  // determine it's underspecified.
  const have = () => ({
    R: R !== undefined,
    L: L !== undefined,
    delta: deltaD !== undefined,
    chord: chord !== undefined,
    T: T !== undefined,
  });

  // Up to a few passes — each pass resolves what it can.
  for (let pass = 0; pass < 6; pass++) {
    const h = have();
    const countKnown = Object.values(h).filter(Boolean).length;
    if (countKnown >= 5) break;

    // R + delta -> L, chord, T
    if (h.R && h.delta) {
      const deltaRad = (deltaD as number) * DEG;
      if (!h.L) L = (R as number) * deltaRad;
      if (!h.chord) chord = 2 * (R as number) * Math.sin(deltaRad / 2);
      if (!h.T) T = (R as number) * Math.tan(deltaRad / 2);
    }
    // R + L -> delta
    if (h.R && h.L && !have().delta) {
      deltaD = ((L as number) / (R as number)) * RAD;
    }
    // R + chord -> delta (delta = 2*asin(chord/(2R)))
    if (h.R && h.chord && !have().delta) {
      const ratio = (chord as number) / (2 * (R as number));
      const clamped = Math.max(-1, Math.min(1, ratio));
      deltaD = 2 * Math.asin(clamped) * RAD;
    }
    // R + T -> delta (delta = 2 * atan(T/R))
    if (h.R && h.T && !have().delta) {
      deltaD = 2 * Math.atan((T as number) / (R as number)) * RAD;
    }
    // delta + L -> R
    if (h.delta && h.L && !have().R) {
      const deltaRad = (deltaD as number) * DEG;
      if (Math.abs(deltaRad) > 1e-12) R = (L as number) / deltaRad;
    }
    // delta + chord -> R
    if (h.delta && h.chord && !have().R) {
      const deltaRad = (deltaD as number) * DEG;
      if (Math.abs(Math.sin(deltaRad / 2)) > 1e-12) {
        R = (chord as number) / (2 * Math.sin(deltaRad / 2));
      }
    }
    // delta + T -> R
    if (h.delta && h.T && !have().R) {
      const deltaRad = (deltaD as number) * DEG;
      if (Math.abs(Math.tan(deltaRad / 2)) > 1e-12) {
        R = (T as number) / Math.tan(deltaRad / 2);
      }
    }
    // L + chord -> Find delta numerically (L = R*delta, chord = 2R sin(delta/2))
    //   => L/chord = (delta/2) / sin(delta/2). Solve for delta.
    if (h.L && h.chord && !have().delta) {
      const ratio = (L as number) / (chord as number);
      // ratio must be >= 1 (L >= chord for sensible curves; at delta=0 ratio→1)
      if (ratio >= 1 - 1e-9) {
        deltaD = solveDeltaFromArcChord(ratio) * RAD;
      }
    }
    // L + T -> Find delta numerically: L = R*delta, T = R*tan(delta/2) =>
    //   L/T = delta / tan(delta/2). Solve.
    if (h.L && h.T && !have().delta) {
      const ratio = (L as number) / (T as number);
      if (ratio > 0) {
        deltaD = solveDeltaFromArcTangent(ratio) * RAD;
      }
    }
    // chord + T -> chord/T = 2 sin(delta/2) / tan(delta/2) = 2 cos(delta/2)
    if (h.chord && h.T && !have().delta) {
      const c = (chord as number) / (2 * (T as number));
      const clamped = Math.max(-1, Math.min(1, c));
      deltaD = 2 * Math.acos(clamped) * RAD;
    }

    // If still nothing changed this pass, break.
    const h2 = have();
    if (
      h2.R === h.R &&
      h2.L === h.L &&
      h2.delta === h.delta &&
      h2.chord === h.chord &&
      h2.T === h.T
    ) {
      break;
    }
  }

  if (R === undefined || deltaD === undefined) {
    throw new Error("Cannot solve curve: insufficient elements (need at least 2 of R, L, delta, chord, T).");
  }

  const deltaRad = deltaD * DEG;
  if (L === undefined) L = R * deltaRad;
  if (chord === undefined) chord = 2 * R * Math.sin(deltaRad / 2);
  if (T === undefined) T = R * Math.tan(deltaRad / 2);

  // Now compute center and end point.
  // Incoming tangent direction as a unit vector in (n, e):
  const tAz = ((incomingTangentAzimuth % 360) + 360) % 360;
  const tAzRad = tAz * DEG;
  const tN = Math.cos(tAzRad);
  const tE = Math.sin(tAzRad);

  // Perpendicular toward the center.
  //   In (n, e) with n-up/e-right, a clockwise rotation by 90° maps
  //   (n, e) -> (-e, n). So for tangent (tN, tE):
  //     right-perp (clockwise 90°)   = (-tE,  tN)
  //     left-perp  (counterclockwise) = ( tE, -tN)
  //   For a curve turning right, the center lies on the right perpendicular.
  const sign = direction === "right" ? 1 : -1;
  const perpN = sign * -tE;
  const perpE = sign * tN;

  const center: Point = {
    n: start.n + R * perpN,
    e: start.e + R * perpE,
  };

  // Vector from center to start:
  const v0N = start.n - center.n;
  const v0E = start.e - center.e;

  // Rotate v0 about the center by delta. In a north-up, east-right system,
  // a visual clockwise rotation (right curve) by angle a maps (n, e) to:
  //     n' = n cos(a) - e sin(a)
  //     e' = e cos(a) + n sin(a)
  // For a left curve, rotation is counterclockwise (negate the angle).
  const rotAngle = sign * deltaRad;
  const cosA = Math.cos(rotAngle);
  const sinA = Math.sin(rotAngle);
  const v1N = v0N * cosA - v0E * sinA;
  const v1E = v0E * cosA + v0N * sinA;

  const endPoint: Point = {
    n: center.n + v1N,
    e: center.e + v1E,
  };

  const chordBearing = azimuthToBearing(
    Math.atan2(endPoint.e - start.e, endPoint.n - start.n) * RAD,
  );

  return {
    radiusFt: R,
    arcLengthFt: L,
    deltaDeg: deltaD,
    chordFt: chord,
    chordBearing: input.chordBearing ?? chordBearing,
    tangentFt: T,
    center,
    endPoint,
  };
}

/**
 * Outgoing tangent azimuth after a curve.
 */
export function outgoingTangentAzimuth(
  incomingAzimuth: number,
  deltaDeg: number,
  direction: "left" | "right",
): number {
  const sign = direction === "right" ? 1 : -1;
  let az = incomingAzimuth + sign * deltaDeg;
  az = ((az % 360) + 360) % 360;
  return az;
}

// Solve ratio = (delta/2) / sin(delta/2) for delta in (0, 2π).
function solveDeltaFromArcChord(ratio: number): number {
  // monotonic in (0, 2π); use bisection.
  if (ratio <= 1 + 1e-12) return 0;
  let lo = 1e-9;
  let hi = TWO_PI - 1e-9;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const f = mid / 2 / Math.sin(mid / 2);
    if (f < ratio) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Solve ratio = delta / tan(delta/2) for delta in (0, π).
// At delta→0, tan(delta/2)≈delta/2, ratio→2. At delta→π, tan(π/2)→∞, ratio→0.
function solveDeltaFromArcTangent(ratio: number): number {
  if (ratio >= 2 - 1e-12) return 0;
  let lo = 1e-9;
  let hi = Math.PI - 1e-9;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const f = mid / Math.tan(mid / 2);
    // f is decreasing in delta
    if (f > ratio) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export { azimuthToBearing };
