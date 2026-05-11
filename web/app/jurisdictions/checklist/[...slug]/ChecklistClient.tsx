"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  source?: string;
};

export function ChecklistClient({
  slug,
  items,
}: {
  slug: string;
  items: Item[];
}) {
  const storageKey = `jurisdictions:checklist:${slug}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      // ignore
    }
  }, [checked, loaded, storageKey]);

  if (items.length === 0) {
    return (
      <p className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-ink-700">
        No submittal checklist has been recorded for this jurisdiction yet.
        Check the parent county page, or contact the reviewing department for
        the current submittal items.
      </p>
    );
  }

  const completed = items.filter((it) => checked[it.id]).length;

  return (
    <div>
      <div className="flex items-center justify-between print:hidden">
        <p className="text-sm text-ink-600">
          {completed} of {items.length} complete
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setChecked({})}
            className="btn"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-primary"
          >
            Print
          </button>
        </div>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((it) => (
          <li
            key={it.id}
            className="flex items-start gap-3 rounded-md border border-ink-100 p-3"
          >
            <input
              id={`cb-${it.id}`}
              type="checkbox"
              checked={!!checked[it.id]}
              onChange={(e) =>
                setChecked((c) => ({ ...c, [it.id]: e.target.checked }))
              }
              className="mt-1 h-4 w-4"
            />
            <label htmlFor={`cb-${it.id}`} className="flex-1 cursor-pointer">
              <div className="text-sm font-medium text-ink-900">
                {it.label}
                {it.required ? (
                  <span className="ml-2 text-xs font-normal text-red-700">
                    required
                  </span>
                ) : null}
              </div>
              {it.description ? (
                <div className="mt-1 text-xs text-ink-600">{it.description}</div>
              ) : null}
              {it.source ? (
                <div className="mt-1 text-xs text-ink-400">
                  Source: {it.source}
                </div>
              ) : null}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
