---
title: "Pressure Pipe Network Parts List"
section: "civil3d/pressure-pipe-networks"
order: 10
visibility: public
tags: [parts-list, content-catalog, pressure-pipe, ductile-iron, pvc, fitting]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [PRESSUREPARTSLIST, CREATEPRESSUREPIPENETWORK, EDITPARTSLIST]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - About Pressure Network Parts Lists"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-6F4FC59C-1B6A-4B58-B16D-7C2BE0EB3593"
    verified: 2026-05-11
  - title: "Autodesk Civil 3D Help - Pressure Network Catalog"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-1B36E54D-7B92-4D5A-BA89-95B43A3F0F18"
    verified: 2026-05-11
---

> **TL;DR**
> 1. A pressure parts list filters the pressure content catalog down to the pipes, fittings, and appurtenances your project actually uses.
> 2. Catalogs are external SQLite files (`.sqlite`) under the **Pressure Pipes Catalog** folder; the parts list references parts by material, type, and size.
> 3. Build the list before you start drawing - swapping parts lists after layout requires re-mapping every part.

## Catalog vs parts list

| Term | What it is | Where it lives |
|---|---|---|
| Content catalog | All available parts (manufacturer or generic), organized by domain (water, sewer) and material | File system: `%ProgramData%\Autodesk\C3D <year>\enu\Pressure Pipes Catalog\` |
| Parts list | A curated subset of catalog parts used in a drawing | Inside the drawing |

UI path to manage parts lists: Toolspace > Settings tab > Pressure Network > Parts Lists > right-click > New (or edit an existing list). The dialog is **Pressure Network Parts List**.

## Editing a pressure parts list

1. Open Toolspace > Settings tab > Pressure Network > Parts Lists.
2. Right-click the parts list to use, choose Edit. The **Pressure Network Parts List** dialog opens with three tabs: **Pressure Pipes**, **Fittings**, **Appurtenances**.
3. On each tab, click **Add Material** or **Add Type** to bring catalog content in. The right pane shows available sizes. Drag sizes into the list pane.
4. Set a **Default** size in each material so the layout tools default sensibly.
5. Assign a **Render Material** and **Style** for plan, profile, and 3D views.

## Catalog management

Civil 3D ships a generic pressure catalog. Manufacturer catalogs (American Cast Iron Pipe, Mueller, JM Eagle, Romac, etc.) install separately.

- Change the active catalog: Pressure Network Catalog Settings dialog - Toolspace > Settings tab > Pressure Network > right-click > Catalog Settings. Browse to the catalog folder and pick the catalog file.
- To extend a catalog, use the **Content Catalog Editor** (separate installer from Autodesk). Custom parts must include 2D plan blocks, 2D profile blocks, and 3D solid geometry.

## Defaults and styles

The parts list also stores:

- **Default rules** assigned to each part type (see [Pipe rules and rule sets](pipe-rules-and-rules-sets.md)).
- **Render material** for 3D views.
- **Style** for plan and profile display.

Set defaults once per template; they propagate to every new drawing created from that template.

## Common errors

- `The part is not available in the current catalog`: the drawing was created against a different catalog than the one currently active. Repath the catalog or add the missing part to the active one.
- `Part size out of range for selected material`: the chosen size does not exist for that material/type combination. Pick a size in the catalog's defined range.
- `Cannot delete parts list - in use by a pressure network`: a network references the list. Reassign the network to another list in Network Properties > Information tab before deleting.
- `The selected catalog folder does not contain a valid catalog file`: the `.sqlite` file is missing or the path is wrong. Confirm `AeccPressurePartCatalog.sqlite` exists in the folder.

## Related

- [Pipe rules and rule sets](pipe-rules-and-rules-sets.md)
- [Pressure network to gravity pipe network conversion](pressure-network-to-pipe-network-conversion.md)
- [Gravity pipe network parts list and rules](../pipe-networks/parts-list-and-rules.md)
