---
title: "CreateProfileFromSurface"
section: "civil3d/commands"
order: 230
visibility: public
command: CreateProfileFromSurface
category: profiles
ribbon: "Home tab > Create Design panel > Profile > Create Surface Profile"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreateProfileLayout, CreateProfileView, EditProfileGeometry]
symptoms:
  - "How do I sample existing ground along an alignment?"
  - "How do I add an offset profile (e.g., 12 ft left)?"
  - "Why is my surface profile not showing in the profile view?"
  - "How do I update a surface profile after the surface changes?"
  - "Can I sample multiple surfaces at once?"
tags: [profiles, surface-profile, sample, eg, existing-ground]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Creating a Profile from a Surface"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-8EAB2A1A-77B7-4DD3-8EE5-DAFA9F4C1E66
    verified: 2026-05-06
---

> **TL;DR**
> 1. Samples one or more surfaces along an alignment and creates a "surface" type profile (existing ground).
> 2. Pick the alignment, pick the surface(s), optionally add offsets to the left/right, then **Add** and **Draw in profile view**.
> 3. The profile is linked to the surface — when the surface rebuilds, the profile updates.

## When to use

Always at the start of a profile workflow — you need an EG line to design against. Also for offset surface profiles (e.g., -12 ft left of centerline) used to check ditch grade or sidewalk slope.

## Workflow

1. Run `CreateProfileFromSurface` (Home ribbon → **Profile** → **Create Surface Profile**).
2. Pick the **alignment** (defaults to the most recent).
3. Highlight the **surface(s)** to sample (existing ground, sometimes multiple LiDAR layers).
4. Optionally add **sample offsets**: enter `12` then **Add** for a +12 ft offset, repeat for `-12`.
5. Click **Add** to put each surface/offset combination into the profile list.
6. With the profile list populated, click **Draw in profile view** if you have no profile view yet, or **OK** to just create the profile (no view).
7. The profile is listed under the alignment's Profiles branch and shows in any profile view of that alignment.

## Common gotchas

- A surface profile only samples within the alignment station range. Extend the alignment if you need more EG.
- Offsets sample the same surface laterally — they don't follow an offset alignment. For offset-alignment-based profiles, run this command on the offset alignment.
- A surface profile is tied to the alignment. Reverse the alignment direction and the profile flips with it.
- If the sampled surface has holes (boundary cutouts) along the alignment path, the profile will have gaps at those stations.

## Related commands

- [CreateProfileLayout](createprofilelayout.md)
- [CreateProfileView](createprofileview.md)
- [EditProfileGeometry](editprofilegeometry.md)
