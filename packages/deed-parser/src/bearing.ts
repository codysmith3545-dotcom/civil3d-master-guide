/**
 * Bearing parser.
 *
 * Accepts a wide range of quadrant-bearing text forms and returns a normalized
 * {@link Bearing} with both the original DMS triple and a decimal-degree
 * azimuth (0..360, clockwise from north).
 *
 * Supported forms (case-insensitive):
 *   - `N 45°30'00" E`
 *   - `N45°30'00"E`            (no spaces)
 *   - `N 45 deg 30 min 00 sec E`
 *   - `N 45 degrees 30 minutes 00 seconds E`
 *   - `North 45 degrees 30 minutes 00 seconds East`
 *   - `N45-30-00E`             (dash-separated)
 *   - `N 45° 30' East`         (missing seconds -> 0)
 *   - `N 45° E`                (missing minutes and seconds -> 0)
 *   - `due north` / `due east` / `due south` / `due west`
 *
 * Returns `null` for inputs that don't match any supported form (callers can
 * then log the text as unparsed).
 *
 * Azimuth convention:
 *   NE: az = D + M/60 + S/3600
 *   SE: az = 180 - (D + M/60 + S/3600)
 *   SW: az = 180 + (D + M/60 + S/3600)
 *   NW: az = 360 - (D + M/60 + S/3600)
 * Matches mcp-server/src/calculators/traverse-closure.ts (0 = N, 90 = E).
 */

import type { Bearing, BearingQuadrant } from "./types.js";

const NS_WORDS: Record<string, "N" | "S"> = {
  n: "N",
  "n.": "N",
  no: "N",
  nor: "N",
  north: "N",
  s: "S",
  "s.": "S",
  so: "S",
  sou: "S",
  south: "S",
};

const EW_WORDS: Record<string, "E" | "W"> = {
  e: "E",
  "e.": "E",
  ea: "E",
  east: "E",
  w: "W",
  "w.": "W",
  we: "W",
  west: "W",
};

function lookupNS(token: string): "N" | "S" | null {
  return NS_WORDS[token.toLowerCase()] ?? null;
}

function lookupEW(token: string): "E" | "W" | null {
  return EW_WORDS[token.toLowerCase()] ?? null;
}

function quadrantFromNSEW(ns: "N" | "S", ew: "E" | "W"): BearingQuadrant {
  return `${ns}${ew}` as BearingQuadrant;
}

export function azimuthFromQuadrant(
  quadrant: BearingQuadrant,
  degrees: number,
  minutes: number,
  seconds: number,
): number {
  const dms = degrees + minutes / 60 + seconds / 3600;
  switch (quadrant) {
    case "NE":
      return dms;
    case "SE":
      return 180 - dms;
    case "SW":
      return 180 + dms;
    case "NW":
      return 360 - dms;
  }
}

function makeBearing(
  raw: string,
  quadrant: BearingQuadrant,
  degrees: number,
  minutes: number,
  seconds: number,
): Bearing {
  return {
    raw,
    quadrant,
    degrees,
    minutes,
    seconds,
    azimuthDeg: azimuthFromQuadrant(quadrant, degrees, minutes, seconds),
  };
}

// "due north", "due east", etc. → cardinal bearings.
// We assign quadrant by convention: due N -> NE/0 (could also be NW); due E -> NE/90.
function tryDueCardinal(text: string): Bearing | null {
  const m = /^\s*due\s+(north|south|east|west)\s*$/i.exec(text);
  if (!m) return null;
  const dir = m[1].toLowerCase();
  switch (dir) {
    case "north":
      return makeBearing(text.trim(), "NE", 0, 0, 0); // az 0
    case "east":
      return makeBearing(text.trim(), "NE", 90, 0, 0); // az 90
    case "south":
      return makeBearing(text.trim(), "SE", 0, 0, 0); // az 180
    case "west":
      return makeBearing(text.trim(), "NW", 90, 0, 0); // az 270
  }
  return null;
}

// Strip a few common decorations to make matching easier without losing data.
function stripDecorations(s: string): string {
  return s
    .replace(/\bdegrees?\b/gi, "°")
    .replace(/\bdeg\.?\b/gi, "°")
    .replace(/\bminutes?\b/gi, "'")
    .replace(/\bmin\.?\b/gi, "'")
    .replace(/\bseconds?\b/gi, '"')
    .replace(/\bsec\.?\b/gi, '"');
}

/**
 * Core regex for a quadrant bearing with optional minutes/seconds.
 * Allows degree/minute/second markers to be °, ', ", or absent in dash form.
 */
function tryQuadrantMarkers(raw: string): Bearing | null {
  const text = stripDecorations(raw);

  // Forms with explicit °, ', " markers (or any subset).
  // Captures: ns, deg, min?, sec?, ew
  // - N 45° 30' 00" E
  // - N 45° E
  // - N 45° 30' E
  const re =
    /^\s*(N|S|North|South|No|So)\s*\.?\s*(\d{1,3}(?:\.\d+)?)\s*°\s*(?:(\d{1,2}(?:\.\d+)?)\s*'\s*(?:(\d{1,2}(?:\.\d+)?)\s*")?)?\s*(E|W|East|West|Ea|We)\.?\s*$/i;
  const m = re.exec(text);
  if (!m) return null;

  const ns = lookupNS(m[1]);
  const ew = lookupEW(m[5]);
  if (!ns || !ew) return null;

  const degrees = Number(m[2]);
  const minutes = m[3] === undefined ? 0 : Number(m[3]);
  const seconds = m[4] === undefined ? 0 : Number(m[4]);

  if (!isValidDms(degrees, minutes, seconds)) return null;
  return makeBearing(raw.trim(), quadrantFromNSEW(ns, ew), degrees, minutes, seconds);
}

// Dash-separated form: N45-30-00E (no markers).
function tryDashForm(raw: string): Bearing | null {
  const re =
    /^\s*(N|S)\s*(\d{1,3}(?:\.\d+)?)\s*[-–—]\s*(\d{1,2}(?:\.\d+)?)\s*(?:[-–—]\s*(\d{1,2}(?:\.\d+)?))?\s*(E|W)\s*$/i;
  const m = re.exec(raw);
  if (!m) return null;
  const ns = lookupNS(m[1]);
  const ew = lookupEW(m[5]);
  if (!ns || !ew) return null;
  const degrees = Number(m[2]);
  const minutes = Number(m[3]);
  const seconds = m[4] === undefined ? 0 : Number(m[4]);
  if (!isValidDms(degrees, minutes, seconds)) return null;
  return makeBearing(raw.trim(), quadrantFromNSEW(ns, ew), degrees, minutes, seconds);
}

function isValidDms(d: number, m: number, s: number): boolean {
  if (!Number.isFinite(d) || !Number.isFinite(m) || !Number.isFinite(s)) return false;
  if (d < 0 || d > 90) return false;
  if (m < 0 || m >= 60) return false;
  if (s < 0 || s >= 60) return false;
  return true;
}

/**
 * Parse a single bearing string. Returns null if the text doesn't match a
 * supported form (e.g. spelled-out English like "forty-five degrees").
 */
export function parseBearing(text: string): Bearing | null {
  if (typeof text !== "string" || text.trim() === "") return null;

  // "due" cardinals first.
  const due = tryDueCardinal(text);
  if (due) return due;

  // Try marker-based form (handles "deg/min/sec" via stripDecorations).
  const m1 = tryQuadrantMarkers(text);
  if (m1) return m1;

  // Try dash-separated form.
  const m2 = tryDashForm(text);
  if (m2) return m2;

  return null;
}
