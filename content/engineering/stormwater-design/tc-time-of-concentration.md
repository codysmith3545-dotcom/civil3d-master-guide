---
title: "Time of Concentration (TR-55 segmented method)"
section: "engineering/stormwater-design"
order: 20
visibility: public
tags: [time-of-concentration, tc, tr-55, sheet-flow, shallow-concentrated, channel-flow, kinematic-wave]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateCatchment, EditCatchmentProperties]
relatedCalculators: [rational-method, mannings, tc-tr55]
updated: 2026-05-11
sources:
  - title: "USDA NRCS TR-55, Chapter 3 (Time of Concentration and Travel Time)"
    url: https://www.nrcs.usda.gov/sites/default/files/2022-10/TR-55.pdf
    verified: 2026-05-11
  - title: "USDA NRCS National Engineering Handbook, Part 630, Chapter 15 (Time of Concentration)"
    url: https://directives.sc.egov.usda.gov/OpenNonWebContent.aspx?content=27002.wba
    verified: 2026-05-11
  - title: "Indiana Stormwater Quality Manual (Indiana Department of Environmental Management)"
    url: https://www.in.gov/idem/stormwater/2389.htm
    verified: 2026-05-11
  - title: "INDOT Indiana Design Manual, Chapter 203 (Hydrology)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-11
---

> **TL;DR**
> 1. Time of concentration (Tc) is the travel time from the hydraulically most distant point in a watershed to the design point, broken into **sheet flow**, **shallow concentrated flow**, and **channel flow** segments per TR-55 Chapter 3.
> 2. Sheet flow is capped at **100 ft maximum length** in TR-55 (1986) and at the same 100 ft in most current Indiana practice; beyond that, use shallow concentrated.
> 3. A minimum Tc of **5 minutes** for urban and **10 minutes** for rural watersheds is enforced in most Indiana technical standards because Q (rational) and i (IDF) become unrealistic at short durations.

## Why Tc matters

In the rational method (`Q = CiA`) the rainfall intensity `i` is read from an IDF curve at a duration equal to Tc. In the SCS unit hydrograph method Tc sets the time-to-peak (`Tp ≈ 0.6 Tc` for the standard NRCS triangular UH). Either way Tc is the single biggest lever on peak flow — a 30% error in Tc moves peak flow about 15% to 25%.

## TR-55 segmented method

TR-55 breaks Tc into three flow regimes; sum the travel times.

### 1. Sheet flow (Tt1)

Used for the first up-to-100 ft of overland flow on a planar surface. The kinematic wave-derived form in TR-55 Chapter 3 (Equation 3-3) is:

`Tt = (0.007 (n L)^0.8) / ((P2)^0.5 S^0.4)`

where:

- `Tt` = travel time (hr)
- `n` = Manning's overland roughness coefficient (sheet-flow values, **not** open-channel values; see TR-55 Table 3-1)
- `L` = sheet flow length (ft), maximum 100 ft per TR-55 (1986). A 1997 NRCS guidance memo and many state manuals cap at 100 ft; some pre-1986 textbooks used 300 ft and produce too-long Tc.
- `P2` = 2-yr 24-hr rainfall (in)
- `S` = land slope (ft/ft)

TR-55 sheet-flow Manning's n (Table 3-1):

| Surface | n |
|---|---|
| Smooth asphalt | 0.011 |
| Smooth concrete | 0.012 |
| Fallow (no residue) | 0.05 |
| Cultivated, residue cover ≤ 20% | 0.06 |
| Cultivated, residue cover > 20% | 0.17 |
| Short-grass prairie | 0.15 |
| Dense grasses | 0.24 |
| Bermudagrass | 0.41 |
| Light underbrush | 0.40 |
| Dense underbrush | 0.80 |

These are not the same as open-channel Manning's n — using `n = 0.013` for sheet flow over grass underestimates Tc dramatically.

### 2. Shallow concentrated flow (Tt2)

Once flow concentrates in rills and small swales (typically beyond 100 ft) use TR-55 Figure 3-1, which gives velocity as a function of slope:

- Unpaved: `V = 16.1345 S^0.5`  (ft/s)
- Paved: `V = 20.3282 S^0.5`  (ft/s)

`Tt2 = L / (3600 V)` (hr)

### 3. Channel flow (Tt3)

For defined channels and storm sewers compute velocity from Manning's equation at bankfull (or pipe-full) conditions:

`V = (1.486/n) R^(2/3) S^(1/2)`

`Tt3 = L / (3600 V)` (hr)

Sum: `Tc = Tt1 + Tt2 + Tt3`.

## Minimum and maximum Tc

- **Minimum 5 min** for urban watersheds (most Indiana MS4 standards, INDOT IDM Chapter 203).
- **Minimum 10 min** for rural / undeveloped watersheds.
- **Maximum reasonable Tc** for rational method use is typically 60 min; longer Tc usually means the watershed is too big for rational (`A > ~200 ac`) and you should switch to SCS UH.

## Worked example

Site: 4.5-ac office park in Hamilton County, IN. Drainage path:

1. Sheet flow across landscaped lawn, L = 80 ft, S = 0.02, n = 0.24 (dense grass). P2 (Hamilton Co.) = 2.85 in (NOAA Atlas 14).
2. Shallow concentrated flow in grass swale, L = 220 ft, S = 0.015, unpaved.
3. Storm pipe (18-in RCP, n = 0.013, S = 0.005, full-pipe), L = 360 ft.

**Tt1 sheet flow:**

`Tt1 = 0.007 (0.24 × 80)^0.8 / (2.85^0.5 × 0.02^0.4)`
`= 0.007 (19.2)^0.8 / (1.688 × 0.2091)`
`= 0.007 × 10.55 / 0.3530 = 0.209 hr ≈ 12.6 min`

**Tt2 shallow concentrated:**

`V = 16.1345 × 0.015^0.5 = 1.976 ft/s`
`Tt2 = 220 / (3600 × 1.976) = 0.0309 hr ≈ 1.9 min`

**Tt3 channel (pipe):**

For an 18-in RCP at full flow, `R = D/4 = 1.5/4 = 0.375 ft`.
`V = (1.486/0.013) × 0.375^(2/3) × 0.005^0.5`
`= 114.31 × 0.519 × 0.0707 = 4.20 ft/s`
`Tt3 = 360 / (3600 × 4.20) = 0.0238 hr ≈ 1.4 min`

**Tc = 12.6 + 1.9 + 1.4 = 15.9 min** → use 16 min.

Read i from the local 10-yr IDF curve at duration 16 min for the rational method.

## Common review comments

- Sheet flow length exceeds 100 ft. Re-segment, putting the surplus into shallow concentrated flow.
- Manning's n for sheet flow uses open-channel values (e.g., 0.035 for grass). Use TR-55 Table 3-1 sheet-flow values instead.
- Tc less than 5 min reported on an urban watershed. Indiana standards floor at 5 min.
- Pre-development Tc is shorter than post-development Tc. Almost always wrong; pre-dev should have the longer Tc because the path is rougher.

## Related

- [Rational method and Tc (breadth)](../stormwater/rational-method-and-tc.md)
- [SCS curve number](../stormwater/scs-curve-number.md)
- [Indiana IDF curves](../stormwater/indiana-idf-curves.md)
- [Detention basin sizing](detention-basin-sizing.md)
- [Rational method calculator](/tools/rational-method)
- [Manning's calculator](/tools/mannings)
