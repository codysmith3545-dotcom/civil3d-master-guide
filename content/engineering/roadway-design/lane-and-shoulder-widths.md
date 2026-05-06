---
title: "Lane and Shoulder Widths"
section: "engineering/roadway-design"
order: 15
visibility: public
tags: [lane-width, shoulder-width, cross-section, aashto, bicycle-lane, shared-use-path]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateAssembly, EditAssemblyProperties, CreateCorridor]
updated: 2026-05-06
sources:
  - title: "AASHTO A Policy on Geometric Design of Highways and Streets (Green Book), 7th ed., 2018, §4"
    url: https://store.transportation.org/Item/CollectionDetail?ID=180
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 45 (Cross Sections)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
  - title: "AASHTO Guide for the Development of Bicycle Facilities, 4th ed., 2012"
    url: https://store.transportation.org/Item/CollectionDetail?ID=116
    verified: 2026-05-06
---

> **TL;DR**
> 1. Standard travel lane width is **12 ft** on arterials and freeways, **11 ft** on collectors, and **10-11 ft** on low-speed local streets. Narrower lanes reduce speeds but require justification.
> 2. Paved shoulder widths range from **2 ft** (local) to **10-12 ft** (freeway/arterial) depending on functional class, traffic volume, and truck percentage.
> 3. Bicycle lanes are typically **5-7 ft** (one-way) or **10-12 ft** (shared-use path); INDOT minimum bike lane width is **5 ft** with a 4 ft minimum clear width.

## Travel lane widths

AASHTO Green Book Chapter 4 establishes lane widths by functional classification and design speed. The values below are the predominant national practice:

| Functional class | Design speed | Typical lane width |
|---|---|---|
| Interstate / freeway | 55-75 mph | 12 ft |
| Principal arterial | 45-55 mph | 12 ft |
| Minor arterial | 35-45 mph | 11-12 ft |
| Major collector (rural) | 40-55 mph | 11-12 ft |
| Minor collector | 30-40 mph | 10-11 ft |
| Local residential | 25-30 mph | 10-11 ft |

Narrowing lanes below 12 ft is a deliberate speed-management tool on urban streets. FHWA research shows that 10 ft lanes adequately serve traffic at speeds below 35 mph and low truck volumes. Where SU or WB-67 design vehicles are expected, 11 ft is the practical minimum even at low speeds.

INDOT IDM Chapter 45 requires 12 ft travel lanes on all state routes regardless of speed, with 11 ft allowed only on low-volume collectors with design speed under 45 mph and documented low truck percentage.

## Shoulder widths

Shoulders serve three functions: structural edge support, emergency stop/pull-off, and lateral clearance for shy-line offset. AASHTO minimums by functional class:

| Facility | Paved shoulder (right) | Unpaved shoulder | Median/left shoulder |
|---|---|---|---|
| Rural freeway | 10 ft | -- | 4-10 ft |
| Rural arterial (2-lane) | 6-8 ft | 2-4 ft (beyond paved) | -- |
| Rural collector | 4-6 ft | 2-4 ft | -- |
| Urban arterial (curbed) | 0-2 ft (gutter) | -- | 2-4 ft |
| Local residential (curbed) | 0 ft (curb/gutter) | -- | -- |

INDOT requires a minimum 6 ft paved shoulder on state routes with ADT over 2,000 and a minimum 4 ft for ADT under 2,000. Where shoulders serve as bicycle accommodation, the paved width increases to at least 5 ft (measured from the white edge line to the edge of pavement, not the rumble strip).

## Shoulder slopes

- **Paved shoulders:** 2% to 6% cross-slope (typically 4% per INDOT).
- **Unpaved shoulders (turf/gravel):** 6% to 8%, sloping away from the travel lane.
- On superelevated curves, the high-side shoulder may match the travel lane slope; the low-side shoulder drains to the outside with at least 2% differential.

## Bicycle lanes

AASHTO's Guide for the Development of Bicycle Facilities (4th ed.) and NACTO Urban Bikeway Design Guide set the practice:

| Facility type | Width | Notes |
|---|---|---|
| Conventional bike lane (one-way) | 5-7 ft | 5 ft minimum, 7 ft desirable adjacent to parking |
| Buffered bike lane | 5 ft lane + 2-3 ft buffer | Painted buffer between travel lane and bike lane |
| Separated (protected) bike lane | 5-7 ft | Physical barrier (curb, posts, planter) |
| Shared-use path (two-way) | 10-12 ft | 10 ft minimum, 12 ft preferred for high volume |
| Paved shoulder (bike use) | 5 ft minimum | Measured clear of rumble strip slots |

INDOT standard for shared-use paths along state routes is 10 ft minimum width with 2 ft graded shoulders on each side. Where paths cross driveways or side streets, the path surface must be maintained at grade with the driveway ramping down to meet it, not the reverse.

## Civil 3D implementation

Lane and shoulder widths are defined by **subassemblies** within an assembly. The typical approach:

1. Insert a `LaneSuperelevationAOR` or `LaneOutsideSuperWithWidening` subassembly for each travel lane. Set the `Width` and `DefaultSlope` parameters.
2. Add `ShoulderSubassemblyName` for paved shoulder with appropriate width and slope.
3. Use `BasicSideSlopeCutDitch` or similar for unpaved shoulder/ditch.
4. Apply the assembly to a corridor, then use **corridor targets** to vary widths along the alignment if the cross section changes.

For bicycle lanes, add a separate subassembly or use a `GenericPavementStructure` subassembly set to the bike lane width. This keeps the bike lane as a distinct corridor region for quantity takeoff.

## Related

- [AASHTO design controls](aashto-design-controls.md)
- [Cross slope](cross-slope.md)
- [Superelevation](superelevation.md)
- [Horizontal curve design](horizontal-curve-design.md)
