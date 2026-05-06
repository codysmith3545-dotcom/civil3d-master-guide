---
title: "Parts List and Rules"
section: "civil3d/pipe-networks"
order: 15
visibility: public
tags: [pipe-network, parts-list, pipe-rules, structure-rules, parts-catalog]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [EditNetworkPartsList, EditPipeRules, EditStructureRules]
updated: 2026-05-06
---

> **TL;DR**
> 1. A **parts list** names the pipe sizes/materials and structure types available when you draw a network. Each network references exactly one parts list.
> 2. **Pipe rules** enforce minimum/maximum cover, slope, and pipe length during layout and editing. **Structure rules** control sump depth and automatic rim adjustment to a surface.
> 3. Parts lists pull from the **parts catalog** (an XML database shipped with Civil 3D). Create a company-specific parts list by selecting only the sizes and types your projects actually use.

## Parts catalog vs parts list

The **parts catalog** is the master database of every pipe and structure type Civil 3D knows about. It ships as XML files in the Civil 3D installation folder under `C:\ProgramData\Autodesk\C3D <version>\enu\Pipes Catalog\`. The catalog contains hundreds of entries — concrete pipe, PVC, HDPE, ductile iron, corrugated metal, and dozens of structure families (circular manholes, rectangular catch basins, etc.).

A **parts list** is a drawing-level selection from the catalog. It defines which pipes and structures are available for a specific network. You create and manage parts lists in the Settings tab of Toolspace under Pipe Network > Parts Lists.

Think of the catalog as a warehouse and the parts list as your truck — you only load what the project needs.

## Creating a parts list

1. Toolspace > Settings tab > Pipe Network > Parts Lists.
2. Right-click > Create Parts List. Name it (e.g. "City of Indianapolis Storm").
3. In the Parts List dialog, add pipe families from the catalog. For each family, select the sizes you need (e.g. 12 in., 15 in., 18 in., 24 in. RCP).
4. Add structure families and select the specific structure sizes.
5. Click OK. The parts list is saved in the drawing.

To reuse a parts list across projects, save it in your office template (DWT) or drag it between drawings via the Settings tab.

## Pipe rules

Pipe rules govern how pipes behave during layout and editing. Access them in the parts list dialog or via `EditPipeRules` on a selected pipe.

| Rule | What it does |
|---|---|
| Maximum cover | Flags or prevents placement if the pipe crown is more than this depth below the surface. Typical: 20 ft. |
| Minimum cover | Flags or prevents placement if the pipe crown is less than this depth below the surface. Typical: 3 ft for storm, 4 ft for sanitary (jurisdiction-dependent). |
| Maximum slope | Upper bound on pipe gradient. Prevents excessive velocities. |
| Minimum slope | Lower bound on pipe gradient. Prevents sediment buildup. Varies by pipe diameter and system type. |
| Maximum pipe length | Limits span between structures. Many agencies cap manhole spacing at 300 ft to 500 ft. |

Rules can be set to **warn** or **reject**. In practice, most offices set them to warn so the designer sees violations without being blocked.

## Structure rules

Structure rules control vertical placement of structures. Access them in the parts list dialog or via `EditStructureRules` on a selected structure.

| Rule | What it does |
|---|---|
| Minimum sump depth | Distance from the lowest connected pipe invert to the structure bottom. Agencies commonly require 6 in. for manholes, 12 in. to 24 in. for catch basins with sumps. |
| Automatic rim adjustment | When enabled, the structure rim snaps to a reference surface. Keeps rims flush with finished grade. |
| Pipe drop across structure | Minimum invert drop between the highest inlet pipe and the outlet pipe. Some agencies require 0.1 ft per manhole. |

## Pipe connection rules

When a pipe connects to a structure, Civil 3D can match elevations at the **crown**, **invert**, or **center** (springline). The connection rule is set per structure in the parts list.

- **Match crown**: upstream and downstream pipe crowns align at the structure. Water surface stays smooth. Preferred for sanitary sewers.
- **Match invert**: pipe inverts are at the same elevation. Common for storm sewers where energy loss at junctions is less critical.
- **Match center**: pipe centerlines align. Less common; sometimes used for pressure conversions.

## Editing the parts catalog

The catalog XML can be extended to add custom pipe or structure families not shipped by Autodesk. This is an advanced task:

1. Navigate to the catalog folder.
2. Copy an existing family XML as a starting point.
3. Edit pipe diameters, wall thicknesses, material properties, and structure dimensions.
4. Register the new family in the catalog index XML.
5. Restart Civil 3D. The new family appears in the parts list dialog.

Back up the catalog folder before editing. Autodesk updates can overwrite customizations if files are placed in the default location. Consider storing custom catalog entries in a separate folder and pointing the registry key `PipeCatalogFolder` to it.

## Best practices

- **One parts list per system type.** Keep storm, sanitary, and water parts lists separate. This prevents accidentally placing a manhole on a water main.
- **Match your agency's standards.** If the city specifies RCP for storm and PVC SDR-35 for sanitary, build parts lists that only offer those materials.
- **Set rules to agency minimums.** Encode the local minimum cover, slope, and spacing rules so Civil 3D flags violations during design rather than at plan review.
- **Store parts lists in templates.** A well-built DWT with pre-configured parts lists saves significant setup time on new projects.

## Related

- [Gravity vs pressure networks](gravity-vs-pressure.md)
- [Creating pipe networks](creating-pipe-networks.md)
- [Structure rules](structure-rules.md)
