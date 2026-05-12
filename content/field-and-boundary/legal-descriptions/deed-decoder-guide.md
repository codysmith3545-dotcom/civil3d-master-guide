---
title: "Deed Decoder Guide"
section: "field-and-boundary/legal-descriptions"
order: 50
visibility: public
tags: [deed, metes-and-bounds, parser, automation, boundary]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "Wolf & Ghilani, Elementary Surveying, Ch. 22 (Land Surveys)"
    citation: "textbook reference, not linkable"
    verified: 2026-05-11
  - title: "865 IAC 1-12 Indiana Surveyor Rules"
    url: https://www.in.gov/pla/professions/professional-surveyors-home/
    verified: 2026-05-11
---

> **TL;DR**
> 1. The decoder reads a metes-and-bounds deed's prose, breaks it into structured courses, plots them, and reports closure and area.
> 2. It accepts the common Indiana phrasings (quadrant bearings to seconds, distances in feet, curves with R + L + chord), normalizes smart quotes, and tolerates "more or less" wording.
> 3. It is a parsing aid, not a substitute for a licensed surveyor's interpretation of calls; review the unparsed fragments and the closure precision before relying on the output.

## What this tool does

The decoder takes the body of a metes-and-bounds description and produces:

- A `parsed` traverse: an ordered list of line and curve courses with bearings normalized to a quadrant and to an azimuth in decimal degrees.
- A `plotted` traverse: the running coordinates from an assumed origin, the perimeter, the linear misclosure, and the precision ratio.
- A `summary`: counts of line vs curve courses, the number of unparsed fragments, the area in acres, and the source of the parse (built-in fallback vs. the `@civil3d-master-guide/deed-parser` package).

It does not adjust the traverse, distribute closure error, or attempt to compute a most-probable position. Those are jobs for a least-squares adjustment after the description has been parsed.

## Supported bearing formats

The parser is tolerant of common Indiana phrasings. All of the following resolve to the same quadrant bearing of N 45 deg 15 min 22 sec E:

- `North 45 degrees 15 minutes 22 seconds East`
- `N 45 deg 15 min 22 sec E`
- `N 45d15'22" E`
- `N 45 15 22 E`
- `N45-15-22 E`
- `N 45°15'22" E`

Smart quotes (curly apostrophe and curly double-quote) and the prime / double-prime symbols are normalized to ASCII before matching.

Cardinal bearings are accepted in two forms:

- `due North`, `due South`, `due East`, `due West`
- `N 00 deg 00 min 00 sec E`, `S 00 deg 00 min 00 sec E`, etc. — note that the parser requires the degrees-component to be at most 89, so a `due east` call should be written as `due East`, not as `N 90 deg 00 min 00 sec E`.

Azimuths in decimal degrees (without a quadrant) are not currently parsed; convert to quadrant first.

## Supported curve calls

A curve call is recognized when the segment contains the phrase `curve to the left` or `curve to the right`. The parser captures whichever of the following are present:

- Radius: `radius of 500.00 feet`
- Arc length: `arc length of 261.80 feet`, also `arc distance of ...`, also `length of ...`
- Central angle: `central angle of 30 degrees 00 minutes 00 seconds`, also `delta of ...`
- Chord bearing and chord distance: `chord bearing South 60 degrees 00 minutes 00 seconds East, 258.82 feet`

A curve is plotted by its chord when a chord bearing and chord distance are present. If only an arc length is given, the curve is recorded in `parsed.courses` but skipped for closure purposes. Non-tangent curves are parsed identically; the decoder does not check tangency.

## Distance formats

Distances are in U.S. survey feet. The recognized suffixes are `feet`, `foot`, `ft`, and the unit prime `'` after a number. Other linear units (chains, rods, varas, meters) are not converted; a course in those units lands in `parsed.unparsed` and is excluded from closure.

## What it can't do

- Chains, rods, varas, or any non-foot linear unit.
- Spelled-out distances ("two hundred fifty feet").
- Exception calls inside a single course ("thence ... excepting therefrom ...").
- Junior-rights resolution or any other call-priority adjudication.
- Curves with only deflection or only radius; a chord bearing and chord distance are needed for the curve to contribute to the closure.
- Bearings expressed as decimal-degree azimuths without a quadrant.

## Reading the closure report

The plotter reports two related numbers:

