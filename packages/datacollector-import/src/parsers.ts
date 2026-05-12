/**
 * Format-specific parsers. Each parser returns `{ points, warnings }`.
 *
 * All parsers are forgiving about:
 *  - blank lines
 *  - comment lines beginning with `#`, `;`, or `//`
 *  - inconsistent line endings (CRLF / LF)
 *
 * They are strict about:
 *  - numeric coordinate fields (rejected to warnings if non-numeric)
 *  - column count when a fixed column order is required
 */

import { parseCsvLine, parseNumberStrict } from "./csv.js";
import type { DcPoint } from "./types.js";

export interface ParserOutput {
  points: DcPoint[];
  warnings: string[];
}

function splitLines(text: string): string[] {
  return text.replace(/\r\n?/g, "\n").split("\n");
}

/**
 * `numericSlots` are the column indices that MUST be numeric in a data row
 * (i.e. coordinate columns). Header rows fail every numeric slot.
 */
function looksLikeHeader(cols: string[], numericSlots: number[]): boolean {
  if (numericSlots.length === 0) return false;
  for (const i of numericSlots) {
    const c = cols[i] ?? "";
    // If even one numeric slot parses as a finite number, it's a data row.
    if (!Number.isNaN(parseNumberStrict(c))) return false;
  }
  // All numeric slots failed. If they all also contain letters, it's a header.
  for (const i of numericSlots) {
    const c = cols[i] ?? "";
    if (!/[A-Za-z]/.test(c)) return false;
  }
  return true;
}

interface FixedCsvOptions {
  /** Column order, e.g. ["P","N","E","Z","D"] for PNEZD. Use "X","Y" interchangeably with N/E only when the name says so. */
  columns: ("P" | "N" | "E" | "Z" | "D" | "X" | "Y")[];
  /** Whether the description column is permitted to be empty. */
  descriptionOptional?: boolean;
}

/** Generic fixed-order CSV parser shared by PNEZD / NEZD / PXYZ. */
function parseFixedCsv(text: string, opts: FixedCsvOptions): ParserOutput {
  const points: DcPoint[] = [];
  const warnings: string[] = [];
  const lines = splitLines(text);
  let pointSeq = 0;

  const expected = opts.columns.length;
  const hasP = opts.columns.includes("P");
  const numericSlots = opts.columns
    .map((c, i) => (c === "N" || c === "E" || c === "Z" || c === "X" || c === "Y" ? i : -1))
    .filter((i) => i >= 0);

  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    const line = lines[lineNo]!;
    const cols = parseCsvLine(line);
    if (cols === null) continue;

    if (lineNo === 0 && looksLikeHeader(cols, numericSlots)) {
      // Skip a header row silently when every numeric slot has alpha content.
      continue;
    }

    // Allow trailing description fields with commas: if more cols than expected,
    // join the extras back into the last field.
    let workCols = cols;
    if (cols.length > expected) {
      const lastIdx = expected - 1;
      const lastJoined = cols.slice(lastIdx).join(",");
      workCols = [...cols.slice(0, lastIdx), lastJoined];
    }

    if (workCols.length < expected - (opts.descriptionOptional ? 1 : 0)) {
      warnings.push(`Line ${lineNo + 1}: expected ${expected} columns, got ${cols.length}; skipped.`);
      continue;
    }

    const rec: Partial<DcPoint> = {};
    let bad = false;
    for (let i = 0; i < opts.columns.length; i++) {
      const col = opts.columns[i]!;
      const raw = workCols[i] ?? "";
      switch (col) {
        case "P":
          rec.number = raw.length > 0 ? raw : String(++pointSeq);
          break;
        case "N":
        case "Y": {
          const v = parseNumberStrict(raw);
          if (Number.isNaN(v)) {
            warnings.push(`Line ${lineNo + 1}: northing/Y not numeric ("${raw}"); skipped.`);
            bad = true;
          }
          rec.northing = v;
          break;
        }
        case "E":
        case "X": {
          const v = parseNumberStrict(raw);
          if (Number.isNaN(v)) {
            warnings.push(`Line ${lineNo + 1}: easting/X not numeric ("${raw}"); skipped.`);
            bad = true;
          }
          rec.easting = v;
          break;
        }
        case "Z": {
          const v = parseNumberStrict(raw);
          if (Number.isNaN(v)) {
            warnings.push(`Line ${lineNo + 1}: elevation not numeric ("${raw}"); skipped.`);
            bad = true;
          }
          rec.elevation = v;
          break;
        }
        case "D":
          rec.description = raw;
          break;
      }
    }
    if (bad) continue;
    if (!hasP) rec.number = String(++pointSeq);
    if (rec.description === undefined) rec.description = "";
    points.push(rec as DcPoint);
  }

  return { points, warnings };
}

