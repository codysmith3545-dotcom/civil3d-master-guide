import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  EMBED_CALCULATORS,
  getEmbeddableCalculator,
  isEmbeddableCalculator,
} from "@/lib/embed-calculators";

type Params = { name: string };

/**
 * Pre-generate one static embed page per allow-listed calculator. The
 * allow-list is the only thing that gates routing — any slug not in
 * `EMBED_CALCULATORS` returns 404, which is what blocks path traversal.
 */
export function generateStaticParams(): Params[] {
  return EMBED_CALCULATORS.map((c) => ({ name: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const calc = getEmbeddableCalculator(params.name);
  return {
    title: calc ? `${calc.title} — embed` : "Embed",
    robots: { index: false, follow: false },
  };
}

// Each entry below imports the calculator's React component for the
// embed. The first calculator (traverse-closure) demonstrates the
// "extract to web/components/calculators/<name>.tsx" pattern with no
// breadcrumb chrome; the rest reuse whatever the existing
// `app/tools/<name>/page.tsx` already exports as default.
const widgets: Record<
  string,
  ReturnType<typeof dynamic>
> = {
  "traverse-closure": dynamic(
    () => import("@/components/calculators/traverse-closure"),
    { ssr: false },
  ),
  "vertical-curve": dynamic(() => import("@/app/tools/vertical-curve/page"), {
    ssr: false,
  }),
  "horizontal-curve": dynamic(
    () => import("@/app/tools/horizontal-curve/page"),
    { ssr: false },
  ),
  "rational-method": dynamic(
    () => import("@/app/tools/rational-method/page"),
    { ssr: false },
  ),
  mannings: dynamic(() => import("@/app/tools/mannings/page"), {
    ssr: false,
  }),
  inverse: dynamic(() => import("@/app/tools/inverse/page"), { ssr: false }),
  "bearing-bearing-intersection": dynamic(
    () => import("@/app/tools/bearing-bearing-intersection/page"),
    { ssr: false },
  ),
  "bearing-distance-intersection": dynamic(
    () => import("@/app/tools/bearing-distance-intersection/page"),
    { ssr: false },
  ),
  "distance-distance-intersection": dynamic(
    () => import("@/app/tools/distance-distance-intersection/page"),
    { ssr: false },
  ),
  "metes-and-bounds": dynamic(
    () => import("@/app/tools/metes-and-bounds/page"),
    { ssr: false },
  ),
  "area-by-coordinates": dynamic(
    () => import("@/app/tools/area-by-coordinates/page"),
    { ssr: false },
  ),
  "curve-stakeout": dynamic(() => import("@/app/tools/curve-stakeout/page"), {
    ssr: false,
  }),
  "level-loop": dynamic(() => import("@/app/tools/level-loop/page"), {
    ssr: false,
  }),
  "trig-leveling": dynamic(() => import("@/app/tools/trig-leveling/page"), {
    ssr: false,
  }),
  "solar-observation": dynamic(
    () => import("@/app/tools/solar-observation/page"),
    { ssr: false },
  ),
  "grid-to-ground": dynamic(() => import("@/app/tools/grid-to-ground/page"), {
    ssr: false,
  }),
  "state-plane-indiana": dynamic(
    () => import("@/app/tools/state-plane-indiana/page"),
    { ssr: false },
  ),
};

export default function EmbedCalcPage({ params }: { params: Params }) {
  if (!isEmbeddableCalculator(params.name)) {
    notFound();
  }
  const Widget = widgets[params.name];
  if (!Widget) {
    // Defensive: allow-list says yes but no component is wired up.
    notFound();
  }
  const calc = getEmbeddableCalculator(params.name);

  return (
    <div className="prose-sm min-h-screen bg-white text-ink-900">
      <div className="mx-auto max-w-3xl border border-ink-100 px-4 py-4">
        <Widget />
        <div className="mt-6 border-t border-ink-100 pt-3 text-center text-xs text-ink-500">
          <a
            href={`https://civil3d-master-guide.example/tools/${calc?.slug ?? ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink-800"
          >
            Powered by Civil 3D Master Guide
          </a>
        </div>
      </div>
    </div>
  );
}
