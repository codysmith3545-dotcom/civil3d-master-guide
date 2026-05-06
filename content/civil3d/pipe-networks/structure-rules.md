---
title: "Structure Rules"
section: "civil3d/pipe-networks"
order: 30
visibility: public
tags: [pipe-network, structure-rules, sump-depth, rim-elevation, pipe-drop, manhole, catch-basin]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [EditStructureRules, EditNetworkPartsList]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Structure Rules
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-7B8C2D3E-4F5A-6B7C-D8E9-0F1A2B3C4D5E
    verified: 2026-05-06
---

> **TL;DR**
> 1. Structure rules automate vertical placement: **rim adjustment** snaps the rim to a reference surface, **sump depth** sets the minimum distance below the lowest pipe invert, and **pipe drop** enforces an elevation change across the structure.
> 2. Rules are defined in the parts list and apply during layout and editing. They can be set to enforce (reject violations) or warn (flag but allow).
> 3. Manual overrides are always possible — select the structure, open Properties (Ctrl+1), and type exact rim, sump, or invert values.

## Rim-to-sump depth

The total depth of a structure is measured from **rim elevation** (top of casting or grate) to **sump elevation** (bottom of the structure barrel or base).

The sump is the space below the lowest connected pipe invert. Many agencies specify minimum sump depths:

| Structure type | Typical minimum sump | Purpose |
|---|---|---|
| Sanitary manhole | 6 in. (150 mm) | Collects debris, prevents pipe blockage |
| Storm manhole | 6 in. (150 mm) | Sediment collection |
| Catch basin (sumped) | 12 in. to 24 in. (300 mm to 600 mm) | Trap sediment and floatables before they enter the main |
| Catch basin (non-sumped) | 0 in. | Flow-through design; no sediment trap |

In Civil 3D, the **Minimum Sump Depth** rule is set per structure family in the parts list. When a pipe connects to a structure, Civil 3D automatically extends the structure barrel so the sump meets the minimum. If the lowest pipe invert changes (e.g., the pipe slope is steepened), the sump adjusts.

## Automatic rim adjustment to surface

When a reference surface is assigned to the network, Civil 3D can automatically set each structure's rim elevation to match the surface at the structure's plan location. This keeps manholes and inlets flush with finished grade.

Configuration:

1. In the parts list, select the structure family.
2. Under Structure Rules, enable **Automatic Surface Adjustment**.
3. Specify the reference surface (usually the finished-grade surface).

Behavior:

- During layout, the rim snaps to the surface elevation at each placed structure.
- If the surface changes (e.g., after re-grading), structures update their rims on the next rebuild if the surface is dynamic.
- For structures offset from the alignment (e.g., catch basins at the curb line), the surface elevation is sampled at the structure's actual plan coordinates, not at the alignment centerline.

## Drop across structure

The **pipe drop rule** enforces a minimum invert drop between the highest inlet pipe and the outlet pipe at a structure. The drop accounts for energy loss at the junction.

Typical values:

- 0.10 ft (30 mm) per manhole for sanitary sewers (varies by agency).
- Storm sewer drops are often based on velocity head calculations rather than a flat minimum.

In Civil 3D, the drop is configured per structure in the parts list under Structure Rules > **Pipe Drop Across Structure**. Options:

- **None** — no automatic drop; inverts match unless manually adjusted.
- **Set Drop Value** — a fixed drop (e.g., 0.10 ft) applied at every structure.

When active, Civil 3D adjusts the outlet pipe invert downward by the drop amount when a new upstream pipe connects.

## Pipe connection rules at structures

When a pipe connects to a structure, Civil 3D aligns the pipe at one of three positions:

| Connection rule | Behavior | Typical use |
|---|---|---|
| Match crown | Upstream and downstream pipe crowns are at the same elevation inside the structure | Sanitary sewer (maintains smooth water surface) |
| Match invert | Upstream and downstream pipe inverts are at the same elevation | Storm sewer (simpler, common for smaller systems) |
| Match center | Upstream and downstream pipe centerlines align | Less common; sometimes used for force-main transitions |

The connection rule is set per structure in the parts list. When pipes of different diameters connect at a structure, the connection rule determines how the invert offset is calculated.

For example, with **match crown**: an upstream 8 in. pipe and a downstream 12 in. pipe at the same structure will have the 12 in. pipe's invert 4 in. lower than the 8 in. pipe's invert (since the larger pipe's crown must match the smaller pipe's crown, and the extra diameter is below).

## Manual overrides

All automatic rules can be overridden on individual structures:

1. Select the structure in plan or profile view.
2. Open the Properties palette (Ctrl+1).
3. Edit directly:
   - **Rim Elevation** — type a specific value; breaks the surface-adjustment link for this structure.
   - **Sump Elevation** — type a specific value; overrides the sump-depth rule.
   - **Connected pipe inverts** — edit via the pipe's properties rather than the structure.

To restore automatic behavior after a manual override:

- Right-click the structure > Reset to Rules. This recalculates the rim (from surface), sump (from minimum depth rule), and pipe connections (from drop and connection rules).

## Verifying rule compliance

After editing a network, check rule compliance:

1. Select the network in Prospector.
2. Right-click > **Pipe Network Vistas** — this opens a tabular view of all pipes and structures with rule violations highlighted.
3. Violations appear as icons or colored cells. Sort by violation to find and fix problems quickly.

Alternatively, run the **interference check** between the network and a surface to verify cover depths globally (see [Pipe network analysis](pipe-network-analysis.md)).

## Related

- [Parts list and rules](parts-list-and-rules.md)
- [Creating pipe networks](creating-pipe-networks.md)
- [Pipe network in profile view](pipe-network-in-profile.md)
- [Pipe network analysis](pipe-network-analysis.md)
