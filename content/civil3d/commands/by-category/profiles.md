---
title: "Profile commands"
section: "civil3d/commands/by-category"
order: 50
visibility: public
tags: [commands, profiles, profile-view, vertical-curves, vertical-geometry]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. A profile is a vertical line along an alignment. It can be sampled from a surface or designed by layout (PVIs and curves).
> 2. A profile view is the grid window that displays one or more profiles for a given alignment.
> 3. Design checks compare K-values, grades, and curve lengths against the design criteria attached to the alignment.

## Commands in this category

- `CreateProfileFromSurface` — see [createprofilefromsurface.md](../createprofilefromsurface.md)
- `CreateProfileLayout` — see [createprofilelayout.md](../createprofilelayout.md)
- `CreateProfileView` — see [createprofileview.md](../createprofileview.md)
- `EditProfileGeometry` — see [editprofilegeometry.md](../editprofilegeometry.md)
- `ProfileProperties` — change band sets, reference profile, design criteria.
- `EditProfileView` — change axis limits, vertical exaggeration, gridlines.
- `CreateMultipleProfileViews` — chunk a long alignment into per-sheet views.
- `CreateSuperimposedProfile` — overlay another alignment's profile on this view.

## Typical workflow

1. `CreateProfileFromSurface` to pull existing ground from your TIN.
2. `CreateProfileView` to display it.
3. `CreateProfileLayout` for the design profile (FG); use design criteria + check sets.
4. Iterate with `EditProfileGeometry` until grades and K-values are within rule.
5. Add band sets (offsets, design speed, station/elevation) under profile-view properties.

## Related

- [Alignment commands](alignments.md)
- [Corridor commands](corridors.md)
- [Vertical curve calculator](../../../engineering/roadway-design/vertical-curves.md)
- [Plan production commands](plan-production.md)
