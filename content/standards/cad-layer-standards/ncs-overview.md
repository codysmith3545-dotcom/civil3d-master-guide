---
title: "NCS Overview"
section: "standards/cad-layer-standards"
order: 10
visibility: public
tags: [ncs, layer-naming, discipline-designator, cad-standards]
sources:
  - label: "National CAD Standard (NCS) v6 — NIBS"
    url: "https://www.nationalcadstandard.org/"
updated: 2026-05-06
---

> **TL;DR**
> 1. The NCS v6 layer name format is **Discipline-Major-Minor-Status**, with fields separated by hyphens. Example: `C-ROAD-CNTR-N` = Civil discipline, Road major group, Centerline minor group, New status.
> 2. Common discipline designators: **C** = Civil, **S** = Structural, **V** = Survey, **L** = Landscape, **A** = Architectural, **E** = Electrical, **M** = Mechanical, **G** = General.
> 3. Only the Discipline and Major fields are required. Minor and Status fields are optional but strongly recommended for large projects with multiple disciplines.

## NCS layer naming structure

The National CAD Standard (NCS), published by the National Institute of Building Sciences (NIBS), defines a uniform layer naming convention for AEC CAD work in the United States. Version 6 is current as of this writing.

### Field breakdown

```
D-MMMM-MMMM-S
│ │     │     └── Status (optional, 1 char)
│ │     └──────── Minor group (optional, up to 4 chars)
│ └────────────── Major group (required, up to 4 chars)
└──────────────── Discipline (required, 1-2 chars)
```

Each field is separated by a hyphen. All characters are uppercase. No spaces.

### Discipline designators

| Code | Discipline | Typical use |
|---|---|---|
| A | Architectural | Building plans, floor plans |
| C | Civil | Site, road, grading, utilities |
| E | Electrical | Power, lighting, low voltage |
| F | Fire Protection | Sprinklers, fire alarm |
| G | General | Title block, notes, borders shared across disciplines |
| H | Hazardous Materials | Environmental remediation |
| I | Interiors | Interior design, furniture |
| L | Landscape | Planting, hardscape, irrigation |
| M | Mechanical | HVAC, plumbing |
| P | Plumbing | Sanitary, domestic water (when separated from M) |
| Q | Equipment | Specialty equipment |
| R | Resource | Existing conditions surveys, as-builts |
| S | Structural | Foundations, framing |
| T | Telecommunications | Data, voice, AV |
| V | Survey/Mapping | Control, topo, boundary, ALTA |
| X | Other disciplines | Catch-all for non-standard disciplines |
| Z | Contractor/Shop | Shop drawings, contractor submittals |

Civil engineering and land surveying work primarily uses **C** (Civil) and **V** (Survey). Some firms use **V** for survey-origin layers (field shots, control, boundary) and **C** for design layers (proposed grading, roadway, utilities).

### Major group examples (Civil discipline)

| Layer | Description |
|---|---|
| C-ROAD | Road features (general) |
| C-STRM | Storm drainage |
| C-SSWR | Sanitary sewer |
| C-WATR | Water distribution |
| C-TOPO | Topographic features |
| C-GRAD | Grading |
| C-PROP | Proposed (general) |
| C-BNDY | Boundary |
| C-PKNG | Parking |
| C-ESMN | Easement |

### Minor group examples

| Layer | Description |
|---|---|
| C-ROAD-CNTR | Road centerline |
| C-ROAD-CURB | Road curb |
| C-ROAD-EDGE | Road edge of pavement |
| C-STRM-PIPE | Storm pipe |
| C-STRM-INLT | Storm inlet |
| C-STRM-MNHL | Storm manhole |
| C-TOPO-MAJR | Major contours |
| C-TOPO-MINR | Minor contours |
| C-TOPO-SPOT | Spot elevations |

### Status field

The single-character status field indicates the lifecycle phase of the element:

| Code | Meaning |
|---|---|
| N | New (proposed) |
| E | Existing to remain |
| D | Existing to be demolished |
| F | Future (planned but not in current phase) |
| T | Temporary |
| M | Moved or relocated |

Example: `C-ROAD-CNTR-N` = new (proposed) road centerline. `C-ROAD-CNTR-E` = existing road centerline to remain.

## NCS and Civil 3D

Civil 3D does not enforce NCS naming by default. The out-of-the-box templates use Autodesk's own layer naming (e.g., `C-ROAD`, `C-TOPO-MAJR`), which is largely NCS-aligned but not strictly NCS in all cases.

To enforce NCS:

1. Create or modify a DWT template with NCS-compliant layer names.
2. Map Civil 3D object styles and label styles to those layers (see [Civil 3D layer mappings](civil3d-layer-mappings.md)).
3. Use the Layer Translator (`LAYTRANS`) to convert non-compliant drawings.

## Related

- [Civil 3D layer mappings](civil3d-layer-mappings.md)
- [AIA vs NCS](aia-vs-ncs.md)
- [Standardizing across a company](standardizing-company-wide.md)
