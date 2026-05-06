---
title: "Ten States Standards (Wastewater)"
section: "engineering/sanitary-sewer"
order: 70
visibility: public
tags: [sanitary, sewer, ten-states, glumrb]
updated: 2026-05-06
sources:
  - title: "Recommended Standards for Wastewater Facilities (Ten States Standards), 2014 ed."
    url: https://10statesstandards.com/
    verified: 2026-05-06
  - title: "IDEM Wastewater Construction Permit Program"
    url: https://www.in.gov/idem/permits/water/wastewater-permits/
    verified: 2026-05-06
  - title: "Great Lakes–Upper Mississippi River Board of State and Provincial Public Health and Environmental Managers (GLUMRB)"
    url: https://10statesstandards.com/about.html
    verified: 2026-05-06
---

> **TL;DR**
> 1. The "Ten States Standards" is the Recommended Standards for Wastewater Facilities published by the **Great Lakes–Upper Mississippi River Board (GLUMRB)**. It is the baseline design standard for sanitary sewers and wastewater treatment in Indiana and 9 other member states.
> 2. IDEM adopts GLUMRB recommendations as the practical minimum for construction permit review. Local utilities (Citizens Energy, Indiana American Water, municipal sewer departments) may impose stricter requirements.
> 3. Key sections for collection-system design: §11 (design flow), §33 (gravity sewers), §34 (building sewers), §38 (separation distances), §44 (manholes), §71–77 (pumping stations and force mains).
> 4. The document is updated periodically; the current wastewater edition is **2014**. Always confirm the edition IDEM is reviewing against — editions do not retroactively apply to permitted systems.

## What GLUMRB is

The Great Lakes–Upper Mississippi River Board of State and Provincial Public Health and Environmental Managers (GLUMRB) is a collaborative body whose membership includes the state drinking water and wastewater regulatory agencies of Illinois, Indiana, Iowa, Michigan, Minnesota, Missouri, New York, Ohio, Pennsylvania, Wisconsin, and the Canadian province of Ontario. GLUMRB publishes two sets of recommended standards:

- **Recommended Standards for Water Works** (the "water" Ten States Standards) — see [Ten States Standards (water)](../water-distribution/ten-states-standards-water.md).
- **Recommended Standards for Wastewater Facilities** (the "wastewater" Ten States Standards) — the subject of this page.

The standards are recommendations, not regulations. Each member state adopts them by reference in its own administrative code or permit program. Indiana adopts them through the IDEM construction permit review process under 327 IAC 3-2.

## How Indiana uses the wastewater standards

IDEM's Office of Water Quality reviews plans for new or modified wastewater collection systems, lift stations, and treatment plants. The review engineer evaluates the design against the current edition of the Recommended Standards for Wastewater Facilities. Where the standards give a range (e.g., minimum pipe slope), IDEM interprets them conservatively unless the designer provides supporting calculations for a deviation.

Local utilities add their own requirements on top of Ten States. Common Indiana additions:

- **Citizens Energy (Indianapolis / Marion County)** — publishes its own "Construction Standards and Specifications" which reference Ten States but add material specifications, construction details, and testing requirements.
- **Carmel, Westfield, Fishers, Noblesville** — each city's engineering design manual layers additional slope, manhole, and testing requirements on the Ten States baseline.
- **Indiana American Water (IWW)** — private utility serving multiple Indiana systems; publishes "Standards and Specifications for Sewer Construction" which align with Ten States but specify preferred products and testing protocols.

When a project must satisfy both IDEM and a local utility, the more restrictive standard governs.

## Key sections for collection-system design

### §11 — Design basis

- Minimum average daily flow: 100 gpd per capita (§11.11).
- Peaking factors: published curve, plus Babbitt and Harmon formulas as acceptable methods (§11.232).
- Infiltration allowance: 200 gpd per inch-diameter per mile for new sewers (§11.24).

