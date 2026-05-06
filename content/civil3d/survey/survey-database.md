---
title: "Survey Database"
section: "civil3d/survey"
order: 10
visibility: public
tags: [survey, survey-database, fbk, working-folder]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [SHOWSURVEYTAB, IMPORTSURVEYDATA, NEWLOCALSURVEYDATABASE]
updated: 2026-05-06
---

> **TL;DR**
> 1. The Survey Database is a project-scoped store of control, setups, observations, figures, and equipment outside any drawing. It lives under the Working Folder you set on the Survey tab of Toolspace.
> 2. Open the Survey tab (`SHOWSURVEYTAB`), right-click `Survey Databases` > New local survey database, then point one or more drawings at it. Multiple drawings can read the same database simultaneously, but only one user holds the write lock.
> 3. Import points and field books with `IMPORTSURVEYDATA` or by right-clicking the database. Edits to observations re-evaluate the network and update referenced drawings on next refresh.

## What a Survey Database actually is

Each survey database is a folder under the active Working Folder containing SQLite-style files (`*.sdx`, `*.sdb`, etc., names vary by version) plus a `Figures` subfolder. It is independent of any drawing — destroying a DWG does not destroy the survey data. That separation is the whole point: raw observations live once, and any drawing can pull figures, points, and control into itself by reference.

The database stores:

- Control points (with horizontal and vertical fix codes).
- Setups (instrument station, backsight, height of instrument, target heights).
- Observations (angle, distance, target ID, target type).
- Non-control points and directions.
- Figures (linework defined by point-to-point connections with curve metadata).
- Equipment databases (instrument and prism specifications).
- Figure prefix database links.
- Network definitions for least-squares adjustment.

## Working Folder vs project

Two terms are easy to confuse:

- **Working Folder**: the parent directory holding all survey databases (and, optionally, data shortcut projects). One Working Folder can hold many databases.
- **Survey Database**: one of those projects, opened by name in Toolspace > Survey tab.

Set the Working Folder by right-clicking `Survey Databases` > Set Working Folder. A common pattern is `S:\\Projects\\<job>\\Survey\\` so each job has its own database alongside its DWGs and data shortcuts.

## Creating and opening

1. Toolspace > Survey tab. If hidden, run `SHOWSURVEYTAB`.
2. Right-click `Survey Databases` > New local survey database. Name matches the project; the folder is created under the Working Folder.
3. Right-click the new database > Edit Survey Database Settings. Confirm units, coordinate zone, instrument settings, observation defaults, and least-squares parameters.
4. Open the database (right-click > Open). The padlock icon shows red when locked by you, gray when read-only because another user has it open.

## Importing field data

`IMPORTSURVEYDATA` runs the Import Survey Data wizard. Sources include:

- **Field book (.fbk)** — Autodesk's text format. Most data collectors export `.fbk` directly or via Trimble Business Center, Carlson SurvCE/SurvPC, or Leica Infinity.
- **Point file (.txt, .csv)** — PNEZD, PENZD, etc. Imports as non-control points; observations are not synthesized.
- **LandXML** — points and figures from LandXML 1.2.
- **Existing drawing points** — moves COGO points into the database.

The wizard offers to create a new figure prefix database, link an existing one, or skip prefix processing. For a clean workflow, prepare the prefix database first (see [Figure prefixes](figures-and-figure-prefixes.md)) and link it during import.

## Inserting database content into a drawing

- Right-click a node (Setups, Control Points, Non-control points, Figures, Networks) > Insert into drawing.
- Or drag the node onto the drawing window.
- Inserted figures retain a reference to the database; an edit to the figure in the database updates the drawing on the next `Update from project` action.

To break that link (e.g. for a deliverable that should not auto-change), choose `Remove from project` on the figure inside the drawing.

## Database settings worth tuning early

- **Measurement type defaults**: angle/distance vs azimuth/distance. Match what the data collector exports.
- **Coordinate zone**: must match the DWG zone, otherwise figure insertion offsets.
- **Use least squares for traverse adjustment**: turn on for any project with redundancy. Compass rule remains as a fallback for single-loop traverses.
- **Tolerances**: horizontal, vertical, angular. Default tolerances are loose. Tighten them so the network analysis flags real problems instead of rubber-stamping.

## Common gotchas

- **Two users editing one database**. The first to open holds the write lock. The second sees a stale read-only copy. Use `Close survey database` when finished, not just `Close drawing`.
- **Working Folder on a synced drive**. Dropbox, OneDrive, and Google Drive cause file-handle conflicts that corrupt the database. Use a real network share or Vault.
- **Renamed Working Folder**. Re-pointing the Working Folder does not move existing databases. Move the folder first, then set the Working Folder to the new path.
- **Mixed units**. The database has its own unit setting independent of the DWG. A meters database inserted into a feet drawing will scale by 3.281 silently.
- **FBK rounding**. Field books with truncated angle precision (DDD.MMSS without enough decimals) seed least-squares with bogus residuals. Export with full precision from the data collector.

## Related

- [Figures and figure prefixes](figures-and-figure-prefixes.md)
- [Linework code sets](linework-code-sets.md)
- [Network adjustment](network-adjustment.md)
- [Point import/export formats](../points/import-export-formats.md)
