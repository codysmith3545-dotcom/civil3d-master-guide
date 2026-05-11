/**
 * MCP wrapper for the @civil3d-master-guide/datacollector-import package.
 *
 * Exposes a single async function so the MCP tool handler stays thin.
 */

import {
  detectFormat,
  importText,
  type DcFormat,
  type DcImportResult,
} from "@civil3d-master-guide/datacollector-import";

export type ImportDataCollectorTextOptions = {
  /** Optional explicit format. If omitted, the format is auto-detected. */
  format?: DcFormat;
  /** Optional filename, used as a detection hint (e.g. ".rw5"). */
  filename?: string;
};

/**
 * Parse a data-collector text payload and return the parsed points + warnings.
 *
 * @throws Error if the format cannot be detected and no `format` is provided.
 */
export async function importDataCollectorText(
  text: string,
  options: ImportDataCollectorTextOptions = {},
): Promise<DcImportResult> {
  let fmt: DcFormat | "unknown" = options.format ?? "unknown";
  if (fmt === "unknown") {
    fmt = detectFormat(text, options.filename);
  }
  if (fmt === "unknown") {
    throw new Error(
      "Could not detect data-collector format. Provide an explicit `format` (one of: generic-pnezd, generic-nezd, generic-pxyz, trimble-csv, topcon-csv, carlson-rw5).",
    );
  }
  return importText(text, fmt);
}
