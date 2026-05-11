"use client";

import { useEffect } from "react";

/**
 * Registers /sw.js once on mount in production builds. Dev mode skips
 * registration to avoid stale-cache surprises during development.
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch(() => {
        // Registration failure is non-fatal; the app still works online.
      });
  }, []);
  return null;
}
