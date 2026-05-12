---
title: "Viewport Scale and Annotation Scale"
section: "civil3d/sheet-set-and-plans-production"
order: 30
visibility: public
tags: [viewport, scale, annotation-scale, annotative, paper-space, model-space]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CANNOSCALE, OBJECTSCALE, VPSCALE]
updated: 2026-05-11
sources:
  - title: "Autodesk AutoCAD Help - About Annotative Objects"
    url: "https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-9DCF5E76-AE7C-46CF-83D2-1D5E0C0F4716"
    verified: 2026-05-11
  - title: "Autodesk AutoCAD Help - To Change the Scale of a Viewport"
    url: "https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-3F2D6B58-1D2F-4A07-B6F6-2C5C84B5F77B"
    verified: 2026-05-11
---

> **TL;DR**
> 1. Viewport scale and annotation scale must match per viewport: the viewport's scale determines paper-space output; the annotation scale determines which annotative objects display.
> 2. Civil 3D label styles are annotative by default; setting `CANNOSCALE` correctly per viewport is what makes labels render at the right paper size.
> 3. Set scales while in the viewport (double-click into model space inside the viewport), not in tab-level model space.

## What each scale does

| Setting | What it controls | Where it lives |
|---|---|---|
| Viewport scale | Zoom factor between model units and paper units in that viewport | Per viewport, on the layout |
| Annotation scale (`CANNOSCALE`) | Which annotative object scale representations display | Per viewport (when locked); per tab in model space |
| LTSCALE / PSLTSCALE | Linetype dash sizing in paper space | Drawing-wide system variables |
| MSLTSCALE | Linetype dash sizing in model space | Drawing-wide |

When `PSLTSCALE = 1` (default), paper-space linetypes scale by viewport scale automatically. When `MSLTSCALE = 1` (default), model-space linetypes scale by `CANNOSCALE`.

## Setting viewport scale

UI path: select the viewport in paper space > status bar > **Viewport Scale** drop-down (or right-click viewport > Properties > **Standard Scale**).

Common Civil 3D scales:

| Scale | Meaning |
|---|---|
| 1" = 50' | Civil engineering plan view, imperial |
| 1" = 20' | Site plan, imperial |
| 1" = 100' | Highway plan, imperial |
| 1:500 | Site plan, metric |
| 1:1000 | Highway plan, metric |

For plan-profile sheets, plan and profile viewports typically use the same horizontal scale; the profile viewport additionally has a **vertical exaggeration** baked into the profile view style (often 10x).

After setting the scale, click the **Lock Viewport** icon on the status bar (or set `Display locked` to Yes in Properties). Locking prevents accidental zoom from changing the scale.

## Setting annotation scale

UI path: with the viewport active (double-clicked into), use the status bar **Annotation Scale** drop-down. Or run `CANNOSCALE` at the command line and pick a scale.

Civil 3D label styles set to **Annotative = True** display only at the scales added to them. To make a label visible at a new scale:

1. Select the label in model space.
2. Right-click > **Annotative Object Scale** > **Add Current Scale** (`OBJECTSCALE`).
3. The label now has a paper-space representation at the active annotation scale.

For batch operations across many labels, run `OBJECTSCALE` and pick a window of objects.

## Matching the two scales

When the viewport is locked, the viewport scale and annotation scale link automatically: changing one updates the other. If a viewport shows labels at the wrong size, the most common cause is mismatched scales because the viewport was created before the label style was set to annotative.

Diagnostic steps:

1. Activate the viewport, check `VPSCALE` (viewport scale) and `CANNOSCALE` at the command line.
2. If they do not match, set the viewport scale, then re-set annotation scale.
3. Run `OBJECTSCALE` on labels that still do not render; verify the active scale is among their representations.

## Non-annotative styles

Older Civil 3D drawings often have label styles where Annotative is set to False - the text height is a fixed model-space height multiplied by `DIMSCALE`. These styles do not respond to `CANNOSCALE`. Either edit the style to annotative or set the model-space text height to the desired paper-space height divided by the viewport scale.

## Common errors

- Labels in the viewport are tiny or huge: annotation scale does not match viewport scale. Activate the viewport, re-set both.
- Labels disappear when changing viewport scale: the label is annotative but only has representations at one scale. Add the active scale via `OBJECTSCALE`.
- Linetype dashes look wrong: check `PSLTSCALE` (should be 1) and `LTSCALE` (typically 1.0 with PSLTSCALE=1).
- `Viewport scale list is empty`: `SCALELISTEDIT` resets the standard list; run it and pick **Reset**.

## Related

- [Plan-profile plotting](plan-profile-plotting.md)
- [Sheet Set Manager (SSM) with Civil 3D](sheet-set-manager-civil3d.md)
- [Create sheets by alignment](create-sheets-by-alignment.md)
