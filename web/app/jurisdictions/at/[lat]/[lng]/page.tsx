import Link from "next/link";
import {
  COVERED_COUNTIES,
  jurisdictionAt,
  listJurisdictions,
  parseLatLng,
  type ChecklistItem,
  type JurisdictionPage,
  type PlatRequirement,
} from "@/lib/jurisdictions";
import { JurisdictionDelta } from "@/components/JurisdictionDelta";

type Props = { params: { lat: string; lng: string } };

export function generateMetadata({ params }: Props) {
  return { title: `Jurisdiction at ${params.lat}, ${params.lng}` };
}

export default function GpsPage({ params }: Props) {
  const parsed = parseLatLng(params.lat, params.lng);
  if (!parsed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-semibold">Invalid coordinates</h1>
        <p className="mt-2 text-ink-600">
          The URL must be /jurisdictions/at/&lt;lat&gt;/&lt;lng&gt; with values
          in the WGS84 ranges (lat -90 to 90, lng -180 to 180).
        </p>
        <Link href="/jurisdictions" className="mt-4 inline-block btn">
          Back to jurisdictions
        </Link>
      </div>
    );
  }

  const all = listJurisdictions();
  const { best, containing } = jurisdictionAt(parsed.lat, parsed.lng, all);

  if (!best) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
          {parsed.lat.toFixed(5)}, {parsed.lng.toFixed(5)}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Outside the Indiana coverage area
        </h1>
        <p className="mt-3 text-ink-600">
          This guide currently covers Marion County and seven adjacent
          counties in central Indiana. The coordinate you entered falls
          outside the boxes we have on file.
        </p>
        <p className="mt-4 text-ink-700">Covered counties:</p>
        <ul className="mt-2 list-disc pl-6 text-ink-700">
          {COVERED_COUNTIES.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <Link href="/jurisdictions" className="mt-6 inline-block btn">
          Back to jurisdictions
        </Link>
      </div>
    );
  }

  // Hierarchy: find county-level page if best is municipality.
  const countySlug = best.jurisdictionSlug.split("/").slice(0, 2).join("/");
  const countyPage =
    best.level === "county"
      ? best
      : containing.find((j) => j.jurisdictionSlug === countySlug) ?? null;

  // Optional delta: when best is a municipality, show what changes
  // crossing from the county into the city.
  const showDelta =
    best.level === "municipality" && countyPage && countyPage !== best;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
        {parsed.lat.toFixed(5)}, {parsed.lng.toFixed(5)}
      </p>
      <Breadcrumb crumbs={best.breadcrumb} slug={best.jurisdictionSlug} />
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-900">
        {(best.fm.title as string) ?? best.breadcrumb[best.breadcrumb.length - 1]}
      </h1>
      <p className="mt-2 text-sm text-ink-600">
        <Link
          href={`/docs/jurisdictions/${best.jurisdictionSlug}`}
          className="text-[--accent] underline"
        >
          Open the full reference page
        </Link>{" "}
        ·{" "}
        <Link
          href={`/jurisdictions/checklist/${best.jurisdictionSlug}`}
          className="text-[--accent] underline"
        >
          Submittal checklist
        </Link>
      </p>

      <p className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-ink-700">
        The location-to-jurisdiction match uses approximate axis-aligned
        bounding boxes. Confirm with the city/county GIS before relying on it
        for a regulated determination.
      </p>

      <div className="mt-8 space-y-4">
        <Card title="Submittal checklist">
          <ChecklistList items={best.fm.submittal_checklist} fallback={countyPage?.fm.submittal_checklist} fallbackName={countyPage?.breadcrumb[countyPage.breadcrumb.length - 1]} />
          <Sources items={pickSources(best.fm.submittal_checklist)} />
        </Card>

        <Card title="Setbacks">
          <SetbacksView j={best} fallback={countyPage ?? null} />
        </Card>

        <Card title="Stormwater thresholds">
          <StormwaterView j={best} fallback={countyPage ?? null} />
        </Card>

        <Card title="Recording requirements">
          <RecordingView j={best} fallback={countyPage ?? null} />
        </Card>

        <Card title="Plat requirements">
          <PlatList items={best.fm.plat_requirements} fallback={countyPage?.fm.plat_requirements} fallbackName={countyPage?.breadcrumb[countyPage.breadcrumb.length - 1]} />
          <Sources items={pickSources(best.fm.plat_requirements)} />
        </Card>
      </div>

      {showDelta && countyPage ? (
        <div className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">
            What changes inside the city limits
          </h2>
          <p className="mt-1 text-sm text-ink-600">
            Differences between {countyPage.breadcrumb.join(" > ")} and{" "}
            {best.breadcrumb.join(" > ")}.
          </p>
          <div className="mt-3">
            <JurisdictionDelta from={countyPage} to={best} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Breadcrumb({ crumbs, slug }: { crumbs: string[]; slug: string }) {
  const parts = slug.split("/");
  // Build progressive hrefs: e.g. indiana, indiana/hamilton-county, indiana/hamilton-county/municipalities/carmel
  const hrefs: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === "municipalities") continue;
    hrefs.push("/docs/jurisdictions/" + parts.slice(0, i + 1).join("/"));
  }
  return (
    <nav className="mt-1 text-xs text-ink-500">
      {crumbs.map((c, i) => (
        <span key={i}>
          {i > 0 ? " > " : ""}
          {hrefs[i] ? (
            <Link href={hrefs[i]} className="hover:underline">
              {c}
            </Link>
          ) : (
            c
          )}
        </span>
      ))}
    </nav>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details
      className="rounded-lg border border-ink-100 open:bg-white"
      open
    >
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium uppercase tracking-wider text-ink-700">
        {title}
      </summary>
      <div className="border-t border-ink-100 px-4 py-3 text-sm text-ink-700">
        {children}
      </div>
    </details>
  );
}

