---
title: "SCS / NRCS Curve Number Method"
section: "engineering/stormwater"
order: 30
visibility: public
tags: [scs, nrcs, curve-number, tr-55, hydrology, runoff]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateCatchment]
relatedCalculators: [scs-runoff, tr-55]
updated: 2026-05-06
sources:
  - title: "USDA NRCS TR-55, Urban Hydrology for Small Watersheds, 2nd ed. (1986, reprinted 2009)"
    url: https://www.nrcs.usda.gov/sites/default/files/2022-10/TR-55.pdf
    verified: 2026-05-06
  - title: "NRCS National Engineering Handbook, Part 630, Hydrology, Chapters 7–10"
    url: https://directives.nrcs.usda.gov/sites/default/files2/1712930499/NEH%20Part%20630%2C%20Hydrology.pdf
    verified: 2026-05-06
---

> **TL;DR**
> 1. Curve Number (CN) lumps land cover, soil group, and antecedent moisture into a single index from roughly 30 (deep sand under woods) to 98 (impervious). Higher CN means more runoff.
> 2. The runoff equation is `Q = (P - 0.2 S)^2 / (P + 0.8 S)` for `P > 0.2 S`, where `S = 1000/CN - 10` (inches). This is the `Ia = 0.2 S` initial-abstraction assumption.
> 3. Use TR-55 / TR-20 / HEC-HMS once the area, heterogeneity, or storage effects exceed what the rational method can handle. CN methods produce a hydrograph; the rational method does not.
> 4. CN-based runoff under-predicts for small storms and frozen ground; check with continuous simulation or volumetric methods if water-quality storms (the "first flush") drive the design.

## Where the method comes from

The SCS (now NRCS) curve number method was published by the Soil Conservation Service in the 1950s as a way to estimate event runoff from agricultural watersheds. TR-55 (1986) packaged it for urban hydrology, and TR-20 / NRCS National Engineering Handbook (NEH) Part 630 retain the underlying equations. The method assumes that the ratio of actual retention to potential retention equals the ratio of actual runoff to potential runoff. The closed-form result is:

`Q = (P - Ia)^2 / (P - Ia + S)` for `P > Ia`, else `Q = 0`

with the standard assumption `Ia = 0.2 S`. P is event rainfall (inches), Q is event runoff (inches), and S is the maximum potential retention. CN is just a re-scaling of S so that values fall in a usable range.

## Selecting a curve number

CN depends on three inputs:

- **Hydrologic Soil Group (HSG)** — A (sand, low runoff), B (loam), C (clay loam), D (clay, high runoff). NRCS Web Soil Survey gives HSG for any U.S. parcel. Indiana sites are typically B or C; D is common in the central till plain.
- **Cover type and treatment** — fallow, row crop, pasture, woods, residential, commercial, industrial, paved, roof.
- **Hydrologic condition** — poor, fair, good (a function of cover density and surface storage).

Typical CN values from TR-55 Table 2-2 (cite the source — this is a guide, not a republication):

- Open space, fair condition: HSG B about 69, HSG C about 79, HSG D about 84
- Open space, good condition (turf cover ≥ 75%): HSG B about 61, HSG C about 74, HSG D about 80
- Residential, 1/4 acre lots (38% impervious): HSG B about 75, HSG C about 83, HSG D about 87
- Residential, 1 acre lots (20% impervious): HSG B about 68, HSG C about 79, HSG D about 84
- Commercial / business (85% impervious): HSG B about 92, HSG C about 94, HSG D about 95
- Industrial (72% impervious): HSG B about 88, HSG C about 91, HSG D about 93
- Paved parking, roofs, driveways: 98 across all soil groups
- Row crops, contoured, good condition: HSG B about 75, HSG C about 82, HSG D about 85
- Woods, good cover: HSG B about 55, HSG C about 70, HSG D about 77

For composite watersheds compute an area-weighted CN. NRCS guidance (NEH 630 Chapter 9) is to weight CN, not S, even though weighting S is technically more correct — the difference is usually negligible.

## Antecedent moisture

The published CN values are AMC II (average moisture). For wet conditions (AMC III) CN can be 10 to 20 points higher; for dry conditions (AMC I) it can be 10 to 25 points lower. For most regulated design events the AMC II baseline is used and the design storm itself accounts for the conservatism. Some MS4 communities require AMC II for water-quality storms and AMC II or III for flood storms — check the local technical standards.

## The Ia = 0.2 S assumption

The 0.2 ratio is an empirical fit from the original agricultural data set. Recent work (notably Hawkins et al., 2002) found 0.05 fits modern data better, and NRCS NEH 630 Chapter 10 acknowledges the discrepancy but retains 0.2 for compatibility with published CN values and existing models. If you change the ratio you must also re-derive the CN — most commercial models (HydroCAD, HEC-HMS, Civil 3D Storm and Sanitary Analysis) leave 0.2 as the default and that is what regulators expect to see.

## Lag and unit hydrograph

TR-55 builds a peak discharge from CN, the 24-hr rainfall, and a lag time:

`Tlag = 0.6 Tc`

The dimensionless unit hydrograph in NEH 630 Chapter 16 has a peak rate factor of 484 (default for most of the U.S.). For very flat coastal-plain watersheds NRCS allows 300; for steep mountainous watersheds 600. Indiana's central till plain uses 484.

## When CN under-predicts

CN methods are calibrated to design-storm-scale events (one to several inches of rainfall over 24 hours). Known limitations:

- **Small storms (P < 0.5 in)** — Ia consumes most or all of the rainfall and Q goes to zero. Real watersheds produce some runoff from impervious areas at the first drop. For water-quality volume calculations use a separate method (1.0-in or 1.25-in capture, or the Simple Method).
- **Frozen ground or snowmelt** — CN does not represent these. Use a snowmelt model.
- **Long-duration, low-intensity storms** — initial abstraction is consumed quickly and the method's lump assumption breaks down.
- **Karst, sinkhole, or losing watersheds** — CN cannot represent infiltration to underground systems. Indiana's southern karst belt (south of Bloomington) is an example.

## Related

- [Rational method and Tc](rational-method-and-tc.md)
- [Detention sizing](detention-sizing.md)
- [Indiana IDF curves](indiana-idf-curves.md)
- [SCS runoff calculator](/tools/scs-runoff)
