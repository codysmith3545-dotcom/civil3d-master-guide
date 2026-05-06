---
title: "Surface Labels and Contours"
section: "civil3d/surfaces"
order: 50
visibility: public
tags: [surfaces, labels, contours, spot-elevation, slope-label, annotation]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [ADDSURFACELABEL, ADDSURFACESPOTELEV, ADDSURFACESLOPELABEL, EDITSURFACESTYLE, SURFACEPROPERTIES]
updated: 2026-05-06
---

> **TL;DR**
> 1. Contour intervals are set in two places: the **surface style** (which contour components are visible and their smoothing) and **surface properties** (the numeric interval values). Both must agree or contours look wrong.
> 2. Label contours with `ADDSURFACELABEL` > Contour (single or multiple). Spot elevations and slope labels are separate label types on the Annotate ribbon.
> 3. Style controls everything. A contour label style defines text height, precision, mask, orientation (plan-readable vs contour-following), and whether the label reads uphill.

## Contour display: style vs properties

Civil 3D splits contour configuration between two dialogs, which is a common source of confusion.

### Surface properties (interval values)

Right-click the surface > Surface Properties > Analysis tab:

- **Major contour interval** — typically 5 ft or 10 ft for topographic work; 2 ft or 5 ft for site grading.
- **Minor contour interval** — subdivides majors, commonly 1 ft or 2 ft.
- **User-defined contour intervals** — additional contours at arbitrary elevations (e.g., a flood-plain elevation).

These values control which contour lines Civil 3D generates. The surface must be built (have vertex data) before contours appear.

### Surface style (display and smoothing)

Edit the surface style (Settings > Surface > Surface Styles > right-click > Edit):

- **Display tab** — toggle Major Contour, Minor Contour, and User Contour components on or off per viewport (Plan, Model, Profile, Section).
- **Contours tab** — contour smoothing (True or Spline), contour base elevation (shift contours by an offset), depression mark settings, contour padding (extend contours to the surface boundary), and index contour frequency (every Nth contour is treated as major).
- **Smoothing**: True smoothing adds interpolated points to contour polylines for a rounder appearance. Higher values produce smoother curves but may shift contours away from actual data. A value of 0 disables smoothing.

If contours are invisible despite correct intervals, check the Display tab — the component may be off, or the layer may be frozen.

## Contour labels

### Adding contour labels

1. Annotate ribbon > Add Labels > Surface > Contour (single or multiple).
2. For **Contour – Single**, click a contour line. The label attaches at the pick point.
3. For **Contour – Multiple**, draw a line across the surface. Labels appear at every contour crossing along that line, evenly spaced.

### Contour label style components

A contour label style (Settings > Surface > Label Styles > Contour) contains:

- **Text component** — expression is typically `{Surface Contour Elevation}` with precision set to match the drawing's vertical accuracy (usually 1 ft for topo, 0.1 ft for grading).
- **Orientation** — Plan Readable (always right-reading) or Contour Following (text follows the contour curve with a gap). Most civil plan sets use plan-readable.
- **Readability bias** — "Uphill" forces the text to read in the direction of increasing elevation, the conventional orientation.
- **Background mask** — enabled by default so the label is legible where it crosses other contours or linework.
- **Dragged state** — what happens when the label is grip-dragged away from the contour. Typically a leader line back to the contour.

## Spot elevation labels

Spot elevations label the surface elevation at a picked point.

1. Annotate ribbon > Add Labels > Surface > Spot Elevation.
2. Pick a point on the surface. The label displays the interpolated elevation.

Spot elevation label styles can show:

- Elevation to a specified decimal precision.
- A marker symbol (cross, circle, triangle) at the labeled point.
- Different text for cut vs fill when referencing a comparison surface.

Use spot elevations at critical design points: building corners, inlet rims, high/low points, curb returns, phase boundaries.

## Slope labels

Slope labels display the gradient between two picked points or across a triangle face.

1. Annotate ribbon > Add Labels > Surface > Slope.
2. Two modes:
   - **Two-point slope** — pick two points on the surface; the label shows the slope between them.
   - **One-point slope** — pick a single point; the label shows the slope of the triangle face at that location.
3. Slope is displayed as percent, ratio, or degrees depending on the label style.

Slope labels are useful for verifying ADA compliance (max 5 % cross-slope on accessible routes, max 8.33 % running slope on ramps), parking lot drainage (min 1 %–2 %), and embankment grades.

## Label tips

- **Frequency**: label every index contour (major) at a minimum. On busy plan sheets, label only major contours and add spot elevations at key features.
- **Collision avoidance**: Civil 3D 2024+ has improved label collision detection. For earlier versions, manually adjust labels with grip editing or use AECC label groups.
- **Annotation scale**: contour labels should be set to use Annotative scaling so they resize correctly across viewports at different scales.
- **Stacking**: avoid overlapping contour labels by spacing the multiple-label line perpendicular to contour runs, not along them.

## Related

- [Surface analysis](surface-analysis.md)
- [Building a TIN surface](building-a-tin-surface.md)
- [Troubleshooting surfaces](troubleshooting-surfaces.md)
