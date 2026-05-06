"use client";

import { useState } from "react";
import Link from "next/link";
import {
  compute,
  type MetesAndBoundsOutput,
} from "@/lib/calculators/metes-and-bounds";
import { ResultRow } from "@/components/CalculatorForm";

type CoordRow = { northing: string; easting: string };

export default function MetesAndBoundsPage() {
  const [coords, setCoords] = useState<CoordRow[]>([
    { northing: "0", easting: "0" },
    { northing: "0", easting: "100" },
    { northing: "100", easting: "100" },
    { northing: "100", easting: "0" },
  ]);
  const [result, setResult] = useState<MetesAndBoundsOutput | null>(null);

  function updateCoord(i: number, field: keyof CoordRow, v: string) {
    setCoords((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: v };
      return next;
    });
  }

  function addCoord() {
    setCoords((prev) => [...prev, { northing: "", easting: "" }]);
  }

  function removeCoord(i: number) {
    setCoords((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleCompute() {
    const parsed = coords
      .map((c) => ({
        northing: parseFloat(c.northing),
        easting: parseFloat(c.easting),
      }))
      .filter((c) => !isNaN(c.northing) && !isNaN(c.easting));

    if (parsed.length < 3) return;
    setResult(compute({ coordinates: parsed }));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link href="/tools" className="hover:text-ink-800">
          Calculators
        </Link>{" "}
        / Metes &amp; bounds writer
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Metes &amp; Bounds Writer
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Generate a metes-and-bounds legal description from an ordered list of
          polygon coordinates. Enter coordinates in survey feet
          (northing/easting).
        </p>
      </header>

      <section className="rounded-lg border border-ink-100 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-ink-600">
                <th className="pb-2 pr-4 font-medium">#</th>
                <th className="pb-2 pr-4 font-medium">Northing (ft)</th>
                <th className="pb-2 pr-4 font-medium">Easting (ft)</th>
                <th className="pb-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {coords.map((c, i) => (
                <tr key={i} className="border-b border-ink-50">
                  <td className="py-1.5 pr-4 text-ink-500">{i + 1}</td>
                  <td className="py-1.5 pr-4">
                    <input
                      type="number"
                      step="any"
                      value={c.northing}
                      onChange={(e) =>
                        updateCoord(i, "northing", e.target.value)
                      }
                      className="w-36 rounded-md border border-ink-200 px-2 py-1 text-sm outline-none focus:border-ink-400"
                    />
                  </td>
                  <td className="py-1.5 pr-4">
                    <input
                      type="number"
                      step="any"
                      value={c.easting}
                      onChange={(e) =>
                        updateCoord(i, "easting", e.target.value)
                      }
                      className="w-36 rounded-md border border-ink-200 px-2 py-1 text-sm outline-none focus:border-ink-400"
                    />
                  </td>
                  <td className="py-1.5">
                    <button
                      onClick={() => removeCoord(i)}
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
            onClick={addCoord}
            className="rounded-md border border-ink-200 px-4 py-1.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
          >
            Add point
          </button>
          <button
            onClick={handleCompute}
            className="rounded-md bg-ink-900 px-5 py-1.5 text-sm font-medium text-white transition hover:bg-ink-700"
          >
            Generate description
          </button>
        </div>
      </section>

      {result && (
        <section className="mt-8 space-y-6">
          <div className="rounded-lg border border-ink-100 p-6">
            <h2 className="mb-4 text-lg font-semibold">Legal Description</h2>
            <textarea
              readOnly
              value={result.description}
              rows={Math.max(6, result.description.split("\n").length + 1)}
              className="w-full rounded-md border border-ink-200 bg-ink-50 p-3 font-mono text-sm text-ink-800"
            />
            <button
              onClick={() => navigator.clipboard.writeText(result.description)}
              className="mt-2 rounded-md border border-ink-200 px-4 py-1.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
            >
              Copy to clipboard
            </button>
          </div>

          <div className="rounded-lg border border-ink-100 p-6">
            <h2 className="mb-4 text-lg font-semibold">Summary</h2>
            <div className="space-y-0">
              <ResultRow label="Area" value={result.area_sqft} unit="sq ft" />
              <ResultRow label="Area" value={result.area_acres} unit="acres" />
              <ResultRow
                label="Perimeter"
                value={result.perimeter_ft}
                unit="ft"
              />
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
            Reference: Wolf &amp; Ghilani, <em>Elementary Surveying</em>;
            Brown, Robillard &amp; Wilson,{" "}
            <em>Evidence and Procedures for Boundary Location</em>.
          </p>
        </section>
      )}
    </div>
  );
}
