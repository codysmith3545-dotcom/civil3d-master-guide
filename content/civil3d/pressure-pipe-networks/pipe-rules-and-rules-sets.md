---
title: "Pipe Rules and Rule Sets"
section: "civil3d/pressure-pipe-networks"
order: 20
visibility: public
tags: [pipe-rule, rule-set, cover, slope, length, joint-deflection, design-check]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [PRESSUREPARTSLIST, EDITPARTSLIST, RUNPIPENETWORKINTERFERENCECHECK]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - Pressure Network Design Checks"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-91D3F1E9-6F6E-4FFC-9BAB-7CD33FBAB8FB"
    verified: 2026-05-11
  - title: "Autodesk Civil 3D Help - About Pipe Rules"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-2B59AE2C-12FA-4CD7-BBFB-F36D8BB2A6D6"
    verified: 2026-05-11
---

> **TL;DR**
> 1. Rules and design checks flag pipes that violate cover, length, joint deflection, or slope limits - they highlight in the drawing rather than block placement.
> 2. Pressure networks have design checks (cover, deflection, radius); gravity networks have pipe and structure rules (slope, drop, cover).
> 3. Configure rule sets in the parts list, attach the right set to each part, and run design checks before issuing plans.

## Pressure network design checks

Pressure parts evaluate against named checks. They surface as warnings in the **Pressure Network Validation** dialog and as marker symbols in the drawing.

UI path to configure: Toolspace > Settings tab > Pressure Network > Pressure Network Settings > **Pressure Network Design Checks**.

Stock checks:

| Check | What it flags |
|---|---|
| Cover depth | Cover below the minimum value at any station |
| Joint deflection | Pipe-to-pipe angle exceeding the catalog's allowed deflection |
| Radius of curvature | Curved pipe segment with radius smaller than the catalog minimum |
| Pipe length | Segment length outside `Min length` / `Max length` for that part |

UI path to run: Modify tab > Design panel > **Design Check** (on a selected pressure network).

## Gravity pipe rules and structure rules

Gravity networks (the more common case) use two rule families:

| Type | Examples |
|---|---|
| Pipe rules | `Length Check`, `Cover and Slope`, `Cover Only`, `Pipe to Pipe Match` |
| Structure rules | `Maximum pipe size`, `Pipe drop across structure`, `Set sump depth` |

UI path to manage: Toolspace > Settings > Pipe Network > Parts Lists > edit > **Rules** column.

Common rule values (set per project standards; verify with local jurisdiction):

- Minimum cover: a project-defined value; for water mains 42 in or 48 in is typical in cold climates - confirm with local utility.
- Minimum slope: 0.40 percent for 8 in sanitary in many U.S. municipalities (verify per jurisdiction).
- Maximum joint deflection: read from the manufacturer's catalog entry.

Do not commit invented numerics; pull them from the project specification.

## Cover, length, and slope rules in detail

`Cover Only`:

- `Maximum Cover` and `Minimum Cover` parameters set top-of-pipe to reference-surface limits. The reference surface is set when the pipe is added.

`Cover and Slope`:

- Adds `Minimum Slope` and `Maximum Slope` parameters. When the pipe is moved or the reference surface changes, the rule flags violations.

`Length Check`:

- Flags pipe segments longer than `Maximum Length` (commonly used to enforce manhole spacing limits).

`Pipe to Pipe Match`:

- Flags adjacent pipes whose materials, sizes, or invert offsets violate the rule. Useful at manholes where larger pipe diameter must match crowns.

## Applying rule sets

1. Open the parts list (Toolspace > Settings > Pipe Network > Parts Lists > right-click > Edit).
2. On the Pipes or Structures tab, locate the **Rules** column.
3. Click the cell to open the Pipe Rule Set or Structure Rule Set dialog. Pick from the list of named rule sets, or create a new one.
4. Save the parts list. New pipes added with that part will use the rule set; existing pipes need **Apply Rules** from the network's right-click menu.

## Common errors

- `Cover violation at station X (pipe P-XYZ)`: pipe top is above the minimum cover or below grade. Lower the pipe, raise the surface, or relax the rule.
- `Joint deflection exceeds catalog maximum`: pipe bends too sharply. Insert a fitting or replace with a smaller-deflection pipe.
- `Pipe segment exceeds maximum length`: insert an intermediate structure or split the pipe.
- `No reference surface set for cover rule`: the pipe was added without a surface reference. In Pipe Properties > Rules, set the reference surface.

## Related

- [Pipe network parts list (pressure)](pipe-network-parts-list.md)
- [Pipe network interferences](pipe-network-interferences.md)
- [Gravity parts list and rules](../pipe-networks/parts-list-and-rules.md)
- [Structure rules](../pipe-networks/structure-rules.md)
