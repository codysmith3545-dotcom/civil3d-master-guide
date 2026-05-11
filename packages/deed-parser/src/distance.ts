/**
 * Distance parser.
 *
 * Accepts a numeric distance in U.S. survey feet expressed in any of these
 * forms (case-insensitive):
 *   - "100.00 feet"
 *   - "100.00 ft"
 *   - "100.00'"          (apostrophe foot mark)
 *   - "100 feet to a point"
 *   - "100.00 feet, more or less"
 *
 * Returns:
 *   {
 *     feet: 100.00,
 *     source: "100.00 feet",
 *     moreOrLess: false,
 *   }
 * or `null` for unsupported forms (spelled-out numbers, chains, rods, varas).
 *
 * Chains / rods / varas: NOT supported in v1. The README documents how a
 * downstream caller can post-process to handle them.
 */

export interface ParsedDistance {
  feet: number;
  source: string;
  moreOrLess: boolean;
}

const FEET_UNITS = /(?:feet|foot|ft\.?|')/i;
const NUMBER = /\d+(?:,\d{3})*(?:\.\d+)?/;

/**
 * Try to match a distance at the START of `text`. Returns the parsed value
 * plus the consumed source text so callers can slice the remainder.
 */
export function parseDistance(text: string): ParsedDistance | null {
  if (typeof text !== "string") return null;

  // Form A: "100.00 feet" / "100 ft" / "100.00'"
  const re = new RegExp(
    `^\\s*(${NUMBER.source})\\s*(?:${FEET_UNITS.source})(\\s*,?\\s*more\\s+or\\s+less)?`,
    "i",
  );
  const m = re.exec(text);
  if (!m) return null;

  const numStr = m[1].replace(/,/g, "");
  const feet = Number(numStr);
  if (!Number.isFinite(feet)) return null;

  return {
    feet,
    source: m[0].trim(),
    moreOrLess: Boolean(m[2]),
  };
}
