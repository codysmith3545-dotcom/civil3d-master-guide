---
title: "GNSS Vector Processing — OPUS, OPUS-Projects, and Commercial PP Compared"
section: "field-and-boundary/datums"
order: 90
visibility: public
tags: [opus, opus-projects, post-processing, ppp, gnss, baseline]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "NGS — OPUS (Online Positioning User Service)"
    url: https://geodesy.noaa.gov/OPUS/
    verified: 2026-05-11
  - title: "NGS — OPUS-Projects"
    url: https://geodesy.noaa.gov/OPUS-Projects/
    verified: 2026-05-11
  - title: "NGS — User Guidelines for Single Base Real Time GNSS Positioning (NOAA TM NOS NGS 58)"
    url: https://geodesy.noaa.gov/PUBS_LIB/NGS-58.pdf
    verified: 2026-05-11
  - title: "NRCan — CSRS-PPP (Canadian Spatial Reference System Precise Point Positioning)"
    url: https://webapp.csrs-scrs.nrcan-rncan.gc.ca/geod/tools-outils/ppp.php
    verified: 2026-05-11
  - title: "JPL — Automatic Precise Positioning Service (APPS)"
    url: https://pppx.gdgps.net/
    verified: 2026-05-11
  - title: "Trimble — CenterPoint RTX Post-Processing"
    url: https://www.trimblertx.com/
    verified: 2026-05-11
---

> **TL;DR**
> 1. **OPUS** is NGS's free single-baseline post-processing service. Submit a 2 to 48 hour static observation file; OPUS returns NAD83(2011) and ITRF coordinates with **typical 95 percent accuracy of 2 to 4 cm horizontal and 4 to 8 cm vertical**.
> 2. **OPUS-Projects** is the multi-station, multi-session, network-adjustment workflow. It produces a constrained least-squares solution across an entire project at typical accuracy of **1 to 2 cm horizontal**.
> 3. **Commercial PPP services** (NRCan CSRS-PPP, JPL APPS, Trimble CenterPoint RTX-PP) are precise point positioning solutions in ITRF that are independent of NGS and CORS — useful as a cross-check or in areas with sparse CORS.

## OPUS

