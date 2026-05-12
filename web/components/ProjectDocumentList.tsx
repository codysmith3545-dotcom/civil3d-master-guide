"use client";

import { useState } from "react";
import type { ProjectDocument } from "@/lib/project-backend";

export default function ProjectDocumentList({
  projectId,
  initialDocuments,
}: {
  projectId: string;
  initialDocuments: ProjectDocument[];
}) {
  const [docs, setDocs] = useState<ProjectDocument[]>(initialDocuments);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Drag-to-reorder (purely cosmetic in v1; persistence is the schema
  // agent's call once a sort-order column exists).
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function onDragStart(i: number) {
    setDragIndex(i);
  }

  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === i) return;
    setDocs((cur) => {
      const next = [...cur];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(i, 0, moved);
      return next;
    });
    setDragIndex(i);
  }

  function onDragEnd() {
    setDragIndex(null);
  }

  async function onDelete(doc: ProjectDocument) {
    if (
      !window.confirm(`Delete "${doc.filename}"? This cannot be undone.`)
    ) {
      return;
    }
    setBusyId(doc.id);
    setError(null);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/documents/${doc.id}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        setError(body.message ?? `Delete failed (${res.status}).`);
      } else {
        setDocs((cur) => cur.filter((d) => d.id !== doc.id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setBusyId(null);
    }
  }

  async function onReprocess(doc: ProjectDocument) {
    setBusyId(doc.id);
    setError(null);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/documents/${doc.id}/reprocess`,
        { method: "POST" },
      );
      if (!res.ok) {
        // Fall back to re-call of the upload endpoint with a hint.
        const fallback = await fetch(
          `/api/projects/${projectId}/documents/upload`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ reprocessDocumentId: doc.id }),
          },
        );
        if (!fallback.ok) {
          const body = (await fallback.json().catch(() => ({}))) as {
            message?: string;
          };
          setError(body.message ?? `Re-process failed (${fallback.status}).`);
        } else {
          markStatus(doc.id, "processing");
        }
      } else {
        markStatus(doc.id, "processing");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setBusyId(null);
    }
  }

  function markStatus(id: string, status: string) {
    setDocs((cur) =>
      cur.map((d) => (d.id === id ? { ...d, status } : d)),
    );
  }

  if (docs.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-ink-200 p-4 text-center text-xs text-ink-500">
        No documents yet. Drop files in the upload box above.
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <div className="mb-2 rounded-md border border-amber-300 bg-amber-50 p-2 text-xs text-amber-900">
          {error}
        </div>
      ) : null}
      <ul className="space-y-1.5">
        {docs.map((d, i) => (
          <li
            key={d.id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDragEnd={onDragEnd}
            className="group flex items-start gap-2 rounded-md border border-ink-100 bg-white px-3 py-2 text-sm"
          >
            <span
              aria-hidden
              className="mt-0.5 cursor-grab select-none text-ink-400"
              title="Drag to reorder"
            >
              ⋮⋮
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-ink-900">
                {d.filename}
              </div>
              <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-ink-500">
                {typeof d.size === "number" ? (
                  <span>{formatBytes(d.size)}</span>
                ) : null}
                {d.status ? (
                  <span>
                    <StatusDot status={d.status} /> {d.status}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="hidden flex-shrink-0 gap-1 group-hover:flex">
              <button
                type="button"
                disabled={busyId === d.id}
                onClick={() => onReprocess(d)}
                className="btn px-2 py-0.5 text-xs disabled:opacity-50"
                title="Re-process this document"
              >
                Re-process
              </button>
              <button
                type="button"
                disabled={busyId === d.id}
                onClick={() => onDelete(d)}
                className="btn px-2 py-0.5 text-xs disabled:opacity-50"
                title="Delete"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const cls =
    status === "ready"
      ? "bg-emerald-500"
      : status === "failed"
        ? "bg-red-500"
        : status === "processing" || status === "pending"
          ? "bg-amber-500"
          : "bg-ink-300";
  return (
    <span
      aria-hidden
      className={`mr-1 inline-block h-2 w-2 rounded-full align-middle ${cls}`}
    />
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
