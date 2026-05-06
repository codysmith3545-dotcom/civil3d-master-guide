---
title: "Ten States Standards (Water)"
section: "engineering/water-distribution"
order: 80
visibility: public
tags: [water, distribution, ten-states, glumrb]
updated: 2026-05-06
sources:
  - title: "Recommended Standards for Water Works (Ten States Standards), 2018 ed."
    url: https://10statesstandards.com/
    verified: 2026-05-06
  - title: "IDEM Drinking Water Program"
    url: https://www.in.gov/idem/cleanwater/information-about/drinking-water-program/
    verified: 2026-05-06
  - title: "Great Lakes–Upper Mississippi River Board of State and Provincial Public Health and Environmental Managers (GLUMRB)"
    url: https://10statesstandards.com/about.html
    verified: 2026-05-06
---

> **TL;DR**
> 1. The "Ten States Standards" for water is the **Recommended Standards for Water Works** published by **GLUMRB**. The current edition is **2018**. It is the baseline design standard for public water supply in Indiana.
> 2. IDEM's Drinking Water Program adopts these standards as the practical minimum for construction plan review of wells, treatment, storage, and distribution systems.
> 3. Key sections for distribution design: §3 (source), §5 (treatment), §7 (storage), §8 (distribution), including well-setback requirements, disinfection CT, and system pressure.
> 4. Local utilities may impose requirements stricter than GLUMRB — always apply the more restrictive standard.

## What the water standards cover

The Recommended Standards for Water Works is a comprehensive document spanning the full public water supply chain:

- **Part 1 — Submission of plans and reports** (§1–2): what must be submitted to the state regulatory agency (IDEM in Indiana) before construction.
- **Part 2 — Source development** (§3): wells, intakes, springs, and source water protection.
- **Part 3 — Treatment** (§4–5): filtration, disinfection, fluoridation, softening, iron/manganese removal, etc.
- **Part 4 — Chemical application** (§6): chemical feed systems, dosing, and storage.
- **Part 5 — Storage** (§7): elevated tanks, ground-level tanks, standpipes, hydropneumatic systems.
- **Part 6 — Distribution** (§8): pipe sizing, materials, pressure, valves, hydrants, and cross-connection control.

This page focuses on sections most relevant to land-development projects in Indiana — primarily Parts 2, 5, and 6.

## Source development — well setbacks (§3)

Well setback requirements protect groundwater supply wells from contamination. Ten States §3.2.2 sets minimum isolation distances that IDEM adopts:

| Potential contamination source | Minimum setback |
|---|---|
| Sanitary sewer (gravity) | 50 ft |
| Sanitary sewer (force main, pressure tested) | 25 ft |
| Septic tank, absorption field | 50 ft |
| Storm sewer or drainage ditch | 25 ft |
| Property line (uncontrolled land use) | 50 ft |
| Building foundation (slab-on-grade) | 10 ft |
| Fuel storage tank (underground) | 300 ft (IDEM may require more) |
| Fuel storage tank (above ground, with secondary containment) | 100 ft |
| Animal feedlot or manure storage | 200 ft |
| Chemical storage or handling area | 150 ft |
| Cemetery | 100 ft |

Indiana 327 IAC 8-3.4 supplements these distances, and some counties impose wider setbacks through zoning or wellhead protection ordinances. The setbacks apply to community water supply wells; private residential wells follow a separate (and generally less stringent) set of rules under 312 IAC 13.

For land surveyors platting a subdivision served by a community well, the well setbacks may affect lot layout, sewer routing, and stormwater facility placement. Map all setback radii on the preliminary plat.

## Disinfection and CT (§5.1)

All public water supplies in Indiana must disinfect to meet the Surface Water Treatment Rule and the Groundwater Rule. The measure of disinfection adequacy is the **CT value** — the product of disinfectant concentration (C in mg/L) and contact time (T in minutes).

Required CT depends on the disinfectant, target pathogen, temperature, and pH. For free chlorine targeting Giardia at 0.5°C (winter worst case), CT values range from about 100 to 300 mg-min/L depending on pH (higher pH requires higher CT). At warmer temperatures CT drops significantly.

Key points for engineers:

- **Contact time** (T) is measured at the baffled detention time in the clearwell at peak hourly flow — not the theoretical detention time. Baffling factors (0.1 to 1.0) account for short-circuiting. IDEM reviews the baffling factor closely.
- **CT calculation** must be submitted with the construction permit application for any new storage or treatment facility.
- Where CT cannot be met in the existing clearwell, options include adding baffles, adding a contact pipe, or increasing chlorine dose (with attention to disinfection byproduct limits).

