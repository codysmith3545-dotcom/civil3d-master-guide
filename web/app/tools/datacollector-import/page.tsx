"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  detectFormat,
  exportCsv,
  exportLandXML,
  exportPnezd,
  importText,
  type DcCsvColumn,
  type DcFormat,
  type DcImportResult,
  type DcPoint,
} from "@civil3d-master-guide/datacollector-import";

type Tab = "paste" | "upload" | "manual";

const FORMAT_OPTIONS: { value: DcFormat | "auto"; label: string }[] = [
  { value: "auto", label: "Auto-detect" },
  { value: "generic-pnezd", label: "Generic PNEZD" },
  { value: "generic-nezd", label: "Generic NEZD" },
  { value: "generic-pxyz", label: "Generic PXYZ" },
  { value: "trimble-csv", label: "Trimble CSV" },
  { value: "topcon-csv", label: "Topcon CSV" },
  { value: "carlson-rw5", label: "Carlson RW5" },
];

const EMPTY_POINT: DcPoint = {
  number: "",
  northing: 0,
  easting: 0,
  elevation: 0,
  description: "",
};

function downloadFile(filename: string, text: string, mime = "text/plain") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function DataCollectorImportPage() {
  const [tab, setTab] = useState<Tab>("paste");

  // Paste-tab state
  const [pasteText, setPasteText] = useState<string>(
    "1,5000.000,5000.000,800.000,IPF\n2,5100.123,5050.456,801.250,REBAR\n",
  );
  const [pasteFormat, setPasteFormat] = useState<DcFormat | "auto">("auto");

  // Upload-tab state
  const [uploadFilename, setUploadFilename] = useState<string>("");
  const [uploadFormat, setUploadFormat] = useState<DcFormat | "auto">("auto");
  const [uploadStatus, setUploadStatus] = useState<string>("");

  // Manual-tab state
  const [manualPoints, setManualPoints] = useState<DcPoint[]>([
    { ...EMPTY_POINT, number: "1" },
  ]);

  // Result state (shared across tabs)
  const [result, setResult] = useState<DcImportResult | null>(null);
  const [error, setError] = useState<string>("");

  const points: DcPoint[] = useMemo(() => {
    if (tab === "manual") return manualPoints;
    return result?.points ?? [];
  }, [tab, manualPoints, result]);

  function handlePasteParse() {
    setError("");
    setResult(null);
    try {
      const fmt =
        pasteFormat === "auto" ? detectFormat(pasteText) : pasteFormat;
      if (fmt === "unknown") {
        setError(
          "Could not auto-detect format from the pasted text. Pick a format manually.",
        );
        return;
      }
      setResult(importText(pasteText, fmt as DcFormat));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function handleUpload(file: File | null) {
    setError("");
    setResult(null);
    if (!file) return;
    setUploadFilename(file.name);
    setUploadStatus("Uploading...");
    try {
      const form = new FormData();
      form.append("file", file);
      if (uploadFormat !== "auto") form.append("format", uploadFormat);
      const res = await fetch("/api/datacollector-import", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? `HTTP ${res.status}`);
        setUploadStatus("");
        return;
      }
      setResult(data as DcImportResult);
      setUploadStatus(`Parsed ${data.points.length} point(s).`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setUploadStatus("");
    }
  }

  function handleManualChange(idx: number, field: keyof DcPoint, value: string) {
    setManualPoints((prev) => {
      const next = [...prev];
      const row = { ...next[idx]! };
      if (field === "northing" || field === "easting" || field === "elevation") {
        const n = Number(value);
        (row as Record<string, unknown>)[field] = Number.isFinite(n) ? n : 0;
      } else {
        (row as Record<string, unknown>)[field] = value;
      }
      next[idx] = row;
      return next;
    });
  }

  function handleManualAdd() {
    setManualPoints((prev) => [
      ...prev,
      { ...EMPTY_POINT, number: String(prev.length + 1) },
    ]);
  }

  function handleManualRemove(idx: number) {
    setManualPoints((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleExport(kind: "pnezd" | "nezd" | "landxml") {
    if (points.length === 0) {
      setError("No points to export.");
      return;
    }
    if (kind === "pnezd") {
      downloadFile("points.pnezd.csv", exportPnezd(points), "text/csv");
    } else if (kind === "nezd") {
      const cols: DcCsvColumn[] = ["N", "E", "Z", "D"];
      downloadFile("points.nezd.csv", exportCsv(points, cols), "text/csv");
    } else {
      downloadFile("points.xml", exportLandXML(points), "application/xml");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / Data-Collector Import
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Data-Collector File Importer
        </h1>
        <p className="mt-2 max-w-3xl text-ink-600">
          Convert points between common surveying data-collector ASCII formats
          (PNEZD, NEZD, PXYZ, Trimble CSV, Topcon CSV, Carlson RW5). Binary
          formats (.crd, .crdb, .job, .dc) are out of scope — export to CSV from
          your collector first. See{" "}
          <Link
            href="/docs/civil3d/points/datacollector-formats"
            className="underline"
          >
            the format guide
          </Link>
          .
        </p>
      </header>

      <div className="mb-6 flex gap-2 border-b border-ink-100">
        {(["paste", "upload", "manual"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTab(t);
              setError("");
            }}
            className={
              "px-4 py-2 text-sm font-medium " +
              (tab === t
                ? "border-b-2 border-ink-900 text-ink-900"
                : "text-ink-500 hover:text-ink-800")
            }
          >
            {t === "paste"
              ? "Paste text"
              : t === "upload"
                ? "Upload file"
                : "Manual entry"}
          </button>
        ))}
      </div>

      {tab === "paste" && (
        <section className="rounded-lg border border-ink-100 p-6">
          <label className="mb-2 block text-sm font-medium">
            Paste collector text
          </label>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            spellCheck={false}
            rows={10}
            className="block w-full rounded-md border border-ink-200 px-2 py-1.5 font-mono text-xs"
          />

          <div className="mt-3 flex flex-wrap items-end gap-3">
            <label className="text-sm">
              <span className="mr-2">Format</span>
              <select
                value={pasteFormat}
                onChange={(e) =>
                  setPasteFormat(e.target.value as DcFormat | "auto")
                }
                className="rounded-md border border-ink-200 bg-white px-2 py-1.5 text-sm"
              >
                {FORMAT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handlePasteParse}
              className="rounded-md bg-ink-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-ink-700"
            >
              Detect &amp; parse
            </button>
          </div>
        </section>
      )}

      {tab === "upload" && (
        <section className="rounded-lg border border-ink-100 p-6">
          <input
            type="file"
            accept=".csv,.txt,.rw5,.asc,.pnt,.nez"
            onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
            className="block text-sm"
          />
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <label className="text-sm">
              <span className="mr-2">Format</span>
              <select
                value={uploadFormat}
                onChange={(e) =>
                  setUploadFormat(e.target.value as DcFormat | "auto")
                }
                className="rounded-md border border-ink-200 bg-white px-2 py-1.5 text-sm"
              >
                {FORMAT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            {uploadFilename ? (
              <span className="text-xs text-ink-500">
                {uploadFilename} {uploadStatus ? `— ${uploadStatus}` : ""}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-ink-500">
            Binary formats are not parsed in the browser. The server returns an
            error with a link to export instructions.
          </p>
        </section>
      )}

      {tab === "manual" && (
        <section className="rounded-lg border border-ink-100 p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs uppercase text-ink-500">
                <th className="px-2 py-1">#</th>
                <th className="px-2 py-1">Northing</th>
                <th className="px-2 py-1">Easting</th>
                <th className="px-2 py-1">Elev</th>
                <th className="px-2 py-1">Description</th>
                <th className="px-2 py-1"></th>
              </tr>
            </thead>
            <tbody>
              {manualPoints.map((p, i) => (
                <tr key={i} className="border-b border-ink-50">
                  <td className="px-1 py-1">
                    <input
                      value={p.number}
                      onChange={(e) =>
                        handleManualChange(i, "number", e.target.value)
                      }
                      className="w-16 rounded border border-ink-200 px-1.5 py-1 text-sm"
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      type="number"
                      step="any"
                      value={p.northing}
                      onChange={(e) =>
                        handleManualChange(i, "northing", e.target.value)
                      }
                      className="w-28 rounded border border-ink-200 px-1.5 py-1 text-sm"
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      type="number"
                      step="any"
                      value={p.easting}
                      onChange={(e) =>
                        handleManualChange(i, "easting", e.target.value)
                      }
                      className="w-28 rounded border border-ink-200 px-1.5 py-1 text-sm"
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      type="number"
                      step="any"
                      value={p.elevation}
                      onChange={(e) =>
                        handleManualChange(i, "elevation", e.target.value)
                      }
                      className="w-24 rounded border border-ink-200 px-1.5 py-1 text-sm"
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      value={p.description}
                      onChange={(e) =>
                        handleManualChange(i, "description", e.target.value)
                      }
                      className="w-full rounded border border-ink-200 px-1.5 py-1 text-sm"
                    />
                  </td>
                  <td className="px-1 py-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleManualRemove(i)}
                      className="text-xs text-ink-500 hover:text-red-600"
                      aria-label={`Remove row ${i + 1}`}
                    >
                      remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={handleManualAdd}
            className="mt-3 rounded border border-ink-200 px-3 py-1 text-xs hover:bg-ink-50"
          >
            + Add row
          </button>
        </section>
      )}

      {error ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {points.length > 0 ? (
        <section className="mt-8 rounded-lg border border-ink-100 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {points.length} point{points.length === 1 ? "" : "s"}
              {result ? ` (${result.format})` : ""}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleExport("pnezd")}
                className="rounded-md border border-ink-300 px-3 py-1.5 text-xs hover:bg-ink-50"
              >
                Export PNEZD
              </button>
              <button
                type="button"
                onClick={() => handleExport("nezd")}
                className="rounded-md border border-ink-300 px-3 py-1.5 text-xs hover:bg-ink-50"
              >
                Export NEZD
              </button>
              <button
                type="button"
                onClick={() => handleExport("landxml")}
                className="rounded-md border border-ink-300 px-3 py-1.5 text-xs hover:bg-ink-50"
              >
                Export LandXML
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-ink-100 text-left text-ink-500">
                  <th className="px-2 py-1">#</th>
                  <th className="px-2 py-1">Northing</th>
                  <th className="px-2 py-1">Easting</th>
                  <th className="px-2 py-1">Elev</th>
                  <th className="px-2 py-1">Description</th>
                  <th className="px-2 py-1">Notes</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {points.map((p, i) => (
                  <tr key={i} className="border-b border-ink-50">
                    <td className="px-2 py-1">{p.number}</td>
                    <td className="px-2 py-1">{p.northing.toFixed(3)}</td>
                    <td className="px-2 py-1">{p.easting.toFixed(3)}</td>
                    <td className="px-2 py-1">{p.elevation.toFixed(3)}</td>
                    <td className="px-2 py-1">{p.description}</td>
                    <td className="px-2 py-1 text-ink-500">{p.notes ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {result && result.warnings.length > 0 ? (
            <div className="mt-4 rounded-md bg-ink-50 p-3 text-xs">
              <div className="mb-1 font-medium text-ink-700">
                Warnings ({result.warnings.length})
              </div>
              <ul className="list-inside list-disc space-y-0.5 text-ink-600">
                {result.warnings.slice(0, 25).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
                {result.warnings.length > 25 ? (
                  <li className="text-ink-400">
                    ...and {result.warnings.length - 25} more
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
