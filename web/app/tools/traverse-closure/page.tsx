"use client";

import { useEffect, useState } from "react";
import { trackCalculator } from "@/lib/analytics";
import Link from "next/link";
import {
  compute,
  type TraverseClosureOutput,
} from "@/lib/calculators/traverse-closure";
import { ResultRow } from "@/components/CalculatorForm";

type LegRow = { bearing: string; distance: string };

export default function TraverseClosurePage() {
  useEffect(() => {
    trackCalculator("traverse-closure");
  }, []);
  const [legs, setLegs] = useState<LegRow[]>([
    { bearing: "90", distance: "100" },
    { bearing: "180", distance: "100" },
    { bearing: "270", distance: "100" },
    { bearing: "0", distance: "100" },
  ]);
  const [result, setResult] = useState<TraverseClosureOutput | null>(null);

  function updateLeg(i: number, field: keyof LegRow, v: string) {
    setLegs((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: v };
      return next;
    });
  }

  function addLeg() {
    setLegs((prev) => [...prev, { bearing: "", distance: "" }]);
  }

  function removeLeg(i: number) {
    setLegs((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleCompute() {
    const parsed = legs
      .map((l) => ({
        bearing_deg: parseFloat(l.bearing),
        distance_ft: parseFloat(l.distance),
      }))
      .filter((l) => !isNaN(l.bearing_deg) && !isNaN(l.distance_ft));

    if (parsed.length < 2) return;
    setResult(compute({ legs: parsed }));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / Traverse closure
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Traverse Closure Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Compute closure error and precision ratio for a closed traverse, with
          Compass (Bowditch) adjustment. Enter bearings as azimuths (0-360
          degrees clockwise from north).
        </p>
      </header>

      <section className="rounded-lg border border-ink-100 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-ink-600">
                <th className="pb-2 pr-4 font-medium">#</th>
                <th className="pb-2 pr-4 font-medium">Azimuth (deg)</th>
                <th className="pb-2 pr-4 font-medium">Distance (ft)</th>
                <th className="pb-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {legs.map((leg, i) => (
                <tr key={i} className="border-b border-ink-50">
                  <td className="py-1.5 pr-4 text-ink-500">{i + 1}</td>
                  <td className="py-1.5 pr-4">
                    <input
                      type="number"
                      step="any"
                      value={leg.bearing}
                      onChange={(e) => updateLeg(i, "bearing", e.target.value)}
                      className="w-32 rounded-md border border-ink-200 px-2 py-1 text-sm outline-none focus:border-ink-400"
                    />
                  </td>
                  <td className="py-1.5 pr-4">
                    <input
                      type="number"
                      step="any"
                      value={leg.distance}
                      onChange={(e) => updateLeg(i, "distance", e.target.value)}
                      className="w-32 rounded-md border border-ink-200 px-2 py-1 text-sm outline-none focus:border-ink-400"
                    />
                  </td>
                  <td className="py-1.5">
                    <button
                      onClick={() => removeLeg(i)}
                      className="text-xs text-ink-400 hover:text-ink-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex gap-4">
          <button
            onClick={addLeg}
            className="rounded-md border border-ink-200 px-4 py-1.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
          >
            Add leg
          </button>
          <button
            onClick={handleCompute}
            className="rounded-md bg-ink-900 px-5 py-1.5 text-sm font-medium text-white transition hover:bg-ink-700"
          >
            Compute
          </button>
        </div>
      </section>

      {result && (
        <section className="mt-8 space-y-6">
          <div className="rounded-lg border border-ink-100 p-6">
            <h2 className="mb-4 text-lg font-semibold">Closure Summary</h2>
            <div className="space-y-0">
              <ResultRow label="Perimeter" value={result.perimeter_ft} unit="ft" />
              <ResultRow
                label="Closure error (north)"
                value={result.closure_error_north}
                unit="ft"
              />
              <ResultRow
                label="Closure error (east)"
                value={result.closure_error_east}
                unit="ft"
              />
              <ResultRow
                label="Linear closure"
                value={result.linear_closure_ft}
                unit="ft"
              />
              <ResultRow
                label="Precision ratio"
                value={result.precision_ratio}
              />
            </div>
          </div>

          {result.legs.length > 0 && (
            <div className="rounded-lg border border-ink-100 p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Adjusted Latitudes and Departures
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-200 text-ink-600">
                      <th className="pb-2 pr-4 font-medium">#</th>
                      <th className="pb-2 pr-4 font-medium">Az (deg)</th>
                      <th className="pb-2 pr-4 font-medium">Dist (ft)</th>
                      <th className="pb-2 pr-4 font-medium">Lat</th>
                      <th className="pb-2 pr-4 font-medium">Dep</th>
                      <th className="pb-2 pr-4 font-medium">Adj Lat</th>
                      <th className="pb-2 font-medium">Adj Dep</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {result.legs.map((leg, i) => (
                      <tr
                        key={i}
                        className="border-b border-ink-50 last:border-0"
                      >
                        <td className="py-1.5 pr-4 text-ink-500">{i + 1}</td>
                        <td className="py-1.5 pr-4">{leg.bearing_deg}</td>
                        <td className="py-1.5 pr-4">{leg.distance_ft}</td>
                        <td className="py-1.5 pr-4">{leg.latitude}</td>
                        <td className="py-1.5 pr-4">{leg.departure}</td>
                        <td className="py-1.5 pr-4">{leg.adj_latitude}</td>
                        <td className="py-1.5">{leg.adj_departure}</td>
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
            Adjustment method: Compass Rule (Bowditch). Reference: Wolf &amp;
            Ghilani, <em>Elementary Surveying</em>.
          </p>
        </section>
      )}
    </div>
  );
}
