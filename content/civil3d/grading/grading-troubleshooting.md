---
title: "Grading Troubleshooting"
section: "civil3d/grading"
order: 95
visibility: public
tags: [grading, troubleshooting, daylight, infill, errors]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [GradingCreate, GradingEditingTools, GradingGroupProperties, EditFeatureLineElevations]
updated: 2026-05-11
sources:
  - title: Autodesk Civil 3D 2025 Help — Grading Troubleshooting
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-9C4B5C4A-2F0F-4C8E-9D3D-7C0E1A5B8E3F
    verified: 2026-05-11
  - title: Autodesk Civil 3D 2025 Help — Grading Group Properties
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-7D2F4E3B-8A9C-4D1E-8F6B-3D2C8B9A1E2F
    verified: 2026-05-11
---

> **TL;DR**
> 1. Most grading failures come from one of three causes: the **target surface is missing or out of range**, daylight slopes **cross themselves** at concave corners, or **infill cannot close** because grading objects do not bound a single region.
> 2. Diagnose by toggling display: turn on the grading group's surface, the daylight line, and the projection lines, then look for the gap.
> 3. Fix the feature line first (close the loop, soften corners, repair elevations) before changing criteria; geometry problems masquerade as criteria problems.

## "No target surface specified"

When a criterion uses **Target = Surface** but the grading group has no target surface set, the grading object is created but produces no daylight.

Fix:

1. Toolspace > Prospector > Sites > [site] > Grading Groups > [group] > **Properties**.
2. On the **Information** tab, set the **Target surface** to the existing-ground surface.
3. Re-run grading edit; the daylight line rebuilds.

## "Daylight slopes cross themselves" / re-entrant corners

At a concave (inward-pointing) corner of a footprint, two adjacent daylight slopes project toward the same area. They will overlap if their cross product on the surface is greater than the angle between them.

Fixes:

- Soften the corner: insert a small radius on the feature line (use the **Fillet** edit on the feature line geometry).
- Split the criterion: use a flatter slope at the corner segment.
- Use **Omit conflict region** in the criteria's conflict resolution so Civil 3D leaves a gap rather than overlapping.

## "Infill cannot close"

Infill needs a continuous bounded interior. Common causes:

- Bounding grading objects do not all belong to the **same grading group**. Move them or recreate.
- The feature line is not topologically closed at a vertex; what looks closed in plan may have two coincident endpoints rather than one shared vertex. Use the **Join** edit on the Feature Line Edit Geometry panel.
- A grading object is missing on one side of the loop; only graded sides count for infill.

## "Grading group surface is empty or has holes"

Diagnose:

- **Toolspace > Prospector > Surfaces > [grading surface] > Definition > Edits** — look for excluded regions.
- **Definition > Statistics** — confirm the surface contains triangles.

Common causes:

- **Automatic surface creation** is off. Turn it on in Grading Group properties.
- All grading objects exist but all use **Target = Distance** with no infill; there are slope faces but no closed pad face.
- The target surface for one daylight criterion is null; that grading object contributes no triangles.

## "Volumes are wrong or zero"

Volumes from a grading group come from a **volume surface** that compares the grading surface to a base (existing) surface.

Checklist:

- Verify the grading surface is enabled and rebuilt (right-click surface > **Rebuild**).
- Build a TIN volume surface: **Home > Create Ground Data > Surfaces > Create Surface > TIN volume surface**, with Base = existing, Comparison = grading.
- Confirm both surfaces overlap in plan and have the same horizontal datum.

## "Grading objects vanish after a feature line edit"

Edits that change the feature line's site (e.g., dragging it into another site, or pasting feature lines from another DWG) can break the link between grading object and baseline. The grading object becomes orphaned.

Fixes:

- Undo the move and use **Modify > Edit Geometry > Insert PI** rather than recreating the line.
- If orphaned, delete the grading object and recreate from the new feature line.
- Avoid moving feature lines between sites once grading is built.

## "Slopes are cutting where they should fill" (or vice versa)

Often a sign-flip: the criterion's projection is set with the wrong cut/fill assignment.

- Edit the criterion (Settings > Grading > Grading Criteria Sets) and confirm cut and fill values match your intent.
- Or edit the grading object directly: select it, **Properties > Criteria** tab, swap the values.

## Common errors (catalog)

| Symptom | Likely cause | Fix |
|---|---|---|
| Daylight stops at the feature line | Target surface not set | Grading Group properties > target surface |
| Infill button does nothing | Loop not closed; wrong group | Join feature line; verify grading group |
| Grading group surface empty | Automatic surface creation off | Group properties > Information tab |
| Slopes overlap at corner | Re-entrant geometry | Fillet corner or change conflict resolution |
| Daylight too far | Slope too flat | Use steeper slope or change to fixed distance |
| Daylight never reaches target | Target surface ends before projection | Extend the target surface boundary |
| Cut/fill swapped | Criterion sign-flipped | Edit criterion projection values |
| Edits don't propagate | Grading object orphaned from baseline | Recreate grading object |

## Related

- [Grading objects](grading-objects.md)
- [Grading from feature lines](grading-from-feature-lines.md)
- [Grading criteria sets](grading-criteria-sets.md)
- [Feature line elevation editing](feature-line-elevation-editing.md)
- [Existing troubleshooting page](troubleshooting-grading.md)