OPUS (Online Positioning User Service) accepts a static GNSS RINEX observation file uploaded through a web form ([https://geodesy.noaa.gov/OPUS/](https://geodesy.noaa.gov/OPUS/)) and returns a coordinate solution.

### How it works

1. User uploads a dual-frequency RINEX observation file (typically 2 to 48 hours of data).
2. OPUS automatically selects three nearby CORS stations to use as references.
3. OPUS computes three independent baselines (one per CORS).
4. OPUS combines the three baselines into a single solution, reported in NAD83(2011) at a user-specified epoch and in IGS14 (or the latest ITRF realization).

### Variants

- **OPUS-S (Static)** — for sessions of **2 to 48 hours**. Three-baseline solution. Default and most common.
- **OPUS-RS (Rapid Static)** — for sessions of **15 minutes to 2 hours**. Uses additional nearby CORS for ambiguity resolution. Available in regions of dense CORS coverage; not available everywhere.
- **OPUS-Net** — older multi-baseline variant; superseded by OPUS-Projects.

### Accuracy

NGS publishes the following typical 95 percent confidence intervals for OPUS-S solutions in the conterminous U.S. (per the OPUS service description):

- **Horizontal:** approximately **2 to 4 cm** for a 4-hour session within 200 km of CORS.
- **Vertical (ellipsoid):** approximately **4 to 8 cm** for the same scenario.
- **Orthometric:** vertical accuracy + the GEOID18 model accuracy (~1 to 4 cm) added in quadrature.

OPUS-RS is generally a factor of 1.5 to 2x worse than OPUS-S for similar-length sessions in regions with sparse CORS.

### Limits

- OPUS solutions are **single-station**. They do not adjust a network of points jointly.
- Quality is sensitive to the receiver, antenna model accuracy, antenna height measurement, and CORS spacing.
- The "Quality Indicators" section of the OPUS report (overall RMS, percent of fixed ambiguities, peak-to-peak coordinate scatter) must be reviewed; weak indicators may signal a poor solution despite a confidently formatted output.

## OPUS-Projects

OPUS-Projects is a NGS-hosted workflow for **multi-station, multi-session** network adjustments. Useful when a project has more than a handful of control points and the user wants a single internally consistent solution.

### Workflow

1. Create a project on the OPUS-Projects portal.
2. Upload all RINEX files for all stations, multiple sessions per station as available.
3. The portal computes baselines among the project stations and from each station to selected CORS.
4. The user runs a constrained adjustment with selected CORS held fixed.
5. The portal returns a complete network adjustment with adjusted coordinates and accuracies.

The result is a NGS-published-style solution suitable for submission to the NGS database (Bluebook) if the user wishes to add the stations to the NSRS.

### Accuracy

Typical 95 percent confidence intervals for an OPUS-Projects adjusted network with at least three constrained CORS and 4-plus hour sessions:

- **Horizontal:** approximately **1 to 2 cm**.
- **Vertical (ellipsoid):** approximately **2 to 4 cm**.

These are not absolute accuracy guarantees — local site issues (multipath, antenna setup) can degrade specific stations.

## Commercial post-processing

### NRCan CSRS-PPP

The Canadian government's free Precise Point Positioning service. PPP processes a single station against precise IGS satellite orbits and clocks, with no need for a nearby CORS. Outputs are in ITRF (IGS14 or the current ITRF realization) at the observation epoch.

- **Accuracy:** typical **1 to 3 cm horizontal, 3 to 5 cm vertical at 95 percent** for a 4-hour static session, and improves with longer sessions toward sub-cm horizontal.
- **Use:** Independent cross-check of OPUS, or in regions with sparse CORS (high latitudes, oceans).
- **Output frame:** ITRF — must be transformed to NAD83 via NCAT/HTDP if a NAD83 deliverable is required.

### JPL APPS

The Jet Propulsion Laboratory's free PPP service, similar to CSRS-PPP. Same accuracy class. Reports in IGS14.

### Trimble CenterPoint RTX Post-Processing

Commercial PPP service from Trimble. Subscription-based. Comparable accuracy to CSRS-PPP/JPL APPS for static; also offers real-time RTX corrections for cm-level RTK without a base station.

## Choosing the right tool

| Scenario | Recommended tool |
|---|---|
| One static occupation, need NAD83 coordinate, near CORS | OPUS-S |
| Network of project control, multiple sessions | OPUS-Projects |
| One short occupation (15 min to 2 h) in dense-CORS region | OPUS-RS |
| One static occupation, need ITRF coordinate, anywhere | NRCan CSRS-PPP or JPL APPS |
| Independent cross-check on an OPUS solution | NRCan CSRS-PPP |
| Real-time cm-level positioning without a local base | Trimble CenterPoint RTX (commercial RTK + PP) |
| Sub-cm requirement (geodetic monitoring) | OPUS-Projects with very long sessions, or NGS Bluebook submission |

## Civil 3D implications

Civil 3D ingests post-processed coordinates as point objects (PNEZD or LandXML) regardless of the processing service. The tool used to produce the coordinates does **not** propagate into the Civil 3D drawing — it must be recorded in project metadata.

Best practice for OPUS solutions imported into Civil 3D:

1. Save the OPUS report (PDF/email) in the project documents folder.
2. Note the OPUS solution ID, the CORS used, and the reported accuracy in the point description or in a separate control-summary document.
3. Confirm the coordinate system in **Settings -> Edit Drawing Settings -> Units and Zone** matches the OPUS output (e.g., `IN83-EF` for Indiana East / NAD83 / U.S. survey feet).
4. Cross-check at least one point with a second independent solution (CSRS-PPP, OPUS-RS, or a published NGS data sheet for a nearby mark).

## Indiana implications

Indiana CORS coverage is dense (InCORS plus federal CORS) — typically several stations within 50 km of any project site in the 8-county area. OPUS-S is reliable across the state. OPUS-RS is generally available. For larger control networks, OPUS-Projects produces a defensible NAD83(2011) solution. See [State Plane Indiana](../../jurisdictions/indiana/state/state-plane-indiana.md) for the state's coordinate-system context.

## Related

- [GNSS static observations for control](../control-networks/gnss-static.md)
- [NAD83(2011) realization](nad83-2011-realization.md)
- [Time-dependent positioning](time-dependent-positioning.md)
- [Geoid models](geoid-models-12b-18-and-2022.md)
