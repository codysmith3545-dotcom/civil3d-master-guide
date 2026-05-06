/**
 * Combined Scale Factor (CSF) approximation for Indiana State Plane
 * Coordinates, NAD83.
 *
 * Indiana has two SPC zones (East 1301 and West 1302), both Transverse
 * Mercator. This is an *approximation* suitable for design-stage estimates;
 * always confirm with NGS NCAT or VDatum for control-grade work.
 *
 *   CSF = grid_scale_factor * elevation_factor
 *   elevation_factor = R / (R + h)
 *   grid_scale_factor ≈ k0 * (1 + (Δλ * cos φ)^2 / 2)
 *
 * Indiana East 1301: k0 = 0.999966667, central meridian = -85.6667 deg
 * Indiana West 1302: k0 = 0.999966667, central meridian = -87.0833 deg
 * Boundary between zones is approximately longitude -86.25 deg.
 * Earth radius: R = 20,906,000 ft (mean radius near Indiana, NAD83).
 *
 * Reference: NGS State Plane Coordinate System definition; Stem, J.E.,
 * "State Plane Coordinate System of 1983," NOAA Manual NOS NGS 5.
 */

export type StatePlaneIndianaInput = {
  /** Latitude, decimal degrees (positive north). */
  lat_deg: number;
  /** Longitude, decimal degrees (negative west). */
  lon_deg: number;
  /** Elevation above mean sea level, ft. */
  elev_ft: number;
};

export type StatePlaneIndianaOutput = {
  zone: "Indiana East (1301)" | "Indiana West (1302)";
  /** Grid scale factor at the point (dimensionless). */
  grid_scale: number;
  /** Elevation factor (dimensionless). */
  elevation_factor: number;
  /** Combined scale factor (grid * elevation). */
  csf: number;
  notes: string[];
};

const R_FT = 20_906_000;
const K0 = 0.999966667;
const CM_EAST = -85.6667;
const CM_WEST = -87.0833;
const ZONE_BOUNDARY_LON = -86.25;

export function compute(input: StatePlaneIndianaInput): StatePlaneIndianaOutput {
  const notes: string[] = [];

  if (input.lat_deg < 37.5 || input.lat_deg > 42.0) {
    notes.push(
      "Latitude is outside the expected range for Indiana (approx 37.8-41.8 N). Results may be unreliable.",
    );
  }
  if (input.lon_deg > -84.5 || input.lon_deg < -88.5) {
    notes.push(
      "Longitude is outside the expected range for Indiana (approx -88.1 to -84.8 W). Results may be unreliable.",
    );
  }

  const isEast = input.lon_deg >= ZONE_BOUNDARY_LON;
  const cm = isEast ? CM_EAST : CM_WEST;
  const dLam = (input.lon_deg - cm) * (Math.PI / 180);
  const phi = input.lat_deg * (Math.PI / 180);
  const dq = dLam * Math.cos(phi);

  const gridScale = K0 * (1 + (dq * dq) / 2);
  const elevationFactor = R_FT / (R_FT + input.elev_ft);
  const csf = gridScale * elevationFactor;

  notes.push(
    "Approximation only. For control-grade values use NGS NCAT or VDatum.",
    "Treats orthometric height as ellipsoid height; geoid separation in Indiana (~-33 to -36 m) is not corrected.",
    `Earth radius used: R = ${R_FT.toLocaleString()} ft.`,
  );

  return {
    zone: isEast ? "Indiana East (1301)" : "Indiana West (1302)",
    grid_scale: roundTo(gridScale, 9),
    elevation_factor: roundTo(elevationFactor, 9),
    csf: roundTo(csf, 9),
    notes,
  };
}

function roundTo(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}
