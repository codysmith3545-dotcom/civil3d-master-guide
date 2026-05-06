"use client";

import { useState } from "react";
import Link from "next/link";
import {
  compute,
  type InverseOutput,
} from "@/lib/calculators/inverse";
import { Field, FormGrid, ResultRow } from "@/components/CalculatorForm";
import type { FieldDef } from "@/components/CalculatorForm";

const fields: FieldDef[] = [
  {
    type: "number",
    name: "n1",
    label: "Northing 1",
    help: "ft",
    step: 0.001,
    defaultValue: 1000,
  },
  {
    type: "number",
    name: "e1",
    label: "Easting 1",
    help: "ft",
    step: 0.001,
    defaultValue: 1000,
  },
  {
    type: "number",
    name: "n2",
    label: "Northing 2",
    help: "ft",
    step: 0.001,
    defaultValue: 1100,
  },
  {
    type: "number",
    name: "e2",
    label: "Easting 2",
    help: "ft",
    step: 0.001,
    defaultValue: 1050,
  },
];

export default function InversePage() {
  const [values, setValues] = useState<Record<string, string>>({
    n1: "1000",
    e1: "1000",
    n2: "1100",
    e2: "1050",
  });
  const [result, setResult] = useState<InverseOutput | null>(null);

  function handleChange(name: string, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  function handleCompute() {
    const n1 = parseFloat(values.n1);
    const e1 = parseFloat(values.e1);
    const n2 = parseFloat(values.n2);
    const e2 = parseFloat(values.e2);
    if ([n1, e1, n2, e2].some(isNaN)) return;

    setResult(compute({ n1, e1, n2, e2 }));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / Inverse
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Inverse Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Compute the azimuth, quadrant bearing, and horizontal distance between
          two coordinate pairs.
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
            <ResultRow
              label="Azimuth"
              value={result.azimuth_deg}
              unit="deg"
            />
            <ResultRow
              label="Bearing"
              value={result.bearing_quadrant}
            />
            <ResultRow
              label="Distance"
              value={result.distance_ft}
              unit="ft"
            />
            <ResultRow label="Delta N" value={result.delta_n} unit="ft" />
            <ResultRow label="Delta E" value={result.delta_e} unit="ft" />
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
            Reference: Wolf &amp; Ghilani, <em>Elementary Surveying</em>.
          </p>
        </section>
      )}
    </div>
  );
}
