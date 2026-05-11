/**
 * Calculator registry for the public REST API.
 *
 * Each entry advertises an MCP-style name (snake_case), a kebab-case slug
 * matching `/tools/<name>` on the web app, a JSON Schema for the input, and
 * an `invoke` function that runs the corresponding pure-function calculator
 * from web/lib/calculators/.
 *
 * Input shapes are normalized to match the MCP server's schemas
 * (mcp-server/src/schemas.ts) so external integrators can use the same
 * payloads against either surface; we transform them into the
 * web-calculator signatures internally.
 */

import * as verticalCurve from "../calculators/vertical-curve";
import * as horizontalCurve from "../calculators/horizontal-curve";
import * as rationalMethod from "../calculators/rational-method";
import * as mannings from "../calculators/mannings";
import * as statePlane from "../calculators/state-plane-indiana";
import * as traverseClosure from "../calculators/traverse-closure";
import * as metesAndBounds from "../calculators/metes-and-bounds";
import * as inverse from "../calculators/inverse";
import * as bb from "../calculators/bearing-bearing-intersection";
import * as bd from "../calculators/bearing-distance-intersection";
import * as dd from "../calculators/distance-distance-intersection";
import * as levelLoop from "../calculators/level-loop";
import * as areaByCoords from "../calculators/area-by-coordinates";
import * as curveStakeout from "../calculators/curve-stakeout";
import * as trigLeveling from "../calculators/trig-leveling";
import * as solarObservation from "../calculators/solar-observation";
import * as gridToGround from "../calculators/grid-to-ground";

export type JsonSchema = Record<string, unknown>;

export type CalculatorEntry = {
  name: string;
  slug: string;
  title: string;
  description: string;
  inputSchema: JsonSchema;
  invoke: (input: unknown) => unknown;
};

// --- helpers --------------------------------------------------------------

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function num(v: unknown, label: string): number {
  if (typeof v !== "number" || !Number.isFinite(v)) {
    throw new ValidationError(`${label} must be a finite number`);
  }
  return v;
}

function pos(v: unknown, label: string): number {
  const n = num(v, label);
  if (n <= 0) throw new ValidationError(`${label} must be > 0`);
  return n;
}

