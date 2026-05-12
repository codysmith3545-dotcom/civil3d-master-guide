import { describe, expect, it } from "vitest";
import { parseCurveCall } from "../src/curve.js";

describe("parseCurveCall - typical forms", () => {
  it("parses full curve call with all elements", () => {
    const text =
      'along a curve to the right having a radius of 250.00 feet, an arc length of 75.00 feet, and a chord bearing N 30°15\'00" E, 74.50 feet';
    const c = parseCurveCall(text);
    expect(c).not.toBeNull();
    expect(c!.type).toBe("curve");
    expect(c!.direction).toBe("right");
    expect(c!.radiusFt).toBeCloseTo(250.0, 6);
    expect(c!.arcLengthFt).toBeCloseTo(75.0, 6);
    expect(c!.chordFt).toBeCloseTo(74.5, 6);
    expect(c!.chordBearing).toBeDefined();
    expect(c!.chordBearing!.quadrant).toBe("NE");
    expect(c!.chordBearing!.degrees).toBe(30);
    expect(c!.chordBearing!.minutes).toBe(15);
  });

  it("parses curve to the left", () => {
    const text =
      'along a curve to the left having a radius of 100.00 feet, an arc length of 50.00 feet';
    const c = parseCurveCall(text);
    expect(c).not.toBeNull();
    expect(c!.direction).toBe("left");
    expect(c!.radiusFt).toBe(100);
    expect(c!.arcLengthFt).toBe(50);
  });

  it("parses radius and delta without chord", () => {
    const text =
      'curving to the right with a radius of 500.00 feet and a delta of 17°10\'00"';
    const c = parseCurveCall(text);
    expect(c).not.toBeNull();
    expect(c!.radiusFt).toBe(500);
    expect(c!.deltaDeg).toBeCloseTo(17 + 10 / 60, 6);
  });

  it("returns null when radius missing", () => {
    const text = "along a curve to the right with a chord of 100 feet";
    const c = parseCurveCall(text);
    expect(c).toBeNull();
  });

  it("returns null when direction unstated and no inference", () => {
    const text =
      "along a curve, radius 250.00 feet, delta 17°10'00\", chord bearing S 30°15'00\" E, 74.50 feet";
    const c = parseCurveCall(text);
    expect(c).toBeNull();
  });

  it("returns null for plain line text (no curve markers)", () => {
    const c = parseCurveCall("N 45°00'00\" E, 100.00 feet");
    expect(c).toBeNull();
  });

  it("parses tangent length when stated", () => {
    const text =
      'along a curve to the right having a radius of 250.00 feet, a tangent of 38.00 feet, and an arc length of 75.00 feet';
    const c = parseCurveCall(text);
    expect(c).not.toBeNull();
    expect(c!.tangentFt).toBeCloseTo(38.0, 6);
  });

  it("preserves chord bearing in different quadrant", () => {
    const text =
      'along a curve to the right having a radius of 300.00 feet, an arc length of 50.00 feet, and a chord bearing S 75°00\'00" W, 49.50 feet';
    const c = parseCurveCall(text);
    expect(c).not.toBeNull();
    expect(c!.chordBearing!.quadrant).toBe("SW");
    expect(c!.chordBearing!.azimuthDeg).toBeCloseTo(180 + 75, 6);
  });

  it("captures raw text", () => {
    const text =
      'along a curve to the right having a radius of 250.00 feet, an arc length of 75.00 feet';
    const c = parseCurveCall(text);
    expect(c!.raw).toBe(text);
  });

  it("parses 'central angle' as delta synonym", () => {
    const text =
      "along a curve to the left, radius 100 feet, central angle of 45 degrees 30 minutes";
    const c = parseCurveCall(text);
    expect(c).not.toBeNull();
    expect(c!.deltaDeg).toBeCloseTo(45.5, 6);
  });
});
