---
title: "NSRS 2022 — NATRF2022, NAPGD2022, and the Modernization Timeline"
section: "field-and-boundary/datums"
order: 30
visibility: public
tags: [nsrs2022, natrf2022, napgd2022, modernization, ngs]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "NGS — NSRS Modernization update"
    url: https://geodesy.noaa.gov/web/news/NSRS-modernization-update.shtml
    verified: 2026-05-11
  - title: "NGS Bulletin (Aug 2022) — NSRS Modernization update"
    url: https://geodesy.noaa.gov/web/news/NSRS-modernization-update.shtml
    verified: 2026-05-11
  - title: "NGS — Blueprint for the Modernized NSRS, Part 1: Geometric Coordinates and Terrestrial Reference Frames (NOAA TR NOS NGS 62)"
    url: https://geodesy.noaa.gov/PUBS_LIB/NOAA_TR_NOS_NGS_0062.pdf
    verified: 2026-05-11
  - title: "NGS — Blueprint for the Modernized NSRS, Part 2: Geopotential Coordinates and Geopotential Datum (NOAA TR NOS NGS 64)"
    url: https://geodesy.noaa.gov/PUBS_LIB/NOAA_TR_NOS_NGS_0064.pdf
    verified: 2026-05-11
---

> **TL;DR**
> 1. The modernized **National Spatial Reference System (NSRS) 2022** replaces NAD83 with **four plate-fixed terrestrial reference frames** and replaces NAVD88 with the gravimetric geopotential datum **NAPGD2022**.
> 2. Status as of **2026-05-11**: rollout has been **deferred** beyond the original 2022 target. NGS continues to publish updates at [geodesy.noaa.gov/web/news/NSRS-modernization-update.shtml](https://geodesy.noaa.gov/web/news/NSRS-modernization-update.shtml) — verify the current status before relying on a target date in any contract or specification.
> 3. When NSRS 2022 is published, expect horizontal shifts of roughly **1 to 2 m** and vertical shifts of roughly **0.5 to 2 m** versus current published NAD83(2011)/NAVD88 coordinates. Treat the changeover as a re-survey, not a transformation.

## What NSRS 2022 includes

NGS's "Blueprint for the Modernized NSRS" describes the new system in two parts:

### Geometric — four plate-fixed reference frames

NAD83 is replaced by **four** terrestrial reference frames, one per major tectonic plate:

| Frame | Plate | Coverage |
|---|---|---|
| **NATRF2022** | North American | CONUS, Alaska, parts of Canada and Mexico |
| **PATRF2022** | Pacific | Hawaii, American Samoa |
| **CATRF2022** | Caribbean | Puerto Rico, U.S. Virgin Islands |
| **MATRF2022** | Mariana | Guam, CNMI |

Each is a **dynamic** reference frame: positions are functions of time and a station's coordinate is given as `(x, y, z, t)` rather than a single epoch-frozen value. Coordinates can be requested at any epoch the user specifies.

NGS aligns each frame to ITRF2020 (or the latest ITRF realization) by a 14-parameter Helmert transformation that includes the published Euler pole rotation rate of the corresponding plate. Within the plate, points appear approximately stationary; across plate boundaries, motion is explicit.

### Geopotential — NAPGD2022

NAVD88 (orthometric heights from precise leveling) is replaced by the **North American-Pacific Geopotential Datum of 2022 (NAPGD2022)**, defined by:

- A high-resolution gravimetric **geoid model**, GEOID2022, computed primarily from the GRAV-D airborne gravity campaign and surface/satellite gravity data.
- Optional related products: deflections of the vertical, geopotential numbers, and dynamic heights.

Heights in NAPGD2022 are computed from GNSS-derived ellipsoidal heights minus the geoid undulation, eliminating the need for a separate national leveling network as the primary realization.

## Why NGS is doing this

Two driving problems with the current system:

1. **NAD83 is misaligned with ITRF by ~2 m.** NAD83 was defined in 1986 to make North American satellite positions agree with the contemporary Doppler reference frame. Subsequent refinements of ITRF have moved by ~1.5 to 2 m relative to where NAD83 sits. This mismatch is invisible to surveyors using NAD83-tied tools but causes problems whenever data is exchanged with global users (precise navigation, scientific geodesy, autonomous vehicles).
2. **NAVD88 is biased by ~0.5 to 1 m and tilted across the country.** The 1988 leveling adjustment did not account for systematic errors that subsequent gravity work (GRACE, GRAV-D, satellite altimetry) has revealed. The bias is small in the central U.S. and grows toward the Pacific Northwest and Alaska.

## Modernization timeline (current status)

Originally NGS targeted **2022** for adoption (hence the names). Implementation has slipped multiple times. The current authoritative status is published at [geodesy.noaa.gov/web/news/NSRS-modernization-update.shtml](https://geodesy.noaa.gov/web/news/NSRS-modernization-update.shtml). At time of writing (2026-05-11) deployment is **deferred** without a published firm date — the page should be checked before any specification or contract milestone references the new datums.

While NGS works toward the new system, NAD83(2011) and NAVD88 remain the **official** datums of the United States. Old coordinates remain valid; new survey work continues to use NAD83(2011) and NAVD88.

## Expected shifts when adopted

NGS has published preliminary shift estimates from public webinars and the Blueprint reports. Approximate magnitudes for the conterminous U.S.:

- **Horizontal (NAD83(2011) -> NATRF2022):** ~1 to 2 m. Direction varies regionally; in the eastern U.S. the shift is roughly 1.4 m east-southeast.
- **Vertical (NAVD88 -> NAPGD2022):** **-0.5 to +2 m**. NAVD88 is approximately 0.5 m too high in the central U.S. and 1.5 to 2 m too high in the Pacific Northwest, so most heights will become smaller numbers.

These are **gross expected magnitudes**, not transformations to use. NGS will publish definitive transformation grids (analogous to NADCON for horizontal and VERTCON for vertical) at adoption time.

## Civil 3D implications

Civil 3D coordinate-system catalogs are maintained by Autodesk and updated through service packs. When NSRS 2022 is published:

- Autodesk will need to add NATRF2022/SPCS2022 zones to the catalog.
- Existing drawings on NAD83 will continue to work as before.
- For new projects, you will assign the NATRF2022 zone in **Settings -> Edit Drawing Settings -> Units and Zone**.

Until Autodesk publishes the new zones, do not attempt to manually re-define the coordinate system — the published projection parameters and transformation grids are not yet final.

## What to do now

- **Educate clients and reviewers.** Many DOTs, utilities, and county GIS agencies will issue separate NSRS 2022 transition plans.
- **Maintain epoch hygiene.** Always tag coordinates with realization and epoch (e.g., "NAD83(2011) epoch 2010.00") in deliverables. This habit pays off when you start mixing legacy and modernized data.
- **Track NGS bulletins.** NGS publishes infrequent but important bulletins. Subscribe at [geodesy.noaa.gov](https://geodesy.noaa.gov/).

## Indiana implications

Indiana State Plane will be redefined as part of SPCS2022 on NATRF2022. INDOT and the Indiana Geographic Information Office will publish state-specific transition guidance when the new datums become official. See [State Plane Indiana](../../jurisdictions/indiana/state/state-plane-indiana.md) for the current zones and [State Plane 2022](state-plane-2022.md) for what is expected to change.

## Related

- [State Plane 2022](state-plane-2022.md)
- [Vertical datums — NAVD88 vs NAPGD2022](vertical-datums-navd88-vs-napgd2022.md)
- [Geoid models](geoid-models-12b-18-and-2022.md)
- [Dynamic datums and plate tectonics](dynamic-datums-and-plate-tectonics.md)
