/**
 * Shared types for data-collector import / export.
 *
 * @module @civil3d-master-guide/datacollector-import/types
 */

export interface DcPoint {
  /** Point identifier. Strings are accepted because some collectors use alphanumeric IDs (e.g. "CP1"). */
  number: string;
  /** Northing coordinate (units as given by the source file; typically survey feet or meters). */
  northing: number;
  /** Easting coordinate. */
  easting: number;
  /** Elevation. */
  elevation: number;
  /** Raw description (the "D" column in PNEZD). */
  description: string;
  /** Additional notes from the collector (e.g. RW5 "--" notes). Optional. */
  notes?: string;
  /** Optional layer / feature-code hint, when present in the source. */
  layer?: string;
}

export type DcFormat =
  | "trimble-csv"
  | "topcon-csv"
  | "carlson-rw5"
  | "generic-pnezd"
  | "generic-nezd"
  | "generic-pxyz";

export interface DcImportResult {
  format: DcFormat;
  points: DcPoint[];
  /** Non-fatal issues: skipped lines, unrecognised RW5 records, malformed rows, etc. */
  warnings: string[];
}

/** Columns supported by `exportCsv`. P=point, N=northing, E=easting, Z=elevation, D=description. */
export type DcCsvColumn = "P" | "N" | "E" | "Z" | "D";
