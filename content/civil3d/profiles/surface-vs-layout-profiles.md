---
title: "Surface Profiles vs Layout Profiles"
section: "civil3d/profiles"
order: 10
visibility: public
tags: [profile, surface-profile, layout-profile, existing-ground, design-profile]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEPROFILEFROMSURFACE, CREATEPROFILELAYOUT, EDITPROFILE]
updated: 2026-05-06
---

> **TL;DR**
> 1. A **surface profile** (`CREATEPROFILEFROMSURFACE`) samples an existing surface along an alignment and updates dynamically when the surface changes. It is read-only geometry.
> 2. A **layout profile** (`CREATEPROFILELAYOUT`) is your design grade line, composed of tangent segments and vertical curves that you draw and edit.
> 3. Most roadway sheets show both overlaid in one profile view: existing ground as a thin dashed line, design as a heavier solid line.

## Surface profiles

A surface profile is extracted by projecting an alignment's horizontal geometry vertically onto a surface. Civil 3D records the alignment + surface reference, not a frozen copy of elevations, so the profile updates whenever the surface or alignment is rebuilt.

### Creating a surface profile

1. Home tab > Profile & Section Views panel > Profile > Create Surface Profile (`CREATEPROFILEFROMSURFACE`).
2. Select the alignment.
3. Pick one or more surfaces (for example, existing ground and a proposed corridor surface).
4. Choose a style for each. Click Add, then Draw in profile view.

### Characteristics

- **Dynamic.** If the surface or alignment is edited, the profile recomputes on the next rebuild.
- **Not directly editable.** You cannot grip-edit or insert PVIs. If you need a manual version, extract the data to a layout profile or an AutoCAD polyline (`PROFILEEXTRACTOBJECTS`).
- **Sampling.** Civil 3D samples at the alignment's horizontal geometry points (PI, PC, PT, SC, CS, etc.) and inserts additional samples at the surface TIN edge crossings. The result follows the surface faithfully.
- **Multiple surfaces.** You can sample several surfaces along the same alignment and overlay them in one view for cut/fill comparison.

### Offset surface profiles

`CREATEPROFILEFROMSURFACE` can also sample at a constant horizontal offset from the alignment. This is useful for showing existing ground at the edge of pavement or along a utility corridor offset from the centerline.

## Layout profiles

A layout profile is the designer's vertical alignment, analogous to a horizontal alignment but in the vertical plane. It is defined by PVIs (Points of Vertical Intersection) connected by tangent grades, with vertical curves fit between them.

### Creating a layout profile

1. Home tab > Profile & Section Views panel > Profile > Profile Creation Tools (`CREATEPROFILELAYOUT`).
2. Select the profile view (must already exist and be associated with an alignment).
3. The Profile Layout Tools toolbar opens. Choose a tangent creation method:
   - **Draw Tangents** — click PVIs; Civil 3D connects them with straight grades.
   - **Draw Tangents with Curves** — same, but a curve is auto-fit at each PVI with a default length or K-value.
   - **Curve Settings** — set the default curve type (parabolic or circular) and length/K before drawing.
4. Click to place PVIs. Press Enter to finish.

### Characteristics

- **Editable.** PVIs can be grip-edited, moved numerically in the Profile Layout Parameters (tabular) editor, or adjusted via `EDITPROFILE`.
- **Not dynamic to any surface.** Grades and curve lengths stay where you set them unless you (or a corridor rebuild) move them.
- **Design checks.** Layout profiles accept design criteria files (AASHTO, custom) that flag violations when K-values or grades exceed policy limits. See [Profile design criteria](profile-design-criteria.md).
- **Multiple per alignment.** You can have several layout profiles on one alignment — for example, a preliminary and a final design, or profiles for each construction phase.

## Key differences at a glance

| Attribute | Surface profile | Layout profile |
|---|---|---|
| Command | `CREATEPROFILEFROMSURFACE` | `CREATEPROFILELAYOUT` |
| Updates dynamically | Yes (follows surface) | No (manual edits only) |
| Editable geometry | No | Yes (PVIs, curves, grades) |
| Used as corridor input | Rarely | Yes (primary design input) |
| Design criteria checks | No | Yes |
| Typical style | Thin dashed (EG) | Heavy solid (design) |

## Workflow notes

- Always create the surface profile first so you can see existing ground before drawing the design.
- When a corridor needs an existing-ground reference for daylighting, the surface profile on the corridor's alignment is not required — the corridor's assembly targets the surface directly. The surface profile is for visualization.
- To convert a surface profile to an editable layout profile, use the Profile Layout Tools toolbar > More options > Create Profile from Surface Profile. This copies the sampled elevations into editable PVI geometry.

## Related

- [Profile views and bands](profile-views-and-bands.md)
- [Vertical curve design](vertical-curve-design.md)
- [Editing profiles](editing-profiles.md)
- [Multiple profiles in one view](multiple-profiles.md)
