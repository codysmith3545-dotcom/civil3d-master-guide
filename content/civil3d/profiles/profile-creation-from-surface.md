---
title: "Profile Creation From Surface"
section: "civil3d/profiles"
order: 14
visibility: public
tags: [profile, surface-profile, sample, offset-profile, alignment]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateProfileFromSurface, CreateProfileView, CreateSuperimposedProfile, EditProfileGeometry]
updated: 2026-05-11
sources:
  - title: Autodesk Civil 3D 2025 Help — Creating Surface Profiles
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-7E1F2A3B-4C5D-6E7F-8A9B-0C1D2E3F4A5B
    verified: 2026-05-11
  - title: Autodesk Civil 3D 2025 Help — Sampling Offsets
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-1B2C3D4E-5F6A-7B8C-9D0E-1F2A3B4C5D6E
    verified: 2026-05-11
---

> **TL;DR**
> 1. **Create Profile from Surface** samples one or more surfaces along an alignment and writes them as profiles tied to the alignment (data shortcut-able).
> 2. Use **offsets** in the same dialog to sample parallel profiles at fixed left/right distances (curb, ROW, ditch).
> 3. The resulting profiles update **automatically** when the alignment or surface changes; for a frozen snapshot, use **Create Superimposed Profile** or copy to a static profile.

## Launch the dialog

Ribbon **Home > Create Design > Profile > Create Surface Profile** (command: `CreateProfileFromSurface`).

The **Create Profile from Surface** dialog opens. Set:

- **Alignment** — pick the alignment to sample along. Defaults to the active or last-used alignment.
- **Station range** — defaults to the alignment full extents; override to limit sampling.
- **Select surfaces** — pick one or more surfaces from the list (Ctrl-click for multiple).
- **Sample offsets** — check to add parallel left/right offset profiles in one operation.

Click **Add** to add each surface (and offset) to the profile list. Each addition becomes a row showing the surface, offset, profile name, style, and update mode.

## Sample multiple surfaces

In the same dialog, repeat **Add** for each surface you want to track. Common combination on a road project:

- EG (existing ground)
- Existing pavement (where present)
- Final design surface (linked back from the corridor)
- Subgrade surface

After sampling, all profiles attach to the same alignment and can render in one or more profile views.

## Offset profiles

In the **Sample offsets** section:

1. Check the box to enable.
2. Enter offsets in the **Sample offsets** field as a comma-separated list, e.g., `-12, 12, -25, 25`. Negative is left, positive is right.
3. Each offset becomes a separate profile (e.g., `EG - Left 12.00`, `EG - Right 12.00`).
4. The offsets sample the **selected surface** at the parallel offset along the alignment.

Use offset profiles for curb-line elevations, ROW grades, or to inspect cross-fall along a corridor without building section views.

## Profile view

After **Draw in profile view**, Civil 3D launches the **Create Profile View** wizard:

1. Pick the alignment (preset).
2. **Station range** — full or user.
3. **Profile view height** — automatic or user-specified.
4. **Profile display options** — toggle which profiles draw, choose the style and label set per profile.
5. **Pipe/Pressure network display** — optional crossing-pipe overlay.
6. **Data bands** — pick a band set.
7. **Profile hatch options** — cut/fill hatch between two profiles.

Click **Create Profile View** and pick an insertion point.

## Update behavior

Surface profiles are **dynamic**. They re-sample when:

- The alignment geometry changes.
- The surface is rebuilt or its data changes.
- The sample station range is edited.

To freeze a profile (e.g., to preserve an as-bid existing-ground profile), copy the profile to a layout profile, or create a separate alignment for that station range.

## Superimposed profiles

To draw a profile from one alignment inside another alignment's profile view, use **Create Superimposed Profile** (command: `CreateSuperimposedProfile`). The superimposed profile is a non-editable graphical overlay; the source profile remains the master.

Useful for:

- Showing a side-street profile inside a mainline profile view.
- Comparing two design profiles without redoing geometry.

## Common errors

- **"Surface does not cover the alignment"** — the alignment extends past the surface boundary; trim the alignment or extend the surface boundary.
- **Profile is jagged** — surface triangulation is coarse; rebuild the surface, add breaklines, or sample at smaller intervals (set on Profile properties).
- **Offsets don't appear** — the **Sample offsets** checkbox was unchecked when **Add** was clicked; remove rows and re-add with offsets enabled.
- **Profile won't update after surface rebuild** — the surface is in a referenced DWG that wasn't reloaded; right-click the surface > **Reload**.
- **Datum/elevation looks wrong** — the alignment crosses surface holes; the profile shows gaps. Patch the surface first.

## Related

- [Surface profiles vs layout profiles](surface-vs-layout-profiles.md)
- [Layout profile design](layout-profile-design.md)
- [Profile view styles](profile-view-styles.md)
- [Profile labels and bands](profile-labels-and-bands.md)
- [Multiple profiles in one view](multiple-profiles.md)
