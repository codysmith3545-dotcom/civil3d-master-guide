---
title: "Water Main Pipe Sizing and Velocity"
section: "engineering/water-distribution"
order: 20
visibility: public
tags: [water, distribution, pipe-sizing, velocity, headloss]
updated: 2026-05-06
sources:
  - title: "Recommended Standards for Water Works (Ten States Standards), 2018 ed., §8"
    url: https://10statesstandards.com/
    verified: 2026-05-06
  - title: "AWWA M31, Distribution System Requirements for Fire Protection, 5th ed."
    url: https://www.awwa.org/Store/Product-Details/productId/65265658
    verified: 2026-05-06
  - title: "AWWA C150/C151 (Ductile Iron Pipe) and AWWA C900/C905 (PVC Pipe)"
    url: https://www.awwa.org/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Size water mains so that velocity stays between **2 ft/s** (minimum for water quality / flushing) and **5 ft/s** during normal demand, with a fire-flow maximum of **8 to 10 ft/s**.
> 2. Minimum pipe diameter for fire-protected distribution is **6 in** (stub lines) or **8 in** (looped grids) per Ten States §8.1.4. Dead-end mains of 6 in or less serve only domestic loads.
> 3. Compute headloss with the **Hazen-Williams equation**: `hf = 4.52 L Q^1.852 / (C^1.852 D^4.87)` (Q in gpm, D in inches, L in ft, hf in ft). Design with reduced C-factors to account for pipe aging.
> 4. Maintain **residual pressure of 20 psi** at the flowing hydrant during fire flow and **35 psi** at the customer service during peak-hour demand.

## Hazen-Williams equation

The Hazen-Williams equation is the standard headloss formula for water distribution design in the U.S.:

`hf = 4.52 L Q^1.852 / (C^1.852 D^4.87)`

where hf is friction headloss in feet of water, L is pipe length in feet, Q is flow in gpm, C is the Hazen-Williams roughness coefficient, and D is the inside diameter in inches.

Velocity in a pipe:

`V = 0.4085 Q / D^2` (ft/s, with Q in gpm and D in inches)

### C-factor selection

C decreases with pipe age and internal deposits. Design values:

| Pipe material | New C | Design C (20-yr+) |
|---|---|---|
| Ductile iron, cement-mortar lined | 130–140 | 100–120 |
| PVC (AWWA C900/C905) | 140–150 | 140 |
| HDPE (DR 11) | 140–150 | 140 |
| Unlined cast iron | 100–120 | 60–80 |
| Unlined steel | 110–120 | 80–100 |

Many Indiana utilities require all hydraulic analyses to use **C = 100** for ductile iron and **C = 130** for PVC to reflect long-term conditions and provide a margin for tuberculation. Confirm the local design standard.

## Minimum pipe sizes

Ten States §8.1.4 and most Indiana utilities:

- **8 in** — minimum for mains in looped grids serving fire hydrants. This is the standard for new residential subdivisions and commercial sites.
- **6 in** — allowed for stub lines serving fire hydrants if the stub is short (typically < 300 ft to 500 ft) and looped at both ends. Also the minimum main size for any hydrant connection.
- **4 in** — domestic-only service lines (no hydrant connections permitted). Rarely used for public mains; most Indiana utilities prohibit 4-in public mains entirely.
- **12 in and larger** — transmission mains feeding distribution grids. Size by hydraulic analysis to maintain pressure and velocity criteria.

## Velocity criteria

| Condition | Target velocity | Maximum velocity |
|---|---|---|
| Average daily demand | 1–3 ft/s | 5 ft/s |
| Peak hour demand | 2–5 ft/s | 5 ft/s |
| Maximum day + fire flow | 3–8 ft/s | 10 ft/s |
| Flushing velocity | 2.5 ft/s minimum | — |

**Low velocity** (< 1 ft/s) leads to stagnation, disinfectant residual loss, and water quality complaints. Mains with chronically low velocity should be flushed regularly or looped to improve turnover.

**High velocity** (> 10 ft/s) creates excessive headloss, water hammer risk, and erosion of cement-mortar linings. If a fire-flow scenario produces velocity above 10 ft/s, the main is undersized for the required flow — upsize or loop.

## Pipe material selection

Common materials for Indiana water distribution:

- **Ductile iron (DI)** — AWWA C150/C151, Class 52 standard, with cement-mortar lining (CML) and polyethylene encasement in corrosive soils. The workhorse for mains 6 in to 36 in. Joints are push-on (restrained at fittings and bends with mechanical joint restraints or mega-lugs).
- **PVC (C900/C905)** — DR 18 or DR 14 for mains 4 in to 12 in. Lighter weight and lower friction than DI. Many Indiana utilities accept PVC for distribution mains but require DI for transmission mains and under roadways.
- **HDPE** — used primarily for directional-drilled crossings (rivers, highways). Fused joints eliminate joint leakage. DR 11 for pressure service.

Material selection often comes down to the local utility's preferred standard. Check the utility's approved-materials list before specifying.

## Sizing procedure

1. **Determine the design demand** — the larger of (peak-hour demand) or (maximum-day demand + fire flow) at each node in the system. See [demand estimation](demand-estimation.md).
2. **Lay out the system** — loop mains wherever possible. Identify dead ends and size them for the required fire flow at the farthest hydrant.
3. **Select trial diameters** — start with 8 in for residential distribution, 12 in for collector mains, and larger for transmission.
4. **Run the hydraulic model** — compute headloss and velocity at each pipe segment for the controlling demand scenario. Confirm residual pressure at every service node and hydrant.
5. **Check velocity** — flag any pipe with V > 5 ft/s under peak hour or V > 10 ft/s under fire flow. Upsize those segments.
6. **Check pressure** — confirm residual ≥ 35 psi at all services under peak hour and ≥ 20 psi at the test hydrant under fire flow. If not, increase diameter, add looping, or adjust the pressure zone.
7. **Iterate** until all criteria are met simultaneously.

For small projects (a single cul-de-sac, a short extension), a hand calculation with the Hazen-Williams equation may suffice. For anything with more than a few loops, use a hydraulic model (EPANET, WaterGEMS, InfoWater).

## Common review issues

- 6-in main on a looped grid — most Indiana utilities require 8-in minimum for looped distribution.
- C-factor of 150 used for ductile iron — too optimistic; design with 100 to 120 depending on the local standard.
- Fire-flow velocity exceeds 10 ft/s on an 8-in main — upsize to 12 in or add a parallel main.
- No pressure analysis at the highest service elevation — the worst-case node is usually the most distant and highest, not just the farthest hydrant.
- Dead-end main longer than 500 ft with no blow-off — add a flushing hydrant or extend and loop.

## Related

- [Demand estimation](demand-estimation.md)
- [Hydrant placement](hydrant-placement.md)
- [Valves](valves.md)
- [Looping and dead-ends](looping-and-dead-ends.md)
- [Pressure zones](pressure-zones.md)
- [EPANET](epanet.md)
- [Manning's reference](../hydraulics/mannings-reference.md)
