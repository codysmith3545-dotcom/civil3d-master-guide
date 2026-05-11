---
title: "Geoid Models — Geoid12B, Geoid18, and GEOID2022"
section: "field-and-boundary/datums"
order: 40
visibility: public
tags: [geoid, geoid18, geoid12b, geoid2022, hybrid-geoid, ellipsoid-height]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "NGS — Geoid Models"
    url: https://geodesy.noaa.gov/GEOID/
    verified: 2026-05-11
  - title: "NGS — GEOID18"
    url: https://geodesy.noaa.gov/GEOID/GEOID18/
    verified: 2026-05-11
  - title: "NGS — GEOID12B"
    url: https://geodesy.noaa.gov/GEOID/GEOID12B/
    verified: 2026-05-11
  - title: "NGS — GRAV-D Project (gravity for the redefined vertical datum)"
    url: https://geodesy.noaa.gov/GRAV-D/
    verified: 2026-05-11
  - title: "NGS — Guidelines for Establishing GPS-Derived Ellipsoid Heights, NOAA TM NOS NGS-58"
    url: https://geodesy.noaa.gov/PUBS_LIB/NGS-58.pdf
    verified: 2026-05-11
---

> **TL;DR**
> 1. A **geoid model** converts the **ellipsoid height (h)** that GNSS measures into the **orthometric height (H)** that engineers use, via the relation **H = h - N**, where N is the geoid undulation.
> 2. The current published U.S. hybrid geoid is **GEOID18** (released 2019), referenced to NAD83(2011) and NAVD88. It supersedes Geoid12B (released 2013) for the conterminous U.S., Puerto Rico, and the U.S. Virgin Islands.
> 3. The forthcoming **GEOID2022** is a fully gravimetric model that, with NAPGD2022, will replace both the hybrid-geoid concept and NAVD88 — until it is officially adopted, GEOID18 is the operational standard.

## What a geoid model is

The **geoid** is an equipotential surface of Earth's gravity field that approximates mean sea level extended under the continents. It is the natural reference for "elevation" because water flows from higher geoid potential to lower.

The **ellipsoid** (GRS 80 for NAD83, WGS 84 for the GPS broadcast frame) is a smooth mathematical surface — a useful approximation of Earth's shape for coordinate computations but not a physical surface.

A **geoid model** is a grid of values N(latitude, longitude) — the **geoid undulation** — that tells you how high the geoid is above (positive) or below (negative) the ellipsoid at every point. NGS publishes the model as a regular grid; the user interpolates N at the point of interest.

```
H = h - N
```

Where:
- H = orthometric height (elevation above the geoid; the "elevation" on most plans)
- h = ellipsoid height (what GNSS computes natively)
- N = geoid undulation (from the geoid model)

## Hybrid vs gravimetric geoids

NGS publishes two flavors:

- A **gravimetric geoid** (e.g., xGEOID, the experimental series) is computed from gravity observations alone. It represents the true gravity field but is not directly tied to NAVD88.
- A **hybrid geoid** (e.g., GEOID18) starts from a gravimetric geoid and is then warped to fit a network of GPS-on-Bench-Mark (GPSBM) control where both ellipsoid height and NAVD88 orthometric height are known. The hybrid geoid effectively transports NAVD88 to GNSS-equipped users.

For producing NAVD88-compatible elevations from GNSS, you must use a **hybrid** geoid (currently GEOID18 in CONUS).

## Geoid12B (2013-2019)

- **Coverage:** CONUS, Hawaii, Puerto Rico/USVI, Guam/CNMI, American Samoa, Alaska.
- **Reference frame:** NAD83(2011) ellipsoid, NAVD88 orthometric (CONUS).
- **Grid spacing:** 1 arc-minute.
- **Status:** Superseded by GEOID18 in the conterminous U.S., Puerto Rico, and USVI. Still authoritative for Alaska, Hawaii, Guam/CNMI, and American Samoa as of 2026.
- **Internal accuracy:** Approximately **2 to 5 cm at 95 percent confidence** in the conterminous U.S. (varies regionally).

## GEOID18 (2019-present)