export function parseGenericPnezd(text: string): ParserOutput {
  return parseFixedCsv(text, { columns: ["P", "N", "E", "Z", "D"] });
}

export function parseGenericNezd(text: string): ParserOutput {
  return parseFixedCsv(text, { columns: ["N", "E", "Z", "D"] });
}

export function parseGenericPxyz(text: string): ParserOutput {
  // P,X,Y,Z (no description). X = easting, Y = northing.
  return parseFixedCsv(text, {
    columns: ["P", "X", "Y", "Z"],
    descriptionOptional: true,
  });
}

/**
 * Trimble CSV. In practice these are PNEZD with quoted descriptions and
 * sometimes extra attribute columns appended after the description. We honour
 * the first 5 columns and append any extras into `notes`.
 */
export function parseTrimbleCsv(text: string): ParserOutput {
  const points: DcPoint[] = [];
  const warnings: string[] = [];
  const lines = splitLines(text);

  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    const cols = parseCsvLine(lines[lineNo]!);
    if (cols === null) continue;
    if (lineNo === 0 && looksLikeHeader(cols, [1, 2, 3])) continue;

    if (cols.length < 5) {
      warnings.push(`Line ${lineNo + 1}: expected at least 5 columns, got ${cols.length}; skipped.`);
      continue;
    }

    const number = cols[0]!;
    const northing = parseNumberStrict(cols[1]!);
    const easting = parseNumberStrict(cols[2]!);
    const elevation = parseNumberStrict(cols[3]!);
    if ([northing, easting, elevation].some((v) => Number.isNaN(v))) {
      warnings.push(`Line ${lineNo + 1}: non-numeric coordinate; skipped.`);
      continue;
    }
    const description = cols[4]!;
    const extras = cols.slice(5).filter((s) => s.length > 0);
    const point: DcPoint = {
      number,
      northing,
      easting,
      elevation,
      description,
    };
    if (extras.length > 0) point.notes = extras.join(" | ");
    points.push(point);
  }

  return { points, warnings };
}

/**
 * Topcon CSV. Common variants:
 *   1) P,N,E,Z,D            (same as PNEZD)
 *   2) P,N,E,Z,D,Note       (notes appended as the 6th column)
 * We treat the 5th column as description and any 6th as notes.
 */
export function parseTopconCsv(text: string): ParserOutput {
  const points: DcPoint[] = [];
  const warnings: string[] = [];
  const lines = splitLines(text);

  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    const cols = parseCsvLine(lines[lineNo]!);
    if (cols === null) continue;
    if (lineNo === 0 && looksLikeHeader(cols, [1, 2, 3])) continue;

    if (cols.length < 5) {
      warnings.push(`Line ${lineNo + 1}: expected at least 5 columns, got ${cols.length}; skipped.`);
      continue;
    }
    const number = cols[0]!;
    const northing = parseNumberStrict(cols[1]!);
    const easting = parseNumberStrict(cols[2]!);
    const elevation = parseNumberStrict(cols[3]!);
    if ([northing, easting, elevation].some((v) => Number.isNaN(v))) {
      warnings.push(`Line ${lineNo + 1}: non-numeric coordinate; skipped.`);
      continue;
    }
    const description = cols[4]!;
    const point: DcPoint = {
      number,
      northing,
      easting,
      elevation,
      description,
    };
    if (cols.length >= 6 && cols[5] && cols[5].length > 0) {
      point.notes = cols[5];
    }
    points.push(point);
  }
  return { points, warnings };
}

