"use client";

import { useState } from "react";
import Link from "next/link";
import {
  compute,
  type LevelLoopOutput,
} from "@/lib/calculators/level-loop";
import { ResultRow } from "@/components/CalculatorForm";

type BenchmarkRow = { name: string; elevation: string };
type ObservationRow = {
  from: string;
  to: string;
  delta_h: string;
  distance: string;
};

export default function LevelLoopPage() {
  const [benchmarks, setBenchmarks] = useState<BenchmarkRow[]>([
    { name: "BM-1", elevation: "100" },
  ]);
  const [observations, setObservations] = useState<ObservationRow[]>([
    { from: "BM-1", to: "TP-1", delta_h: "3.25", distance: "200" },
    { from: "TP-1", to: "TP-2", delta_h: "-1.10", distance: "150" },
    { from: "TP-2", to: "BM-1", delta_h: "-2.18", distance: "180" },
  ]);
  const [result, setResult] = useState<LevelLoopOutput | null>(null);

  function updateBM(i: number, field: keyof BenchmarkRow, v: string) {
    setBenchmarks((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: v };
      return next;
    });
  }

  function addBM() {
    setBenchmarks((prev) => [...prev, { name: "", elevation: "" }]);
  }

  function removeBM(i: number) {
    setBenchmarks((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateObs(i: number, field: keyof ObservationRow, v: string) {
    setObservations((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: v };
      return next;
    });
  }

  function addObs() {
    setObservations((prev) => [
      ...prev,
      { from: "", to: "", delta_h: "", distance: "" },
    ]);
  }

  function removeObs(i: number) {
    setObservations((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleCompute() {
    const bms = benchmarks.map((b) => ({
      name: b.name.trim(),
      elevation: b.elevation ? parseFloat(b.elevation) : undefined,
    }));
    const obs = observations
      .filter((o) => o.from.trim() && o.to.trim() && o.delta_h)
      .map((o) => ({
        from: o.from.trim(),
        to: o.to.trim(),
        delta_h: parseFloat(o.delta_h),
        distance: o.distance ? parseFloat(o.distance) : undefined,
      }));

    if (obs.length === 0) return;
    setResult(compute({ benchmarks: bms, observations: obs }));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / Level loop adjustment
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Level Loop Adjustment
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Adjust a differential leveling loop. Enter benchmarks (at least one
          with a known elevation) and observations. If distances are provided,
          a weighted (proportional to distance) adjustment is used; otherwise
          the correction is distributed equally.
        </p>
      </header>

      {/* Benchmarks */}
      <section className="rounded-lg border border-ink-100 p-6">
        <h2 className="mb-4 text-base font-semibold">Benchmarks</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-ink-600">
                <th className="pb-2 pr-4 font-medium">Name</th>
                <th className="pb-2 pr-4 font-medium">
                  Known elevation (ft)
                </th>
                <th className="pb-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((bm, i) => (
                <tr key={i} className="border-b border-ink-50">
                  <td className="py-1.5 pr-4">
                    <input
                      type="text"
                      value={bm.name}
                      onChange={(e) => updateBM(i, "name", e.target.value)}
                      className="w-28 rounded-md border border-ink-200 px-2 py-1 text-sm outline-none focus:border-ink-400"
                    />
                  </td>
                  <td className="py-1.5 pr-4">
                    <input
                      type="number"
                      step="any"
                      value={bm.elevation}
                      onChange={(e) =>
                        updateBM(i, "elevation", e.target.value)
                      }
                      placeholder="optional"
                      className="w-32 rounded-md border border-ink-200 px-2 py-1 text-sm outline-none focus:border-ink-400"
                    />
                  </td>
                  <td className="py-1.5">
                    <button
                      onClick={() => removeBM(i)}
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
        <button
          onClick={addBM}
          className="mt-3 rounded-md border border-ink-200 px-4 py-1.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
        >
          Add benchmark
        </button>
      </section>

      {/* Observations */}
      <section className="mt-6 rounded-lg border border-ink-100 p-6">
        <h2 className="mb-4 text-base font-semibold">Observations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-ink-600">
                <th className="pb-2 pr-4 font-medium">From</th>
                <th className="pb-2 pr-4 font-medium">To</th>
                <th className="pb-2 pr-4 font-medium">Delta H (ft)</th>
                <th className="pb-2 pr-4 font-medium">Distance (ft)</th>
                <th className="pb-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {observations.map((obs, i) => (
                <tr key={i} className="border-b border-ink-50">
                  <td className="py-1.5 pr-4">
                    <input
                      type="text"
                      value={obs.from}
                      onChange={(e) => updateObs(i, "from", e.target.value)}
                      className="w-24 rounded-md border border-ink-200 px-2 py-1 text-sm outline-none focus:border-ink-400"
                    />
                  </td>
                  <td className="py-1.5 pr-4">
                    <input
                      type="text"
                      value={obs.to}
                      onChange={(e) => updateObs(i, "to", e.target.value)}
                      className="w-24 rounded-md border border-ink-200 px-2 py-1 text-sm outline-none focus:border-ink-400"
                    />
                  </td>
                  <td className="py-1.5 pr-4">
                    <input
                      type="number"
                      step="any"
                      value={obs.delta_h}
                      onChange={(e) =>
                        updateObs(i, "delta_h", e.target.value)
                      }
                      className="w-28 rounded-md border border-ink-200 px-2 py-1 text-sm outline-none focus:border-ink-400"
                    />
                  </td>
                  <td className="py-1.5 pr-4">
                    <input
                      type="number"
                      step="any"
                      value={obs.distance}
                      onChange={(e) =>
                        updateObs(i, "distance", e.target.value)
                      }
                      placeholder="optional"
                      className="w-28 rounded-md border border-ink-200 px-2 py-1 text-sm outline-none focus:border-ink-400"
                    />
                  </td>
                  <td className="py-1.5">
                    <button
                      onClick={() => removeObs(i)}
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
        <button
          onClick={addObs}
          className="mt-3 rounded-md border border-ink-200 px-4 py-1.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
        >
          Add observation
        </button>
      </section>

      <button
        onClick={handleCompute}
        className="mt-6 rounded-md bg-ink-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-ink-700"
      >
        Compute
      </button>

      {result && (
        <section className="mt-8 space-y-6">
          <div className="rounded-lg border border-ink-100 p-6">
            <h2 className="mb-4 text-lg font-semibold">Adjusted Elevations</h2>
            <div className="space-y-0">
              {Object.entries(result.elevations).map(([name, elev]) => (
                <ResultRow key={name} label={name} value={elev} unit="ft" />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-ink-100 p-6">
            <h2 className="mb-4 text-lg font-semibold">Closure</h2>
            <div className="space-y-0">
              <ResultRow label="Misclosure" value={result.closure_ft} unit="ft" />
              <ResultRow label="Adjustment method" value={result.method} />
            </div>
          </div>

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
            Reference: Wolf &amp; Ghilani, <em>Elementary Surveying</em>.
          </p>
        </section>
      )}
    </div>
  );
}
