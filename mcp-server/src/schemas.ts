import { z } from "zod";

export const GetPageInput = z.object({
  slug: z
    .string()
    .min(1)
    .describe(
      "Path to the markdown page relative to the content/ root, with or without leading/trailing slashes and with or without a .md extension. Examples: 'civil3d/commands/index', '/jurisdictions/indiana/marion-county/index.md', 'glossary'.",
    ),
});

export const SearchKbInput = z.object({
  query: z.string().min(1).describe("Free-text query. Tokenized on whitespace; tag matches are boosted."),
  limit: z
    .number()
    .int()
    .positive()
    .max(50)
    .optional()
    .describe("Max number of results to return. Default 10."),
});

export const ListCommandsInput = z.object({
  category: z
    .string()
    .optional()
    .describe(
      "Optional Civil 3D command category to filter by, matched case-insensitively against frontmatter `category` (e.g. 'survey', 'surfaces', 'alignments').",
    ),
});

export const ListJurisdictionsInput = z.object({
  state: z
    .string()
    .optional()
    .describe("Optional state slug to filter by (e.g. 'indiana'). Case-insensitive."),
});

export const GetResourceIndexInput = z.object({}).strict();

export const GetProjectContextInput = z.object({
  projectId: z
    .string()
    .min(1)
    .describe("Project id (uuid or slug) the AI client wants context for."),
  userId: z
    .string()
    .min(1)
    .describe(
      "User id of the requester. Used by the project store to enforce access control; opaque to the MCP server itself.",
    ),
  query: z
    .string()
    .optional()
    .describe(
      "Optional free-text query. When supplied, public KB chunks and project-document chunks are ranked against it. When omitted, KB retrieval is skipped.",
    ),
  kbK: z
    .number()
    .int()
    .positive()
    .max(20)
    .optional()
    .describe("Max number of public-KB chunks to return. Default 5."),
  projectK: z
    .number()
    .int()
    .positive()
    .max(20)
    .optional()
    .describe("Max number of project-document chunks to return. Default 5."),
  jurisdictionLookup: z
    .boolean()
    .optional()
    .describe(
      "Whether to derive a jurisdiction summary from the project's bounds (when set). Default true.",
    ),
});

// Calculator inputs
export const VerticalCurveInput = z.object({
  g1: z.number().describe("Incoming grade in percent (e.g. -2 for -2.0%)."),
  g2: z.number().describe("Outgoing grade in percent."),
  design_speed_mph: z
    .number()
    .min(15)
    .max(85)
    .describe("Design speed in miles per hour. AASHTO Green Book tables cover 15-80 mph."),
  type: z.enum(["sag", "crest"]).describe("Curve type: 'sag' (valley) or 'crest' (hill)."),
  criterion: z
    .enum(["ssd", "psd", "comfort"])
    .default("ssd")
    .describe(
      "Sight-distance criterion. 'ssd' = stopping sight distance (default). 'psd' = passing sight distance (crest only). 'comfort' = sag comfort criterion.",
    ),
});

export const HorizontalCurveInput = z.object({
  r_ft: z.number().positive().describe("Radius of the circular curve, in feet."),
  delta_deg: z
    .number()
    .gt(0)
    .lt(180)
    .describe("Deflection angle (delta) in decimal degrees."),
  pi_station_ft: z
    .number()
    .describe("Station of the Point of Intersection (PI), in feet (e.g. 12345.67)."),
});

export const RationalMethodInput = z.object({
  c: z.number().min(0).max(1).describe("Runoff coefficient C (dimensionless, 0-1)."),
  i_in_hr: z.number().positive().describe("Rainfall intensity i in inches per hour."),
  a_acres: z.number().positive().describe("Drainage area A in acres."),
});

export const ManningsOpenChannelInput = z.object({
  n: z.number().positive().describe("Manning's roughness coefficient n."),
  area_sqft: z.number().positive().describe("Cross-sectional flow area, square feet."),
  hyd_radius_ft: z.number().positive().describe("Hydraulic radius R = A / P, in feet."),
  slope_ft_ft: z.number().positive().describe("Energy/channel slope, ft per ft (e.g. 0.005)."),
});

