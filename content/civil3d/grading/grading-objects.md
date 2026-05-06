---
title: "Grading Objects"
section: "civil3d/grading"
order: 20
visibility: public
tags: [grading, grading-object, criteria, projection, daylight, infill, slope]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [GradingCreate, GradingCriteriaSet, GradingVolumeTools]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Grading Objects
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-8C9D0E1F-2A3B-4C5D-6E7F-8A9B0C1D2E3F
    verified: 2026-05-06
---

> **TL;DR**
> 1. A grading object projects a slope from a **feature line baseline** to a **target** (surface, elevation, relative elevation, or distance). The result is a 3D surface region representing a cut or fill slope.
> 2. **Criteria sets** define the slope and projection rules (e.g., "3:1 cut to existing ground"). Multiple criteria can be combined on a single feature line for inside/outside grading.
> 3. Use **infill** to create a flat surface between grading objects that form a closed area — this completes pads, detention bottoms, and other level areas.

## How grading objects work

A grading object is defined by three inputs:

1. **Baseline** — a feature line (or a segment of one). The grading projects outward (or inward) from this line.
2. **Criteria** — rules that define the slope (percent, ratio, or degrees) and the projection direction (cut or fill).
3. **Target** — what the projection aims for:
   - **Surface** — project until the slope intersects a target surface (e.g., existing ground). This is daylight grading.
   - **Elevation** — project until reaching a specified elevation.
   - **Relative elevation** — project until a specified vertical distance above or below the baseline.
   - **Distance** — project a fixed horizontal distance from the baseline.

The grading object generates a triangulated surface region from the baseline to the target. Multiple grading objects combine within a grading group to form a complete grading surface.

## Creating a grading object

Command: `GradingCreate` (ribbon: Home > Create Design > Grading > Grading Creation Tools).

The Grading Creation Tools toolbar appears with:

1. **Select a grading group** — choose an existing group or create a new one (see [Grading groups](grading-groups.md)).
2. **Set the criteria set** — pick from available criteria sets.
3. **Select the feature line** — click the baseline feature line.
4. **Choose the grading side** — the projection direction (left or right of the baseline, or inside/outside for closed feature lines).
5. **Apply the criteria** — Civil 3D generates the grading object.

For closed feature lines (e.g., a building pad perimeter), you can grade both sides:

- **Outside** — cut/fill slopes projecting away from the pad to meet existing ground.
- **Inside** — typically infill (flat) at the pad elevation.

## Criteria sets

Criteria sets are collections of grading rules stored under Settings > Grading > Grading Criteria Sets in Toolspace. Each criteria set contains one or more criteria entries.

### Defining a criteria

A criteria specifies:

| Parameter | Options |
|---|---|
| Target | Surface, elevation, relative elevation, distance |
| Projection | Slope (cut or fill), grade (percent), or slope ratio (H:V) |
| Search order | Cut first, fill first, or cut/fill simultaneously |
| Conflict resolution | What happens when the projection cannot reach the target (e.g., slope is too flat to reach the surface within a reasonable distance) |

### Common criteria examples

| Criteria name | Target | Slope | Use case |
|---|---|---|---|
| Grade to Surface 3:1 | Surface (existing ground) | 3:1 (H:V) | Cut/fill slopes from pad to existing grade |
| Grade to Surface 2:1 | Surface (existing ground) | 2:1 (H:V) | Steeper slopes in constrained areas |
| Grade to Distance 10 ft at 2% | Distance (10 ft) | 2% | Sidewalk or paved area adjacent to building |
| Grade to Relative Elevation -1.5 ft | Relative elevation (-1.5 ft) | Calculated from distance | Curb reveal or step-down |

### Creating a company criteria set

1. Toolspace > Settings > Grading > Grading Criteria Sets.
2. Right-click > New.
3. Name it (e.g., "Standard Site Grading").
4. Add criteria entries for your common scenarios (3:1 cut, 3:1 fill, 4:1 cut, grade to distance, etc.).
5. Save in the office DWT template for reuse.

## Infill

Infill creates a flat (or near-flat) surface inside a closed area bounded by grading objects. Without infill, the interior of a graded pad is a hole in the surface.

To create infill:

1. Ensure grading objects completely enclose the area.
2. On the Grading Creation Tools toolbar, click **Create Infill**.
3. Click inside the enclosed area.
4. Civil 3D generates a triangulated surface at the feature line elevation.

Infill works only when:

- The enclosing grading objects all belong to the same grading group.
- The enclosing feature lines form a closed loop (all endpoints connect).
- There are no gaps between grading objects.

## Editing grading objects

After creation, modify grading objects by:

- **Changing criteria** — select the grading object > Properties > change the criteria set or individual slope values.
- **Editing the baseline feature line** — moving vertices or changing elevations on the feature line automatically updates the grading object projection.
- **Changing the target surface** — if the existing-ground surface is updated (e.g., new survey data), grading objects that project to that surface recalculate their extents.
- **Deleting and recreating** — for major changes, it is often faster to delete the grading object and recreate it with new parameters than to edit in place.

## Grading object display

Grading objects display as:

- **Projected slope faces** — triangulated surfaces showing cut and fill regions.
- **Daylight line** — the line where the projected slope meets the target surface. This is the catch line or toe/top of slope.
- **Baseline** — the feature line from which grading projects.

Styles control the display (Settings > Grading > Grading Styles). Common practice: display cut slopes in red and fill slopes in blue (or use separate styles).

## Related

- [Feature lines](feature-lines.md)
- [Feature line editing](feature-line-editing.md)
- [Grading groups](grading-groups.md)
- [Sites and feature lines](sites-and-feature-lines.md)
- [Troubleshooting grading](troubleshooting-grading.md)
