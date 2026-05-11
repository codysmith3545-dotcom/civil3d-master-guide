import { describe, expect, it } from "vitest";
import { solveCurve, outgoingTangentAzimuth, azimuthToBearing } from "../src/curve.js";
import { bearingFromAzimuth } from "./fixtures/helpers.js";

const start = { n: 0, e: 0 };

describe("solveCurve: element combinations", () => {
  const R = 100;
  const deltaDeg = 90;
  const deltaRad = (deltaDeg * Math.PI) / 180;
  const L = R * deltaRad; // ~157.0796
  const chord = 2 * R * Math.sin(deltaRad / 2); // ~141.4214
  const T = R * Math.tan(deltaRad / 2); // 100

  it("R + delta -> L, chord, T", () => {
    const s = solveCurve(start, 0, { radiusFt: R, deltaDeg }, "right");
    expect(s.arcLengthFt).toBeCloseTo(L, 6);
    expect(s.chordFt).toBeCloseTo(chord, 6);
    expect(s.tangentFt).toBeCloseTo(T, 6);
    expect(s.radiusFt).toBeCloseTo(R, 6);
    expect(s.deltaDeg).toBeCloseTo(deltaDeg, 6);
  });

  it("R + L -> delta, chord, T", () => {
    const s = solveCurve(start, 0, { radiusFt: R, arcLengthFt: L }, "right");
    expect(s.deltaDeg).toBeCloseTo(deltaDeg, 6);
    expect(s.chordFt).toBeCloseTo(chord, 6);
    expect(s.tangentFt).toBeCloseTo(T, 6);
  });

  it("R + chord -> delta, L, T", () => {
    const s = solveCurve(start, 0, { radiusFt: R, chordFt: chord }, "right");
    expect(s.deltaDeg).toBeCloseTo(deltaDeg, 4);
    expect(s.arcLengthFt).toBeCloseTo(L, 4);
    expect(s.tangentFt).toBeCloseTo(T, 4);
  });

  it("R + T -> delta, L, chord", () => {
    const s = solveCurve(start, 0, { radiusFt: R, tangentFt: T }, "right");
    expect(s.deltaDeg).toBeCloseTo(deltaDeg, 6);
    expect(s.arcLengthFt).toBeCloseTo(L, 6);
    expect(s.chordFt).toBeCloseTo(chord, 6);
  });

  it("L + delta -> R, chord, T", () => {
    const s = solveCurve(start, 0, { arcLengthFt: L, deltaDeg }, "right");
    expect(s.radiusFt).toBeCloseTo(R, 6);
    expect(s.chordFt).toBeCloseTo(chord, 6);
    expect(s.tangentFt).toBeCloseTo(T, 6);
  });

  it("L + chord -> R, delta, T", () => {
    const s = solveCurve(start, 0, { arcLengthFt: L, chordFt: chord }, "right");
    expect(s.deltaDeg).toBeCloseTo(deltaDeg, 3);
    expect(s.radiusFt).toBeCloseTo(R, 2);
    expect(s.tangentFt).toBeCloseTo(T, 2);
  });

  it("L + T -> R, delta, chord", () => {
    const s = solveCurve(start, 0, { arcLengthFt: L, tangentFt: T }, "right");
    expect(s.deltaDeg).toBeCloseTo(deltaDeg, 4);
    expect(s.radiusFt).toBeCloseTo(R, 4);
    expect(s.chordFt).toBeCloseTo(chord, 4);
  });

  it("delta + chord -> R, L, T", () => {
    const s = solveCurve(start, 0, { deltaDeg, chordFt: chord }, "right");
    expect(s.radiusFt).toBeCloseTo(R, 6);
    expect(s.arcLengthFt).toBeCloseTo(L, 6);
    expect(s.tangentFt).toBeCloseTo(T, 6);
  });

  it("delta + T -> R, L, chord", () => {
    const s = solveCurve(start, 0, { deltaDeg, tangentFt: T }, "right");
    expect(s.radiusFt).toBeCloseTo(R, 6);
    expect(s.arcLengthFt).toBeCloseTo(L, 6);
    expect(s.chordFt).toBeCloseTo(chord, 6);
  });

  it("chord + T -> R, delta, L", () => {
    const s = solveCurve(start, 0, { chordFt: chord, tangentFt: T }, "right");
    expect(s.deltaDeg).toBeCloseTo(deltaDeg, 6);
    expect(s.radiusFt).toBeCloseTo(R, 6);
    expect(s.arcLengthFt).toBeCloseTo(L, 6);
  });

  it("throws when fewer than 2 elements are provided", () => {
    expect(() => solveCurve(start, 0, { radiusFt: R }, "right")).toThrow();
  });
});

