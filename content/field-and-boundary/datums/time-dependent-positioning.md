---
title: "Time-Dependent Positioning (HTDP) — When to Use, Accuracy"
section: "field-and-boundary/datums"
order: 70
visibility: public
tags: [htdp, time-dependent, velocity, transformation, ngs-tool]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "NGS — Horizontal Time-Dependent Positioning (HTDP) tool"
    url: https://geodesy.noaa.gov/TOOLS/Htdp/Htdp.shtml
    verified: 2026-05-11
  - title: "Snay, R.A. (2003) — Horizontal Time-Dependent Positioning (HTDP), ASCE Journal of Surveying Engineering"
    url: https://geodesy.noaa.gov/CORS/Articles/SnayMSTR2003.pdf
    verified: 2026-05-11
  - title: "Pearson, C. and Snay, R. (2013) — Introducing HTDP 3.1 to transform coordinates across time and spatial reference frames, GPS Solutions"
    url: https://doi.org/10.1007/s10291-012-0255-y
    verified: 2026-05-11
  - title: "NGS — NCAT documentation (HTDP integration)"
    url: https://geodesy.noaa.gov/NCAT/
    verified: 2026-05-11
---

> **TL;DR**
> 1. **HTDP (Horizontal Time-Dependent Positioning)** is NGS's free tool that transforms coordinates between reference frames and between epochs by applying published station velocities and frame-to-frame transformations.
> 2. Use it whenever you need to **(a) compare coordinates observed at different epochs**, **(b) transform between ITRF and NAD83 realizations**, or **(c) account for crustal deformation** in active areas.
> 3. HTDP velocity model accuracy is approximately **1 to 3 mm/yr horizontal** in well-monitored CONUS areas, degrading near fault zones; absolute coordinate accuracy after transformation is dominated by the input coordinate, not the HTDP step.

## What HTDP does

HTDP is a NGS-maintained tool (currently HTDP 3.5.x as of mid-2026 — verify at the NGS page) that performs three related operations:

1. **Frame transformation** — convert a coordinate from one terrestrial reference frame to another (e.g., NAD83(2011) to ITRF2014, ITRF2008 to NAD83(CORS96), ITRF2014 to ITRF2020).
2. **Epoch transformation** — propagate a coordinate from one epoch to another within the same frame, using the published station velocity (or a regional velocity model where no per-station value is published).
3. **Combined transformation** — do both at once, e.g., take an ITRF2014 epoch 2024.50 coordinate and report it in NAD83(2011) epoch 2010.00.

It is available as a web form, a downloadable Fortran/binary executable, and indirectly through NCAT (which uses HTDP under the hood for inter-frame transformations).

## When to use HTDP

### Inter-realization transformations

When you receive a coordinate in ITRF (common from precise point positioning services like JPL APPS, Trimble CenterPoint RTX, NRCan CSRS-PPP) and need a NAD83 value, HTDP is the official path. Do not use a single 7-parameter Helmert; the rigorous transformation includes the time-dependent rotation rate of the North American plate.

### Comparing observations across years

If a station was observed in 2018 and again in 2026 and you want to detect monument movement, you must:

1. Reduce both observations to the same reference frame.
2. Apply the published velocity to one of the observations to bring it to the other's epoch.
3. Compare; the difference is the **anomalous motion** (i.e., movement beyond the modeled plate rotation).

### Working in active areas

In California, the Pacific Northwest, the Yellowstone region, and other tectonically or volcanically active areas, the published velocity model includes locally fitted strain rates. Skipping HTDP and using raw coordinates can introduce decimeter-level errors over a few years.

## How HTDP is built

HTDP combines:

- **Plate-motion models** (e.g., NUVEL-1A, MORVEL56) for the rigid rotation of major tectonic plates.
- **CORS station velocities** computed from years of GNSS data.
- **Strain-rate models** for actively deforming regions, derived from CORS networks like PBO/NOTA and special campaigns.
- **Coseismic offset models** for major earthquakes, applied as step functions at the event time.

