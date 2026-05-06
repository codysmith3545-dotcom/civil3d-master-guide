---
title: "Shrink and Swell Factors"
section: "engineering/earthwork"
order: 20
visibility: public
tags: [earthwork, shrink, swell, compaction, bcy, ccy, lcy, soil]
updated: 2026-05-06
---

> **TL;DR**
> 1. Earthwork quantities exist in three states: **bank cubic yards (BCY)** (in-place), **loose cubic yards (LCY)** (after excavation, on a truck), and **compacted cubic yards (CCY)** (after placement and compaction). Converting between them requires shrink and swell factors.
> 2. Typical shrink factors (BCY to CCY): **10% to 25%** for cohesive soils (clay, silt), **5% to 15%** for granular soils (sand, gravel). Typical swell factors (BCY to LCY): **20% to 40%** for cohesive, **10% to 20%** for granular.
> 3. Use the geotechnical report's recommended factors for the specific project soils. When no geotech data is available, use conservative estimates and disclose the assumption.

## Definitions

### Bank cubic yards (BCY)

The volume of material as it exists in the ground, undisturbed. This is the volume measured by comparing the existing surface to the excavated surface (or the existing surface to the proposed surface for cut quantities). Cross-section and TIN volume calculations in Civil 3D report BCY (sometimes called "in-place" or "neat-line" volume).

### Loose cubic yards (LCY)

The volume of material after it has been excavated, broken up, and loaded onto a truck or placed in a stockpile. Soil expands when excavated because the particle structure is disrupted and air voids increase. LCY > BCY.

The swell factor converts BCY to LCY:

```
LCY = BCY x (1 + swell_fraction)
```

Example: 1,000 BCY of clay with 30% swell = 1,300 LCY.

LCY is used for:
- Estimating truck trips (truck capacity is in LCY).
- Stockpile volume measurement (a stockpile surveyed by volume is in LCY).

### Compacted cubic yards (CCY)

The volume of material after it has been placed and compacted to the specified density. Compaction reduces the volume below the bank state because voids are driven out and the material is denser than in its natural condition. CCY < BCY.

The shrink factor converts BCY to CCY:

```
CCY = BCY x (1 - shrink_fraction)
```

Example: 1,000 BCY of clay with 20% shrink = 800 CCY.

CCY is used for:
- Fill quantity estimates (how much fill volume can be produced from a given cut volume).
- Earthwork balance calculations (does the cut produce enough material to fill the fill areas after compaction?).

## Typical factors by soil type

These are approximate and vary with specific soil properties, moisture content, and compaction effort. Always use project-specific geotechnical data when available.

| Soil type | Swell (BCY to LCY) | Shrink (BCY to CCY) |
|---|---|---|
| Clay (cohesive, high plasticity) | 30% to 40% | 15% to 25% |
| Silt (cohesive, low plasticity) | 20% to 30% | 10% to 20% |
| Sand (granular) | 10% to 15% | 5% to 10% |
| Gravel (granular) | 10% to 15% | 5% to 10% |
| Sand-gravel mix | 12% to 18% | 5% to 12% |
| Topsoil (organic) | 25% to 35% | 10% to 20% |
| Rock (blasted/broken) | 40% to 70% | 0% to +10% (rock fill may bulk up) |

## Converting between states

To go from one state to another:

| From | To | Formula |
|---|---|---|
| BCY | LCY | LCY = BCY x (1 + swell) |
| BCY | CCY | CCY = BCY x (1 - shrink) |
| LCY | BCY | BCY = LCY / (1 + swell) |
| CCY | BCY | BCY = CCY / (1 - shrink) |
| LCY | CCY | CCY = LCY x (1 - shrink) / (1 + swell) |
| CCY | LCY | LCY = CCY x (1 + swell) / (1 - shrink) |

## Earthwork balance example

A project has 10,000 BCY of cut and 8,500 CCY of fill required. Is the earthwork balanced?

With 15% shrink: 10,000 BCY of cut produces 10,000 x (1 - 0.15) = 8,500 CCY.

The project is balanced — no borrow or waste required. If the shrink factor were 20%, the cut would produce only 8,000 CCY, and 500 CCY of borrow would be needed.

## Application in Civil 3D

Civil 3D Compute Materials and the Volumes Dashboard report volumes in BCY (neat-line, in-place). To convert to CCY or LCY:

- Apply the factor manually in a spreadsheet or report.
- Civil 3D's mass haul tools allow specification of a "shrinkage factor" when defining materials. This adjusts the mass haul diagram to reflect compacted volumes, enabling accurate borrow/waste analysis.

## Related

- [Cut/fill quick checks](cut-fill-quick-checks.md)
- [Mass haul](mass-haul.md)
- [Topsoil stripping](topsoil-stripping.md)
- [Volume methods](volume-methods.md)