describe("solveCurve: geometry of 90° right curve from due-N tangent", () => {
  // Start (0,0), heading N (az=0). A 90° right curve of R=100 ends due-E
  // of the start, at (100, 100) in (n, e). Center is at (0, 100).
  const s = solveCurve({ n: 0, e: 0 }, 0, { radiusFt: 100, deltaDeg: 90 }, "right");

  it("center is at (0, 100)", () => {
    expect(s.center.n).toBeCloseTo(0, 6);
    expect(s.center.e).toBeCloseTo(100, 6);
  });

  it("end point is at (100, 100)", () => {
    expect(s.endPoint.n).toBeCloseTo(100, 6);
    expect(s.endPoint.e).toBeCloseTo(100, 6);
  });
});

describe("solveCurve: geometry of 90° left curve from due-N tangent", () => {
  // Start (0,0), heading N. Left curve of R=100 ends at (100, -100), center (0, -100).
  const s = solveCurve({ n: 0, e: 0 }, 0, { radiusFt: 100, deltaDeg: 90 }, "left");

  it("center is at (0, -100)", () => {
    expect(s.center.n).toBeCloseTo(0, 6);
    expect(s.center.e).toBeCloseTo(-100, 6);
  });

  it("end point is at (100, -100)", () => {
    expect(s.endPoint.n).toBeCloseTo(100, 6);
    expect(s.endPoint.e).toBeCloseTo(-100, 6);
  });
});

describe("outgoingTangentAzimuth", () => {
  it("right curve adds delta to incoming", () => {
    expect(outgoingTangentAzimuth(0, 90, "right")).toBeCloseTo(90, 6);
    expect(outgoingTangentAzimuth(45, 30, "right")).toBeCloseTo(75, 6);
  });
  it("left curve subtracts delta from incoming", () => {
    expect(outgoingTangentAzimuth(90, 90, "left")).toBeCloseTo(0, 6);
    expect(outgoingTangentAzimuth(45, 30, "left")).toBeCloseTo(15, 6);
  });
  it("wraps to [0, 360)", () => {
    expect(outgoingTangentAzimuth(10, 30, "left")).toBeCloseTo(340, 6);
    expect(outgoingTangentAzimuth(350, 30, "right")).toBeCloseTo(20, 6);
  });
});

describe("azimuthToBearing", () => {
  it("0° = N (NE quadrant with theta 0)", () => {
    const b = azimuthToBearing(0);
    expect(b.azimuthDeg).toBeCloseTo(0, 6);
    expect(b.quadrant).toBe("NE");
  });
  it("90° = E (NE quadrant theta 90)", () => {
    const b = azimuthToBearing(90);
    expect(b.quadrant).toBe("NE");
    expect(b.degrees).toBe(90);
  });
  it("135° = SE quadrant", () => {
    const b = azimuthToBearing(135);
    expect(b.quadrant).toBe("SE");
  });
  it("225° = SW quadrant", () => {
    const b = azimuthToBearing(225);
    expect(b.quadrant).toBe("SW");
  });
  it("315° = NW quadrant", () => {
    const b = azimuthToBearing(315);
    expect(b.quadrant).toBe("NW");
  });
  it("round-trips through bearingFromAzimuth", () => {
    for (const az of [0, 30, 90, 135, 180, 225, 270, 315]) {
      const b = bearingFromAzimuth(az);
      expect(b.azimuthDeg).toBeCloseTo(az, 4);
    }
  });
});
