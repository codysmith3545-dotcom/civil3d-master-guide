---
title: "Fire-Flow Requirements (ISO Needed Fire Flow, hydrant spacing)"
section: "engineering/water-distribution-design"
order: 20
visibility: public
tags: [fire-flow, hydrant, iso, needed-fire-flow, nfpa, ten-states]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreatePressurePipeNetwork, EditPressurePipeNetwork]
relatedCalculators: [hazen-williams, fire-flow]
updated: 2026-05-11
sources:
  - title: "ISO Fire Suppression Rating Schedule (Public Protection Classification Program)"
    url: https://www.isomitigation.com/ppc/"
    verified: 2026-05-11
  - title: "AWWA M31 (Distribution Network Analysis for Water Utilities), 3rd ed."
    url: https://www.awwa.org/Store/Product-Details/productId/13107"
    verified: 2026-05-11
  - title: "Recommended Standards for Water Works (Ten States Standards Water), 2018 ed., §8"
    url: https://10statesstandards.com/
    verified: 2026-05-11
  - title: "NFPA 1 Fire Code (2024), Chapter 18"
    url: https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=1
    verified: 2026-05-11
  - title: "Indiana 327 IAC 8 (Public Water Supply)"
    url: https://www.in.gov/legislative/iac/title327.html
    verified: 2026-05-11
---

> **TL;DR**
> 1. ISO Needed Fire Flow (NFF) is set by occupancy class, construction type, exposures, and communication. Typical Indiana residential NFF is **500-1,500 gpm at 20 psi residual for 1-2 hours**; commercial ranges 1,500-4,500 gpm for 2-4 hours.
> 2. NFPA 1 (Chapter 18) and AWWA M31 set hydrant spacing: **typical 500 ft maximum on residential streets**, **300 ft on commercial / industrial**, with **600 ft maximum hose lay** from any structure to the nearest hydrant.
> 3. Fire flow is measured at **20 psi residual pressure** in the main while delivering the required flow — not at the hydrant nozzle. The system's fire-flow capacity is determined by a flow test (AWWA M17).

## What "needed fire flow" actually means

The ISO Fire Suppression Rating Schedule (FSRS) computes a Needed Fire Flow (NFF) for representative structures in each PPC area. The water-supply credit on the FSRS is the smaller of:

- The system's available fire flow at 20 psi.
- 3,500 gpm (the FSRS cap for credit).

For most subdivisions the design driver is **the local fire marshal's NFF letter** or the city water department's standard. Common Indiana defaults:

| Occupancy | NFF (gpm) | Duration (hr) |
|---|---|---|
| 1 / 2-family residential, ≤ 3,600 sf | 500 | 1 |
| 1 / 2-family residential, > 3,600 sf | 750-1,500 | 1-2 |
| Townhouse / multifamily | 1,500-2,500 | 2 |
| Commercial < 12,000 sf | 1,500 | 2 |
| Commercial 12,000-50,000 sf | 2,250-3,000 | 2-3 |
| Light industrial | 2,500-3,500 | 3 |
| High-piled storage / warehouse | 3,500-4,500 | 3-4 |
| Hospital, school | 2,500-3,500 | 3 |

These are commonly cited tabulations consistent with NFPA 1 Chapter 18 and the ISO FSRS; the legally enforceable number for a specific site comes from the local fire marshal.

## Reductions for sprinklered buildings

NFPA 1 Section 18.4.5.1 allows up to a **50% reduction** in NFF for fully sprinklered buildings meeting NFPA 13. Minimum is 1,000 gpm for non-residential and 500 gpm for residential after reduction. The Indianapolis Fire Department and most Indiana fire marshals apply this reduction routinely.

## Hydrant spacing

NFPA 1 / AWWA M31 typical numbers:

| Land use | Max hydrant spacing | Max hose lay to structure |
|---|---|---|
| 1 / 2-family residential | 500 ft | 600 ft |
| Multifamily / townhouse | 400 ft | 500 ft |
| Commercial / industrial | 300 ft | 400 ft |
| Warehouse / high-piled storage | 250 ft | 250 ft |

