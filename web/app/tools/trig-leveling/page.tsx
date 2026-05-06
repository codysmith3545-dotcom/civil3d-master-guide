"use client";

import { useEffect, useState } from "react";
import { trackCalculator } from "@/lib/analytics";
import Link from "next/link";
import {
  compute,
  type TrigLevelingOutput,
} from "@/lib/calculators/trig-leveling";
import { Field, FormGrid, ResultRow } from "@/components/CalculatorForm";
import type { FieldDef } from "@/components/CalculatorForm";

const fields: FieldDef[] = [
  {
    type: "number",
    name: "slopeDist",
    label: "Slope distance",
    help: "ft",
    step: 0.01,
    min: 0,
    defaultValue: 500,
  },
  {
    type: "number",
    name: "zenith",
    label: "Zenith angle",
    help: "degrees (90 = horizontal)",
    step: 0.0001,
    min: 0,
    max: 180,
    defaultValue: 85,
  },
  {
    type: "number",
    name: "hi",
    label: "Instrument height (HI)",
    help: "ft",
    step: 0.01,
    min: 0,
    defaultValue: 5.25,
  },
  {
    type: "number",
    name: "ht",
    label: "Target height (HT)",
    help: "ft",
    step: 0.01,
    min: 0,
    defaultValue: 6.0,
  },
  {
    type: "number",
    name: "knownElev",
    label: "Known elevation",
    help: "ft (of instrument point)",
    step: 0.01,
    defaultValue: 750,
  },
];

export default function TrigLevelingPage() {
  useEffect(() => {
    trackCalculator("trig-leveling");
  }, []);
  const [values, setValues] = useState<Record<string, string>>({
    slopeDist: "500",
    zenith: "85",
    hi: "5.25",
    ht: "6.0",
    knownElev: "750",
  });
  const [result, setResult] = useState<TrigLevelingOutput | null>(null);

  function handleChange(name: string, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  function handleCompute() {
    const slope_dist_ft = parseFloat(values.slopeDist);
    const zenith_deg = parseFloat(values.zenith);
    const hi_ft = parseFloat(values.hi);
    const ht_ft = parseFloat(values.ht);
    const known_elev_ft = parseFloat(values.knownElev);
    if (
      [slope_dist_ft, zenith_deg, hi_ft, ht_ft, known_elev_ft].some(isNaN)
    )
      return;

    setResult(
      compute({ slope_dist_ft, zenith_deg, hi_ft, ht_ft, known_elev_ft }),
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / Trigonometric leveling
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Trigonometric Leveling Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Compute horizontal distance, elevation difference, and remote-point
          elevation from a slope distance and zenith angle.
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
              label="Horizontal distance"
              value={result.horiz_dist_ft}
              unit="ft"
            />
            <ResultRow
              label="Elevation difference"
              value={result.delta_elev_ft}
              unit="ft"
            />
            <ResultRow
              label="Remote elevation"
              value={result.remote_elev_ft}
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
            Reference: Wolf &amp; Ghilani, <em>Elementary Surveying</em>.
          </p>
        </section>
      )}
    </div>
  );
}
