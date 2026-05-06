---
title: "Energy and Momentum Equations"
section: "engineering/hydraulics"
order: 45
visibility: public
tags: [bernoulli, energy-equation, momentum, specific-energy, hydraulics, pipe-design]
updated: 2026-05-06
sources:
  - title: "FHWA HDS-4, Introduction to Highway Hydraulics"
    url: https://www.fhwa.dot.gov/engineering/hydraulics/pubs/08090/08090.pdf
    verified: 2026-05-06
  - title: "Chow, V.T., Open-Channel Hydraulics, 1959, Chapters 2-3"
    url: https://archive.org/details/openchannelhydra0000chow
    verified: 2026-05-06
---

> **TL;DR**
> 1. **Bernoulli's energy equation**: total head = elevation head (z) + pressure head (p/gamma) + velocity head (V²/2g). Energy is conserved minus friction and minor losses.
> 2. The **momentum equation** is used where energy losses are unknown or abrupt — hydraulic jumps, forces on structures, and confluences.
> 3. **Specific energy** (E = y + V²/2g) is the key to understanding flow transitions, critical depth, and choking in channels and pipes.

## Bernoulli's energy equation

For flow between two points (1 upstream, 2 downstream) in a pipe or channel:

`z_1 + p_1/gamma + V_1²/(2g) = z_2 + p_2/gamma + V_2²/(2g) + h_L`

where:

| Term | Description | Units (US) |
|---|---|---|
| z | Elevation above datum | ft |
| p/gamma | Pressure head | ft |
| V²/(2g) | Velocity head | ft |
| h_L | Total head loss (friction + minor losses) | ft |
| gamma | Specific weight of water (62.4 lb/ft³) | lb/ft³ |
| g | Gravitational acceleration (32.2 ft/s²) | ft/s² |

For open-channel flow, the pressure head at the surface is zero (atmospheric), so the piezometric surface is the water surface itself. The energy equation becomes:

`z_1 + y_1 + V_1²/(2g) = z_2 + y_2 + V_2²/(2g) + h_L`

This is the basis for the standard step method in HEC-RAS and for HGL/EGL calculations in storm sewer design.

## Head loss components

### Friction loss

Distributed along the pipe or channel length. Computed by Manning's equation (gravity flow), Hazen-Williams (pressure pipe), or Darcy-Weisbach (any pipe flow).

### Minor losses

Localized at fittings, bends, transitions, manholes, entrances, and exits:

`h_m = K × V²/(2g)`

Common K values:

| Fitting | K |
|---|---|
| Pipe entrance (square edge) | 0.5 |
| Pipe entrance (bell-mouth) | 0.04 |
| Pipe exit (into chamber) | 1.0 |
| 90-degree bend | 0.3-0.5 |
| 45-degree bend | 0.2-0.3 |
| Tee (branch) | 0.5-1.0 |
| Sudden expansion | (1 - A_1/A_2)² |
| Sudden contraction | 0.5 (1 - A_2/A_1) |
| Gate valve (full open) | 0.2 |

In storm sewer design, junction losses at manholes are typically the dominant minor losses. See [HGL calculation](hgl.md).

## Momentum equation

The momentum equation applies Newton's second law to a fluid control volume:

`Sum F = rho Q (V_2 - V_1)`

where F includes pressure forces, gravity (weight component along the flow), and friction. The momentum equation is preferred over the energy equation when:

- **Energy losses are unknown** — as in a hydraulic jump, where energy dissipation is the quantity to be found.
- **Forces on structures** — computing thrust on pipe bends, forces on bridge piers, and loads on headwalls.
- **Abrupt transitions** — channel expansions, confluences, and flow splits where the energy equation is difficult to apply.

### Hydraulic jump (momentum application)

For a hydraulic jump in a rectangular channel, momentum balance gives the sequent depth relationship:

`y_2/y_1 = 0.5 (-1 + sqrt(1 + 8 Fr_1²))`

Energy loss through the jump is then found from the energy equation:

`Delta E = (y_2 - y_1)³ / (4 y_1 y_2)`

### Thrust blocks and pipe forces

At a pipe bend, the force on the bend is:

`F = rho Q (V_out - V_in) + p_1 A_1 - p_2 A_2`

resolved into x and y components. This determines the thrust block size needed at the bend to prevent pipe joint separation in pressure systems.

## Specific energy

Specific energy is the energy relative to the channel bottom:

`E = y + Q² / (2g A²)`

The specific-energy diagram plots E vs y. At a given E (above the minimum), two depths exist — one subcritical (upper) and one supercritical (lower). At E_min, y = y_c (critical depth).

Practical uses:

- **Constrictions** — narrowing a channel requires E to increase or the flow passes through critical depth. If available E is insufficient, the flow chokes and backs up.
- **Steps** — raising or lowering the channel bed changes E. A step up reduces E and can force the flow through critical depth.
- **Bridge openings** — the constriction at a bridge may push flow to or through critical depth, causing a hydraulic jump downstream.

## Practical applications in Civil 3D projects

- **Storm sewer HGL** — the energy equation (Manning's + minor losses) drives the HGL calculation.
- **Culvert design** — outlet control uses the energy equation; inlet control uses empirical relationships derived from momentum/energy analysis.
- **Channel transitions** — specific energy analysis guides the design of channel width transitions and drop structures.

## Related

- [Manning's equation reference](mannings-reference.md)
- [Critical depth](critical-depth.md)
- [HGL calculation](hgl.md)
- [Culvert control](culvert-control.md)
- [Hazen-Williams equation](hazen-williams.md)
