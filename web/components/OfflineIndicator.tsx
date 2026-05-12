"use client";

import { useEffect, useState } from "react";

type Status = "online" | "offline-cached" | "offline-uncached";

/**
 * Small pill rendered in the page header showing network/cache status.
 *
 *  - Green "Online" when navigator.onLine.
 *  - Amber "Offline - using cached data" when offline + the current URL is in
 *    the service-worker cache.
 *  - Red "Not available offline" when offline + URL not cached.
 *
 * Listens to window online/offline events and to service-worker messages so
 * the pill updates reactively when connectivity flips.
 */
export default function OfflineIndicator() {
  const [status, setStatus] = useState<Status>("online");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const online =
        typeof navigator !== "undefined" ? navigator.onLine !== false : true;
      if (online) {
        if (!cancelled) setStatus("online");
        return;
      }
      const cached = await isCurrentUrlCached();
      if (!cancelled) setStatus(cached ? "offline-cached" : "offline-uncached");
    }

    check();
    const onChange = () => check();
    window.addEventListener("online", onChange);
    window.addEventListener("offline", onChange);
    navigator.serviceWorker?.addEventListener?.("message", onChange);
    return () => {
      cancelled = true;
      window.removeEventListener("online", onChange);
      window.removeEventListener("offline", onChange);
      navigator.serviceWorker?.removeEventListener?.("message", onChange);
    };
  }, []);

  const { label, classes, title } = render(status);
  return (
    <span
      role="status"
      aria-live="polite"
      title={title}
      className={
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium " +
        classes
      }
    >
      <span
        className={
          "inline-block h-2 w-2 rounded-full " +
          (status === "online"
            ? "bg-green-500"
            : status === "offline-cached"
              ? "bg-amber-500"
              : "bg-red-500")
        }
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

function render(s: Status): { label: string; classes: string; title: string } {
  switch (s) {
    case "online":
      return {
        label: "Online",
        classes: "border-green-200 bg-green-50 text-green-800",
        title: "Connected to the network.",
      };
    case "offline-cached":
      return {
        label: "Offline - using cached data",
        classes: "border-amber-200 bg-amber-50 text-amber-800",
        title:
          "No network. This page was previously cached so it is still available.",
      };
    case "offline-uncached":
      return {
        label: "Not available offline",
        classes: "border-red-200 bg-red-50 text-red-800",
        title:
          "No network and this page was not cached. Reconnect to load it.",
      };
  }
}

// Asks the active service worker whether the current URL has a cached entry.
// Returns false if the SW is unavailable or doesn't reply within 600 ms.
async function isCurrentUrlCached(): Promise<boolean> {
  if (typeof navigator === "undefined") return false;
  const sw = navigator.serviceWorker;
  if (!sw || !sw.controller) return false;
  return new Promise<boolean>((resolve) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => resolve(false), 600);
    channel.port1.onmessage = (e) => {
      clearTimeout(timer);
      resolve(!!(e.data && e.data.cached));
    };
    try {
      sw.controller!.postMessage(
        { type: "IS_CACHED", url: window.location.pathname },
        [channel.port2],
      );
    } catch {
      clearTimeout(timer);
      resolve(false);
    }
  });
}
