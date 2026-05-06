"use client";

import { useState } from "react";
import Link from "next/link";
import {
  compute,
  formatStation,
  type HorizontalCurveOutput,
} from "@/lib/calculators/horizontal-curve";
import { Field, FormGrid, ResultRow } from "@/components/CalculatorForm";
import type { FieldDef } from "@/components/CalculatorForm";

const fields: FieldDef[] = [
  {
    type: "number",
    name: "radius",
    label: "Radius (R)",
    help: "ft",
    step: 1,
    min: 1,
    defaultValue: 1000,
  },
  {
    type: "number",
    name: "deltaDeg",
    label: "Delta angle",
    help: "degrees",
    step: 0.01,
    min: 0.01,
    max: 179.99,
    defaultValue: 30,
  },
  {
    type: "number",
    name: "piStation",
    label: "PI station",
    help: "ft (e.g. 12345.67 = STA 123+45.67)",
    step: 0.01,
    defaultValue: 5000,
  },
  {
    type: "number",
    name: "deflectionRows",
    label: "Deflection table rows",
    help: "intermediate points",
    step: 1,
    min: 1,
    max: 50,
    defaultValue: 5,
  },
];

export default function HorizontalCurvePage() {
  const [values, setValues] = useState<Record<string, string>>({
    radius: "1000",
    deltaDeg: "30",
    piStation: "5000",
    deflectionRows: "5",
  });
  const [result, setResult] = useState<HorizontalCurveOutput | null>(null);

  function handleChange(name: string, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  function handleCompute() {
    const R = parseFloat(values.radius);
    const deltaDeg = parseFloat(values.deltaDeg);
    const piStationFt = parseFloat(values.piStation);
    const deflectionRows = parseInt(values.deflectionRows, 10);
    if (isNaN(R) || isNaN(deltaDeg) || isNaN(piStationFt)) return;

    setResult(
      compute({
        R,
        deltaDeg,
        piStationFt,
        deflectionRows: isNaN(deflectionRows) ? 5 : deflectionRows,
      }),
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / Horizontal curve
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Horizontal Curve Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Compute tangent, arc length, middle ordinate, external, long chord, PC
          and PT stations, and a deflection-chord table for a simple circular
          curve.
        </p>
      </header>

      <section className="rounded-lg border border-ink-100 p-6">
        <FormGrid>
          {fields.map((f) => (
            <Field
              key={f.name}
              field={f}
              value={values[f.name]}
              onChange={(v) => handleChange(f.name, v)}
            />
          ))}
        </FormGrid>

        <button
          onClick={handleCompute}
          className="mt-6 rounded-md bg-ink-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-ink-700"
        >
          Compute
        </button>
      </section>

      {result && (
        <section className="mt-8 space-y-6">
          <div className="rounded-lg border border-ink-100 p-6">
            <h2 className="mb-4 text-lg font-semibold">Curve Elements</h2>
            <div className="space-y-0">
              <ResultRow label="Tangent (T)" value={result.T} unit="ft" />
              <ResultRow label="Arc length (L)" value={result.L} unit="ft" />
              <ResultRow
                label="Middle ordinate (M)"
                value={result.M}
                unit="ft"
              />
              <ResultRow label="External (E)" value={result.E} unit="ft" />
              <ResultRow label="Long chord (LC)" value={result.LC} unit="ft" />
              <ResultRow
                label="PC station"
                value={formatStation(result.pcStationFt)}
              />
              <ResultRow
                label="PT station"
                value={formatStation(result.ptStationFt)}
              />
            </div>

            {result.notes.length > 0 && (
              <div className="mt-4 rounded-md bg-ink-50 p-4">
                <h3 className="text-sm font-medium text-ink-700">Notes</h3>
                <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-ink-600">
                  {result.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {result.deflectionTable.length > 0 && (
            <div className="rounded-lg border border-ink-100 p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Deflection-Chord Table
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-200 text-ink-600">
                      <th className="pb-2 pr-4 font-medium">Station</th>
                      <th className="pb-2 pr-4 font-medium">Arc from PC (ft)</th>
                      <th className="pb-2 pr-4 font-medium">Deflection (deg)</th>
                      <th className="pb-2 font-medium">Chord from PC (ft)</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {result.deflectionTable.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-ink-50 last:border-0"
                      >
                        <td className="py-1.5 pr-4">
                          {formatStation(row.stationFt)}
                        </td>
                        <td className="py-1.5 pr-4">{row.arcFromPCFt}</td>
                        <td className="py-1.5 pr-4">
                          {row.deflectionDeg.toFixed(4)}
                        </td>
                        <td className="py-1.5">{row.chordFromPCFt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <p className="text-xs text-ink-500">
            Standard arc-definition formulas. Reference: Wolf &amp; Ghilani,{" "}
            <em>Elementary Surveying</em>.
          </p>
        </section>
      )}
    </div>
  );
}
