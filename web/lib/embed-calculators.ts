/**
 * Allow-list of calculators that can be embedded via /embed/calc/[name].
 *
 * Kept in lockstep with the routes under web/app/tools/. The list is
 * authoritative for routing — anything not in here returns 404 from the
 * embed route, which prevents path traversal and surface-area surprises.
 */

export type EmbedCalculator = {
  slug: string;
  title: string;
  blurb: string;
  group: "engineering" | "survey";
};

export const EMBED_CALCULATORS: ReadonlyArray<EmbedCalculator> = [
  // Engineering
  {
    slug: "vertical-curve",
    title: "Vertical curve",
    blurb:
      "Required K and L by AASHTO design speed; SSD- or PSD-controlled crest, headlight sag.",
    group: "engineering",
  },
  {
    slug: "horizontal-curve",
    title: "Horizontal curve",
    blurb:
      "T, L, M, E, LC and PC/PT stationing from R, delta, and PI station.",
    group: "engineering",
  },
  {
    slug: "rational-method",
    title: "Rational method (Q = CiA)",
    blurb: "Peak flow with an optional Kirpich tc helper.",
    group: "engineering",
  },
  {
    slug: "mannings",
    title: "Manning's equation",
    blurb:
      "Open-channel flow velocity and discharge from Manning's n, area, R, and slope.",
    group: "engineering",
  },
  // Survey
  {
    slug: "inverse",
    title: "Inverse",
    blurb: "Azimuth, quadrant bearing, and distance between two coordinates.",
    group: "survey",
  },
  {
    slug: "bearing-bearing-intersection",
    title: "Bearing-bearing intersection",
    blurb: "Intersection of two lines (point + azimuth).",
    group: "survey",
  },
  {
    slug: "bearing-distance-intersection",
    title: "Bearing-distance intersection",
    blurb: "Line and circle intersection. 0-2 solutions.",
    group: "survey",
  },
  {
    slug: "distance-distance-intersection",
    title: "Distance-distance intersection",
    blurb: "Two-circle intersection. 0-2 solutions.",
    group: "survey",
  },
  {
    slug: "traverse-closure",
    title: "Traverse closure",
    blurb:
      "Closure error, precision ratio, and Compass (Bowditch) adjustment.",
    group: "survey",
  },
  {
    slug: "metes-and-bounds",
    title: "Metes & bounds writer",
    blurb: "Legal description from an ordered coordinate list.",
    group: "survey",
  },
  {
    slug: "area-by-coordinates",
    title: "Area by coordinates",
    blurb: "Shoelace area and perimeter of a closed polygon.",
    group: "survey",
  },
  {
    slug: "curve-stakeout",
    title: "Curve stakeout",
    blurb: "Deflection-angle and chord table for staking a simple curve.",
    group: "survey",
  },
  {
    slug: "level-loop",
    title: "Level loop adjustment",
    blurb: "Adjust a differential leveling loop with weighted distribution.",
    group: "survey",
  },
  {
    slug: "trig-leveling",
    title: "Trigonometric leveling",
    blurb:
      "Horizontal distance and elevation difference from slope distance and zenith.",
    group: "survey",
  },
  {
    slug: "solar-observation",
    title: "Solar observation",
    blurb: "Approximate sun azimuth and mark azimuth from a horizontal angle.",
    group: "survey",
  },
  {
    slug: "grid-to-ground",
    title: "Grid-to-ground",
    blurb: "Convert between State Plane grid and ground distances.",
    group: "survey",
  },
  {
    slug: "state-plane-indiana",
    title: "State Plane Indiana CSF",
    blurb:
      "Approximate Combined Scale Factor for Indiana SPC East/West zones.",
    group: "survey",
  },
] as const;

export const EMBED_CALCULATOR_SLUGS: ReadonlyArray<string> =
  EMBED_CALCULATORS.map((c) => c.slug);

export function isEmbeddableCalculator(slug: string): boolean {
  return EMBED_CALCULATOR_SLUGS.includes(slug);
}

export function getEmbeddableCalculator(
  slug: string,
): EmbedCalculator | undefined {
  return EMBED_CALCULATORS.find((c) => c.slug === slug);
}
