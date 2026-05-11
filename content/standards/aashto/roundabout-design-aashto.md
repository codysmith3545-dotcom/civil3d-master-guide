---
title: "AASHTO Roundabout Design"
section: standards/aashto
order: 27
visibility: public
tags: [aashto, roundabout, fastest-path, splitter-island, geometric-design]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "AASHTO, A Policy on Geometric Design of Highways and Streets, 7th Edition (2018), Chapter 9"
    url: "https://store.transportation.org/Item/CollectionDetail?ID=180"
    citation: "AASHTO 2018, Sec. 9.x (Roundabouts)"
    verified: 2026-05-11
  - title: "NCHRP Report 672 — Roundabouts: An Informational Guide, 2nd Edition (2010)"
    url: "https://nap.nationalacademies.org/catalog/22914/roundabouts-an-informational-guide-second-edition"
    citation: "TRB NCHRP 672"
    verified: 2026-05-11
license: "summary only — original AASHTO publication is copyrighted (NCHRP 672 is open-access)"
---

> **TL;DR**
> 1. Modern roundabouts (yield-on-entry, raised splitter islands, deflection-controlled approach speed) follow geometric principles in AASHTO Green Book Chapter 9 and the open-access NCHRP Report 672.
> 2. Single-lane roundabouts with inscribed circle diameter 90 to 180 ft serve up to roughly 25,000 vehicles per day; multi-lane roundabouts (180 to 220 ft+) handle higher volumes but increase pedestrian and bicycle risk.
> 3. Fastest-path analysis (R1 entry, R2 circulating, R3 exit, R4 left, R5 right) is the AASHTO/NCHRP method to verify that geometry holds approach speed at or below approximately 25 mph for single-lane and 30 mph for multi-lane.

## What AASHTO says

The Green Book treats the modern roundabout as a distinct intersection type with its own chapter section. It pulls heavily from NCHRP Report 672, which AASHTO and FHWA endorse as the supplementary technical reference. (NCHRP 672 is published by the Transportation Research Board and is open-access — link above.)

Roundabout geometry is built around five elements:

- **Inscribed circle diameter (ICD).** Outer-edge diameter of the circulatory roadway. Drives the family (mini, single-lane, multi-lane).
- **Entry width and entry radius.** Control entry capacity and approach speed. Larger entry radius increases capacity but raises speed.
- **Circulatory roadway width.** Sized for the design vehicle's swept path.
- **Splitter island.** Raised, with pedestrian cut-through, at least 50 ft long on the approach. Required to deflect entries, separate opposing traffic, and serve as pedestrian refuge.
- **Truck apron.** Mountable annular area inside the central island, paved differently from the circulatory roadway and color-contrasted, that the design truck overruns.

**Fastest-path analysis** is the design verification method. The designer draws the smoothest path a passenger car can physically follow through the roundabout, ignoring lane lines but respecting the physical edge of pavement. Five radii are measured: R1 (entry path), R2 (circulating), R3 (exit), R4 (left-turning through), R5 (right-turning). Each radius implies a speed via the point-mass equation. Geometry is iterated until the controlling radius (typically R1) yields the target approach speed.

**Deflection** is the geometric mechanism that controls speed. An entry that allows a tangential approach (high R1) lets vehicles enter at higher speeds and increases crash severity. Splitter islands and offset entries force the driver to swerve, lowering R1.

## Key formulas / variables

- **Speed from radius (point mass, design speed in mph):** `V = sqrt(15 R (e + f))`. For roundabout fastest-path, `e` is typically taken as `+ 0.02` for entry and circulating paths and `- 0.02` for exit (the cross-slope of an asphalt apron); `f` from Green Book Table 3-7 in 7e.
- **Pedestrian crossing length:** the splitter island lets pedestrians cross one direction at a time; cut-through width nominally 5 ft, ramp slopes per [ADA](../../engineering/ada-and-accessibility/index.md).

## Common Civil 3D applications

- Build the roundabout central island, truck apron, and circulatory roadway as feature lines and grading groups; use a corridor for the approach legs.
- Verify swept paths with Vehicle Tracking or AutoTURN against the design vehicle (commonly WB-67).
- See [Roundabouts](../../engineering/roadway-design/roundabouts.md).

## What this guide can't reproduce

The AASHTO Green Book roundabout figures and the design-vehicle swept-path templates are copyrighted. NCHRP Report 672 is open-access — download it free from the National Academies Press. Most state DOTs (including INDOT) maintain a roundabout-specific chapter or supplemental guidance.

## Related Indiana standards

- INDOT IDM Part 5 Chapter 51 covers roundabouts in Indiana, where modern roundabouts are widely deployed (Carmel, IN is internationally cited for its roundabout-first network policy). See [Carmel municipality page](../../jurisdictions/indiana/hamilton-county/municipalities/carmel/index.md) and [INDOT IDM chapter map](../state-dot/indot-idm-chapter-map.md).
