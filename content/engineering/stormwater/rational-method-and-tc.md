---
title: "Rational Method and Time of Concentration"
section: "engineering/stormwater"
order: 20
visibility: public
tags: [rational-method, time-of-concentration, hydrology, runoff-coefficient, kirpich, kerby]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateCatchment, EditCatchmentProperties]
relatedCalculators: [rational-method, time-of-concentration]
updated: 2026-05-06
sources:
  - title: "FHWA HEC-22, Urban Drainage Design Manual, 3rd ed."
    url: https://www.fhwa.dot.gov/engineering/hydraulics/pubs/10009/10009.pdf
    verified: 2026-05-06
  - title: "USDA NRCS TR-55, Urban Hydrology for Small Watersheds"
    url: https://www.nrcs.usda.gov/sites/default/files/2022-10/TR-55.pdf
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 203 (Hydrology)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Rational Method: `Q = C i A`, where Q is peak discharge in cfs, i is rainfall intensity in in/hr at duration equal to the time of concentration, A is drainage area in acres, and C is a unitless runoff coefficient.
> 2. Use it for small, fairly homogeneous drainage areas — most agencies cap at about 200 acres; many cap lower (50 to 100 ac).
> 3. Time of concentration (Tc) is the travel time from the hydraulically most-distant point to the design point. Build it from sheet flow + shallow concentrated flow + open-channel/pipe flow segments.
> 4. Leave the rational method when you need a hydrograph, when storage routes affect peaks, or when the area is too large or too heterogeneous — switch to SCS/NRCS (TR-20, TR-55, HEC-HMS).

## The equation

`Q = C i A`

In customary U.S. units the conversion factor is 1.0083 (cfs per ac-in/hr), almost always rounded to 1.0, which is why the equation works as written. The method assumes (1) rainfall is uniform over the basin, (2) the design storm duration equals Tc, and (3) the runoff coefficient is constant.

## Runoff coefficient C

C is the fraction of rainfall that becomes runoff. Typical values from the FHWA HEC-22 ranges (cite the source — do not republish the table verbatim):

- Open space, lawns, sandy soil, flat: about 0.05 to 0.15
- Open space, lawns, clay soil, steep: about 0.20 to 0.35
- Single-family residential (1/4 to 1 acre lots): about 0.30 to 0.50
- Multi-family, attached: about 0.60 to 0.75
- Downtown commercial: about 0.70 to 0.95
- Industrial: about 0.50 to 0.90
- Asphalt and concrete pavement: about 0.70 to 0.95
- Roofs: about 0.75 to 0.95
- Gravel: about 0.30 to 0.50

For a mixed catchment compute a weighted composite C by area. Many Indiana jurisdictions require C to be increased for the 50-yr and 100-yr events (a "frequency factor," typically 1.10 to 1.25, capped at 1.0). Confirm in the local stormwater technical standards.

## Rainfall intensity i

Pull i from the IDF curve at duration = Tc and the design return period. See [Indiana IDF curves](indiana-idf-curves.md) for sources (NOAA Atlas 14 is current; legacy INDOT IDF data is still cited in some county manuals).

## Time of concentration

Tc is built from up to three segments — sheet flow at the headwater, then shallow concentrated flow, then channel or pipe flow:

### Sheet flow (first 100 ft, or 50 ft per TR-55 update)

Use the kinematic wave approximation from TR-55 Chapter 3:

`Tt = (0.007 (n L)^0.8) / (P2^0.5 s^0.4)` (hours)

where n is the Manning sheet-flow roughness, L is length in ft, P2 is the 2-yr 24-hr rainfall in inches, and s is the slope (ft/ft). Sheet-flow n values are not the same as channel n: for short-grass pasture use 0.15, dense grass 0.24, woods with light underbrush 0.40 (cite TR-55 Table 3-1).

### Shallow concentrated flow

After sheet flow, runoff concentrates into shallow rills. Velocity is approximated from TR-55 Figure 3-1 (paved vs unpaved) or by `V = 16.1345 s^0.5` (unpaved) and `V = 20.3282 s^0.5` (paved), in ft/s. Tt = L / V / 3600 (hours).

### Channel and pipe flow

Compute velocity from Manning's equation at full flow or design flow and divide length by velocity. See [Manning's reference](../hydraulics/mannings-reference.md).

## Empirical Tc formulas

For preliminary work or small watersheds many agencies allow lumped empirical equations:

- **Kirpich (1940)** — small agricultural basins, 1 to 200 ac, well-defined channels:
  `Tc = 0.0078 L^0.77 S^-0.385` (minutes), L in ft, S in ft/ft. Often divided by 2 for paved channels and multiplied by 2 for overland-flow grass.
- **Kerby (1959)** — overland flow on small basins (< 10 ac):
  `Tc = 0.83 (L n / S^0.5)^0.467` (minutes), L in ft (≤ 1200), n the Kerby retardance coefficient.
- **FAA (airfield drainage)** — `Tc = 1.8 (1.1 - C) L^0.5 / S^(1/3)` (minutes), generally only for paved surfaces.

Keep the empirical Tc bounded: a Kirpich result under 5 minutes is rarely defensible — most agencies enforce a 5-minute floor (some 10-minute) for inlet design.

## When to leave the rational method

Switch to SCS/NRCS or full hydrograph methods when any of these is true:

- Drainage area exceeds the agency cap (commonly 100 to 200 ac).
- The watershed has significant storage that attenuates the peak — ponds, wetlands, large detention basins upstream.
- You need to combine multiple sub-basins with different Tc values at a confluence (the rational method's superposition is unreliable when Tc differs widely).
- You are sizing detention. Use the [Modified Rational](detention-sizing.md) only for small sites with simple geometry; otherwise route an SCS hydrograph.
- The agency requires a published 24-hr design storm hyetograph (NRCS Type II covers Indiana). The rational method has no hyetograph.

## Related

- [SCS curve number method](scs-curve-number.md)
- [Indiana IDF curves](indiana-idf-curves.md)
- [Detention sizing](detention-sizing.md)
- [Manning's reference](../hydraulics/mannings-reference.md)
- [Rational method calculator](/tools/rational-method)
- [Time of concentration calculator](/tools/time-of-concentration)