Indiana practice (Indianapolis Water, Citizens Energy, Carmel Utilities) commonly uses 500 ft on residential, 300 ft on commercial. Confirm in the local utility design manual.

## Hydraulic check: can the system deliver NFF?

A fire-flow analysis demands:

1. **Demand:** Maximum Day Demand (MDD) + NFF flowing simultaneously.
2. **Pressure floor:** ≥ 20 psi at the most-distant hydrant during the fire-flow event.
3. **Node check:** all customer pressures ≥ 20 psi during fire flow.

Run this in EPANET, Bentley WaterGEMS / WaterCAD, or KYPipe. Hazen-Williams form for sizing:

`hf = 4.52 (Q^1.85) / (C^1.85 D^4.87) × L`  (English, hf in ft, Q in gpm, D in inches, L in ft)

Where `C` = Hazen-Williams coefficient. Use **C = 120 for new PVC**, 100 for new ductile iron, **80 for aged unlined cast iron**. Most fire-flow analyses use C = 100 for conservative design.

### Field test confirmation

After construction, run an AWWA M17 flow test:

- Static pressure at a "pressure hydrant" (no flow).
- Pitot pressure at a "flow hydrant" while flowing one or more outlets.
- Compute available flow at 20 psi using the Q1.85 / hf relation:

`Q_20 = Q_test × ((P_static - 20) / (P_static - P_test))^0.54`

This is the legally enforceable available fire flow at the site.

## Worked example

New 200-lot subdivision with 2,500-sf homes (NFF = 750 gpm, 2 hr). 8-in PVC distribution main (C = 120), MDD = 0.45 cfs at the entrance to the subdivision.

Check the most-distant hydrant, 2,400 ft of 8-in main from the source at HGL = 360 ft (residual pressure 80 psi at the entrance = 360 ft - 175 ft (ground) = ~80 psi; ground at the back of the subdivision = 195 ft; required residual HGL ≥ 195 + 46 ft (20 psi) = 241 ft).

NFF + MDD = 750/449 = 1.67 cfs + 0.45 = 2.12 cfs = 951 gpm.

Hazen-Williams head loss:
`hf = 4.52 × 951^1.85 / (120^1.85 × 8^4.87) × 2,400`

`951^1.85 ≈ 296,000`; `120^1.85 ≈ 7,510`; `8^4.87 ≈ 27,000`.
`hf ≈ 4.52 × 296,000 / (7,510 × 27,000) × 2,400 ≈ 4.52 × 296,000 / 2.027e8 × 2,400 ≈ 15.85 ft`

HGL at hydrant during fire flow = 360 - 15.85 = 344 ft. Pressure = (344 - 195) × 0.433 = 64.5 psi. Well above 20 psi residual. **8-in PVC is sufficient.**

If the loss had been > 80 ft (residual < 20 psi at ground = 195 + 46 = 241 ft), the design would require 10-in or 12-in main, or a looped feed.

## Common review comments

- Fire-flow analysis only checks the source node — must check the most-distant hydrant.
- Used C = 150 for new PVC (manufacturer values) — design uses C = 120 to allow for aging.
- 600-ft hydrant spacing on a residential cul-de-sac — most Indiana standards cap at 500 ft.
- No sprinkler-credit calculation included where buildings are sprinklered — leaves money on the table.
- Did not run the analysis at Maximum Day Demand — fire flow at average demand under-stresses the system.

## Related

- [Hydrant placement (breadth)](../water-distribution/hydrant-placement.md)
- [Pipe sizing and velocity (breadth)](../water-distribution/pipe-sizing-velocity.md)
- [Pressure zone boundaries](pressure-zone-boundaries.md)
- [Looping, redundancy, and dead-ends](looping-redundancy-and-deadends.md)
- [Hazen-Williams calculator](/tools/hazen-williams)
- [Fire-flow calculator](/tools/fire-flow)
