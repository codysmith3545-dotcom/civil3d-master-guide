/**
 * Coordinate-text parsers for LandXML.
 *
 * LandXML stores coordinates as whitespace-separated decimal numbers in the
 * text body of elements like <P>, <Start>, <End>, <Center>, <PntList2D>,
 * <PntList3D>. The convention is northing-easting-elevation (3D) or
 * northing-easting (2D), but real-world files are inconsistent and we keep
 * the parser tolerant: it splits on any whitespace and groups by the
 * requested arity.
 */

export type Coord3 = [number, number, number];
export type Coord2 = [number, number];

function tokenize(text: string): number[] {
  const tokens = text.trim().split(/\s+/);
  const out: number[] = [];
  for (const t of tokens) {
    if (t === "") continue;
    // Number() returns NaN for unparseable tokens, which is what we want for
    // detection of INVALID_COORD downstream.
    out.push(Number(t));
  }
  return out;
}

/**
 * Parse coordinate triples (n, e, z) from text content. Returns one tuple
 * per group of three numbers. If the count is not a multiple of 3, the
 * trailing partial tuple is omitted but the leading complete tuples are
 * still returned.
 */
export function parseCoordTriples(text: string): Coord3[] {
  const nums = tokenize(text);
  if (nums.length === 0) return [];
  const out: Coord3[] = [];
  for (let i = 0; i + 3 <= nums.length; i += 3) {
    out.push([nums[i]!, nums[i + 1]!, nums[i + 2]!]);
  }
  return out;
}

/**
 * Parse coordinate pairs (n, e) from text content. Used for 2D point lists.
 */
export function parseCoordPairs(text: string): Coord2[] {
  const nums = tokenize(text);
  if (nums.length === 0) return [];
  const out: Coord2[] = [];
  for (let i = 0; i + 2 <= nums.length; i += 2) {
    out.push([nums[i]!, nums[i + 1]!]);
  }
  return out;
}

/**
 * Return the raw flat number list, preserving NaN for bad tokens. Used by
 * the validator to flag INVALID_COORD.
 */
export function tokenizeNumbers(text: string): number[] {
  return tokenize(text);
}
