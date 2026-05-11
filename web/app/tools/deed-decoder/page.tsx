"use client";

import { useState } from "react";
import Link from "next/link";
import DeedPlot from "@/components/DeedPlot";
import {
  parseDeedText,
  plotTraverse,
  type ParsedTraverse,
  type PlottedTraverse,
  type Course,
  type Bearing,
} from "@/lib/deed-decoder";

type Tab = "paste" | "upload" | "manual";

type ManualRow = {
  kind: "line" | "curve";
  bearing: string;
  distance: string;
  // curve fields
  direction: "left" | "right";
  radius: string;
  arc: string;
  chordBearing: string;
  chord: string;
};

const SAMPLE_DEED_PLACEHOLDER = `Beginning at the northeast corner of the Northwest Quarter of Section 12, Township 16 North, Range 3 East; thence South 00°15'30" West, 660.00 feet; thence North 89°47'12" West, 660.00 feet; thence North 00°15'30" East, 660.00 feet; thence South 89°47'12" East, 660.00 feet to the Point of Beginning.`;

function emptyManualRow(): ManualRow {
  return {
    kind: "line",
    bearing: "",
    distance: "",
    direction: "right",
    radius: "",
    arc: "",
    chordBearing: "",
    chord: "",
  };
}

// ---------- Bearing parser used only for the Manual tab. -----------
function parseManualBearing(raw: string): Bearing | null {
  const s = raw.trim().toUpperCase();
  if (!s) return null;
  // Accept e.g. "N 45 30 15 E", "N45-30-15E", "S 0 15 30 W"
  const m = s.match(
    /^([NS])\s*(\d+)[°\s\-:]?\s*(\d+)?[\s'\-:]?\s*([\d.]+)?["\s]*\s*([EW])$/i,
  );
  if (!m) return null;
  const ns = m[1] as "N" | "S";
  const deg = parseInt(m[2], 10);
  const min = m[3] ? parseInt(m[3], 10) : 0;
  const sec = m[4] ? parseFloat(m[4]) : 0;
  const ew = m[5] as "E" | "W";
  if (!Number.isFinite(deg) || deg < 0 || deg > 90) return null;
  const dms = deg + min / 60 + sec / 3600;
  let az: number;
  if (ns === "N" && ew === "E") az = dms;
  else if (ns === "S" && ew === "E") az = 180 - dms;
  else if (ns === "S" && ew === "W") az = 180 + dms;
  else az = 360 - dms;
  const quadrant = `${ns}${ew}` as "NE" | "NW" | "SE" | "SW";
  return {
    raw,
    quadrant,
    degrees: deg,
    minutes: min,
    seconds: sec,
    azimuthDeg: az,
  };
}

function quadrantString(b: Bearing): string {
  const ns = b.quadrant[0];
  const ew = b.quadrant[1];
  return `${ns} ${b.degrees}°${b.minutes.toString().padStart(2, "0")}'${b.seconds.toFixed(0).padStart(2, "0")}" ${ew}`;
}

function fmtNumber(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function coursesToCSV(courses: Course[]): string {
  const rows: string[] = [
    "index,type,bearing,distance_ft,curve_direction,radius_ft,arc_ft,chord_bearing,chord_ft",
  ];
  for (const c of courses) {
    if (c.type === "line") {
      rows.push(
        [
          c.index,
          "line",
          quadrantString(c.bearing),
          c.distanceFt.toFixed(2),
          "",
          "",
          "",
          "",
          "",
        ].join(","),
      );
    } else {
      rows.push(
        [
          c.index,
          "curve",
          "",
          "",
          c.direction,
          c.radiusFt.toFixed(2),
          c.arcLengthFt?.toFixed(2) ?? "",
          c.chordBearing ? quadrantString(c.chordBearing) : "",
          c.chordFt?.toFixed(2) ?? "",
        ].join(","),
      );
    }
  }
  return rows.join("\n");
}

export default function DeedDecoderPage() {
  const [tab, setTab] = useState<Tab>("paste");

  // Paste tab
  const [pasteText, setPasteText] = useState("");

  // Upload tab
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  // Manual tab
  const [manualRows, setManualRows] = useState<ManualRow[]>([
    emptyManualRow(),
  ]);

  // Shared results
  const [parsed, setParsed] = useState<ParsedTraverse | null>(null);
  const [plotted, setPlotted] = useState<PlottedTraverse | null>(null);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  function runParseAndPlot(text: string) {
    setParseError(null);
    let p: ParsedTraverse;
    try {
      p = parseDeedText(text);
    } catch (err) {
      setParseError(
        err instanceof Error ? err.message : "Failed to parse deed text.",
      );
      setParsed(null);
      setPlotted(null);
      return;
    }
    setParsed(p);

    try {
      setPlotted(plotTraverse(p));
    } catch (err) {
      setParseError(
        err instanceof Error ? err.message : "Failed to plot traverse.",
      );
      setPlotted(null);
    }
  }

  function plotFromManual() {
    setParseError(null);
    const courses: Course[] = [];
    let idx = 0;
    for (const row of manualRows) {
      if (row.kind === "line") {
        const b = parseManualBearing(row.bearing);
        const d = parseFloat(row.distance);
        if (!b || !Number.isFinite(d) || d <= 0) continue;
        courses.push({
          type: "line",
          bearing: b,
          distanceFt: d,
          raw: `${row.bearing} ${row.distance}`,
          index: idx++,
        });
      } else {
        const r = parseFloat(row.radius);
        const arc = parseFloat(row.arc);
        const chord = parseFloat(row.chord);
        const cb = parseManualBearing(row.chordBearing);
        if (!Number.isFinite(r) || r <= 0) continue;
        courses.push({
          type: "curve",
          direction: row.direction,
          radiusFt: r,
          arcLengthFt: Number.isFinite(arc) ? arc : undefined,
          chordFt: Number.isFinite(chord) ? chord : undefined,
          chordBearing: cb ?? undefined,
          raw: `curve r=${row.radius}`,
          index: idx++,
        });
      }
    }
    if (!courses.length) {
      setParseError("Enter at least one valid course.");
      return;
    }
    const parsedShape: ParsedTraverse = {
      courses,
      unparsed: [],
      normalizedText: "",
    };
    setParsed(parsedShape);
    try {
      setPlotted(plotTraverse(parsedShape));
    } catch (err) {
      setParseError(
        err instanceof Error ? err.message : "Failed to plot traverse.",
      );
    }
  }

  async function handleUploadDecode() {
    if (!uploadFile) {
      setUploadStatus("Choose a file first.");
      return;
    }
    if (uploadFile.size > 10 * 1024 * 1024) {
      setUploadStatus("File exceeds 10 MB.");
      return;
    }
    setUploadBusy(true);
    setUploadStatus("Decoding…");
    try {
      const fd = new FormData();
      fd.append("file", uploadFile);
      const res = await fetch("/api/deed-decode", {
        method: "POST",
        body: fd,
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setUploadStatus(body.message ?? `Server error ${res.status}.`);
        return;
      }
      setExtractedText(body.text ?? "");
      setUploadStatus(
        body.cached
          ? `Extracted (cached) using ${body.modelUsed}.`
          : `Extracted using ${body.modelUsed}.`,
      );
      // Auto-parse the extracted text.
      runParseAndPlot(body.text ?? "");
    } catch (err) {
      setUploadStatus(
        err instanceof Error ? err.message : "Network error.",
      );
    } finally {
      setUploadBusy(false);
    }
  }

  function copyCSV() {
    if (!parsed) return;
    void navigator.clipboard.writeText(coursesToCSV(parsed.courses));
  }

  const courses = parsed?.courses ?? [];
  const anomalies = plotted?.anomalies ?? [];
  const closure = plotted?.closure;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / Deed decoder
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Deed Decoder
        </h1>
        <p className="mt-2 max-w-3xl text-ink-600">
          Parse a metes-and-bounds legal description into bearings, distances,
          and curve calls, plot the traverse, and report closure error.
          Output is screening-level only; verify against the recorded
          document before stamping any survey or plat.
        </p>
        <p className="mt-2 text-xs text-ink-500">
          Reference:{" "}
          <Link
            href="/docs/field-and-boundary/legal-descriptions/deed-decoder-guide"
            className="underline hover:text-ink-800"
          >
            Deed decoder guide
          </Link>
        </p>
      </header>

      {/* ---------- Tabs ---------- */}
      <div className="mb-6 flex gap-2 border-b border-ink-100">
        {(
          [
            ["paste", "Paste deed text"],
            ["upload", "Upload PDF or image"],
            ["manual", "Manual entry"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={
              "px-3 py-2 text-sm font-medium transition " +
              (tab === id
                ? "border-b-2 border-ink-900 text-ink-900"
                : "text-ink-500 hover:text-ink-800")
            }
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "paste" && (
        <section className="space-y-4">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={SAMPLE_DEED_PLACEHOLDER}
            rows={10}
            className="w-full rounded-md border border-ink-200 p-3 font-mono text-sm outline-none focus:border-ink-400"
          />
          <div className="flex gap-3">
            <button
              onClick={() => runParseAndPlot(pasteText)}
              disabled={!pasteText.trim()}
              className="rounded-md bg-ink-900 px-5 py-1.5 text-sm font-medium text-white transition hover:bg-ink-700 disabled:opacity-40"
            >
              Parse
            </button>
            <button
              onClick={async () => {
                const r = await fetch("/fixtures/sample-deed.txt");
                const txt = await r.text();
                setPasteText(txt);
              }}
              className="rounded-md border border-ink-200 px-4 py-1.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
            >
              Load sample
            </button>
          </div>
        </section>
      )}

      {tab === "upload" && (
        <section className="space-y-4">
          <input
            type="file"
            accept="application/pdf,image/png,image/jpeg"
            onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
            className="block text-sm text-ink-700"
          />
          <p className="text-xs text-ink-500">
            Max 10 MB. PDF, PNG, or JPEG. Sent to the operator&apos;s
            Anthropic key under a daily spend cap and a per-IP rate limit.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleUploadDecode}
              disabled={!uploadFile || uploadBusy}
              className="rounded-md bg-ink-900 px-5 py-1.5 text-sm font-medium text-white transition hover:bg-ink-700 disabled:opacity-40"
            >
              {uploadBusy ? "Working…" : "Decode"}
            </button>
          </div>
          {uploadStatus && (
            <p className="text-sm text-ink-600">{uploadStatus}</p>
          )}
          {extractedText !== "" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-ink-700">
                Extracted text (edit and re-parse if OCR missed anything)
              </label>
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                rows={10}
                className="w-full rounded-md border border-ink-200 p-3 font-mono text-sm outline-none focus:border-ink-400"
              />
              <button
                onClick={() => runParseAndPlot(extractedText)}
                className="rounded-md border border-ink-200 px-4 py-1.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
              >
                Re-parse
              </button>
            </div>
          )}
        </section>
      )}

      {tab === "manual" && (
        <section className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-ink-600">
                  <th className="pb-2 pr-3 font-medium">#</th>
                  <th className="pb-2 pr-3 font-medium">Type</th>
                  <th className="pb-2 pr-3 font-medium">Bearing</th>
                  <th className="pb-2 pr-3 font-medium">Distance / Arc (ft)</th>
                  <th className="pb-2 pr-3 font-medium">Radius (ft)</th>
                  <th className="pb-2 pr-3 font-medium">Chord (ft)</th>
                  <th className="pb-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {manualRows.map((row, i) => (
                  <tr key={i} className="border-b border-ink-50">
                    <td className="py-1.5 pr-3 text-ink-500">{i + 1}</td>
                    <td className="py-1.5 pr-3">
                      <select
                        value={row.kind}
                        onChange={(e) =>
                          setManualRows((prev) => {
                            const next = [...prev];
                            next[i] = {
                              ...next[i],
                              kind: e.target.value as "line" | "curve",
                            };
                            return next;
                          })
                        }
                        className="rounded-md border border-ink-200 px-2 py-1 text-sm"
                      >
                        <option value="line">Line</option>
                        <option value="curve">Curve</option>
                      </select>
                    </td>
                    <td className="py-1.5 pr-3">
                      <input
                        type="text"
                        placeholder={
                          row.kind === "line"
                            ? "N 45 30 15 E"
                            : "chord brg"
                        }
                        value={
                          row.kind === "line"
                            ? row.bearing
                            : row.chordBearing
                        }
                        onChange={(e) =>
                          setManualRows((prev) => {
                            const next = [...prev];
                            if (row.kind === "line") {
                              next[i] = { ...next[i], bearing: e.target.value };
                            } else {
                              next[i] = {
                                ...next[i],
                                chordBearing: e.target.value,
                              };
                            }
                            return next;
                          })
                        }
                        className="w-36 rounded-md border border-ink-200 px-2 py-1 text-sm font-mono"
                      />
                    </td>
                    <td className="py-1.5 pr-3">
                      <input
                        type="number"
                        step="any"
                        value={row.kind === "line" ? row.distance : row.arc}
                        onChange={(e) =>
                          setManualRows((prev) => {
                            const next = [...prev];
                            if (row.kind === "line") {
                              next[i] = {
                                ...next[i],
                                distance: e.target.value,
                              };
                            } else {
                              next[i] = { ...next[i], arc: e.target.value };
                            }
                            return next;
                          })
                        }
                        className="w-24 rounded-md border border-ink-200 px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="py-1.5 pr-3">
                      <input
                        type="number"
                        step="any"
                        disabled={row.kind === "line"}
                        value={row.radius}
                        onChange={(e) =>
                          setManualRows((prev) => {
                            const next = [...prev];
                            next[i] = { ...next[i], radius: e.target.value };
                            return next;
                          })
                        }
                        className="w-24 rounded-md border border-ink-200 px-2 py-1 text-sm disabled:bg-ink-50"
                      />
                    </td>
                    <td className="py-1.5 pr-3">
                      <input
                        type="number"
                        step="any"
                        disabled={row.kind === "line"}
                        value={row.chord}
                        onChange={(e) =>
                          setManualRows((prev) => {
                            const next = [...prev];
                            next[i] = { ...next[i], chord: e.target.value };
                            return next;
                          })
                        }
                        className="w-24 rounded-md border border-ink-200 px-2 py-1 text-sm disabled:bg-ink-50"
                      />
                    </td>
                    <td className="py-1.5">
                      <button
                        onClick={() =>
                          setManualRows((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          )
                        }
                        className="text-xs text-ink-400 hover:text-ink-700"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() =>
                setManualRows((prev) => [...prev, emptyManualRow()])
              }
              className="rounded-md border border-ink-200 px-4 py-1.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
            >
              Add row
            </button>
            <button
              onClick={() => plotFromManual()}
              className="rounded-md bg-ink-900 px-5 py-1.5 text-sm font-medium text-white transition hover:bg-ink-700"
            >
              Plot
            </button>
          </div>
        </section>
      )}

      {parseError && (
        <p className="mt-6 rounded-md bg-rose-50 p-3 text-sm text-rose-800">
          {parseError}
        </p>
      )}

      {parsed && (
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-ink-100 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">Parsed courses</h2>
              <button
                onClick={copyCSV}
                className="rounded-md border border-ink-200 px-3 py-1 text-xs font-medium text-ink-700 transition hover:bg-ink-50"
              >
                Copy as CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-ink-200 text-ink-600">
                    <th className="pb-2 pr-2 font-medium">#</th>
                    <th className="pb-2 pr-2 font-medium">Type</th>
                    <th className="pb-2 pr-2 font-medium">Bearing</th>
                    <th className="pb-2 pr-2 font-medium">Distance</th>
                    <th className="pb-2 font-medium">Curve</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {courses.map((c) => (
                    <tr
                      key={c.index}
                      onMouseEnter={() => setHighlighted(c.index)}
                      onMouseLeave={() => setHighlighted(null)}
                      className={
                        "cursor-default border-b border-ink-50 " +
                        (highlighted === c.index ? "bg-ink-50" : "")
                      }
                    >
                      <td className="py-1 pr-2 text-ink-500">{c.index + 1}</td>
                      <td className="py-1 pr-2">{c.type}</td>
                      <td className="py-1 pr-2">
                        {c.type === "line"
                          ? quadrantString(c.bearing)
                          : c.chordBearing
                            ? quadrantString(c.chordBearing)
                            : "—"}
                      </td>
                      <td className="py-1 pr-2">
                        {c.type === "line"
                          ? fmtNumber(c.distanceFt) + " ft"
                          : c.arcLengthFt
                            ? fmtNumber(c.arcLengthFt) + " ft"
                            : c.chordFt
                              ? fmtNumber(c.chordFt) + " ft"
                              : "—"}
                      </td>
                      <td className="py-1">
                        {c.type === "curve"
                          ? `${c.direction}, r=${fmtNumber(c.radiusFt)}`
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsed.unparsed.length > 0 && (
              <p className="mt-2 text-xs text-ink-500">
                {parsed.unparsed.length} unparsed segment(s) — review the raw
                text.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-ink-100 p-4">
            <h2 className="mb-3 text-base font-semibold">Plot</h2>
            {plotted ? (
              <DeedPlot plotted={plotted} />
            ) : (
              <p className="text-sm text-ink-500">
                No plot available — parsing did not produce a traverse.
              </p>
            )}
          </div>
        </section>
      )}

      {closure && (
        <section className="mt-6 rounded-lg border border-ink-100 p-4">
          <h2 className="mb-3 text-base font-semibold">Closure summary</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm md:grid-cols-4">
            <div>
              <dt className="text-ink-500">Perimeter</dt>
              <dd className="font-mono">{fmtNumber(closure.perimeterFt)} ft</dd>
            </div>
            <div>
              <dt className="text-ink-500">Linear closure</dt>
              <dd className="font-mono">
                {fmtNumber(closure.linearClosureFt, 3)} ft
              </dd>
            </div>
            <div>
              <dt className="text-ink-500">Precision</dt>
              <dd className="font-mono">
                1 :{" "}
                {closure.precisionRatio > 0
                  ? Math.round(closure.precisionRatio).toLocaleString()
                  : "∞"}
              </dd>
            </div>
            <div>
              <dt className="text-ink-500">Area</dt>
              <dd className="font-mono">
                {fmtNumber(closure.areaSqFt, 0)} sq ft ·{" "}
                {fmtNumber(closure.areaAcres, 4)} ac
              </dd>
            </div>
          </dl>
        </section>
      )}

      {anomalies.length > 0 && (
        <section className="mt-6 rounded-lg border border-ink-100 p-4">
          <h2 className="mb-3 text-base font-semibold">Anomalies</h2>
          <ul className="space-y-1 text-sm">
            {anomalies.map((a, i) => (
              <li
                key={i}
                className={
                  "rounded-md px-2 py-1 " +
                  (a.severity === "error"
                    ? "bg-rose-50 text-rose-800"
                    : a.severity === "warning"
                      ? "bg-amber-50 text-amber-800"
                      : "bg-ink-50 text-ink-700")
                }
              >
                <span className="mr-2 font-medium uppercase tracking-wide">
                  {a.severity}
                </span>
                {a.message}
                {typeof a.courseIndex === "number"
                  ? ` (course ${a.courseIndex + 1})`
                  : ""}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
