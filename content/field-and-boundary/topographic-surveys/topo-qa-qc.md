---
title: "Topographic Survey QA/QC"
section: "field-and-boundary/topographic-surveys"
order: 50
visibility: public
tags: [qa-qc, quality-control, contours, surface-check, accuracy, topo]
updated: 2026-05-06
---

> **TL;DR**
> 1. Check the surface **before delivery** — overlay contours on points, run cross sections through known features, and compare spot elevations to independent measurements. Catching a blown contour in the office is cheap; catching it after the client builds on it is not.
> 2. Verify **closure on control** at the start and end of every field session. If the check exceeds tolerance, the day's work is suspect.
> 3. Review **breakline connectivity** systematically: look for gaps, overshoots, crossing breaklines, and missing features that produce false contour patterns.

## Field QA (before leaving the site)

### Control closure

Every field session must begin and end with a check on known control. Record the observed vs. published coordinates and compute the delta. Acceptable closures for 1 ft contour topographic work:

| Check | Tolerance |
|---|---|
| Horizontal (GNSS or traverse) | 0.05 ft |
| Vertical (GNSS or level) | 0.03 ft |
| Backsight angle (total station) | 5 seconds |

If the closing check exceeds tolerance, do not leave the site. Re-observe, troubleshoot the equipment, and determine whether the day's data is valid. A blown closing check invalidates every shot taken during that session until the cause is identified.

### Known-elevation comparisons

Shoot at least two independent elevation checks during the day — features whose elevation you can verify:

- A published benchmark not used as control.
- A previously surveyed manhole rim.
- A floor elevation from a building plan.
- A bridge deck elevation from construction records.

Record the comparison. If the check elevation disagrees by more than the project tolerance, investigate before continuing.

### Field notes review

Before leaving the site, scroll through the data collector and verify:

- Point numbering is sequential and complete (no skipped ranges that suggest deleted points).
- Feature codes are consistent and match the code list.
- Linework commands (start, end, close) are present on breakline features.
- Notes are attached to unusual shots (offset, vegetation, estimated, submerged).
- No obviously wrong elevations (e.g., a ground shot at 900 ft in a project where everything else is at 780 ft).

### Photograph the site

Take photographs of critical features, vegetation conditions, and any areas where the data is thin or uncertain. Photographs are inexpensive insurance and help the office modeler interpret ambiguous data.

## Office QC (before delivery)

### Contour plausibility

Generate 1 ft (or project-interval) contours and overlay them on the point data. Look for:

- **Contours crossing breakline features.** A contour should not cross a curb, wall, or swale without bending. If it does, the breakline is missing, disconnected, or has an elevation error.
- **Bullseyes (closed contour loops).** A closed contour around a single point usually indicates a spike or pit in the surface — either a wrong elevation or a missing breakline.
- **Parallel contour bunching.** Extremely close contour spacing indicates a steep feature. Confirm it exists (retaining wall, steep bank) or investigate a data error.
- **Flat areas with no contours.** If a large area has no contour, the surface may be interpolating across a feature that should have shots (e.g., a parking lot that was not surveyed).
- **Contour direction.** Contours should form V-shapes pointing upstream in valleys and downstream on ridges. Reversed V-shapes indicate a surface modeling error.

### Cross-section spot checks

Cut cross sections through the surface at known locations:

- Along a street centerline — verify crown, gutter, and sidewalk elevations match expected geometry.
- Across a ditch or swale — verify the cross section shows the correct shape (V, trapezoidal, etc.).
- Through a parking lot — verify the cross slope matches the design or field observation (typically 1% to 2%).

If the cross section looks wrong, trace the issue to specific points or breaklines.

### Breakline connectivity audit

Systematically review every breakline set:

1. **Gaps.** Look for breaklines that stop short of where the feature continues. A curb breakline that ends 10 ft before an intersection corner is a common miss.
2. **Overshoots.** A breakline that extends past the end of the feature (e.g., into a driveway opening) will drag the surface incorrectly.
3. **Crossing breaklines.** Two breaklines that cross at different elevations create a surface conflict. Resolve by adjusting one breakline to match the other at the intersection.
4. **Orphan breaklines.** Lines that are not connected to the surface definition. They exist in the drawing but do nothing.
5. **Elevation mismatches at junctions.** Where two breaklines meet (e.g., curb to inlet), their elevations at the junction must agree. A 0.1 ft mismatch at a junction creates a visible surface artifact.

### Comparison to source data

If reference data exists (prior survey, aerial LiDAR, design files), compare your surface to it:

- Create a difference surface (your TIN minus the reference) and look for systematic offsets.
- Large, uniform differences suggest a datum or projection mismatch.
- Localized differences may indicate real site changes or errors in one dataset.

### Surface statistics

Review the Civil 3D surface properties:

- **Number of points.** Does it match what was collected?
- **Minimum and maximum elevation.** Do they fall within the expected range for the site?
- **Number of triangles.** An unexpectedly high count may indicate duplicate points.
- **Maximum triangle edge length.** Very long edges suggest gaps in data coverage — consider adding a boundary to clip the surface or a maximum triangle length.

## Before-delivery checklist

Before releasing the topo to the client or the design team:

- [ ] Control closure within tolerance for every field session.
- [ ] At least two independent elevation checks passed.
- [ ] Contours reviewed at full extent and at detail scale. No unexplained bullseyes, gaps, or crossings.
- [ ] Breaklines complete and connected. No orphans, gaps, or crossing conflicts.
- [ ] Cross sections checked at representative locations.
- [ ] Point descriptions are clean and consistent (no unrecognized codes).
- [ ] Metadata documented: datum, projection, geoid, vertical datum, date of survey, equipment used.
- [ ] Deliverable files generated in the format requested (DWG, LandXML, PDF, etc.).
- [ ] Field photographs archived with the project.
- [ ] Any limitations or caveats documented in a cover letter or notes sheet (e.g., "Elevations in wooded area southeast of building are estimated through 4 to 6 in. of leaf litter").

## Related

- [Pre-survey planning](pre-survey-planning.md)
- [Control for topos](control-for-topos.md)
- [Breakline strategy](breakline-strategy.md)
- [Field code conventions](field-code-conventions.md)
- [Difficult ground](difficult-ground.md)
