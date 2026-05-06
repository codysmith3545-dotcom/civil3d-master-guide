/**
 * Solar observation (sun-shot) azimuth calculator.
 *
 * Given a date/time (UTC), observer latitude/longitude, and a measured
 * horizontal angle from the sun to a mark, computes the true azimuth of
 * the mark.
 *
 * Uses the Spencer (1971) equations for solar declination and the equation
 * of time, which are simplified sinusoidal approximations based on
 * day-of-year. Accuracy is typically within +/- 0.01° for declination and
 * +/- 30 seconds for the equation of time.
 *
 * IMPORTANT: This is an approximation suitable for checking field work.
 * For precise geodetic azimuths use the NGS/NOAA Solar Position Calculator
 * or the Astronomical Almanac directly.
 *
 * Reference: Spencer, J.W. (1971) "Fourier series representation of the
 * position of the sun." Search 2(5):172; Wolf & Ghilani, *Elementary
 * Surveying*, Ch. 9 (Astronomic observations).
 */

export interface SolarObservationInput {
  /** ISO date string, e.g. "2024-06-15". */
  date_iso: string;
  /** UTC time as HH:MM:SS string. */
  time_utc: string;
  /** Observer latitude in decimal degrees (positive north). */
  lat_deg: number;
  /** Observer longitude in decimal degrees (negative west). */
  lon_deg: number;
  /** Measured horizontal angle from the sun to the mark, in decimal degrees. */
  measured_hz_angle_deg: number;
}

export interface SolarObservationResult {
  sun_azimuth_deg: number;
  mark_azimuth_deg: number;
  solar_declination_deg: number;
  equation_of_time_min: number;
  gha_deg: number;
  lha_deg: number;
  source: string;
  notes: string[];
}

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

function r6(x: number): number {
  return Math.round(x * 1e6) / 1e6;
}

/** Day of year (1-based). */
function dayOfYear(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00Z");
  const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.floor((d.getTime() - start.getTime()) / 86400000) + 1;
}

/** Parse "HH:MM:SS" to fractional hours. */
function parseTimeToHours(timeStr: string): number {
  const parts = timeStr.split(":");
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const s = parts[2] ? parseFloat(parts[2]) : 0;
  return h + m / 60 + s / 3600;
}

/**
 * Spencer (1971) solar declination and equation of time.
 * gamma = day angle in radians = 2*pi*(doy-1)/365
 */
function spencerSolar(doy: number): { declination_rad: number; eot_minutes: number } {
  const gamma = (2 * Math.PI * (doy - 1)) / 365;

  // Declination (radians) - Spencer 1971
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  // Equation of time (minutes) - Spencer 1971
  const eot =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.04089 * Math.sin(2 * gamma));

  return { declination_rad: decl, eot_minutes: eot };
}

export function solarObservation(
  input: SolarObservationInput,
): SolarObservationResult {
  const notes: string[] = [];

  notes.push(
    "APPROXIMATION ONLY: Uses Spencer (1971) simplified equations. " +
      "For precise geodetic work, use the NGS/NOAA Solar Position Calculator or Astronomical Almanac.",
  );

  const doy = dayOfYear(input.date_iso);
  const utcHours = parseTimeToHours(input.time_utc);

  const { declination_rad, eot_minutes } = spencerSolar(doy);
  const declDeg = declination_rad * RAD;

  // Greenwich Hour Angle of the sun:
  // GHA = 15 * (UTC_hours - 12) + EoT_in_degrees
  // EoT_in_degrees = EoT_minutes / 4  (since 1° = 4 min of time)
  // Actually, more precisely: GHA = (UTC_hours - 12) * 15 + EoT * 15/60
  const eotDeg = eot_minutes / 4; // equation of time in degrees
  let gha = (utcHours - 12) * 15 + eotDeg;

  // Normalize GHA to [0, 360)
  gha = ((gha % 360) + 360) % 360;

  // Local Hour Angle: LHA = GHA + longitude (west negative convention)
  let lha = gha + input.lon_deg;
  lha = ((lha % 360) + 360) % 360;

  // Solar azimuth from the astronomic triangle:
  // cos(Z) = (sin(dec) - sin(lat)*cos(LHA_zenith)) / (cos(lat)*sin(zenith_dist))
  // But more commonly via:
  // tan(Az) = -sin(LHA) / (cos(lat)*tan(dec) - sin(lat)*cos(LHA))
  //
  // Using the four-quadrant formula:
  const latRad = input.lat_deg * DEG;
  const lhaRad = lha * DEG;
  const decRad = declination_rad;

  const sinLHA = Math.sin(lhaRad);
  const cosLHA = Math.cos(lhaRad);
  const sinLat = Math.sin(latRad);
  const cosLat = Math.cos(latRad);
  const tanDec = Math.tan(decRad);

  // Azimuth measured from north, clockwise
  let sunAz = Math.atan2(-sinLHA, cosLat * tanDec - sinLat * cosLHA) * RAD;
  // Normalize to [0, 360)
  sunAz = ((sunAz % 360) + 360) % 360;

  // Check if sun is below horizon
  const sinAlt =
    sinLat * Math.sin(decRad) + cosLat * Math.cos(decRad) * cosLHA;
  if (sinAlt < 0) {
    notes.push(
      "The sun is below the horizon at the given date/time/location. " +
        "Results may not be meaningful.",
    );
  } else if (sinAlt > Math.sin(85 * DEG)) {
    notes.push(
      "The sun altitude exceeds 85°. Solar observations near the zenith are unreliable.",
    );
  }

  // Mark azimuth = sun azimuth - measured horizontal angle (or + depending on convention)
  // Convention: if the horizontal angle is measured clockwise from the sun to the mark
  let markAz = sunAz - input.measured_hz_angle_deg;
  markAz = ((markAz % 360) + 360) % 360;

  notes.push(
    "Mark azimuth assumes the horizontal angle was measured clockwise from the sun to the mark. " +
      "If your field procedure differs, adjust accordingly.",
  );

  return {
    sun_azimuth_deg: r6(sunAz),
    mark_azimuth_deg: r6(markAz),
    solar_declination_deg: r6(declDeg),
    equation_of_time_min: r6(eot_minutes),
    gha_deg: r6(gha),
    lha_deg: r6(lha),
    source:
      "Solar azimuth via Spencer (1971) declination & EoT. " +
      "Reference: Spencer, Search 2(5):172 (1971); Wolf & Ghilani, Elementary Surveying, Ch. 9.",
    notes,
  };
}
