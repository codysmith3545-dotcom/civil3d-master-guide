---
title: "What As-Builts Capture"
section: "field-and-boundary/as-builts"
order: 10
visibility: public
tags: [as-built, storm, sanitary, water, building, site, reviewing-authority]
updated: 2026-05-06
---

> **TL;DR**
> 1. As-builts document **what was actually constructed**, not what was planned — the key data is measured positions and elevations of installed infrastructure, with deviations from the design noted.
> 2. Every discipline has its own required data set: storm and sanitary need **rim, inverts, pipe size, material, length, and slope**; water needs **valve positions, hydrant locations, bends, and depth of cover**; building/site needs **corners, FFE, and grading**.
> 3. Always check with the **reviewing authority** (city, county, MS4 coordinator, or state agency) for their specific as-built requirements before surveying — requirements vary significantly between jurisdictions.

## Storm sewer

Storm sewer as-builts capture the gravity drainage system as installed:

| Data item | What to measure |
|---|---|
| Manhole/inlet rim elevation | Top of casting, measured to 0.01 ft |
| Invert elevations | Inside bottom of each pipe entering and leaving the structure, measured to 0.01 ft |
| Pipe size | Nominal diameter in inches, verified against the actual pipe |
| Pipe material | RCP, PVC, HDPE, CMP, etc. — verify, do not assume from the plan |
| Pipe length | Measured between structures (center to center or inside face to inside face, per local convention) |
| Pipe slope | Computed from upstream and downstream inverts and the measured length |
| Structure type and size | 48 in. manhole, Type C inlet, junction box, etc. |
| Structure location | Horizontal position (northing/easting or station/offset) |
| Headwall/endwall/outfall | Location, invert, size, material, and condition at the point of discharge |

Many Indiana municipalities (Carmel, Fishers, Indianapolis DPW) require storm as-builts for permit closeout and MS4 compliance.

## Sanitary sewer

Sanitary as-builts capture the same structure data as storm, plus:

| Data item | What to measure |
|---|---|
| Lateral connections | Location (station on the main or distance from upstream MH), invert, size, material, direction of lateral |
| Drop connections | Vertical drop from incoming pipe to the outgoing flow line within the structure |
| Cleanouts | Location and invert |
| Force main connections | Location, size, material, connection type |

Sanitary as-builts are typically reviewed by the local utility or sewer district. Some require video inspection (CCTV) in addition to the survey.

## Water main

Water mains are pressurized, so inverts and slopes are less critical. As-built data focuses on:

| Data item | What to measure |
|---|---|
| Horizontal alignment | Plan-view position of the main, including bends and fittings |
| Depth of cover | Measured at representative points (minimum depth, typically 42 to 48 in. in Indiana) |
| Valve locations | Horizontal position and type (gate, butterfly, etc.) |
| Hydrant locations | Horizontal position, distance to property lines and pavement |
| Fitting locations | Bends, tees, reducers — type, size, and position |
| Material and size | Verify pipe material (DIP, PVC, HDPE) and nominal diameter |
| Service connections | Location of service taps along the main |

Water as-builts are usually submitted to the water utility. Some utilities require GPS coordinates for all valves and hydrants for GIS integration.

## Building and site

Building and site as-builts cover the finished conditions of the built environment:

| Data item | What to measure |
|---|---|
| Building corners | Horizontal position of each exterior corner |
| Finished floor elevation (FFE) | Top of finished floor at the primary entrance(s) |
| Foundation type and elevation | If accessible, bottom of footing and top of foundation wall |
| Parking lot grades | Spot elevations at representative points, drain locations |
| Retaining walls | Top and bottom elevations, horizontal position, length |
| Detention/retention basin | Bottom elevation, outlet structure invert, emergency overflow elevation, side slopes, volume confirmation |
| Curb and pavement | Flow line elevations, edge of pavement, sidewalk grades |
| Grading | Spot elevations across the site sufficient to confirm drainage patterns match the approved plan |

Site as-builts are often required for permit closeout (building permit, grading permit, stormwater permit).

## What the reviewing authority typically requires

Requirements vary by jurisdiction. Common items:

- **Marked-up plan set** (PDF or paper) with red-line corrections showing as-built conditions.
- **Tabular data** (rim, inverts, pipe size, material, length, slope) for all storm and sanitary structures.
- **Certification** by a licensed professional surveyor that the as-built survey was performed under their supervision. See [certification language](certification-language.md).
- **CAD files** (DWG) with as-built information on designated layers.
- **GIS deliverable** (SHP or geodatabase) for utilities, especially water and sewer.

Before surveying, request the reviewing authority's as-built submittal checklist. Many Indiana municipalities publish these on their websites. Submitting incomplete data results in rejection and a return trip to the field.

## Related

- [Storm/sanitary as-builts](storm-sanitary-as-builts.md)
- [Site as-builts](site-as-builts.md)
- [As-built deliverables](as-built-deliverables.md)
- [Certification language](certification-language.md)
