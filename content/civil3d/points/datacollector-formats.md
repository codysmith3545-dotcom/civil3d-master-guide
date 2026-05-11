---
title: "Data-Collector File Formats"
section: "civil3d/points"
order: 11
visibility: public
tags: [points, data-collector, carlson, trimble, topcon, rw5, csv, pnezd, import, export]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [POINTSIMPORT, POINTSEXPORT, EDITPOINTFILEFORMAT]
updated: 2026-05-11
sources:
  - title: "Carlson SurvCE Reference Manual (RW5 file format appendix)"
    url: "https://web.carlsonsw.com/files/knowledgebase/kbase_attach/1093/SurvCE5-ReferenceManual.pdf"
  - title: "Trimble Access General Survey Help — Coordinate exports"
    url: "https://help.trimblegeospatial.com/TrimbleAccess/latest/en/General-Survey-Coordinates.htm"
  - title: "Topcon Magnet Field Help — Job export formats"
    url: "https://www.topconpositioning.com/support/products/magnet-field"
  - title: "LandXML 1.2 schema (CgPoint element)"
    url: "http://www.landxml.org/schema/LandXML-1.2/LandXML-1.2.xsd"
---

> **TL;DR**
> 1. Most surveying data collectors can export an ASCII coordinate file. Civil 3D's Point File Formats consume those directly.
> 2. The web tool at `/tools/datacollector-import` and the MCP `import_datacollector` tool parse PNEZD, NEZD, PXYZ, Trimble CSV, Topcon CSV, and Carlson RW5.
> 3. Binary collector files (Carlson `.crd` / `.crdb`, Trimble `.job` / `.dc`) are out of scope. From the field unit, export to CSV first.

## Supported text formats

### Generic PNEZD (`.csv`, `.txt`)

Five comma-separated columns: **P**oint number, **N**orthing, **E**asting, **Z** (elevation), **D**escription.

```
1,5000.000,5000.000,800.000,IPF
2,5100.123,5050.456,801.250,REBAR
```

This is the lingua franca of point exchange — every Civil 3D installation has the shipped PNEZD format mapped, and almost every collector can write it.

### Generic NEZD (`.csv`, `.txt`)

Same as PNEZD without the leading point number; the importer assigns sequential numbers starting at 1.

### Generic PXYZ (`.csv`, `.txt`)

Point, X (easting), Y (northing), Z (elevation). Common when CAD users hand off raw drafting coordinates to a surveyor for stake-out and the description is irrelevant.

> **Watch the column order.** PXYZ swaps Northing and Easting compared to PNEZD. A file that looks right but plots rotated 90 degrees in Civil 3D usually means a PNEZD format was applied to a PXYZ file (or vice versa).

### Trimble CSV (`.csv`)

Trimble Access exports point CSVs that look like PNEZD but commonly:

- Quote any description that contains a comma (`"Iron pin found, capped LS 12345"`).
- Append one or more attribute columns after the description (feature class, layer, control flag, etc.).

The parser reads the first 5 columns as PNEZD and folds any extras into the `notes` field.

### Topcon CSV (`.csv`)

Topcon Magnet Field commonly exports six columns: **P,N,E,Z,Description,Note**. The 6th column carries the operator's free-text note from the field. The parser puts this into the `notes` field.

### Carlson RW5 (`.rw5`)

The Carlson SurvCE / SurvPC raw-data file. Each line is a record beginning with a 2-3 character record-type token (`JB`, `MO`, `OC`, `BK`, `BD`, `SP`, `SS`, `GPS`, etc.). The parser extracts position records (`SP` stored points, `GPS` GNSS-derived points) into `DcPoint`s and reports every other record (job header, mode, occupy, backsight, sideshot, etc.) in `warnings` so nothing is silently dropped. Free-form note lines starting with `--` are skipped.

```
JB,NMSAMPLE,DT05-11-2026,TM10:00:00
MO,AD,UN1,SF1.00000000,EC1,EO0.0,AU0
SP,PN1,N 5000.00000,E 5000.00000,EL 800.000,--CP1
SP,PN2,N 5100.12300,E 5050.45600,EL 801.250,--REBAR
```

> **GPS vs SP.** The same RW5 file may carry both totalstation `SP` records and GNSS `GPS` records for the same job. Both are extracted; the description (everything after `--`) is preserved.

## Unsupported binary formats

The following are binary on-disk formats. Parsing them requires reverse-engineered byte-level readers that are out of scope for this tool:

| Format | Vendor | Workaround |
| --- | --- | --- |
| `.crd` | Carlson (legacy points file) | Export PNEZD CSV from SurvCE: **File > Import/Export > ASCII File > Write** |
| `.crdb` | Carlson (SQLite-backed coordinate file) | Same as above; or open in Carlson and use **Export Coordinate File** |
| `.job` | Trimble | In Trimble Access: **Job > Import / Export > Custom ASCII files**, choose CSV |
| `.dc` | Trimble TDS legacy data-collector file | Convert in Trimble Business Center or Survey Office to CSV |

Uploading any of those to `/tools/datacollector-import` returns an HTTP 415 error with a link back to this page.

## Round-tripping

Once parsed, points can be exported to:

- **PNEZD CSV** — universally importable by Civil 3D's shipped Point File Format.
- **Custom CSV** — pick any subset of `P,N,E,Z,D` in any order.
- **LandXML** — a `CgPoints` block conforming to LandXML 1.2. Lossless across Civil 3D versions; preferred for data exchange between offices.

LandXML stores coordinates as space-separated `northing easting elevation` inside each `<CgPoint>`. If you produce LandXML by hand or with a different tool, double-check the column order — some tools emit `easting northing elevation` instead, which Civil 3D will silently accept and plot rotated.

## Common gotchas

- **Decimal commas vs decimal points.** This parser only accepts `1234.567`-style decimals. European locales that export `1234,567` need to be converted upstream (most collectors have an export setting).
- **BOM-prefixed UTF-8.** Server upload strips a leading `0xFEFF` BOM. If you see an unexpected character at the start of point 1's number, check the file in a hex viewer.
- **Tabs and pipes.** Only commas are treated as the delimiter. Re-save tab- or pipe-delimited exports with commas before importing.
- **Quoted descriptions with embedded commas.** Trimble's quoting style (`"Iron pin, found"`) is honoured. Generic PNEZD parsing also tolerates additional comma-separated fields and joins them back into the description.
