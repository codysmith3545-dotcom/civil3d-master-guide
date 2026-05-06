/**
 * Solar observation azimuth calculator.
 *
 * Pure functions; no DOM or React.
 *
 * Computes the sun's azimuth at a given date/time/location and derives the
 * azimuth to a survey mark from the horizontal angle between the sun and
 * the mark.
 *
 * The solar position algorithm used here is the simplified low-accuracy
 * method from the Astronomical Almanac (good to ~0.01 deg). It is suitable
 * for screening/field-check purposes, NOT for geodetic-grade observations.
 * For precise work, use the full NOAA Solar Position Calculator or the
 * algorithm from Meeus, "Astronomical Algorithms."
 *
 * Reference: U.S. Naval Observatory / Astronomical Almanac, simplified
 * solar position equations; Buckner, "A Manual of Solar Observations."
 */

export type SolarObservationInput = {
  /** Date as ISO string, e.g. "2024-06-15". */
  date_iso: string;
  /** UTC time as "HH:MM:SS" or "HH:MM". */
  time_utc: string;
  /** Observer latitude, decimal degrees (positive north). */
  lat_deg: number;
  /** Observer longitude, decimal degrees (negative west). */
  lon_deg: number;
  /** Horizontal angle from mark to sun, decimal degrees, measured clockwise. */
  hz_angle_deg: number;
};

export type SolarObservationOutput = {
  /** Computed azimuth of the sun, decimal degrees. */
  sun_azimuth_deg: number;
  /** Derived azimuth to the mark, decimal degrees. */
  mark_azimuth_deg: number;
  /** Solar declination, decimal degrees. */
  declination_deg: number;
  notes: string[];
};

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

export function compute(input: SolarObservationInput): SolarObservationOutput {
  const notes: string[] = [];

  // Parse date and time.
  const dateParts = input.date_iso.split("-").map(Number);
  const timeParts = input.time_utc.split(":").map(Number);
  if (dateParts.length < 3 || dateParts.some(isNaN)) {
    notes.push("Invalid date format. Use YYYY-MM-DD.");
    return { sun_azimuth_deg: 0, mark_azimuth_deg: 0, declination_deg: 0, notes };
  }
  if (timeParts.length < 2 || timeParts.some(isNaN)) {
    notes.push("Invalid time format. Use HH:MM or HH:MM:SS (UTC).");
    return { sun_azimuth_deg: 0, mark_azimuth_deg: 0, declination_deg: 0, notes };
  }

  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  const hour = timeParts[0] + (timeParts[1] || 0) / 60 + (timeParts[2] || 0) / 3600;

  // Julian date.
  const jd = julianDate(year, month, day, hour);
  const T = (jd - 2451545.0) / 36525.0; // Julian centuries from J2000.0

  // Solar coordinates (low-accuracy, Astronomical Almanac).
  // Mean longitude (deg).
  const L0 = mod360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  // Mean anomaly (deg).
  const M = mod360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = M * DEG;
  // Equation of center (deg).
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  // Sun's true longitude (deg).
  const sunLon = L0 + C;
  // Obliquity of ecliptic (deg).
  const eps = 23.439291 - 0.0130042 * T;

  // Declination.
  const sinDec = Math.sin(eps * DEG) * Math.sin(sunLon * DEG);
  const dec = Math.asin(sinDec) * RAD;

  // Right ascension.
  const ra =
    Math.atan2(
      Math.cos(eps * DEG) * Math.sin(sunLon * DEG),
      Math.cos(sunLon * DEG),
    ) * RAD;

  // Greenwich mean sidereal time (deg).
  const GMST = mod360(280.46061837 + 360.98564736629 * (jd - 2451545.0));

  // Local hour angle (deg).
  const LHA = mod360(GMST + input.lon_deg - ra);

  // Azimuth and altitude.
  const latRad = input.lat_deg * DEG;
  const decRad = dec * DEG;
  const lhaRad = LHA * DEG;

  const sinAlt =
    Math.sin(latRad) * Math.sin(decRad) +
    Math.cos(latRad) * Math.cos(decRad) * Math.cos(lhaRad);
  const alt = Math.asin(sinAlt) * RAD;

  let az =
    Math.atan2(
      -Math.cos(decRad) * Math.sin(lhaRad),
      Math.sin(decRad) * Math.cos(latRad) -
        Math.cos(decRad) * Math.sin(latRad) * Math.cos(lhaRad),
    ) * RAD;
  if (az < 0) az += 360;

  // Mark azimuth = sun azimuth - horizontal angle (mark to sun, clockwise).
  let markAz = az - input.hz_angle_deg;
  if (markAz < 0) markAz += 360;
  if (markAz >= 360) markAz -= 360;

  if (alt < 5) {
    notes.push(
      "Sun altitude is below 5 degrees; atmospheric refraction makes the observation unreliable.",
    );
  }

  notes.push(
    "This is a simplified solar position algorithm (Astronomical Almanac low-accuracy method). " +
      "Accuracy is approximately 0.01 degrees. For geodetic-grade azimuths, use the full NOAA " +
      "algorithm or Meeus equations and apply refraction corrections.",
  );

  return {
    sun_azimuth_deg: roundTo(az, 4),
    mark_azimuth_deg: roundTo(markAz, 4),
    declination_deg: roundTo(dec, 4),
    notes,
  };
}

function julianDate(y: number, m: number, d: number, utHours: number): number {
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    d +
    utHours / 24.0 +
    B -
    1524.5
  );
}

function mod360(x: number): number {
  return ((x % 360) + 360) % 360;
}

function roundTo(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}
