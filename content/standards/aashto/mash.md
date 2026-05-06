---
title: "AASHTO MASH — Manual for Assessing Safety Hardware"
section: "standards/aashto"
order: 50
visibility: public
tags: [aashto, mash, crash-testing, barrier]
updated: 2026-05-06
sources:
  - title: "AASHTO, Manual for Assessing Safety Hardware, 2nd ed. (2016)"
    url: https://store.transportation.org/
    verified: 2026-05-06
  - title: "FHWA MASH Implementation"
    url: https://highways.dot.gov/safety/roadway-departure/mash
    verified: 2026-05-06
  - title: "FHWA Eligibility Letters for Roadside Hardware"
    url: https://highways.dot.gov/safety/roadway-departure/roadside-hardware/federal-aid-reimbursement-eligibility
    verified: 2026-05-06
---

> **TL;DR**
> 1. MASH is the **national crash-test standard** for roadside safety hardware (guardrail, terminals, barriers, crash cushions, sign supports, work-zone devices). It replaced NCHRP Report 350 and uses heavier test vehicles and updated evaluation criteria.
> 2. MASH defines **six test levels (TL-1 through TL-6)** based on vehicle type and impact speed. Most state highway work specifies **TL-3** (2,420 lb (1,100 kg) pickup truck at 62 mph (100 km/h)).
> 3. FHWA requires all new installations and replacements on the National Highway System to use **MASH-eligible** hardware. Products must have an FHWA eligibility letter; check the current list before specifying.

## What MASH is

The *Manual for Assessing Safety Hardware* (MASH) is published jointly by AASHTO and the Federal Highway Administration (FHWA). It establishes the crash-test procedures, test vehicles, impact conditions, and evaluation criteria that roadside hardware must satisfy before it can be used on federal-aid highway projects.

MASH is the successor to NCHRP Report 350 (*Recommended Procedures for the Safety Performance Evaluation of Highway Features*, 1993). The current edition is the 2nd edition (2016). MASH is copyrighted by AASHTO and sold through the [AASHTO Bookstore](obtaining-aashto.md). This page summarizes structure and application; it does not reproduce test matrices or evaluation criteria.

## MASH vs. NCHRP Report 350

Key differences between MASH and NCHRP 350:

| Feature | NCHRP 350 (1993) | MASH (2009, 2nd ed. 2016) |
|---|---|---|
| Passenger-car test vehicle | 1,800 lb (820 kg) small car | 2,420 lb (1,100 kg) small car (reflects modern vehicle fleet) |
| Pickup-truck test vehicle | 4,400 lb (2,000 kg) | 5,000 lb (2,270 kg) |
| Vehicle models | Older sedans, pickups | Current production vehicles (updated periodically) |
| Evaluation criteria | Occupant risk, vehicle trajectory, structural adequacy | Same categories with updated thresholds; added preferable/acceptable/marginal ratings |
| Work-zone devices | Limited coverage | Expanded test matrix for temporary barriers, channelizers, truck-mounted attenuators |

The heavier test vehicles in MASH mean that some hardware that passed NCHRP 350 cannot pass MASH testing. Products must be retested or redesigned.

## Test levels

MASH defines six test levels, each representing a different combination of vehicle mass and impact speed:

| Test Level | Vehicle | Mass | Speed | Typical application |
|---|---|---|---|---|
| TL-1 | Passenger car and pickup | 2,420 lb / 5,000 lb (1,100 kg / 2,270 kg) | 31 mph (50 km/h) | Low-speed local roads, work zones |
| TL-2 | Passenger car and pickup | 2,420 lb / 5,000 lb | 44 mph (70 km/h) | Collector roads, moderate-speed work zones |
| TL-3 | Passenger car and pickup | 2,420 lb / 5,000 lb | 62 mph (100 km/h) | Most state highways, freeways (standard) |
| TL-4 | Passenger car, pickup, and single-unit truck | 2,420 lb / 5,000 lb / 22,000 lb (10,000 kg) | 62 mph (100 km/h) | High-truck-volume routes, bridge rails |
| TL-5 | Passenger car, pickup, and tractor-van trailer | 2,420 lb / 5,000 lb / 79,300 lb (36,000 kg) | 50 mph (80 km/h) | Critical locations, bridge rails on high-ADT interstates |
| TL-6 | Passenger car, pickup, and tractor-tanker trailer | 2,420 lb / 5,000 lb / 79,300 lb (36,000 kg) | 50 mph (80 km/h) | High-consequence locations (e.g., adjacent to fuel storage) |

Most guardrail, median barrier, and terminal hardware for typical state highway projects is tested and specified at **TL-3**. Bridge rails on the National Highway System are typically TL-4 or TL-5 depending on ADT and truck percentage.

## FHWA adoption timeline

FHWA implemented MASH in phases:

- **December 31, 2019:** All new permanent installations on the NHS must use MASH-compliant hardware. NCHRP-350-only hardware may no longer be installed as new construction.
- **Existing in-place hardware:** NCHRP 350 hardware already installed may remain in service. In-kind replacement of damaged NCHRP 350 hardware with the same product is permitted if the product is still manufactured, but state DOTs are encouraged to upgrade to MASH hardware at replacement.
- **Work-zone devices:** FHWA set a phased schedule for work-zone hardware (temporary barriers, truck-mounted attenuators). Verify current effective dates at the FHWA link above, as some categories had extended phase-in periods.

State DOTs may adopt MASH earlier or set stricter requirements. INDOT's standard specifications and approved-products list reflect the current MASH requirements for Indiana projects — verify against the [INDOT IDM](../../jurisdictions/indiana/state/indot-idm-chapter-map.md) and INDOT's current approved-materials list.

## Specifying MASH-compliant hardware

When specifying guardrail, terminals, barriers, or crash cushions:

1. **Check the FHWA eligibility letter list.** FHWA issues eligibility letters for products that have been crash-tested and meet MASH criteria. The list is published at the FHWA link above and updated as new products are tested. Only products with a current eligibility letter are eligible for federal-aid reimbursement.
2. **Match the test level to the project.** Specify TL-3 for most highway applications. Specify TL-4 or higher for bridge rails and locations with high truck volumes. Specify TL-1 or TL-2 for low-speed or temporary applications where the full TL-3 test is not warranted.
3. **Check the state's approved-products list.** Some state DOTs maintain their own approved-products lists that may be more restrictive than the FHWA list.
4. **Verify deflection.** MASH reports the dynamic deflection (the maximum lateral movement of the barrier during impact). If there is limited space behind the barrier (e.g., a bridge pier or steep drop-off), the deflection must be less than the available space. Rigid barriers (concrete) have zero deflection; semi-rigid barriers (W-beam) have moderate deflection; flexible barriers (cable) have the most.

## Significance for Civil 3D design

In Civil 3D, barrier and guardrail placement is typically part of the corridor or plan-production workflow:

- **Clear-zone analysis** (from the [Roadside Design Guide](roadside-design-guide.md)) determines whether a barrier is warranted.
- **Barrier offset from edge of travel way** is set per the Roadside Design Guide and the state design manual.
- **Length of need** for guardrail is computed from the AASHTO Roadside Design Guide formulas.
- **Terminal selection** depends on the MASH test level and the available offset.

The MASH test level does not change the geometric layout in Civil 3D, but it determines which products appear in the specifications and detail sheets.

## Related

- [Roadside Design Guide overview](roadside-design-guide.md)
- [Green Book overview](green-book-overview.md)
- [INDOT IDM chapter map](../../jurisdictions/indiana/state/indot-idm-chapter-map.md)
- [Obtaining AASHTO publications](obtaining-aashto.md)
