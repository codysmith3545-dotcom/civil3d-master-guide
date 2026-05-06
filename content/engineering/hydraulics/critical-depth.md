---
title: "Critical Depth and Flow Regime"
section: "engineering/hydraulics"
order: 35
visibility: public
tags: [critical-depth, froude-number, subcritical, supercritical, hydraulic-jump, specific-energy]
updated: 2026-05-06
sources:
  - title: "FHWA HDS-4, Introduction to Highway Hydraulics"
    url: https://www.fhwa.dot.gov/engineering/hydraulics/pubs/08090/08090.pdf
    verified: 2026-05-06
  - title: "Chow, V.T., Open-Channel Hydraulics, 1959, Chapters 3 and 4"
    url: https://archive.org/details/openchannelhydra0000chow
    verified: 2026-05-06
---

> **TL;DR**
> 1. Critical depth is the depth at which specific energy is minimum for a given flow. It occurs when the **Froude number Fr = 1**. For a rectangular channel: y_c = (q²/g)^(1/3), where q = Q/B (unit discharge).
> 2. **Subcritical flow (Fr < 1)** is deep and slow — controlled from downstream. **Supercritical flow (Fr > 1)** is shallow and fast — controlled from upstream.
> 3. A **hydraulic jump** occurs when supercritical flow transitions to subcritical flow, dissipating energy. This matters at culvert outlets, dam spillways, and channel transitions.

## Froude number

The Froude number is the ratio of inertia to gravity forces:

`Fr = V / sqrt(g × D_h)`

where V = mean velocity (ft/s), g = 32.2 ft/s², and D_h = hydraulic depth = A/T (flow area divided by top width). For a rectangular channel, D_h = y (flow depth).

| Fr | Flow regime | Characteristics |
|---|---|---|
| < 1.0 | Subcritical | Deep, slow, tranquil; disturbances propagate upstream; controlled by downstream conditions |
| = 1.0 | Critical | Minimum specific energy; unstable in practice |
| > 1.0 | Supercritical | Shallow, fast, rapid; disturbances cannot travel upstream; controlled by upstream conditions |

## Critical depth formulas

### Rectangular channel

`y_c = (q² / g)^(1/3)`

where q = Q/B = unit discharge (cfs per ft of width) and g = 32.2 ft/s².

### Circular pipe

There is no closed-form solution for critical depth in a circular pipe. Iterative methods or published charts are used. A common approximation:

`d_c / D ≈ 0.467 (Q / (D^2.5 × sqrt(g)))^0.268`

for d_c/D between 0.02 and 0.85. For precise work, solve iteratively from:

`Q² / g = A³ / T`

where A = flow area and T = top width, both functions of depth in a circular section.

### Trapezoidal channel

Solve iteratively: `Q² / g = A³ / T`, where A = (b + z y) y and T = b + 2 z y for bottom width b and side slope z:1 (H:V).

## Specific energy

Specific energy E at a given cross section:

`E = y + V² / (2g) = y + Q² / (2g A²)`

At critical depth, E is minimum. The specific-energy diagram (E vs y) shows two depths for every E above the minimum: one subcritical and one supercritical. This principle governs flow transitions at channel constrictions, grade breaks, and structures.

## Hydraulic jump

When supercritical flow meets an obstruction or a subcritical downstream condition, a hydraulic jump forms. Energy is dissipated in the turbulent jump. For a rectangular channel, the sequent (downstream) depth y_2 is related to the upstream depth y_1 by:

`y_2 = (y_1 / 2) × (-1 + sqrt(1 + 8 Fr_1²))`

The energy loss in the jump:

`ΔE = (y_2 - y_1)³ / (4 y_1 y_2)`

Hydraulic jumps are relevant at:

- Culvert outlets discharging at supercritical velocity into a mild channel.
- Stilling basins downstream of spillways and energy dissipators.
- Storm sewer outfalls with steep pipes transitioning to flat channels.

## Why critical depth matters for design

1. **Culvert inlet control** — if the barrel slope produces supercritical flow, the culvert is inlet-controlled and the headwater is governed by the inlet geometry alone.
2. **Channel transitions** — narrowing a subcritical channel can push the flow through critical depth, causing a choked condition if the contraction is too severe.
3. **Pipe inlet design** — at a storm sewer inlet, if flow drops into the pipe from above, the flow passes through critical depth at the inlet. This sets the boundary condition.
4. **Froude number at outfalls** — agencies may require energy dissipation when the Froude number at the outfall exceeds 1.5 to 2.5.

## Critical slope

The slope at which uniform flow depth equals critical depth is the critical slope (S_c). For a given pipe or channel:

- Slopes steeper than S_c produce supercritical uniform flow.
- Slopes milder than S_c produce subcritical uniform flow.

This classification (steep, mild, critical, horizontal, adverse) is the basis of gradually varied flow analysis and backwater/draw-down curve computations.

## Related

- [Manning's equation reference](mannings-reference.md)
- [Energy and momentum](energy-and-momentum.md)
- [Culvert control](culvert-control.md)
- [HEC-RAS basics](hec-ras-basics.md)
