/**
 * Format detection. Heuristics over filename extension and the first few
 * non-blank lines of the text.
 */

import { parseCsvLine, parseNumberStrict } from "./csv.js";
import type { DcFormat } from "./types.js";

function firstDataLines(text: string, max = 5): string[] {
  const out: string[] = [];
  for (const raw of text.replace(/\r\n?/g, "\n").split("\n")) {
    const t = raw.trim();
    if (t.length === 0) continue;
    if (t.startsWith("#") || t.startsWith(";") || t.startsWith("//")) continue;
    out.push(t);
    if (out.length >= max) break;
  }
  return out;
}

const RW5_RECORD_TYPES = new Set([
  "JB", "MO", "OC", "BK", "BD", "BR", "FD", "AR", "SP", "SS", "TR",
  "GPS", "GP", "LS", "MS", "RP", "BP",
]);

export function detectFormat(text: string, filename?: string): DcFormat | "unknown" {
  // 1) Filename hint.
  const ext = (filename ?? "").toLowerCase().match(/\.([a-z0-9]+)$/)?.[1];
  if (ext === "rw5") return "carlson-rw5";

  // 2) Look at the body.
  const lines = firstDataLines(text);
  if (lines.length === 0) return "unknown";

  // RW5 detection: the first non-blank line is a JB (job) header, OR the
  // first record token is in the known set.
  const firstTok = lines[0]!.split(",")[0]!.trim().toUpperCase();
  if (RW5_RECORD_TYPES.has(firstTok)) return "carlson-rw5";

  // CSV-style detection: parse the first row.
  const cols = parseCsvLine(lines[0]!);
  if (!cols) return "unknown";

  // Trimble CSVs frequently have 6+ columns and a quoted description with a comma.
  const hasQuotedDesc = /,\s*"[^"]*,[^"]*"/.test(lines[0]!);
  if (hasQuotedDesc) return "trimble-csv";

  // Decide based on column count and numeric pattern.
  // PNEZD: 5 cols, [P, num, num, num, desc]
  // NEZD : 4 cols, [num, num, num, desc]
  // PXYZ : 4 cols, [P, num, num, num]
  if (cols.length >= 6) {
    // Likely Trimble (P,N,E,Z,D,attr...) or Topcon (P,N,E,Z,D,Note).
    // If column 5 (description) is empty or an integer, and column 6 looks like
    // a note string, prefer topcon. Otherwise trimble.
    const desc = cols[4] ?? "";
    if (desc.length > 0 && /[A-Za-z]/.test(desc) && /^[A-Za-z]/.test(cols[5] ?? "")) {
      return "topcon-csv";
    }
    return "trimble-csv";
  }
  if (cols.length === 5) return "generic-pnezd";
  if (cols.length === 4) {
    // PXYZ vs NEZD: in PXYZ the first column is the point id (often integer),
    // and the 4th col is numeric (Z). In NEZD the 4th col is description.
    const c0 = cols[0] ?? "";
    const c3 = cols[3] ?? "";
    const c0Numeric = !Number.isNaN(parseNumberStrict(c0));
    const c3Numeric = !Number.isNaN(parseNumberStrict(c3));
    if (c0Numeric && c3Numeric) return "generic-pxyz";
    return "generic-nezd";
  }

  return "unknown";
}
