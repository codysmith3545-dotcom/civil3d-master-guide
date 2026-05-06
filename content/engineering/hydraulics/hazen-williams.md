---
title: "Hazen-Williams Equation"
section: "engineering/hydraulics"
order: 20
visibility: public
tags: [hazen-williams, pressure-pipe, water-main, friction-loss, c-factor]
updated: 2026-05-06
sources:
  - title: "AWWA M11, Steel Pipe — A Guide for Design and Installation, 5th ed."
    url: https://www.awwa.org/
    verified: 2026-05-06
  - title: "FHWA HDS-4, Introduction to Highway Hydraulics"
    url: https://www.fhwa.dot.gov/engineering/hydraulics/pubs/08090/08090.pdf
    verified: 2026-05-06
---

> **TL;DR**
> 1. Hazen-Williams: **V = k C R^0.63 S^0.54**, where k = 1.318 (US customary), C = roughness coefficient (higher is smoother), R = hydraulic radius (ft), and S = head loss per unit length (ft/ft).
> 2. Use Hazen-Williams for **pressure pipe systems** (water distribution, force mains) where water is the fluid and temperatures are between 40-75 degrees F. Do not use it for gravity-flow open channels or for fluids other than water.
> 3. Common C values: new ductile iron = 140, old unlined cast iron = 80-100, PVC/HDPE = 150, concrete = 130-140.

## The equation

US customary form:

`V = 1.318 × C × R^0.63 × S^0.54`

where V = velocity (ft/s), C = Hazen-Williams coefficient, R = hydraulic radius (ft), and S = slope of the energy grade line (ft/ft, which equals head loss h_f divided by pipe length L).

For a full circular pipe (R = D/4), the flow form is:

`Q = 0.4322 × C × D^2.63 × S^0.54`

where Q is in cfs and D is in ft.

Rearranged for head loss per 1,000 ft (a common engineering form):

`h_f = 10.44 × L × Q^1.85 / (C^1.85 × D^4.87)`

where h_f = friction head loss (ft), L = pipe length (ft), Q = flow (gpm in some reference versions — confirm units).

## C values by pipe material and age

| Material | C (new) | C (20 yr) | C (40 yr) |
|---|---|---|---|
| PVC | 150 | 150 | 145 |
| HDPE | 150 | 150 | 145 |
| Ductile iron (cement-lined) | 140 | 130 | 120 |
| Ductile iron (unlined) | 130 | 100 | 80 |
| Cast iron (unlined) | 130 | 100 | 75-80 |
| Concrete (prestressed) | 140 | 135 | 130 |
| Steel (cement-lined) | 140 | 130 | 120 |
| Steel (bare) | 140 | 110 | 90 |
| Asbestos cement | 140 | 135 | 130 |
| Copper | 140 | 135 | 130 |
| Galvanized iron | 120 | 100 | 80 |

C decreases over time due to tuberculation, biofilm, and mineral deposits. Use aged C values for existing-system analysis. Many water utilities perform C-factor tests (hydrant flow tests) to measure actual field values.

## When to use Hazen-Williams

Hazen-Williams is the standard for water distribution system design in the US. It is simpler than Darcy-Weisbach for hand calculations and is built into most water modeling software (WaterCAD, WaterGEMS, EPANET).

Limitations:

- Valid only for water near ambient temperature (40-75 degrees F). For hot water, wastewater, or other fluids, use Darcy-Weisbach.
- Valid only for turbulent flow in pipes 3 inches and larger. Not accurate for very small pipes or very low velocities.
- Empirical — the exponents are not derived from first principles. Darcy-Weisbach is theoretically rigorous.

## Comparison with Darcy-Weisbach

Darcy-Weisbach: `h_f = f × (L/D) × (V² / 2g)`

where f = Darcy friction factor (from the Moody diagram or Colebrook-White equation), L = length, D = diameter, V = velocity, g = gravitational acceleration.

Darcy-Weisbach is more accurate across all flow regimes, pipe sizes, and fluids. It is preferred in academic practice and is the default in some international codes. However, Hazen-Williams remains dominant in US water-utility practice because the C factor is intuitive and field-measurable.

## Related

- [Manning's equation reference](mannings-reference.md)
- [HGL calculation](hgl.md)
- [Energy and momentum](energy-and-momentum.md)
