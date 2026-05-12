import Link from "next/link";
import { listJurisdictions } from "@/lib/jurisdictions";
import UseMyLocationButton from "./UseMyLocationButton";

export const metadata = {
  title: "Jurisdictions",
};

export default function JurisdictionsIndex() {
  const all = listJurisdictions();
  const counties = all.filter((j) => j.level === "county");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-10">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
          jurisdictions / indiana
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-900">
          Indianapolis-area jurisdictional reference
        </h1>
        <p className="mt-2 text-ink-600">
          Marion County and the seven surrounding counties — plus their cities
          and towns. Use the location lookup to find the rules at a specific
          point, compare jurisdictions side-by-side, or print a submittal
          checklist.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <Card
          title="Find rules at a location"
          body="Enter a latitude/longitude or use your device location to find which jurisdiction applies."
        >
          <UseMyLocationButton />
          <p className="mt-3 text-xs text-ink-500">
            Try Carmel:{" "}
            <Link
              href="/jurisdictions/at/39.9784/-86.118"
              className="text-[--accent] underline"
            >
              39.9784, -86.118
            </Link>
          </p>
        </Card>

        <Card
          title="Compare jurisdictions"
          body="Side-by-side rules matrix: setbacks, stormwater triggers, recording, plat requirements."
        >
          <Link href="/jurisdictions/compare" className="btn btn-primary">
            Open compare
          </Link>
        </Card>

        <Card
          title="Submittal checklists"
          body="Printable, jurisdiction-specific checklists for plan submittal. State persists locally."
        >
          <details className="text-sm">
            <summary className="cursor-pointer text-[--accent] underline">
              Pick a jurisdiction
            </summary>
            <ul className="mt-2 max-h-60 space-y-1 overflow-auto">
              {all.map((j) => (
                <li key={j.jurisdictionSlug}>
                  <Link
                    href={`/jurisdictions/checklist/${j.jurisdictionSlug}`}
                    className="text-[--accent] underline"
                  >
                    {j.breadcrumb.join(" > ")}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </Card>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">Counties covered</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {counties.map((c) => (
            <li key={c.jurisdictionSlug}>
              <Link
                href={`/docs/jurisdictions/${c.jurisdictionSlug}`}
                className="block rounded-lg border border-ink-100 p-3 text-sm hover:border-ink-300"
              >
                {(c.frontmatter.title as string) ??
                  c.breadcrumb[c.breadcrumb.length - 1]}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 text-xs text-ink-500">
        Bounds used for the location lookup are approximate axis-aligned boxes
        and may not match the exact municipal limits. Always confirm against
        the city/county GIS for a regulated determination.
      </p>
    </div>
  );
}

function Card({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-ink-100 p-5">
      <div className="text-sm font-medium uppercase tracking-wider text-ink-500">
        {title}
      </div>
      <p className="mt-2 text-sm text-ink-700">{body}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