/**
 * Carlson SurvCE / SurvPC RW5 raw-data file.
 *
 * Each line begins with a 2-character record type, followed by comma-separated
 * subfields. Position-bearing record types we extract:
 *   - SP  Stored point: SP,PN<num>,N <n>,E <e>,EL <el>,--<desc>
 *   - GPS GNSS-derived point: GPS,PN<num>,N <n>,E <e>,EL <el>,--<desc>
 *   - GP  Some firmware variants: GP,PN<num>,LA<lat>,LN<lon>,EL<el>,--<desc>  (lat/lon, ignored)
 *
 * Comment / note lines start with `--`. Other record types (BD, FD, OC, BK,
 * AR, BP, LS, SS, MO, JB, MS, etc.) are not point-positions and are appended
 * to warnings for visibility.
 *
 * Ref: Carlson SurvCE Reference Manual, RW5 file format appendix.
 */
export function parseCarlsonRw5(text: string): ParserOutput {
  const points: DcPoint[] = [];
  const warnings: string[] = [];
  const lines = splitLines(text);

  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    const raw = lines[lineNo]!;
    const line = raw.trim();
    if (line.length === 0) continue;
    if (line.startsWith("--")) continue; // free-form note; not a record

    // Record type is the first comma-separated token (typically 2 chars).
    const firstComma = line.indexOf(",");
    const rtype = (firstComma >= 0 ? line.slice(0, firstComma) : line).toUpperCase();

    if (rtype !== "SP" && rtype !== "GPS" && rtype !== "GP") {
      warnings.push(`Line ${lineNo + 1}: ${rtype} record retained as note (non-position).`);
      continue;
    }

    // Parse subfields. Tokens look like "PN5", "N 5000.123", "E 5000.456",
    // "EL 800.12", and the description is the trailing "--<text>" tail.
    const body = firstComma >= 0 ? line.slice(firstComma + 1) : "";

    // Split off description first (everything from the first " --" onwards).
    let descPart = "";
    let codePart = body;
    const descIdx = body.indexOf("--");
    if (descIdx >= 0) {
      descPart = body.slice(descIdx + 2).trim();
      codePart = body.slice(0, descIdx).trim().replace(/,\s*$/, "");
    }

    const fields = codePart.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
    let number = "";
    let northing = NaN;
    let easting = NaN;
    let elevation = NaN;
    let skip = false;

    for (const f of fields) {
      const m = f.match(/^([A-Za-z]+)\s*(.*)$/);
      if (!m) continue;
      const tag = m[1]!.toUpperCase();
      const val = m[2]!.trim();
      switch (tag) {
        case "PN":
          number = val;
          break;
        case "N": {
          const v = parseNumberStrict(val);
          if (Number.isNaN(v)) skip = true;
          northing = v;
          break;
        }
        case "E": {
          const v = parseNumberStrict(val);
          if (Number.isNaN(v)) skip = true;
          easting = v;
          break;
        }
        case "EL":
        case "ELEV": {
          const v = parseNumberStrict(val);
          if (Number.isNaN(v)) skip = true;
          elevation = v;
          break;
        }
        case "LA":
        case "LN":
          // GPS lat/lon variants: skip — we only extract grid coords here.
          skip = true;
          break;
        default:
          // Ignore unknown tags silently; surveyors stash a lot in here.
          break;
      }
    }

    if (skip || number.length === 0 || [northing, easting, elevation].some((v) => Number.isNaN(v))) {
      warnings.push(`Line ${lineNo + 1}: ${rtype} record incomplete or non-grid; skipped.`);
      continue;
    }

    points.push({
      number,
      northing,
      easting,
      elevation,
      description: descPart,
    });
  }

  return { points, warnings };
}
