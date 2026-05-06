---
title: "Breakline Strategy"
section: "field-and-boundary/topographic-surveys"
order: 25
visibility: public
tags: [breaklines, surface-modeling, topo, curb, swale, slope, contours]
updated: 2026-05-06
---

> **TL;DR**
> 1. Every abrupt grade change — curbs, swales, ridgelines, retaining walls, top and toe of slope — needs a **breakline** or the TIN surface will interpolate through it and produce wrong contours.
> 2. Shoot breakline features at a density of **10 to 25 ft along the feature** for typical site work; tighter spacing on curves, transitions, and vertical breaks.
> 3. Code breakline start and stop in the field with linework commands so the office can connect points automatically rather than hand-drawing every line.

## Why breaklines matter

A TIN (triangulated irregular network) surface connects points with triangles. Without guidance, the triangulation may cross a curb, ridge, or swale instead of following it. The result: contours that pass through curbs, water that appears to flow uphill, and grades that look flat where a ditch exists.

A breakline forces triangle edges to follow the linear feature. The surface honors the grade break, and contours bend correctly at the feature.

## Features that need breaklines

| Feature | Reason |
|---|---|
| Top of curb / flow line | Grade change of 4 to 8 in. over inches of horizontal distance |
| Back of curb | Defines the pavement-to-grass transition |
| Swale or ditch centerline | Lowest point in a drainage channel |
| Top of slope | Upper edge of a grade break |
| Toe of slope | Lower edge of a grade break |
| Retaining wall (top and bottom) | Vertical or near-vertical face; TIN cannot model a vertical wall without top and bottom breaklines |
| Ridge line | High point along a drainage divide |
| Edge of water | Defines the waterline of a pond, stream, or wetland |
| Crown of road | High point of a pavement cross section |
| Headwall / wingwall | Sharp structural grade transitions |
| Building pad / foundation edge | Abrupt grade change at the building perimeter |

If you can see a grade break on the ground, it probably needs a breakline.

## Shot density along breaklines

The required spacing depends on the feature's curvature and the contour interval:

- **Straight runs** (e.g., straight curb): 25 to 50 ft spacing is often adequate for 1 ft contours.
- **Gentle curves** (e.g., curb return at an intersection): 10 to 15 ft spacing, or shoot every visible deflection point.
- **Tight curves** (e.g., cul-de-sac, small-radius curb return): 5 to 10 ft spacing. Under-shooting a tight curve produces a polygon, not a curve, and contours will stair-step.
- **Vertical transitions** (e.g., a swale going from flat to steep): Shoot wherever the grade changes slope, even if the horizontal spacing is uneven.

When in doubt, shoot more densely. An extra 30 seconds per shot is cheaper than an office technician spending an hour redrawing breaklines from notes and aerial imagery.

## Coding breaklines in the field

Use your project's linework commands to start and stop each breakline string. Example using dot-command syntax:

```
Shot 101: TC .S     ← Start a new top-of-curb string
Shot 102: TC         ← Continue the string
Shot 103: TC         ← Continue
Shot 104: TC .E     ← End the string (e.g., at a curb cut)
Shot 105: TC .S     ← Start a new string on the other side of the driveway
```

For features that close on themselves (building pads, islands):

```
Shot 200: BLD .S    ← Start building corner string
Shot 201: BLD
Shot 202: BLD
Shot 203: BLD .C    ← Close back to shot 200
```

When two breakline features share a point (e.g., where a swale meets a curb flow line), shoot the point once and assign both codes if your collector supports multi-coding. Otherwise, shoot two points at the same location with different codes and note the tie in your field book.

## Connecting breaklines to the surface in Civil 3D

After importing coded points and running field-to-finish (or manually drawing breaklines):

1. **Add breaklines to the surface** as standard or proximity breaklines. Standard breaklines are the most common for field-collected linear features.
2. **Check the surface** for crossing breaklines, flat triangles, and slivers. Use the Civil 3D surface-editing tools to swap edges or delete errant triangles.
3. **Verify contour plausibility** by overlaying the contours on the point data. Contours should bend at every breakline and not cross the feature unnaturally.
4. **Wall breaklines** for retaining walls, where the surface needs to represent a near-vertical face. A wall breakline creates two elevations at the same horizontal position.

## Common mistakes

- **Forgetting to start a new string.** If you do not issue a new BGL command at a gap (driveway, inlet, end of wall), the software will draw a false line across the gap.
- **Under-shooting curves.** A curb return with only two or three shots will triangulate as a flat chord, not a curve.
- **Missing the toe of slope.** Crews often shoot top of slope but forget the toe. Without both, the surface interpolates a plane across the entire slope face.
- **Not shooting the bottom of swales.** A swale with only the top edges and no centerline shot will model as a ridge, not a valley.
- **Inconsistent elevation at junctions.** Where two breakline features meet (e.g., curb to inlet rim), the elevations must agree at the junction point, or the surface will have a spike or pit.

## Related

- [Field code conventions](field-code-conventions.md)
- [Topo QA/QC](topo-qa-qc.md)
- [Pre-survey planning](pre-survey-planning.md)
- [Difficult ground](difficult-ground.md)
