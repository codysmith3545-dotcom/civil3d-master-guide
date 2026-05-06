---
title: "Editing Survey Data"
section: "civil3d/survey"
order: 75
visibility: public
tags: [survey, editing, reprocess, observations, traverse-editor]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [TRAVERSEEDITOR, SHOWSURVEYTAB]
updated: 2026-05-06
---

> **TL;DR**
> 1. Survey observations (angles, distances, setups) are editable in the survey database after import. Edit the raw values, then reprocess to recompute affected point coordinates and figures.
> 2. Common edits: correcting a transposed angle, deleting a bad sideshot, changing a prism height, reassigning an equipment database. All changes flow through the observation chain on reprocess.
> 3. Use the Traverse Editor to review and edit traverses as a tabular sequence. For individual shots, expand the setup in the Survey tab tree and edit properties directly.

## Editing observations

### Individual observation edit

1. Survey tab > expand the open database > Setups > expand the setup.
2. Right-click the observation > Properties.
3. Edit the value: horizontal angle, zenith angle, slope distance, target height, or description.
4. Close the dialog. The change is saved to the database but coordinates are not yet recomputed.

### Reprocessing

After editing one or more observations, recompute coordinates:

- Right-click the setup > Reprocess. This recomputes all points under that setup.
- Or right-click the database root > Reprocess survey database. This recomputes everything — slower but ensures consistency when edits span multiple setups.

Reprocessing applies the current equipment database settings (EDM constant, prism offset, atmospheric corrections) and recalculates coordinates from the edited raw observations. Figures passing through affected points update their geometry.

If the affected points were inserted into a drawing, the drawing-side positions update on next `Update from project` or automatically if auto-update is enabled in the database settings.

## Deleting bad shots

A bad sideshot (rod on wrong point, kicked prism, stray reflectorless hit) should be deleted rather than zeroed out:

1. Expand the setup in the Survey tab tree.
2. Right-click the bad observation > Delete.
3. If a point was created from that observation and no other observation references it, the point is removed from the database on reprocess.

If the point was already inserted into the drawing and used (e.g. added to a surface), deleting the observation and reprocessing removes the survey point from the drawing as well. Verify surface and figure integrity after deleting shots.

## Editing setups

Setup-level properties include:

- **Instrument height (HI)**: corrects all observations under the setup for the vertical component.
- **Backsight**: changing the backsight re-orients all angles under the setup.
- **Equipment database**: reassigns the instrument/prism specs. Distances recompute with the new EDM constant and prism offset.

Right-click the setup > Properties to edit. Reprocess afterward.

## The Traverse Editor

The Traverse Editor (`TRAVERSEEDITOR`) presents a traverse as a tabular sequence of legs:

| Column | Content |
|---|---|
| Station | Occupied point |
| Backsight | Backsight point |
| Foresight | Foresight point |
| Angle | Horizontal angle right |
| Zenith | Zenith angle |
| Slope Distance | Measured slope distance |
| HI | Instrument height |
| HT | Target (prism) height |

Within the editor you can:

- Edit any cell directly. Changes write to the database.
- Insert or remove legs.
- Run a compass-rule adjustment on the traverse from within the editor.
- View the angular and linear closure before and after adjustment.

The Traverse Editor is the fastest way to fix systematic errors in a traverse (e.g. a mistyped backsight that rotated an entire leg).

## Re-traversing

After correcting observations in a traverse, run the adjustment again:

1. Open the Traverse Editor for the traverse.
2. Review the closure (angular misclosure, linear misclosure, precision ratio).
3. If acceptable, apply the compass-rule or least-squares adjustment.
4. Accepted coordinates overwrite the unadjusted values in the database.

If the closure is unacceptable, investigate individual legs: swap face-1/face-2 averages, check for transposed digits, verify prism heights.

## Editing point descriptions

Point descriptions can be changed in the survey database without affecting coordinates:

- Expand Non-control Points or Control Points > right-click the point > Properties > Description.
- Change the raw description. On next insert into the drawing (or if already inserted), description-key matching re-evaluates and may assign a different style/layer.

This is useful when a field code was entered incorrectly (e.g. `EP` instead of `BC` for a back of curb shot).

## Editing figures

Figures can be edited in the database:

- **Delete a vertex**: right-click the figure in the tree > Edit > select and remove a vertex. The figure re-draws connecting the adjacent vertices.
- **Add a vertex**: insert a new point between existing vertices.
- **Break a figure**: split one figure into two at a selected vertex.
- **Change the figure name**: right-click > Rename. The prefix database re-evaluates layer and style assignment if the new name matches a different prefix.

## Common gotchas

- **Editing coordinates directly.** Overwriting a survey point's coordinates in the database (rather than editing the underlying observation) breaks the observation chain. The point becomes a fixed coordinate with no lineage. Only do this intentionally for control points with known coordinates.
- **Forgetting to reprocess.** Edited observations do not automatically recompute coordinates. Without reprocessing, the database holds the new observation values but the old coordinates — an inconsistent state.
- **Auto-update in drawing.** If auto-update is off (default in many configurations), the drawing retains stale coordinates after a database reprocess. Right-click the database > Update from project to pull changes into the drawing.
- **Cascading edits.** Editing a backsight angle on setup 1 affects all foresights from setup 1. If one of those foresights is the occupied station for setup 2, setup 2's observations shift as well. Reprocessing the entire database handles this cascade, but reprocessing only setup 1 does not.
- **Undo is limited.** There is no multi-level undo in the survey database. Before making major edits, back up the database folder or export the current state to a field book.

## Related

- [Survey database](survey-database.md)
- [Field book format (.fbk)](field-book-format.md)
- [Network adjustment](network-adjustment.md)
- [Survey points vs COGO points](survey-points-vs-cogo-points.md)
