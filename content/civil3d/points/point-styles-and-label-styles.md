---
title: "Point Styles and Point Label Styles"
section: "civil3d/points"
order: 35
visibility: public
tags: [points, point-styles, label-styles, marker, point-groups, override]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [EDITPOINTSTYLE, EDITPOINTLABELSTYLE, EDITDRAWINGSETTINGS]
updated: 2026-05-06
---

> **TL;DR**
> 1. A **point style** controls the marker — the symbol drawn at the point's location (shape, size, color, rotation, whether it scales with the plot or stays fixed on screen). A **point label style** controls the text components displayed around the point (number, elevation, description, leader, dragged state).
> 2. Both can be assigned by description key, by point group override, or manually on individual points. When multiple assignments conflict, priority order is: object-level override > point group (highest in draw order) > description key > default.
> 3. Build point styles and label styles in the office DWT. Keep the count manageable — one style per symbol type (iron rod, mag nail, manhole, tree, etc.) is typical.

## Point styles

A point style defines the marker appearance. Create or edit via `EDITPOINTSTYLE` or Toolspace > Settings > Point > Point Styles > right-click > New / Edit.

### Marker tab

The Marker tab sets what the user sees at the point location:

- **Use AutoCAD POINT**: the simplest option — renders the point as the AutoCAD POINT entity governed by `PDMODE`/`PDSIZE`. Rarely used in production because the symbol cannot be customized.
- **Use custom marker**: a cross, plus, dash, or circle drawn at a user-defined size. Options for fixed size (in absolute units or percentage of screen) or scaled with drawing units.
- **Use AutoCAD BLOCK**: references a block definition by name. This is the standard approach for survey symbols (iron pipe, rebar, mag nail, found monument). The block must exist in the drawing; if missing, Civil 3D substitutes a default marker.

Size options:

- **Use drawing scale**: marker size in plotted units (e.g. 0.1" on paper). The marker scales with the viewport scale.
- **Use fixed scale**: marker is a constant size in model-space units regardless of zoom.
- **Use size in absolute units**: fixed model-space size (e.g. 2.0 ft). Does not change with zoom.
- **Use size relative to screen**: percentage of the viewport height. The marker appears the same size at any zoom level. Useful for screen display but unreliable for plotting.

### Display tab

Like all Civil 3D object styles, the Display tab controls per-component visibility and layer assignment. Point style components:

- **Marker** — the symbol.
- **Label** — toggled here (visible/invisible) but styled by the label style.

Layer assignment on the marker component determines which AutoCAD layer the point plots on. Set this to `0` if you want the description key's layer assignment to take precedence.

### 3D Geometry tab

Controls whether the point marker renders at the point's elevation or is projected flat to Z = 0. For plan-view topo, "Flatten markers to elevation 0" keeps markers at the same apparent elevation in plan view, avoiding label overlap in 3D orbit.

## Point label styles

A point label style defines the text displayed near the marker. Create or edit via `EDITPOINTLABELSTYLE` or Toolspace > Settings > Point > Label Styles > right-click > New / Edit.

### Layout tab

Each label style has one or more **text components**. Common components for a topo point label:

| Component | Content expression | Example output |
|---|---|---|
| Point Number | `{Point Number}` | `101` |
| Elevation | `{Point Elevation}` | `782.35` |
| Description | `{Full Description}` | `Iron Pipe Found` |

Each component has:

- **Anchor point and attachment**: where the text attaches relative to the marker (top-left, bottom-center, etc.) and the offset distance.
- **Text height**: in plotted units. A common standard is 0.08" for topo, 0.10" for boundary.
- **Color / Layer**: can differ per component (e.g. elevation in red, description in green).
- **Visibility**: toggle individual components on/off.
- **Border**: optional box or capsule around the component.
- **Precision and format**: overrides the ambient setting for this component (e.g. elevation to 2 decimal places).

### Dragged State tab

When a user drags a label away from the marker, the Dragged State controls:

- **Leader**: whether a leader line connects the label to the marker.
- **Leader type**: straight or spline.
- **Stacked text**: whether components stack vertically in the dragged position.
- **Gap**: distance between the leader endpoint and the text.

### General tab

- **Visibility**: master on/off for the label.
- **Layer**: the AutoCAD layer the label plots on (separate from the marker's layer).
- **Plan readability**: flips the label so it is always readable from the bottom or right of the sheet, regardless of text rotation.
- **Orientation reference**: world coordinate system, object, or view. For point labels, WCS or View are typical.

## Assignment priority

When multiple mechanisms assign a style to the same point, Civil 3D resolves conflicts with this priority (highest wins):

1. **Object-level override**: the style set directly on the point via Properties palette or right-click > Edit Points. Strongest; overrides everything.
2. **Point group override**: if the point is a member of a group that has Override Point Style or Override Point Label Style enabled, the group's style applies. When multiple groups override, the group highest in the Point Groups draw order wins.
3. **Description key**: the style assigned by the matching description key. This is the normal assignment path for imported field data.
4. **Drawing default**: the default point style and label style set in Drawing Settings > Point > Styles.

To clear an object-level override and revert to group or description-key assignment, select the point > Properties > set Point Style or Point Label Style to `<default>`.

## Practical style catalog

A typical office DWT might include these point styles:

| Style name | Marker type | Use case |
|---|---|---|
| `Existing_IronPipe` | Block `IP_FOUND` | Found iron pipe |
| `Existing_Rebar` | Block `RB_FOUND` | Found rebar |
| `Existing_MagNail` | Block `MN_FOUND` | Mag nail set or found |
| `Existing_ConcMon` | Block `CM_FOUND` | Concrete monument |
| `Topo_Generic` | Custom cross, 0.05" | Generic topo shot |
| `Topo_Tree` | Block `TREE_DECID` | Deciduous tree (scalable by trunk diameter) |
| `Topo_Utility` | Block `UTIL_MH` | Utility manhole |
| `Control_Triangle` | Block `CONTROL` | Survey control point |
| `Set_IronPipe` | Block `IP_SET` | Iron pipe set |

Pair each with a corresponding label style (e.g. `Existing_IronPipe_Label` showing point number + elevation + description) and wire them together in the description key set.

## Common gotchas

- **Block not in drawing.** If the block referenced by a point style does not exist in the current drawing, the point renders as a plain dot. Import the block from the DWT or use `INSERT` to define it.
- **Fixed vs scaled markers.** A marker set to "Use size in absolute units = 2 ft" appears enormous on a site plan at 1" = 20' and invisible on a regional map. Use "Use drawing scale" for consistent plotted size.
- **Label on wrong layer.** The label layer in the label style and the marker layer in the point style are independent. A label can be on `C-SURV-TEXT` while the marker is on `C-SURV-PNTS`. Freeze one and the other remains visible.
- **Point group draw order.** Two groups both overriding styles yield unpredictable results until you set the draw order. Place the most important group (e.g. `Boundary`) at the top.
- **Description key vs group override.** A common mistake is to set styles in description keys and also set overrides in point groups, then wonder why the description-key styles are not appearing. The group override wins. Disable the group's style override if you want description keys to control.

## Related

- [Description keys](description-keys.md)
- [Point groups](point-groups.md)
- [Creating points](creating-points.md)
- [Object styles vs label styles](../fundamentals/object-and-label-styles.md)