- **Released:** September 2019.
- **Coverage:** Conterminous U.S., Puerto Rico, U.S. Virgin Islands.
- **Reference frame:** NAD83(2011) ellipsoid, NAVD88 orthometric.
- **Grid spacing:** 1 arc-minute.
- **GPSBM control:** Approximately 25,000 GPS-on-Bench-Mark points, roughly double the count used in Geoid12B.
- **Internal accuracy:** Approximately **1 to 4 cm at 95 percent confidence** in the conterminous U.S., per NGS release documentation. Improved accuracy in regions with denser GPSBM coverage.

GEOID18 is the **operational standard** for converting GNSS ellipsoid heights to NAVD88 orthometric heights in CONUS and PR/USVI as of 2026.

## GEOID2022 (forthcoming)

GEOID2022 is the gravimetric geoid that will define **NAPGD2022** — the replacement for NAVD88. Key differences from the hybrid geoids:

- **Pure gravimetric**, not warped to GPSBM control. Defined by the GRAV-D airborne gravity campaign (~75 percent of CONUS surveyed by 2026), surface gravity, and satellite missions (GRACE, GRACE-FO, GOCE).
- **Self-consistent worldwide** because it is based on gravity, not on a regional leveling network.
- **Expected accuracy:** target of approximately **1 to 2 cm at 95 percent confidence** for the conterminous U.S. (per the Blueprint Part 2). Independent of the local quality of NAVD88.

GEOID2022 will replace NAVD88 + GEOID18 as a unit when NAPGD2022 is officially adopted. Until that adoption (which has been deferred — see [NSRS 2022 overview](nsrs-2022-overview.md)), GEOID18 remains operational.

## Where to download

NGS distributes geoid models at [https://geodesy.noaa.gov/GEOID/](https://geodesy.noaa.gov/GEOID/):

- Binary grid files (.bin) for use in NGS tools and most third-party packages.
- ASCII grid files for inspection.
- A point-and-click computation tool (GEOID18 page) for one-off lookups.

Civil 3D ships geoid models with the AutoCAD Map 3D coordinate-system component; check the version included in your installation against the current GEOID18 release on the NGS page.

## Civil 3D implications

Civil 3D consumes a hybrid geoid model when transforming GNSS-derived ellipsoid heights to orthometric heights, and indirectly through the coordinate system definition.

To verify which geoid Civil 3D is using:

1. **Settings -> Edit Drawing Settings -> Units and Zone** — note the assigned coordinate system.
2. Coordinate-system definitions in the Autodesk catalog include a vertical datum and an associated geoid model. Confirm the catalog includes the current GEOID18 (or GEOID12B for non-CONUS work).

For boundary or construction work where elevation accuracy below 5 cm matters:

- Compute geoid undulations independently using the NGS online GEOID18 tool for at least 2 to 3 control points in the project area.
- Compare the NGS values to the values Civil 3D applies (you can read N implicitly by computing H from h with the project coordinate system, then back-checking).
- If they disagree by more than 1 cm, your Civil 3D installation may be on an older geoid model — update the coordinate-system catalog.

## Related sources for accuracy

NOAA Technical Memorandum NOS NGS-58 ("Guidelines for Establishing GPS-Derived Ellipsoid Heights") defines the procedural standards for ellipsoid-height surveys that downstream geoid-model use depends on.

## Indiana implications

Indiana sits in central CONUS where GEOID18 internal accuracy is favorable (typically 1 to 2 cm at 95 percent). When NAPGD2022 is adopted, NAVD88 elevations in Indiana are expected to drop by roughly **0.4 to 0.6 m** (final values pending NGS publication). See [State Plane Indiana](../../jurisdictions/indiana/state/state-plane-indiana.md) for the state's current vertical-datum context.

## Related

- [Vertical datums — NAVD88 vs NAPGD2022](vertical-datums-navd88-vs-napgd2022.md)
- [NSRS 2022 overview](nsrs-2022-overview.md)
- [GNSS static observations for control](../control-networks/gnss-static.md)
- [Coordinate systems](../coordinate-systems/index.md)
