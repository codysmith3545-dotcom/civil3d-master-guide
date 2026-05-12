---
title: "Vertical Datums — NAVD88 vs NAPGD2022"
section: "field-and-boundary/datums"
order: 80
visibility: public
tags: [navd88, napgd2022, orthometric-height, geopotential, vertical-datum]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "NGS — North American Vertical Datum of 1988 (NAVD88)"
    url: https://geodesy.noaa.gov/datums/vertical/north-american-vertical-datum-1988.shtml
    verified: 2026-05-11
  - title: "NGS — Blueprint for the Modernized NSRS, Part 2: Geopotential Coordinates and Geopotential Datum (NOAA TR NOS NGS 64)"
    url: https://geodesy.noaa.gov/PUBS_LIB/NOAA_TR_NOS_NGS_0064.pdf
    verified: 2026-05-11
  - title: "Zilkoski, D.B., Richards, J.H., and Young, G.M. (1992) — Results of the General Adjustment of the North American Vertical Datum of 1988"
    url: https://geodesy.noaa.gov/PUBS_LIB/NAVD88/navd88report.htm
    verified: 2026-05-11
  - title: "NGS — GRAV-D Project"
    url: https://geodesy.noaa.gov/GRAV-D/
    verified: 2026-05-11
  - title: "NGS — VERTCON"
    url: https://geodesy.noaa.gov/TOOLS/Vertcon/vertcon.html
    verified: 2026-05-11
---

> **TL;DR**
> 1. **NAVD88** (North American Vertical Datum of 1988) is the current official vertical datum of the United States. It defines orthometric heights anchored to a single tide gauge (Father Point/Rimouski, Quebec) and propagated through a continental leveling adjustment.
> 2. **NAPGD2022** (North American-Pacific Geopotential Datum of 2022) replaces NAVD88 with a **gravimetric** definition based on the GEOID2022 model and **geopotential numbers** rather than directly on orthometric heights.
> 3. The shift between datums in CONUS is approximately **-0.5 to +1.5 m**, with NAVD88 generally **too high** in most of the country (heights will get smaller numbers under NAPGD2022). Adoption is **deferred** alongside the rest of NSRS 2022.

## NAVD88

### Definition

NGS adopted NAVD88 in 1991 from the General Adjustment of the North American Vertical Datum (Zilkoski, Richards, and Young, 1992). Key facts:

- **Realization:** A least-squares adjustment of approximately **81,500 km** of leveling observations across the U.S., Canada, and Mexico.
- **Origin:** Held fixed at one tide gauge — **Father Point/Rimouski, Quebec** — at the elevation derived from the International Great Lakes Datum 1985 (IGLD85). All other heights are propagated from there by leveling.
- **Heights:** Helmert orthometric heights, computed as integrated leveled differences with an approximate gravity correction.
- **Internal accuracy:** Typically **a few centimeters** between adjacent benchmarks; accumulated systematic tilt across the country is much larger (see below).

### Known biases

Subsequent gravity work (notably the GRACE/GRACE-FO satellite missions and the GRAV-D airborne campaign) has shown that NAVD88 has a **systematic tilt** across the conterminous U.S. on the order of **0.5 to 1.5 m** end-to-end:

- NAVD88 heights are biased **high** by roughly **0.5 m** in the central U.S.
- The bias grows to **1.5 to 2 m** in the Pacific Northwest.
- The bias is smaller (closer to zero) in the southeastern U.S.

These biases mean NAVD88 heights are not consistent at the decimeter level across long distances, even though they are internally consistent over short distances.

### When NAVD88 is the right answer

For most engineering work, the local self-consistency of NAVD88 is what matters. Two NAVD88 benchmarks 5 km apart are typically agreement to a few centimeters because the leveling between them is accurate. The continental tilt does not affect drainage design, parking lot grading, or building elevations.

NAVD88 is the right answer for:

- Anything tied to local benchmarks (FEMA flood elevations, local stormwater design, plat elevations).
- Any project where consistency with neighbouring previously surveyed work matters.
- Any project where the design specification cites NAVD88.

## NAPGD2022

### Definition

NAPGD2022 is the geopotential datum that, with the four NSRS 2022 horizontal frames, completes the modernization. Defining elements per Blueprint Part 2 (NOAA TR NOS NGS 64):

