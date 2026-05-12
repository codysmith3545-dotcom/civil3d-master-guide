---
title: "Pressure Network to Gravity Pipe Network Conversion"
section: "civil3d/pressure-pipe-networks"
order: 40
visibility: public
tags: [pressure-pipe, gravity-pipe, conversion, swap, network-type, force-main]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEPIPENETWORKFROMOBJECT, CREATEPRESSUREPIPENETWORK, PIPENETWORKPROPERTIES]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - About Pressure Pipe Networks"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-A0B5C0CE-AD5F-4C2E-99F5-1B4F7AC1DBE0"
    verified: 2026-05-11
  - title: "Autodesk Knowledge Network - Converting between pressure and gravity networks"
    url: "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Pressure-network-to-gravity-network.html"
    verified: 2026-05-11
---

> **TL;DR**
> 1. Civil 3D has no single-click pressure-to-gravity converter; you rebuild the network in the target domain using 3D linework extracted from the source.
> 2. The two network types model different physics. Convert only when slope-driven analysis, structures, or storm/sanitary labeling is genuinely needed.
> 3. Plan ahead - if a project will need either type, choose the right domain at the start to avoid the conversion.

## When to convert and when not to

| Scenario | Recommended network type |
|---|---|
| Water main, force main, irrigation main | Pressure |
| Sanitary sewer, storm sewer | Gravity |
| Reclaimed water under pressure | Pressure |
| Pumped sanitary discharge (force main) | Pressure to pump station, gravity downstream |
| Project that started in the wrong type | Convert (see below) |

If you only need to label a pressure run as if it were a gravity line, change the label style on the pressure network instead of converting.

## Conversion workflow

Civil 3D 2024 and 2025 do not include a built-in command that converts a pressure network object into a gravity network object (or vice versa). The supported workflow is:

1. **Extract a 3D representation of the source network.**
   - Select the pressure network > Modify tab > Pressure Networks panel > **Pipe Network Layout Tools** is not available for conversion; instead, use `EXTRACTFROMSURFACE`-style export to 3D polylines, or use the AutoCAD **EXTRACT** command on the pipe centerlines.
   - As a more reliable alternative, draw 3D polylines along each pipe centerline using snap-to-pipe insertion points.
2. **Create a new gravity network from the 3D polylines.**
   - Run `CREATEPIPENETWORKFROMOBJECT`. Pick the polylines. Civil 3D builds gravity pipes along each segment and inserts structures at vertices.
3. **Assign a gravity parts list and rules.** Replace the placeholder parts with the project's standard sizes and materials.
4. **Validate.** Apply pipe rules (`APPLYPIPERULES`), run a network analysis, and inspect every structure for correct rim and invert elevations.
5. **Delete the source pressure network** only after the new gravity network has been verified.

The reverse direction (gravity to pressure) uses the same approach: extract 3D polylines, run `CREATEPRESSUREPIPENETWORK` and pick the polylines.

## Data that does not transfer

These properties do not survive the conversion:

- Fittings and appurtenances (gravity has no fitting object class).
- Joint deflections and pipe radius of curvature.
- Slope rules tied to the source pipe (gravity rules are different).
- Profile labels - re-create from the new network.

Plan on rebuilding labels, styles, and structure connections in the target network.

## Alternatives to conversion

- Keep the original network and reference it via data shortcut. Add the new domain's network in a separate drawing.
- Use a **pressure network** for force-main runs and a **gravity network** for the downstream gravity portion. Connect them visually at the discharge manhole.
- For purely visual changes, change the pipe style without converting.

## Common errors

- `Cannot convert directly - command not available`: confirmed - there is no `CONVERTPRESSURENETWORK` command. Follow the rebuild workflow above.
- `Generated network has no structures`: the source polylines had no vertices between endpoints. Add vertices at every intended structure location before running `CREATEPIPENETWORKFROMOBJECT`.
- `Invert elevation mismatch at structure`: gravity networks enforce invert continuity; pressure networks did not. Edit pipe inverts to a consistent flow direction.
- `Parts list does not contain required pipe size`: gravity parts list lacks the size used by the pressure source. Add to the parts list or pick a closest available size.

## Related

- [Pipe network parts list (pressure)](pipe-network-parts-list.md)
- [Gravity vs pressure (overview)](../pipe-networks/gravity-vs-pressure.md)
- [Creating pipe networks](../pipe-networks/creating-pipe-networks.md)
