---
title: "NAD83(2011) Realization — CORS-Based Definition and Epoch 2010.0"
section: "field-and-boundary/datums"
order: 20
visibility: public
tags: [nad83, nad83-2011, cors, epoch, realization]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "NGS — NA2011, PA2011, MA2011 Adjustment of NAD83 (Final Report)"
    url: https://geodesy.noaa.gov/web/surveys/NA2011/
    verified: 2026-05-11
  - title: "NGS — Continuously Operating Reference Stations (CORS)"
    url: https://geodesy.noaa.gov/CORS/
    verified: 2026-05-11
  - title: "NGS — Datum sheet for NAD83(2011) epoch 2010.00"
    url: https://geodesy.noaa.gov/datums/horizontal/north-american-datum-1983.shtml
    verified: 2026-05-11
  - title: "Snay, R.A. and Soler, T. (2008) — Continuously Operating Reference Station (CORS): History, Applications, and Future Enhancements"
    url: https://geodesy.noaa.gov/CORS/Articles/SnayJSE2008.pdf
    verified: 2026-05-11
---

> **TL;DR**
> 1. **NAD83(2011) epoch 2010.00** is the current published realization of NAD83 for the conterminous U.S., Alaska, and Puerto Rico/U.S. Virgin Islands. It was adopted in 2012 from the multi-year readjustment "NA2011."
> 2. The realization is **defined by the published coordinates of the CORS network** as of epoch 2010.00. Every passive mark is a derived position from a CORS-tied adjustment.
> 3. Coordinates are **frozen to a date (the epoch)**. The North American plate is moving at roughly **2.5 cm/yr (0.08 ft/yr)** relative to ITRF, so a NAD83(2011) coordinate observed today differs from the published value only by movement relative to the plate, not by the plate motion itself.

## What "NAD83(2011) epoch 2010.00" means

The label has three parts:

- **NAD83** — the geodetic datum (GRS 80 ellipsoid, geocentric origin).
- **(2011)** — the realization, named for the multi-year NA2011 readjustment that produced the published coordinates. Earlier realizations include NAD83(1986), NAD83(HARN), NAD83(CORS96), NAD83(NSRS2007).
- **epoch 2010.00** — the date to which the published coordinates are referred. January 1, 2010 at 00:00:00 UT.

A coordinate has all three labels because each one can be different. NAD83(2011) and NAD83(NSRS2007) are different realizations with sub-decimeter differences at most stations. Two coordinates on the same realization but at different epochs differ by the velocity of the station times the time elapsed.

## The CORS-based definition

NGS operates the **Continuously Operating Reference Stations (CORS) Network**, a federation of permanent GNSS receivers that stream and archive observation data. As of 2026 there are approximately **2,000 stations** in the network (the count fluctuates as stations join and retire — verify the current count at [geodesy.noaa.gov/CORS/](https://geodesy.noaa.gov/CORS/)).

NAD83(2011) is realized by:

1. NGS computes positions and linear velocities for every CORS station from years of GNSS observations, expressed in the International Terrestrial Reference Frame (ITRF).
2. Those ITRF positions/velocities are transformed to NAD83(2011) using a 14-parameter Helmert transformation that accounts for the rigid plate motion of North America.
3. The resulting CORS positions, frozen at epoch 2010.00, are the published reference. Every other station is positioned relative to these CORS by GNSS post-processing or differential leveling.

This is a fundamental shift from how NAD83 was originally realized. The 1986 realization was a least-squares adjustment of triangulation, traverse, leveling, and Doppler observations, with no continuous tracking. NAD83(2011) is defined by **continuous tracking of a fixed network**, which is why it can be improved over time without redoing the original observations.

## CORS station accuracy

Published NGS CORS coordinates carry the following accuracy metadata (see the data sheet for any individual CORS):

- **Horizontal:** typically **2 to 5 mm at 95 percent confidence** for the published epoch position.
- **Vertical (ellipsoid):** typically **5 to 15 mm at 95 percent confidence**.
- **Velocity:** typically **0.5 to 1.5 mm/yr horizontal, 1 to 3 mm/yr vertical** uncertainty.

These are the strongest published positions in the U.S. and the foundation of all derived control. For station-by-station accuracy, fetch the data sheet at [geodesy.noaa.gov/cgi-cors/corsage_2.prl](https://geodesy.noaa.gov/cgi-cors/corsage_2.prl).

## Epoch fixing

Because NAD83(2011) coordinates are published at a frozen epoch (2010.00) but stations actually move, GNSS observations made today must be **time-corrected** before they are compared to published values:

1. Observe the station today and compute a current-epoch position.
2. Apply the station's velocity (from the CORS data sheet for a CORS, or from the regional model for a passive mark) over the elapsed time since 2010.00.
3. Report the result at epoch 2010.00 to be comparable to published coordinates.

NGS tools (OPUS, OPUS-Projects, NCAT, HTDP) handle this automatically when you specify the desired output epoch. See [Time-dependent positioning](time-dependent-positioning.md) for the underlying HTDP model.

For typical surveying work in the conterminous U.S., the within-plate motion is small (a few mm/yr) and an uncorrected position is good to roughly **1 cm over a decade** in stable areas. Near the San Andreas fault or in subsidence basins, the motion can be tens of cm/yr and epoch correction is mandatory.

## Other 2011 realizations

The same NA2011 adjustment produced sister realizations for the Pacific and Mariana plates:

- **NAD83(PA11) epoch 2010.00** — Pacific plate (Hawaii, American Samoa, parts of the Pacific U.S. territories).
- **NAD83(MA11) epoch 2010.00** — Mariana plate (Guam, CNMI).

These are separate realizations because those territories sit on different tectonic plates and a single NAD83 frame cannot fit all of them.

## Civil 3D implications

In Civil 3D, set the coordinate system in **Settings -> Edit Drawing Settings -> Units and Zone**. The Civil 3D coordinate system catalog includes NAD83 zones, and the bundled definitions match the published NAD83(2011) ellipsoid and projection parameters for State Plane zones.

Civil 3D does **not** track the realization explicitly in the drawing properties — `IN83-EF` covers any NAD83 realization. Differences between NAD83(1986), NAD83(HARN), NAD83(CORS96), NAD83(NSRS2007), and NAD83(2011) are sub-meter and Civil 3D treats them as the same coordinate space. **You** must track the realization in the project metadata.

For boundary-grade work, when you import field-observed coordinates from a GNSS post-processing service such as OPUS, confirm that the OPUS solution was reduced to the same realization and epoch as the rest of the project data.

## Indiana implications

InCORS, the Indiana CORS network operated by INDOT, supplies real-time corrections referenced to NAD83(2011). For epoch fixing on long-running projects in Indiana, the within-plate motion is a few mm/yr and is usually negligible. See [State Plane Indiana](../../jurisdictions/indiana/state/state-plane-indiana.md) for which realization Indiana State Plane is currently published in.

## Related

- [NSRS 2022 overview](nsrs-2022-overview.md)
- [GNSS vector processing](gnss-vector-processing-and-pp.md)
- [Time-dependent positioning](time-dependent-positioning.md)
- [GNSS static observations for control](../control-networks/gnss-static.md)
