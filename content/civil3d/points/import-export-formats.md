---
title: "Point Import and Export Formats"
section: "civil3d/points"
order: 10
visibility: public
tags: [points, import, export, pnezd, ascii, csv, file-format]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [POINTSIMPORT, POINTSEXPORT, EDITPOINTFILEFORMAT, CREATEPOINTFILEFORMAT]
updated: 2026-05-06
---

> **TL;DR**
> 1. Civil 3D reads and writes points through Point File Formats — a named template that maps file columns to Point Number, Northing, Easting, Elevation (Z), Description, and other COGO attributes.
> 2. The shipped formats cover the common ASCII permutations: PNEZD, PENZD, PNEZ, NEZ, comma- and space-delimited. Build a custom format from `EDITPOINTFILEFORMAT` for anything outside that list.
> 3. Run `POINTSIMPORT` or right-click `Points` in Prospector > Create > Import points. For export, right-click a point group > Export points and pick the format. LandXML is the lossless option when round-tripping between Civil 3D installations.

## Why "PNEZD" matters

The point file format names are nothing more than an abbreviation of the column order. `PNEZD` means Point number, Northing, Easting, Elevation (Z), Description — comma-delimited. `PENZD` swaps Easting and Northing. The leading letters tell you exactly what each column holds.

Other shipped variants:

- `PNEZD (space delimited)` — same columns, whitespace separator.
- `PENZD (comma)` and `(space)`.
- `NEZ (comma)` — no point number; numbers assigned at import.
- `External Project Point` — used by Vault round-trip.
- `Autodesk Uploadable File (.aup)` — used by some BIM 360 / ACC workflows.

## The Point File Format dialog

`EDITPOINTFILEFORMAT` opens the manager. Each format defines:

- **Format type**: User Point File or User Point Database. Files are flat ASCII; databases are external Access/MDB sources (legacy).
- **Default file extension**: `.txt`, `.csv`, `.asc`, etc.
- **Comment tag**: lines beginning with this prefix are skipped. `#` is a common choice.
- **Delimiter**: comma, space, semicolon, tab, or user-defined character.
- **Columns**: select from a fixed list of attributes — Point Number, Easting, Northing, Elevation, Raw Description, Full Description, Grid Easting, Grid Northing, Latitude, Longitude, plus any user-defined property defined on the drawing's point user properties.
- **Coordinate Zone Transform**: when checked, columns flagged as grid coordinates are inverse-projected to local coordinates on import.
- **Use point identifier as point number**: pulls a unique key out of one of the columns.

Save formats to the drawing or to the office DWT so every drawing offers them. Custom formats stored only in a single DWG don't follow when you SaveAs.

## Importing points

1. Prospector > right-click `Points` > Create > Import points (`POINTSIMPORT`).
2. In the dialog, click Add file and select your `.txt`/`.csv`. Multiple files of the same format may be added at once.
3. Choose the format. The preview at the bottom shows the parsed columns; if rows show as red errors, the format does not match the file's column order or delimiter.
4. Optional advanced settings:
   - **Add points to point group** — assign the imported set to a fresh group for traceability.
   - **Do elevation adjustment if possible** — only when the format includes an elevation factor column.
   - **Do coordinate transformation if possible** — applies the zone reverse-transform to grid-coordinate columns.
   - **Do coordinate data expansion if possible** — populates additional grid/local fields if the format defines both.
5. OK.

If point numbers in the file collide with existing numbers, Civil 3D prompts: renumber, merge, overwrite, or skip. Choose deliberately; merge can silently change descriptions.

## Exporting points

1. Right-click a point group > Export points (`POINTSEXPORT`).
2. Choose format and target file path.
3. Limit to point group: keeps the export aligned with whatever is selected in the dropdown.
4. OK. Inspect the output before sending — open the file in a text editor and verify the column order against your stated format.

## Format choices for interchange

- **PNEZD comma** — the de facto interchange format with field crews and other CAD platforms. Always quotes-free.
- **NEZ comma** — used by some legacy clients; point numbers regenerated.
- **LandXML 1.2** — round-trip with Civil 3D, MicroStation OpenRoads, Trimble Business Center. Carries more than ASCII can: groups, full descriptions, user-defined properties, raw observations. Export from File menu > Export > Export to LandXML.
- **CSV with header row** — useful for Excel users; Civil 3D won't parse a header automatically, so add a comment-tag character to the first row.
- **Shapefile (`.shp`)** — only via Map 3D's `MAPEXPORT`; loses point numbers, exports geometry plus attributes.
- **GIS formats (GeoJSON, FileGDB)** — through Map 3D import/export with FDO connections.

## Common gotchas

- **Locale decimal separator.** A European-locale `.csv` may use semicolons and commas as decimals. Civil 3D respects Windows regional settings on import; mis-locale points land at the origin.
- **Description with embedded comma.** Descriptions like `BENCHMARK, NW CORNER` break a comma-delimited PNEZD. Re-parse with space-delimited or quote the description and use a custom format.
- **Truncated precision.** Exporting to PNEZD writes the precision set on the format, not the drawing. Default 3 decimal feet; for boundary work raise to 4 or 5.
- **Rounding on import**. The drawing precision setting affects display, but stored coordinates are full precision; resist the urge to "fix" precision by re-importing.
- **Same number, different point.** A second import of overlapping numbers without a renumber strategy yields a silently-corrupt drawing. Use point groups + non-overlapping number ranges per crew/phase.
- **Z value blank**. Some formats treat blank Z as `0.0`, others as `Null`. A flat surface elevation 0 along a survey line is a tell-tale sign.

## Related

- [Description keys](description-keys.md)
- [Point groups](point-groups.md)
- [Survey database](../survey/survey-database.md)
