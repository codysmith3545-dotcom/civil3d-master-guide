---
title: "AASHTO Guide for the Development of Bicycle Facilities"
section: standards/aashto
order: 31
visibility: public
tags: [aashto, bicycle, bike-facility, multimodal, geometric-design]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "AASHTO, Guide for the Development of Bicycle Facilities, 5th Edition (2024)"
    url: "https://store.transportation.org/Item/CollectionDetail?ID=224"
    citation: "AASHTO Bike Guide 5e (2024)"
    verified: 2026-05-11
  - title: "FHWA, Bikeway Selection Guide (2019)"
    url: "https://safety.fhwa.dot.gov/ped_bike/tools_solve/docs/fhwasa18077.pdf"
    citation: "FHWA Bikeway Selection Guide"
    verified: 2026-05-11
license: "summary only — original AASHTO publication is copyrighted (FHWA Bikeway Selection Guide is public)"
---

> **TL;DR**
> 1. The AASHTO *Guide for the Development of Bicycle Facilities*, 5th Edition (2024), is the national reference for shared-use paths, bike lanes, separated bike lanes (cycle tracks), bicycle boulevards, and intersection treatments.
> 2. The 5th edition substantially expanded coverage of separated bike lanes, two-way cycle tracks, intersection treatments (bike boxes, two-stage turn queue boxes, protected signal phasing), and bicycle network connectivity.
> 3. Facility selection is informed by motor-vehicle speed and volume; the FHWA Bikeway Selection Guide (open-access) provides a decision matrix that complements the AASHTO Bike Guide.

## What AASHTO says

The AASHTO Bike Guide is the geometric-design counterpart to the Green Book for bicycle facilities. It does not establish bicycle warrants or system planning policy; it dimensions the facility once the planning decision has been made.

**Facility families.**

- **Shared roadway / wide outside lane.** No dedicated bicycle space; relies on motor-vehicle drivers to share.
- **Bike lane.** Striped, signed, on-street lane on the right side of the travel way (or median for one-way streets). Typical width 5 ft minimum (with 4 ft permitted in constrained sections), wider where adjacent to parked cars (7 to 8 ft total operating space).
- **Buffered bike lane.** Bike lane plus a striped buffer (typically 2 to 3 ft) between the bike lane and motor-vehicle traffic and/or parked cars.
- **Separated bike lane (cycle track).** Bike lane physically separated from motor-vehicle traffic by a vertical element (curb, planter, parked cars, flexible delineators). One-way or two-way.
- **Shared-use path.** Off-street, two-way, shared with pedestrians; minimum 10 ft (8 ft in constrained sections, 12 ft preferred where heavy use is expected). Vertical clearance 8 ft minimum (10 ft preferred).
- **Bicycle boulevard.** Low-volume, low-speed local street with traffic-calming and wayfinding to function as a bicycle through-route.

**Intersection treatments.** The 5e devotes substantial space to intersection geometry: bike-lane approach to signals, bike boxes, two-stage left-turn queue boxes, protected intersections (corner refuge islands), and signal timing for bicycles.

**Design vehicle.** AASHTO uses an upright adult bicyclist with handlebar height ~3.75 ft, eye height ~5 ft, and an operating envelope roughly 4 ft wide.

## Key formulas / variables

Path stopping sight distance: `SSD = (V^2 / (30 (f + G))) + 3.67 V`, where `V` is bicycle design speed in mph (typically 18 to 30 mph depending on grade), `f = 0.16` per AASHTO Bike Guide, and `G` is grade as a decimal. Adjust for downgrade.

## Common Civil 3D applications

- Add bike lane and separated bike lane subassemblies to corridor assemblies for arterials. See [Assemblies and subassemblies](../../civil3d/corridors/assemblies-and-subassemblies.md).
- Build shared-use paths as separate corridors or grading objects with their own profile.
- Verify intersection corner radii and curb returns against the bicyclist's path of travel; tight curb returns reduce turning vehicle speeds and improve bicyclist safety.

## What this guide can't reproduce

AASHTO Bike Guide tables (lane widths, path widths, separation widths, sight distance values, signal timing inputs) are copyrighted. The FHWA Bikeway Selection Guide is open-access and contains complementary decision support — link above.

## Related Indiana standards

- INDOT IDM Part 4 covers multimodal facilities including bikeways. Many Indiana municipalities (notably Indianapolis, Carmel, Bloomington) maintain their own bicycle master plans that prescribe local typologies. See [INDOT IDM chapter map](../state-dot/indot-idm-chapter-map.md).
