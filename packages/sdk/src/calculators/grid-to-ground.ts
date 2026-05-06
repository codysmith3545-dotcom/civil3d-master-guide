/**
 * Grid-to-ground (and ground-to-grid) coordinate/distance converter.
 *
 * Applies a Combined Scale Factor (CSF) to convert between State Plane
 * (grid) distances/coordinates and ground distances/coordinates.
 *
 *   ground_distance = grid_distance / CSF
 *   grid_distance   = ground_distance * CSF
 *
 * For coordinates, the conversion scales relative to an origin point:
 *   ground_N = origin_N + (grid_N - origin_N) / CSF
 *   ground_E = origin_E + (grid_E - origin_E) / CSF
 *
 * The CSF is typically computed from the state-plane grid scale factor and
 * the elevation factor (see state-plane-indiana.ts for the Indiana case).
 * This calculator takes CSF as a given input.
 *
 * Reference: Wolf & Ghilani, *Elementary Surveying*, Ch. 20 (State Plane
 * Coordinates); NGS State Plane Coordinate System documentation.
 */

export interface GridToGroundInput {
  /** Conversion direction. */
  mode: "grid_to_ground" | "ground_to_grid";
  /** Combined Scale Factor (CSF). Typically close to 1.0. */
  csf: number;
  /** Distance to convert, in feet. */
  distance_ft?: number;
  /** Grid (or ground, depending on mode) northing to convert. */
  grid_northing?: number;
  /** Grid (or ground, depending on mode) easting to convert. */
  grid_easting?: number;
  /** Origin northing for coordinate scaling. */
  origin_northing?: number;
  /** Origin easting for coordinate scaling. */
  origin_easting?: number;
}

export interface GridToGroundResult {
  converted_distance_ft: number | null;
  converted_northing: number | null;
  converted_easting: number | null;
  csf_used: number;
  source: string;
  notes: string[];
}

function r6(x: number): number {
  return Math.round(x * 1e6) / 1e6;
}

export function gridToGround(input: GridToGroundInput): GridToGroundResult {
  const notes: string[] = [];
  const csf = input.csf;

  if (csf <= 0) {
    notes.push("CSF must be a positive number.");
    return {
      converted_distance_ft: null,
      converted_northing: null,
      converted_easting: null,
      csf_used: csf,
      source: "",
      notes,
    };
  }

  if (Math.abs(csf - 1.0) > 0.01) {
    notes.push(
      `CSF (${csf}) differs from 1.0 by more than 0.01. ` +
        "Verify this is correct for your project location and elevation.",
    );
  }

  let convertedDistance: number | null = null;
  let convertedNorthing: number | null = null;
  let convertedEasting: number | null = null;

  // Distance conversion
  if (input.distance_ft !== undefined) {
    if (input.mode === "grid_to_ground") {
      convertedDistance = r6(input.distance_ft / csf);
    } else {
      convertedDistance = r6(input.distance_ft * csf);
    }
  }

  // Coordinate conversion
  const hasCoords =
    input.grid_northing !== undefined || input.grid_easting !== undefined;

  if (hasCoords) {
    const originN = input.origin_northing ?? 0;
    const originE = input.origin_easting ?? 0;

    if (input.origin_northing === undefined || input.origin_easting === undefined) {
      notes.push(
        "No origin point specified for coordinate conversion. Using (0, 0) as origin, " +
          "which scales coordinates directly. Provide origin_northing and origin_easting " +
          "for a project-specific origin.",
      );
    }

    if (input.grid_northing !== undefined) {
      if (input.mode === "grid_to_ground") {
        convertedNorthing = r6(originN + (input.grid_northing - originN) / csf);
      } else {
        convertedNorthing = r6(originN + (input.grid_northing - originN) * csf);
      }
    }

    if (input.grid_easting !== undefined) {
      if (input.mode === "grid_to_ground") {
        convertedEasting = r6(originE + (input.grid_easting - originE) / csf);
      } else {
        convertedEasting = r6(originE + (input.grid_easting - originE) * csf);
      }
    }
  }

  if (convertedDistance === null && convertedNorthing === null && convertedEasting === null) {
    notes.push(
      "No distance or coordinates provided to convert. " +
        "Supply distance_ft and/or grid_northing/grid_easting.",
    );
  }

  return {
    converted_distance_ft: convertedDistance,
    converted_northing: convertedNorthing,
    converted_easting: convertedEasting,
    csf_used: csf,
    source:
      "Grid/ground conversion using Combined Scale Factor. " +
      "Reference: Wolf & Ghilani, Elementary Surveying, Ch. 20; NGS SPC documentation.",
    notes,
  };
}
