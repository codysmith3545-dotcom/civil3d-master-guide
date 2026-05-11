import Link from "next/link";
import SearchBox from "@/components/SearchBox";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      {/* Hero with prominent search */}
      <section className="mb-16 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-ink-500">
          A working reference for civil 3d
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink-900 md:text-5xl">
          Survey, design, and jurisdictional standards in one place.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-600">
          400+ pages of hand-curated reference material, 17 survey and
          engineering calculators, Indiana jurisdictional standards, and an AI
          assistant that cites every answer.
        </p>
        <div className="mx-auto mt-8 max-w-xl">
          <SearchBox size="large" placeholder="What are you looking for?" />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/docs" className="btn btn-primary">
            Browse the docs
          </Link>
          <Link href="/tools" className="btn">
            Open the calculators
          </Link>
          <Link href="/chat" className="btn">
            Ask the assistant
          </Link>
          <Link href="/study" className="btn">
            Exam prep (Indiana PS)
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          title="Survey Tools"
          href="/tools"
          body="17 calculators: traverse closure, bearing-bearing intersection, metes and bounds, solar observation, grid-to-ground, state plane CSF, and more."
        />
        <FeatureCard
          title="Chat"
          href="/chat"
          body="A retrieval-grounded assistant that answers from this guide and cites the page it pulled from. Bring your own Anthropic API key."
        />
        <FeatureCard
          title="Jurisdictions"
          href="/docs/jurisdictions/indiana"
          body="Marion, Hamilton, Hancock, Shelby, Johnson, Morgan, Hendricks, and Boone counties — with their cities, towns, and design manuals."
        />
        <FeatureCard
          title="Standards"
          href="/docs/standards"
          body="AASHTO Green Book, ALTA/NSPS 2021, INDOT Design Manual, NCS layer naming, and Ten States Standards — summarized with source links."
        />
        <FeatureCard
          title="Playbooks"
          href="/docs/playbooks"
          body="End-to-end surveyor workflows that chain the Deed Decoder, jurisdiction intelligence, Civil 3D Power Pack LISP, calculators, and the AI Project Companion plat-check."
        />
        <FeatureCard
          title="CEU Modules"
          href="/ceu"
          body="Self-study CEU framework for Indiana licensed surveyors. 7 modules, 7 PDH documented, with a local tracker and printable completion report (pending Board approval)."
        />
        <FeatureCard
          title="Indiana PS Exam Prep"
          href="/study"
          body="Fifty-question practice bank with spaced-repetition flashcards. Covers bearings, traverse math, boundary law, riparian rights, 865 IAC, and PLSS restoration."
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
            <Link href="/docs/engineering" className="text-[--accent] underline">
              Engineering
            </Link>{" "}
            — stormwater, grading, road design, and utility reference.
          </li>
          <li>
            <Link href="/docs/field-and-boundary" className="text-[--accent] underline">
              Field &amp; boundary
            </Link>{" "}
            — real-world survey practice, legal descriptions, monumentation.
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
