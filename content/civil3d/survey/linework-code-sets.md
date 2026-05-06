---
title: "Linework Code Sets"
section: "civil3d/survey"
order: 30
visibility: public
tags: [survey, linework, codes, fbk, field-coding]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [EDITLINEWORKCODESET, IMPORTSURVEYDATA, RUNLINEWORKPROCESSING]
updated: 2026-05-06
---

> **TL;DR**
> 1. A Linework Code Set defines the keywords a field crew appends to point descriptions so Civil 3D can connect points into figures during import. Defaults are simple letters: `B` begin, `E` end, `C` continue, `CLS` close, `PC`/`PT`/`RC` for curves.
> 2. Edit code sets in Toolspace > Survey > Linework Code Sets. The active set is set per survey database in Edit Survey Database Settings.
> 3. Coordinate the code set with what the field crew configures in the data collector (Trimble Access, Carlson SurvCE, Leica Captivate). A mismatch means linework arrives as disconnected points.

## Why linework codes exist

Field surveyors carry hundreds of points per setup. Drawing the lines back in the office by hand is error-prone. Linework codes solve this by letting the field crew tell the software, point by point, how to connect them. Civil 3D then synthesizes figures (polylines with optional arcs) automatically when the field book is imported.

A typical descriptor in the field looks like `EP B` (begin a figure named EP), then several `EP` shots, then `EP E` (end the figure). The figure name comes from the description prefix; the code set defines the verbs.

## Default code keywords

Civil 3D ships a default Linework Code Set with these verbs:

- `B` — Begin figure
- `C` — Continue figure (often optional; Civil 3D continues by repeated prefix)
- `E` — End figure
- `CLS` — Close figure (end and connect to start)
- `PC` — Begin curve through next point
- `PT` — End curve (last point before tangent)
- `RC` — Begin tangent curve with given radius
- `JPN` — Jump to a point by number to continue from there
- `OH` — Offset horizontal (offset linework parallel)
- `OV` — Offset vertical
- `RT` / `LT` — Right / Left perpendicular offset
- `TMPL` — Apply a template offset
- `STD` — Standard close
- `NE` — Non-equal close
- `XO` — Crossover (a figure crosses another)

The exact keyword strings are editable. Many offices change `RC` to `R` or rename `B` to `BEG` to match what surveyors are used to from a previous platform.

## Editing a code set

1. Toolspace > Survey tab.
2. Expand `Linework Code Sets`. Right-click `New` to copy the default set, then right-click the copy > Edit Linework Code Set.
3. The dialog lists every code with its keyword string, processing order, and parameters. Edit the keyword column. Order matters when keywords share leading characters — longer keywords should be parsed first.
4. Save. Set this code set as the active one on the database via Edit Survey Database Settings > Linework Code Set.

## Field-collector configuration

The field crew has to enter the same keywords. Most data collectors store a feature code list per project; the office should publish one master list that includes:

- The figure prefix (e.g. `EP`, `BC`, `TC`, `TBW`).
- The linework verbs (`B`, `E`, `PC`, `PT`, `RC`, etc.).
- Examples of legal combinations.

Common patterns:

- **EP B** — start an edge-of-pavement figure
- **EP** — continue the same figure
- **EP PC** — start an arc through the next two points
- **EP PT** — end the arc on this point
- **EP E** — end the figure
- **EP CLS** — close the figure back to start
- **EP RC 25** — start a tangent arc of radius 25 ft

Some collectors use a separator other than space (a period or hyphen). Civil 3D's parser is space-delimited by default; configure the collector to match or change the delimiter in the code set.

## Curves: three approaches

1. **PC/PT** between two tangents: Civil 3D inserts a best-fit arc through the intermediate point. Survey three or more points on the arc for accuracy.
2. **RC** with radius: a tangent arc fitted to incoming/outgoing tangents and the radius value.
3. **Three-point arc** stored manually: not recommended; harder to QC.

For curb returns, three-point arcs (PC + on-curve + PT) tend to match construction drawings better than RC because they capture actual built radii.

## Processing during import

`IMPORTSURVEYDATA` runs linework processing automatically when the source is an FBK or LandXML field book. To re-run after editing observations, use `RunLineworkProcessing` (or right-click the database > Process Linework). The dialog asks which code set, which figure prefix database, and which point group to draw from.

## Common gotchas

- **Mismatch between collector and code set.** Crew uses `START` instead of `B` and nothing connects. Standardize before mobilization.
- **Description casing.** The parser is case-sensitive in some versions. `b` and `B` may not match the same code.
- **Space inside the figure name.** `EDGE OF PAVE B` is parsed as figure `EDGE` with extra text. Avoid spaces in prefixes.
- **Curves crossing setup boundaries.** A `PC` shot on one setup with the matching `PT` on the next setup confuses some collectors when redundancy is collected. Capture the full curve from one setup if possible.
- **JPN at the wrong time.** `JPN` only works when the target point already exists in the database. Out-of-order field books drop these connections.

## Related

- [Survey database](survey-database.md)
- [Figures and figure prefixes](figures-and-figure-prefixes.md)
- [Network adjustment](network-adjustment.md)
