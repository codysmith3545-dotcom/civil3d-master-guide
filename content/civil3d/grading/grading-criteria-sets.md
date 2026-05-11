---
title: "Grading Criteria Sets"
section: "civil3d/grading"
order: 22
visibility: public
tags: [grading, criteria, criteria-set, daylight, slope, distance-grade, elevation-grade]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [GradingCreate, GradingCriteriaSet, EditFeatureLineElevations]
updated: 2026-05-11
sources:
  - title: Autodesk Civil 3D 2025 Help — Grading Criteria
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-2D6B6B7C-66A9-49DB-9E4C-BB3B2A4D8E6F
    verified: 2026-05-11
  - title: Autodesk Civil 3D 2025 Help — Grading Criteria Sets
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-1A12D4C5-2E93-4F71-9131-7C2B6E8D3A7B
    verified: 2026-05-11
---

> **TL;DR**
> 1. A **grading criteria set** is a named collection of grading rules under **Toolspace > Settings > Grading > Grading Criteria Sets**; each rule defines how a single grading object projects from a baseline.
> 2. **Distance-grade criteria** project a fixed horizontal distance at a slope; **elevation-grade criteria** project at a slope until they reach a target surface or a target elevation.
> 3. Standardize criteria once in your DWT (3:1 cut to surface, 4:1 fill to surface, sidewalk grade-to-distance, pad grade-to-elevation) so designers pick from a list rather than re-typing slopes.

## Where criteria sets live

Open **Toolspace > Settings tab > Grading > Grading Criteria Sets**. The default template ships with a `Basic Set` containing examples. Right-click the node to **New** a set; right-click a set to **New** a criterion inside it.

Each criterion has these high-level properties (set in the **Grading Criteria** dialog):

- **Target** — what the projection aims at.
- **Projection** — how the slope is defined and which direction it goes.
- **Conflict resolution** — what to do when the projection cannot reach the target.

## Target types

| Target | Meaning |
|---|---|
| Surface | Project until the slope intersects a target surface (daylight grading). |
| Elevation | Project until reaching an absolute elevation (e.g., 712.50 ft). |
| Relative elevation | Project until a vertical offset from the baseline (e.g., -1.5 ft). |
| Distance | Project a fixed horizontal distance from the baseline. |

## Projection types

| Projection | Inputs |
|---|---|
| Cut/Fill slope | Slope ratio (H:V) or grade (%) for cut, fill, or both. |
| Distance | Horizontal distance only (paired with a target other than distance). |
| Grade or slope | Single value applied regardless of cut/fill. |

When **Cut and fill** are both set, Civil 3D uses the cut value when the projection drops to meet the target and the fill value when it rises.

## Distance-grade vs elevation-grade

- **Distance-grade criterion** (target = distance, projection = grade or slope). Civil 3D moves outward a fixed plan distance and computes the resulting elevation from the input grade. Use this for a flat sidewalk band, a paved apron, or a level pad shoulder where the horizontal extent is the design control.
- **Elevation-grade criterion** (target = surface or elevation, projection = slope). Civil 3D projects at the slope until it hits the target. Use this for daylight slopes to existing ground, where the daylight line moves with the target surface as it changes.

A common pad layout uses one distance-grade for the perimeter walk and a second elevation-grade outside that to daylight to existing.

## Creating a criterion

1. **Toolspace > Settings > Grading > Grading Criteria Sets > [your set] > New**.
2. Name it (e.g., `3:1 Cut/2:1 Fill to Surface`).
3. On the **Criteria** tab, set:
   - Target: **Surface**.
   - Projection: **Cut/Fill Slope**, with Cut Slope `3:1` and Fill Slope `2:1`.
   - Conflict resolution: **Use last value** (typical) or **Omit conflict region** if you want gaps to be visible.
4. Save. The criterion is now selectable from the **Grading Creation Tools** toolbar.

## Applying a criteria set

1. Ribbon: **Home > Create Design > Grading > Grading Creation Tools** (command: `GradingCreate`).
2. On the toolbar, click the **Grading Group** button to set the active group, then **Set the Criteria** to choose the criteria set.
3. Pick the criterion from the dropdown each time you create a new grading object.
4. Click the baseline feature line, choose the side, accept (or override) the criteria parameters in the Create Grading dialog, and Civil 3D builds the grading object.

## Versioning your criteria

- Save criteria sets in your office DWT.
- Mirror jurisdictional standards in named criteria (e.g., `INDOT 6:1 Clear Zone`, `Carmel 4:1 Pond Side Slope`) so designers pick the rule that matches the standard rather than entering slopes manually.
- Document the criteria set in your CAD standards so reviewers know which rule was used.

## Common errors

- **"No grading criteria set is selected"** — pick a set on the Grading Creation Tools toolbar before clicking the baseline.
- **Daylight overshoots or never reaches the target** — flatten the slope, change the conflict resolution to **Use last value**, or check that the target surface extends past the daylight area.
- **Grading object disappears after edit** — the criteria parameters were overridden in the Create Grading dialog; the criterion in the set was not modified. Re-edit on the object directly via Properties.
- **Distance-grade criterion ignores the elevation** — verify the projection is set to **Grade** or **Slope**, not **Distance**; Distance projection requires a different target type.

## Related

- [Grading objects (overview)](grading-objects.md)
- [Grading from feature lines](grading-from-feature-lines.md)
- [Feature line elevation editing](feature-line-elevation-editing.md)
- [Grading troubleshooting](grading-troubleshooting.md)
