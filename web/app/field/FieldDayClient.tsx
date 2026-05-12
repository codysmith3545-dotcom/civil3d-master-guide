"use client";

import Link from "next/link";
import { useState } from "react";

type Calc = { href: string; label: string };

export default function FieldDayClient({ calculators }: { calculators: Calc[] }) {
  const [status, setStatus] = useState<string>("");
  const [showCalcs, setShowCalcs] = useState(false);

  function findMyLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("Geolocation is not supported on this device.");
      return;
    }
    setStatus("Getting GPS fix...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(5);
        const lng = pos.coords.longitude.toFixed(5);
        // Hard navigate so the cached jurisdictions/at page can render.
        window.location.href = `/jurisdictions/at/${lat}/${lng}`;
      },
      (err) => {
        setStatus("GPS error: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={findMyLocation}
        className="block w-full rounded-lg border-2 border-ink-300 bg-ink-900 px-6 py-6 text-left text-lg font-semibold text-white hover:bg-ink-800"
      >
        My location -&gt; jurisdiction rules
      </button>
      {status && (
        <p className="text-sm text-ink-600" role="status">
          {status}
        </p>
      )}

      <button
        type="button"
        onClick={() => setShowCalcs((v) => !v)}
        aria-expanded={showCalcs}
        className="block w-full rounded-lg border-2 border-ink-300 px-6 py-6 text-left text-lg font-semibold hover:border-ink-500"
      >
        Calculators ({calculators.length})
        <span className="ml-2 text-sm font-normal text-ink-600">
          {showCalcs ? "(hide)" : "(tap to expand)"}
        </span>
      </button>
      {showCalcs && (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {calculators.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                className="block rounded-md border border-ink-200 bg-white px-4 py-3 text-base hover:border-ink-400"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
