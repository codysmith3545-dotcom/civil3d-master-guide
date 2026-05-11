"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { LispRoutineEntry } from "@/lib/lisp";

type Props = {
  entries: LispRoutineEntry[];
  categories: { name: string; count: number }[];
};

export default function LispCatalog({ entries, categories }: Props) {
  const [activeCat, setActiveCat] = useState<string>("all");
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (activeCat !== "all" && e.category !== activeCat) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.command.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q)
      );
    });
  }, [entries, activeCat, query]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <aside className="space-y-2">
        <h2 className="text-xs font-medium uppercase tracking-wider text-ink-500">
          Categories
        </h2>
        <ul className="space-y-1 text-sm">
          <li>
            <button
              type="button"
              onClick={() => setActiveCat("all")}
              className={
                "w-full rounded px-2 py-1 text-left transition " +
                (activeCat === "all"
                  ? "bg-ink-100 font-medium text-ink-900"
                  : "text-ink-700 hover:bg-ink-50")
              }
            >
              All <span className="text-ink-500">({entries.length})</span>
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.name}>
              <button
                type="button"
                onClick={() => setActiveCat(c.name)}
                className={
                  "w-full rounded px-2 py-1 text-left transition " +
                  (activeCat === c.name
                    ? "bg-ink-100 font-medium text-ink-900"
                    : "text-ink-700 hover:bg-ink-50")
                }
              >
                {c.name} <span className="text-ink-500">({c.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section>
        <div className="mb-4">
          <input
            type="search"
            placeholder="Search by name, command, or summary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm focus:border-ink-400 focus:outline-none"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-md border border-dashed border-ink-200 p-8 text-center text-sm text-ink-500">
            {entries.length === 0
              ? "No LISP routines have been published yet. Check back after the library is seeded under customization/lisp/library/."
              : "No routines match your filter."}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filtered.map((r) => (
              <li key={r.name}>
                <Link
                  href={`/customization/lisp/${r.name}`}
                  className="block h-full rounded-lg border border-ink-100 p-4 transition hover:border-ink-300 hover:shadow-sm"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <code className="text-sm font-semibold text-ink-900">
                      {r.command}
                    </code>
                    <span className="rounded bg-ink-50 px-1.5 py-0.5 text-xs uppercase tracking-wider text-ink-600">
                      {r.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink-600">{r.summary}</p>
                  {r.appliesTo && r.appliesTo.length > 0 ? (
                    <p className="mt-3 text-xs text-ink-500">
                      {r.appliesTo.join(", ")}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
