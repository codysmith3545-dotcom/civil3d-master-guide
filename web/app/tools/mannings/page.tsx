"use client";

import { useState } from "react";
import Link from "next/link";
import {
  compute,
  type ManningsOutput,
} from "@/lib/calculators/mannings";
import { Field, FormGrid, ResultRow } from "@/components/CalculatorForm";
import type { FieldDef } from "@/components/CalculatorForm";

const fields: FieldDef[] = [
  {
    type: "number",
    name: "n",
    label: "Manning's n",
    help: "dimensionless (e.g. 0.013 for concrete)",
    step: 0.001,
    min: 0.001,
    defaultValue: 0.013,
  },
  {
    type: "number",
    name: "area",
    label: "Flow area",
    help: "sq ft",
    step: 0.1,
    min: 0,
    defaultValue: 10,
  },
  {
    type: "number",
    name: "hydRadius",
    label: "Hydraulic radius",
    help: "ft (A / wetted perimeter)",
    step: 0.01,
    min: 0,
    defaultValue: 1.5,
  },
  {
    type: "number",
    name: "slope",
    label: "Slope",
    help: "ft/ft (e.g. 0.005)",
    step: 0.0001,
    min: 0,
    defaultValue: 0.005,
  },
];

export default function ManningsPage() {
  const [values, setValues] = useState<Record<string, string>>({
    n: "0.013",
    area: "10",
    hydRadius: "1.5",
    slope: "0.005",
  });
  const [result, setResult] = useState<ManningsOutput | null>(null);

  function handleChange(name: string, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  function handleCompute() {
    const n = parseFloat(values.n);
    const area_sqft = parseFloat(values.area);
    const hyd_radius_ft = parseFloat(values.hydRadius);
    const slope_ft_ft = parseFloat(values.slope);
    if ([n, area_sqft, hyd_radius_ft, slope_ft_ft].some(isNaN)) return;

    setResult(compute({ n, area_sqft, hyd_radius_ft, slope_ft_ft }));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / Manning&apos;s equation
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Manning&apos;s Equation Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Compute open-channel flow velocity and discharge using Manning&apos;s
          equation: V = (1.49/n) &middot; R<sup>2/3</sup> &middot; S<sup>1/2</sup>.
          U.S. customary units.
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
            <ResultRow label="Velocity (V)" value={result.velocity_fps} unit="ft/s" />
            <ResultRow label="Discharge (Q)" value={result.flow_cfs} unit="cfs" />
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
            Source: Manning&apos;s equation (U.S. customary). Reference: Chow,{" "}
            <em>Open-Channel Hydraulics</em>; FHWA HDS-4.
          </p>
        </section>
      )}
    </div>
  );
}
