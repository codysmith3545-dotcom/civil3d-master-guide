---
title: "CreateProfileView"
section: "civil3d/commands"
order: 232
visibility: public
command: CreateProfileView
category: profiles
ribbon: "Home tab > Profile & Section Views panel > Profile View > Create Profile View"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreateProfileFromSurface, CreateProfileLayout, EditProfileGeometry]
symptoms:
  - "How do I create the grid window where profiles are drawn?"
  - "How do I split a long alignment into multiple profile views for sheets?"
  - "How do I add bands (offset, station, slope) below a profile view?"
  - "Why are my profiles not showing in the new profile view?"
  - "How do I set vertical exaggeration?"
tags: [profile-view, station, exaggeration, bands, sheet-friendly]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Creating Profile Views"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-A6B4E64A-2B7F-4B38-A8E4-A8B58B5E9F8A
    verified: 2026-05-06
---

> **TL;DR**
> 1. Creates the grid view that displays profiles. Single view or staggered multiple views (sheet-friendly).
> 2. Wizard pages: General, Station Range, Profile View Height, Profile Display Options, Pipe/Pressure Network Display, Data Bands, Profile Hatch Options.
> 3. Choose **Multiple Profile Views** to chunk by station length per view (matches sheet template).

## When to use

After EG profile exists and before drawing FG. Or to add a sheet-sized profile view at a specific station range.

## Workflow

1. Run `CreateProfileView` (Home ribbon → **Profile View** → **Create Profile View**).
2. Pick the **alignment**.
3. Set the **Profile View Style** (e.g., Major-Minor with 1 ft / 5 ft grid).
4. Wizard → **Station Range** — automatic uses full alignment; **User specified** for sheet-bound ranges.
5. Wizard → **Profile View Height** — automatic or user-set; if automatic, lock min/max with rounding to integers (`+/-` 5 ft).
6. Wizard → **Data Bands** — pick a band set (e.g., EG/FG elevations, station ticks).
7. Wizard → finish; pick the insertion point in model space.

For sheet-bound multiple views, use **Create Multiple Profile Views** instead and define length per view (matches sheet length, e.g., **300 ft per sheet**).

## Common gotchas

- Vertical exaggeration is a property of the **profile view style**, not the wizard — pick the right style or duplicate one.
- Bands reference profiles by name. If you add a profile after the view is created, edit the band set to reference it.
- For multi-view runs, the spacing between views should match the layout viewport spacing in your sheet template.
- Pipe and pressure network display in the wizard only shows networks already drawn in the profile view; networks added later need editing here.

## Related commands

- [CreateProfileFromSurface](createprofilefromsurface.md)
- [CreateProfileLayout](createprofilelayout.md)
- [EditProfileGeometry](editprofilegeometry.md)
