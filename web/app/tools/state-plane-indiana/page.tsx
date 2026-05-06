"use client";

import { useEffect, useState } from "react";
import { trackCalculator } from "@/lib/analytics";
import Link from "next/link";
import {
  compute,
  type StatePlaneIndianaOutput,
} from "@/lib/calculators/state-plane-indiana";
import { Field, FormGrid, ResultRow } from "@/components/CalculatorForm";
import type { FieldDef } from "@/components/CalculatorForm";

const fields: FieldDef[] = [
  {
    type: "number",
    name: "lat",
    label: "Latitude",
    help: "decimal degrees (positive north)",
    step: 0.000001,
    defaultValue: 39.7684,
  },
  {
    type: "number",
    name: "lon",
    label: "Longitude",
    help: "decimal degrees (negative west)",
    step: 0.000001,
    defaultValue: -86.1581,
  },
  {
    type: "number",
    name: "elev",
    label: "Elevation",
    help: "ft above MSL",
    step: 0.1,
    defaultValue: 715,
  },
];

export default function StatePlaneIndianaPage() {
  useEffect(() => {
    trackCalculator("state-plane-indiana");
  }, []);
  const [values, setValues] = useState<Record<string, string>>({
    lat: "39.7684",
    lon: "-86.1581",
    elev: "715",
  });
  const [result, setResult] = useState<StatePlaneIndianaOutput | null>(null);

  function handleChange(name: string, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  function handleCompute() {
    const lat_deg = parseFloat(values.lat);
    const lon_deg = parseFloat(values.lon);
    const elev_ft = parseFloat(values.elev);
    if (isNaN(lat_deg) || isNaN(lon_deg) || isNaN(elev_ft)) return;

    setResult(compute({ lat_deg, lon_deg, elev_ft }));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / State Plane Indiana CSF
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Indiana State Plane CSF Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Approximate the Combined Scale Factor (CSF) for Indiana State Plane
          Coordinate System (NAD83) East or West zone from a geographic position
          and elevation.
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
            <ResultRow label="Zone" value={result.zone} />
            <ResultRow label="Grid scale factor" value={result.grid_scale} />
            <ResultRow label="Elevation factor" value={result.elevation_factor} />
            <ResultRow label="Combined scale factor (CSF)" value={result.csf} />
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
            Source: TM grid scale approximation; NAD83 Indiana SPC zones 1301/1302.
            Reference: NGS; Stem, <em>State Plane Coordinate System of 1983</em>,
            NOAA Manual NOS NGS 5.
          </p>
        </section>
      )}
    </div>
  );
}
