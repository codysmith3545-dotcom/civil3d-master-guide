import type { Metadata } from "next";
import { EMBED_CALCULATORS } from "@/lib/embed-calculators";

export const metadata: Metadata = {
  title: "Embeddable calculators",
  description:
    "Drop a Civil 3D Master Guide calculator into a class page or blog post with a single iframe.",
};

function snippet(slug: string): string {
  return `<iframe
  src="https://civil3d-master-guide.example/embed/calc/${slug}"
  title="${slug} calculator"
  width="100%"
  height="640"
  style="border:1px solid #e5e7eb;border-radius:8px;"
  loading="lazy"
></iframe>`;
}

export default function EmbedIndexPage() {
  const engineering = EMBED_CALCULATORS.filter((c) => c.group === "engineering");
  const survey = EMBED_CALCULATORS.filter((c) => c.group === "survey");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Embeddable calculators
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Every calculator on this site is available as a no-script iframe
          widget. Paste the snippet below into your class page, departmental
          intranet, or blog. Free for non-commercial educational use with
          attribution. To request that your domain be allow-listed for
          embedding, see <code>content/embeds/index.md</code>.
        </p>
      </header>

      <Section title="Engineering" calcs={engineering} />
      <Section title="Survey" calcs={survey} />
    </div>
  );
}

function Section({
  title,
  calcs,
}: {
  title: string;
  calcs: typeof EMBED_CALCULATORS;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-ink-800">{title}</h2>
      <ul className="space-y-6">
        {calcs.map((c) => (
          <li
            key={c.slug}
            className="rounded-lg border border-ink-100 p-5"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <div className="text-base font-medium text-ink-900">
                  {c.title}
                </div>
                <p className="mt-1 text-sm text-ink-600">{c.blurb}</p>
              </div>
              <a
                href={`/embed/calc/${c.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-sm text-ink-700 hover:text-ink-900"
              >
                Preview &rarr;
              </a>
            </div>
            <pre className="mt-3 overflow-x-auto rounded-md bg-ink-50 p-3 text-xs text-ink-800">
              <code>{snippet(c.slug)}</code>
            </pre>
          </li>
        ))}
      </ul>
    </section>
  );
}
