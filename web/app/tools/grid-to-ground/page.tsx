"use client";

import { useState } from "react";
import Link from "next/link";
import {
  compute,
  type GridToGroundOutput,
  type GridToGroundMode,
} from "@/lib/calculators/grid-to-ground";
import { Field, FormGrid, ResultRow } from "@/components/CalculatorForm";
import type { FieldDef } from "@/components/CalculatorForm";

const fields: FieldDef[] = [
  {
    type: "select",
    name: "mode",
    label: "Conversion direction",
    options: [
      { value: "grid-to-ground", label: "Grid to ground" },
      { value: "ground-to-grid", label: "Ground to grid" },
    ],
    defaultValue: "grid-to-ground",
  },
  {
    type: "number",
    name: "csf",
    label: "Combined Scale Factor",
    help: "dimensionless (e.g. 0.99996)",
    step: 0.0000001,
    min: 0,
    defaultValue: 0.99996,
  },
  {
    type: "number",
    name: "distance",
    label: "Distance",
    help: "ft",
    step: 0.01,
    min: 0,
    defaultValue: 1000,
  },
];

export default function GridToGroundPage() {
  const [values, setValues] = useState<Record<string, string>>({
    mode: "grid-to-ground",
    csf: "0.99996",
    distance: "1000",
  });
  const [result, setResult] = useState<GridToGroundOutput | null>(null);

  function handleChange(name: string, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  function handleCompute() {
    const csf = parseFloat(values.csf);
    const distance_ft = parseFloat(values.distance);
    if (isNaN(csf) || isNaN(distance_ft)) return;

    setResult(
      compute({
        mode: values.mode as GridToGroundMode,
        csf,
        distance_ft,
      }),
    );
  }

  const inputLabel =
    values.mode === "grid-to-ground" ? "Grid distance" : "Ground distance";
  const outputLabel =
    values.mode === "grid-to-ground" ? "Ground distance" : "Grid distance";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / Grid-to-ground
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Grid-to-Ground Conversion
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Convert between State Plane grid distances and ground (surface)
          distances using a Combined Scale Factor (CSF).
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
        <section className="mt-8 rounded-lg border border-ink-100 p-6">
          <h2 className="mb-4 text-lg font-semibold">Results</h2>
          <div className="space-y-0">
            <ResultRow label={inputLabel} value={values.distance} unit="ft" />
            <ResultRow
              label={outputLabel}
              value={result.converted_ft}
              unit="ft"
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

          <p className="mt-4 text-xs text-ink-500">
            Source: ground = grid / CSF; grid = ground * CSF. Reference: Stem,{" "}
            <em>State Plane Coordinate System of 1983</em>, NOAA Manual NOS NGS
            5.
          </p>
        </section>
      )}
    </div>
  );
}
