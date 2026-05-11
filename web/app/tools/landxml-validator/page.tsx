"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  parseLandXml,
  summarize,
  emitCanonical,
  LandXmlParseError,
  type LandXmlSummary,
  type ValidationIssue,
} from "@civil3d-master-guide/landxml-validator";

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<LandXML version="1.2">
  <Units>
    <Imperial linearUnit="USSurveyFoot" areaUnit="squareFoot"/>
  </Units>
  <Application name="Civil 3D" version="2025" manufacturer="Autodesk"/>
  <Surfaces>
    <Surface name="EG">
      <Definition surfType="TIN">
        <Pnts>
          <P id="1">100 100 800</P>
          <P id="2">100 200 802</P>
          <P id="3">200 100 805</P>
        </Pnts>
        <Faces>
          <F>1 2 3</F>
        </Faces>
      </Definition>
    </Surface>
  </Surfaces>
</LandXML>`;

interface AnalyzeResult {
  summary?: LandXmlSummary;
  parseError?: string;
  cleaned?: string;
}

function analyze(xml: string): AnalyzeResult {
  try {
    const root = parseLandXml(xml);
    const summary = summarize(root);
    const cleaned = emitCanonical(root);
    return { summary, cleaned };
  } catch (err) {
    if (err instanceof LandXmlParseError) {
      return { parseError: err.message };
    }
    return {
      parseError: err instanceof Error ? err.message : String(err),
    };
  }
}

function severityClass(sev: ValidationIssue["severity"]): string {
  if (sev === "error") return "border-red-300 bg-red-50 text-red-900";
  if (sev === "warning") return "border-amber-300 bg-amber-50 text-amber-900";
  return "border-sky-300 bg-sky-50 text-sky-900";
}

function severityLabel(sev: ValidationIssue["severity"]): string {
  return sev.toUpperCase();
}

function IssueList({ issues }: { issues: ValidationIssue[] }) {
  if (issues.length === 0) {
    return (
      <p className="text-sm text-ink-500">No issues at this severity.</p>
    );
  }
  return (
    <ul className="space-y-2">
      {issues.map((i, idx) => (
        <li
          key={idx}
          className={`rounded-md border p-3 text-sm ${severityClass(i.severity)}`}
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-xs uppercase tracking-wide">
              {severityLabel(i.severity)} · {i.code}
            </span>
            {i.xpath ? (
              <span className="font-mono text-xs opacity-70">{i.xpath}</span>
            ) : null}
          </div>
          <p className="mt-1">{i.message}</p>
        </li>
      ))}
    </ul>
  );
}

function Section({
  title,
  count,
  children,
  defaultOpen = false,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="rounded-lg border border-ink-100 p-4"
      open={defaultOpen}
    >
      <summary className="cursor-pointer text-sm font-medium text-ink-800">
        {title} <span className="ml-2 text-ink-500">({count})</span>
      </summary>
      <div className="mt-3 text-sm">{children}</div>
    </details>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-ink-100 py-1.5 text-sm last:border-0">
      <span className="text-ink-600">{label}</span>
      <span className="font-mono text-ink-900">{value ?? "—"}</span>
    </div>
  );
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function LandXmlValidatorPage() {
  const [xml, setXml] = useState<string>(SAMPLE);
  const [filename, setFilename] = useState<string>("landxml.xml");

  const result = useMemo(() => (xml.trim() ? analyze(xml) : {}), [xml]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setXml(typeof reader.result === "string" ? reader.result : "");
    };
    reader.readAsText(file);
  }

  function handleDownloadCleaned() {
    if (!result.cleaned) return;
    const base = filename.replace(/\.xml$/i, "") || "landxml";
    downloadText(`${base}.cleaned.xml`, result.cleaned);
  }

  const summary = result.summary;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / LandXML Validator
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          LandXML Validator &amp; Inspector
        </h1>
        <p className="mt-2 max-w-3xl text-ink-600">
          Paste or upload a LandXML file to inspect its surfaces, alignments,
          parcels, surveys, and CgPoints, and surface common problems before
          you import it into Civil 3D or hand it off to a contractor. All
          parsing happens locally in your browser.
        </p>
      </header>

      <section className="rounded-lg border border-ink-100 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept=".xml,application/xml,text/xml"
            onChange={handleFile}
            className="text-sm"
          />
          <button
            type="button"
            onClick={() => setXml(SAMPLE)}
            className="rounded-md border border-ink-200 px-3 py-1.5 text-sm hover:border-ink-400"
          >
            Load sample
          </button>
          <button
            type="button"
            onClick={() => setXml("")}
            className="rounded-md border border-ink-200 px-3 py-1.5 text-sm hover:border-ink-400"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleDownloadCleaned}
            disabled={!result.cleaned}
            className="ml-auto rounded-md bg-ink-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-ink-700 disabled:opacity-40"
          >
            Download cleaned
          </button>
        </div>

        <textarea
          value={xml}
          onChange={(e) => setXml(e.target.value)}
          spellCheck={false}
          className="mt-4 block h-64 w-full rounded-md border border-ink-200 p-3 font-mono text-xs outline-none focus:border-ink-400"
          placeholder="<LandXML version='1.2'> ... </LandXML>"
        />
      </section>

      {result.parseError ? (
        <section className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900">
          <strong>Parse error:</strong> {result.parseError}
        </section>
      ) : null}

      {summary ? (
        <>
          <section className="mt-8 rounded-lg border border-ink-100 p-6">
            <h2 className="mb-4 text-lg font-semibold">Document</h2>
            <Row label="LandXML version" value={summary.schemaVersion || "—"} />
            <Row
              label="Application"
              value={
                summary.application?.name
                  ? `${summary.application.name}${summary.application.version ? ` ${summary.application.version}` : ""}${summary.application.manufacturer ? ` (${summary.application.manufacturer})` : ""}`
                  : "—"
              }
            />
            <Row
              label="Linear unit"
              value={summary.units?.linear ?? "—"}
            />
            <Row label="Area unit" value={summary.units?.area ?? "—"} />
            <Row label="Angular unit" value={summary.units?.angular ?? "—"} />
          </section>

          <section className="mt-6 grid grid-cols-1 gap-3">
            <Section
              title="Surfaces"
              count={summary.surfaces.length}
              defaultOpen
            >
              {summary.surfaces.length === 0 ? (
                <p className="text-ink-500">No surfaces.</p>
              ) : (
                <ul className="space-y-2">
                  {summary.surfaces.map((s, i) => (
                    <li key={i} className="rounded-md bg-ink-50 p-3">
                      <div className="font-medium text-ink-800">{s.name}</div>
                      <div className="font-mono text-xs text-ink-600">
                        {s.pntCount} pts · {s.faceCount} faces
                        {s.minElev !== undefined && s.maxElev !== undefined
                          ? ` · elev ${s.minElev.toFixed(2)} to ${s.maxElev.toFixed(2)}`
                          : ""}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Alignments" count={summary.alignments.length}>
              {summary.alignments.length === 0 ? (
                <p className="text-ink-500">No alignments.</p>
              ) : (
                <ul className="space-y-2">
                  {summary.alignments.map((a, i) => (
                    <li key={i} className="rounded-md bg-ink-50 p-3">
                      <div className="font-medium text-ink-800">{a.name}</div>
                      <div className="font-mono text-xs text-ink-600">
                        sta {a.staStart.toFixed(2)} to {a.staEnd.toFixed(2)} ·{" "}
                        {a.pviCount} PVI
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Parcels" count={summary.parcels.length}>
              {summary.parcels.length === 0 ? (
                <p className="text-ink-500">No parcels.</p>
              ) : (
                <ul className="space-y-2">
                  {summary.parcels.map((p, i) => (
                    <li key={i} className="rounded-md bg-ink-50 p-3">
                      <div className="font-medium text-ink-800">{p.name}</div>
                      <div className="font-mono text-xs text-ink-600">
                        {p.coordCount} coords
                        {p.areaSqFt !== undefined
                          ? ` · area ${p.areaSqFt.toFixed(2)}`
                          : ""}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Surveys" count={summary.surveys.length}>
              {summary.surveys.length === 0 ? (
                <p className="text-ink-500">No surveys.</p>
              ) : (
                <ul className="space-y-2">
                  {summary.surveys.map((s, i) => (
                    <li key={i} className="rounded-md bg-ink-50 p-3">
                      <div className="font-medium text-ink-800">{s.name}</div>
                      <div className="font-mono text-xs text-ink-600">
                        {s.instrumentCount} instrument setups ·{" "}
                        {s.observationCount} observations
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section
              title="CgPoints"
              count={summary.cgPoints.count}
            >
              <Row label="Count" value={summary.cgPoints.count} />
              <Row
                label="Northing range"
                value={
                  summary.cgPoints.count > 0
                    ? `${summary.cgPoints.minNorthing.toFixed(2)} to ${summary.cgPoints.maxNorthing.toFixed(2)}`
                    : "—"
                }
              />
              <Row
                label="Easting range"
                value={
                  summary.cgPoints.count > 0
                    ? `${summary.cgPoints.minEasting.toFixed(2)} to ${summary.cgPoints.maxEasting.toFixed(2)}`
                    : "—"
                }
              />
            </Section>
          </section>

          <section className="mt-6 rounded-lg border border-ink-100 p-6">
            <h2 className="mb-4 text-lg font-semibold">
              Errors{" "}
              <span className="ml-2 text-sm text-ink-500">
                ({summary.errors.length})
              </span>
            </h2>
            <IssueList issues={summary.errors} />

            <h2 className="mb-4 mt-6 text-lg font-semibold">
              Warnings &amp; info{" "}
              <span className="ml-2 text-sm text-ink-500">
                ({summary.warnings.length})
              </span>
            </h2>
            <IssueList issues={summary.warnings} />
          </section>
        </>
      ) : null}
    </div>
  );
}
