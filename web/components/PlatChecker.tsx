"use client";

import { useEffect, useState } from "react";
import type { ProjectDocument } from "@/lib/project-backend";

export type PlatCheckItem = {
  id: string;
  label: string;
  status: "pass" | "fail" | "needs-review";
  rationale: string;
};

export type PlatCheckReport = {
  evaluatedAt: string;
  items: PlatCheckItem[];
};

export function PlatChecker({
  projectId,
  jurisdictionSlug,
}: {
  projectId: string;
  jurisdictionSlug: string;
}) {
  const [docs, setDocs] = useState<ProjectDocument[] | null>(null);
  const [docsError, setDocsError] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string>("");
  const [report, setReport] = useState<PlatCheckReport | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/projects/${projectId}/documents`)
      .then(async (res) => {
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as {
            message?: string;
          };
          throw new Error(
            body.message ?? `Failed to list documents (${res.status}).`,
          );
        }
        const json = (await res.json()) as { items: ProjectDocument[] };
        if (!cancelled) {
          setDocs(json.items ?? []);
          if (json.items?.[0]) setDocumentId(json.items[0].id);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setDocsError(err instanceof Error ? err.message : "Network error.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  async function run() {
    if (!documentId) {
      setError("Pick a document first.");
      return;
    }
    setRunning(true);
    setError(null);
    setReport(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/plat-check`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ documentId, jurisdictionSlug }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        setError(body.message ?? `Plat check failed (${res.status}).`);
        return;
      }
      setReport((await res.json()) as PlatCheckReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-ink-100 bg-white p-4">
        <h3 className="text-sm font-semibold text-ink-900">Plat checker</h3>
        <p className="mt-1 text-xs text-ink-600">
          Score a plat document against{" "}
          <span className="font-mono">{jurisdictionSlug}</span>&apos;s submittal
          checklist and plat-requirements rules.
        </p>

        {docsError ? (
          <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-2 text-xs text-amber-900">
            {docsError}
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap items-end gap-2">
          <label className="flex-1 min-w-[200px]">
            <span className="block text-xs font-medium text-ink-700">
              Plat document
            </span>
            <select
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              className="mt-1 w-full rounded-md border border-ink-200 px-2 py-1.5 text-sm"
              disabled={!docs || docs.length === 0}
            >
              {!docs ? (
                <option>Loading…</option>
              ) : docs.length === 0 ? (
                <option>No documents yet</option>
              ) : (
                docs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.filename}
                  </option>
                ))
              )}
            </select>
          </label>
          <button
            type="button"
            disabled={!documentId || running}
            onClick={() => void run()}
            className="btn btn-primary disabled:opacity-50"
          >
            {running ? "Checking…" : "Run check"}
          </button>
        </div>

        {error ? (
          <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-2 text-xs text-amber-900">
            {error}
          </div>
        ) : null}
      </div>

      {report ? <Report report={report} /> : null}
    </div>
  );
}

function Report({ report }: { report: PlatCheckReport }) {
  const counts = report.items.reduce(
    (acc, it) => {
      acc[it.status] = (acc[it.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="rounded-md border border-ink-100 bg-white p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink-900">Result</h3>
        <p className="text-xs text-ink-500">
          Evaluated {new Date(report.evaluatedAt).toLocaleString()}
        </p>
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-xs">
        <Badge label="pass" count={counts.pass ?? 0} />
        <Badge label="needs review" count={counts["needs-review"] ?? 0} />
        <Badge label="fail" count={counts.fail ?? 0} />
      </div>
      <ul className="mt-3 space-y-2">
        {report.items.map((item) => (
          <li
            key={item.id}
            className="rounded-md border border-ink-100 px-3 py-2 text-sm"
          >
            <div className="flex items-start gap-2">
              <StatusPill status={item.status} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink-900">{item.label}</p>
                <p className="mt-1 text-xs text-ink-600">{item.rationale}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Badge({ label, count }: { label: string; count: number }) {
  return (
    <span className="rounded-full border border-ink-200 px-2 py-0.5 text-ink-700">
      <span className="font-semibold">{count}</span> {label}
    </span>
  );
}

function StatusPill({ status }: { status: PlatCheckItem["status"] }) {
  const map: Record<PlatCheckItem["status"], string> = {
    pass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    fail: "bg-red-100 text-red-800 border-red-200",
    "needs-review": "bg-amber-100 text-amber-800 border-amber-200",
  };
  const label =
    status === "needs-review" ? "Needs review" : status.toUpperCase();
  return (
    <span
      className={`mt-0.5 inline-block flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${map[status]}`}
    >
      {label}
    </span>
  );
}