export const StatePlaneIndianaCsfInput = z.object({
  lat: z
    .number()
    .min(37)
    .max(42)
    .describe("Latitude in decimal degrees (Indiana approximate range 37.7-41.8)."),
  lon: z
    .number()
    .min(-89)
    .max(-84)
    .describe("Longitude in decimal degrees, negative west (Indiana range approx -88.1 to -84.7)."),
  elev_ft: z.number().describe("Orthometric elevation in feet (NAVD88)."),
});

export const TraverseLegSchema = z.object({
  bearing_deg: z
    .number()
    .min(0)
    .max(360)
    .describe("Azimuth bearing in decimal degrees (0 = north, clockwise)."),
  distance_ft: z.number().positive().describe("Distance of the leg in feet."),
});

export const TraverseClosureInput = z.object({
  legs: z
    .array(TraverseLegSchema)
    .min(2)
    .describe("Array of traverse legs, each with bearing (azimuth degrees) and distance (ft)."),
});

export const CoordinateSchema = z.object({
  northing: z.number().describe("Northing coordinate in feet."),
  easting: z.number().describe("Easting coordinate in feet."),
});

export const MetesAndBoundsInput = z.object({
  coordinates: z
    .array(CoordinateSchema)
    .min(3)
    .describe(
      "Ordered polygon vertices as {northing, easting} in feet. The polygon is auto-closed; do not duplicate the first point.",
    ),
});

export const InverseInput = z.object({
  n1: z.number().describe("Northing of point 1 in feet."),
  e1: z.number().describe("Easting of point 1 in feet."),
  n2: z.number().describe("Northing of point 2 in feet."),
  e2: z.number().describe("Easting of point 2 in feet."),
});

export const BearingBearingIntersectionInput = z.object({
  n1: z.number().describe("Northing of point 1 in feet."),
  e1: z.number().describe("Easting of point 1 in feet."),
  bearing1_deg: z.number().min(0).max(360).describe("Azimuth from point 1 in decimal degrees (0=north, clockwise)."),
  n2: z.number().describe("Northing of point 2 in feet."),
  e2: z.number().describe("Easting of point 2 in feet."),
  bearing2_deg: z.number().min(0).max(360).describe("Azimuth from point 2 in decimal degrees (0=north, clockwise)."),
});

export const BearingDistanceIntersectionInput = z.object({
  n1: z.number().describe("Northing of point 1 in feet (line origin)."),
  e1: z.number().describe("Easting of point 1 in feet (line origin)."),
  bearing_deg: z.number().min(0).max(360).describe("Azimuth from point 1 in decimal degrees (0=north, clockwise)."),
  n2: z.number().describe("Northing of point 2 in feet (circle center)."),
  e2: z.number().describe("Easting of point 2 in feet (circle center)."),
  distance_ft: z.number().positive().describe("Radius of the circle centered on P2, in feet."),
});

export const DistanceDistanceIntersectionInput = z.object({
  n1: z.number().describe("Northing of point 1 in feet."),
  e1: z.number().describe("Easting of point 1 in feet."),
  d1_ft: z.number().positive().describe("Distance from point 1 in feet."),
  n2: z.number().describe("Northing of point 2 in feet."),
  e2: z.number().describe("Easting of point 2 in feet."),
  d2_ft: z.number().positive().describe("Distance from point 2 in feet."),
});

export const BenchmarkSchema = z.object({
  name: z.string().min(1).describe("Point name."),
  known_elevation_ft: z.number().optional().describe("Known elevation in feet (required for at least one benchmark)."),
});

export const LevelObservationSchema = z.object({
  from: z.string().min(1).describe("Name of the station observed from."),
  to: z.string().min(1).describe("Name of the station observed to."),
  delta_h_ft: z.number().describe("Observed elevation difference in feet (positive = up)."),
  distance_ft: z.number().positive().optional().describe("Distance of the level run in feet (for weighted adjustment)."),
});

export const LevelLoopAdjustmentInput = z.object({
  benchmarks: z.array(BenchmarkSchema).min(1).describe("Array of benchmarks; at least one must have a known elevation."),
  observations: z.array(LevelObservationSchema).min(1).describe("Array of level observations."),
});

export const AreaCoordinateSchema = z.object({
  northing: z.number().describe("Northing coordinate in feet."),
  easting: z.number().describe("Easting coordinate in feet."),
});

export const AreaByCoordinatesInput = z.object({
  coordinates: z.array(AreaCoordinateSchema).min(3).describe("Ordered polygon vertices as {northing, easting} in feet. Auto-closed; do not duplicate the first point."),
});

