import { notFound } from "next/navigation";
import Link from "next/link";
import { getJurisdictionBySlug } from "@/lib/jurisdictions";
import { ChecklistClient } from "./ChecklistClient";

type Props = { params: { slug: string[] } };

export function generateMetadata({ params }: Props) {
  return { title: `Submittal checklist — ${params.slug.join("/")}` };
}

export default function ChecklistPage({ params }: Props) {
  const slug = params.slug.join("/");
  const j = getJurisdictionBySlug(slug);
  if (!j) notFound();

  const items = j.fm.submittal_checklist ?? [];
  const title = (j.fm.title as string) ?? j.breadcrumb[j.breadcrumb.length - 1];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 print:max-w-none print:p-0">
      <header className="mb-6 print:mb-2">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
          submittal checklist
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-900">
          {title}
        </h1>
        <p className="mt-1 text-sm text-ink-500">{j.breadcrumb.join(" > ")}</p>
      </header>

      <ChecklistClient
        slug={j.jurisdictionSlug}
        items={items.map((it, i) => ({
          id: it.id ?? String(i),
          label: it.label,
          description: it.description,
          required: it.required,
          source: it.source,
        }))}
      />

      {Array.isArray(j.fm.sources) && j.fm.sources.length > 0 ? (
        <footer className="mt-10 border-t border-ink-100 pt-4 text-xs text-ink-500">
          <div className="font-medium uppercase tracking-wider">Sources</div>
          <ul className="mt-2 space-y-1">
            {(j.fm.sources as { title: string; url: string }[]).map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  className="text-[--accent] underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      ) : null}

      <p className="mt-6 text-xs text-ink-500 print:hidden">
        <Link href="/jurisdictions" className="underline">
          Back to jurisdictions
        </Link>
      </p>
    </div>
  );
}
