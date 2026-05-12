/**
 * @civil3d-master-guide/datacollector-import
 *
 * Pure-TypeScript importer / parser / exporter for surveying data-collector
 * files (PNEZD, NEZD, PXYZ, Trimble CSV, Topcon CSV, Carlson RW5).
 *
 * Zero runtime dependencies; works in Node and the browser.
 */

import { detectFormat } from "./detect.js";
import {
  parseCarlsonRw5,
  parseGenericNezd,
  parseGenericPnezd,
  parseGenericPxyz,
  parseTopconCsv,
  parseTrimbleCsv,
} from "./parsers.js";
import { exportCsv, exportLandXML, exportPnezd } from "./exporters.js";
import type {
  DcCsvColumn,
  DcFormat,
  DcImportResult,
  DcPoint,
} from "./types.js";

export type { DcCsvColumn, DcFormat, DcImportResult, DcPoint };
export { detectFormat, exportCsv, exportLandXML, exportPnezd };

/** Parse a text payload using the given format. */
export function importText(text: string, format: DcFormat): DcImportResult {
  switch (format) {
    case "generic-pnezd":
      return { format, ...parseGenericPnezd(text) };
    case "generic-nezd":
      return { format, ...parseGenericNezd(text) };
    case "generic-pxyz":
      return { format, ...parseGenericPxyz(text) };
    case "trimble-csv":
      return { format, ...parseTrimbleCsv(text) };
    case "topcon-csv":
      return { format, ...parseTopconCsv(text) };
    case "carlson-rw5":
      return { format, ...parseCarlsonRw5(text) };
  }
}

/**
 * Convenience: detect format then parse. If detection fails, throws.
 * Caller should fall back to `importText(text, explicitFormat)`.
 */
export function importAuto(text: string, filename?: string): DcImportResult {
  const fmt = detectFormat(text, filename);
  if (fmt === "unknown") {
    throw new Error(
      "Could not auto-detect data-collector format. Specify a format explicitly via importText().",
    );
  }
  return importText(text, fmt);
}

/**
 * Names of binary collector formats that this package does not parse.
 * Surveyors should export to CSV from their data collector first.
 */
export const UNSUPPORTED_BINARY_FORMATS = [
  "carlson-crd", // Carlson legacy binary points file
  "carlson-crdb", // Carlson SQLite-backed coordinate file
  "trimble-job", // Trimble JobXML/.job binary
  "trimble-dc", // Trimble TDS .dc data-collector format
] as const;
export type UnsupportedBinaryFormat =
  (typeof UNSUPPORTED_BINARY_FORMATS)[number];
