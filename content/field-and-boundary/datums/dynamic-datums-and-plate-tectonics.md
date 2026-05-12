---
title: "Dynamic Datums and Plate Tectonics — Why Epoch Matters"
section: "field-and-boundary/datums"
order: 60
visibility: public
tags: [dynamic-datum, epoch, plate-tectonics, itrf, deformation]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "NGS — NSRS Modernization update"
    url: https://geodesy.noaa.gov/web/news/NSRS-modernization-update.shtml
    verified: 2026-05-11
  - title: "NGS — Time-Dependent Positioning (HTDP) Tool"
    url: https://geodesy.noaa.gov/TOOLS/Htdp/Htdp.shtml
    verified: 2026-05-11
  - title: "Snay, R.A. (2003) — Horizontal Time-Dependent Positioning (HTDP)"
    url: https://geodesy.noaa.gov/CORS/Articles/SnayMSTR2003.pdf
    verified: 2026-05-11
  - title: "Altamimi et al. — ITRF2020: an augmented reference frame refining the modeling of nonlinear station motions (J. Geodesy)"
    url: https://doi.org/10.1007/s00190-023-01738-w
    verified: 2026-05-11
  - title: "NGS — Blueprint for the Modernized NSRS, Part 1 (NOAA TR NOS NGS 62)"
    url: https://geodesy.noaa.gov/PUBS_LIB/NOAA_TR_NOS_NGS_0062.pdf
    verified: 2026-05-11
---

> **TL;DR**
> 1. A **static datum** (NAD83) freezes coordinates at a single epoch and ignores subsequent motion. A **dynamic datum** (the NSRS 2022 frames, ITRF) treats every coordinate as a function of time.
> 2. The North American plate moves at roughly **2.0 to 2.5 cm/yr (0.07 to 0.08 ft/yr)** relative to ITRF; within the stable interior of the plate, station-to-station relative motion is typically under **2 mm/yr**.
> 3. To compare GNSS observations across years, declare an **epoch** for every coordinate (e.g., "epoch 2010.00") and apply a velocity model — NGS's HTDP tool or the NATRF2022 plate-rotation model — to bring observations to a common epoch.

## Static vs dynamic datums

### Static datum

NAD83(2011) **epoch 2010.00** is a static datum: every published coordinate is referred to a single date (2010.00) and stays at that value forever, even though the underlying monument may have moved. The realization absorbs plate motion via a Helmert transformation, so positions on the North American plate appear nearly stationary within the realization.

This works as long as:

- All users observe and report at approximately the same epoch. Differences of months don't matter for survey-grade work in stable areas.
- The underlying plate model is correct enough that the realization remains internally consistent.
- Crustal motion within the plate is small.

When any of those break — across a multi-decade project, near an active fault, or when comparing North American data with global data — the static datum starts producing wrong answers and the user has to apply explicit velocity corrections.

### Dynamic datum

A dynamic datum like ITRF or the NSRS 2022 frames represents every station's position as **(x(t), y(t), z(t))** with an explicit linear velocity (and sometimes higher-order or episodic terms). The user requests a coordinate at the epoch they care about, and the system applies the velocity model to compute it.

Internally, NGS realizes the new NATRF2022 frame by:

1. Tying CORS positions to ITRF2020 in a continuously updated solution.
2. Applying an Euler rotation that represents the rigid motion of the North American plate.
3. Reporting positions in NATRF2022 at any user-requested epoch.

A coordinate then carries a label like **"NATRF2022 epoch 2026.50"** — that is, the position the station occupies on June 30, 2026.

## Plate motion magnitudes

### North American plate vs ITRF

The interior of the North American plate moves at approximately:

- **2.0 to 2.5 cm/yr (0.07 to 0.08 ft/yr) horizontally**, in a south-southwest direction relative to ITRF.
- **Negligible vertical motion** in most of the central U.S. (millimeters per year).

This motion is what NAD83 absorbs by sitting on a non-ITRF realization. NATRF2022 will absorb it the same way, just with a more rigorously modeled plate rotation.

### Within-plate motion

Even inside the "stable" interior, individual stations move relative to each other:

- **Glacial isostatic adjustment (GIA)** lifts the upper Midwest and northern New England by roughly **1 to 5 mm/yr** as the crust rebounds from Pleistocene ice load.
- **Subsidence** in the Mississippi delta, parts of the Central Valley of California, and various oil/gas fields can reach **5 to 50 mm/yr or more**.
- **Tectonic deformation** near the San Andreas, Cascadia, and other plate boundaries can exceed **20 mm/yr horizontal**.

Indiana sits in the stable interior, far from active plate boundaries. Within-plate motion across the 8-county area is typically under **2 mm/yr**, which over a 10-year project amounts to **about 2 cm** — at or below conventional survey accuracy for boundary work.

### Episodic motion

GNSS time series show step-function offsets at:

- Major earthquakes (centimeter to meter offsets).
- Antenna or monument changes (millimeter offsets that look like real motion if not flagged).
- Slow slip events.

NGS's CORS time series flag known offsets in their published velocity models.

## When epoch matters in practice

| Scenario | Epoch fidelity needed |
|---|---|
| Routine project survey, stable area, single year | Ignore epoch (use today's GNSS-derived coordinate as-is). |
| Boundary tied to NGS-published control | Reduce GNSS observation to the published epoch (typically 2010.00 for NAD83(2011)). |
| Multi-year construction project on a single coordinate system | Reduce all observations to the project's reference epoch. |
| Comparing CORS solutions years apart | Apply station velocities; expect cm-level drift. |
| Near an active fault or subsidence zone | Apply local velocity field, not just plate model. |
| Working with ITRF-frame data (autonomous vehicles, scientific) | Always specify epoch in transformations. |

## Civil 3D implications

Civil 3D drawings carry a single coordinate-system assignment in **Settings -> Edit Drawing Settings -> Units and Zone**. The drawing does **not** track an epoch — that is metadata you maintain separately.

Best practices:

- Record the epoch of each coordinate import in the project notebook (e.g., "All control imported from OPUS solutions reduced to NAD83(2011) epoch 2010.00 on 2026-04-15").
- For CORS-tied work, run OPUS or OPUS-Projects with the **output epoch** set to your project epoch (the OPUS web UI lets you specify this).
- Avoid mixing observations reduced to different epochs in a single drawing without an explicit transformation step.

When NSRS 2022 is adopted and Civil 3D supports the new dynamic frames, the workflow will likely involve:

- Setting the drawing to a NATRF2022 zone.
- Specifying a project epoch in the drawing properties (the exact mechanism will depend on Autodesk's implementation, which is not yet published).

## Indiana implications

Indiana's within-plate motion is under **2 mm/yr** in horizontal and small (a few mm/yr at most) in vertical. Epoch correction is recommended for any project tied to NGS-published control but is rarely the dominant error source in routine boundary or topographic work. See [State Plane Indiana](../../jurisdictions/indiana/state/state-plane-indiana.md) for the current Indiana datum context.

## Related

- [Time-dependent positioning (HTDP)](time-dependent-positioning.md)
- [NSRS 2022 overview](nsrs-2022-overview.md)
- [NAD83(2011) realization](nad83-2011-realization.md)
- [GNSS vector processing](gnss-vector-processing-and-pp.md)