- **Reference surface:** The geoid implied by **GEOID2022**, a fully gravimetric model built from GRAV-D airborne gravity data, surface gravity, and satellite missions.
- **Primary quantity:** **Geopotential number** (C, in m^2/s^2 — the difference in gravity potential between the geoid and the point). Heights are derived from geopotential numbers and a chosen height system (orthometric, dynamic, normal).
- **Default height type for users:** Orthometric height computed from C and a published gravity model.

### Geopotential numbers

The geopotential number C of a point is:

```
C = W0 - Wp
```

Where W0 is the gravity potential at the geoid and Wp is the gravity potential at the point. C is in units of **m^2/s^2** (sometimes written as **gpu**, geopotential units, with 1 gpu = 10 m^2/s^2).

To convert C to a usable height:

- **Orthometric height** H = C / g_bar, where g_bar is the average gravity along the plumb line from the geoid to the point.
- **Dynamic height** Hd = C / gamma_45, where gamma_45 is normal gravity at 45 degrees latitude. Useful for hydraulics because two points with the same dynamic height are on the same equipotential surface.
- **Normal height** H* = C / gamma_avg, used in some European systems.

NGS's intent is for the average user to continue working in orthometric heights computed from geopotential numbers — the math happens inside the software.

### Expected accuracy

Per Blueprint Part 2:

- **Target accuracy of the GEOID2022 model:** approximately **1 to 2 cm at 95 percent confidence** for the conterminous U.S., independent of NAVD88 leveling quality.
- **Geopotential numbers** at NGS-published stations: target accuracy comparable to current published NAVD88 heights at well-established benchmarks.

## NAVD88 to NAPGD2022 shifts

NGS will publish a transformation grid (analogous to VERTCON's role for NGVD29 to NAVD88) when NAPGD2022 is adopted. Approximate expected shifts in CONUS (from the Blueprint and NGS webinars):

| Region | Approximate shift NAVD88 -> NAPGD2022 |
|---|---|
| Central U.S. (including Indiana) | -0.4 to -0.6 m |
| Northeast | -0.2 to -0.5 m |
| Southeast | -0.1 to -0.3 m |
| Pacific Northwest | -1.5 to -2.0 m |
| California | -0.5 to -1.0 m |
| Alaska | varies, large in places |

Negative shifts mean NAPGD2022 elevations are **smaller numbers** than NAVD88 — buildings and benchmarks will have lower published elevations under the new datum.

## VERTCON (legacy vertical transformation)

Until NAPGD2022 is published, the analogous transformation is **VERTCON**, which converts between **NGVD29 (1929 Sea Level Datum)** and **NAVD88**. VERTCON uses a published grid of shifts. The conterminous-U.S. shift ranges from approximately **-1.5 to +0.5 m**.

VERTCON is reachable from NCAT or directly at [https://geodesy.noaa.gov/TOOLS/Vertcon/vertcon.html](https://geodesy.noaa.gov/TOOLS/Vertcon/vertcon.html). Older plats and FEMA studies sometimes report NGVD29 elevations; transform them to NAVD88 with VERTCON before mixing with modern data.

## Civil 3D implications

Civil 3D's coordinate-system catalog assigns a **vertical datum** (NAVD88, NGVD29, or others) to each coordinate-system definition. Set in **Settings -> Edit Drawing Settings -> Units and Zone**.

For practical work today:

- Use NAVD88 for U.S. work unless the project spec says otherwise.
- Note the **geoid model** in use (GEOID18 in CONUS as of 2026); see [Geoid models](geoid-models-12b-18-and-2022.md).
- Track NAVD88 vs NGVD29 in legacy plats — VERTCON before importing.

When NAPGD2022 is adopted, expect Autodesk to add it to the catalog through a service pack. Until then, do not attempt to manually re-define the vertical datum.

## Indiana implications

Indiana sits in the central-CONUS belt where the NAVD88 -> NAPGD2022 shift is expected to be roughly **-0.4 to -0.6 m**. Practically, every flood elevation, finished-floor elevation, sewer invert, and benchmark publication will have a lower numerical value when NAPGD2022 is adopted.

INDOT, the Indiana Geographic Information Office, and FEMA will publish state and federal transition guidance. Until then continue using NAVD88 in Indiana. See [State Plane Indiana](../../jurisdictions/indiana/state/state-plane-indiana.md) for state datum context.

## Related

- [Geoid models — Geoid12B, Geoid18, GEOID2022](geoid-models-12b-18-and-2022.md)
- [NSRS 2022 overview](nsrs-2022-overview.md)
- [Level networks](../control-networks/level-networks.md)
- [Coordinate systems](../coordinate-systems/index.md)
