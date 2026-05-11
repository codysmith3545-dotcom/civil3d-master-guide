---
title: "LandXML Validation Checklist"
section: "civil3d/interop"
order: 10
visibility: public
tags: [landxml, interop, qa, surfaces, alignments, parcels, survey]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [LANDXMLIN, LANDXMLOUT, IMPORTSURFACE]
sources:
  - title: "LandXML schema (LandXML.org)"
    url: "https://www.landxml.org/schema/LandXML-1.2/LandXML-1.2.xsd"
  - title: "Civil 3D — Import/Export LandXML (Autodesk Help)"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-LANDXML-IMPORT"
updated: 2026-05-11
---

> **TL;DR**
> Before you import a LandXML file into Civil 3D — or hand one to a contractor for machine control — confirm the schema version, units, surface point counts, alignment geometry, and parcel closure. The LandXML validator in `Tools > LandXML validator` (or the MCP `validate_landxml` tool) automates these checks. Coordinate magnitude is the single most common silent failure: a state-plane file pasted with lat/lon will plot millions of feet from origin.

## Why validate first

LandXML is an open ASCII schema. There is no native authoring application that "owns" it, so the file you receive may have been written by Civil 3D, Trimble Business Center, Bentley OpenRoads, Carlson, GEOPAK, AutoTURN, an in-house LISP utility, or a one-off script. Each producer interprets the optional parts of the schema slightly differently. Importing a problem file directly into a production drawing will silently:

- create surfaces with no triangulation,
- offset alignments by the difference between USFt and IFt (≈ 2 ppm — invisible at building scale, devastating at section-line scale),
- double-count parcel area when the polygon is not closed,
- or land the entire dataset 6.4 million feet off origin if a metric file is treated as imperial.

A 30-second pre-flight check is cheaper than untangling any of those after a corridor has been built on top.

## Pre-import checklist

Run each item against the file. The validator codes match the messages emitted by the `validate_landxml` tool.

1. **Schema version (`MISSING_VERSION`, `UNSUPPORTED_VERSION`).** The root `<LandXML>` element must carry a `version` attribute. Civil 3D's importer accepts 1.0, 1.1, and 1.2; downstream machine-control packages still expect 1.2. Anything outside 1.2 / 2.0 deserves a second look at the producer.
2. **Units (`MISSING_UNITS`, `MIXED_UNITS`).** A `<Units>` block is technically optional, but its absence forces the consumer to guess. Civil 3D defaults to the drawing's units if none are specified, which silently scales coordinates by ≈ 0.3048. The block must contain exactly one of `<Imperial>` or `<Metric>` — never both.
3. **Coordinate magnitude (`LARGE_COORD`, `INVALID_COORD`).** Any coordinate token greater than 1 × 10⁷ in a state-plane file almost certainly came from latitude in microdegrees, longitude in 1/100 arc-seconds, or a UTM file misread as state plane. Any non-numeric token (`NaN`, blank cell, exported `null`) will silently kill the surface or alignment that contains it.
4. **Coordinate system metadata.** Civil 3D's LandXML importer respects only the `desc=` attribute on `<CoordinateSystem>` plus, optionally, the `epsgCode=` attribute. Most non-Autodesk producers omit both. Confirm the CRS out-of-band (email thread, project setup memo) before relying on the file's geometry.
5. **Surfaces (`EMPTY_SURFACE`).** Each `<Surface>` must contain a populated `<Pnts>` and `<Faces>` block. An empty surface imports as a placeholder TIN with zero triangles — easy to miss in Prospector. Cross-check the validator's point/face counts against what the sender said they were sending.
6. **Surface elevation range.** The validator reports `minElev` and `maxElev` per surface. Compare against the project benchmark. A surface whose elevation range straddles the wrong datum (NGVD29 vs NAVD88) will be off by 0.5 to 4 ft in the continental US — invisible at sheet scale, fatal at tie-in.
7. **Alignments (`ALIGNMENT_NO_GEOM`).** Each `<Alignment>` must carry a `<CoordGeom>` populated with `<Line>`, `<Curve>`, or `<Spiral>` children. The validator counts PVIs per `ProfAlign`; a horizontal alignment with no profile is legal but should be a deliberate decision.
8. **Parcels (`PARCEL_NOT_CLOSED`, `NEGATIVE_AREA`).** A boundary that does not close within 0.01 ft is a hand-edited file or a coordinate-precision loss. A negative `area=` attribute means the polygon was traced clockwise (LandXML convention is counter-clockwise for area-positive parcels).
9. **CgPoints northing/easting envelope.** The summary's `cgPoints` block reports the bounding box. Confirm it matches the project extents you expect; a 100-ft offset here is the easiest catch for a wrong base point.
10. **Re-emit and diff.** The validator's "Download cleaned" button re-emits the document with normalized whitespace. Diffing the cleaned file against the original highlights producer-specific anomalies (CRLF line endings, BOM, character-entity choices) that occasionally trip downstream parsers.

## After import

- Open Prospector and confirm every imported object appears with a non-zero geometry count.
- Drop a single COGO point at the project benchmark and inverse from it to a known surface vertex. The distance should match what the sender's report says.
- Save a `.dwg` snapshot under the QA folder before any further edits, so subsequent changes can be diffed back to the as-received state.

## See also

- `civil3d/surfaces/importing-surfaces.md` — full LandXML / DEM / point cloud import workflow.
- `civil3d/data-shortcuts/multi-discipline.md` — when LandXML is the right interchange and when it is not.
- The `validate_landxml` MCP tool, which returns the same summary structure programmatically for use in CI checks or batch QA scripts.