function str(v: unknown, label: string): string {
  if (typeof v !== "string" || v.length === 0) {
    throw new ValidationError(`${label} must be a non-empty string`);
  }
  return v;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// --- registry -------------------------------------------------------------

const calcs: CalculatorEntry[] = [
  {
    name: "vertical_curve",
    slug: "vertical-curve",
    title: "Vertical curve (AASHTO)",
    description: "Required K and length for crest or sag vertical curves.",
    inputSchema: {
      type: "object",
      required: ["g1", "g2", "design_speed_mph", "type"],
      properties: {
        g1: { type: "number", description: "Approach grade in percent." },
        g2: { type: "number", description: "Departure grade in percent." },
        design_speed_mph: { type: "number", minimum: 15, maximum: 85 },
        type: { type: "string", enum: ["sag", "crest"] },
        criterion: { type: "string", enum: ["ssd", "psd", "comfort"], default: "ssd" },
        proposed_length_ft: { type: "number" },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      const purposeRaw = (input["criterion"] ?? "ssd") as string;
      const purpose = purposeRaw === "psd" ? "PSD" : "SSD";
      return verticalCurve.compute({
        G1: num(input["g1"], "g1"),
        G2: num(input["g2"], "g2"),
        designSpeedMph: num(input["design_speed_mph"], "design_speed_mph"),
        curveType: str(input["type"], "type") as "sag" | "crest",
        purpose,
        proposedLengthFt:
          input["proposed_length_ft"] === undefined
            ? undefined
            : num(input["proposed_length_ft"], "proposed_length_ft"),
      });
    },
  },
  {
    name: "horizontal_curve",
    slug: "horizontal-curve",
    title: "Horizontal curve",
    description: "T, L, M, E, LC and PC/PT stationing from R, delta, and PI station.",
    inputSchema: {
      type: "object",
      required: ["r_ft", "delta_deg", "pi_station_ft"],
      properties: {
        r_ft: { type: "number", exclusiveMinimum: 0 },
        delta_deg: { type: "number", exclusiveMinimum: 0, exclusiveMaximum: 180 },
        pi_station_ft: { type: "number" },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      return horizontalCurve.compute({
        R: pos(input["r_ft"], "r_ft"),
        deltaDeg: pos(input["delta_deg"], "delta_deg"),
        piStationFt: num(input["pi_station_ft"], "pi_station_ft"),
      });
    },
  },
  {
    name: "rational_method",
    slug: "rational-method",
    title: "Rational method (Q = CiA)",
    description: "Peak discharge from runoff coefficient, intensity, and area.",
    inputSchema: {
      type: "object",
      required: ["c", "i_in_hr", "a_acres"],
      properties: {
        c: { type: "number", minimum: 0, maximum: 1 },
        i_in_hr: { type: "number", exclusiveMinimum: 0 },
        a_acres: { type: "number", exclusiveMinimum: 0 },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      return rationalMethod.compute({
        C: num(input["c"], "c"),
        intensityInPerHr: pos(input["i_in_hr"], "i_in_hr"),
        areaAcres: pos(input["a_acres"], "a_acres"),
      });
    },
  },
  {
    name: "mannings_open_channel",
    slug: "mannings",
    title: "Manning's equation",
    description: "Open-channel flow velocity and discharge.",
    inputSchema: {
      type: "object",
      required: ["n", "area_sqft", "hyd_radius_ft", "slope_ft_ft"],
      properties: {
        n: { type: "number", exclusiveMinimum: 0 },
        area_sqft: { type: "number", exclusiveMinimum: 0 },
        hyd_radius_ft: { type: "number", exclusiveMinimum: 0 },
        slope_ft_ft: { type: "number", exclusiveMinimum: 0 },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      return mannings.compute({
        n: pos(input["n"], "n"),
        area_sqft: pos(input["area_sqft"], "area_sqft"),
        hyd_radius_ft: pos(input["hyd_radius_ft"], "hyd_radius_ft"),
        slope_ft_ft: pos(input["slope_ft_ft"], "slope_ft_ft"),
      });
    },
  },
  {
    name: "state_plane_indiana_csf",
    slug: "state-plane-indiana",
    title: "Indiana State Plane CSF",
    description: "Combined Scale Factor for Indiana State Plane (NAD83/2011).",
    inputSchema: {
      type: "object",
      required: ["lat", "lon", "elev_ft"],
      properties: {
        lat: { type: "number", minimum: 37, maximum: 42 },
        lon: { type: "number", minimum: -89, maximum: -84 },
        elev_ft: { type: "number" },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      return statePlane.compute({
        lat_deg: num(input["lat"], "lat"),
        lon_deg: num(input["lon"], "lon"),
        elev_ft: num(input["elev_ft"], "elev_ft"),
      });
    },
  },
  {
    name: "traverse_closure",
    slug: "traverse-closure",
    title: "Traverse closure (Bowditch)",
    description: "Compass-rule adjustment of a closed traverse.",
    inputSchema: {
      type: "object",
      required: ["legs"],
      properties: {
        legs: {
          type: "array",
          minItems: 2,
          items: {
            type: "object",
            required: ["bearing_deg", "distance_ft"],
            properties: {
              bearing_deg: { type: "number", minimum: 0, maximum: 360 },
              distance_ft: { type: "number", exclusiveMinimum: 0 },
            },
            additionalProperties: false,
          },
        },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      const legsRaw = input["legs"];
      if (!Array.isArray(legsRaw) || legsRaw.length < 2) {
        throw new ValidationError("legs must be an array of length >= 2");
      }
      const legs = legsRaw.map((l, i) => {
        if (!isObj(l)) throw new ValidationError(`legs[${i}] must be an object`);
        return {
          bearing_deg: num(l["bearing_deg"], `legs[${i}].bearing_deg`),
          distance_ft: pos(l["distance_ft"], `legs[${i}].distance_ft`),
        };
      });
      return traverseClosure.compute({ legs });
    },
  },
  {
    name: "metes_and_bounds",
    slug: "metes-and-bounds",
    title: "Metes-and-bounds writer",
    description: "Polygon coordinates to a metes-and-bounds description.",
    inputSchema: {
      type: "object",
      required: ["coordinates"],
      properties: {
        coordinates: {
          type: "array",
          minItems: 3,
          items: {
            type: "object",
            required: ["northing", "easting"],
            properties: {
              northing: { type: "number" },
              easting: { type: "number" },
            },
            additionalProperties: false,
          },
        },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      const coordsRaw = input["coordinates"];
      if (!Array.isArray(coordsRaw) || coordsRaw.length < 3) {
        throw new ValidationError("coordinates must be an array of length >= 3");
      }
      const coordinates = coordsRaw.map((c, i) => {
        if (!isObj(c)) throw new ValidationError(`coordinates[${i}] must be an object`);
        return {
          northing: num(c["northing"], `coordinates[${i}].northing`),
          easting: num(c["easting"], `coordinates[${i}].easting`),
        };
      });
      return metesAndBounds.compute({ coordinates });
    },
  },
  {
    name: "inverse",
    slug: "inverse",
    title: "Inverse",
    description: "Azimuth, quadrant bearing, and distance between two coordinate pairs.",
    inputSchema: {
      type: "object",
      required: ["n1", "e1", "n2", "e2"],
      properties: {
        n1: { type: "number" },
        e1: { type: "number" },
        n2: { type: "number" },
        e2: { type: "number" },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      return inverse.compute({
        n1: num(input["n1"], "n1"),
        e1: num(input["e1"], "e1"),
        n2: num(input["n2"], "n2"),
        e2: num(input["e2"], "e2"),
      });
    },
  },
  {
    name: "bearing_bearing_intersection",
    slug: "bearing-bearing-intersection",
    title: "Bearing-bearing intersection",
    description: "Intersection of two lines defined by points + azimuths.",
    inputSchema: {
      type: "object",
      required: ["n1", "e1", "bearing1_deg", "n2", "e2", "bearing2_deg"],
      properties: {
        n1: { type: "number" },
        e1: { type: "number" },
        bearing1_deg: { type: "number", minimum: 0, maximum: 360 },
        n2: { type: "number" },
        e2: { type: "number" },
        bearing2_deg: { type: "number", minimum: 0, maximum: 360 },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      return bb.compute({
        n1: num(input["n1"], "n1"),
        e1: num(input["e1"], "e1"),
        bearing1_deg: num(input["bearing1_deg"], "bearing1_deg"),
        n2: num(input["n2"], "n2"),
        e2: num(input["e2"], "e2"),
        bearing2_deg: num(input["bearing2_deg"], "bearing2_deg"),
      });
    },
  },
  {
    name: "bearing_distance_intersection",
    slug: "bearing-distance-intersection",
    title: "Bearing-distance intersection",
    description: "Intersection of a line and a circle (0, 1, or 2 solutions).",
    inputSchema: {
      type: "object",
      required: ["n1", "e1", "bearing_deg", "n2", "e2", "distance_ft"],
      properties: {
        n1: { type: "number" },
        e1: { type: "number" },
        bearing_deg: { type: "number", minimum: 0, maximum: 360 },
        n2: { type: "number" },
        e2: { type: "number" },
        distance_ft: { type: "number", exclusiveMinimum: 0 },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      return bd.compute({
        n1: num(input["n1"], "n1"),
        e1: num(input["e1"], "e1"),
        bearing_deg: num(input["bearing_deg"], "bearing_deg"),
        n2: num(input["n2"], "n2"),
        e2: num(input["e2"], "e2"),
        distance_ft: pos(input["distance_ft"], "distance_ft"),
      });
    },
  },
  {
    name: "distance_distance_intersection",
    slug: "distance-distance-intersection",
    title: "Distance-distance intersection",
    description: "Intersection of two circles.",
    inputSchema: {
      type: "object",
      required: ["n1", "e1", "d1_ft", "n2", "e2", "d2_ft"],
      properties: {
        n1: { type: "number" },
        e1: { type: "number" },
        d1_ft: { type: "number", exclusiveMinimum: 0 },
        n2: { type: "number" },
        e2: { type: "number" },
        d2_ft: { type: "number", exclusiveMinimum: 0 },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      return dd.compute({
        n1: num(input["n1"], "n1"),
        e1: num(input["e1"], "e1"),
        d1_ft: pos(input["d1_ft"], "d1_ft"),
        n2: num(input["n2"], "n2"),
        e2: num(input["e2"], "e2"),
        d2_ft: pos(input["d2_ft"], "d2_ft"),
      });
    },
  },
  {
    name: "level_loop_adjustment",
    slug: "level-loop",
    title: "Level-loop adjustment",
    description: "Adjusted elevations from a network of differential-level observations.",
    inputSchema: {
      type: "object",
      required: ["benchmarks", "observations"],
      properties: {
        benchmarks: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            required: ["name"],
            properties: {
              name: { type: "string" },
              known_elevation_ft: { type: "number" },
            },
            additionalProperties: false,
          },
        },
        observations: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            required: ["from", "to", "delta_h_ft"],
            properties: {
              from: { type: "string" },
              to: { type: "string" },
              delta_h_ft: { type: "number" },
              distance_ft: { type: "number", exclusiveMinimum: 0 },
            },
            additionalProperties: false,
          },
        },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      const bmRaw = input["benchmarks"];
      const obsRaw = input["observations"];
      if (!Array.isArray(bmRaw) || bmRaw.length < 1) {
        throw new ValidationError("benchmarks must be an array of length >= 1");
      }
      if (!Array.isArray(obsRaw) || obsRaw.length < 1) {
        throw new ValidationError("observations must be an array of length >= 1");
      }
      const benchmarks = bmRaw.map((b, i) => {
        if (!isObj(b)) throw new ValidationError(`benchmarks[${i}] must be an object`);
        return {
          name: str(b["name"], `benchmarks[${i}].name`),
          elevation:
            b["known_elevation_ft"] === undefined
              ? undefined
              : num(b["known_elevation_ft"], `benchmarks[${i}].known_elevation_ft`),
        };
      });
      const observations = obsRaw.map((o, i) => {
        if (!isObj(o)) throw new ValidationError(`observations[${i}] must be an object`);
        return {
          from: str(o["from"], `observations[${i}].from`),
          to: str(o["to"], `observations[${i}].to`),
          delta_h: num(o["delta_h_ft"], `observations[${i}].delta_h_ft`),
          distance:
            o["distance_ft"] === undefined
              ? undefined
              : pos(o["distance_ft"], `observations[${i}].distance_ft`),
        };
      });
      return levelLoop.compute({ benchmarks, observations });
    },
  },
  {
    name: "area_by_coordinates",
    slug: "area-by-coordinates",
    title: "Area by coordinates",
    description: "Polygon area via the surveyor's formula.",
    inputSchema: {
      type: "object",
      required: ["coordinates"],
      properties: {
        coordinates: {
          type: "array",
          minItems: 3,
          items: {
            type: "object",
            required: ["northing", "easting"],
            properties: {
              northing: { type: "number" },
              easting: { type: "number" },
            },
            additionalProperties: false,
          },
        },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      const coordsRaw = input["coordinates"];
      if (!Array.isArray(coordsRaw) || coordsRaw.length < 3) {
        throw new ValidationError("coordinates must be an array of length >= 3");
      }
      const coordinates = coordsRaw.map((c, i) => {
        if (!isObj(c)) throw new ValidationError(`coordinates[${i}] must be an object`);
        return {
          northing: num(c["northing"], `coordinates[${i}].northing`),
          easting: num(c["easting"], `coordinates[${i}].easting`),
        };
      });
      return areaByCoords.compute({ coordinates });
    },
  },
  {
    name: "curve_stakeout",
    slug: "curve-stakeout",
    title: "Curve stakeout",
    description: "Deflection/chord-offset table for staking a circular curve.",
    inputSchema: {
      type: "object",
      required: ["radius_ft", "delta_deg", "pc_station_ft"],
      properties: {
        radius_ft: { type: "number", exclusiveMinimum: 0 },
        delta_deg: { type: "number", exclusiveMinimum: 0, exclusiveMaximum: 360 },
        pc_station_ft: { type: "number" },
        stake_interval_ft: { type: "number", exclusiveMinimum: 0, default: 25 },
        method: { type: "string", enum: ["deflection", "chord_offset"], default: "deflection" },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      return curveStakeout.compute({
        radius_ft: pos(input["radius_ft"], "radius_ft"),
        delta_deg: pos(input["delta_deg"], "delta_deg"),
        pc_station_ft: num(input["pc_station_ft"], "pc_station_ft"),
        interval_ft:
          input["stake_interval_ft"] === undefined
            ? 25
            : pos(input["stake_interval_ft"], "stake_interval_ft"),
      });
    },
  },
  {
    name: "trig_leveling",
    slug: "trig-leveling",
    title: "Trigonometric leveling",
    description: "Remote elevation from slope distance and zenith angle.",
    inputSchema: {
      type: "object",
      required: [
        "slope_distance_ft",
        "zenith_angle_deg",
        "instrument_height_ft",
        "target_height_ft",
        "known_elevation_ft",
      ],
      properties: {
        slope_distance_ft: { type: "number", exclusiveMinimum: 0 },
        zenith_angle_deg: { type: "number", minimum: 0, maximum: 180 },
        instrument_height_ft: { type: "number" },
        target_height_ft: { type: "number" },
        known_elevation_ft: { type: "number" },
        apply_curvature_refraction: { type: "boolean", default: false },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      return trigLeveling.compute({
        slope_dist_ft: pos(input["slope_distance_ft"], "slope_distance_ft"),
        zenith_deg: num(input["zenith_angle_deg"], "zenith_angle_deg"),
        hi_ft: num(input["instrument_height_ft"], "instrument_height_ft"),
        ht_ft: num(input["target_height_ft"], "target_height_ft"),
        known_elev_ft: num(input["known_elevation_ft"], "known_elevation_ft"),
      });
    },
  },
  {
    name: "solar_observation",
    slug: "solar-observation",
    title: "Solar observation",
    description: "Astronomic azimuth from a sun observation.",
    inputSchema: {
      type: "object",
      required: ["date_iso", "time_utc", "lat_deg", "lon_deg", "measured_hz_angle_deg"],
      properties: {
        date_iso: { type: "string" },
        time_utc: { type: "string" },
        lat_deg: { type: "number", minimum: -90, maximum: 90 },
        lon_deg: { type: "number", minimum: -180, maximum: 180 },
        measured_hz_angle_deg: { type: "number" },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      return solarObservation.compute({
        date_iso: str(input["date_iso"], "date_iso"),
        time_utc: str(input["time_utc"], "time_utc"),
        lat_deg: num(input["lat_deg"], "lat_deg"),
        lon_deg: num(input["lon_deg"], "lon_deg"),
        hz_angle_deg: num(input["measured_hz_angle_deg"], "measured_hz_angle_deg"),
      });
    },
  },
  {
    name: "grid_to_ground",
    slug: "grid-to-ground",
    title: "Grid-to-ground / ground-to-grid",
    description: "Convert between grid and ground using a Combined Scale Factor.",
    inputSchema: {
      type: "object",
      required: ["mode", "csf", "distance_ft"],
      properties: {
        mode: { type: "string", enum: ["grid_to_ground", "ground_to_grid"] },
        csf: { type: "number", exclusiveMinimum: 0 },
        distance_ft: { type: "number" },
      },
      additionalProperties: false,
    },
    invoke: (input) => {
      if (!isObj(input)) throw new ValidationError("input must be an object");
      const modeRaw = str(input["mode"], "mode");
      const mode = modeRaw === "ground_to_grid" ? "ground-to-grid" : "grid-to-ground";
      if (input["distance_ft"] === undefined) {
        throw new ValidationError("distance_ft is required");
      }
      return gridToGround.compute({
        mode,
        csf: pos(input["csf"], "csf"),
        distance_ft: num(input["distance_ft"], "distance_ft"),
      });
    },
  },
];

const byName = new Map(calcs.map((c) => [c.name, c] as const));
const bySlug = new Map(calcs.map((c) => [c.slug, c] as const));

export function listCalculators(): CalculatorEntry[] {
  return calcs;
}

export function findCalculator(nameOrSlug: string): CalculatorEntry | null {
  return byName.get(nameOrSlug) ?? bySlug.get(nameOrSlug) ?? null;
}
