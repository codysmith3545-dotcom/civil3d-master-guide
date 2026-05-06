"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "c3d_outdoor_mode";

export default function OutdoorModeToggle() {
  const [outdoor, setOutdoor] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    const on = stored === "true";
    setOutdoor(on);
    if (on) {
      document.documentElement.setAttribute("data-outdoor", "true");
    }
  }, []);

  function toggle() {
    const next = !outdoor;
    setOutdoor(next);
    if (next) {
      document.documentElement.setAttribute("data-outdoor", "true");
      localStorage.setItem(STORAGE_KEY, "true");
    } else {
      document.documentElement.removeAttribute("data-outdoor");
      localStorage.setItem(STORAGE_KEY, "false");
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={outdoor}
      aria-label={
        outdoor ? "Disable outdoor high-contrast mode" : "Enable outdoor high-contrast mode"
      }
      title={outdoor ? "Outdoor mode on" : "Outdoor mode off"}
      className="inline-flex h-9 min-h-[44px] w-9 min-w-[44px] items-center justify-center rounded-md border border-ink-200 text-ink-700 hover:bg-ink-50 md:min-h-0 md:min-w-0"
    >
      {mounted && outdoor ? (
        <Moon className="h-4 w-4" aria-hidden />
      ) : (
        <Sun className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
