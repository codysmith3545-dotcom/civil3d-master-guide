---
title: "Troubleshooting Grading"
section: "civil3d/grading"
order: 90
visibility: public
tags: [grading, troubleshooting, feature-line, grading-group, site, performance]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [GradingCreate, EditFeatureLineElevations, MoveToSite]
updated: 2026-05-06
---

> **TL;DR**
> 1. Most grading problems trace to three causes: **site topology conflicts** (feature lines interacting with parcels), **elevation discontinuities** on feature lines (unexpected jumps), or **projection failures** (the grading object cannot reach its target).
> 2. Always check: Is the feature line on the correct site (or siteless)? Do all vertices have the intended elevations? Is the target surface present and correctly referenced?
> 3. For performance issues with large grading models, reduce the number of grading objects, use corridors for repetitive grading, and split complex sites into multiple drawings connected by data shortcuts.

## Grading object will not project

**Symptom:** `GradingCreate` completes but no grading object appears, or it appears partially.

**Common causes:**

- **Target surface does not exist or is not built.** If the grading criteria targets a surface (e.g., existing ground), that surface must be present and fully built in the drawing. Check Prospector > Surfaces. A surface with a yellow warning icon needs rebuilding.
- **Slope cannot reach the target.** If the target surface is above the feature line but the criteria specifies a fill slope, the projection has nowhere to go. Check that cut/fill direction matches the actual grade relationship.
- **Search distance exceeded.** Grading objects have an implicit search distance. If the slope projection extends beyond the surface boundary or beyond a reasonable distance, it may terminate early or fail. Extend the target surface boundary or adjust the criteria.
- **Feature line has zero length or overlapping vertices.** A degenerate feature line (duplicate vertices at the same location) produces no valid projection. Weed the feature line to remove duplicates.
- **Grading side is wrong.** For closed feature lines, "inside" and "outside" are determined by the feature line direction (clockwise vs counterclockwise). If the grading appears on the wrong side, reverse the feature line direction.

## Infill fails

**Symptom:** The Create Infill tool does not produce a surface, or produces a surface at the wrong elevation.

**Common causes:**

- **Grading objects do not form a closed perimeter.** Infill requires a fully enclosed area. Check for gaps between grading objects — even a small gap (fraction of a foot) prevents infill.
- **Grading objects are in different grading groups.** All enclosing grading objects must belong to the same grading group.
- **Feature line elevations are inconsistent at junctions.** If two feature lines meet at a corner but have different elevations at that point, the infill cannot determine a consistent surface. Match elevations at shared endpoints.
- **The click point is outside the enclosed area.** Click clearly inside the perimeter when creating infill.

## Volume mismatch

**Symptom:** Grading Volume Tools reports quantities that differ from those calculated by the composite surface volume method or by section-based quantity takeoff.

**Common causes:**

- **Different comparison surfaces.** Grading Volume Tools compares the grading group surface to the base surface specified in the group properties. If the composite surface volume comparison uses a different existing-ground surface (or a different version), quantities will differ.
- **Overlapping grading groups.** If multiple grading groups overlap geographically, their volume calculations double-count the overlap. Use the composite finished-grade surface for a single, consistent volume calculation.
- **Surface boundaries differ.** The grading group surface may extend beyond or fall short of the area used in the section-based calculation. Ensure the comparison areas match.

For authoritative earthwork quantities, compute volumes from the composite finished-grade surface vs existing ground using the Volumes Dashboard or section-based average end area / prismoidal methods, not individual grading-group tools.

## Feature line elevation jumps

**Symptom:** A feature line has an unexpected spike or dip in elevation at one or more vertices, causing grading objects to project incorrectly.

**Common causes:**

- **Source object had Z values.** When converting a polyline to a feature line with `CreateFeatureLineFromObject`, if the source is a 3D polyline or has Z values set, those carry over. A single vertex at Z=0 on an otherwise elevated feature line creates a spike.
- **Surface drape on an incomplete surface.** If the feature line was draped on a surface with holes (insufficient data in one area), vertices in the hole area default to 0 or interpolated garbage.
- **Manual edit error.** A vertex was accidentally moved vertically during grip editing.

**Fix:** Open the Quick Elevation Editor and review all vertex elevations. Correct outliers. Use Set Elevation by Reference > Surface to re-drape specific vertices.

## Site topology conflicts

**Symptom:** Parcels split unexpectedly, feature lines get trimmed, or grading objects behave erratically.

**Cause:** Feature lines and parcels are on the same site, causing topological interaction.

**Fix:** Move grading feature lines to a separate site or to siteless. See [Sites and feature lines](sites-and-feature-lines.md).

## Performance issues

**Symptom:** Drawing rebuilds are slow, Civil 3D hangs when editing grading objects, or the application runs out of memory.

**Common causes and mitigation:**

| Cause | Mitigation |
|---|---|
| Too many grading objects in one drawing | Split the site into multiple drawings; use data shortcuts to share the existing-ground surface. |
| Feature lines with excessive vertices | Weed feature lines to remove unnecessary vertices. Target fewer than 500 vertices per feature line. |
| Target surface is very dense | Use a simplified version of the existing-ground surface (reduce point density) as the grading target. |
| Grading group surface set to rebuild on every edit | Set the grading group surface to manual rebuild (right-click surface > Rebuild > Manual). Rebuild on demand when you need current results. |
| Many grading objects projecting to a distant surface | Reduce grading search distances. Ensure the target surface boundary tightly encloses the project area. |

## Other common issues

### Grading object detaches from feature line

If a feature line is deleted or moved to a different site, its grading objects become orphaned. Reconnect by recreating the grading objects on the new feature line.

### Daylight line is jagged

The daylight line (where the slope meets the target surface) can be jagged if the target surface is coarse. Increase the target surface density in the grading area, or smooth the daylight line after extraction.

### Grading surface contours look wrong

Check the grading group surface properties:

- Ensure surface style shows contours at the correct interval.
- Verify the surface build definition includes all grading objects (Prospector > Surfaces > the grading surface > Definition).
- Rebuild the surface if it is stale.

### Cannot select a grading object

Grading objects can be difficult to select in a busy drawing. Use: Home > Layers > Isolate Layer to isolate the grading layer, or use Quick Select (right-click > Quick Select) to filter for grading objects.

## Related

- [Feature lines](feature-lines.md)
- [Feature line editing](feature-line-editing.md)
- [Grading objects](grading-objects.md)
- [Grading groups](grading-groups.md)
- [Sites and feature lines](sites-and-feature-lines.md)
- [Corridor vs feature-line grading](corridor-vs-feature-line-grading.md)
