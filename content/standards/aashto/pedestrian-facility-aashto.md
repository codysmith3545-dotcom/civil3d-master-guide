---
title: "AASHTO Guide for the Planning, Design, and Operation of Pedestrian Facilities"
section: standards/aashto
order: 32
visibility: public
tags: [aashto, pedestrian, sidewalk, crosswalk, ada, multimodal, geometric-design]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "AASHTO, Guide for the Planning, Design, and Operation of Pedestrian Facilities, 2nd Edition (2021)"
    url: "https://store.transportation.org/Item/CollectionDetail?ID=212"
    citation: "AASHTO Pedestrian Guide 2e (2021)"
    verified: 2026-05-11
  - title: "U.S. Access Board, Public Right-of-Way Accessibility Guidelines (PROWAG) Final Rule (2023)"
    url: "https://www.access-board.gov/prowag/"
    citation: "PROWAG 2023"
    verified: 2026-05-11
license: "summary only — original AASHTO publication is copyrighted (PROWAG is public)"
---

> **TL;DR**
> 1. The AASHTO *Guide for the Planning, Design, and Operation of Pedestrian Facilities*, 2nd Edition (2021), is the geometric-design reference for sidewalks, crosswalks, curb ramps, pedestrian refuge islands, and pedestrian signal treatments.
> 2. Federal accessibility requirements come from the U.S. Access Board's Public Right-of-Way Accessibility Guidelines (PROWAG), which became enforceable as of the 2023 final rule and supersede prior ADAAG-based public-right-of-way guidance.
> 3. Sidewalk widths typically start at 5 ft clear (4 ft absolute minimum with 5 ft passing intervals); cross slope is bounded at 2 percent maximum and running slope generally follows the adjacent street, with constraints when the running grade exceeds 5 percent (it is then a ramp under PROWAG).

## What AASHTO says

The AASHTO Pedestrian Guide is the design counterpart to the [Bike Guide](bicycle-facility-aashto.md) for walking facilities. It addresses planning (network connectivity, level-of-service for pedestrians), geometric design (sidewalk, crosswalk, refuge island), and operations (signal timing, school zones, work zones).

**Sidewalk.** Continuous, accessible, and free of obstructions. The Guide recommends 5 ft of clear width (referred to as the *pedestrian clear zone* or *through zone*) on local and collector streets, 6 to 8 ft on arterials and commercial streets, and wider in high-volume pedestrian areas. The full sidewalk corridor includes the frontage zone (against buildings), the through zone, the furniture/curb zone (street trees, light poles, signs, transit stops), and the curb itself. Buffer between pedestrians and motor-vehicle traffic is provided by the furniture zone or by on-street parking.

**Crosswalk.** Marked at signalized intersections and at uncontrolled crossings that meet warrants. Marking patterns include transverse (two parallel lines), continental (longitudinal bars), and ladder. Continental and ladder markings are more visible to drivers and are increasingly preferred at uncontrolled locations. Crosswalk skew should be minimized to keep crossing distance short.

**Curb ramp.** Required on every leg of every intersection where pedestrians are permitted. PROWAG sets the maximum running slope (8.33 percent on a perpendicular ramp), maximum cross slope (2 percent), maximum counterslope at the gutter (5 percent), and detectable warning surface dimensions and contrast. Single-direction perpendicular ramps are preferred over diagonal ramps.

**Pedestrian refuge island.** A raised island in the median that lets a pedestrian cross one direction of traffic at a time. Useful on streets wider than approximately 60 ft or with high motor-vehicle volumes. Minimum 6 ft wide (preferably 8 to 10 ft) to accommodate a person with a stroller or wheelchair plus a bicyclist.

**Signal treatments.** Pedestrian signal heads, push buttons within reach (per PROWAG), accessible pedestrian signals (audible and vibrotactile) at signalized crossings, leading pedestrian intervals (LPI) of 3 to 7 s, and protected pedestrian phases at locations with frequent right-turn or left-turn conflicts.

## Key formulas / variables

- **Pedestrian crossing time:** `t_ped = 3.2 + (W_c / 3.5) + adjustments`, where `W_c` is crossing distance in ft and `3.5 ft/s` is the assumed walking speed (PROWAG and the MUTCD; older guidance used `4 ft/s` and is no longer current).
- **Sight distance to pedestrian crossing:** at uncontrolled crossings, the AASHTO Guide and the FHWA Pedestrian Hybrid Beacon (PHB) guidance give an approach sight distance based on the motor-vehicle stopping sight distance plus a perception buffer.

## Common Civil 3D applications

- Build sidewalks and curb ramps as feature-line / grading objects; verify cross slope and running slope against PROWAG with surface analysis (slope-banding).
- Use pressure pipes / structures or feature lines to lay out crosswalk markings on plan-production sheets.
- Validate corner-radius selection against pedestrian crossing distance: tighter curb returns shorten the crossing and slow turning vehicles.

## What this guide can't reproduce

AASHTO Pedestrian Guide tables and figures are copyrighted. PROWAG is a U.S. government work and is fully public — link above. The FHWA Pedestrian Safety Guide and Countermeasure Selection System (PEDSAFE) is also open-access.

## Related Indiana standards

- INDOT IDM Part 4 includes pedestrian-facility chapters. ADA / PROWAG transition plans are required of all Indiana public agencies that maintain rights-of-way. See [ADA and accessibility](../../engineering/ada-and-accessibility/index.md) and [INDOT IDM chapter map](../state-dot/indot-idm-chapter-map.md).