export const CurveStakeoutInput = z.object({
  radius_ft: z.number().positive().describe("Radius of the circular curve in feet."),
  delta_deg: z.number().gt(0).lt(360).describe("Central (deflection) angle in decimal degrees."),
  pc_station_ft: z.number().describe("Station of the PC (Point of Curvature) in feet."),
  stake_interval_ft: z.number().positive().default(25).describe("Stakeout interval in feet (default 25)."),
  method: z.enum(["deflection", "chord_offset"]).default("deflection").describe("Stakeout method: 'deflection' (default) or 'chord_offset'."),
});

export const TrigLevelingInput = z.object({
  slope_distance_ft: z.number().positive().describe("Slope distance from instrument to target in feet."),
  zenith_angle_deg: z.number().min(0).max(180).describe("Zenith angle in decimal degrees (0 = straight up, 90 = horizontal)."),
  instrument_height_ft: z.number().describe("Height of instrument above the station mark in feet."),
  target_height_ft: z.number().describe("Height of target/prism above the remote station in feet."),
  known_elevation_ft: z.number().describe("Known elevation of the instrument station in feet."),
  apply_curvature_refraction: z.boolean().default(false).describe("Whether to apply curvature-and-refraction correction (default false)."),
});

export const SolarObservationInput = z.object({
  date_iso: z.string().min(1).describe("ISO date string, e.g. '2024-06-15'."),
  time_utc: z.string().min(1).describe("UTC time as HH:MM:SS string."),
  lat_deg: z.number().min(-90).max(90).describe("Observer latitude in decimal degrees (positive north)."),
  lon_deg: z.number().min(-180).max(180).describe("Observer longitude in decimal degrees (negative west)."),
  measured_hz_angle_deg: z.number().describe("Measured horizontal angle from the sun to the mark, in decimal degrees."),
});

export const GridToGroundInput = z.object({
  mode: z.enum(["grid_to_ground", "ground_to_grid"]).describe("Conversion direction."),
  csf: z.number().positive().describe("Combined Scale Factor (CSF). Typically close to 1.0."),
  distance_ft: z.number().optional().describe("Distance to convert, in feet."),
  grid_northing: z.number().optional().describe("Grid (or ground) northing to convert."),
  grid_easting: z.number().optional().describe("Grid (or ground) easting to convert."),
  origin_northing: z.number().optional().describe("Origin northing for coordinate scaling."),
  origin_easting: z.number().optional().describe("Origin easting for coordinate scaling."),
});

export const RunCalculatorInput = z.discriminatedUnion("name", [
  z.object({ name: z.literal("vertical_curve"), inputs: VerticalCurveInput }),
  z.object({ name: z.literal("horizontal_curve"), inputs: HorizontalCurveInput }),
  z.object({ name: z.literal("rational_method"), inputs: RationalMethodInput }),
  z.object({ name: z.literal("mannings_open_channel"), inputs: ManningsOpenChannelInput }),
  z.object({ name: z.literal("state_plane_indiana_csf"), inputs: StatePlaneIndianaCsfInput }),
  z.object({ name: z.literal("traverse_closure"), inputs: TraverseClosureInput }),
  z.object({ name: z.literal("metes_and_bounds"), inputs: MetesAndBoundsInput }),
  z.object({ name: z.literal("inverse"), inputs: InverseInput }),
  z.object({ name: z.literal("bearing_bearing_intersection"), inputs: BearingBearingIntersectionInput }),
  z.object({ name: z.literal("bearing_distance_intersection"), inputs: BearingDistanceIntersectionInput }),
  z.object({ name: z.literal("distance_distance_intersection"), inputs: DistanceDistanceIntersectionInput }),
  z.object({ name: z.literal("level_loop_adjustment"), inputs: LevelLoopAdjustmentInput }),
  z.object({ name: z.literal("area_by_coordinates"), inputs: AreaByCoordinatesInput }),
  z.object({ name: z.literal("curve_stakeout"), inputs: CurveStakeoutInput }),
  z.object({ name: z.literal("trig_leveling"), inputs: TrigLevelingInput }),
  z.object({ name: z.literal("solar_observation"), inputs: SolarObservationInput }),
  z.object({ name: z.literal("grid_to_ground"), inputs: GridToGroundInput }),
]);
