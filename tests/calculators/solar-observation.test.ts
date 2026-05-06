import { describe, it, expect } from "vitest";
import { solarObservation } from "../../mcp-server/src/calculators/solar-observation.js";

describe("solarObservation", () => {
  // regression — not externally verified against NOAA. Spencer (1971)
  // approximation is documented to be within ~0.01° declination and ~30s EoT.
  it("June solstice (2024-06-20 17:00 UTC, Indianapolis): declination near +23.4° (regression)", () => {
    const r = solarObservation({
      date_iso: "2024-06-20",
      time_utc: "17:00:00",
      lat_deg: 39.7684,
      lon_deg: -86.1581,
      measured_hz_angle_deg: 0,
    });
    // Solar declination at June solstice peaks near +23.44°. Spencer
    // approximation should land within ~0.5° of that for a date within a day
    // of the actual solstice.
    expect(r.solar_declination_deg).toBeGreaterThan(23.0);
    expect(r.solar_declination_deg).toBeLessThan(24.0);
    expect(r.sun_azimuth_deg).toBeGreaterThanOrEqual(0);
    expect(r.sun_azimuth_deg).toBeLessThan(360);
    expect(r.gha_deg).toBeGreaterThanOrEqual(0);
    expect(r.gha_deg).toBeLessThan(360);
  });

  it("equinox-ish date (2024-09-22 12:00 UTC): declination near 0° (regression)", () => {
    const r = solarObservation({
      date_iso: "2024-09-22",
      time_utc: "12:00:00",
      lat_deg: 0,
      lon_deg: 0,
      measured_hz_angle_deg: 0,
    });
    // At autumnal equinox, declination is near zero.
    expect(Math.abs(r.solar_declination_deg)).toBeLessThan(2.0);
  });

  it("mark azimuth is sun azimuth minus measured horizontal angle (mod 360)", () => {
    const r = solarObservation({
      date_iso: "2024-06-20",
      time_utc: "17:00:00",
      lat_deg: 39.7684,
      lon_deg: -86.1581,
      measured_hz_angle_deg: 30,
    });
    let expectedMark = r.sun_azimuth_deg - 30;
    if (expectedMark < 0) expectedMark += 360;
    expect(r.mark_azimuth_deg).toBeCloseTo(expectedMark, 3);
  });

  it("throws on malformed date string (input validation)", () => {
    expect(() =>
      solarObservation({
        date_iso: "not-a-date",
        time_utc: "12:00:00",
        lat_deg: 0,
        lon_deg: 0,
        measured_hz_angle_deg: 0,
      }),
    ).toThrow();
  });
});
