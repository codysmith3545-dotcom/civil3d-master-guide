import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculators",
};

const engineering = [
  {
    href: "/tools/vertical-curve",
    title: "Vertical curve",
    body: "Required K and L by AASHTO design speed; SSD- or PSD-controlled crest, headlight sag.",
  },
  {
    href: "/tools/horizontal-curve",
    title: "Horizontal curve",
    body: "T, L, M, E, LC and PC/PT stationing from R, delta, and PI station, with a chord-deflection table.",
  },
  {
    href: "/tools/rational-method",
    title: "Rational method (Q = CiA)",
    body: "Peak flow with an optional Kirpich tc helper for an overland-flow length and slope.",
  },
  {
    href: "/tools/mannings",
    title: "Manning's equation",
    body: "Open-channel flow velocity and discharge from Manning's n, flow area, hydraulic radius, and slope.",
  },
];

const survey = [
  {
    href: "/tools/inverse",
    title: "Inverse",
    body: "Azimuth, quadrant bearing, and distance between two coordinate pairs.",
  },
  {
    href: "/tools/bearing-bearing-intersection",
    title: "Bearing-bearing intersection",
    body: "Intersection point of two lines defined by known points and azimuths.",
  },
  {
    href: "/tools/bearing-distance-intersection",
    title: "Bearing-distance intersection",
    body: "Intersection of a line (point + azimuth) with a circle (point + radius). 0-2 solutions.",
  },
  {
    href: "/tools/distance-distance-intersection",
    title: "Distance-distance intersection",
    body: "Intersection of two circles (two points, each with a radius). 0-2 solutions.",
  },
  {
    href: "/tools/traverse-closure",
    title: "Traverse closure",
    body: "Closure error, precision ratio, and Compass (Bowditch) adjusted latitudes/departures for a closed traverse.",
  },
  {
    href: "/tools/metes-and-bounds",
    title: "Metes & bounds writer",
    body: "Generate a legal description with bearings and distances from an ordered coordinate list.",
  },
  {
    href: "/tools/area-by-coordinates",
    title: "Area by coordinates",
    body: "Area (sq ft and acres) and perimeter of a closed polygon via the coordinate (shoelace) method.",
  },
  {
    href: "/tools/curve-stakeout",
    title: "Curve stakeout",
    body: "Deflection-angle and chord table for staking a simple circular curve at regular intervals.",
  },
  {
    href: "/tools/level-loop",
    title: "Level loop adjustment",
    body: "Adjust a differential leveling loop with weighted or unweighted distribution of closure error.",
  },
  {
    href: "/tools/trig-leveling",
    title: "Trigonometric leveling",
    body: "Horizontal distance, elevation difference, and remote elevation from slope distance and zenith angle.",
  },
  {
    href: "/tools/solar-observation",
    title: "Solar observation",
    body: "Approximate sun azimuth from date/time/location and derive mark azimuth from a horizontal angle.",
  },
  {
    href: "/tools/grid-to-ground",
    title: "Grid-to-ground",
    body: "Convert between State Plane grid distances and ground distances using a Combined Scale Factor.",
  },
  {
    href: "/tools/state-plane-indiana",
    title: "State Plane Indiana CSF",
    body: "Approximate Combined Scale Factor for Indiana SPC East/West zones from lat, lon, and elevation.",
  },
];

const interop = [
  {
    href: "/tools/landxml-validator",
    title: "LandXML validator",
    body: "Inspect surfaces, alignments, parcels, surveys, and CgPoints in a LandXML file. Flags missing units, mixed unit blocks, empty surfaces, unclosed parcels, NaN coordinates, and more.",
  },
];

function ToolSection({
  title,
  tools,
}: {
  title: string;
  tools: { href: string; title: string; body: string }[];
}) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-ink-800">{title}</h2>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {tools.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              className="block h-full rounded-lg border border-ink-100 p-5 transition hover:border-ink-300 hover:shadow-sm"
            >
              <div className="text-base font-medium text-ink-900">
                {t.title}
              </div>
              <p className="mt-2 text-sm text-ink-600">{t.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ToolsIndex() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Calculators</h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Small, focused tools for screening-level civil-engineering math. Each
          calculator runs in your browser and is also available as a pure
          function for the MCP server to call. Verify any output that affects a
          permit or construction document against the cited primary source.
        </p>
      </header>
      <div className="space-y-10">
        <ToolSection title="Engineering" tools={engineering} />
        <ToolSection title="Survey" tools={survey} />
        <ToolSection title="Interop & QA" tools={interop} />
      </div>
    </div>
  );
}
