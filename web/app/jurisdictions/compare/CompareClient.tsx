"use client";

import { useMemo, useState } from "react";
import {
  COMPARE_ROWS,
  type JurisdictionFrontmatter,
} from "@/lib/jurisdictions-types";

export type CompareJurisdiction = {
  slug: string;
  title: string;
  breadcrumb: string[];
  fm: Pick<
    JurisdictionFrontmatter,
    | "setbacks"
    | "stormwater_thresholds"
    | "recording_requirements"
    | "plat_requirements"
  >;
};

export function CompareClient({ items }: { items: CompareJurisdiction[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  const picked = useMemo(
    () =>
      selected
        .map((s) => items.find((it) => it.slug === s))
        .filter(Boolean) as CompareJurisdiction[],
    [selected, items],
  );

  return (
    <div>
      <div className="rounded-lg border border-ink-100 p-4 print:hidden">
        <label className="text-sm font-medium text-ink-700">
          Select jurisdictions to compare
        </label>
        <select
          multiple
          value={selected}
          onChange={(e) => {
            const opts = Array.from(e.target.selectedOptions).map((o) => o.value);
            setSelected(opts);
          }}
          className="mt-2 block h-48 w-full rounded-md border border-ink-200 px-2 py-1 text-sm"
        >
          {items.map((j) => (
            <option key={j.slug} value={j.slug}>
              {j.breadcrumb.join(" > ")}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-ink-500">
          Hold Ctrl/Cmd to select multiple.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setSelected([])}
            className="btn"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn"
            disabled={picked.length === 0}
          >
            Print
          </button>
        </div>
      </div>

      <CompareMatrix items={picked} />
    </div>
  );
}

export function CompareMatrix({ items }: { items: CompareJurisdiction[] }) {
  if (items.length === 0) {
    return (
      <p className="mt-6 text-sm text-ink-500 print:hidden">
        Choose at least one jurisdiction above.
      </p>
    );
  }
  const first = items[0];
  return (
    <div className="mt-6 overflow-x-auto" data-testid="compare-matrix">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-ink-200 text-left">
            <th className="py-2 pr-4 text-xs uppercase tracking-wider text-ink-500">
              Rule
            </th>
            {items.map((it) => (
              <th key={it.slug} className="py-2 pr-4">
                <div className="font-medium text-ink-900">{it.title}</div>
                <div className="text-xs text-ink-500">
                  {it.breadcrumb.join(" > ")}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map((row) => {
            const baseVal = row.get(first.fm as JurisdictionFrontmatter);
            return (
              <tr key={row.key} className="border-b border-ink-100">
                <td className="py-2 pr-4 text-ink-600">{row.label}</td>
                {items.map((it, idx) => {
                  const v = row.get(it.fm as JurisdictionFrontmatter);
                  const differs = idx > 0 && !sameValue(baseVal, v);
                  return (
                    <td
                      key={it.slug}
                      className={
                        differs
                          ? "py-2 pr-4 bg-yellow-50 print:bg-transparent print:font-semibold"
                          : "py-2 pr-4"
                      }
                    >
                      {format(v)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function sameValue(a: unknown, b: unknown): boolean {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

function format(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}
