---
title: "Water-Quality Volume (WQv) and BMP Selection"
section: "engineering/stormwater-design"
order: 40
visibility: public
tags: [water-quality, wqv, bmp, first-flush, indiana-stormwater-quality-manual, bioretention, wet-pond]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreatePondFromObject, CreateCatchment]
relatedCalculators: [water-quality-volume, detention-sizing]
updated: 2026-05-11
sources:
  - title: "Indiana Stormwater Quality Manual (IDEM)"
    url: https://www.in.gov/idem/stormwater/2389.htm
    verified: 2026-05-11
  - title: "Indianapolis Stormwater Design and Specifications Manual"
    url: https://www.indy.gov/activity/storm-water-design-and-construction-specifications
    verified: 2026-05-11
  - title: "NCSU Stormwater BMP Manual (NC DEQ)"
    url: https://www.deq.nc.gov/about/divisions/energy-mineral-land-resources/stormwater/stormwater-program/stormwater-design-manual
    verified: 2026-05-11
  - title: "EPA National Menu of BMPs"
    url: https://www.epa.gov/npdes/national-menu-best-management-practices-bmps-stormwater
    verified: 2026-05-11
---

> **TL;DR**
> 1. Water-quality volume (WQv) is the runoff volume from a small, frequent storm (commonly the **first 1.0 in or 1.25 in over impervious area** in Indiana) that must be captured and treated by a BMP before discharge.
> 2. The common Indiana formula is `WQv = (P · Rv · A) / 12` with `Rv = 0.05 + 0.009 I` (I = % impervious), where WQv is acre-feet, P is in inches, A is acres.
> 3. BMP selection is driven by site constraints (groundwater depth, available footprint, soils, TSS removal goal) — match the BMP to the constraints, not the other way around.

## Why WQv matters

The first half-inch to one-inch of runoff from urban watersheds carries the bulk of the annual pollutant load (the "first flush"). Capturing and treating only that small volume — rather than the full design storm — gives 80%+ of the load reduction at 10% of the storage cost. The water-quality volume sits at the bottom of a multi-stage outlet structure and drains slowly through a low orifice, while flood-control storage sits above it and releases faster.

## WQv calculation

The form used by the Indiana Stormwater Quality Manual and most Indiana MS4 programs:

`WQv (ac-ft) = (P × Rv × A) / 12`

where:

- `P` = water-quality design rainfall depth (in). Indiana default is **1.0 in** statewide minimum; **1.25 in** is used by some communities (Carmel, Westfield, Fishers). Confirm in local standards.
- `Rv` = volumetric runoff coefficient = `0.05 + 0.009 × I` (I = percent impervious, e.g., 60 for 60%).
- `A` = drainage area (ac).
- Divide by 12 to convert inch-acres to acre-feet.

The `0.05 + 0.009 I` form comes from the Schueler (1987) regression used in MS-4 manuals nationally and is the form adopted in the Indiana Stormwater Quality Manual.

## Drawdown

WQv must drain over **24 to 72 hours** through the WQv orifice. The orifice equation:

`Q = Cd A (2 g h)^0.5`

with `Cd = 0.6` for sharp-edged. To hit a 40-hr drawdown on `WQv = 6,500 cf` from a basin where the WQv pool averages 3 ft deep: average Q ≈ 6,500 / (40 × 3600) = 0.045 cfs. At `h_avg = 1.5 ft`, `A = 0.045 / (0.6 × (64.4 × 1.5)^0.5) = 0.045 / 5.90 = 0.0076 ft² ≈ 1.18 in² → ~1.25 in orifice.

Indiana practice: orifices below 1 in diameter are prone to clogging; if calculation calls for less, add an internal weir or use a perforated standpipe.

## BMP selection matrix

Match BMP to site. Numbers below come from the Indiana Stormwater Quality Manual and the NC DEQ BMP Manual (which Indiana cites by reference for several practices).

| BMP | TSS removal | TP removal | Min footprint | Soil constraints | Min separation to SHWT |
|---|---|---|---|---|---|
| Wet pond | 80% | 50% | Moderate | Any (lined if needed) | Groundwater can be at NWL |
| Wet extended-detention pond | 80% | 50% | Moderate | Any | At NWL |
| Bioretention (rain garden) | 85% | 60% | Small (5%-10% of CDA) | Loamy / sandy preferred | ≥ 2 ft below media bottom |
| Sand filter | 85% | 45% | Small | Any | ≥ 2 ft below underdrain |
| Constructed wetland | 85% | 55% | Large | Any | At NWL |
| Grass swale (dry) | 50% | 25% | Linear | Any | ≥ 1 ft below invert |
| Permeable pavement | 80% | 50% | None added | High infiltration | ≥ 2 ft below stone reservoir |
| Underground detention with treatment | Varies (35%-80%) | Varies | None at grade | Any | Per manufacturer |
| Manufactured treatment device | 50%-80% | Varies | Very small | Any | Per manufacturer |

CDA = contributing drainage area. SHWT = seasonal high water table. NWL = normal water level (wet ponds maintain a permanent pool, so SHWT at NWL is acceptable).

## Selection guidance

1. **Identify the regulatory target.** Indiana Stormwater Quality Manual TSS reduction target is **80%** for new development sites; check the local MS4 manual for additional targets (e.g., volume reduction, runoff reduction credits).
2. **Check site constraints in order:** groundwater depth, soil infiltration rate (Type A/B/C/D), available area, topography, contributing impervious cover.
3. **Prefer practices that reduce runoff volume** (bioretention, permeable pavement, infiltration) — they count for both quality and quantity credits in most MS4 programs.
4. **Treatment train.** Where a single BMP cannot hit the target, sequence two (e.g., grass swale -> bioretention).

## Worked example

Site: 5.0-ac commercial, 72% impervious, Carmel, IN (P = 1.25 in).

`Rv = 0.05 + 0.009 × 72 = 0.05 + 0.648 = 0.698`
`WQv = (1.25 × 0.698 × 5.0) / 12 = 0.363 ac-ft = 15,820 cf`

Carmel allows bioretention to satisfy WQv. Bioretention footprint typically sized at 5% to 7% of the contributing impervious area. Impervious = 3.6 ac = 156,820 sf; bioretention footprint at 6% = 9,410 sf. With a 12-in surface ponding depth and an 18-in media depth at 25% effective porosity, surface storage = 9,410 cf, media storage = 0.25 × 9,410 × 1.5 = 3,530 cf, total = 12,940 cf. Short by 2,880 cf — increase ponding to 18 in or add a second cell.

(Verify Carmel's specific media spec and credits against the current Carmel Stormwater Technical Standards Manual.)

## Common review comments

- WQv calculated with `Rv = C` (rational coefficient) — wrong; use `Rv = 0.05 + 0.009 I`.
- Drawdown calculated using initial head only — should use average over the drawdown.
- Bioretention sized at 1% of impervious — typically too small; check local minimum percentage.
- Underdrain set below SHWT — fails, will saturate the media.
- Forebay omitted — required by Indiana Stormwater Quality Manual for wet ponds and most extended-detention BMPs.

## Related

- [Water-quality BMPs (breadth)](../stormwater/water-quality-bmps.md)
- [Detention basin sizing](detention-basin-sizing.md)
- [Bypass and overflow design](bypass-and-overflow-design.md)
- [Post-construction BMPs](../erosion-and-sediment-control/post-construction-bmps.md)
- [Water-quality volume calculator](/tools/water-quality-volume)
