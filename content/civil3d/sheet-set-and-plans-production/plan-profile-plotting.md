---
title: "Plan-Profile Plotting"
section: "civil3d/sheet-set-and-plans-production"
order: 20
visibility: public
tags: [plan-profile, mvcg, multiple-view-creation, viewport, profile-view, sheet]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEVIEWFRAMES, CREATESHEETS, MULTIPLEVIEWPORTSCREATE]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - About Plan Production Sheets"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-D8BE6CBC-FB3C-432C-9D5B-AD7CFB4F1C68"
    verified: 2026-05-11
  - title: "Autodesk Civil 3D Help - To Create Multiple Profile Views"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-D2B65A2F-FFC1-4D44-B5DD-2F3FBC9C8C04"
    verified: 2026-05-11
---

> **TL;DR**
> 1. Plan-profile sheets pair a plan viewport (above) with a profile-view viewport (below) for the same alignment station range; each view frame produces one sheet.
> 2. The Multiple View Creation (MVCG) workflow generates a stack of profile views at a fixed station range so each sheet's profile aligns with its plan.
> 3. Profile views, profile bands, and grid spacing must be set on the alignment before Create Sheets - the wizard reuses whatever profile view style and band set are assigned.

## Multiple View Creation for Profiles

UI path: select the alignment > Alignment contextual tab > Launch Pad panel > **Create Multiple Profile Views** (`CREATEMULTIPLEPROFILEVIEWS`).

The wizard:

1. General page - name template, profile view style, layer.
2. Station Range page - choose `Automatic` (use view frame group station range) or set a manual range.
3. Profile View Height page - fixed height or auto height with elevation buffers.
4. Profile Display Options page - choose which profiles to draw (existing, design, side ditch, etc.) and their styles.
5. Data Bands page - elevation bands, sectional grade bands, alignment geometry band.
6. Profile Hatch page - cut/fill hatching between two profiles (optional).
7. Multiple Plot Options page - plot stacked vertically or arranged horizontally; spacing between views.

The result is a row or column of profile views in model space, each covering one view-frame station range.

## View frame group setup for plan-profile

UI path: Output tab > Plan Production panel > **Create View Frames** (`CREATEVIEWFRAMES`).

1. Pick the alignment.
2. Pick the template `.dwt` (with plan-profile layout) and the layout tab inside it. The wizard reads the viewports from the template to size the view frame on the alignment.
3. Choose orientation: `Plan readability` rotates view frames to keep north up where practical.
4. Set match line behavior: automatic or station-based.
5. Match line labels: orientation, offsets.
6. Sheet labels: title style, attribute mapping.

The view-frame group object is created on the alignment and is the input to Create Sheets.

## Plan viewport + profile viewport on the sheet

The template `.dwt` must contain a layout with two paper-space viewports:

- A **plan viewport** with viewport type set to `Plan` (Properties > Viewport > Plan).
- A **profile viewport** with viewport type set to `Profile`. The viewport must reference the alignment that will be plotted.

Civil 3D matches plan and profile viewports by station range: each plan viewport's view-frame station range is paired with the profile viewport showing the same range.

UI path to inspect viewport types: select a paper-space viewport > Properties > Viewport rollout > **Viewport Type** field.

## Sheet drawing organization

Create Sheets supports:

- All sheets in one drawing - fast, but layout tab count can grow into the hundreds.
- One drawing per sheet - more files but easier to manage in source control and SSM.
- One drawing per view frame group - middle ground for projects with multiple alignments.

Pick the option that matches your firm's CAD standard. Once chosen, do not change between option types mid-project - the Sheet Set Manager catalog points to specific files.

## Common errors

- `No profile views were created in template`: the layout's viewport is not set to type `Profile`. Edit the template, change the viewport's `Viewport Type` to Profile, save the template.
- `Profile view does not align with plan viewport on sheet`: profile view's station range does not match the view frame's station range. Recreate profile views via MVCG using the view frame group as input.
- `Sheet has a blank profile`: profile viewport references an alignment that does not have a design profile. Create the profile first or change the profile view style to show only existing ground.
- `Create Sheets fails - no template layout with the required viewports`: pick a different template, or edit the current template's layout to include `Plan` and `Profile` viewports.

## Related

- [Sheet Set Manager (SSM) with Civil 3D](sheet-set-manager-civil3d.md)
- [Viewport scale and annotation scale](viewport-scale-and-annotation-scale.md)
- [Create sheets by alignment](create-sheets-by-alignment.md)
- [Plan and profile sheets (foundational)](../plan-production/plan-and-profile-sheets.md)
