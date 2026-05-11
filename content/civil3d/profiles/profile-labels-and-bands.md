---
title: "Profile Labels and Bands"
section: "civil3d/profiles"
order: 24
visibility: public
tags: [profile, label-set, band, band-set, station, elevation, grade]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [AddProfileLabels, EditLabelStyle, EditBandSet, ProfileLabelSet]
updated: 2026-05-11
sources:
  - title: Autodesk Civil 3D 2025 Help — Profile Labels
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3D4F5A6B-7C8E-9F0A-1B2C-3D4E5F6A7B8C
    verified: 2026-05-11
  - title: Autodesk Civil 3D 2025 Help — Profile View Bands
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-93D9F2E6-9A0E-4F4A-B7C7-7A2D6F1E4A53
    verified: 2026-05-11
---

> **TL;DR**
> 1. **Profile labels** annotate the profile itself (PVIs, tangents, vertical curves, station/elevation pairs); manage them with **Profile Label Sets** so a single drag-and-drop applies all of them.
> 2. **Profile view bands** annotate the profile view frame (station ticks, EG vs design elevation, cut/fill, vertical geometry, pipes); manage them with **Band Sets**.
> 3. Build one label set per profile type (existing, design, offset) and one band set per sheet style (plan-and-profile, profile-only) so every project sheet matches.

## Profile label types

Profile labels live on the profile, not on the view. Categories under **Settings > Profile > Label Styles**:

| Type | Annotates |
|---|---|
| Major Station | Major station ticks along the profile (e.g., every 100 ft) |
| Minor Station | Minor station ticks (e.g., every 25 ft) |
| Horizontal Geometry Point | Where horizontal alignment events fall on the profile |
| Lines (tangent) | Slope/length labels on the tangents |
| Grade Breaks | Stations where two tangents meet (no curve) |
| Crest Curves | Curve length, K, PVI station/elevation, etc. |
| Sag Curves | Same, formatted for sag |

Label styles are like all Civil 3D label styles: composed of text, lines, blocks, and reference text components.

## Profile label sets

A label set bundles label styles into a single object that applies to a profile in one step. Manage at **Settings > Profile > Label Styles > Label Sets**.

To apply: select the profile > **Edit Label Set** (or right-click > **Profile Properties > Labels** tab) > **Import label set** > pick the set.

Label sets store, per type, the style, the increment (for major/minor station), and whether to include the type at all.

## Recommended label setup

- **Existing-ground profile**: minimal labels (sometimes none), or only minor station ticks. The EG profile is informational; labeling clutters the view.
- **Design profile**:
  - Major station label every 100 ft (station + design elevation + EG elevation, formatted for the title block).
  - Tangent label every other tangent (grade % + length).
  - Sag/crest curve labels at every vertical curve (PVI station, PVI elevation, K, L, A).
- **Offset profile** (curb): tangent grade only; let the design profile carry station and elevation.

## Adding labels to a profile

- **AddProfileLabels** (Annotate > Labels & Tables > Add Labels > Profile > [type]).
- Select the profile, then click each location (or use **All entities** to label every PVI/tangent/curve at once).
- Use the **Label Set** option to import a set instead of adding one type at a time.

## Profile view bands

Bands are not labels on the profile; they're horizontal strips attached to the profile view above and/or below the grid.

Manage bands on **Profile View Properties > Bands** tab:

- **Band type** dropdown.
- **Band style** dropdown (per-band styling).
- **Profile1 / Profile2** — for bands that compare two profiles (e.g., EG and design for cut/fill).
- **Position** — top or bottom.
- **Gap** — vertical spacing between stacked bands.

Save the stack as a **Band Set** for reuse.

### Standard band set for plan-and-profile sheets

Bottom (from grid down):

1. Existing-ground elevation.
2. Design elevation.
3. Difference (cut/fill).
4. Station.
5. Vertical geometry (PVI and vertical curve data).
6. Horizontal geometry (PI, deflection, radius).

Set band heights so the total fits the title-block band area.

## Station / elevation / grade labels

Three common patterns:

- **Station + EG + Design** as a stacked label at every major station, anchored above the grid bottom.
- **Grade and length** as a tangent label centered along each tangent.
- **Vertical curve callout** with PVI station, PVI elevation, L, K, A, low/high point station and elevation.

Build these as label styles with stacked text components and reference text linking to vertical curve properties.

## Common errors

- **Labels disappear when the profile is regenerated** — labels were added directly (not via label set) and the profile entity changed. Reapply via label set.
- **Vertical curve labels show wrong K or A** — sign convention mismatch in the label style; verify the formula uses absolute value where appropriate.
- **Bands run off the sheet** — total band height too large; trim or remove bands.
- **Existing-ground band shows zero everywhere** — the band's source profile is set to the design profile (not EG); reset on the bands tab.
- **Label set has the right styles but wrong increments** — increment is set per type in the label set; edit and re-save.

## Related

- [Profile labels (existing page)](profile-labels.md)
- [Profile view styles](profile-view-styles.md)
- [Profile views and bands](profile-views-and-bands.md)
- [Layout profile design](layout-profile-design.md)
- [Profile creation from surface](profile-creation-from-surface.md)