The user supplies a coordinate, source frame and epoch, and target frame and epoch. HTDP returns the transformed coordinate and an estimate of the propagated uncertainty.

## Accuracy budget

HTDP's published accuracy is given in two pieces: the velocity model and the frame-to-frame transformation.

### Velocity model

In stable interior of plates with dense CORS coverage:
- **Horizontal velocity uncertainty:** approximately **1 to 3 mm/yr at 67 percent confidence**.
- **Vertical velocity uncertainty:** approximately **2 to 5 mm/yr at 67 percent confidence**.

In active areas (California, Cascadia):
- Horizontal velocity uncertainty grows to **5 to 20 mm/yr** in regions of high strain rate.
- Vertical velocity uncertainty similar or larger.

### Frame transformation

The 14-parameter Helmert transformations between published ITRF realizations carry uncertainties on the order of **3 to 5 mm + 0.1 ppm** at the relevant epoch.

### Epoch propagation

Position uncertainty grows with the time interval. Over 10 years in a stable interior, propagated uncertainty from velocity alone is roughly **10 to 30 mm horizontal**.

For routine surveying in Indiana, the velocity-derived uncertainty over a typical project span (months to a few years) is **under 1 cm**, well below the noise floor of conventional control surveys.

## How to run an HTDP transformation

### Web form

1. Go to [https://geodesy.noaa.gov/TOOLS/Htdp/Htdp.shtml](https://geodesy.noaa.gov/TOOLS/Htdp/Htdp.shtml).
2. Choose the operation (e.g., "Transform positions and/or velocities between reference frames").
3. Enter source frame, source epoch, target frame, target epoch, and the coordinate (latitude/longitude/height or XYZ).
4. Submit. The tool returns the transformed coordinate with formal uncertainty.

### Batch

For multiple coordinates, prepare an input file in HTDP's text format and upload through the web form, or run the downloadable executable on your own machine. The executable is updated infrequently — check the version date matches the NGS web tool.

### Inside NCAT

NCAT ([https://geodesy.noaa.gov/NCAT/](https://geodesy.noaa.gov/NCAT/)) calls HTDP for inter-realization transformations and is often easier for one-off computations. NCAT also does NADCON and VERTCON in the same UI.

## Civil 3D implications

Civil 3D does **not** include an HTDP-equivalent. Inter-realization transformations inside the Civil 3D coordinate-system catalog are based on static datum-shift parameters and do not account for time-dependent plate motion.

For datum or epoch transformations that matter:

1. Export the coordinate from Civil 3D in geographic form (latitude/longitude/ellipsoid height).
2. Run the transformation in NCAT or HTDP.
3. Import the transformed coordinate back into the Civil 3D project (or set up a separate drawing on the target coordinate system).

Document the transformation tool, version, frames, and epochs in the project metadata.

## Indiana implications

Within Indiana, HTDP is rarely operationally necessary for routine work because within-plate motion is small (under 2 mm/yr). It becomes useful when:

- Comparing modern InCORS-tied observations to legacy NAD83(HARN) or NAD83(CORS96) coordinates from older projects.
- Reducing PPP-derived coordinates (ITRF) to NAD83(2011) for boundary work.
- Preparing for the eventual NSRS 2022 transition, where HTDP will be one of the tools used to compute pre-/post-modernization shifts.

See [State Plane Indiana](../../jurisdictions/indiana/state/state-plane-indiana.md) for the realization context for Indiana State Plane.

## Related

- [Dynamic datums and plate tectonics](dynamic-datums-and-plate-tectonics.md)
- [NAD83(2011) realization](nad83-2011-realization.md)
- [GNSS vector processing](gnss-vector-processing-and-pp.md)
- [NSRS 2022 overview](nsrs-2022-overview.md)
