/**
 * Combined Scale Factor (CSF) approximation for Indiana State Plane Coordinates,
 * NAD83. Indiana has two SPC zones (East 1301 and West 1302), both Transverse
 * Mercator. This is an *approximation* suitable for design-stage estimates;
 * always confirm with NGS NCAT or VDatum for control-grade work.
 *
 *   CSF = grid_scale_factor * elevation_factor
 *   elevation_factor = R / (R + h)            (h = ellipsoid height ≈ orthometric for IN)
 *   grid_scale_factor ≈ k0 + (Δλ * cos φ * π/180)^2 / 2
 *       where Δλ = (λ - λ0) and λ0 is the central meridian of the zone.
 *
 * Indiana East 1301: k0 = 0.999966667, central meridian λ0 = -85.6667°
 * Indiana West 1302: k0 = 0.999966667, central meridian λ0 = -87.0833°
 * Boundary between zones is approximately longitude -86.25°.
 *
 * Earth radius used: R = 20,906,000 ft (mean radius near Indiana, NAD83).
 */

export interface StatePlaneIndianaCsfInput {
  lat: number;
  lon: number;
  elev_ft: number;
}

export interface StatePlaneIndianaCsfResult {
  zone: "Indiana East (1301)" | "Indiana West (1302)";
  grid_scale: number;
  elevation_factor: number;
  csf: number;
  source: string;
  notes: string[];
}

const R_FT = 20_906_000;
const K0 = 0.999966667;
const CM_EAST = -85.6667;
const CM_WEST = -87.0833;
const ZONE_BOUNDARY_LON = -86.25;

const r6 = (x: number): number => Math.round(x * 1e9) / 1e9;

export function statePlaneIndianaCsf(input: StatePlaneIndianaCsfInput): StatePlaneIndianaCsfResult {
  const isEast = input.lon >= ZONE_BOUNDARY_LON;
  const cm = isEast ? CM_EAST : CM_WEST;
  const dLam = (input.lon - cm) * (Math.PI / 180);
  const phi = input.lat * (Math.PI / 180);
  const dq = dLam * Math.cos(phi);

  const k = K0 * (1 + (dq * dq) / 2);
  const elevFactor = R_FT / (R_FT + input.elev_ft);
  const csf = k * elevFactor;

  return {
    zone: isEast ? "Indiana East (1301)" : "Indiana West (1302)",
    grid_scale: r6(k),
    elevation_factor: r6(elevFactor),
    csf: r6(csf),
    source:
      "Approximation: TM grid scale k = k0·(1 + (Δλ·cos φ)²/2); elevation factor = R/(R+h). " +
      "NAD83 / Indiana SPC East 1301 (k0=0.999966667, CM=-85.6667°) and West 1302 (k0=0.999966667, CM=-87.0833°).",
    notes: [
      "Approximation only — for control-grade values use NGS NCAT or VDatum.",
      "Treats orthometric height as ellipsoid height; geoid separation in Indiana is roughly -33 to -36 m and not corrected here.",
      `Earth radius used: R = ${R_FT.toLocaleString()} ft.`,
    ],
  };
}
