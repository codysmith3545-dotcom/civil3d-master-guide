---
title: "NAD83, NAD83(2011), and WGS84"
section: "field-and-boundary/coordinate-systems"
order: 40
visibility: public
tags: [nad83, wgs84, realization, datum, gnss]
updated: 2026-05-06
sources:
  - title: "NOAA NGS — Geodetic Datums of the United States"
    url: https://geodesy.noaa.gov/datums/
    verified: 2026-05-06
  - title: "NOAA NGS — Tools for the National Spatial Reference System"
    url: https://geodesy.noaa.gov/TOOLS/
    verified: 2026-05-06
---

> **TL;DR**
> 1. NAD83 is North America-fixed; WGS84 is global. They are different reference frames and currently disagree by **roughly 1 to 2 meters** in the United States.
> 2. NAD83 has been **realized** several times (86, HARN, NSRS2007, 2011). Each realization shifts published coordinates by a few centimeters. Cite the realization on every plat.
> 3. For boundary, ALTA, and most engineering work, use **NAD83(2011)**. WGS84 is appropriate for global GNSS contexts and aerial collection but should be transformed before tying to cadastral control.

## What "realization" means

A datum is a definition; a realization is a list of coordinates for actual physical stations that approximate that definition. NAD83 has been realized multiple times because:

- Better geodetic measurements have become available (VLBI, GPS, more stations).
- Plate motion accumulates between realizations.
- Crustal deformation events (earthquakes, subsidence) move stations.

Each realization is published with a name and an epoch:

- **NAD83(86)** — the original 1986 adjustment.
- **NAD83(HARN)** — High Accuracy Reference Network, state-by-state campaigns in the 1990s.
- **NAD83(NSRS2007)** — first national GPS-based readjustment.
- **NAD83(2011) epoch 2010.0** — current published realization for the contiguous U.S.

Going from NAD83(86) to NAD83(2011), published coordinates in Indiana shift by something like a few centimeters horizontally — small relative to most boundary tolerances but large relative to high-accuracy GNSS work. State the realization on the plat to remove ambiguity.

## NAD83 vs WGS84

NAD83 was **originally defined** to match WGS84 within a meter or so. Both have been realized many times, and the original "near coincidence" no longer holds:

- **NAD83 is plate-fixed** to the North American plate. Stations on stable parts of the continent stay near their published coordinates over decades.
- **WGS84 (modern realizations)** is essentially equivalent to ITRF (the international terrestrial reference frame) at the centimeter level. It is **not plate-fixed**: as North America drifts (~2.5 cm/year), WGS84 coordinates of a point in Indiana drift relative to NAD83 coordinates of the same point.

The cumulative offset between NAD83(2011) and current WGS84 / ITRF in the contiguous U.S. is on the order of **1 to 2 meters horizontally**, depending on location and on which WGS84 realization is involved. That is consequential for cadastral and engineering work.

WGS84 also has its own realization series: G730, G873, G1150, G1674, G1762, G2139. Newer GPS receivers may report any of these depending on the broadcast ephemeris and processing. For sub-meter work the realization matters; for handheld navigation it does not.

## Why surveyors care

- **Boundary work** is referenced to NAD83. A control tie taken on a phone GPS in WGS84 is offset from cadastral control by 1+ meter.
- **GNSS networks** (RTN providers, OPUS) deliver NAD83(2011) by default; verify the realization in the report.
- **Aerial imagery** and lidar from third parties is often in WGS84/ITRF or in a state plane on NAD83(2011). Read the metadata; do not assume.
- **OPUS solutions** are published in NAD83(2011) and ITRF current realization. Use the NAD83(2011) values for cadastral work.

## When to use which

- **Cadastral / ALTA / boundary in Indiana:** NAD83(2011), Indiana State Plane East or West.
- **Civil engineering site design tied to a survey:** match the survey — NAD83(2011) on the appropriate state plane zone.
- **Construction control on a federal facility:** ask the agency. DOD facilities frequently use WGS84.
- **Global asset tracking, aviation, web mapping:** WGS84 / Web Mercator is fine.
- **Comparing GNSS observations at the centimeter level over time:** stay in ITRF or in epoch-tagged NAD83(2011); never mix realizations silently.

## Transforming between frames

NGS publishes the **HTDP** tool (Horizontal Time-Dependent Positioning) and **NCAT** for transforming between realizations and between NAD83 and ITRF/WGS84. Civil 3D's coordinate system database supports many of the same transformations through `MAPCSASSIGN` and the geodetic transformation chain. Always document the transformation used.

## Common pitfalls

- Saying "NAD83" without the realization. The reader cannot reproduce your numbers.
- Using a phone GPS coordinate as control. Phones report WGS84 with a few meters of accuracy at best.
- Assuming OPUS gives you WGS84 because it processed GPS observations. The OPUS report includes both NAD83(2011) and ITRF; pick the one that matches the project frame.
- Mixing aerial imagery in WGS84 / Web Mercator with cadastral data in NAD83(2011) without reprojecting.

## Related

- [Datums and projections](datums-and-projections.md)
- [State plane Indiana quick reference](state-plane-indiana-quick-reference.md)
- [Geoid and heights](geoid-and-heights.md)
