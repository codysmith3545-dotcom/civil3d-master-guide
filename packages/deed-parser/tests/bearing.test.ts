import { describe, expect, it } from "vitest";
import { parseBearing, azimuthFromQuadrant } from "../src/bearing.js";

describe("parseBearing - supported formats", () => {
  it('parses standard "N 45°30\'00" E"', () => {
    const b = parseBearing('N 45°30\'00" E');
    expect(b).not.toBeNull();
    expect(b!.quadrant).toBe("NE");
    expect(b!.degrees).toBe(45);
    expect(b!.minutes).toBe(30);
    expect(b!.seconds).toBe(0);
    expect(b!.azimuthDeg).toBeCloseTo(45.5, 6);
  });

  it('parses "N 45 deg 30 min 00 sec E"', () => {
    const b = parseBearing("N 45 deg 30 min 00 sec E");
    expect(b).not.toBeNull();
    expect(b!.quadrant).toBe("NE");
    expect(b!.degrees).toBe(45);
    expect(b!.minutes).toBe(30);
    expect(b!.seconds).toBe(0);
    expect(b!.azimuthDeg).toBeCloseTo(45.5, 6);
  });

  it("parses dash form N45-30-00E", () => {
    const b = parseBearing("N45-30-00E");
    expect(b).not.toBeNull();
    expect(b!.quadrant).toBe("NE");
    expect(b!.degrees).toBe(45);
    expect(b!.minutes).toBe(30);
    expect(b!.seconds).toBe(0);
  });

  it('parses no-space form N45°30\'00"E', () => {
    const b = parseBearing('N45°30\'00"E');
    expect(b).not.toBeNull();
    expect(b!.quadrant).toBe("NE");
  });

  it('parses "N 45° 30\' 00" East" (full word EW)', () => {
    const b = parseBearing('N 45° 30\' 00" East');
    expect(b).not.toBeNull();
    expect(b!.quadrant).toBe("NE");
    expect(b!.degrees).toBe(45);
  });

  it('parses "North 45 degrees 30 minutes 00 seconds East"', () => {
    const b = parseBearing("North 45 degrees 30 minutes 00 seconds East");
    expect(b).not.toBeNull();
    expect(b!.quadrant).toBe("NE");
    expect(b!.minutes).toBe(30);
  });

  it("returns null for spelled-out numbers", () => {
    const b = parseBearing(
      "N forty-five degrees thirty minutes east",
    );
    expect(b).toBeNull();
  });

  it('parses "due north" to azimuth 0', () => {
    const b = parseBearing("due north");
    expect(b).not.toBeNull();
    expect(b!.azimuthDeg).toBeCloseTo(0, 6);
  });

  it('parses "due east" to azimuth 90', () => {
    const b = parseBearing("due east");
    expect(b).not.toBeNull();
    expect(b!.azimuthDeg).toBeCloseTo(90, 6);
  });

  it('parses "due south" to azimuth 180', () => {
    const b = parseBearing("Due South");
    expect(b).not.toBeNull();
    expect(b!.azimuthDeg).toBeCloseTo(180, 6);
  });

  it('parses "due west" to azimuth 270', () => {
    const b = parseBearing("DUE WEST");
    expect(b).not.toBeNull();
    expect(b!.azimuthDeg).toBeCloseTo(270, 6);
  });

  it("defaults missing seconds to 0", () => {
    const b = parseBearing("N 45° 30' E");
    expect(b).not.toBeNull();
    expect(b!.seconds).toBe(0);
    expect(b!.minutes).toBe(30);
  });

  it("defaults missing minutes and seconds to 0", () => {
    const b = parseBearing("N 45° E");
    expect(b).not.toBeNull();
    expect(b!.minutes).toBe(0);
    expect(b!.seconds).toBe(0);
    expect(b!.azimuthDeg).toBeCloseTo(45, 6);
  });
});

describe("azimuthFromQuadrant - quadrant math", () => {
  it("NE 45° -> 45° azimuth", () => {
    expect(azimuthFromQuadrant("NE", 45, 0, 0)).toBeCloseTo(45, 9);
  });

  it("SE 45° -> 135° azimuth", () => {
    expect(azimuthFromQuadrant("SE", 45, 0, 0)).toBeCloseTo(135, 9);
  });

  it("SW 45° -> 225° azimuth", () => {
    expect(azimuthFromQuadrant("SW", 45, 0, 0)).toBeCloseTo(225, 9);
  });

  it("NW 45° -> 315° azimuth", () => {
    expect(azimuthFromQuadrant("NW", 45, 0, 0)).toBeCloseTo(315, 9);
  });

  it("NE 0° = 0", () => {
    expect(azimuthFromQuadrant("NE", 0, 0, 0)).toBe(0);
  });

  it("NE 90° = 90 (due east edge of NE quadrant)", () => {
    expect(azimuthFromQuadrant("NE", 90, 0, 0)).toBe(90);
  });

  it("includes minutes and seconds in azimuth", () => {
    // 45° 30' 30" -> 45.508333...
    const az = azimuthFromQuadrant("NE", 45, 30, 30);
    expect(az).toBeCloseTo(45 + 30 / 60 + 30 / 3600, 9);
  });

  it("SE 30° 15' -> 149.75 azimuth", () => {
    const az = azimuthFromQuadrant("SE", 30, 15, 0);
    expect(az).toBeCloseTo(180 - 30.25, 6);
  });

  it("NW 30° 15' -> 329.75 azimuth", () => {
    const az = azimuthFromQuadrant("NW", 30, 15, 0);
    expect(az).toBeCloseTo(360 - 30.25, 6);
  });
});

describe("parseBearing - smart quotes (normalized upstream)", () => {
  it("handles already-ASCII characters fine", () => {
    const b = parseBearing("N 12°34'56\" E");
    expect(b).not.toBeNull();
    expect(b!.degrees).toBe(12);
    expect(b!.minutes).toBe(34);
    expect(b!.seconds).toBe(56);
  });

  it("preserves raw input string", () => {
    const raw = "N 12°34'56\" E";
    const b = parseBearing(raw);
    expect(b!.raw).toBe(raw);
  });
});

describe("parseBearing - invalid", () => {
  it("returns null for empty string", () => {
    expect(parseBearing("")).toBeNull();
  });

  it("returns null for non-bearing text", () => {
    expect(parseBearing("the quick brown fox")).toBeNull();
  });

  it("returns null for invalid minutes (>=60)", () => {
    expect(parseBearing("N 45° 75' E")).toBeNull();
  });

  it("returns null for invalid seconds (>=60)", () => {
    expect(parseBearing("N 45° 30' 75\" E")).toBeNull();
  });
});
