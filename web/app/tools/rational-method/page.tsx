"use client";

import { useEffect, useState } from "react";
import { trackCalculator } from "@/lib/analytics";
import Link from "next/link";
import {
  compute,
  kirpichTc,
  type RationalOutput,
  type KirpichOutput,
} from "@/lib/calculators/rational-method";
import { Field, FormGrid, ResultRow } from "@/components/CalculatorForm";
import type { FieldDef } from "@/components/CalculatorForm";

const rationalFields: FieldDef[] = [
  {
    type: "number",
    name: "C",
    label: "Runoff coefficient (C)",
    help: "0 to 1",
    step: 0.01,
    min: 0,
    max: 1,
    defaultValue: 0.35,
  },
  {
    type: "number",
    name: "i",
    label: "Rainfall intensity (i)",
    help: "in/hr",
    step: 0.1,
    min: 0,
    defaultValue: 4.5,
  },
  {
    type: "number",
    name: "A",
    label: "Drainage area (A)",
    help: "acres",
    step: 0.1,
    min: 0,
    defaultValue: 10,
  },
];

const kirpichFields: FieldDef[] = [
  {
    type: "number",
    name: "length",
    label: "Hydraulic length",
    help: "ft",
    step: 1,
    min: 0,
  },
  {
    type: "number",
    name: "slope",
    label: "Average slope",
    help: "ft/ft (e.g. 0.02 = 2%)",
    step: 0.001,
    min: 0,
  },
];

export default function RationalMethodPage() {
  useEffect(() => {
    trackCalculator("rational-method");
  }, []);
  const [values, setValues] = useState<Record<string, string>>({
    C: "0.35",
    i: "4.5",
    A: "10",
    length: "",
    slope: "",
  });
  const [result, setResult] = useState<RationalOutput | null>(null);
  const [tcResult, setTcResult] = useState<KirpichOutput | null>(null);

  function handleChange(name: string, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  function handleCompute() {
    const C = parseFloat(values.C);
    const intensityInPerHr = parseFloat(values.i);
    const areaAcres = parseFloat(values.A);
    if (isNaN(C) || isNaN(intensityInPerHr) || isNaN(areaAcres)) return;

    setResult(compute({ C, intensityInPerHr, areaAcres }));

    const lengthFt = parseFloat(values.length);
    const slopeFtPerFt = parseFloat(values.slope);
    if (!isNaN(lengthFt) && lengthFt > 0 && !isNaN(slopeFtPerFt) && slopeFtPerFt > 0) {
      setTcResult(kirpichTc({ lengthFt, slopeFtPerFt }));
    } else {
      setTcResult(null);
    }
  }

  const allNotes = [
    ...(result?.notes ?? []),
    ...(tcResult?.notes ?? []),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / Rational method
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Rational Method Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Compute peak runoff Q = C &middot; i &middot; A in cfs. Optionally
          estimate time of concentration using the Kirpich equation for overland
          flow.
        </p>
      </header>

      <section className="rounded-lg border border-ink-100 p-6">
        <h2 className="mb-4 text-base font-semibold">Q = C &middot; i &middot; A</h2>
        <FormGrid>
          {rationalFields.map((f) => (
            <Field
              key={f.name}
              field={f}
              value={values[f.name]}
              onChange={(v) => handleChange(f.name, v)}
            />
          ))}
        </FormGrid>
      </section>

      <section className="mt-6 rounded-lg border border-ink-100 p-6">
        <h2 className="mb-4 text-base font-semibold">
          Kirpich T<sub>c</sub> (optional)
        </h2>
        <p className="mb-4 text-sm text-ink-600">
          If you provide a hydraulic length and slope, the Kirpich equation will
          estimate time of concentration for overland flow.
        </p>
        <FormGrid>
          {kirpichFields.map((f) => (
            <Field
              key={f.name}
              field={f}
              value={values[f.name]}
              onChange={(v) => handleChange(f.name, v)}
            />
          ))}
        </FormGrid>
      </section>

      <button
        onClick={handleCompute}
        className="mt-6 rounded-md bg-ink-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-ink-700"
      >
        Compute
      </button>

      {result && (
        <section className="mt-8 rounded-lg border border-ink-100 p-6">
          <h2 className="mb-4 text-lg font-semibold">Results</h2>
          <div className="space-y-0">
            <ResultRow label="Peak flow (Q)" value={result.Q} unit="cfs" />
            {tcResult && (
              <ResultRow
                label="Time of concentration (Tc)"
                value={tcResult.tcMinutes}
                unit="min"
              />
            )}
          </div>

          {allNotes.length > 0 && (
            <div className="mt-4 rounded-md bg-ink-50 p-4">
              <h3 className="text-sm font-medium text-ink-700">Notes</h3>
              <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-ink-600">
                {allNotes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-4 text-xs text-ink-500">
            Source: Q = CiA (Rational Method). Reference: FHWA HEC-22 Ch. 3;
            AASHTO Highway Drainage Guidelines. Kirpich: t<sub>c</sub> =
            0.0078 &middot; L<sup>0.77</sup> &middot; S<sup>-0.385</sup>.
          </p>
        </section>
      )}
    </div>
  );
}
