---
title: "Field Code Conventions"
section: "field-and-boundary/topographic-surveys"
order: 20
visibility: public
tags: [field-codes, description-keys, field-to-finish, linework, coding, topography]
updated: 2026-05-06
---

> **TL;DR**
> 1. A field code system pairs a **feature code** (what the point is) with optional **linework commands** (how to connect it) and **attributes** (diameter, material, etc.) so the office can build a surface and planimetric map with minimal manual editing.
> 2. Your code list must **match the Civil 3D description key set** exactly — a code the software does not recognize becomes a manual fix.
> 3. Keep codes short (2 to 4 characters), unambiguous, and documented on a single-page sheet the crew carries in the field.

## Code structure

A typical field code string has three parts:

```
EP BGL
│  │
│  └─ Linework command (begin line)
└──── Feature code
```

Some systems concatenate code + attribute:

```
TREE 18 OAK
│    │   │
│    │   └─ Species attribute
│    └───── Diameter (inches DBH)
└────────── Feature code
```

The exact syntax depends on the data collector software (Trimble Access, Leica Captivate, Carlson SurvCE, etc.) and must agree with the office's description key set or field-to-finish configuration.

## Feature codes

Each code represents a point feature or a node on a linear feature. Common conventions:

| Code | Feature | Notes |
|---|---|---|
| EP | Edge of pavement | Linework — connect sequentially |
| TC | Top of curb | Often paired with FL (flow line) |
| FL | Flow line / gutter | Bottom of curb, drives drainage |
| BC | Back of curb | Used when TC and FL are separate shots |
| BW | Back of walk | Sidewalk edge nearest buildings |
| FW | Front of walk | Sidewalk edge nearest street |
| FNC | Fence | Include attribute for type (chain link, wood, etc.) |
| BLD | Building corner | Shot at each corner |
| DEC | Deciduous tree | Attributes: diameter, species if required |
| CON | Conifer tree | Same attribute set as DEC |
| MH | Manhole (storm) | Attributes: rim elevation shot, inverts measured separately |
| SMH | Sanitary manhole | Same convention |
| WV | Water valve | Shot on valve lid |
| HYD | Fire hydrant | Shot at base center |
| GS | Ground shot | Random topo shot for surface modeling |
| TS | Top of slope | Breakline feature |
| TOE | Toe of slope | Breakline feature |
| SW | Swale / ditch center | Breakline feature |
| OH | Overhead wire | Shot at pole base with attribute for type |

Assign unique codes — never reuse the same code for different features. If the project has unusual features (retaining walls, headwalls, outfall pipes), add codes before the crew mobilizes.

## Linework commands

Linework commands tell the field-to-finish processor how to connect sequential shots of the same code. Common commands:

| Command | Meaning |
|---|---|
| BGL or .S | Begin line (start a new string) |
| END or .E | End line (terminate current string) |
| CLS or .C | Close line (connect back to first point) |
| BGA or .A | Begin arc / curve start |
| EDA or .EA | End arc / curve end |
| PCT or .P | PC tangent (start of curve) |
| RCT | Rectangular close (close building footprint at right angles) |

The syntax varies by software. Trimble Access uses dot-commands (.S, .E, .C); Carlson uses text suffixes. Document whichever convention your office uses and distribute it.

## Sequence numbering and strings

When multiple strings of the same feature code exist (e.g., two separate sidewalks), you need a way to distinguish them. Common approaches:

- **Numbered suffix:** EP1, EP2. Each suffix starts a new string.
- **Explicit start/stop:** Begin a new string with BGL, end the old one with END, then start the next with BGL.
- **Sequence field:** Some collectors have a separate linework sequence field that auto-increments.

Whichever method you choose, be consistent across the entire crew and project.

## Matching Civil 3D description keys

Civil 3D description keys read the raw description from the imported point and map it to a full description, point style, point label style, and layer. The matching is by pattern:

- `EP*` matches EP, EP1, EP BGL, etc.
- `TREE*` matches TREE 18 OAK.

For this to work:

1. The raw description's first characters must match a defined key pattern.
2. Parameters (diameter, species) must appear in the positions the key expects.
3. Linework commands must appear where the field-to-finish plugin looks for them.

Test a small batch of coded points through the entire import-to-linework pipeline before the crew spends days in the field. One mismatched convention can mean hundreds of manual point edits.

See the Civil 3D description key reference for key set configuration details.

## Attribute coding

Attributes carry dimensional or material data embedded in the point description. Typical attribute fields:

- **Tree diameter:** Caliper in inches at DBH (diameter at breast height, 4.5 ft above ground).
- **Pipe size:** Diameter in inches.
- **Pipe material:** Abbreviated code (RCP, PVC, DIP, HDPE, CMP).
- **Fence type:** CL (chain link), WD (wood), VNL (vinyl), IRN (iron).
- **Utility type:** E (electric), G (gas), T (telecom), FO (fiber optic).

Place attributes after the feature code, separated by a space. Keep the order consistent: feature code, then size, then material. Document the order on the code sheet.

## Code sheet distribution

Before every project, distribute a printed or digital code sheet that lists:

1. Every feature code with its meaning.
2. Linework commands and syntax.
3. Attribute order and units.
4. Site-specific additions or overrides.

Laminate the printed copy or put it in the data collector as a reference file. If the crew encounters a feature not on the sheet, they should use a descriptive note and flag it for the office rather than inventing a code that may conflict with an existing key.

## Related

- [Pre-survey planning](pre-survey-planning.md)
- [Breakline strategy](breakline-strategy.md)
- [Topo QA/QC](topo-qa-qc.md)
- [Control for topos](control-for-topos.md)
