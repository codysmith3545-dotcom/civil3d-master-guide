---
title: "Sanitary Sewer Pipe Sizing and Slopes"
section: "engineering/sanitary-sewer"
order: 20
visibility: public
tags: [sanitary-sewer, pipe-sizing, manning, ten-states, peak-factor, slope]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateNetwork, EditPipeNetwork, ApplyRules]
relatedCalculators: [sanitary-sewer-sizing, mannings]
updated: 2026-05-06
sources:
  - title: "Recommended Standards for Wastewater Facilities (Ten States Standards), 2014 ed."
    url: https://10statesstandards.com/
    verified: 2026-05-06
  - title: "ASCE/EWRI Manual of Practice No. 60 (Gravity Sanitary Sewer Design and Construction), 2nd ed."
    url: https://ascelibrary.org/doi/book/10.1061/9780784408001
    verified: 2026-05-06
---

> **TL;DR**
> 1. Size gravity sanitary sewers for the **peak hourly flow** with a **minimum velocity of 2.0 ft/s** at design flow (Manning equation, n = 0.013 for PVC and concrete by Ten States convention).
> 2. Recommended Standards for Wastewater Facilities ("Ten States Standards") sets the floor in Indiana: minimum slope 0.40% for 8-in, 0.28% for 10-in, 0.22% for 12-in, 0.15% for 15-in (PVC, full pipe).
> 3. Minimum pipe diameter for public sanitary mains is **8 in**. Service laterals are typically 4 in (residential) or 6 in (commercial).
> 4. There is no hard maximum slope, but slopes greater than ~10% require drop manholes at the lower end and anchor blocks per Ten States §33.

## Design flow

Sanitary sewer design uses three flow components:

- **Average daily flow (ADF)** — typically 100 gpd per capita for residential or by metered demand for commercial / industrial users. Ten States Standards §11 specifies 100 gpcd minimum unless local data justifies a different figure.
- **Peak factor** — a multiplier applied to ADF to estimate peak hourly flow. Common formulas:
  - Babbitt: PF = 5 / P^0.2, with P in thousands of people.
  - Harmon: PF = 1 + 14 / (4 + P^0.5), with P in thousands of people.
  - Ten States §11.232 publishes a peaking curve. Typical PF ranges from about 4 (small subdivision) down to about 1.8 (large basin).
- **Inflow and infiltration (I/I)** — added as either a per-acre or per-mile rate. Ten States Standards permits 200 gpd per inch-diameter per mile of new sewer for design; existing-system I/I can be much higher and is determined by flow monitoring.

`Qpeak = ADF × PF + I/I`

Civil 3D pipe network analysis can apply a peak factor automatically if the parts list and flow assignment are configured correctly; verify the resulting peak by hand on a representative reach.

## Manning equation

For circular pipe flowing full:

`Q = (1.486/n) A R^(2/3) S^(1/2)`

with A = π D^2 / 4 and R = D/4. For PVC and modern concrete pipe Ten States Standards specifies **n = 0.013** for design (this is a regulatory floor; the actual hydraulic n for SDR-35 PVC is closer to 0.009, but using 0.013 in design provides a margin for sags, biofilm, and aging).

## Minimum slope table (PVC, n = 0.013, full-pipe velocity = 2.0 ft/s)

| Diameter | Min slope (%) | Min slope (ft/100 ft) | Capacity at min slope (cfs / mgd) |
|---|---|---|---|
| 8 in  | 0.40 | 0.40 | 0.70 cfs / 0.45 mgd |
| 10 in | 0.28 | 0.28 | 1.10 cfs / 0.71 mgd |
| 12 in | 0.22 | 0.22 | 1.55 cfs / 1.00 mgd |
| 15 in | 0.15 | 0.15 | 2.45 cfs / 1.58 mgd |
| 18 in | 0.12 | 0.12 | 3.50 cfs / 2.26 mgd |
| 21 in | 0.10 | 0.10 | 4.85 cfs / 3.13 mgd |
| 24 in | 0.08 | 0.08 | 6.30 cfs / 4.07 mgd |

These are the Ten States Standards §33.4 minimums and what Indiana cities and the IDEM Construction Permit program enforce. Some communities (Carmel, Indianapolis Citizens Energy) require slightly steeper minimums on 8-in mains in subdivisions — confirm in the local technical standards.

## Minimum velocity

The 2.0 ft/s minimum velocity is the self-cleansing criterion, computed at full-pipe flow at the design slope. Solids (grit, fecal matter, paper) settle at lower velocities and accumulate, leading to blockages and odor. For combined or partially-flowing sewers some agencies require 3.0 ft/s.

When the pipe is partially full the actual velocity is higher than full-pipe velocity at d/D between about 0.5 and 0.94 — consult a partial-flow table (cite Chow, Open-Channel Hydraulics; the partial-flow tables are widely reproduced but not republished here).

## Maximum slope and drop manholes

There is no Ten States hard maximum, but practical considerations:

- **Velocities above ~15 ft/s** scour the pipe invert, especially with high grit. Use ductile iron, lined concrete, or HDPE for these reaches.
- **Slopes above ~10%** require anchor blocks per Ten States §33.81 (typically every 36 ft for slopes > 20%; every 24 ft for slopes > 35%).
- **Drop connections** are required where an incoming sewer's invert is 24 in or more above the outgoing sewer (Ten States §44.3). External drops are preferred for maintenance access.

## Minimum pipe size

Public sanitary mains are 8 in minimum (Ten States §33.3). 6-in mains are allowed only for short stub-outs serving a single building. Force mains and service laterals are sized separately:

- **Force mains** — minimum 4 in diameter; sized so that velocity exceeds 2 ft/s at average pumping rate and stays below 8 ft/s at peak.
- **Residential service lateral** — 4 in PVC at 2% minimum slope (1/4 in per ft).
- **Commercial / multifamily service** — 6 in minimum.

## Cover, bedding, and material

- **Minimum cover** — 3.0 ft over the pipe crown to finished grade in trafficked areas. Less cover requires ductile iron or concrete encasement.
- **Pipe material** — SDR-35 PVC for mains 8 in to 15 in is the Indiana default; SDR-26 for deep installations or where loads require it. Reinforced concrete pipe (RCP) Class III or IV for larger mains.
- **Bedding** — Class B (ASTM D2321) crushed stone bedding for PVC; full encasement under streets per local standards.
- **Separation from water mains** — 10 ft horizontal and 18 in vertical (water above sewer) per Ten States §38 and IDEM 327 IAC 8-3.2.

## Common review issues

- Slope reported on the profile but the actual rim-to-invert difference does not match: round-off error in elevation labels.
- 8-in main at exactly 0.40% on a long flat reach — fine on paper but a small construction tolerance puts it below grade. Many cities want 0.45% or 0.50% in practice.
- Velocity is 2.0 ft/s at full but only 1.5 ft/s at average — a Ten States compliant sewer can still see solids deposition on the lowest service density reaches; consider a flush-friendly profile.
- Drop manhole missing where two laterals come in at different elevations.

## Related

- [Manhole design](manhole-design.md)
- [Manning's reference](../hydraulics/mannings-reference.md)
- [Manning's n table](../hydraulics/mannings-n-table.md)
- [Sanitary sewer sizing calculator](/tools/sanitary-sewer-sizing)
