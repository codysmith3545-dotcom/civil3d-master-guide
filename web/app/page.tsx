import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <section className="mb-16">
        <p className="text-sm font-medium uppercase tracking-wider text-ink-500">
          A working reference for civil 3d
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink-900 md:text-5xl">
          Survey, design, and jurisdictional standards in one place.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-600">
          Civil 3D Master Guide is a hand-curated knowledge base for land
          surveyors and civil engineers. Browse the docs, run the calculators,
          look up local design standards, or ask the chat assistant — every
          answer cites the source page it came from.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/docs" className="btn btn-primary">
            Browse the docs
          </Link>
          <Link href="/tools" className="btn">
            Open the calculators
          </Link>
          <Link href="/chat" className="btn">
            Ask the assistant
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          title="Chat"
          href="/chat"
          body="A retrieval-grounded assistant that answers from this guide and cites the page it pulled from. Bring your own Anthropic API key — no operator funds spent."
        />
        <FeatureCard
          title="Map"
          href="/docs/jurisdictions"
          body="Indiana jurisdictions: state DOT, eight Indianapolis-region counties, and every incorporated municipality, with links to design manuals and ordinances."
        />
        <FeatureCard
          title="Calculators"
          href="/tools"
          body="Vertical curve K and L, horizontal curve geometry, and Rational Method peak flow with a Kirpich tc helper. Same code the MCP server will expose."
        />
        <FeatureCard
          title="Jurisdictions"
          href="/docs/jurisdictions/indiana"
          body="Marion, Hamilton, Hancock, Shelby, Johnson, Morgan, Hendricks, and Boone counties — with their cities and towns linked through."
        />
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Where to start</h2>
        <ul className="mt-4 space-y-2 text-ink-700">
          <li>
            <Link href="/docs" className="text-[--accent] underline">
              Master table of contents
            </Link>{" "}
            — the same tree you would see browsing the markdown.
          </li>
          <li>
            <Link href="/docs/civil3d" className="text-[--accent] underline">
              Civil 3D core
            </Link>{" "}
            — points, surfaces, alignments, profiles, corridors.
          </li>
          <li>
            <Link href="/docs/standards" className="text-[--accent] underline">
              Standards
            </Link>{" "}
            — AASHTO summaries, ALTA/NSPS, NCS layer naming, plotting.
          </li>
        </ul>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-ink-100 p-5 transition hover:border-ink-300 hover:shadow-sm"
    >
      <div className="text-sm font-medium uppercase tracking-wider text-ink-500">
        {title}
      </div>
      <p className="mt-2 text-sm text-ink-700">{body}</p>
    </Link>
  );
}
