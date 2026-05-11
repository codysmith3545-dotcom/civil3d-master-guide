"use client";

import { diffJurisdictions, type JurisdictionPage } from "@/lib/jurisdictions-types";

export function JurisdictionDelta({
  from,
  to,
}: {
  from: JurisdictionPage;
  to: JurisdictionPage;
}) {
  const rows = diffJurisdictions(from, to);
  const fromName = from.breadcrumb[from.breadcrumb.length - 1];
  const toName = to.breadcrumb[to.breadcrumb.length - 1];

  if (rows.length === 0) {
    return (
      <p className="text-sm text-ink-500">
        No differences in the typed fields between {fromName} and {toName}.
        Either the values match, or neither page has structured data filled in
        yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <p className="text-sm text-ink-700">
        When you cross from <strong>{fromName}</strong> to{" "}
        <strong>{toName}</strong>, these things change:
      </p>
      <table className="mt-2 w-full text-sm">
        <thead>
          <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wider text-ink-500">
            <th className="py-2 pr-4">Rule</th>
            <th className="py-2 pr-4">{fromName}</th>
            <th className="py-2 pr-4">{toName}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-ink-100">
              <td className="py-2 pr-4 text-ink-600">{r.label}</td>
              <td className="py-2 pr-4">
                {format(r.from)}
              </td>
              <td className="py-2 pr-4 bg-yellow-50">
                {format(r.to)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function format(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}
