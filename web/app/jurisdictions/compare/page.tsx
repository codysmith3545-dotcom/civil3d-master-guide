import { listJurisdictions } from "@/lib/jurisdictions";
import { CompareClient, type CompareJurisdiction } from "./CompareClient";

export const metadata = {
  title: "Compare jurisdictions",
};

export default function ComparePage() {
  const items: CompareJurisdiction[] = listJurisdictions().map((j) => ({
    slug: j.jurisdictionSlug,
    title: (j.fm.title as string) ?? j.breadcrumb[j.breadcrumb.length - 1],
    breadcrumb: j.breadcrumb,
    fm: {
      setbacks: j.fm.setbacks,
      stormwater_thresholds: j.fm.stormwater_thresholds,
      recording_requirements: j.fm.recording_requirements,
      plat_requirements: j.fm.plat_requirements,
    },
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 print:max-w-none print:p-0">
      <header className="mb-6 print:mb-2">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
          jurisdictions
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-900">
          Compare jurisdictions
        </h1>
        <p className="mt-2 text-ink-600 print:hidden">
          Pick two or more jurisdictions to see their setbacks, stormwater
          triggers, recording requirements, and plat requirements side by
          side. Cells that differ from the first column are highlighted.
        </p>
      </header>
      <CompareClient items={items} />
    </div>
  );
}
