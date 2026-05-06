---
title: "Standardizing Layers Across a Company"
section: "standards/cad-layer-standards"
order: 50
visibility: public
tags: [cad-standards, layers, dwt, layer-translator, deployment, training]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [LAYTRANS, PURGE, STANDARDS, CHECKSTANDARDS]
updated: 2026-05-06
---

> **TL;DR**
> 1. Enforce the layer standard through the **company DWT template**: define every layer, color, linetype, lineweight, and plot style in the template. All new drawings inherit the standard automatically.
> 2. Use the **Layer Translator** (`LAYTRANS`) to convert legacy or received drawings to the company standard. Build and maintain a translation map file.
> 3. Audit compliance with `CHECKSTANDARDS` and regular drawing reviews. Standardization is a people problem as much as a software problem; pair tooling with training.

## Deploying via templates (DWT)

The DWT template is the single most effective enforcement tool.

1. Create (or update) the company's master DWT.
2. Define every standard layer with correct name, color, linetype, lineweight, transparency, plot flag, and description.
3. Set all Civil 3D object styles and label styles to reference these layers (see [Civil 3D layer mappings](civil3d-layer-mappings.md)).
4. Include page setups, text styles, dimension styles, and plot styles in the template.
5. Deploy the DWT to a shared network location or via Autodesk's deployment tools (CER/Deployment Wizard).
6. Configure Civil 3D's template path (`OPTIONS` > Files > Template Settings > Default Template File Name) to point to the company DWT on every workstation.

When a user creates a new drawing from the company template, all layers, styles, and settings are pre-loaded. This eliminates the most common source of non-standard layers: users creating layers ad hoc.

## Layer Translator (LAYTRANS)

`LAYTRANS` batch-renames layers in a drawing to match a target standard.

### Building a translation map

1. Open a drawing that needs translation.
2. Run `LAYTRANS`.
3. The left panel lists the drawing's current layers. The right panel lists the target layers (loaded from a DWG, DWT, or DWS standards file).
4. Map each source layer to its target. Example: `EXIST-ROAD-CL` maps to `C-ROAD-CNTR-E`.
5. Save the mapping as a `.dwg` translation map file for reuse.

### Applying the translation

1. Open the non-standard drawing.
2. Run `LAYTRANS`.
3. Load the saved translation map.
4. Click "Translate." All objects on the mapped source layers move to the target layers. Unmapped layers remain unchanged.

### Batch processing

For large sets of legacy drawings, write a script that opens each DWG, runs `LAYTRANS` with the saved map, and saves. AutoCAD's Script Runner or a custom LISP/batch file can automate this.

## CAD Standards checking (DWS)

AutoCAD's Standards feature uses DWS (Drawing Standards) files to check drawings against a defined standard.

1. Create a `.dws` file: save a DWG containing only the standard layers (no geometry) as `.dws` via `SAVEAS` > DWS format.
2. Associate the DWS with a drawing: `STANDARDS` > attach the DWS file.
3. Check the drawing: `CHECKSTANDARDS`. AutoCAD flags layers (and other named objects like text styles, dimension styles, linetypes) that do not match the DWS.
4. Fix violations: the checker offers to rename or remap the non-standard items.

## Auditing drawings

Beyond automated checking, periodic manual review catches issues that tooling misses:

- **Layer 0 pollution**: objects drawn on layer 0 instead of the correct standard layer. Civil 3D objects occasionally default to layer 0 if a style is misconfigured.
- **ByBlock vs ByLayer**: objects with color, linetype, or lineweight set to a specific value instead of ByLayer. Use `SETBYLAYER` to batch-reset.
- **Orphan layers**: layers that exist in the drawing but have no objects. Clean with `PURGE` > Layers.
- **Duplicate layers with slight name variations**: `C-ROAD-CTR` vs `C-ROAD-CNTR`. The Layer Translator or `LAYMRG` resolves these.

## Training staff

Tooling alone does not sustain a standard. Complement deployment with:

- A one-page layer naming reference sheet posted at each workstation or on the company intranet.
- A short training session (30 minutes) when the standard is first deployed, covering: why the standard exists, how to find the correct layer, how to use the template, and what happens when they deviate.
- A QA checklist for project managers to verify layer compliance before submittals.
- A named contact (CAD manager or standards lead) who answers layer questions and updates the standard as needs change.

## Maintenance

Layer standards evolve. Review annually:

- Add layers for new project types or disciplines.
- Retire layers that are no longer used.
- Update the DWT, DWS, and LAYTRANS map files simultaneously.
- Distribute updated templates and notify staff.

## Related

- [NCS overview](ncs-overview.md)
- [Civil 3D layer mappings](civil3d-layer-mappings.md)
- [AIA vs NCS](aia-vs-ncs.md)
- [Layer keys (properties)](layer-keys.md)
