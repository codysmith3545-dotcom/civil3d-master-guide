---
title: "Description Key Sets — Indiana PNEZD"
section: "customization/description-keys"
order: 10
visibility: public
tags: [description-keys, points, civil3d, trimble, topcon, carlson, pnezd, indiana]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "Civil 3D Description Keys reference"
    url: "https://help.autodesk.com/view/CIV3D/2024/ENU/?guid=GUID-A6FF1F4E-DEAA-4B89-91A4-9DE8BC58E0AE"
    verified: 2026-05-11
    note: "Autodesk help ID is stable; URL may rotate across Civil 3D versions"
  - title: "Indiana 865 IAC 1-12 — Minimum Standards for Surveys"
    url: "https://www.in.gov/pla/professional-licensing-boards/professional-licensing-agency-boards/state-board-of-registration-for-professional-surveyors/"
    verified: 2026-05-11
    note: "deep IAC URL not stable — surveyor board landing page; unverified, needs check"
  - title: "Trimble Access — Help / data formats"
    url: "https://help.trimblegeospatial.com/TrimbleAccess/"
    verified: 2026-05-11
  - title: "Topcon MAGNET Field — User Manual (PDF)"
    url: "https://www.topconpositioning.com/"
    verified: 2026-05-11
    note: "PDF lives behind the product page; unverified deep link"
  - title: "Carlson SurvCE / SurvPC — User Manual"
    url: "https://web.carlsonsw.com/files/knowledgebase/kbase_attach/"
    verified: 2026-05-11
    note: "manuals are in the KB; unverified deep link"
---

> **TL;DR**
> 1. Three Description Key Sets are provided, one per common data collector: **Trimble Access**, **Topcon MAGNET**, **Carlson SurvCE/PC**. All three consume PNEZD-format point files.
> 2. The shared code list lives in `description-codes-master.csv` — 150+ codes covering monumentation, utilities, topography, vegetation, and control. The three `.deskey.yaml` files reference those codes.
> 3. Build the description-key set in Civil 3D by hand-entering rows from the YAML, or use a future loader script. Each set is drawing-resident, so save it into the office DWT (`customization/templates/`).

## What is here

| File | Purpose |
|---|---|
| `description-codes-master.csv` | The recommended code list itself — `code, description, layer, point_style, label_style, notes`. Single source of truth. |
| `trimble-access-pnezd.deskey.yaml` | Description-key set tuned for Trimble Access PNEZD CSV exports. |
| `topcon-magnet-pnezd.deskey.yaml` | Description-key set tuned for Topcon MAGNET PNEZD exports. |
| `carlson-survce-pnezd.deskey.yaml` | Description-key set tuned for Carlson SurvCE/PC PNEZD exports. |

The three `.deskey.yaml` files have the same code coverage but differ in:

- **Wildcard handling** — collectors quote and escape descriptions slightly differently, so a key that works against Trimble's output may need a leading wildcard adjustment for MAGNET.
- **Parameter conventions** — Trimble surveys typically code `TR-DEC 12` (tree, deciduous, 12-inch diameter); MAGNET tends to use `TRD12` (no space); Carlson often `TR-DEC*12*` with delimiters.
- **Special suffix codes** — feature-line start/end codes (`+`, `-`, `.PC`, `.PT`) differ per collector.

## How to use

1. Pick the file for the collector your crews use.
2. In Civil 3D, Toolspace > Settings tab > Point > Description Key Sets > New > name it (e.g. `Indiana-Trimble`).
3. Edit Keys; for each entry in the YAML add a row with the matching Code, Point Style, Point Label Style, Layer, and Format string.
4. Save the drawing as a template (DWT) so the set is reusable.

## Status

**Spec-only.** A `.dws` (drawing standard) or `.xml` Civil 3D export is not produced inside this repo; build the key set against your live office DWT and re-save.

## Source standards

- **Indiana 865 IAC 1-12** drives the monumentation codes (IPF/IPS/CONC-MON/MAG/RR-SPIKE/X-CONC).
- **NCS v6** drives the layer assignments.
- **INDOT Standard Drawings** drive symbology cues for R/W and roadway features.

## Contributing

Add new codes to `description-codes-master.csv` first, then mirror into each of the three `.deskey.yaml` files. Keep the three sets symmetric — a code missing in only one set is almost always a bug.
