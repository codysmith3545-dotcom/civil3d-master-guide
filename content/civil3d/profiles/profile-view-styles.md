---
title: "Profile View Styles"
section: "civil3d/profiles"
order: 22
visibility: public
tags: [profile-view, profile-view-style, band-set, datum, station-grid, elevation-grid]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateProfileView, EditProfileViewStyle, EditBandSet, ProfileViewProperties]
updated: 2026-05-11
sources:
  - title: Autodesk Civil 3D 2025 Help — Profile View Styles
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-5C6DD64E-1E2A-4D1A-B1D4-1A5C5F92E3F7
    verified: 2026-05-11
  - title: Autodesk Civil 3D 2025 Help — Profile View Bands
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-93D9F2E6-9A0E-4F4A-B7C7-7A2D6F1E4A53
    verified: 2026-05-11
---

> **TL;DR**
> 1. A **profile view style** controls the grid, axes, datum, vertical exaggeration display, and title block of the rectangle that contains profiles; it does not draw the profile itself (that's the **profile style**).
> 2. **Band sets** stack horizontal bands above and below the grid that show station, elevation, grade, cut/fill, and pipe data along the profile.
> 3. Standardize one profile view style per sheet type (plan-and-profile, profile-only, intersection blowup) so every sheet matches the title block and the band heights add up to a fixed margin.

## Where styles live

**Toolspace > Settings > Profile View > Profile View Styles**. Right-click > **New** to create or copy. The dialog has tabs:

- **Information** — name and description.
- **Graph** — vertical exaggeration display (does not change geometry, only labels), profile-view direction.
- **Grid** — clip behavior at the data area, vertical/horizontal grid clipping at first profile vs at full extents.
- **Title Annotation** — title text, position, style.
- **Horizontal Axes** — top and bottom axes: ticks, intervals, labels.
- **Vertical Axes** — left and right axes: ticks, intervals, labels, datum.
- **Display** — visibility and layer of each component.
- **Summary** — read-only roll-up.

## Station grid (horizontal axis)

On the **Horizontal Axes** tab:

- Pick **Top** or **Bottom**.
- **Major interval** sets the major tick spacing (e.g., 100 ft).
- **Minor interval** sets minor ticks within each major (e.g., 50 ft).
- **Tick justification** controls where tick labels render (above/below the axis).
- The **Annotation** sub-section formats the station label (precision, prefix, suffix).

## Elevation grid (vertical axis)

On the **Vertical Axes** tab:

- **Major** and **minor** intervals (e.g., 5 ft major, 1 ft minor).
- **Round elevations to** for the displayed datum.
- **Tick alignment** (inside, outside, both).

## Datum

The **datum elevation** is the bottom of the grid. Two strategies:

- **Automatic** — Civil 3D picks the lowest profile elevation rounded down to the major interval. Use this for design profiles where the elevation range varies sheet to sheet.
- **User-specified** — set on the **Profile View Properties > Elevations** tab (not on the style). Use this when every plan sheet must share the same datum across a corridor.

## Vertical exaggeration

Civil 3D stores a single horizontal scale per drawing (Drawing Settings) and the profile view's vertical scale. The exaggeration ratio displayed in the style is informational. Change vertical scale on **Profile View Properties > Information** (or via **Edit Drawing Settings**).

Common ratios:

- 10:1 (1 in horizontal = 1 in vertical at 10x) for small civil sites.
- 5:1 for roadway plans at 1"=50' horizontal, 1"=10' vertical.
- 1:1 for cross-sections.

## Band sets

A **band set** is the stack of bands attached to a profile view. Bands are not part of the profile view style; they are managed on **Profile View Properties > Bands** tab.

Common band types:

| Band type | Shows |
|---|---|
| Profile data | Existing-ground elevation, design elevation, difference, station |
| Vertical geometry | PVI station/elevation, curve length, K-value, grade in/out |
| Horizontal geometry | Curve PI, deflection, radius |
| Superelevation | Cross-slope at the alignment edge |
| Sectional data | Sample-line stations and offsets |
| Pipe network | Inverts, rim, slope for crossing pipes |
| Pressure network | Inverts and pressure pipe data |

To save a stack as reusable, on the Bands dialog choose **Save as Band Set** and give it a name. The band set then appears under **Settings > Profile View > Band Sets**.

## Building a sheet-friendly style

Recipe for a 24x36 plan-and-profile:

1. **Profile View Style** with grid clip set to clip at first profile (avoids the grid extending below the EG line off the bottom of the sheet).
2. Major vertical interval 5 ft, minor 1 ft, datum elevation rounded to nearest 5 ft.
3. Major horizontal interval matching plan station ticks (100 ft).
4. Title annotation positioned outside the grid frame.
5. Band set with: existing-ground elevation, design elevation, station, vertical geometry. Total band height set so the entire profile view fits the bottom half of the sheet.

## Common errors

- **Bands overlap or extend off the sheet** — total band height (sum of band thicknesses) exceeds available margin; trim band heights or remove a band.
- **Datum jumps each sheet** — using automatic datum; set a fixed datum per sheet on Profile View Properties.
- **Grid lines clutter under the EG profile** — turn on **Clip vertical grid at first profile** in the style.
- **Vertical exaggeration looks wrong** — Drawing Settings > Object Layers > Profile View vertical scale is mismatched with the horizontal plot scale; reset both.
- **Tick labels at wrong precision** — Annotation precision is set on each axis; check both top and bottom.

## Related

- [Profile views and bands](profile-views-and-bands.md)
- [Profile creation from surface](profile-creation-from-surface.md)
- [Profile labels and bands](profile-labels-and-bands.md)
- [Layout profile design](layout-profile-design.md)
