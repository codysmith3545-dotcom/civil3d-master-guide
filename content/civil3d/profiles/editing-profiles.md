---
title: "Editing Profiles"
section: "civil3d/profiles"
order: 40
visibility: public
tags: [edit-profile, pvi, grip-editing, tabular-editor, profile-geometry-editor]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [EDITPROFILE, PROFILELAYOUTPARAMS, PROFILEGRID, RAISEDROPPROFILE]
sources:
  - title: "Autodesk Civil 3D Help — Editing Layout Profiles"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-E04F0B11-E1B7-4F72-BF8D-7D5F2E4E4B5C"
updated: 2026-05-06
---

> **TL;DR**
> 1. Layout profiles are edited through **grip editing** (drag PVIs and curve grips directly in the profile view), the **Profile Layout Parameters** tabular editor (precise numeric entry for every PVI, grade, and curve), or the **Profile Layout Tools** toolbar (insert/delete PVIs, change curve types).
> 2. Surface profiles cannot be edited directly; modify the underlying surface or alignment instead.
> 3. Always confirm that downstream objects (corridors, pipe networks, grading groups) rebuild correctly after profile edits — use `REGEN` or `PROSPECTOR > Rebuild` if objects appear stale.

## Grip editing

Select a layout profile to display grips:

- **PVI grips (triangular)** — drag to move the PVI to a new station and elevation. Grades on both sides update. Any vertical curve at that PVI stretches or compresses.
- **Curve pass-through grip (circular)** — appears at the midpoint of a vertical curve. Drag vertically to change the curve length while keeping the PVI fixed.
- **PVC/PVT grips** — appear at the ends of vertical curves. Dragging one end changes the half-length on that side (creates an asymmetric curve if the other end is not also moved).

Grip editing is fast for rough adjustments but imprecise. Hold Shift while dragging to constrain movement to vertical only. Use ORTHO or polar tracking for additional control.

## Profile Layout Tools toolbar

Open with: select the profile > right-click > Edit Profile Geometry, or Home tab > Profile & Section Views panel > Profile > Edit Profile (`EDITPROFILE`). The toolbar provides:

| Tool | Use |
|---|---|
| **Draw Tangents** | Add new tangent segments to extend the profile |
| **Insert PVI** | Click a point on an existing tangent to break it into two segments with a new PVI |
| **Delete PVI** | Remove a PVI; the two adjacent tangents merge into one |
| **Move PVI** | Numeric dialog: enter exact station and elevation |
| **Insert Vertical Curve** | Add a vertical curve at a PVI (by K-value or length) |
| **Delete Vertical Curve** | Remove the curve at a PVI, restoring the grade break |
| **Raise/Drop PVI** | Shift one or more PVIs by a specified vertical offset |
| **Profile Layout Parameters** | Open the tabular editor (see below) |

### Insert PVI

Click anywhere on a tangent segment. Civil 3D adds a PVI at that station and elevation. The profile shape does not change until you move the new PVI. This is useful for adding a grade break where none existed.

### Delete PVI

Select the PVI to remove. The two tangent grades on either side are joined, creating a single tangent between the PVIs before and after the deleted one. Any vertical curve at the deleted PVI is also removed.

## Profile Layout Parameters (tabular editor)

The tabular editor is a spreadsheet-like view of every PVI, tangent grade, and curve parameter. Open it from the Profile Layout Tools toolbar or with `PROFILELAYOUTPARAMS`.

Columns include:

| Column | Description |
|---|---|
| PVI Station | Station of the PVI (editable) |
| PVI Elevation | Elevation of the PVI (editable) |
| Grade In | Grade of the tangent entering this PVI (read-only — computed from adjacent PVI positions) |
| Grade Out | Grade of the tangent exiting this PVI (read-only) |
| Curve Length | Length of the vertical curve at this PVI (editable) |
| K Value | K-value of the curve (editable — changes length proportionally) |
| Curve Type | Parabola or circular (editable) |
| PVC Station / Elevation | Start of the vertical curve (read-only) |
| PVT Station / Elevation | End of the vertical curve (read-only) |

Editing a value in one column recalculates dependent values immediately. For example, changing the K-value recalculates the curve length (L = K * A) and the PVC/PVT positions.

### PVI-based editing workflow

1. Open the tabular editor.
2. Identify the PVI to adjust. Type the desired elevation (or station) directly.
3. Tab to the curve-length or K-value column. Enter the design minimum or target value.
4. Review the grade-in and grade-out columns. Confirm they meet maximum-grade criteria.
5. Close the editor. The profile view updates.

This is the most common approach for final design because it gives precise numeric control with immediate visual feedback.

## Raise/Drop profile

The `RAISEDROPPROFILE` command shifts the entire profile (or a station range) up or down by a uniform elevation. Useful when:

- A preliminary profile needs to be raised to clear a utility crossing.
- A client requests a global grade change.
- Comparing a raised alternate with the original (create a copy first).

After raising or dropping, all PVI elevations change by the specified amount. Vertical curve geometry (K-values, lengths) remains unchanged because only the PVI elevations shift.

## Undo behavior

Profile edits made through the toolbar or tabular editor support standard AutoCAD UNDO. Each edit is a single undo step. Grip edits also undo as a single step per drag.

## Editing triggers on dependent objects

Layout profiles feed corridors, pipe networks (as reference surfaces), and grading groups. When you edit a profile:

- **Corridors** — the corridor region using that profile marks as out of date. Rebuild with right-click > Rebuild or `CORRIDORREBUILD`.
- **Labels** — profile labels update automatically to reflect new grades, elevations, and curve parameters.
- **Profile views** — the view redraws immediately. If the new elevation falls outside the datum range, the profile may appear clipped. Adjust the elevation range in Profile View Properties.
- **Data shortcuts** — if the profile is shared via data shortcuts, referenced drawings need to synchronize.

## Common editing mistakes

- **Editing the wrong profile.** If the profile view contains both an EG surface profile and a design layout profile, make sure you select the correct one. Surface profiles cannot be grip-edited; Civil 3D will not show grips on them.
- **Overlapping curves.** If two adjacent vertical curves overlap (their PVC/PVT stations cross), Civil 3D flags an error and the profile may not draw correctly. Shorten one or both curves.
- **Grade too steep.** The tabular editor does not prevent you from entering an unrealistically steep grade. Use design criteria checks to flag violations.

## Related

- [Surface profiles vs layout profiles](surface-vs-layout-profiles.md)
- [Vertical curve design](vertical-curve-design.md)
- [Profile design criteria](profile-design-criteria.md)
- [Profile labels](profile-labels.md)
