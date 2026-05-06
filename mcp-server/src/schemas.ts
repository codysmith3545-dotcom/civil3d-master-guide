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

export const RunCalculatorInput = z.discriminatedUnion("name", [
  z.object({ name: z.literal("vertical_curve"), inputs: VerticalCurveInput }),
  z.object({ name: z.literal("horizontal_curve"), inputs: HorizontalCurveInput }),
  z.object({ name: z.literal("rational_method"), inputs: RationalMethodInput }),
  z.object({ name: z.literal("mannings_open_channel"), inputs: ManningsOpenChannelInput }),
  z.object({ name: z.literal("state_plane_indiana_csf"), inputs: StatePlaneIndianaCsfInput }),
]);
