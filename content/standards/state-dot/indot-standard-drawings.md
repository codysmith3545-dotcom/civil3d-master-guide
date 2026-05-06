---
title: "INDOT Standard Drawings (E-Series)"
section: "standards/state-dot"
order: 30
visibility: public
tags: [indot, standard-drawings, e-series, guardrail, drainage, signing, curb-ramp, cad]
sources:
  - title: "INDOT Standard Drawings"
    url: "https://www.in.gov/indot/div/contracts/standards/drawings/"
updated: 2026-05-06
---

> **TL;DR**
> 1. INDOT publishes E-series standard drawings — pre-approved construction details covering guardrail, drainage structures, signing, pavement markings, curb ramps, and other common elements. These drawings are referenced on plan sheets by number rather than reproduced.
> 2. Current E-drawings are downloadable as PDFs and, for some series, as DWG files suitable for insertion into Civil 3D plan sets. Always use the current INDOT-published version, not a copy from a previous project.
> 3. Key series for civil/survey work: E 601 (curb and gutter details), E 604 (curb ramps), E 705 (catch basins and inlets), E 706 (manhole details), and E 800-series (signing and pavement markings).

## What standard drawings are

Standard drawings (also called "E-drawings" because of their E-prefix numbering) are pre-approved construction details that eliminate the need to draft repetitive details on every project. The plan sheets reference them by number:

```
SEE INDOT STANDARD DRAWING E 705-CBSA-01
```

The contractor then builds according to the referenced drawing. This reduces plan preparation time and ensures consistency across all INDOT projects.

## Drawing series overview

### E 200 — Earthwork and Erosion Control

| Drawing | Description |
|---|---|
| E 205 | Silt fence installation details |
| E 205-SW | Stabilized construction entrance |
| E 212 | Temporary sediment basin and trap details |

### E 400/500 — Pavement

| Drawing | Description |
|---|---|
| E 501 | Concrete pavement joint details (longitudinal, transverse, expansion) |
| E 502 | Concrete pavement patching details |

### E 600 — Incidental Construction

| Drawing | Description |
|---|---|
| E 601 | Concrete curb and gutter types (A through E) — dimensions, reinforcement, expansion joints |
| E 604-CRDI | Curb ramp details (diagonal, perpendicular, parallel) per ADA/PROWAG requirements |
| E 604-CRPR | Curb ramp perpendicular type |
| E 605 | Concrete sidewalk details — thickness, joint spacing, cross-slope |
| E 609 | Guardrail (W-beam) installation — post spacing, terminal sections, transitions |
| E 609-CB | Cable barrier details |

The E 604 curb ramp drawings are updated frequently to reflect evolving ADA/PROWAG standards. Always verify the current version.

### E 700 — Drainage

| Drawing | Description |
|---|---|
| E 701 | Pipe bedding and backfill details by pipe type (RCP, HDPE, CMP) |
| E 705-CBSA | Catch basin, Type SA (side-opening with grate top) |
| E 705-CBSB | Catch basin, Type SB |
| E 705-CBSC | Catch basin, Type SC (curb inlet) |
| E 706-MH | Manhole details (precast, cast-in-place) |
| E 706-JB | Junction box details |
| E 715 | Riprap placement and sizing |

These drawings correspond to the pipe network structures used in Civil 3D's pipe and structure catalogs. When setting up a Civil 3D parts list for an INDOT project, the structure dimensions should match the E 705/706 details.

### E 800 — Signing and Pavement Markings

| Drawing | Description |
|---|---|
| E 800 series | Sign panel dimensions, mounting heights, post types |
| E 803 | Object markers and delineators |
| E 810 series | Pavement marking details (centerline, edge line, crosswalk, turn arrows) |

### E 900 — Structures (Bridges)

Bridge-specific details. Not typically used by site designers but included for completeness.

## Using E-drawings in Civil 3D

### Referencing on plan sheets

The standard practice is to list referenced E-drawings in the plan's General Notes or Detail Sheet index:

```
STANDARD DRAWINGS REFERENCED:
E 601-01 CONCRETE CURB AND GUTTER, TYPE A
E 604-CRPR CURB RAMP, PERPENDICULAR TYPE
E 705-CBSA-01 CATCH BASIN, TYPE SA
```

Do not redraw or modify the E-drawing content. If a project requires a non-standard detail, create a project-specific detail and note the deviation from the standard drawing.

### Inserting CAD files

For some series, INDOT publishes DWG files that can be inserted as blocks or xrefs:

1. Download the current DWG from the INDOT standard drawings webpage.
2. Insert into the Civil 3D detail sheet as a block or external reference.
3. Scale to match the plan set's plot scale. Most INDOT DWGs are drawn at full scale (1:1 in paper-space units).

Do not modify the inserted drawing. If it needs annotation adjustments for the plan set, place annotations on a separate layer.

### Parts catalog alignment

When building a Civil 3D pipe network for an INDOT project:

1. Set up the parts list with structures matching E 705/706 types (catch basin SA, SB, SC; manholes per E 706-MH).
2. Match pipe materials to the project's material specification (RCP per Section 703, HDPE per Section 701).
3. Ensure minimum cover and slope requirements from the Standard Specifications and the IDM Chapter 29 tables are met.

## Where to download

All current standard drawings are posted at [https://www.in.gov/indot/div/contracts/standards/drawings/](https://www.in.gov/indot/div/contracts/standards/drawings/). The page organizes drawings by series number. PDFs are always available; DWGs are available for select series.

INDOT revises standard drawings as needed. Revision dates appear on each drawing. Bookmark the page and check before starting a new project.

## Common gotchas

- **Outdated drawings.** Using an E-drawing from a previous project risks referencing a superseded version. INDOT plan reviewers check drawing revision dates. Always download fresh from the INDOT website.
- **Modified E-drawings.** Altering an E-drawing (e.g. changing dimensions to fit a field condition) without noting the modification is a contract violation. If a modification is needed, create a project-specific detail and obtain approval.
- **Curb ramp updates.** The E 604 series changes frequently due to evolving ADA/PROWAG requirements. A drawing that was current last year may be superseded. Check the revision date on every curb ramp detail.
- **DWG units.** Some downloaded DWGs are in inches, others in feet. Verify before inserting into a plan set drawn in feet — an incorrect scale factor produces details that look correct on screen but are dimensionally wrong.
- **Missing from parts catalog.** Civil 3D's shipped structure catalog does not include INDOT-specific structure types by default. The INDOT Country Kit or a custom parts catalog must be configured to match E 705/706 dimensions.

## Related

- [INDOT IDM chapter map](indot-idm-chapter-map.md)
- [INDOT Standard Specifications](indot-standard-specs.md)
- [INDOT permitting](indot-permitting.md)
- [Surrounding-state DOTs](surrounding-states.md)
