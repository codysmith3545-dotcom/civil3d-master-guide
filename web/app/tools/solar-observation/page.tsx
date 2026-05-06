"use client";

import { useState } from "react";
import Link from "next/link";
import {
  compute,
  type SolarObservationOutput,
} from "@/lib/calculators/solar-observation";
import { Field, FormGrid, ResultRow } from "@/components/CalculatorForm";
import type { FieldDef } from "@/components/CalculatorForm";

const fields: FieldDef[] = [
  {
    type: "number",
    name: "lat",
    label: "Latitude",
    help: "decimal degrees (positive north)",
    step: 0.0001,
    defaultValue: 39.7684,
  },
  {
    type: "number",
    name: "lon",
    label: "Longitude",
    help: "decimal degrees (negative west)",
    step: 0.0001,
    defaultValue: -86.1581,
  },
  {
    type: "number",
    name: "hzAngle",
    label: "Hz angle (mark to sun)",
    help: "degrees, clockwise",
    step: 0.0001,
    min: 0,
    max: 360,
    defaultValue: 125.5,
  },
];

export default function SolarObservationPage() {
  const [values, setValues] = useState<Record<string, string>>({
    date: "2024-06-15",
    time: "17:30:00",
    lat: "39.7684",
    lon: "-86.1581",
    hzAngle: "125.5",
  });
  const [result, setResult] = useState<SolarObservationOutput | null>(null);

  function handleChange(name: string, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  function handleCompute() {
    const lat_deg = parseFloat(values.lat);
    const lon_deg = parseFloat(values.lon);
    const hz_angle_deg = parseFloat(values.hzAngle);
    if (isNaN(lat_deg) || isNaN(lon_deg) || isNaN(hz_angle_deg)) return;
    if (!values.date || !values.time) return;

    setResult(
      compute({
        date_iso: values.date,
        time_utc: values.time,
        lat_deg,
        lon_deg,
        hz_angle_deg,
      }),
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / Solar observation
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Solar Observation Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Compute the sun&apos;s azimuth at a given date, time (UTC), and
          location, then derive the azimuth to a survey mark from the measured
          horizontal angle.
        </p>
      </header>

      <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Approximation only.</strong> This uses the low-accuracy solar
        position algorithm from the Astronomical Almanac (~0.01 deg). It does
        not apply atmospheric refraction corrections. For geodetic-grade solar
        azimuths, use the full NOAA Solar Position Calculator or the Meeus
        algorithm and apply a refraction model.
      </div>

      <section className="rounded-lg border border-ink-100 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-ink-800">Date</span>
            <span className="ml-2 text-xs text-ink-500">YYYY-MM-DD</span>
            <input
              type="date"
              value={values.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="mt-1 block w-full rounded-md border border-ink-200 px-2 py-1.5 text-sm outline-none focus:border-ink-400"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-ink-800">Time (UTC)</span>
            <span className="ml-2 text-xs text-ink-500">HH:MM:SS</span>
            <input
              type="time"
              step="1"
              value={values.time}
              onChange={(e) => handleChange("time", e.target.value)}
              className="mt-1 block w-full rounded-md border border-ink-200 px-2 py-1.5 text-sm outline-none focus:border-ink-400"
            />
          </label>
        </div>

        <div className="mt-4">
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
        </div>

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
              label="Sun azimuth"
              value={result.sun_azimuth_deg}
              unit="deg"
            />
            <ResultRow
              label="Mark azimuth"
              value={result.mark_azimuth_deg}
              unit="deg"
            />
            <ResultRow
              label="Solar declination"
              value={result.declination_deg}
              unit="deg"
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
            Source: Simplified solar position (Astronomical Almanac). Reference:
            Buckner, <em>A Manual of Solar Observations</em>.
          </p>
        </section>
      )}
    </div>
  );
}
