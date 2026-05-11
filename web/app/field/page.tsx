import type { Metadata } from "next";
import Link from "next/link";
import FieldDayClient from "./FieldDayClient";

export const metadata: Metadata = {
  title: "Field day",
  description:
    "Field-day quick reference: GPS-based jurisdiction lookup, calculators, LISP cheat sheet, and a deed-bearings reference card. Designed to work offline.",
};

// 17 calculator routes — kept in sync with web/app/tools/page.tsx.
const CALCULATORS = [
  { href: "/tools/vertical-curve", label: "Vertical curve" },
  { href: "/tools/horizontal-curve", label: "Horizontal curve" },
  { href: "/tools/rational-method", label: "Rational method (Q=CiA)" },
  { href: "/tools/mannings", label: "Manning's equation" },
  { href: "/tools/inverse", label: "Inverse" },
  { href: "/tools/bearing-bearing-intersection", label: "Bearing-bearing intersection" },
  { href: "/tools/bearing-distance-intersection", label: "Bearing-distance intersection" },
  { href: "/tools/distance-distance-intersection", label: "Distance-distance intersection" },
  { href: "/tools/traverse-closure", label: "Traverse closure" },
  { href: "/tools/metes-and-bounds", label: "Metes & bounds writer" },
  { href: "/tools/area-by-coordinates", label: "Area by coordinates" },
  { href: "/tools/curve-stakeout", label: "Curve stakeout" },
  { href: "/tools/level-loop", label: "Level loop adjustment" },
  { href: "/tools/trig-leveling", label: "Trigonometric leveling" },
  { href: "/tools/solar-observation", label: "Solar observation" },
  { href: "/tools/grid-to-ground", label: "Grid-to-ground" },
  { href: "/tools/state-plane-indiana", label: "State Plane Indiana CSF" },
];

export default function FieldDayPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Field day</h1>
        <p className="mt-2 text-ink-600">
          Designed for tablet use in the field. The calculators, the LISP
          cheat sheet, this page, and the GPS jurisdiction lookup all work
          offline once the app has been opened with a connection at least
          once.
        </p>
      </header>

      <FieldDayClient calculators={CALCULATORS} />

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-ink-800">
          LISP routine cheat sheet
        </h2>
        <Link
          href="/field/lisp-cheatsheet"
          className="block rounded-lg border-2 border-ink-200 p-4 text-base font-medium hover:border-ink-400"
        >
          Open printable cheat sheet (top 20 commands)
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-ink-800">
          Common deed bearings
        </h2>
        <DeedBearingsCard />
      </section>
    </div>
  );
}

function DeedBearingsCard() {
  // Quadrant bearing reference. Useful when reading older Indiana deeds in
  // the field; these are the plain decimal-degree equivalents of common
  // call directions.
  const rows: Array<[string, string, string]> = [
    ["Due North", "N 0°00'00\" E", "0° azimuth"],
    ["Northeast cardinal", "N 45°00'00\" E", "45° azimuth"],
    ["Due East", "N 90°00'00\" E", "90° azimuth"],
    ["Southeast cardinal", "S 45°00'00\" E", "135° azimuth"],
    ["Due South", "S 0°00'00\" E", "180° azimuth"],
    ["Southwest cardinal", "S 45°00'00\" W", "225° azimuth"],
    ["Due West", "N 90°00'00\" W", "270° azimuth"],
    ["Northwest cardinal", "N 45°00'00\" W", "315° azimuth"],
  ];
  return (
    <div className="overflow-x-auto rounded-lg border border-ink-200">
      <table className="min-w-full text-sm">
        <thead className="bg-ink-50 text-left text-ink-700">
          <tr>
            <th className="px-3 py-2">Direction</th>
            <th className="px-3 py-2">Quadrant bearing</th>
            <th className="px-3 py-2">Azimuth</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([dir, qb, az]) => (
            <tr key={dir} className="border-t border-ink-100">
              <td className="px-3 py-2 font-medium">{dir}</td>
              <td className="px-3 py-2 font-mono">{qb}</td>
              <td className="px-3 py-2 font-mono">{az}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-ink-100 bg-ink-50 px-3 py-2 text-xs text-ink-600">
        Conversion: azimuth measured clockwise from north. NE quadrant bearing
        equals azimuth. SE = 180 - bearing-from-south. SW = 180 + bearing-from-south.
        NW = 360 - bearing-from-north.
      </p>
    </div>
  );
}
