---
title: "Datums and Reference Frames"
section: "field-and-boundary/datums"
order: 0
visibility: public
tags: [datum, reference-frame, nsrs, nad83, nsrs2022, geodesy, index]
updated: 2026-05-11
sources:
  - title: "NGS — Geodetic Datums"
    url: https://geodesy.noaa.gov/datums/index.shtml
    verified: 2026-05-11
  - title: "NGS — NSRS Modernization"
    url: https://geodesy.noaa.gov/web/news/NSRS-modernization-update.shtml
    verified: 2026-05-11
---

> **TL;DR**
> 1. A geodetic **datum** is the coordinate framework that ties a survey to the earth. Modern U.S. work uses **NAD83(2011) epoch 2010.0** for horizontal and **NAVD88** for vertical, but the National Geodetic Survey (NGS) is replacing both with the modernized **National Spatial Reference System (NSRS) 2022** family.
> 2. Implementation of the new NSRS 2022 datums has been **deferred** from the original target year — the NGS rollout schedule continues to slip; verify the current status at [geodesy.noaa.gov/web/news/NSRS-modernization-update.shtml](https://geodesy.noaa.gov/web/news/NSRS-modernization-update.shtml) before relying on a target date.
> 3. Choose a datum and **state it in every deliverable** (datum, realization, epoch, units). Do not mix realizations on a project — sub-meter shifts will silently corrupt boundary work.

## Pages in this section

| Page | Description |
|---|---|
| [NAD83 vs NAD27](nad83-versus-nad27.md) | Historical context, NADCON transformations, why old plats need careful interpretation. |
| [NAD83(2011) realization](nad83-2011-realization.md) | The current published realization, CORS-based definition, and epoch 2010.0 fixing. |
| [NSRS 2022 overview](nsrs-2022-overview.md) | NATRF2022, NAPGD2022, and the modernization timeline (with current deferral status). |
| [Geoid models — Geoid12B, Geoid18, Geoid2022](geoid-models-12b-18-and-2022.md) | Geoid history, where to download, and how Civil 3D consumes a hybrid geoid. |
| [State Plane 2022](state-plane-2022.md) | What changes for State Plane Coordinates under NATRF2022 and the new SPCS2022 design. |
| [Dynamic datums and plate tectonics](dynamic-datums-and-plate-tectonics.md) | Why epoch matters when the ground is moving and how to fix coordinates to a date. |
| [Time-dependent positioning (HTDP)](time-dependent-positioning.md) | The NGS HTDP tool, when to use it, and its accuracy budget. |
| [Vertical datums — NAVD88 vs NAPGD2022](vertical-datums-navd88-vs-napgd2022.md) | Orthometric heights, geopotential numbers, and the shift from leveling-based to gravimetric. |
| [GNSS vector processing and post-processing](gnss-vector-processing-and-pp.md) | OPUS, OPUS-Projects, and commercial post-processing services compared. |

## Why datums deserve their own section

Most surveyors picked up datums on the job: somebody handed them a coordinate system to use, and that was that. The NSRS modernization breaks that assumption. When NGS publishes the new reference frames:

- Horizontal coordinates will shift by **~1 to 2 m** in most of the conterminous United States, because NATRF2022 is tied to the North American plate while NAD83 was tied to a frozen 1986 definition that has drifted from true ITRF.
- Vertical coordinates will shift by **~0.5 to 2 m** in different parts of the country (positive in some regions, negative in others) because NAPGD2022 replaces the regional NAVD88 leveling network with a gravimetric geoid.
- Every CAD template, every coordinate file, every calibration site, every plat reference will need re-evaluation.

This section gives you the conceptual handles to make decisions when the new datums arrive — and to interpret data referenced to any of the legacy datums you will encounter for decades.

## Indiana implications

Indiana State Plane coordinates are defined on NAD83 and will be redefined on NATRF2022 when SPCS2022 is published. See [State Plane Indiana — East and West Zones](../../jurisdictions/indiana/state/state-plane-indiana.md) for the current zone parameters and the realizations that have been used over the years.

## Related

- [Coordinate systems](../coordinate-systems/index.md)
- [Control Networks & Adjustment](../control-networks/index.md)
- [State Plane Indiana](../../jurisdictions/indiana/state/state-plane-indiana.md)
