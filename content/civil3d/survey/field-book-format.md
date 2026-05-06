---
title: "Field Book Format (.fbk)"
section: "civil3d/survey"
order: 15
visibility: public
tags: [survey, field-book, fbk, observations, traverse, sideshot, import]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [IMPORTSURVEYDATA, CREATEFIELDBOOK]
updated: 2026-05-06
---

> **TL;DR**
> 1. The `.fbk` (Field Book) file is a plain-text format that Civil 3D's survey module reads natively. Each line is a keyword followed by numeric parameters representing setups, backsights, observations, and point coordinates.
> 2. Common record types: `STN` (station setup), `BS` (backsight), `AD`/`BD` (angle-distance / bearing-distance), `SS` (sideshot), `PRISM` (target height), `NE`/`NEZ` (known coordinates), and various figure commands (`BEG`, `END`, `CONT`).
> 3. Most data collectors can export `.fbk` directly or through office software (Trimble Business Center, Carlson SurvPC, Leica Infinity). Review the file in a text editor before import to catch truncated angles or duplicate point numbers.

## File structure

An `.fbk` file is a sequence of records, one per line. Each record starts with a keyword, followed by space- or comma-delimited values. Comments begin with `#` or `REM`. Blank lines are ignored.

Minimal example:

```
NE   1   5000.0000   5000.0000   100.000   "CP-1"
NE   2   5200.0000   5000.0000   100.500   "CP-2"
STN  1   5.250
BS   2
AD   100  89.32150  150.325  5.500  "IP"
SS   101 88.15220  75.440   5.500  "EP"
SS   102 87.54100  80.120   5.500  "EP"
```

In this example: two known control points are defined, a station setup is made on point 1 with an instrument height of 5.250 ft, a backsight is taken on point 2, then an angle-distance observation is recorded to point 100, followed by two sideshots.

## Common observation keywords

| Keyword | Parameters | Description |
|---|---|---|
| `NE` | point northing easting desc | Known horizontal coordinates (no elevation) |
| `NEZ` | point northing easting elev desc | Known 3D coordinates |
| `STN` | point hi | Station setup: occupy a point with instrument height |
| `BS` | point | Backsight to a known point |
| `BKB` | azimuth | Backsight by known bearing/azimuth instead of point |
| `AD` | point angle distance ht desc | Angle right and slope distance to a foresight |
| `BD` | point bearing distance ht desc | Bearing and horizontal distance to a point |
| `ZD` | point zenith distance ht desc | Zenith angle and slope distance |
| `SS` | point angle distance ht desc | Sideshot (same as AD but flagged non-traverse) |
| `PRISM` | height | Sets the default target/prism height for subsequent shots |
| `F1` / `F2` | | Indicates face 1 or face 2 for direct/reverse observations |
| `GPS` | point northing easting elev desc | GPS-derived coordinate |

### Figure commands in .fbk

| Keyword | Parameters | Description |
|---|---|---|
| `BEG` | figurename | Begin a new figure with the given name |
| `END` | figurename | Close/end the named figure |
| `CONT` | figurename | Continue an existing figure (connect next point to last vertex) |
| `PC` | | Previous point is a curve start (point of curvature) |
| `PT` | | Previous point is a curve end (point of tangency) |
| `RC` | radius | Resolve a curve with the given radius |

## Angle formats

Angles in `.fbk` files are encoded as `DDD.MMSSSS` where `DDD` is degrees, `MM` is minutes (two digits), and `SSSS` is seconds with decimal fraction. The decimal point in the file separates degrees from minutes/seconds, not degrees from decimal degrees.

Examples:

- `89.32150` = 89 degrees, 32 minutes, 15.0 seconds
- `0.00000` = 0 degrees, 0 minutes, 0.0 seconds
- `359.59595` = 359 degrees, 59 minutes, 59.5 seconds

This format is specific to the `.fbk` convention. A common error is interpreting the value as decimal degrees; `89.32150` is not 89.3215 degrees.

## Traverse records

A traverse is a chain of `STN` / `BS` / `AD` (or `ZD`) records moving from one occupied point to the next. The survey database uses these to build an observation graph for adjustment.

```
STN  1   5.250
BS   2
AD   3   90.00000  200.000  5.500  "TP-1"
STN  3   5.300
BS   1
AD   4   270.00000  180.000  5.500  "TP-2"
STN  4   5.250
BS   3
AD   2   180.00000  220.000  5.500  "CLS"
```

This three-leg traverse closes back on point 2. After import, the Traverse Editor or Least Squares Analysis can adjust it.

## Importing an .fbk into Civil 3D

1. Open or create a survey database (Survey tab > right-click > New local survey database, or open an existing one).
2. Right-click the database > Import field book, or run `IMPORTSURVEYDATA`.
3. Browse to the `.fbk` file. Select the equipment database to apply (EDM constants, prism offsets).
4. Choose or create a figure prefix database if figure commands are present.
5. Civil 3D reads the file line by line, populating setups, observations, and figures in the database.
6. Review the Event Viewer (Survey tab > right-click database > Show Event Viewer) for warnings: duplicate points, missing backsights, angle tolerance violations.

## Exporting from data collectors

Most modern data-collector software can produce `.fbk` output:

- **Trimble Business Center / Trimble Access**: Export > Civil 3D Field Book.
- **Carlson SurvCE / SurvPC**: File > Export > Autodesk FBK.
- **Leica Infinity**: Export > Field Book. Confirm angle format matches `DDD.MMSSSS`.
- **MicroSurvey FieldGenius**: File > Export > FBK.

Always export with maximum angular precision (at least to 0.1 second). Truncated seconds seed bad residuals during adjustment.

## Common gotchas

- **Duplicate point numbers.** If the file redefines a point number that already exists in the database with different coordinates, the import behavior depends on the database's point-tolerance settings. Duplicates can silently overwrite or raise a warning — configure before import.
- **Mixed units.** The `.fbk` file does not embed a unit declaration. Civil 3D applies the survey database's unit setting. A file collected in meters imported into a feet database produces coordinates off by a factor of ~3.281.
- **Missing backsight.** An `AD` record without a preceding `BS` on the current setup causes an error. Some data collectors omit the backsight if it is the same as the previous setup's; the `.fbk` standard requires it.
- **Description quoting.** Descriptions containing spaces must be quoted (`"CATCH BASIN"`). Unquoted multi-word descriptions are split into description and extra tokens.
- **Figure names with spaces.** The `BEG`, `END`, and `CONT` keywords take a single token as the figure name. Use underscores or hyphens (`EDGE_PVMT`) if the prefix database expects them.

## Related

- [Survey database](survey-database.md)
- [Importing raw observations](importing-raw-observations.md)
- [Equipment databases](equipment-databases.md)
- [Figures and figure prefixes](figures-and-figure-prefixes.md)
