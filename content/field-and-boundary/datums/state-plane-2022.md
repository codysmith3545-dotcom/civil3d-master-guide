---
title: "State Plane 2022 (SPCS2022) — What Changes Under NATRF2022"
section: "field-and-boundary/datums"
order: 50
visibility: public
tags: [spcs2022, state-plane, natrf2022, projection, low-distortion]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "NGS — State Plane Coordinate System of 2022 (SPCS2022)"
    url: https://geodesy.noaa.gov/SPCS/
    verified: 2026-05-11
  - title: "NGS — Policy and Procedures for the State Plane Coordinate System of 2022 (NOAA TR NOS NGS 71)"
    url: https://geodesy.noaa.gov/PUBS_LIB/NOAA_TR_NOS_NGS_0071.pdf
    verified: 2026-05-11
  - title: "Dennis, M.L. (2018) — The State Plane Coordinate System: History, Policy, and Future Directions (NOAA Special Publication NOS NGS 13)"
    url: https://geodesy.noaa.gov/library/pdfs/NOAA_SP_NOS_NGS_0013.pdf
    verified: 2026-05-11
  - title: "NGS Bulletin (Aug 2022) — NSRS Modernization update"
    url: https://geodesy.noaa.gov/web/news/NSRS-modernization-update.shtml
    verified: 2026-05-11
---

> **TL;DR**
> 1. **SPCS2022** redefines State Plane on **NATRF2022** instead of NAD83. Existing SPCS83 zone parameters (Indiana East FIPS 1301, etc.) are not preserved unchanged — each state's geodetic advisor proposes new zone definitions to NGS for adoption.
> 2. SPCS2022 supports **low-distortion projection (LDP) zones** in addition to traditional state-wide zones, allowing each state to opt for tighter distortion (target **20 ppm** or better) at the cost of more zones.
> 3. Implementation is **deferred** alongside the rest of NSRS 2022 (see [NSRS 2022 overview](nsrs-2022-overview.md)). Until NGS publishes final SPCS2022 zone definitions and a state's PE/PLS board accepts them, continue using SPCS83.

## What changes from SPCS83

### Datum

- **SPCS83** is defined on NAD83.
- **SPCS2022** is defined on NATRF2022 (CONUS + Alaska), PATRF2022 (Pacific), CATRF2022 (Caribbean), or MATRF2022 (Mariana).

A coordinate value reported in "Indiana East" feet is therefore not interchangeable between SPCS83 and SPCS2022 even if the projection parameters happened to be identical, because the underlying ellipsoid frame has shifted by ~1 to 2 m.

### Zone design

NGS Policy NOAA TR NOS NGS 71 lays out the menu of zone types each state may select for SPCS2022:

- **Statewide zone(s)** — analogous to SPCS83 zones (e.g., Indiana East / Indiana West). Designed for general-purpose use with the typical SPCS83 distortion target of about 100 to 200 ppm.
- **Multiple-zone systems** — a state may keep a 2-zone (or N-zone) setup if it benefits.
- **Low-distortion projection (LDP) zones** — additional small-area projections optimized to keep distortion under approximately **20 ppm**. Useful for cities, transportation corridors, and small project areas where ground-grid agreement matters.

The zone proposal is made by the state's NGS-recognized advisor (often a state geodetic surveyor or a state geographic information office) following NGS guidelines. NGS reviews and adopts.

### Units

SPCS2022 standardizes on the **international foot** (1 ft = 0.3048 m exactly) for U.S. customary units, deprecating the U.S. survey foot (1 ft = 1200/3937 m) that has caused decades of confusion. Each state may adopt international foot, meter, or both.

This affects every coordinate file, every CAD template, and every legal description that cites "feet" without qualification. The difference between U.S. survey feet and international feet is **2 ppm**, or **about 0.01 ft per 5,000 ft** — small but cumulative.

## Distortion

The grid-to-ground distortion in any conformal projection is unavoidable and varies across the zone. SPCS83 zones were designed for approximately **100 ppm** maximum distortion (1 part in 10,000), which translates to roughly **0.01 ft per 100 ft** of ground distance.

LDP zones in SPCS2022 target **20 ppm** maximum (1 part in 50,000), or about **0.01 ft per 500 ft**. This makes ground = grid for everything except the most demanding setting-out work.

## Why this matters

Once SPCS2022 is published and a state issues regulations:

- Every **new project** will be designed in SPCS2022. CAD templates, calibration sites, and coordinate certificates need re-issue.
- **Legacy projects** in SPCS83 remain valid (existing plats are recorded under their reported datum) but new field work that ties to legacy control must transform between datums. Expect a multi-year transition during which both systems are in use.
- **As-built deliverables** to public agencies will require the agency-specified datum (which may lag NGS adoption by months to years).

## Civil 3D implications

In Civil 3D, set the coordinate system in **Settings -> Edit Drawing Settings -> Units and Zone**. The coordinate-system catalog provided with AutoCAD Map 3D will need to add SPCS2022 zones; this is normally done via service pack or annual release after Autodesk picks up the new EPSG codes.

For now (mid-2026):

- SPCS2022 zones are **not** in the standard Civil 3D catalog because NGS has not finalized them.
- Continue assigning SPCS83 zones (`IN83-EF`, etc.) for new projects.
- When SPCS2022 zones become available, plan a project-by-project migration; do not bulk-convert legacy drawings without re-running the underlying field data through the new datum.

## Indiana implications

Indiana's NGS-recognized advisor (current contact: see Indiana Geographic Information Office at [www.in.gov/gis/](https://www.in.gov/gis/)) is responsible for proposing Indiana's SPCS2022 zone design. Possible outcomes when published:

- The two existing zones (Indiana East and Indiana West) may be retained with new projection parameters tuned to NATRF2022.
- One or more LDP zones may be added for major metropolitan areas (Indianapolis, Fort Wayne) or transportation corridors.
- The **U.S. survey foot** vs **international foot** decision will be made at the state level. INDOT and the Indiana Society of Professional Land Surveyors will coordinate.

Until those decisions are published, see [State Plane Indiana](../../jurisdictions/indiana/state/state-plane-indiana.md) for the current SPCS83 parameters that remain in force.

## Related

- [NSRS 2022 overview](nsrs-2022-overview.md)
- [NAD83(2011) realization](nad83-2011-realization.md)
- [State Plane Indiana](../../jurisdictions/indiana/state/state-plane-indiana.md)
- [Coordinate systems](../coordinate-systems/index.md)
