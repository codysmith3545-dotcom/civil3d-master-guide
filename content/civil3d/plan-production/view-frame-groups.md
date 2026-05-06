---
title: "View Frame Groups"
section: "civil3d/plan-production"
order: 10
visibility: public
tags: [view-frame, view-frame-group, plan-production, sheet-layout, alignment]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEVIEWFRAMES, EDITVIEWFRAMEGROUP, VIEWFRAMEPROPERTIES]
sources:
  - title: "Autodesk Civil 3D Help — View Frames"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-4B5D7E3F-3F5E-4D3E-8B5D-E7F5D3B7E5A3"
updated: 2026-05-06
---

> **TL;DR**
> 1. **View frames** are rectangular regions placed along an alignment that define the plan extents of each sheet. The `CREATEVIEWFRAMES` wizard generates them automatically based on sheet size, scale, and overlap settings.
> 2. A **view frame group** is the collection of all view frames for one alignment. It also generates **match lines** at the boundaries between adjacent frames.
> 3. View frames are the starting point for the plan-production workflow: create view frames, then create sheets from them. Each view frame becomes one sheet with a viewport aimed at that frame's extents.

## The CreateViewFrames wizard

1. Output tab > Plan Production panel > Create View Frames (`CREATEVIEWFRAMES`).
2. The wizard walks through these pages:

### Alignment page

- Select the alignment that the view frames will follow.
- Specify the station range: entire alignment or a subset.

### Sheets page

- **Template for plan and profile sheet** — browse to the DWT file that contains the sheet layout. This template defines the viewport positions and sizes.
- **Sheet size** — the wizard reads the DWT's paper size, or you can specify manually. Common U.S. sizes: 22 in x 34 in (ANSI D) or 24 in x 36 in (ARCH D).
- **Plot scale** — the horizontal scale for the plan view. Common values: 1" = 50' (1:600) for final design, 1" = 100' (1:1200) for preliminary.

The wizard calculates how many feet of alignment fit in one view frame based on the sheet width, viewport width, and plot scale.

### View Frame Group page

- **Name** — descriptive name for the group (e.g., "Main St Plan-Profile Sheets").
- **View frame style** — controls how the frames appear in the plan drawing (rectangle with label).
- **Label style** — how each frame is labeled (typically with sheet number and station range).

### Match Lines page

- **Positioning** — match lines are placed at the station where one view frame ends and the next begins.
- **Left/right offset** — how far the match line extends on each side of the alignment.
- **Style and label** — match line appearance and label content (station, sheet number). See [Match lines](match-lines.md).

### Profile Views page

If creating plan-and-profile sheets, this page configures the profile view that will be generated for each sheet:

- **Profile view style** — the grid, datum, and label settings.
- **Band set** — which data bands appear below the profile.
- **Profile display options** — which profiles to draw (EG, design, etc.).

## View frame objects in the plan

After creation, view frames appear as labeled rectangles overlaid on the plan drawing, centered on the alignment. Each frame:

- Has a unique number (1, 2, 3, ...).
- Shows its station range.
- Can be selected and moved (though moving disrupts the sheet relationship).
- Has a match line at each shared boundary with an adjacent frame.

The frames are Civil 3D objects that live on a dedicated layer. They do not plot by default (their style controls visibility and plotting).

## Overlap between frames

The wizard allows an **overlap** distance at each end of adjacent frames. Overlap ensures that features near the frame boundary appear on both sheets, making it easier to read across the match line. A typical overlap is 50 to 100 ft at 1" = 50' scale.

Overlap means the view frames physically overlap in the plan — the match line sits at the center of the overlap zone.

## Editing view frames

### Moving or resizing

Select a view frame to display grips. Drag a corner grip to resize (useful if the standard width needs adjustment for a specific sheet). Drag the center grip to reposition.

Caution: moving a view frame manually breaks the automatic station-based positioning. The corresponding sheet viewport may no longer align correctly. If extensive changes are needed, delete the view frame group and recreate it.

### Changing the station range

Open View Frame Group Properties (`EDITVIEWFRAMEGROUP`). Adjust the start/end station. The wizard regenerates frames for the new range.

### Adding or removing frames

Individual frames can be deleted from the group (right-click > Delete in Prospector). To add frames, recreate the group with an extended station range.

## Relationship to sheets

View frames are the geometry in model space that define sheet extents. The `CREATESHEETS` command reads the view frame group and produces:

- One layout (paper-space tab) per view frame.
- A viewport in each layout aimed at the view frame's extents.
- A profile view in each layout (if plan-and-profile template is used).

If you delete or modify view frames after creating sheets, the sheets may become misaligned. Best practice: finalize the alignment and view-frame settings before creating sheets.

## Tips

- Set the view frame label to include the sheet number (a field that auto-updates when sheets are renumbered).
- For curved alignments, the view frame rectangle rotates to follow the alignment tangent at the mid-station. This keeps the alignment roughly centered in each sheet.
- If a project has multiple alignments that share the same sheets (e.g., a mainline and a cross street), each alignment gets its own view-frame group. Sheets can reference multiple view-frame groups via separate viewports.
- On preliminary submittals, create view frames at a larger scale (1" = 100') to reduce sheet count. Switch to 1" = 50' for final design.

## Related

- [Match lines](match-lines.md)
- [Sheet sets and the Sheet Set Manager](sheet-sets.md)
- [Plan and profile sheets workflow](plan-and-profile-sheets.md)
- [Sheet templates (DWT)](sheet-templates.md)
