---
title: "Create Sheets by Alignment (End-to-End)"
section: "civil3d/sheet-set-and-plans-production"
order: 40
visibility: public
tags: [create-sheets, view-frames, alignment, plan-production, workflow, ssm]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEVIEWFRAMES, CREATESHEETS, NEWSHEETSET]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - Create Sheets Wizard"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-4C8E4E66-5C26-4E61-A1A5-5B7DE3E4C5E2"
    verified: 2026-05-11
  - title: "Autodesk Civil 3D Help - To Create View Frames"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-2C7F76F8-AB72-4AE7-9A4C-0D7A4C8C1F8D"
    verified: 2026-05-11
---

> **TL;DR**
> 1. End-to-end: build the alignment and profile, set up the design, create view frames, then run Create Sheets to generate plan-profile sheets and (optionally) an SSM `.dst`.
> 2. The wizard pulls almost everything from prior setup - profile view styles, label sets, view frame group, sheet template. Get the prerequisites right and the wizard is one button.
> 3. Re-running Create Sheets does not update existing sheets; it appends new ones. Delete or regenerate view frames before re-running if the alignment changes.

## Prerequisites

Before running Create Sheets, the drawing must contain:

1. An alignment with horizontal geometry complete.
2. Surface and design profiles on the alignment.
3. A profile view style and label set assigned to the alignment.
4. A template `.dwt` whose layout has a plan viewport (type `Plan`) and a profile viewport (type `Profile`).

Optional but recommended:

- A sheet set `.dst` already created in SSM, or empty subset structure ready.
- Title block configured with fields tied to SSM custom properties.

## Step 1 - Create View Frames

UI path: Output tab > Plan Production panel > **Create View Frames** (`CREATEVIEWFRAMES`).

1. Alignment - pick the alignment.
2. Station range - All or User specified.
3. Sheets - pick `Plan and profile`, `Plan only`, or `Profile only`.
4. Template for plan production - browse to the `.dwt`; choose the layout name.
5. View Frame Placement:
   - **Plan readability**: rotate frames as needed to keep north up. Set the rotation threshold (default 0 deg).
   - **Along alignment**: frames follow the alignment heading.
6. Match Lines - automatic or station-based, with snap-to options.
7. Profile Views - the profile view style to use on the sheet (when sheet type is plan-profile or profile only).

The wizard creates a **view frame group** (visible in Toolspace > Prospector > Alignments > [your alignment] > View Frame Groups). It contains:

- Individual view frames (one per sheet).
- Match lines between adjacent frames.

## Step 2 - Inspect view frames

Before generating sheets, walk the view-frame group and verify:

- Frames do not overlap or skip stations.
- Match lines land where you can label them cleanly (not on top of a structure or curve).
- Plan readability rotations look acceptable.

Edit individual frames by selecting them and using grip edits or Properties.

## Step 3 - Create Sheets

UI path: Output tab > Plan Production panel > **Create Sheets** (`CREATESHEETS`).

Wizard pages:

1. **View Frame Group and Layouts**: pick the group. Choose layout creation:
   - All in current drawing.
   - One layout per new drawing.
   - All layouts in a new drawing.
2. **Sheet Set**: add to an existing `.dst`, create a new sheet set, or none. Set the sheet subset and storage folder.
3. **Profile Views** (if plan-profile or profile only): which profile view style and band set to apply. Choose `Display profile views by alignment` to align profile to plan.
4. **Data References**: pick which data shortcuts to bring into the new drawings (surfaces, alignments needed for labels).
5. **Sheet Set / Sheets**: review the list, click Create Sheets.

Civil 3D creates new drawing files (one per sheet, if chosen), inserts the xref of the source drawing, creates profile views in each, and registers the sheets in SSM.

## Step 4 - Post-creation review

Open each new drawing:

- Confirm viewport scale and annotation scale match.
- Confirm the alignment xref shows up correctly.
- Confirm any data references (surfaces) are not broken.
- Add title-block fields (if not already done in the template).

Open the SSM:

- Verify each sheet is present.
- Renumber if needed (drag and drop within the subset).
- Set sheet set custom properties for title-block fields.

## Re-running the wizard

If the alignment changes substantively (length, station equation, geometry):

1. Delete the existing view frame group (Prospector > right-click group > Delete).
2. Delete any associated sheet drawings - the SSM entries become stale.
3. Re-run Create View Frames and Create Sheets from scratch.

For minor changes (one viewport scale, one layout edit), edit the sheet drawing directly without rebuilding the entire chain.

## Common errors

- `Create Sheets failed - no profile views available`: the alignment has no design profile. Create one first.
- `Wizard cannot find template layout`: the `.dwt` path moved. Repath in Step 1.
- `Sheet drawing path conflict - file already exists`: previous run produced a file with the same name. Delete the old file or change the file name template.
- `View frame group is locked`: another user has the view-frame-group source drawing open. Close the other session.
- `Viewport in new sheet is empty`: the xref attached at sheet creation has its insertion point or layer state wrong. Open the sheet drawing, inspect the xref.

## Related

- [Sheet Set Manager (SSM) with Civil 3D](sheet-set-manager-civil3d.md)
- [Plan-profile plotting](plan-profile-plotting.md)
- [Viewport scale and annotation scale](viewport-scale-and-annotation-scale.md)
- [View frame groups (foundational)](../plan-production/view-frame-groups.md)
