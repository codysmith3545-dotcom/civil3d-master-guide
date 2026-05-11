// Defaults and option lists used by the CLI prompts.

export const CALCULATORS = [
  { slug: 'vertical-curve', name: 'Vertical Curve', category: 'engineering' },
  { slug: 'horizontal-curve', name: 'Horizontal Curve', category: 'engineering' },
  { slug: 'rational-method', name: 'Rational Method', category: 'engineering' },
  { slug: 'mannings', name: "Manning's Equation", category: 'engineering' },
  { slug: 'inverse', name: 'Inverse', category: 'survey' },
  { slug: 'bearing-bearing-intersection', name: 'Bearing-Bearing Intersection', category: 'survey' },
  { slug: 'bearing-distance-intersection', name: 'Bearing-Distance Intersection', category: 'survey' },
  { slug: 'distance-distance-intersection', name: 'Distance-Distance Intersection', category: 'survey' },
  { slug: 'traverse-closure', name: 'Traverse Closure', category: 'survey' },
  { slug: 'metes-and-bounds', name: 'Metes & Bounds Writer', category: 'survey' },
  { slug: 'area-by-coordinates', name: 'Area by Coordinates', category: 'survey' },
  { slug: 'curve-stakeout', name: 'Curve Stakeout', category: 'survey' },
  { slug: 'level-loop', name: 'Level Loop Adjustment', category: 'survey' },
  { slug: 'trig-leveling', name: 'Trigonometric Leveling', category: 'survey' },
  { slug: 'solar-observation', name: 'Solar Observation', category: 'survey' },
  { slug: 'grid-to-ground', name: 'Grid-to-Ground', category: 'survey' },
  { slug: 'state-plane-indiana', name: 'State Plane Indiana CSF', category: 'survey' },
];

export const MODELS = ['claude-opus-4-7', 'claude-sonnet-4-6', 'claude-haiku-4-5-20251001'];

export const AUTH_MODES = ['none', 'open', 'invite-only'];

export const LICENSES = ['MIT', 'Apache-2.0', 'CC-BY-4.0'];
