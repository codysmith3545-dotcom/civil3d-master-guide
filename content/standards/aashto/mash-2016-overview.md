---
title: "MASH 2016 Overview"
section: standards/aashto
order: 30
visibility: public
tags: [aashto, mash, crash-test, roadside-hardware, barrier]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "AASHTO, Manual for Assessing Safety Hardware (MASH), 2nd Edition (2016)"
    url: "https://store.transportation.org/Item/CollectionDetail?ID=152"
    citation: "AASHTO MASH 2016"
    verified: 2026-05-11
  - title: "FHWA, Roadside Hardware Eligibility Letters"
    url: "https://highways.dot.gov/safety/roadway-departure/policy-guidance/eligibility-letters"
    citation: "FHWA eligibility list"
    verified: 2026-05-11
license: "summary only — original AASHTO publication is copyrighted (FHWA letters are public)"
---

> **TL;DR**
> 1. The AASHTO *Manual for Assessing Safety Hardware* (MASH), 2nd Edition (2016), is the current crash-test standard for longitudinal barriers, terminals, crash cushions, breakaway sign supports, and work-zone devices on the U.S. National Highway System.
> 2. MASH replaced NCHRP Report 350; the AASHTO/FHWA implementation agreement set sunset dates for NCHRP-350-only hardware, with full transition to MASH for new installations completed by Dec 31, 2019 for most categories.
> 3. MASH defines six test levels (TL-1 through TL-6) using a heavier passenger pickup (2270P) than NCHRP 350 used (2000P) — hardware tested only under NCHRP 350 generally must be retested to MASH for continued eligibility on federal-aid projects.

## What AASHTO says

MASH establishes uniform crash-test procedures, evaluation criteria, and reporting for permanent and temporary roadside safety hardware. It does not specify when to install hardware (that is in the [Roadside Design Guide](roadside-design-guide-summary.md)); it specifies how the hardware must perform when struck.

**Test levels.** MASH defines six test levels for longitudinal barriers, terminals, and crash cushions:

- TL-1: 31 mph (50 km/h) — low-speed work zones.
- TL-2: 44 mph (70 km/h) — local roads, work zones on higher-speed roads.
- TL-3: 62 mph (100 km/h) — most rural arterials and freeways with passenger vehicles and pickups.
- TL-4: 56 mph (90 km/h) — TL-3 plus a single-unit truck.
- TL-5: 50 mph (80 km/h) — TL-4 plus a tractor-van trailer (80,000 lb).
- TL-6: 50 mph (80 km/h) — TL-5 with a tractor-tank trailer.

Each test level requires impacts at multiple angles by multiple test vehicles. Evaluation criteria cover structural adequacy of the device, occupant risk (occupant impact velocity, occupant ridedown acceleration), and post-impact vehicle trajectory.

**Test vehicles.** MASH uses a 1100C small car (1100 kg, 2425 lb), a 2270P pickup (2270 kg, 5000 lb), an 8000S single-unit truck, a 36000V van trailer combination, and a 36000T tank trailer combination.

**Implementation.** The 2016 AASHTO/FHWA implementation agreement set transition deadlines: w-beam guardrail and cast-in-place concrete barriers had to be MASH-tested for new installations beginning in 2018; cable barriers, transitions, terminals, and crash cushions in 2019; sign supports and work-zone devices on rolling deadlines. Hardware previously installed under NCHRP 350 may remain in place but is replaced with MASH-eligible hardware on reconstruction.

## Key formulas / variables

MASH is a test protocol rather than an equation. The two principal occupant-risk metrics it computes from accelerometer data are:

- **Occupant impact velocity (OIV):** computed using the flail-space model; longitudinal and lateral OIV must be below specified limits (12 m/s preferred, 16 m/s maximum).
- **Occupant ridedown acceleration (ORA):** post-impact acceleration after the hypothetical occupant impacts the vehicle interior; must be below 20.49 g preferred / 20.49 g maximum (longitudinal and lateral).

## Common Civil 3D applications

- Specify hardware by FHWA eligibility letter number on detail callouts; the FHWA letter cites the MASH test level and date of acceptance.
- Build standard barrier and terminal subassemblies that match the manufacturer's installation drawings; verify post spacing, height, and toe condition against the eligibility letter.

## What this guide can't reproduce

MASH itself is copyrighted by AASHTO. The FHWA roadside hardware eligibility letters are public — every accepted MASH device has a downloadable PDF letter on the FHWA Office of Safety website. Use the eligibility letter as the spec reference on plans.

## Related Indiana standards

- INDOT specifies acceptable barrier and terminal hardware in the Standard Drawings and Recurring Special Provisions; see [INDOT standard drawings](../state-dot/indot-standard-drawings.md).
