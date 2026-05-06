---
title: "Water Demand Estimation"
section: "engineering/water-distribution"
order: 20
visibility: public
tags: [water-distribution, demand, peak-hour, fire-flow, ten-states, iso]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCalculators: [water-demand, fire-flow]
updated: 2026-05-06
sources:
  - title: "Recommended Standards for Water Works (Ten States Standards), 2018 ed."
    url: https://10statesstandards.com/
    verified: 2026-05-06
  - title: "AWWA M31, Distribution System Requirements for Fire Protection, 5th ed."
    url: https://www.awwa.org/Store/Product-Details/productId/65265658
    verified: 2026-05-06
  - title: "ISO Public Protection Classification Program (PPC), Fire Suppression Rating Schedule (FSRS)"
    url: https://www.isomitigation.com/ppc/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Size mains for the **larger** of (a) **maximum daily demand + fire flow** or (b) **peak hour demand**, with residual pressure ≥ 20 psi at hydrants during fire flow and ≥ 35 psi during peak hour at the customer service.
> 2. Ten States Standards baseline: average daily demand 100 gpcd; max-day = 2.0 × average; peak-hour = 4.0 × average. Use local metered data when available.
> 3. Fire flow is the controlling design load for most subdivisions and commercial sites. Estimate from ISO needed-fire-flow methods or the simplified building-area formula.
> 4. Minimum main size for fire protection is **6 in** (Ten States); **8 in** for grids and looped distribution; smaller mains permit only domestic service in stub lines.

## Per-capita demand

Ten States Standards §3.2.1 sets a baseline of 100 gpcd average daily demand for design when local data is not available. Indiana water utilities (Citizens Energy, Indiana American Water, municipal systems) typically use measured per-customer demand — often lower than 100 gpcd in newer water-conserving fixture markets. Document the source of the demand factor in the design report.

## Peaking factors

Three demand levels drive different design checks:

| Demand | Multiplier on average | Common use |
|---|---|---|
| Average daily demand (ADD) | 1.0 | Annual system capacity, source planning |
| Maximum daily demand (MDD) | 2.0 (Ten States) | Sizing supply, treatment, and storage |
| Peak hour demand (PHD) | 4.0 (Ten States) | Sizing distribution mains, residual pressure check |

These factors are conservative for design. Operating data from established utilities often shows MDD ratios closer to 1.5 to 1.8 and PHD ratios from 2.5 to 3.5, but Ten States values are accepted by IDEM and used as a default unless local data is presented and approved.

For nonresidential demands use fixture-unit methods (Hunter's curves, IPC Table E103.3) for in-building loads and observed industrial loads for site totals. Combine with residential per-capita demand on the same time scale (e.g., compute MDD for both and add).

## Storage

Ten States §7 sets the equalization, fire, and emergency storage requirement. A common design check:

- Equalization storage = (PHD - MDD) × duration of peak hour, or 25% of MDD volume.
- Fire flow storage = required fire flow × required duration (see below).
- Emergency storage = at least the average daily demand for one day, more in remote systems.

Total storage must keep the operating range above the elevation needed to maintain 20 psi at the lowest service during fire flow at MDD.

## Fire flow estimation

Fire flow drives the distribution main size in most projects. Two common methods:

### ISO needed-fire-flow (NFF)

The Insurance Services Office (ISO) Fire Suppression Rating Schedule (FSRS) computes a needed fire flow for an individual building from:

- Construction class (frame, joisted masonry, non-combustible, masonry non-combustible, modified fire resistive, fire resistive).
- Effective area (the largest floor plus a fraction of other floors).
- Occupancy hazard (1 = light, 5 = severe).
- Exposure (adjacent buildings within 10 to 100 ft).
- Communication (openings between buildings).

The result rounds to the nearest 250 gpm up to 2,500 gpm and to the nearest 500 gpm above. ISO caps NFF at 12,000 gpm for a single building. Required duration:

| NFF | Duration |
|---|---|
| ≤ 2,500 gpm | 2 hours |
| 3,000 to 3,500 gpm | 3 hours |
| ≥ 4,000 gpm | 4 hours |

### Building-area (ICC IFC Appendix B) method

The International Fire Code Appendix B simplified method tabulates required fire flow by construction type and area. A common quick estimate:

- One-family dwelling, ≤ 3,600 sq ft: 1,000 gpm for 1 hour.
- One-family dwelling, > 3,600 sq ft: 1,500 to 2,000 gpm for 2 hours.
- Townhouses: 1,500 gpm for 2 hours.
- Small commercial (≤ 5,000 sq ft, Type V-B): 1,500 gpm for 2 hours.
- Larger commercial: scales with area and construction type to a maximum of 8,000 gpm.

Reductions of up to 75% (capped at 1,000 gpm reduction) apply when the building is fully sprinkled. Indiana Authorities Having Jurisdiction (AHJs) and the Indiana Department of Homeland Security adopt the IFC with state amendments — confirm any local modifications.

## Residual pressure

Pressure criteria during the design load:

- **Peak hour, no fire** — residual ≥ 35 psi at the customer service connection (Ten States §8.2.1). Some Indiana utilities require 40 psi.
- **Maximum day + fire flow** — residual ≥ 20 psi at the test hydrant.
- **Static** — typically 60 to 80 psi normal; 100 psi maximum (over 80 psi requires a pressure reducing valve at the service).

The 20-psi minimum is the safety floor — below this, contamination from cross-connections and back-siphonage becomes plausible and the public health risk is unacceptable.

## Velocity and headloss

- **Maximum velocity** — typically 5 ft/s during normal demand, 8 ft/s during fire flow. Velocities above ~10 ft/s scour pipe linings and cause water hammer concerns.
- **Headloss** — Hazen-Williams equation is the convention for water mains:

`hf = 10.67 L Q^1.852 / (C^1.852 D^4.87)` (SI form; for U.S. units use `hf = 4.52 L Q^1.852 / (C^1.852 D^4.87)` with Q in gpm, D in inches, hf in psi)

C-factor for new pipe: 130 to 140 for ductile iron with cement-mortar lining, 140 to 150 for PVC, 100 to 110 for unlined steel. Design with C reduced for aging — many utilities require C = 100 for design even on new ductile iron.

## Common design checks

- Hydraulic model run at MDD + fire flow at every hydrant (not just the worst-case hydrant).
- Hydraulic model run at PHD with no fire to confirm residual at the highest service elevation.
- Storage drawn down to bottom of fire-storage range while flowing fire flow — pressure remains ≥ 20 psi.
- Dead-end mains kept short; the system is looped wherever practical (Ten States §8.1.4).

## Related

- [Hydrant placement](hydrant-placement.md)
- [Manning's reference](../hydraulics/mannings-reference.md)
- [Water demand calculator](/tools/water-demand)
- [Fire flow calculator](/tools/fire-flow)
