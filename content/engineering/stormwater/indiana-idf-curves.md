---
title: "Indiana IDF Curves and Where to Find Them"
section: "engineering/stormwater"
order: 40
visibility: public
tags: [idf, rainfall, noaa-atlas-14, indot, indiana, hydrology]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCalculators: [rational-method, scs-runoff]
jurisdictionRefs: [indiana/state/indot, indiana/state/idem]
updated: 2026-05-06
sources:
  - title: "NOAA Atlas 14, Volume 2 (Ohio River Basin), Version 3"
    url: https://hdsc.nws.noaa.gov/pfds/pfds_map_cont.html
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 203 (Hydrology)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
  - title: "IDEM Stormwater Specialist Manual"
    url: https://www.in.gov/idem/stormwater/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Intensity-Duration-Frequency (IDF) curves report the average rainfall intensity (in/hr) for a given storm duration and return period at a specific location.
> 2. The current authoritative source for Indiana is **NOAA Atlas 14, Volume 2 (Ohio River Basin), Version 3**. Pull point precipitation frequency estimates ("PF estimates") for the project's lat/long.
> 3. Some county and INDOT references still cite older Bulletin 71 / TP-40 values. NOAA Atlas 14 supersedes both — use it unless a regulator explicitly requires the legacy data.
> 4. IDEM expects the design storm and IDF source to be documented on the construction plans and in the SWPPP.

## What an IDF curve is

For a given location an IDF curve gives rainfall intensity i (in/hr) as a function of storm duration D (typically 5 minutes to 24 hours) for several return periods (1, 2, 5, 10, 25, 50, 100, 500-yr). The same data are also published as depth (inches) by duration and return period.

Three things to keep straight:

- **Intensity vs depth.** Intensity (in/hr) divided into depth (in) requires that the duration be in hours. The rational method needs intensity; SCS methods need a 24-hr depth.
- **Return period vs Annual Exceedance Probability (AEP).** A 100-yr storm has a 1% AEP — a 1% chance of being equaled or exceeded in any year. Over a 30-yr design life the cumulative probability is about 26%.
- **Point vs areal precipitation.** IDF data are point estimates. For drainage areas larger than ~10 sq mi apply an areal reduction factor (NOAA Atlas 14 publishes the factors in Volume 2). For typical land-development sites the point estimate is used directly.

## NOAA Atlas 14 (current standard)

NOAA Atlas 14 Volume 2 covers the Ohio River Basin including all of Indiana. Volume 2 Version 3 was published in 2006 and is the version regulators in Indiana currently expect. The Precipitation Frequency Data Server (PFDS) at hdsc.nws.noaa.gov/pfds/ produces:

- A point estimate at any lat/long.
- A table of partial-duration-series (PDS) and annual-maximum-series (AMS) depths, with 90% confidence intervals.
- Cumulative depths for durations from 5 minutes to 60 days.
- Temporal distributions (deciles for the 6-hr, 12-hr, 24-hr, and 96-hr storms) — NOAA Atlas 14 Volume 2 calls these "Type II"-like distributions, but they are statistically derived rather than the synthetic NRCS curves.

Use the PDS table for rational-method intensity and for 24-hr depths driving SCS hydrographs unless the regulator specifies AMS. The two differ noticeably only at short return periods (< 10 yr).

## INDOT IDF data

INDOT Indiana Design Manual Chapter 203 references NOAA Atlas 14 directly. INDOT also publishes IDF curves for individual climate divisions for use on linear projects where a single design storm is desired across a long alignment. For drainage facility design on local roads and site work, the project-specific NOAA Atlas 14 PDS estimate is preferred.

## Local jurisdiction practice

Most Indiana counties and municipalities have aligned with NOAA Atlas 14 for new design. A few notes:

- **Marion County / Indianapolis (DPW, Citizens Energy)** — accepts NOAA Atlas 14 Volume 2 PDS values; the City of Indianapolis Stormwater Design and Specifications Manual (the "Stormwater Manual") references it directly.
- **Hamilton County / Carmel, Fishers, Westfield, Noblesville, Carmel** — same, with each city's stormwater manual specifying the design storms required (typically 10-yr release for 10-yr inflow and 100-yr containment).
- **Older county subdivision ordinances** sometimes still cite Bulletin 71 (Huff and Angel) or TP-40. Do not use those for new design unless the local technical standards explicitly require them; flag the discrepancy in the plan narrative.

## Design storms commonly required in Indiana

Confirm in each jurisdiction's technical standards. The common pattern:

- **Water-quality storm** — first 1.0 in or 1.25 in of rainfall captured and treated (often 24-hr or longer drawdown).
- **Channel-protection storm** — 1-yr 24-hr.
- **Conveyance storms** — 10-yr for storm sewers and culverts on local streets, 25-yr or 50-yr on collectors and arterials, 100-yr on primary arterials and at major crossings.
- **Detention release** — 10-yr release rate matched to predevelopment 10-yr peak; 100-yr containment.
- **Floodplain analysis** — 100-yr (1% AEP) and 500-yr (0.2% AEP) for FEMA work and for critical facility design.

## Practical workflow for an Indiana site

1. Pull the NOAA Atlas 14 PDS point estimate for the project centroid lat/long. Save the HTML/PDF in the project file.
2. Read off the durations and return periods the local stormwater manual requires.
3. For the rational method, fit a log-log line to the published depths and divide by duration to get intensity, or use the published per-hour intensity columns.
4. For SCS methods, take the 24-hr depths directly and pair them with the NRCS Type II distribution (default for Indiana) or the Atlas 14 temporal distribution if the regulator allows it.
5. Document the source, version, and date pulled on the plan set and in the SWPPP narrative.

## Related

- [Rational method and Tc](rational-method-and-tc.md)
- [SCS curve number method](scs-curve-number.md)
- [Detention sizing](detention-sizing.md)
- [IDEM Rule 5](idem-rule-5.md)
- [Indiana state jurisdiction page](../../jurisdictions/indiana/state/index.md)
