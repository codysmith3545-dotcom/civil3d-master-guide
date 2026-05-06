---
title: "Manning's Equation Reference"
section: "engineering/hydraulics"
order: 10
visibility: public
tags: [mannings-equation, open-channel, pipe-flow, hydraulics, friction]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [EditPipeNetwork, CreatePipeNetwork, AnalyzePipeNetwork]
updated: 2026-05-06
sources:
  - title: "FHWA HDS-4, Introduction to Highway Hydraulics"
    url: https://www.fhwa.dot.gov/engineering/hydraulics/pubs/08090/08090.pdf
    verified: 2026-05-06
  - title: "FHWA HEC-22, Urban Drainage Design Manual, 3rd ed."
    url: https://www.fhwa.dot.gov/engineering/hydraulics/pubs/10009/10009.pdf
    verified: 2026-05-06
---

> **TL;DR**
> 1. Manning's equation (US customary): **Q = (1.486/n) A R^(2/3) S^(1/2)**, where Q = flow (cfs), n = roughness, A = flow area (sq ft), R = hydraulic radius (ft), S = friction slope (ft/ft).
> 2. Use Manning's for gravity-flow systems: storm sewers, sanitary sewers, open channels, culverts. For pressure pipe systems, use Hazen-Williams or Darcy-Weisbach instead.
> 3. The hydraulic radius R = A/P (area divided by wetted perimeter). For a full circular pipe, R = D/4.

## The equation

US customary units:

`Q = (1.486 / n) × A × R^(2/3) × S^(1/2)`

SI units:

`Q = (1.0 / n) × A × R^(2/3) × S^(1/2)`

The constant 1.486 is the unit conversion factor for US customary units (ft, s). It is often written as 1.49 in practice.

### Variables

| Symbol | Description | Units (US) |
|---|---|---|
| Q | Discharge (flow rate) | cfs |
| n | Manning's roughness coefficient | dimensionless |
| A | Cross-sectional area of flow | sq ft |
| R | Hydraulic radius = A / P | ft |
| P | Wetted perimeter | ft |
| S | Friction slope (energy grade line slope) | ft/ft |

For uniform flow in a prismatic channel, the friction slope equals the channel bed slope. For non-uniform flow (e.g., backwater calculations), S is the energy slope, not the bed slope.

## Full-pipe circular geometry shortcuts

For a circular pipe of diameter D (ft) flowing full:

- A = pi D² / 4
- P = pi D
- R = D / 4
- Q_full = (1.486 / n) × (pi D² / 4) × (D / 4)^(2/3) × S^(1/2)

Simplifying: `Q_full = (0.4632 / n) × D^(8/3) × S^(1/2)`

And velocity: `V_full = (0.5900 / n) × D^(2/3) × S^(1/2)`

These shortcuts are useful for rapid pipe sizing.

## Partial-flow in circular pipes

Storm and sanitary sewers rarely flow full under design conditions. The ratio of partial-flow depth (d) to diameter (D) determines the hydraulic properties. Key relationships (d/D ratios):

| d/D | Q/Q_full | V/V_full | A/A_full |
|---|---|---|---|
| 0.10 | 0.02 | 0.40 | 0.05 |
| 0.25 | 0.09 | 0.60 | 0.15 |
| 0.50 | 0.50 | 1.00 | 0.50 |
| 0.75 | 0.86 | 1.14 | 0.76 |
| 0.82 | 0.93 | 1.14 | 0.82 |
| 1.00 | 1.00 | 1.00 | 1.00 |

Note that velocity peaks at approximately d/D = 0.82, not at full flow. This is because the wetted perimeter increases faster than the area near the crown of the pipe.

## Velocity constraints

Most agencies set minimum and maximum velocity limits:

- **Minimum velocity**: 2.0 to 2.5 ft/s (prevents sediment deposition; 2.0 ft/s is the INDOT and most common standard for storm sewers).
- **Maximum velocity**: 10 to 15 ft/s for concrete pipe, 5 to 8 ft/s for corrugated metal pipe, 15 to 20 ft/s for reinforced concrete (check the pipe manufacturer's recommendation and the outlet erosion potential).

## When to use Manning's vs other equations

| Equation | Best for | Not suitable for |
|---|---|---|
| Manning's | Gravity-flow pipes, open channels, culverts | Pressure pipe systems |
| Hazen-Williams | Pressure water mains | Open-channel flow, very rough pipes |
| Darcy-Weisbach | Any pipe flow (most theoretically rigorous) | Quick hand calculations (iterative) |

Manning's is the standard for storm and sanitary sewer design in Civil 3D. The pipe network commands use Manning's equation for gravity analysis.

## Civil 3D integration

Civil 3D's storm and sanitary pipe network tools use Manning's equation to compute flow, velocity, and depth in gravity pipes. Set the Manning's n value in the pipe catalog for each pipe material. The `AnalyzePipeNetwork` and Storm and Sanitary Analysis extension perform the calculation for each pipe segment.

## Related

- [Manning's n value table](mannings-n-table.md)
- [Hazen-Williams equation](hazen-williams.md)
- [HGL calculation](hgl.md)
- [Critical depth](critical-depth.md)
