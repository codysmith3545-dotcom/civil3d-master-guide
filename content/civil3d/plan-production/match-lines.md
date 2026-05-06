---
title: "Match Lines"
section: "civil3d/plan-production"
order: 15
visibility: public
tags: [match-line, view-frame, sheet-reference, plan-production]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEVIEWFRAMES, MATCHLINEPROPERTIES, EDITMATCHLINE]
sources:
  - title: "Autodesk Civil 3D Help — Match Lines"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-D5F7E3B5-3E5D-4F7E-8D5B-F3E7D5B3F5E7"
updated: 2026-05-06
---

> **TL;DR**
> 1. **Match lines** are automatically created between adjacent view frames during the `CREATEVIEWFRAMES` process. They mark where one sheet ends and the next begins, drawn perpendicular to the alignment at the boundary station.
> 2. Match-line labels show the **station** at the match and the **sheet number** of the adjoining sheet (using Civil 3D fields that update automatically when sheets are renumbered or view frames are adjusted).
> 3. Match lines can be repositioned by grip-editing, but moving them changes the boundary between the two adjacent view frames' visible extents.

## What match lines do

In a plan-production set, each sheet shows a portion of the alignment. Where two sheets meet, both sheets display the match line as a reference mark so the reader can find the continuation. The match-line label on Sheet 3 says "SEE SHEET 4" (or the equivalent station), and the match line on Sheet 4 says "SEE SHEET 3."

Match lines are Civil 3D objects associated with the view-frame group. They exist in model space and appear in the plan viewport of each relevant sheet.

## Creation

Match lines are generated as part of the `CREATEVIEWFRAMES` wizard on the Match Lines page:

- **Automatic placement** — one match line at every view-frame boundary.
- **Left/right offset** — the match line extends perpendicular to the alignment a specified distance on each side. Set this wide enough to cross the full plan viewport (typically equal to or slightly more than the viewport width at scale).
- **Style** — controls the line appearance (typically a heavy dashed or zigzag line).
- **Label style** — defines what text appears on each side of the match line.

## Match-line labels

Each match line has two labels:

1. **Left label** — visible on the sheet to the left (lower station). Typically reads: "MATCH LINE STA 10+00 — SEE SHEET 4."
2. **Right label** — visible on the sheet to the right (higher station). Typically reads: "MATCH LINE STA 10+00 — SEE SHEET 3."

The sheet-number reference uses a **field code** that evaluates to the adjacent sheet's number at plot time. If you renumber sheets in the Sheet Set Manager, the match-line labels update automatically.

### Customizing label content

Edit the match-line label style (Settings tab > Plan Production > Match Line > Label Styles) to add or remove components:

- Station value (formatted to match the alignment station format).
- Adjoining sheet number (field reference).
- Custom text (e.g., "BEGIN CONSTRUCTION SHEET SET 2").
- Direction arrow (showing which direction the alignment continues).

## Repositioning match lines

### Grip editing

Select a match line. Two grips appear:

- **End grips** — drag to lengthen or shorten the match line perpendicular to the alignment.
- **Mid grip** — drag along the alignment to reposition the match-line station.

Moving the mid grip changes the boundary station. The adjacent view frames adjust their visible range accordingly. This is useful when a match line falls at an inconvenient location — for example, through the middle of an intersection or a critical detail.

### Match Line Properties

Right-click the match line > Match Line Properties (`MATCHLINEPROPERTIES`):

- Adjust the station numerically.
- Change the left and right offsets.
- Override the label style.

## Style

Match-line styles are configured in Settings tab > Plan Production > Match Line > Match Line Styles. Common style choices:

- **Heavy dashed line** with a line weight of 0.50 mm or 0.020 in. Color: typically red or magenta to distinguish from plan features.
- **Zigzag line** for traditional hand-drafted appearance.
- The match line can include a mask (wipeout) to prevent underlying plan features from overprinting the match-line label area.

## Snap behavior

Match lines snap to alignment stations when created or moved. They maintain perpendicularity to the alignment tangent at the match station. On curves, the match line is oriented radially (perpendicular to the curve tangent at that station).

If you need a match line that is not perpendicular (rare), you can rotate it after placement, but this may confuse sheet readers.

## Tips

- Place match lines at stations where the plan is relatively simple — straight sections with few features. Avoid matching through intersections, cul-de-sacs, or dense utility areas.
- If using an overlap setting in view frames, the match line sits at the center of the overlap zone. Both sheets show the area around the match line, reducing the chance that a critical feature is split across sheets.
- Verify match-line labels at the plotting stage. If the sheet-number field resolves to "???" it means the view frame has lost its association with a sheet layout. Recreate sheets or re-associate the view frames.
- For cross-section sheets (which do not follow an alignment linearly), match lines are not used. Instead, section sheets reference station ranges in their title blocks.

## Related

- [View frame groups](view-frame-groups.md)
- [Sheet sets and the Sheet Set Manager](sheet-sets.md)
- [Plan and profile sheets workflow](plan-and-profile-sheets.md)
- [Sheet templates (DWT)](sheet-templates.md)