### §33 — Gravity sewers

- Minimum diameter: 8 in for public mains (§33.3).
- Minimum slope: must produce 2.0 ft/s at design flow, with a table of minimum slopes for common diameters at n = 0.013 (§33.4).
- Manning n for design: 0.013 for PVC and concrete pipe — a regulatory floor regardless of the manufacturer's published hydraulic n.
- Maximum slope: no numeric cap, but slopes exceeding 10% require anchor blocks (§33.81).
- Pipe material: must meet ASTM standards; SDR-35 PVC, reinforced concrete, and ductile iron are the common choices.

### §34 — Building sewers (service laterals)

- Minimum diameter: 4 in (§34.1).
- Minimum slope: 1/4 in per ft (2.0%) for 4-in laterals; 1/8 in per ft (1.0%) for 6-in and larger (§34.2).
- Connection: watertight joint at the main — saddle or wye (§34.4).

### §38 — Separation from water mains

- **Horizontal**: 10 ft clear between the outside walls of the sewer and the water main.
- **Vertical**: where a sewer crosses a water main, the water main must be above the sewer with 18 in of vertical clearance between the outside walls. If the sewer must be above, it must be encased in concrete or steel for a distance of 10 ft on each side of the crossing.
- These distances are mirrored in IDEM 327 IAC 8-3.2 and in most Indiana utility standards.

### §44 — Manholes

- Spacing: 400 ft max for sewers 15 in and smaller; 500 ft for 18 in to 30 in (§44.2).
- Diameter: 48 in minimum for 8-in to 15-in mains.
- Drop connections: required when incoming invert is 24 in or more above outgoing invert (§44.3).
- Benching: flow channels from incoming inverts to outgoing invert, with the bench surface sloped to drain (§44.5).

### §71–77 — Pumping stations and force mains

- Firm capacity: station handles peak flow with the largest pump out of service (§72.41).
- Force main minimum diameter: 4 in (§72.3).
- Force main velocity: 2.0 ft/s minimum, 8.0 ft/s maximum (§72.31).
- Backup power: alternative power source required (§72.6).
- Alarm and telemetry: high-water, pump-failure, and power-failure alarms required (§72.7).
- Air release valves at high points in force mains (§72.3).

## Deviations

IDEM will accept designs that deviate from Ten States if the designer provides a written justification supported by calculations, modeling, or local data. Common deviations:

- **Lower Manning n** — using 0.009 or 0.010 for PVC pipe instead of 0.013. Accepted only with IDEM approval and only for pipes in excellent condition (new, well-bedded, tested). Not accepted for long-term capacity analysis.
- **Reduced I/I allowance** — for systems with modern PVC pipe and gasketed manholes, some utilities accept 100 gpd/in-dia/mi instead of 200. Requires justification from flow monitoring data.
- **Extended manhole spacing** — laser-aligned PVC mains with fully gasketed joints may be allowed at 500 ft spacing for 8-in to 15-in mains if the utility has a compatible cleaning and inspection program.

Document any deviation in the engineering report submitted with the construction permit application.

## Common review issues

- Plans cite an outdated edition of the standards (e.g., 2004 instead of 2014) — use the current edition.
- Local utility standard conflicts with Ten States and the design follows the less restrictive — always apply the more restrictive.
- Separation from water mains is 8 ft instead of 10 ft — fail per §38 unless a variance is justified and encasement is provided.
- Plans do not reference the standards at all — include a note on the cover sheet identifying the design standards.

## Related

- [Flow estimation](flow-estimation.md)
- [Pipe sizing and slopes](pipe-sizing-and-slopes.md)
- [Manhole design](manhole-design.md)
- [Drop manholes](drop-manholes.md)
- [Force mains and lift stations](force-mains-and-lift-stations.md)
- [Service connections](service-connections.md)
- [Ten States Standards (water)](../water-distribution/ten-states-standards-water.md)
