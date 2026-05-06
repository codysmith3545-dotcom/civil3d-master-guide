"use client";

import { useEffect, useState } from "react";
import { trackCalculator } from "@/lib/analytics";
import Link from "next/link";
import {
  compute,
  type CurveType,
  type Purpose,
  type VerticalCurveOutput,
} from "@/lib/calculators/vertical-curve";
import { Field, FormGrid, ResultRow } from "@/components/CalculatorForm";
import type { FieldDef } from "@/components/CalculatorForm";

const fields: FieldDef[] = [
  {
    type: "number",
    name: "designSpeed",
    label: "Design speed",
    help: "mph",
    step: 5,
    min: 15,
    max: 80,
    defaultValue: 45,
  },
  {
    type: "number",
    name: "g1",
    label: "Grade in (G1)",
    help: "% (negative = downgrade)",
    step: 0.1,
    defaultValue: -2,
  },
  {
    type: "number",
    name: "g2",
    label: "Grade out (G2)",
    help: "%",
    step: 0.1,
    defaultValue: 3,
  },
  {
    type: "select",
    name: "curveType",
    label: "Curve type",
    options: [
      { value: "crest", label: "Crest" },
      { value: "sag", label: "Sag" },
    ],
    defaultValue: "crest",
  },
  {
    type: "select",
    name: "purpose",
    label: "Sight-distance criterion",
    options: [
      { value: "SSD", label: "Stopping sight distance (SSD)" },
      { value: "PSD", label: "Passing sight distance (PSD)" },
    ],
    defaultValue: "SSD",
  },
  {
    type: "number",
    name: "proposedLength",
    label: "Proposed curve length",
    help: "ft (optional)",
    step: 1,
    min: 0,
  },
];

export default function VerticalCurvePage() {
  useEffect(() => {
    trackCalculator("vertical-curve");
  }, []);
  const [values, setValues] = useState<Record<string, string>>({
    designSpeed: "45",
    g1: "-2",
    g2: "3",
    curveType: "crest",
    purpose: "SSD",
    proposedLength: "",
  });
  const [result, setResult] = useState<VerticalCurveOutput | null>(null);

  function handleChange(name: string, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  function handleCompute() {
    const designSpeedMph = parseFloat(values.designSpeed);
    const G1 = parseFloat(values.g1);
    const G2 = parseFloat(values.g2);
    if (isNaN(designSpeedMph) || isNaN(G1) || isNaN(G2)) return;

    const proposedLengthFt = values.proposedLength
      ? parseFloat(values.proposedLength)
      : undefined;

    setResult(
      compute({
        designSpeedMph,
        G1,
        G2,
        curveType: values.curveType as CurveType,
        purpose: values.purpose as Purpose,
        proposedLengthFt:
          proposedLengthFt != null && !isNaN(proposedLengthFt)
            ? proposedLengthFt
            : undefined,
      }),
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / Vertical curve
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Vertical Curve Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Compute the required K-value and minimum curve length for crest or sag
          vertical curves per AASHTO &ldquo;Green Book&rdquo; stopping and
          passing sight-distance tables. Optionally check a proposed curve length
          against the requirement.
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
              label="Algebraic difference (A)"
              value={result.A}
              unit="%"
            />
            <ResultRow
              label="Required K"
              value={result.requiredK}
            />
            <ResultRow
              label="Required curve length"
              value={result.requiredLengthFt}
              unit="ft"
            />
            {result.achievedK != null && (
              <ResultRow label="Achieved K" value={result.achievedK} />
            )}
            {result.meetsRequired != null && (
              <ResultRow
                label="Meets required K?"
                value={result.meetsRequired ? "Yes" : "No"}
              />
            )}
            {result.approxSightDistanceFt != null && (
              <ResultRow
                label="Approx sight distance"
                value={result.approxSightDistanceFt}
                unit="ft"
              />
            )}
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
            Source: AASHTO, <em>A Policy on Geometric Design of Highways and
            Streets</em> (&ldquo;Green Book&rdquo;), 7th ed., Tables 3-34,
            3-36, 3-37. Verify against the current edition before using for
            design.
          </p>
        </section>
      )}
    </div>
  );
}
