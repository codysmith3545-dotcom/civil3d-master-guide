/**
 * Tiny CSV row parser that handles double-quoted fields with embedded commas.
 *
 * Returns null for blank lines (so callers can skip them cleanly).
 * Does not perform any column-level validation; that is the parser's job.
 */
export function parseCsvLine(line: string): string[] | null {
  const trimmed = line.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.startsWith("#") || trimmed.startsWith(";") || trimmed.startsWith("//")) {
    return null;
  }

  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  let i = 0;
  while (i < line.length) {
    const ch = line[i]!;
    if (inQuotes) {
      if (ch === '"') {
        // Doubled quote inside a quoted field becomes a literal quote.
        if (line[i + 1] === '"') {
          cur += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cur += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ",") {
      out.push(cur);
      cur = "";
      i++;
      continue;
    }
    cur += ch;
    i++;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

/** Quote a CSV field if it needs quoting. */
export function csvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Parse a number strictly: must be finite. Returns NaN if blank or unparseable. */
export function parseNumberStrict(s: string): number {
  const t = s.trim();
  if (t.length === 0) return NaN;
  // Accept trailing units like "ft" only if explicitly sanitised. Keep this strict.
  if (!/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(t)) return NaN;
  return Number(t);
}
