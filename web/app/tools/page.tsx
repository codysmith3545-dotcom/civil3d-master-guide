import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculators",
};

const tools = [
  {
    href: "/tools/vertical-curve",
    title: "Vertical curve",
    body: "Required K and L by AASHTO design speed; SSD- or PSD-controlled crest, headlight sag.",
  },
  {
    href: "/tools/horizontal-curve",
    title: "Horizontal curve",
    body: "T, L, M, E, LC and PC/PT stationing from R, Δ, and PI station, with a chord-deflection table.",
  },
  {
    href: "/tools/rational-method",
    title: "Rational method (Q = CiA)",
    body: "Peak flow with an optional Kirpich tc helper for an overland-flow length and slope.",
  },
];

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
    </div>
  );
}
