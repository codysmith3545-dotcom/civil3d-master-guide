---
title: "Multiple Profiles in One View"
section: "civil3d/profiles"
order: 50
visibility: public
tags: [multiple-profiles, overlay-profile, offset-profile, profile-view, profile-display]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEPROFILEVIEW, PROFILEVIEWPROPERTIES, CREATEPROFILEFROMSURFACE, SUPERIMPOSEDPROFILE]
sources:
  - title: "Autodesk Civil 3D Help — Profile Display Options"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-BD8E15C6-4F5C-4073-9C60-FDF6E7BEDC5F"
updated: 2026-05-06
---

> **TL;DR**
> 1. A single profile view can display **multiple profiles** overlaid: existing ground, proposed design, offset profiles, alternate designs, and corridor-extracted surfaces. Control visibility through Profile View Properties > Profile Display Options.
> 2. **Offset profiles** (surface profiles sampled at a horizontal offset from the alignment) show existing ground at the edge of pavement or utility corridor. They appear in the same profile view as the centerline profiles.
> 3. For long alignments, **split profile views** break the station range across multiple rows; each row shows all assigned profiles. Use separate profile views when different elevation ranges or vertical exaggerations are needed.

## Overlaying profiles in a single view

Every profile associated with an alignment can be displayed in the same profile view. Typical overlays include:

| Profile | Purpose | Typical style |
|---|---|---|
| Existing ground (surface profile) | Shows current terrain along centerline | Thin dashed green/brown |
| Proposed finished grade (layout profile) | Design grade line | Heavy solid red |
| Proposed corridor top surface | Confirms corridor model matches design intent | Medium solid blue |
| Offset EG left / right | Existing ground at left/right edge of pavement | Thin dashed, lighter weight |
| Alternate design | Comparison of design options | Dashed with different color |

### Controlling which profiles appear

1. Select the profile view > right-click > Profile View Properties > Profile Display Options tab.
2. Each profile associated with the alignment is listed. Toggle the **Draw** checkbox to show or hide it.
3. Change the style (color, linetype, lineweight) per profile by selecting a different profile style from the drop-down.
4. Adjust the label set assigned to each profile in this same tab.

You can also control profile display during creation in the `CREATEPROFILEVIEW` wizard's Profile Display Options page.

## Offset profiles

Offset profiles are surface profiles sampled at a constant horizontal offset from the alignment. They are invaluable for:

- Showing existing ground at the edge-of-pavement line to evaluate shoulder cut/fill.
- Checking existing grades along a utility trench offset from the road centerline.
- Comparing existing and proposed shoulder grades.

### Creating offset profiles

1. `CREATEPROFILEFROMSURFACE` > select the alignment.
2. Under Sample Offset, enter the offset distance (positive = right of alignment, negative = left when facing increasing stations).
3. Choose the surface to sample.
4. Add to the profile view.

Each offset distance creates a separate profile object. Label them clearly to avoid confusion — include the offset distance in the profile name (e.g., "EG @ 20' LT").

## Controlling profiles across multiple views

An alignment can have many profile views (one for the full length, others for specific station ranges or for sheets). Each profile view independently controls which profiles appear and in what style.

### Scenarios

- **Full-length view for design.** Show EG + design + offset profiles. Use a large scale for screen editing.
- **Sheet views (plan-production).** Show EG + design only. Use the band set for the vertical geometry table. Offset profiles may clutter the sheet.
- **Utility profile view.** Show EG + pipe network profile. Hide the road design profile.

To set different display options per view, open each view's Profile View Properties > Profile Display Options tab independently.

## Split profile views for long alignments

When the alignment is too long to display at the target scale on a single sheet, a split profile view divides it into horizontal rows stacked vertically. All profiles assigned to the view appear in every row.

1. Create the profile view with the Split Profile View creation method.
2. Set the maximum width per row (match the available sheet width at your plot scale).
3. Set the gap between rows.

Each row has its own station range and datum. Civil 3D handles the segmentation automatically. Match lines between rows show where the stationing continues.

See [Profile views and bands](profile-views-and-bands.md) for more on split and stacked views.

## Superimposed profiles

The `SUPERIMPOSEDPROFILE` command projects a profile from a **different alignment** into the current alignment's profile view. This is useful at intersections where you need to see the cross-road's profile in the context of the mainline. The superimposed profile is projected at the station where the two alignments intersect horizontally.

Superimposed profiles appear as read-only overlays. They do not become part of the host alignment's profile collection.

## Tips

- Name profiles descriptively (include surface name, offset, or design version) so the Profile Display Options list is manageable.
- Use a profile style naming convention that matches your layer standard. For example: EG profiles use the `C-ROAD-PROF-EXST` layer; design profiles use `C-ROAD-PROF-DESG`.
- When comparing two design alternatives, create both as layout profiles on the same alignment. Overlay them in one view with distinct colors. Delete the rejected alternative after approval.
- Keep the number of overlaid profiles reasonable. More than four or five in one view becomes hard to read, especially in printed sheets. Use bands and labels to convey data rather than adding more profile lines.

## Related

- [Surface profiles vs layout profiles](surface-vs-layout-profiles.md)
- [Profile views and bands](profile-views-and-bands.md)
- [Plan and profile sheets](../plan-production/plan-and-profile-sheets.md)
- [Corridor surfaces](../corridors/corridor-surfaces.md)
