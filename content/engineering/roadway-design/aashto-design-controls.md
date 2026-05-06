---
title: "AASHTO Design Controls"
section: "engineering/roadway-design"
order: 20
visibility: public
tags: [aashto, design-speed, functional-class, design-vehicle, los, geometric-design]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateAlignment, EditAlignmentDesignChecks]
relatedCalculators: [design-speed]
jurisdictionRefs: [indiana/state/indot]
updated: 2026-05-06
sources:
  - title: "AASHTO A Policy on Geometric Design of Highways and Streets (Green Book), 7th ed., 2018, §1 and §3"
    url: https://store.transportation.org/Item/CollectionDetail?ID=180
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 40 (Design Controls)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
  - title: "Highway Capacity Manual (HCM), 7th ed., TRB"
    url: https://www.trb.org/Main/Blurbs/180345.aspx
    verified: 2026-05-06
---

> **TL;DR**
> 1. Roadway geometric design starts with **functional class** (arterial, collector, local) and the federal-aid system, which set context, then **design speed**, **design vehicle**, and target **level of service (LOS)** drive every element below — lane width, radius, K-value, sight distance.
> 2. Pick design speed from the project's intended operating speed plus a margin; AASHTO Green Book §3.2 requires that no element drop below the design speed's geometric requirements.
> 3. Design vehicle (P, SU, WB-40, WB-67, BUS-40, etc.) governs turning radii, intersection corner design, and lane widths. Pick the largest expected vehicle that uses the facility regularly, not just the legal maximum.
> 4. LOS targets are typically C or D for design year (urban) and B or C (rural) per AASHTO and FHWA practice; INDOT IDM Chapter 40 sets the state-specific defaults.

## Functional classification

Functional class is the first decision because it determines context, federal-aid eligibility, and the AASHTO design tables that apply. The hierarchy:

- **Principal arterials** — interstates, freeways, and other through routes. Mobility-focused, full or limited access control.
- **Minor arterials** — major streets connecting communities; partial access control.
- **Collectors** — collect from local streets and feed arterials; may be major (urban) or minor (rural).
- **Local roads / streets** — direct land access, low volume, low speed.

Most Indiana counties and cities adopt the FHWA / INDOT functional class map; the same project might be a local road in the city and an urban collector once it crosses into INDOT jurisdiction. Confirm the classification on the official map before sizing the cross section.

## Design speed

Design speed is "a selected speed used to determine the various geometric design features of the roadway" (AASHTO Green Book §3.2.1). It is not the speed limit — it is the speed at which the geometry will safely accommodate a driver. Common pairings:

| Functional class | Typical design speed (mph) |
|---|---|
| Local residential street | 25 to 30 |
| Local commercial / collector | 30 to 35 |
| Urban minor arterial | 35 to 45 |
| Urban principal arterial | 45 to 55 |
| Rural collector | 45 to 55 |
| Rural arterial (two-lane) | 55 to 65 |
| Rural freeway / interstate | 65 to 75 |

Design speed is typically the posted speed plus 5 mph (urban) or up to 10 mph (rural). The 85th-percentile operating speed is the calibration target — if the geometry produces an 85th-percentile speed materially above the design speed, the geometry is undersized for the actual driver behavior.

## Design vehicle

AASHTO Green Book §2.1 catalogs design vehicles by their turning paths. Common ones:

- **P** — passenger car. Used for residential drives and tight private streets only.
- **SU-30 / SU-40** — single-unit truck. School buses, delivery trucks, fire apparatus.
- **BUS-40, BUS-45** — intercity bus.
- **WB-40, WB-50** — semitrailer combinations (older standards).
- **WB-62 (WB-67)** — current standard tractor-semitrailer; the design vehicle for almost all arterials and collectors.
- **WB-92 (WB-109D)** — double-trailer combinations; required at major freight terminals and interstate interchanges.

Pick the largest vehicle expected to use the facility on a routine basis. A residential subdivision with a fire station nearby still needs SU-40 or larger turning at every intersection, even if WB-67 trucks never enter. Civil 3D's intersection wizard and the AutoTurn add-in compute swept paths for each vehicle.

## Level of service

LOS is a qualitative scale (A through F) of operational performance — speed, density, delay, queue length — defined in the Highway Capacity Manual. Design targets typical of AASHTO and INDOT practice:

| Facility | Rural LOS target | Urban LOS target |
|---|---|---|
| Freeway | B | C |
| Multilane highway | B | C |
| Two-lane highway | C | D |
| Arterial | C | D |
| Signalized intersection | C | D |

LOS analysis is most important at design year (typically 20 years out), at the peak hour, and at signalized intersections. INDOT requires LOS analysis with HCS or Synchro for new signals on state routes.

## Design year and traffic volumes

Geometric design is sized for traffic predicted at the design year, typically 20 years past opening. Required volumes:

- **AADT** (annual average daily traffic) — for cross-section adequacy.
- **DHV** (design hourly volume, 30th highest hour, often expressed as K × AADT with K in the 0.08 to 0.12 range) — for capacity and LOS.
- **Directional split (D)** — peak direction during DHV.
- **Truck percentage (T)** — affects capacity and pavement design.

INDOT IDM Chapter 40 publishes K and D defaults for state routes; for local-agency projects use locally collected counts when possible.

## AASHTO design controls — the minimums

Each element below has a minimum tied to design speed:

- **Lane width** — 10 to 12 ft (12 ft on arterials and high-speed roads; narrower on low-speed local streets).
- **Shoulder width** — 2 to 12 ft depending on functional class and design speed.
- **Stopping sight distance (SSD)** — see [Sight Distance](sight-distance.md).
- **Horizontal radius** — minimum tied to e_max and design speed; see [Horizontal Curve Design](horizontal-curve-design.md).
- **Vertical curve K** — tied to design speed; see [Vertical Curve Design](vertical-curve-design.md).
- **Cross slope** — 1.5% to 2% on tangent travel lanes; 2% to 6% on shoulders.
- **Maximum grade** — 5% to 12% depending on functional class, terrain, and design speed.

The AASHTO Green Book publishes the controlling tables in §3 (vertical), §3 (horizontal), and §3 (sight distance). They are licensed material — cite the table by section and number rather than republishing the values here.

## INDOT modifications

INDOT IDM Chapter 40 picks a design year, K, D, T, design speed, and design vehicle for state-route projects. For local-agency projects following INDOT design (LPA program), the same chapter applies. Indiana cities and counties may have stricter local standards (Carmel and Indianapolis, for example, set higher pedestrian and bicycle accommodations on arterials than the AASHTO minimums).

## Common review issues

- Design speed not stated on the cover sheet.
- Design vehicle not identified — fire apparatus access does not work.
- LOS analysis run for opening year only, not design year.
- Functional class assumed rather than confirmed against the official map.
- Lane width selected ad hoc rather than tied to design speed and functional class.

## Related

- [Sight distance](sight-distance.md)
- [Horizontal curve design](horizontal-curve-design.md)
- [Vertical curve design](vertical-curve-design.md)
- [Superelevation](superelevation.md)
- [INDOT Indiana Design Manual](../../jurisdictions/indiana/state/index.md)
