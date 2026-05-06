---
title: "EditProfileGeometry"
section: "civil3d/commands"
order: 233
visibility: public
command: EditProfileGeometry
category: profiles
ribbon: "Profile contextual ribbon > Modify Profile panel > Geometry Editor"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreateProfileLayout, CreateProfileFromSurface, CreateProfileView]
symptoms:
  - "How do I change PVI station, elevation, or K-value on an existing profile?"
  - "Why are my PVI grips not moving the way I expect?"
  - "How do I add a vertical curve between two existing PVIs?"
  - "How do I see the K-value report for the profile?"
  - "How do I clear or review design-criteria warnings?"
tags: [profiles, edit, pvi, k-value, design-criteria]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Editing Profile Geometry"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-1A63DD58-A2DA-4D46-9DE6-4E6E2CFD3AAC
    verified: 2026-05-06
---

> **TL;DR**
> 1. Reopens the Profile Layout Tools toolbar against an existing profile for sub-entity edits.
> 2. The PVI Editor lists every PVI by station/elevation; numeric edits are safer than dragging grips.
> 3. Design checks evaluate every change in real time — Panorama Events shows current violations.

## When to use

When a designed profile needs revisions: PVI elevation tweak, curve length change, regrade for cover, sag-curve K change to fix headlight sight distance.

## Workflow

1. Select the profile in the profile view, then click **Geometry Editor** on the contextual ribbon.
2. The Profile Layout Tools toolbar opens; click **Profile Grid View** to open the PVI editor (Panorama).
3. Edit columns: PVI station, PVI elevation, curve type, curve length or K.
4. Insert PVIs with the **Insert PVIs - Tabular** tool, or delete with **Delete PVI**.
5. To replace a curve, delete it and place a new free vertical curve with the desired type (parameter, length, through point).
6. Watch the Events tab for criteria violations; if the design speed warrants relaxing, change design speed instead of suppressing warnings.
7. Close the toolbar; downstream corridor regions mark out-of-date until rebuild.

## Common gotchas

- Dragging PVI grips is convenient but rounds station/elevation to drawing precision; for 0.01 ft elevation control, type into the PVI editor.
- A free vertical curve disappears if you delete one of its bordering tangents — that's the "free" behavior. Plan deletions accordingly.
- Profile design checks reuse the alignment's design criteria file. If the alignment has none attached, no profile checks fire.
- Editing a referenced profile (data shortcut reference) is read-only; edits must be done in the source drawing.

## Related commands

- [CreateProfileLayout](createprofilelayout.md)
- [CreateProfileFromSurface](createprofilefromsurface.md)
- [CreateProfileView](createprofileview.md)
