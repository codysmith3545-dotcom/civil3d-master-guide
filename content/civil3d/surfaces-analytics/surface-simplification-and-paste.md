---
title: "Surface Simplification and Paste Operations"
section: "civil3d/surfaces-analytics"
order: 40
visibility: public
tags: [surface, simplify, paste, weed, edit-operations, tin, performance]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [SIMPLIFYSURFACE, PASTESURFACE, MINIMIZEFLATAREAS, REBUILDSURFACE]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - To Simplify a Surface"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-1F94C3BC-3D17-4036-AC5A-39A3A0B6C8C9"
    verified: 2026-05-11
  - title: "Autodesk Civil 3D Help - To Paste One Surface into Another"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-4DBB5C0F-9CC4-49FA-8F1F-CFE85A95E59F"
    verified: 2026-05-11
---

> **TL;DR**
> 1. **Simplify** reduces TIN point count using point filtering or edge contraction; **Weed** drops vertices on contour or breakline data before they enter the TIN.
> 2. **Paste** merges one surface into another, preserving the parent's boundary and replacing overlapping triangles with the child's geometry.
> 3. Edit operations stack chronologically in the surface's Definition; reorder, disable, or delete them to recover earlier states without rebuilding.

## When to use which operation

| Operation | What it does | When |
|---|---|---|
| Simplify | Reduces TIN points | LIDAR or photogrammetry surfaces with millions of points |
| Weed | Drops vertices from contour/breakline before triangulation | Imported contours with dense vertex spacing |
| Smooth | Adds points via natural-neighbor or Kriging interpolation | Contour-only data that triangulates with flat tops |
| Paste | Overlays a child surface onto a parent | Combining proposed grading with existing ground |
| Minimize flat areas | Adjusts elevations of points whose neighbors are at the same elevation | Contour-only TINs with flat tops on ridges |

## Simplify surface

UI path: select the surface > Modify tab > Surface Tools panel > **Simplify Surface**.

The **Simplify Surface** wizard:

1. **Page 1 - Simplify Method**: choose `Edge contraction` or `Point removal`.
2. **Page 2 - Region Options**: limit to a polyline boundary, all points, or visible window.
3. **Page 3 - Reduction Options**: set a maximum change in elevation, a percentage of points to remove, or both.
4. **Page 4 - Summary**: review the planned reduction and click Finish.

The operation appends a `Simplify` edit to the surface's Definition list. The original points remain; the simplify edit re-triangulates excluding the dropped points. Disable the edit to revert.

## Weed contour or breakline data

For contour data, weed before triangulation rather than simplifying after:

UI path: Prospector tab > Surface > Definition > Contours > right-click > **Edit Contour Weeding**, or use the **Add Contours** dialog's weeding options.

Weeding parameters:

- **Distance**: minimum spacing between consecutive vertices.
- **Angle**: skip vertices where the deflection from the previous segment is below this.

Aggressive weeding (large distance, small angle) reduces TIN size dramatically but loses fidelity on tight curves.

For breaklines: the weeding options live in the Add Breaklines dialog and in `EDITBREAKLINEWEEDING`.

## Paste surface

UI path: Prospector > Surface > Definition > Edits > right-click > **Paste Surface** (or `PASTESURFACE`).

1. Select the child surface in the dialog. Civil 3D pastes the child's triangles inside the parent.
2. Outside the child's boundary, the parent's geometry is unchanged.
3. Inside the child's boundary, the parent's triangles are replaced by the child's.

Use cases:

- Existing ground + design grading: paste the proposed surface into an existing-ground surface to produce a combined "as-designed" surface.
- Stitching multiple LIDAR tiles: paste each tile into a master surface in coverage order.

Pasted surfaces remain referenced. If the child changes, the parent must rebuild (`REBUILDSURFACE`) to pick up the change. Pasted data shortcuts behave the same way and are the basis of multi-discipline coordination.

## Edit operations list

UI path: Prospector > Surface > Definition > Edits.

Every modification (Add Point, Delete Point, Swap Edge, Add Breakline, Simplify, Paste, Smooth, etc.) appears as a row. Right-click a row to:

- **Disable** - turn the operation off temporarily.
- **Delete** - remove permanently.
- **Move up/down** - reorder operations. Order matters: a Paste before a Simplify simplifies after the paste; reversed, the child is pasted onto a simplified parent.

After reordering, rebuild the surface.

## Common errors

- `Simplify produced a surface with self-intersecting triangles`: too aggressive reduction near a breakline. Lower the reduction percentage or constrain the simplify region to exclude the breakline area.
- `Paste failed - child surface has no boundary`: pasting requires the child to have a closed boundary. Add an outer boundary to the child.
- `Surface size on disk did not decrease after simplify`: the original points are retained in the surface definition. To shrink disk size, use Surface Properties > Definition tab > Rebuild Options > **Build Snapshot** after disabling the original point group.
- `Rebuild failed - circular reference`: surface A pastes B which pastes A. Break the cycle by removing one paste edit.

## Related

- [Volume surfaces and comparison](volume-surfaces-and-comparison.md)
- [Foundational surface editing](../surfaces/surface-editing.md)
- Commands: [REBUILDSURFACE](../commands/rebuildsurface.md), [CREATESURFACE](../commands/createsurface.md)
