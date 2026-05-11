# @civil3d-master-guide/deed-parser

Zero-dependency TypeScript parser for the metes-and-bounds portion of a U.S.
legal description. Turns raw deed text into an ordered, typed list of line
and curve courses suitable for downstream traverse calculation, plotting, or
LandXML export.

This package is the **parser core only**. It does not draw, plot, or compute
closure — those concerns live in sibling packages (`@civil3d-master-guide/sdk`
for calculators, and the forthcoming plotting / web-UI / MCP integrations).

## What it does

```ts
import { parseDeedText } from "@civil3d-master-guide/deed-parser";

const t = parseDeedText(`
Beginning at a point on the south line of Lot 42; thence N 89°45'00" E,
150.00 feet; thence S 00°15'00" E, 200.00 feet; thence S 89°45'00" W,
150.00 feet; thence N 00°15'00" W, 200.00 feet to the point of beginning.
`);

t.courses.length;                        // 4
t.courses[0].type;                       // "line"
t.courses[0].bearing.azimuthDeg;         // 89.75
t.courses[0].distanceFt;                 // 150
```

## Public API

| Export                | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `parseDeedText(raw)`  | Top-level: splits on "thence" and parses each clause.            |
| `parseBearing(text)`  | Parse a single quadrant bearing string -> `Bearing` or `null`.   |
| `parseCurveCall(text)`| Parse a single curve-call clause -> partial `CurveCourse` or null. |
| `parseDistance(text)` | Parse a leading distance ("100.00 feet") -> `{feet, source, moreOrLess}`. |
| `normalizeDeedText`   | Whitespace / unicode cleanup used internally; exposed for callers. |
| `azimuthFromQuadrant` | DMS + quadrant -> azimuth (0..360, clockwise from N).            |

Types: `Bearing`, `BearingQuadrant`, `Course`, `LineCourse`, `CurveCourse`,
`ParsedTraverse`, `UnparsedFragment`.

## Supported bearing formats

All of the following parse to identical `Bearing` values (NE quadrant, 45°30'00"):

| Form                                                   |
| ------------------------------------------------------ |
| `N 45°30'00" E`                                        |
| `N45°30'00"E`                                          |
| `N 45 deg 30 min 00 sec E`                             |
| `N 45 degrees 30 minutes 00 seconds E`                 |
| `North 45 degrees 30 minutes 00 seconds East`          |
| `N45-30-00E`                                           |
| `N 45° 30' East` (seconds default to 0)                |
| `N 45° East` (minutes and seconds default to 0)        |

Cardinals: `due north` / `due east` / `due south` / `due west` map to
azimuths 0 / 90 / 180 / 270 respectively. For consistency, due-north is
emitted with quadrant `NE` (degrees=0), due-west with quadrant `NW`
(degrees=90), etc. — but consumers should rely on `azimuthDeg`, not on the
quadrant alone, for cardinal directions.

## Supported distance formats

- `100.00 feet`, `100.00 ft`, `100.00'`
- `100.00 feet, more or less` — value preserved; the `moreOrLess` flag is
  available via `parseDistance`. Inside a parsed traverse course it is
  retained only in `course.raw`.
- `100 feet to a point` — value extracted, trailing prose ignored.

## Curve calls

Recognized when the clause contains *both* a curve marker
(`curve`, `arc`, `radius`, `delta`, `chord`) **and** an explicit radius. The
parser extracts whichever of `radius`, `arcLength`, `delta`, `chordBearing`,
`chordFt`, `tangentFt` are stated. **It does not compute missing elements**.

Direction (`"left"` / `"right"`) must be stated explicitly via
`curve to the right` / `curving to the left` / `turning to the left`. Curves
described only via concavity (e.g. *"concave to the southwest"* with no
direction word) are conservatively rejected and logged to `unparsed` —
they require additional context about the prior course heading to
disambiguate, and Agent 4B-1 declines to guess.

## Unsupported (logged to `unparsed`)

- **Spelled-out numbers**: `N forty-five degrees thirty minutes east`, or
  distances like `one hundred feet`. Parsing English number-words is out of
  scope for v1.
- **Chains, rods, varas, perches** (`66 feet = 1 chain = 4 rods`). Many old
  Indiana deeds use these; downstream callers can post-process the `raw`
  text of an unparsed fragment if needed. Conversion factors:
  - 1 chain (Gunter's) = 66.0 ft
  - 1 rod (perch / pole) = 16.5 ft
  - 1 vara (Texas) = 33.333... in (varies by jurisdiction)
- **Ambiguous OCR substitutions** (`O` for `0`, `l` for `1`, `S` for `5`).
  The parser does not auto-correct these — too risky. Smart/typographic
  quotes (`’` `”` `″` `′`) and degree look-alikes *are* normalized.
- **Curves without a stated radius** — too underspecified to be useful.

## Azimuth convention

Decimal degrees from north, clockwise: `0 = N, 90 = E, 180 = S, 270 = W`.
This matches `mcp-server/src/calculators/traverse-closure.ts` so consumers
can feed `course.bearing.azimuthDeg` straight into the traverse-closure
calculator without conversion.

Quadrant -> azimuth math:

| Quadrant | Azimuth                       |
| -------- | ----------------------------- |
| NE       | `D + M/60 + S/3600`           |
| SE       | `180 - (D + M/60 + S/3600)`   |
| SW       | `180 + (D + M/60 + S/3600)`   |
| NW       | `360 - (D + M/60 + S/3600)`   |

## Citation conventions for downstream users

When you publish work that relies on a parsed deed, **always cite the
recorded source instrument** — book / page, instrument number, county
recorder. This package preserves the raw call text in `course.raw` and the
full normalized text in `traverse.normalizedText` so you can quote back the
exact original language.

## Development

```sh
pnpm -F @civil3d-master-guide/deed-parser test
pnpm -F @civil3d-master-guide/deed-parser build
```

Tests use vitest. No runtime dependencies. Source is TypeScript with
NodeNext module resolution and emits ESM only.

## Status

v0.1.0 — parser core. Plotting (Agent 4B-2), web UI (Agent 4B-3), and MCP
tool exposure (Agent 4B-4) are tracked in sibling worktrees and consume
this package.
