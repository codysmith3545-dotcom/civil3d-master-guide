---
title: "Profile Views and Bands"
section: "civil3d/profiles"
order: 15
visibility: public
tags: [profile-view, band-set, datum, split-profile-view, stacked-profile-view]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEPROFILEVIEW, EDITPROFILEVIEWSTYLE, PROFILEVIEWPROPERTIES]
updated: 2026-05-06
---

> **TL;DR**
> 1. A **profile view** (`CREATEPROFILEVIEW`) is the grid/frame that displays one or more profiles. It is tied to one alignment and controls the station range, elevation range, vertical exaggeration, and grid appearance.
> 2. **Band sets** are data strips at the top or bottom of the profile view that show station, elevation, grade, cut/fill depth, pipe data, or superelevation in a tabular row synchronized with the profile-view scale.
> 3. Use **split profile views** for long alignments that won't fit on one sheet, or **stacked profile views** to show multiple profile views one above the other sharing a common station axis.

## Creating a profile view

1. Home tab > Profile & Section Views panel > Profile View > Create Profile View (`CREATEPROFILEVIEW`).
2. Select the alignment. The wizard opens with these pages:
   - **General** — name, style, station range (automatic or user-specified).
   - **Station Range** — override start/end stations if needed.
   - **Profile View Height** — datum option (see below) and minimum/maximum elevation controls.
   - **Profile Display Options** — pick which profiles to draw and in what style.
   - **Data Bands** — select a band set or build one.
   - **Pipe/Pressure Network** — optionally project pipe networks into the view.
3. Click Create Profile View. Pick an insertion point in the drawing.

## Datum options

The datum (bottom elevation of the grid) can be set in two ways:

- **Datum by value** — you supply a fixed elevation. The grid starts there regardless of profile shape. Good when you want consistent grid range across multiple views.
- **Datum by minimum elevation** — Civil 3D computes the lowest profile elevation in the view and drops the datum a specified distance below it. Adapts automatically but may shift if the profile is edited.

A common practice is to round the datum to the nearest 10 ft (or 5 m) below the lowest profile point so contour lines read cleanly.

## Vertical exaggeration

Profile views almost always use a vertical exaggeration to make grade changes visible. The default is 10:1 (10x vertical relative to horizontal). Adjust in the profile view style or properties. Common values:

- **10:1** — general roadway design.
- **5:1** — very steep terrain or short alignments.
- **20:1** — nearly flat grades (parking lots, taxiways).

Change it under Profile View Properties > Graph tab > Vertical Exaggeration.

## Band sets

Bands are the data rows beneath (or above) the profile view grid that tabulate data at each labeled station. They are configured through **band styles** and grouped into **band sets**.

### Common band types

| Band type | Shows | Typical use |
|---|---|---|
| Profile Data | Station and elevation of one or two profiles | EG elevation, FG elevation at every major station |
| Vertical Geometry | Grade-in, grade-out, curve length, K-value, PVI elevation | Vertical alignment tables on plan-profile sheets |
| Horizontal Geometry | Horizontal alignment geometry (tangent, curve, spiral data) | Cross-referencing horizontal geometry below the profile |
| Superelevation | Cross-slope and transition data | Roadway superelevation design |
| Pipe Network | Rim/invert elevations, pipe size | Utility profiles |
| Sectional Data | Cut/fill depths | Earthwork visualization |

### Configuring bands

1. Profile View Properties > Bands tab.
2. Pick a band set from the drop-down, or click the ellipsis to build one.
3. Add/remove bands, set the profile references (Profile 1, Profile 2), choose text height and row height.
4. The band set can be saved to the drawing settings and reused across profile views.

Band label text uses the same label-style system as other Civil 3D labels, so field codes, precision, and rounding follow the ambient settings hierarchy.

## Split profile views

For alignments that span thousands of feet, a single profile view may not fit at a readable scale on one sheet. Split profile views divide the alignment into segments displayed as stacked rows, each with its own datum, within a single profile-view object.

1. In the `CREATEPROFILEVIEW` wizard, choose the **Split Profile View** creation method.
2. Set the maximum view width (match your sheet's available space).
3. Set the gap between rows.
4. Civil 3D computes how many rows are needed and stacks them.

Split views share one band set across all rows. Station labels continue uninterrupted.

## Stacked profile views

Stacked profile views are separate profile-view objects placed one above the other, sharing a station axis. They are useful when you need different elevation ranges or different vertical exaggerations for each stack (for example, a sewer profile at a different scale than the road profile).

1. In the `CREATEPROFILEVIEW` wizard, choose the **Stacked Profile** creation method.
2. Define each view in the stack: which profiles appear, elevation range, height, and gap.
3. All views in the stack remain linked; moving one moves all.

## Updating profile views

Profile views react to changes in the underlying profiles and alignment. If a profile is edited, the profile-view geometry redraws. If bands reference that profile, band labels update.

To change the station range, elevation range, styles, or bands after creation, right-click the profile view > Profile View Properties (`PROFILEVIEWPROPERTIES`).

## Common gotchas

- **Profile view goes blank.** The datum or elevation range excludes the actual profile data. Widen the elevation range or switch to datum-by-minimum-elevation.
- **Bands show "???"** The band's Profile 1 or Profile 2 reference points to a deleted or renamed profile. Reassign in the Bands tab.
- **Vertical exaggeration mismatch.** If the plan sheet and profile sheet use different horizontal scales, the apparent exaggeration changes. Match the horizontal plot scale to the profile view's horizontal axis for consistent results.
- **Split view overlap.** When the alignment is extended, the split view may need to be recreated to add rows. Edit the station range in properties; Civil 3D adjusts the split.

## Related

- [Surface profiles vs layout profiles](surface-vs-layout-profiles.md)
- [Profile labels](profile-labels.md)
- [Multiple profiles in one view](multiple-profiles.md)
- [Plan and profile sheets](../plan-production/plan-and-profile-sheets.md)