## Finished water storage (§7)

### Sizing

Ten States §7 requires storage to meet three needs simultaneously (see [pressure zones](pressure-zones.md) for more detail):

- **Equalization** — 25% of the maximum daily demand or the difference between peak-hour and supply rates, whichever is larger.
- **Fire flow** — the required fire flow multiplied by the required duration.
- **Emergency** — one day of average daily demand for small systems (IDEM may require more for systems without interconnections).

### Elevated vs. ground-level

- **Elevated tanks** (water towers) set the HGL by their overflow elevation. No pumps needed for normal operation — gravity feeds the zone.
- **Ground-level tanks with booster pumps** are increasingly common for larger systems. Pumps maintain pressure; tanks store volume. Duplex or triplex pumps with VFDs are required, plus backup power.
- **Hydropneumatic tanks** are allowed only for small systems (< 150 connections per IDEM guidance) where an elevated tank or booster station is not economically justified. They do not provide fire-flow storage — fire flow must come from the supply source directly.

### Construction and sanitary protection

All storage tanks must be:

- Watertight (AWWA D100 for welded steel, AWWA D110 for prestressed concrete).
- Vented with a screened, downward-facing vent to prevent insects and surface water entry.
- Equipped with an overflow that discharges to grade at a visible location (not piped to a storm sewer or sanitary sewer).
- Accessible for inspection and cleaning, with a lockable access hatch and ladder/safety climb.
- Disinfected before being placed in service (AWWA C652) and after any entry for maintenance.

## Distribution system (§8)

The distribution sections most frequently applied to Indiana site development:

### §8.1 — Pipe sizing and layout

- Minimum diameter for fire-protected distribution: **6 in** (dead-end stubs) or **8 in** (looped grids).
- Loops preferred over dead ends; dead ends kept short and equipped with flushing devices.
- See [pipe sizing and velocity](pipe-sizing-velocity.md) and [looping and dead-ends](looping-and-dead-ends.md).

### §8.2 — Pressure

- Normal static: 40 to 80 psi.
- Fire-flow residual: 20 psi minimum.
- Peak-hour residual: 35 psi minimum.
- See [pressure zones](pressure-zones.md).

### §8.3 — Separation from sewers

- **Horizontal**: 10 ft between water main and sanitary sewer.
- **Vertical at crossings**: water main above sewer with 18 in clearance. If sewer is above, the sewer must be encased in concrete for 10 ft on each side.
- These distances mirror [Ten States wastewater §38](../sanitary-sewer/ten-states-standards.md) and 327 IAC 8-3.2.

### §8.4 — Valves and hydrants

- Isolation valves at every tee and cross.
- Hydrants on a minimum 6-in branch with an isolation valve.
- See [valves](valves.md) and [hydrant placement](hydrant-placement.md).

### §8.6 — Cross-connection control

- Backflow prevention required at all hazardous connections.
- Annual testing of all testable assemblies.
- See [backflow](backflow.md).

## How Indiana uses the water standards

IDEM's Drinking Water Branch reviews construction plans for all new or modified public water supply facilities (wells, treatment, storage, transmission, and distribution). The review engineer evaluates the design against the current edition of the Recommended Standards for Water Works (2018). Deviations require a written justification supported by calculations or local data, submitted in the engineering report.

Local utilities add their own requirements:

- **Citizens Energy (Indianapolis)** — publishes "Construction Standards and Specifications" that reference Ten States but add specific product approvals, testing protocols, and construction details.
- **Indiana American Water** — publishes system-specific standards that generally align with Ten States but may specify preferred pipe materials and valve brands.
- **Municipal utilities (Carmel, Fishers, Westfield, Noblesville)** — each city's engineering design manual references Ten States and layers additional requirements.

When IDEM and the local utility have different requirements, the more restrictive governs.

## Common review issues

- Plans cite the 2012 edition instead of the current 2018 edition — update the reference.
- Well setback from a sanitary sewer is 40 ft instead of 50 ft — fail per §3.2.2.
- No CT calculation submitted for a new clearwell — required by IDEM.
- Storage is sized for fire flow but equalization and emergency volumes are not addressed — all three components are required.
- PRV station has no bypass — flagged per §8.4.

## Related

- [Demand estimation](demand-estimation.md)
- [Pipe sizing and velocity](pipe-sizing-velocity.md)
- [Valves](valves.md)
- [Backflow](backflow.md)
- [Pressure zones](pressure-zones.md)
- [EPANET](epanet.md)
- [Ten States Standards (wastewater)](../sanitary-sewer/ten-states-standards.md)
