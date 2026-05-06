---
title: "Plan and Profile Sheets"
section: "civil3d/plan-production"
order: 25
visibility: public
tags: [plan-profile, sheet, viewport, alignment, profile-view, plan-production]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEVIEWFRAMES, CREATESHEETS, CREATEPROFILEVIEW, MVIEW]
sources:
  - title: "Autodesk Civil 3D Help — Plan and Profile Sheets"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-E3B5D7F3-7E5D-4F3B-8E5D-D3F7E5B3D7E5"
updated: 2026-05-06
---

> **TL;DR**
> 1. A **plan-and-profile sheet** shows the plan view (aerial/map) in the top viewport and the profile view (vertical grade line on a grid) in the bottom viewport. The station range in both viewports matches, so the reader can cross-reference horizontally.
> 2. The end-to-end workflow is: create the alignment and profile, create a profile view, create view frames along the alignment, then use `CREATESHEETS` to generate layouts with plan and profile viewports from a DWT template.
> 3. Matching the plan and profile stationing requires the plan viewport and profile view to share the same horizontal scale. The DWT template must have the viewports pre-positioned and sized for this alignment.

## End-to-end workflow

### Prerequisites

Before creating plan-and-profile sheets, the following must exist in the drawing:

- A horizontal **alignment** defining the route.
- One or more **surface profiles** (existing ground) along the alignment.
- A **layout profile** (design grade line) on the alignment.
- An existing-ground **surface** for plan display.
- A **profile view style** and **band set** configured for the sheets.
- A **DWT template** with the sheet layout (title block, plan viewport, profile viewport). See [Sheet templates](sheet-templates.md).

### Step 1: Create view frames

Run `CREATEVIEWFRAMES`. Select the alignment, set the station range, sheet size, and scale. On the Profile Views page, configure the profile view that will appear in each sheet's profile viewport.

Civil 3D creates:

- A view frame group (rectangles in model space along the alignment).
- Match lines between adjacent frames.
- A profile view for each view frame, sized to the frame's station range.

### Step 2: Create sheets

Run `CREATESHEETS`. Select the view frame group. Choose whether to create all sheets in one DWG or separate files. Civil 3D generates:

- A layout tab for each view frame.
- A plan viewport aimed at the view frame's extents.
- A profile viewport aimed at the corresponding profile view.
- Title-block fields populated from the SSM.

### Step 3: Verify alignment of plan and profile

Open each layout. Confirm:

- The plan viewport shows the correct station range of the alignment.
- The profile viewport shows the same station range.
- The horizontal scale of the plan viewport matches the horizontal axis scale of the profile view. If both are at 1" = 50', a station on the plan aligns vertically with the same station on the profile below.

If the profile view's horizontal scale does not match the plan viewport's plot scale, the stationing will not align. This is set in the profile view style (Horizontal Scale = the reciprocal of the plot scale factor).

## Viewport configuration

### Plan viewport

- Displays model space through a clipping boundary that matches the view frame rectangle.
- Annotation scale matches the plot scale (e.g., 1:600 for 1" = 50').
- Layer visibility can be controlled per viewport (VP Freeze) to show only plan-relevant layers.

### Profile viewport

- Displays the profile view object (which lives in model space, typically below or beside the plan data).
- The viewport is sized so the profile view's full station range and elevation range fit within the viewport boundary.
- The profile view's vertical exaggeration and text sizes are calibrated for the sheet's plot scale.

### Locked viewports

After creation, both viewports should be locked to prevent accidental zoom/pan:

1. Select the viewport border.
2. Right-click > Display Locked > Yes.

If a viewport is accidentally unlocked and zoomed, the scale changes and the plan-profile station alignment breaks. Use UNDO immediately, or re-aim the viewport at the view frame/profile view.

## Tips for matching plan and profile stationing

- The profile view's horizontal axis must be in the same units and at the same scale as the plan viewport. For a 1" = 50' plot: plan viewport scale = 1:600, profile view horizontal scale = 1:600 (no independent exaggeration on the horizontal axis; vertical exaggeration is separate).
- The DWT template must have the plan and profile viewports horizontally aligned and at the same width. If one viewport is wider than the other, the station ticks will not line up.
- Use the "Plan & Profile" sheet-creation method in the `CREATEVIEWFRAMES` wizard, which automates this alignment.
- If the profile view includes bands below the grid, account for the band height when sizing the profile viewport. Bands that extend below the viewport boundary will be clipped.

## Adding additional viewports

Some sheets require extra viewports:

- **Detail viewport** — a small viewport showing an enlarged view of a specific area (intersection detail, drainage structure).
- **Key map viewport** — a small-scale overview showing the project extent with the current sheet area highlighted.

Add these manually in paper space using `MVIEW`. Set their scale and lock them.

## Common issues

| Issue | Cause | Fix |
|---|---|---|
| Profile does not match plan stationing | Viewport scales are different | Set both viewports to the same horizontal scale |
| Profile view is clipped at the bottom | Profile viewport is too small for the profile view + bands | Resize the viewport or reduce band count |
| Match-line labels show "???" | Sheet association is broken | Regenerate sheets or re-associate view frames |
| Title block fields are blank | SSM custom properties not set | Open SSM > set project properties |
| Viewport shows wrong area | Viewport was unlocked and panned | UNDO, or re-aim the viewport |

## Related

- [View frame groups](view-frame-groups.md)
- [Match lines](match-lines.md)
- [Sheet sets and the Sheet Set Manager](sheet-sets.md)
- [Profile views and bands](../profiles/profile-views-and-bands.md)
- [Sheet templates (DWT)](sheet-templates.md)
