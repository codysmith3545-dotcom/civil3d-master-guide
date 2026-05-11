---
title: "AASHTO Sight Distance Types (SSD, PSD, DSD, ISD)"
section: standards/aashto
order: 24
visibility: public
tags: [aashto, sight-distance, ssd, psd, dsd, isd, geometric-design]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "AASHTO, A Policy on Geometric Design of Highways and Streets, 7th Edition (2018), Chapter 3"
    url: "https://store.transportation.org/Item/CollectionDetail?ID=180"
    citation: "AASHTO 2018, Sec. 3.2"
    verified: 2026-05-11
license: "summary only — original AASHTO publication is copyrighted"
---

> **TL;DR**
> 1. AASHTO recognizes four sight-distance types: stopping sight distance (SSD), passing sight distance (PSD), decision sight distance (DSD), and intersection sight distance (ISD); each has a distinct purpose and a distinct minimum value table by design speed.
> 2. SSD is the universal minimum — it must be available at every point on every road; PSD is checked only on two-lane two-way roads where passing zones are intended.
> 3. DSD applies at locations of unusual driver workload (interchange exits, lane drops, channelized intersections); ISD applies to the sight triangles at at-grade intersections.

## What AASHTO says

Sight distance is the length of roadway visible to the driver. The Green Book defines four design types in Section 3.2.

**Stopping sight distance (SSD).** The distance required to perceive an object in the road, react, and brake to a stop on a level grade. Computed from a 2.5-second perception-reaction time and a 11.2 ft/s^2 deceleration on dry pavement. Adjusted for grade. Driver eye height 3.5 ft, object height 2.0 ft.

**Passing sight distance (PSD).** The distance required for a vehicle on a two-lane two-way road to complete a normal passing maneuver. The 7th edition uses a model derived from MUTCD field studies (the Glennon/Harwood model), shorter than the legacy 6th-edition model. Driver eye height 3.5 ft, opposing vehicle height 3.5 ft.

**Decision sight distance (DSD).** The distance required to detect an unexpected condition in a visually cluttered environment, recognize the threat, select an appropriate response, and complete the maneuver. The Green Book tabulates DSD by design speed and by the type of avoidance maneuver (A through E, where A is a stop on a rural road and E is a path-and-direction change on an urban road). DSD is always longer than SSD at the same design speed.

**Intersection sight distance (ISD).** The distance along the major road that must be visible to a driver on the minor road's stop or yield bar, computed from time-to-cross-or-merge for the design vehicle. Tabulated by design speed for each intersection control case (Case A through F: no control, stop control on minor road, yield control on minor road, signal, all-way stop, left-turn from major).

## Key formulas / variables

- **SSD:** `SSD = 1.47 V t + V^2 / (30 (a/g +/- G))`, with `t = 2.5 s`, `a = 11.2 ft/s^2`, `g = 32.2 ft/s^2`, `G` decimal grade (positive uphill).
- **ISD (Case B1, stop on minor):** `ISD = 1.47 V_major t_g`, where `t_g` is the gap acceptance time tabulated by design vehicle (e.g., 7.5 s for a passenger car turning left).

## Common Civil 3D applications

- Verify SSD on the design surface using the Sight Distance Check tool. See [Sight distance](../../engineering/roadway-design/sight-distance.md).
- Encode SSD-driven `K` minimums on profile design checks. See [Profile design criteria](../../civil3d/profiles/profile-design-criteria.md).
- Plot ISD sight triangles at intersections during plan production; see [Intersection design](../../engineering/roadway-design/intersection-design.md).

## What this guide can't reproduce

The Green Book tables of SSD, PSD, DSD, and ISD by design speed (Tables 3-1, 3-4, 3-5, and the 9-x intersection tables in 7e) are copyrighted. The underlying perception-reaction time and deceleration values are policy values stated in the text and reproduced widely.

## Related Indiana standards

- INDOT IDM Part 5 references AASHTO sight-distance tables; INDOT-specific sight-distance verification procedures are in the IDM. See [INDOT IDM chapter map](../state-dot/indot-idm-chapter-map.md).
