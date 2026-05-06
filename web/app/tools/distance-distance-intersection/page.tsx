"use client";

import { useEffect, useState } from "react";
import { trackCalculator } from "@/lib/analytics";
import Link from "next/link";
import {
  compute,
  type DistanceDistanceOutput,
} from "@/lib/calculators/distance-distance-intersection";
import { Field, FormGrid, ResultRow } from "@/components/CalculatorForm";
import type { FieldDef } from "@/components/CalculatorForm";

const fields: FieldDef[] = [
  {
    type: "number",
    name: "n1",
    label: "Point 1 Northing",
    help: "ft",
    step: 0.001,
    defaultValue: 1000,
  },
  {
    type: "number",
    name: "e1",
    label: "Point 1 Easting",
    help: "ft",
    step: 0.001,
    defaultValue: 1000,
  },
  {
    type: "number",
    name: "d1",
    label: "Distance from P1",
    help: "ft (radius)",
    step: 0.01,
    min: 0,
    defaultValue: 150,
  },
  {
    type: "number",
    name: "n2",
    label: "Point 2 Northing",
    help: "ft",
    step: 0.001,
    defaultValue: 1000,
  },
  {
    type: "number",
    name: "e2",
    label: "Point 2 Easting",
    help: "ft",
    step: 0.001,
    defaultValue: 1200,
  },
  {
    type: "number",
    name: "d2",
    label: "Distance from P2",
    help: "ft (radius)",
    step: 0.01,
    min: 0,
    defaultValue: 150,
  },
];

export default function DistanceDistanceIntersectionPage() {
  useEffect(() => {
    trackCalculator("distance-distance-intersection");
  }, []);
  const [values, setValues] = useState<Record<string, string>>({
    n1: "1000",
    e1: "1000",
    d1: "150",
    n2: "1000",
    e2: "1200",
    d2: "150",
  });
  const [result, setResult] = useState<DistanceDistanceOutput | null>(null);

  function handleChange(name: string, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  function handleCompute() {
    const n1 = parseFloat(values.n1);
    const e1 = parseFloat(values.e1);
    const d1_ft = parseFloat(values.d1);
    const n2 = parseFloat(values.n2);
    const e2 = parseFloat(values.e2);
    const d2_ft = parseFloat(values.d2);
    if ([n1, e1, d1_ft, n2, e2, d2_ft].some(isNaN)) return;

    setResult(compute({ n1, e1, d1_ft, n2, e2, d2_ft }));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / Distance-distance intersection
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Distance-Distance Intersection
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Compute the intersection of two circles, each defined by a center
          point and a radius. Returns 0, 1, or 2 solutions.
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
          {result.solutions.length === 0 ? (
            <p className="text-sm text-ink-600">No intersection found.</p>
          ) : (
            <div className="space-y-4">
              {result.solutions.map((sol, i) => (
                <div key={i} className="space-y-0">
                  <h3 className="text-sm font-medium text-ink-700">
                    Solution {i + 1}
                  </h3>
                  <ResultRow label="Northing" value={sol.n} unit="ft" />
                  <ResultRow label="Easting" value={sol.e} unit="ft" />
                </div>
              ))}
            </div>
          )}

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
