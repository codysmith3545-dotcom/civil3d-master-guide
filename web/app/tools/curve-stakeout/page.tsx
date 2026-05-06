"use client";

import { useState } from "react";
import Link from "next/link";
import {
  compute,
  formatStation,
  type CurveStakeoutOutput,
} from "@/lib/calculators/curve-stakeout";
import { Field, FormGrid, ResultRow } from "@/components/CalculatorForm";
import type { FieldDef } from "@/components/CalculatorForm";

const fields: FieldDef[] = [
  {
    type: "number",
    name: "radius",
    label: "Radius",
    help: "ft",
    step: 1,
    min: 1,
    defaultValue: 500,
  },
  {
    type: "number",
    name: "delta",
    label: "Delta angle",
    help: "degrees",
    step: 0.01,
    min: 0.01,
    max: 359.99,
    defaultValue: 30,
  },
  {
    type: "number",
    name: "pcStation",
    label: "PC station",
    help: "ft (e.g. 5000 = STA 50+00)",
    step: 0.01,
    defaultValue: 5000,
  },
  {
    type: "number",
    name: "interval",
    label: "Stakeout interval",
    help: "ft",
    step: 1,
    min: 1,
    defaultValue: 50,
  },
];

export default function CurveStakeoutPage() {
  const [values, setValues] = useState<Record<string, string>>({
    radius: "500",
    delta: "30",
    pcStation: "5000",
    interval: "50",
  });
  const [result, setResult] = useState<CurveStakeoutOutput | null>(null);

  function handleChange(name: string, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  function handleCompute() {
    const radius_ft = parseFloat(values.radius);
    const delta_deg = parseFloat(values.delta);
    const pc_station_ft = parseFloat(values.pcStation);
    const interval_ft = parseFloat(values.interval);
    if ([radius_ft, delta_deg, pc_station_ft, interval_ft].some(isNaN)) return;

    setResult(compute({ radius_ft, delta_deg, pc_station_ft, interval_ft }));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / Curve stakeout
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Curve Stakeout Table
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Generate a deflection-angle and chord table for staking a simple
          circular curve at regular intervals from the PC.
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
            <h2 className="mb-4 text-lg font-semibold">Curve Summary</h2>
            <div className="space-y-0">
              <ResultRow
                label="Curve length"
                value={result.curve_length}
                unit="ft"
              />
              <ResultRow
                label="Tangent length"
                value={result.tangent}
                unit="ft"
              />
            </div>
          </div>

          {result.stakeout_table.length > 0 && (
            <div className="rounded-lg border border-ink-100 p-6">
              <h2 className="mb-4 text-lg font-semibold">Stakeout Table</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-200 text-ink-600">
                      <th className="pb-2 pr-4 font-medium">Station</th>
                      <th className="pb-2 pr-4 font-medium">
                        Deflection (deg)
                      </th>
                      <th className="pb-2 font-medium">Chord from PC (ft)</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {result.stakeout_table.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-ink-50 last:border-0"
                      >
                        <td className="py-1.5 pr-4">
                          {formatStation(row.station_ft)}
                        </td>
                        <td className="py-1.5 pr-4">
                          {row.deflection_deg.toFixed(4)}
                        </td>
                        <td className="py-1.5">{row.chord_ft.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {result.notes.length > 0 && (
            <div className="rounded-md bg-ink-50 p-4">
              <h3 className="text-sm font-medium text-ink-700">Notes</h3>
              <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-ink-600">
                {result.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-ink-500">
            Reference: Wolf &amp; Ghilani, <em>Elementary Surveying</em>.
          </p>
        </section>
      )}
    </div>
  );
}
