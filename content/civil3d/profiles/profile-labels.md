---
title: "Profile Labels"
section: "civil3d/profiles"
order: 30
visibility: public
tags: [profile-label, grade-break, station-elevation, label-set, vertical-curve-label]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [ADDPROFILELABELS, EDITLABELSTYLE, PROFILELAYOUTPARAMS]
sources:
  - title: "Autodesk Civil 3D Help — Profile Labels"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-7F174D4E-3B4F-45E6-87E7-E8A9E2E8F6E5"
updated: 2026-05-06
---

> **TL;DR**
> 1. Profile labels annotate key geometry on layout and surface profiles: **grade breaks**, **station-elevation** points, **crest/sag curves** (K, length, high/low point), and **design speed** notations.
> 2. Labels can be added individually (`ADDPROFILELABELS`) or automatically via **label sets** applied in profile properties, which stamp every geometric event at once.
> 3. Label styles control content, orientation, and anchoring; they use the same component-based editor as all Civil 3D label styles (text, lines, blocks, dragged-state behavior).

## Label types for profiles

### Grade break labels

Grade break labels appear at PVIs where two tangent grades meet without a vertical curve. They typically show:

- Station
- Elevation
- Grade-in (%) and grade-out (%)

These labels anchor to the PVI point and rotate to bisect the angle between the two tangent grades, or remain horizontal depending on the style.

### Station-elevation labels

A general-purpose label placed at any point on a profile (not necessarily a geometric event). Useful for:

- Labeling a specific spot elevation on an existing-ground profile.
- Annotating a match point where two profiles meet.
- Marking a structure crossing.

Add with Annotate tab > Labels & Tables > Add Labels > Profile > Station Elevation.

### Crest and sag curve labels

These labels annotate vertical curves and typically display:

- Curve length (L)
- K-value
- Grade-in and grade-out
- PVC station and elevation
- PVT station and elevation
- High or low point station and elevation (when it exists within the curve)
- Design speed (if a criteria file is assigned)

The label anchors at the PVI (or mid-curve, depending on style) and can include multiple text components arranged in a table-like layout.

### Design speed labels

When a design criteria file (AASHTO policy or custom) is assigned to the profile, Civil 3D can label the design speed at each curve. These labels reference the criteria check parameters and can show passing or failing status.

## Adding labels

### Individual labels

1. Annotate tab > Labels & Tables > Add Labels (`ADDPROFILELABELS`).
2. Feature: Profile. Label type: choose from Grade Break, Station Elevation, Crest Curve, Sag Curve, or Line (tangent segments).
3. Pick the profile view, then click the location on the profile to place the label.

### Label sets

A label set automatically applies a combination of label styles to every geometric event on a profile. To use one:

1. Select the profile > Properties > Labels tab.
2. Choose a label set from the drop-down (or create one).
3. The set defines which label style applies to each event type: tangent segments, grade breaks, crest curves, sag curves, and line segments.

Label sets save time on production drawings. A typical road-design label set includes:

- Grade break labels at every PVI without a curve.
- Crest/sag curve labels at every vertical curve.
- No tangent labels (to avoid clutter).

### Resetting labels

If label positions become cluttered after profile edits, right-click the profile > Reset Labels. All labels return to their default anchor positions.

## Label style anatomy

Profile label styles use the standard Civil 3D label-style editor (Edit Label Style):

- **Layout tab** — add text components, lines, blocks, ticks. Each component has an anchor point (profile geometry) and offsets.
- **General tab** — layer, visibility, plan-readability flip, orientation reference (profile view or world).
- **Dragged State tab** — controls the leader and frame appearance when a user drags the label away from its anchor.

### Useful expression properties for profile labels

| Property | Description |
|---|---|
| `Station Value` | Alignment station at the label location |
| `Profile Elevation` | Profile elevation at the label station |
| `Grade In` / `Grade Out` | Tangent grade entering/exiting the PVI (%) |
| `Vertical Curve Length` | L of the fitted curve |
| `K Value` | K = L / A |
| `High/Low Point Station` | Station of the curve's extreme point |
| `High/Low Point Elevation` | Elevation of the curve's extreme point |

## Tips

- When labeling both an existing-ground profile and a design profile in the same view, use contrasting label styles (different colors, different text heights) to avoid confusion.
- Keep label text height at half or two-thirds of the profile view's text height so labels don't overpower the grid.
- For plan-profile sheets, the vertical geometry band at the bottom of the profile view often duplicates the information in crest/sag labels. Decide which to use; showing both can be redundant.
- Labels reference the profile's ambient settings for precision, rounding, and unit display. Change these at the drawing level (Settings tab > Profile > Label Styles) to affect all labels at once.

## Related

- [Profile views and bands](profile-views-and-bands.md)
- [Vertical curve design](vertical-curve-design.md)
- [Editing profiles](editing-profiles.md)
- [Plan and profile sheets](../plan-production/plan-and-profile-sheets.md)
