---
title: "Sanitary Sewer Flow Estimation"
section: "engineering/sanitary-sewer"
order: 20
visibility: public
tags: [sanitary, sewer, peaking-factor, infiltration, inflow]
updated: 2026-05-06
sources:
  - title: "Recommended Standards for Wastewater Facilities (Ten States Standards), 2014 ed., §11"
    url: https://10statesstandards.com/
    verified: 2026-05-06
  - title: "IDEM Construction Permit Program (327 IAC 3-2)"
    url: https://www.in.gov/idem/permits/water/wastewater-permits/
    verified: 2026-05-06
  - title: "ASCE/EWRI Manual of Practice No. 60, Chapter 5"
    url: https://ascelibrary.org/doi/book/10.1061/9780784408001
    verified: 2026-05-06
---

> **TL;DR**
> 1. Average daily flow (ADF) starts at **100 gpd per capita** for residential (Ten States Standards §11); use metered data when available. Commercial and industrial loads are additive and site-specific.
> 2. Peak hourly flow is ADF multiplied by a **peaking factor** (PF). Babbitt: `PF = 5 / P^0.2`; Harmon: `PF = 1 + 14 / (4 + P^0.5)`, with P in thousands of people. Typical PF ranges from about 4.0 (small subdivision) down to 1.8 (large trunk).
> 3. Add **infiltration and inflow (I/I)** to every reach: Ten States allows 200 gpd per inch-diameter per mile of new sewer for design; existing systems are measured.
> 4. Design flow = `ADF x PF + I/I`. Size the pipe for this flow at the required minimum velocity (2.0 ft/s at design flow).

## Average daily flow

ADF is the baseline demand on the sewer. Estimate it from population projections and unit generation rates:

- **Residential** — 100 gpd per capita (Ten States §11.11). With a typical household size of 2.5 persons and a density of 3.5 dwelling units per acre, a residential subdivision generates about 875 gpd/ac. Use actual metered wastewater data when the receiving utility provides it; many Indiana systems report average returns closer to 60 to 80 gpd per capita.
- **Commercial** — varies widely. Strip retail: 0.10 to 0.25 gpd per sq ft of building area. Restaurant: 35 to 50 gpd per seat. Office: 15 to 25 gpd per employee. Source fixture-unit or metered data from the local utility.
- **Industrial** — process discharge is site-specific and requires a pretreatment review per 40 CFR 403 and the utility's sewer-use ordinance. Do not include process waste in the sanitary design flow without utility concurrence.
- **Schools, churches, parks** — per-fixture or per-capita factors from Ten States Standards or the local design manual. Schools: 15 to 25 gpd per student; churches: 3 to 5 gpd per seat.

Sum ADF along the sewer from upstream to the outlet, accumulating tributary areas and populations at each reach.

## Peaking factors

Peak hourly flow is the controlling design load for gravity sewers. The peaking factor accounts for the diurnal pattern — morning and evening peaks where instantaneous flow far exceeds the daily average.

### Babbitt formula

`PF = 5 / P^0.2`

where P is the contributing population in thousands. At P = 0.5 (500 people), PF is about 4.3; at P = 10 (10,000 people), PF is about 3.2; at P = 100, PF is about 2.0.

### Harmon formula

`PF = 1 + 14 / (4 + P^0.5)`

At P = 0.5, PF is about 4.0; at P = 10, PF is about 3.1; at P = 100, PF is about 2.0.

Both formulas converge for large populations and diverge slightly for small ones. Ten States §11.232 publishes a peaking curve that most Indiana agencies accept as the default. When the local utility specifies a particular formula or table, use that. Do not apply a peaking factor below 1.5 or above 4.5 without documentation.

### Minimum flow check

For the first few hundred feet of an upper-end sewer serving a small number of lots, the design flow at peak may still be very low. Many Indiana utilities require a minimum design flow equivalent to two fixture units discharging simultaneously (about 6 gpm) to avoid an undersized pipe that cannot carry expected solids.

## Infiltration and inflow (I/I)

**Infiltration** is groundwater entering the sewer through pipe joints, cracks, and manhole walls. **Inflow** is surface water entering through connected drains, manhole lids, and illicit connections. Together they consume capacity and dilute treatment plant influent.

### Design I/I for new sewers

Ten States Standards §11.24 allows a design I/I rate of **200 gpd per inch-diameter per mile** of sewer. For an 8-in sewer this is 1,600 gpd per mile. Some Indiana cities (Carmel, Westfield) cap the allowance at lower values for new PVC sewers with boot seals and gasketed manholes, on the premise that modern materials should be tighter.

### Measured I/I for existing systems

For extensions to or rehabilitation of existing collection systems, measure actual I/I by:

- **Nighttime flow monitoring** — minimum flow during dry weather represents base infiltration.
- **Wet-weather flow monitoring** — peak flow during a storm event compared to dry-weather flow gives the inflow component.
- **Smoke testing and CCTV inspection** — identifies specific sources for rehabilitation.

IDEM requires a sewer system evaluation survey (SSES) when an existing system shows excessive I/I (generally >120,000 gpd/in-dia-mi or when treatment plant wet-weather flows regularly exceed capacity).

### Where I/I enters the design

Add the I/I volume to each reach as a distributed load proportional to pipe length and diameter. The design flow at any point is:

`Q_design = (ADF_cumulative x PF) + I/I_cumulative`

Some engineers apply the peaking factor only to the domestic/commercial base flow and not to I/I, since I/I has its own peak during storm events. Others apply PF to the total. Confirm the local convention; applying PF to the entire flow is conservative and is what most Indiana reviewers expect for new systems.

## Putting it together — example

A 40-lot residential subdivision in Hamilton County, Indiana:

- Population: 40 lots x 2.5 persons = 100 persons
- ADF: 100 persons x 100 gpd = 10,000 gpd = 6.9 gpm
- Peaking factor (Babbitt, P = 0.1): PF = 5 / 0.1^0.2 = 7.9 — capped at 4.0 per local standard
- Peak domestic flow: 6.9 gpm x 4.0 = 27.8 gpm = 0.062 cfs
- I/I: 2,000 ft of 8-in sewer = 0.38 mi; 200 gpd x 8 in x 0.38 mi = 608 gpd = 0.42 gpm
- Design flow: 27.8 + 0.42 = 28.2 gpm = 0.063 cfs

An 8-in PVC sewer at 0.40% slope carries 0.70 cfs full — adequate, with substantial capacity for future connections.

## Common review issues

- Using a peaking factor of 2.5 for a 50-lot subdivision — too low; PF should be 3.5 to 4.0 for populations under 1,000.
- Omitting I/I entirely on a new system — reviewers still expect the design allowance.
- Applying the peaking factor to I/I for an existing system with measured I/I — double-counting the wet-weather peak.
- No source cited for the per-capita flow rate — always document the basis.

## Related

- [Pipe sizing and slopes](pipe-sizing-and-slopes.md)
- [Manhole design](manhole-design.md)
- [Ten States Standards summary](ten-states-standards.md)
- [Force mains and lift stations](force-mains-and-lift-stations.md)
