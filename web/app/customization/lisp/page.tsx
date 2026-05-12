import type { Metadata } from "next";
import { listLispEntries, categoryCounts } from "@/lib/lisp";
import LispCatalog from "./LispCatalog";

export const metadata: Metadata = {
  title: "LISP library",
};

export default function LispLibraryPage() {
  const entries = listLispEntries();
  const counts = categoryCounts(entries);
  const categories = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
          customization / lisp
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          LISP routine library
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Browsable catalog of AutoLISP routines for Civil 3D. Each entry
          includes a copyable .lsp source, a markdown doc with usage notes,
          and verified version applicability. Test before production.
        </p>
      </header>
      <LispCatalog entries={entries} categories={categories} />
    </div>
  );
}