function ChecklistList({
  items,
  fallback,
  fallbackName,
}: {
  items?: ChecklistItem[];
  fallback?: ChecklistItem[];
  fallbackName?: string;
}) {
  if (items && items.length > 0) {
    return (
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={it.id ?? i} className="flex gap-2">
            <span aria-hidden className="mt-1 inline-block h-3 w-3 rounded-sm border border-ink-300" />
            <div>
              <div>
                {it.label}
                {it.required ? (
                  <span className="ml-1 text-xs text-red-700">required</span>
                ) : null}
              </div>
              {it.description ? (
                <div className="text-xs text-ink-500">{it.description}</div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    );
  }
  if (fallback && fallback.length > 0 && fallbackName) {
    return (
      <NotYetDocumented fallbackName={fallbackName} field="submittal checklist" />
    );
  }
  return <NotYetDocumented fallbackName={fallbackName} field="submittal checklist" />;
}

function PlatList({
  items,
  fallback,
  fallbackName,
}: {
  items?: PlatRequirement[];
  fallback?: PlatRequirement[];
  fallbackName?: string;
}) {
  if (items && items.length > 0) {
    return (
      <ul className="list-disc space-y-1 pl-5">
        {items.map((it, i) => (
          <li key={it.id ?? i}>
            {it.label}
            {it.source ? (
              <span className="ml-1 text-xs text-ink-500">({it.source})</span>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }
  return <NotYetDocumented fallbackName={fallbackName} field="plat requirements" />;
}

function SetbacksView({
  j,
  fallback,
}: {
  j: JurisdictionPage;
  fallback: JurisdictionPage | null;
}) {
  const s = j.fm.setbacks;
  if (!s) {
    return <NotYetDocumented fallbackName={fallback?.breadcrumb.join(" > ")} field="setbacks" />;
  }
  return (
    <div>
      <KeyValGrid
        rows={[
          ["Front (ft)", s.front_ft],
          ["Side (ft)", s.side_ft],
          ["Rear (ft)", s.rear_ft],
          ["Corner-side (ft)", s.corner_side_ft],
        ]}
      />
      {s.notes ? <p className="mt-2 text-xs text-ink-500">{s.notes}</p> : null}
      <Sources items={s.source ? [s.source] : []} />
    </div>
  );
}

function StormwaterView({
  j,
  fallback,
}: {
  j: JurisdictionPage;
  fallback: JurisdictionPage | null;
}) {
  const s = j.fm.stormwater_thresholds;
  if (!s) {
    return <NotYetDocumented fallbackName={fallback?.breadcrumb.join(" > ")} field="stormwater thresholds" />;
  }
  return (
    <div>
      <KeyValGrid
        rows={[
          ["Detention trigger (sqft)", s.detention_trigger_sqft],
          ["Water-quality trigger (sqft)", s.water_quality_trigger_sqft],
          ["Release rate (cfs/ac)", s.release_rate_cfs_per_acre],
          [
            "Design storms (yr)",
            Array.isArray(s.design_storm_years)
              ? s.design_storm_years.join(", ")
              : undefined,
          ],
        ]}
      />
      <Sources items={s.source ? [s.source] : []} />
    </div>
  );
}

function RecordingView({
  j,
  fallback,
}: {
  j: JurisdictionPage;
  fallback: JurisdictionPage | null;
}) {
  const r = j.fm.recording_requirements;
  if (!r) {
    return <NotYetDocumented fallbackName={fallback?.breadcrumb.join(" > ")} field="recording requirements" />;
  }
  return (
    <div>
      <KeyValGrid
        rows={[
          ["Paper size", r.paper_size],
          ["Margins (in)", r.margins_in],
          [
            "Signature block required",
            r.signature_block_required === undefined
              ? undefined
              : r.signature_block_required
              ? "Yes"
              : "No",
          ],
          [
            "Mylar required",
            r.mylar_required === undefined
              ? undefined
              : r.mylar_required
              ? "Yes"
              : "No",
          ],
          ["Recording fee (USD)", r.recording_fee_usd],
        ]}
      />
      <Sources items={r.source ? [r.source] : []} />
    </div>
  );
}

function KeyValGrid({ rows }: { rows: [string, unknown][] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-2">
          <dt className="text-ink-500">{k}</dt>
          <dd className="text-ink-800">
            {v === undefined || v === null || v === "" ? (
              <span className="text-ink-400">—</span>
            ) : (
              String(v)
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function NotYetDocumented({
  fallbackName,
  field,
}: {
  fallbackName?: string;
  field: string;
}) {
  return (
    <p className="text-ink-500">
      Not yet documented for this jurisdiction.
      {fallbackName ? (
        <>
          {" "}
          See the <span className="text-ink-700">{fallbackName}</span> page
          for the {field} that typically apply.
        </>
      ) : null}
    </p>
  );
}

function Sources({ items }: { items: (string | undefined)[] }) {
  const cleaned = items.filter(Boolean) as string[];
  if (cleaned.length === 0) return null;
  return (
    <div className="mt-3 border-t border-ink-100 pt-2 text-xs text-ink-500">
      Source citations: {cleaned.join("; ")}
    </div>
  );
}

function pickSources(items?: { source?: string }[]): string[] {
  if (!Array.isArray(items)) return [];
  return Array.from(new Set(items.map((i) => i.source).filter(Boolean) as string[]));
}
