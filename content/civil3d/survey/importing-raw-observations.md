---
title: "Importing Raw Observations"
section: "civil3d/survey"
order: 20
visibility: public
tags: [survey, import, raw-data, total-station, gps, observation-groups]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [IMPORTSURVEYDATA, SHOWSURVEYTAB]
updated: 2026-05-06
---

> **TL;DR**
> 1. Raw observations (angles, distances, GPS vectors) enter Civil 3D through the Import Survey Data wizard (`IMPORTSURVEYDATA`). Supported formats include `.fbk` (field book), point files (PNEZD), LandXML, and direct import from the drawing.
> 2. Before importing, select the correct equipment database so that EDM constants, prism offsets, and atmospheric corrections are applied to distances at import time — not retroactively.
> 3. Observations land in the survey database grouped by setup. After import, review the Event Viewer for flagged issues, then insert points and figures into the drawing.

## Prerequisites

Before importing raw data, three things must be in place:

1. **Survey database** — open or create one on the Survey tab. See [Survey database](survey-database.md).
2. **Equipment database** — defines instrument and prism characteristics. See [Equipment databases](equipment-databases.md).
3. **Figure prefix database** (optional but recommended) — maps description prefixes to layers, styles, and breakline flags. See [Figures and figure prefixes](figures-and-figure-prefixes.md).

## Import workflow

### Step 1 — Open the import wizard

- Survey tab > right-click the open database > Import > Import Survey Data.
- Or run `IMPORTSURVEYDATA` at the command line.

### Step 2 — Select the data source

The wizard presents four source types:

| Source | When to use |
|---|---|
| **Field book (.fbk)** | Raw angle/distance observations from a total station exported through data-collector software. Preserves full observation lineage. |
| **Point file (.txt, .csv)** | Coordinate-only data (PNEZD, PENZD, etc.). No observation network is created — points import as non-control with no angular/distance measurements. |
| **LandXML (.xml)** | Interoperability import. Can contain survey observations, points, and figures per LandXML 1.2 schema. |
| **Drawing points** | Moves existing COGO points from the drawing into the survey database. Useful for retroactively adding points that were originally imported outside the survey module. |

### Step 3 — Equipment and processing options

- **Equipment database**: select from the dropdown or create a new one inline. The EDM constant and prism offset apply to all distance observations in the file. Atmospheric corrections (temperature, pressure) apply if specified in the equipment database or overridden here.
- **Process linework**: toggle on to apply figure prefix rules during import. If off, figures are still created from `BEG`/`END`/`CONT` commands in the `.fbk` but are not processed through the prefix database.
- **Current figure prefix database**: if process linework is on, select the prefix database. This assigns layers, styles, and breakline membership to generated figures.
- **Insert points and figures into drawing**: toggle to automatically insert survey content into the active drawing after import rather than leaving it in the database only.

### Step 4 — Review and confirm

The wizard displays a summary: number of setups, observations, and points to import. Click Finish. Civil 3D processes the file and writes to the database.

## Observation groups and setups

After import, observations are organized under the database's tree:

- **Control Points** — points with known coordinates (`NE`, `NEZ`, or `GPS` records in the `.fbk`).
- **Setups** — one per `STN` record. Each setup contains its backsight and all foresight/sideshot observations.
- **Non-control Points** — points whose coordinates were computed from observations, not fixed.
- **Figures** — polylines connecting points, created from figure commands.

This hierarchy preserves the measurement chain. If an observation is edited (angle corrected, distance re-measured), Civil 3D can reprocess the affected setup and propagate updated coordinates downstream.

## Importing GPS data

GPS baselines and positions can enter through:

- **GPS records in .fbk**: `GPS point northing easting elevation desc` writes a fixed coordinate.
- **LandXML with GPS vectors**: preserves baseline covariance for network adjustment.
- **RINEX / manufacturer raw**: not directly supported. Process through Trimble Business Center, Leica Infinity, or similar, then export to `.fbk` or LandXML.

For projects combining total-station and GPS observations in one adjustment, import both into the same survey database and build a combined network. See [Network adjustment](network-adjustment.md).

## Post-import review

1. **Event Viewer**: right-click the database > Show Event Viewer. Errors (missing backsight, duplicate point with different coordinates) show as red; warnings (out-of-tolerance but accepted) as yellow.
2. **Setup list**: expand Setups to verify each instrument station, backsight, and shot count.
3. **Point list**: expand Non-control Points or Control Points and spot-check coordinates against the field notes.
4. **Figures**: confirm that the expected figures were created and that breakline-flagged figures appear correctly if a prefix database was applied.

## Inserting into the drawing

After import, survey data lives in the database, not yet in the drawing. To bring it into model space:

- Right-click a setup or point group node > Insert into drawing.
- Right-click Figures > Insert into drawing (all) or select individual figures.
- Dragging a node onto the drawing window also works.

Inserted points become survey points in the drawing (distinct from standalone COGO points — see [Survey points vs COGO points](survey-points-vs-cogo-points.md)). They retain a link to the database; edits to observations can update the drawing on re-processing.

## Common gotchas

- **Wrong equipment database.** Applying the wrong EDM constant shifts every distance observation. If caught after import, reassign the equipment database in the setup properties and reprocess.
- **Units mismatch.** The survey database unit setting and the import file's intended units must agree. There is no unit tag inside an `.fbk` or ASCII point file.
- **Overwriting vs appending.** Importing a second `.fbk` into the same database appends observations. If the file contains the same point numbers with different coordinates, behavior depends on the database's duplicate-point setting (renumber, overwrite, or merge).
- **Figures not appearing.** If `Process linework` was off during import, figures from prefix rules are not generated. Re-import with the toggle on, or manually run `Update Linework` from the database context menu.
- **Large files.** Importing tens of thousands of sideshots can be slow. Close all non-essential drawings and disable real-time preview to speed up.

## Related

- [Survey database](survey-database.md)
- [Field book format (.fbk)](field-book-format.md)
- [Equipment databases](equipment-databases.md)
- [Survey points vs COGO points](survey-points-vs-cogo-points.md)
- [Network adjustment](network-adjustment.md)
