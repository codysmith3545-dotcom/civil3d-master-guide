"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UseMyLocationButton() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onClick = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setStatus("Geolocation is not available in this browser.");
      return;
    }
    setBusy(true);
    setStatus("Requesting location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        router.push(
          `/jurisdictions/at/${latitude.toFixed(6)}/${longitude.toFixed(6)}`,
        );
      },
      (err) => {
        setBusy(false);
        setStatus("Could not get location: " + err.message);
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className="btn btn-primary"
      >
        {busy ? "Locating…" : "Use my location"}
      </button>
      {status ? (
        <p className="mt-2 text-xs text-ink-500">{status}</p>
      ) : null}
    </div>
  );
}