- `closureFt` (linear closure): the straight-line distance from the end of the last course back to the start. For a well-closed traverse this is small (under 0.1 ft for short urban parcels; under 1 ft for rural quarter-section perimeters).
- `precisionRatio`: `perimeter / closureFt`, reported as a single number. A traverse that closes 0.10 ft in a 5000 ft perimeter has a precision ratio of 50000, reported as 1:50000 in the conventional notation.

Rules of thumb commonly cited in Indiana practice:

- `1:5000` is the minimum precision required for a Class A urban survey under 865 IAC 1-12 (consult the rule for the exact threshold and class definitions).
- `1:10000` is the typical target for routine boundary work.
- `1:50000` or better is what you should see on a description that was written from coordinates rather than from chain-and-tape measurements.

When a deed yields a much worse closure than expected, suspect: a bearing transcription error, a missing course, a distance recorded in the wrong unit, or a curve that lost its tangency.

## Reading the anomalies

The `parsed.unparsed` array carries each fragment that the parser failed to interpret, with its offset into the normalized text. Codes you may see in future versions (the current parser uses free-form text):

- `BEARING_NOT_FOUND` -- the segment contained a distance but no recognizable bearing.
- `DISTANCE_NOT_FOUND` -- a bearing was recognized but no distance followed.
- `CURVE_MISSING_RADIUS` -- a curve call was identified but no radius captured.
- `UNIT_NOT_FEET` -- the distance was given in chains, rods, or another unit.

Anomaly codes link to the [glossary](../../glossary.md) when added.

## Three ways to use it

1. **Web UI.** The site exposes a paste-and-plot form at `/tools/deed-decoder`. (Paste-text is the only input currently supported; PDF upload and manual single-course entry are planned.)
2. **MCP tool `decode_deed`.** Any MCP-aware client (Claude Desktop, Claude Code, Cursor) can call `decode_deed` with `{ "text": "..." }` and receive the structured result. Use this from agentic workflows that need to inspect a deed before staking out a corner.
3. **CLI.** When the `@civil3d-master-guide/deed-parser` package publishes a CLI, you will be able to run `node packages/deed-parser/dist/cli.js < deed.txt`. The CLI may not ship in every release; check the package README before relying on it.

## Examples

### Example 1: a 5-acre rectangle

Input (excerpt):

```
Beginning at the Southwest Corner of said Quarter Section;
thence North 01 degrees 02 minutes 11 seconds East, 660.00 feet;
thence South 88 degrees 57 minutes 49 seconds East, 330.00 feet;
thence South 01 degrees 02 minutes 11 seconds West, 660.00 feet;
thence North 88 degrees 57 minutes 49 seconds West, 330.00 feet to the
Point of Beginning, containing 5.000 acres.
```

Expected output (abbreviated):

```json
{
  "summary": {
    "courseCount": 4,
    "lineCourses": 4,
    "curveCourses": 0,
    "perimeterFt": 1980.0,
    "areaAcres": 5.0,
    "precisionRatio": 1e9
  }
}
```

### Example 2: with a single curve

Input excerpt:

```
thence Southeasterly along a curve to the right having a radius of 500.00
feet, an arc length of 261.80 feet, and a chord bearing South 60 degrees 00
minutes 00 seconds East, a chord 258.82 feet;
```

The parser produces a `CurveCourse` with `direction: "right"`, `radiusFt: 500`, `arcLengthFt: 261.80`, `chordFt: 258.82`, and a `chordBearing` carrying both the quadrant `SE` and the azimuth `120.0` degrees.

### Example 3: stressor with smart quotes

Input excerpt:

```
thence N 45°15'22" E, 200.00';
thence S 44°44'38" E, 200.00';
```

The decoder normalizes the degree-symbol, the prime, and the double-prime, then parses both courses identically to their ASCII-spelled equivalents.

## On the bearing-to-azimuth conversion

The decoder converts quadrant bearings to azimuth using the standard formulas:

- NE quadrant: `azimuth = decimal degrees`
- SE: `azimuth = 180 - decimal degrees`
- SW: `azimuth = 180 + decimal degrees`
- NW: `azimuth = 360 - decimal degrees`

This is the convention given in Wolf and Ghilani, *Elementary Surveying*, Chapter 7 (Angles, Azimuths, and Bearings), and is consistent with how Civil 3D writes azimuths into a metes-and-bounds report under the Survey-tab tools.

## Related

- [Writing metes-and-bounds descriptions](writing-metes-and-bounds.md)
- [Bearings and basis of bearings](basis-of-bearings.md)
- [Common errors in legal descriptions](common-errors.md)
- [Description from a parcel (Civil 3D workflow)](description-from-parcel.md)
