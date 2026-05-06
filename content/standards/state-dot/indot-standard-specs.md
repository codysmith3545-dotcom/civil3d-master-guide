---
title: "INDOT Standard Specifications"
section: "standards/state-dot"
order: 20
visibility: public
tags: [indot, standard-specifications, construction, earthwork, drainage, pavement]
sources:
  - title: "INDOT Standard Specifications"
    url: "https://www.in.gov/indot/div/contracts/standards/book/sep23/sep.htm"
updated: 2026-05-06
---

> **TL;DR**
> 1. The INDOT Standard Specifications define construction materials, methods, and acceptance criteria for all INDOT-let contracts. They are the contractual companion to the IDM (which covers design) and the Standard Drawings (which cover details).
> 2. Key sections for civil/survey practitioners: Section 200 (Earthwork), Section 700 (Drainage), Section 400/500 (Pavements), and Section 600 (Incidental Construction — curb, sidewalk, guardrail).
> 3. The current edition is published on the INDOT Division of Contract Administration website. Supplemental Specifications and Recurring Special Provisions modify the base book for individual lettings.

## What the Standard Specifications cover

The Standard Specifications are organized into divisions and sections:

### Division 100 — General Provisions

Covers contract administration: definitions, bidding requirements, insurance, subcontracting, prosecution and progress, measurement and payment. Section 105 (Control of Work) and Section 109 (Measurement and Payment) establish the rules for quantity measurement — important for plan preparers writing pay items.

### Division 200 — Earthwork

| Section | Topic | Relevance |
|---|---|---|
| 203 | Excavation and Embankment | Cut/fill operations, compaction requirements, borrow and waste. Defines how earthwork volumes in Civil 3D corridor sections translate to pay quantities. |
| 204 | Subgrade Treatment | Preparation of the subgrade below pavement. |
| 207 | Obliterating Old Road | Removal of existing pavement and subbase. |
| 211 | Topsoil | Stripping, stockpiling, and respreading. |
| 212 | Temporary Erosion and Sediment Control | Silt fence, inlet protection, stabilized construction entrances. Coordinates with INDOT's MS4 permit requirements. |

Section 203 compaction requirements: 95% of Standard Proctor (AASHTO T 99) density for embankments, 100% for the top 12 inches of subgrade. These values appear in earthwork notes on Civil 3D plan sheets.

### Division 300 — Base Courses

Sections 301-304 cover aggregate base, bituminous base, and cement-treated subgrade. Material gradation and thickness requirements link to the pavement design tables in IDM Chapter 52.

### Division 400 — Bituminous Pavements

Sections 401-402 define HMA (hot mix asphalt) mix types, placement, compaction, density testing, and ride quality. Pay items reference INDOT mix designations (9.5 mm surface, 19.0 mm intermediate, 25.0 mm base).

### Division 500 — Rigid Pavements

Sections 501-502 cover PCCP (Portland cement concrete pavement) — mix design, joint layout, dowel bars, curing. Joint spacing and dowel placement dimensions appear on INDOT standard cross sections.

### Division 600 — Incidental Construction

| Section | Topic | Relevance |
|---|---|---|
| 604 | Concrete Curb and Gutter | Standard curb types (A, B, C, D, E) with dimensions. Civil 3D corridor assemblies should match these. |
| 605 | Concrete Sidewalk | Thickness, joint spacing, ramp requirements. |
| 609 | Guardrail | W-beam and cable barrier installation, post spacing. |
| 621 | Seeding and Mulching | Permanent vegetative cover requirements post-construction. |

### Division 700 — Drainage

| Section | Topic | Relevance |
|---|---|---|
| 701 | Pipe Culverts | Pipe materials, bedding, backfill. INDOT accepts HDPE, RCP, CMP, and RCPA per project requirements. |
| 703 | Storm Sewer Pipe | Pipe material and installation for storm sewer systems. |
| 705 | Concrete and Masonry Structures | Catch basins, manholes, headwalls, junction boxes. |
| 706 | Inlet Castings and Frames | Standard casting types referenced by INDOT E-drawings. |
| 715 | Riprap | Sizing criteria (INDOT classes 1 through 4) and placement. |

### Division 800 — Structures (Bridges)

Covers structural concrete, steel, bearings, and bridge deck work. Generally used by bridge engineers rather than site designers.

### Division 900 — Materials

References to AASHTO and ASTM test methods for all materials. Section 904 (Aggregates) defines aggregate gradations. Section 910 (Pipe Materials) lists accepted pipe types and standards.

## How Standard Specifications relate to the IDM

The IDM tells the designer **what** to design (geometric criteria, pipe sizes, pavement thickness). The Standard Specifications tell the contractor **how** to build it (material requirements, compaction effort, placement tolerances). Together, they define the complete set of project requirements.

When preparing plans in Civil 3D:

- Quantities computed from the corridor model (earthwork, pavement, curb) must reference pay items defined in the Standard Specifications.
- Notes on plan sheets (compaction requirements, material specs) cite Standard Specifications section numbers.
- Special provisions modify the Standard Specifications for project-specific conditions.

## Current edition and updates

INDOT publishes the Standard Specifications as a base book (the most recent is typically updated every 3-5 years). Between editions, INDOT issues:

- **Supplemental Specifications**: amendments that apply to all lettings after a certain date.
- **Recurring Special Provisions (RSPs)**: standard boilerplate modifications included in most contracts.
- **Project-specific Special Provisions**: unique to a single letting.

The current base book and supplemental specifications are posted at the INDOT Division of Contract Administration website. Verify the edition before citing section numbers; an older edition may have different section numbering.

## Key values for site designers

| Parameter | INDOT Standard Specification | Value |
|---|---|---|
| Embankment compaction | 203.24 | 95% Standard Proctor (AASHTO T 99) |
| Subgrade compaction (top 12 in.) | 203.24 | 100% Standard Proctor |
| Minimum pipe cover (RCP) | 701 | 1 ft (12 in.) minimum; varies by pipe class and traffic loading |
| Concrete sidewalk thickness | 605 | 4 in. residential, 6 in. commercial/drive crossings |
| Concrete curb and gutter | 604 | Per type; Type A is 6 in. gutter width, 6 in. curb height (check current drawings) |

These values inform Civil 3D grading, corridor, and pipe-network design.

## Common gotchas

- **Edition mismatch.** Citing a section number from the 2018 book when the 2023 book is current can cause plan review rejections. Always verify the current edition.
- **Supplemental overrides base.** A supplemental specification supersedes the corresponding base-book section. Read both when researching a requirement.
- **State vs local.** INDOT Standard Specifications apply to INDOT-let projects. City and county projects may have their own specifications (often based on INDOT but with modifications). Verify the project's governing specification.
- **Pay item numbering.** INDOT uses a numeric pay item system (e.g. 203-01234) tied to the Standard Specifications sections. Civil 3D quantity reports should produce item numbers matching the current pay item catalog.

## Related

- [INDOT IDM chapter map](indot-idm-chapter-map.md)
- [INDOT Standard Drawings](indot-standard-drawings.md)
- [INDOT permitting](indot-permitting.md)
- [Surrounding-state DOTs](surrounding-states.md)
