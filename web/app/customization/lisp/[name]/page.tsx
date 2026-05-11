import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getLispEntry,
  listLispEntries,
  readLispDoc,
  readLispSource,
} from "@/lib/lisp";
import { renderMarkdown } from "@/lib/content";
import CopyButton from "./CopyButton";

type RouteProps = { params: { name: string } };

export function generateStaticParams() {
  return listLispEntries().map((e) => ({ name: e.name }));
}

export function generateMetadata({ params }: RouteProps): Metadata {
  const entry = getLispEntry(params.name);
  if (!entry) return { title: "LISP routine not found" };
  return { title: `${entry.command} — LISP library` };
}

export default async function LispDetail({ params }: RouteProps) {
  const entry = getLispEntry(params.name);
  if (!entry) notFound();

  const lspSource = readLispSource(entry) ?? "";
  const docMarkdown = readLispDoc(entry) ?? "";

  // Strip the frontmatter block (if any) before rendering the doc body.
  const docBody = docMarkdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");
  const { html } = await renderMarkdown(docBody);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-4 text-sm text-ink-500">
        <Link href="/customization/lisp" className="hover:text-ink-700 hover:underline">
          ← LISP library
        </Link>
      </nav>
      <header className="mb-6 border-b border-ink-100 pb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
          customization / lisp / {entry.category}
        </p>
        <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
          <h1 className="font-mono text-3xl font-semibold tracking-tight text-ink-900">
            {entry.command}
          </h1>
          <div className="flex items-center gap-2">
            <CopyButton label="Copy .lsp" payload={lspSource} />
            <CopyButton label="Copy doc" payload={docMarkdown} />
          </div>
        </div>
        <p className="mt-3 text-ink-700">{entry.summary}</p>
        {entry.appliesTo && entry.appliesTo.length > 0 ? (
          <p className="mt-2 text-xs text-ink-500">
            Applies to: {entry.appliesTo.join(", ")}
          </p>
        ) : null}
      </header>

      <section className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-ink-600">
            AutoLISP source
          </h2>
          <Link
            href={`/api/lisp/${entry.name}?format=lsp`}
            className="text-xs text-ink-500 underline hover:text-ink-700"
            prefetch={false}
          >
            View raw .lsp
          </Link>
        </div>
        <pre className="overflow-x-auto rounded-md border border-ink-100 bg-ink-50 p-4 text-xs leading-relaxed text-ink-900">
          <code>{lspSource}</code>
        </pre>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-ink-600">
            Documentation
          </h2>
          <Link
            href={`/api/lisp/${entry.name}?format=md`}
            className="text-xs text-ink-500 underline hover:text-ink-700"
            prefetch={false}
          >
            View raw .md
          </Link>
        </div>
        <div
          className="prose prose-ink max-w-none prose-headings:scroll-mt-20 prose-a:text-[--accent]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>
    </div>
  );
}
