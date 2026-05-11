---
title: "Civil 3D Survey Template — Spec Bundle"
section: "customization/templates"
order: 10
visibility: public
tags: [template, dwt, survey, civil3d, indiana, ncs, indot]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "INDOT Standard Drawings (current edition)"
    url: "https://www.in.gov/indot/engineering/design/standard-drawings/"
    verified: 2026-05-11
  - title: "National CAD Standard (NCS) v6 — NIBS"
    url: "https://www.nationalcadstandard.org/"
    verified: 2026-05-11
  - title: "Indiana 865 IAC 1-12 — Minimum Standards for Surveys"
    url: "https://www.in.gov/pla/professional-licensing-boards/professional-licensing-agency-boards/state-board-of-registration-for-professional-surveyors/"
    verified: 2026-05-11
    note: "unverified deep link — surveyor board landing page; rule text via IN.gov IAC search"
---

> **TL;DR**
> 1. This directory contains a **specification**, not a binary `.dwt`. A Civil 3D drawing template cannot be built without AutoCAD installed; everything here is machine-readable so a surveyor can rebuild the template in about an hour.
> 2. The spec covers layers (NCS-flavored), text/dim/mleader/table/point styles, Civil 3D drawing settings, and a recommended abbreviation list. Layer + symbology defaults lean toward Indiana practice (INDOT-aligned colors, ALTA-aware utility breakdown).
> 3. To build: follow `c3d-survey-template.build-notes.md` from top to bottom. To load layers fast, use the LISP routine `customization/lisp/library/layer/load-layers-from-csv.lsp` (referenced from build notes).

## What's in this directory

| File | Purpose |
|---|---|
| `c3d-survey-template.spec.yaml` | Master spec: indexes every other file, declares versions and sources. |
| `c3d-survey-template.build-notes.md` | Surveyor-readable, ordered, copy-paste-friendly rebuild guide. |
| `layer-standard.csv` | ~80 layers — name, color, linetype, lineweight, plot flag, description, NCS ref, source. |
| `text-styles.csv` | Text style table — font, height, width factor, obliquing. |
| `dim-styles.yaml` | Full DIMSTYLE settings for survey-scale dimensions. |
| `mleader-styles.yaml` | MLeader styles for callouts and bearing/distance leaders. |
| `table-styles.yaml` | Table styles for legal description, line/curve, easement schedules. |
| `point-styles.yaml` | Civil 3D Point Style + Point Label Style definitions. |
| `drawing-settings.yaml` | Ambient settings (units, precision, direction format), abbreviations dictionary. |

## How this template is meant to be used

Survey-focused projects: boundary, topographic, ALTA/NSPS, control. The template assumes:

- **Units**: imperial, US Survey Feet.
- **Coordinate basis**: project-defined. The template ships unprojected; assign NAD83(2011) Indiana East/West (or appropriate State Plane zone) per project.
- **North reference**: azimuth from north, clockwise; bearings displayed `Q DD-MM-SS Q`.
- **Drawing scale**: annotative — text and dimensions scale with viewport annotation scale. Default annotation scale: `1" = 50'`.

## Source standards (citations)

- **INDOT Standard Drawings** for symbology cues on survey/right-of-way work. See `c3d-survey-template.spec.yaml` for the live URL.
- **NCS v6** for layer naming convention (`V-…` survey discipline, `C-…` civil).
- **Indiana 865 IAC 1-12** (Minimum Technical Standards for Surveys) drives monument codes and the description-code requirements that the description-key sets honor.
- **Hamilton County design standards** for the drainage/utility layer subset (storm structures, water service, sanitary cleanouts).

## Status

**Spec-only.** The binary `.dwt` has not been produced inside this repo because the sandbox does not have AutoCAD/Civil 3D installed. Build the template locally with `c3d-survey-template.build-notes.md`, then store the resulting `.dwt` in your office template path — do not commit binaries to this public repo.

## Contributing

If you regenerate the template against a newer Civil 3D version:

1. Bump `template.version` in `c3d-survey-template.spec.yaml`.
2. Add the version to `template.appliesTo`.
3. Note any setting changes in `c3d-survey-template.build-notes.md` under a dated changelog block.
4. If you change layer names, bump the CSV header's note column and adjust the description-key sets that reference those layers.
