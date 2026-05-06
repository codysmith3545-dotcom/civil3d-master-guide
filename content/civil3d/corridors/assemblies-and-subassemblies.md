---
title: "Assemblies and Subassemblies"
section: "civil3d/corridors"
order: 10
visibility: public
tags: [assembly, subassembly, baseline, cross-section, tool-palette, lane, curb, daylight]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEASSEMBLY, ADDSUBASSEMBLY, ASSEMBLYPROPERTIES]
sources:
  - title: "Autodesk Civil 3D Help — Assemblies Overview"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-1E34F9C5-6D6C-4C3B-8975-FE5AE1D9FC2E"
updated: 2026-05-06
---

> **TL;DR**
> 1. An **assembly** is a cross-section template built from individual **subassemblies** (lane, curb, sidewalk, daylight, etc.) attached to a baseline. The corridor sweeps this assembly along an alignment and profile to produce the 3D model.
> 2. Create an assembly with `CREATEASSEMBLY`, then drag subassemblies from the **Tool Palettes** and snap them to the assembly's baseline or to the attachment point of an adjacent subassembly.
> 3. Each subassembly has **parameters** (width, slope, depth, curb dimensions) that can be edited in Properties or overridden per corridor region.

## What is an assembly?

An assembly is a Civil 3D drawing object that represents a typical cross-section. It contains:

- A **baseline** — a vertical line that marks the alignment/profile attachment point (typically the road centerline or a lane edge).
- **Subassemblies** — parametric cross-section components attached to the left side, right side, or both sides of the baseline.

When a corridor references the assembly, Civil 3D computes a cross-section at each frequency station by evaluating every subassembly's geometry at that location.

## Creating an assembly

1. Home tab > Create Design panel > Assembly > Create Assembly (`CREATEASSEMBLY`).
2. Enter a name (e.g., "Urban 2-Lane") and pick an insertion point in the drawing. A vertical marker line appears.
3. Set the assembly style and code set style in the Properties palette. The code set style controls how corridor feature lines, links, and shapes are named and layered.

The assembly exists as a standalone object in model space. It is not yet associated with any alignment or corridor.

## Attaching subassemblies

Subassemblies come from the **Tool Palettes** (View tab > Palettes > Tool Palettes, or press Ctrl+3). Civil 3D ships multiple palettes organized by category:

| Palette | Contents |
|---|---|
| Lanes | LaneSuperelevationAOR, LaneOutsideSuperAOR, LaneParabolic |
| Curbs | BasicCurbAndGutter, UrbanCurbAndGutter, MedianDitchGutter |
| Shoulders | ShoulderSubbase, ShoulderExtendSubbase |
| Daylight | DaylightBench, DaylightCut, DaylightFill, DaylightMaxWidth, LinkSlopeToSurface |
| Generic | LinkWidthAndSlope, LinkSlopeToElevation, ShapeFlowArea |
| Rehab | MillOverlay, OverlayBridgeDeck |

### Attachment workflow

1. Open the Tool Palettes. Navigate to the desired palette tab.
2. Click the subassembly icon.
3. In the drawing, click the assembly's baseline (or an existing subassembly's attachment point) to place it on the left or right side.
4. The subassembly snaps to the marker side you clicked. If you click on the right of the baseline, it attaches to the right.
5. The Properties palette shows the subassembly's parameters. Edit width, slope, depth, and other values.

### Attachment points

Each subassembly has defined **attachment points** — typically a top, bottom, and side connection. When you place a curb subassembly, its left attachment point aligns with the lane subassembly's right attachment point. This chain creates a continuous cross-section from the baseline outward.

The attachment point names (e.g., `Crown`, `EdgeOfPavement`, `Back_Curb`) become corridor **codes** that you can reference later as feature lines.

## Subassembly parameters

Every subassembly has a parameter set that controls its shape. Parameters vary by subassembly type. Common examples:

| Subassembly | Key parameters |
|---|---|
| LaneSuperelevationAOR | Width, DefaultSlope, PavementDepth, SubbaseDepth |
| BasicCurbAndGutter | GutterWidth, CurbHeight, CurbDepth, FlagWidth |
| DaylightBench | CutSlope, FillSlope, BenchWidth, MaxCutHeight |
| LinkSlopeToSurface | Slope (cut and fill sides), surface target reference |

Parameters are set initially in the Properties palette when attaching. They can be changed later by selecting the subassembly in the assembly and editing Properties, or overridden per corridor region in the corridor's properties.

## Assembly baseline vs offset assemblies

A standard corridor has one baseline (the centerline alignment and profile). The assembly's baseline aligns with this. For more complex designs:

- **Offset assemblies** — a corridor can include offset baselines (e.g., edge-of-travel-way alignments) with their own assemblies. This is useful for divided highways where the median and each direction have independent profiles.
- **Multiple baselines** — added in corridor properties. Each baseline references an alignment and profile pair and uses its own assembly.

## Tips

- Build assemblies in a dedicated area of model space (away from the plan drawing) so you can see the cross-section shape clearly. The assembly is referenced by the corridor regardless of its position.
- Name assemblies descriptively: include the road type, width, and key features (e.g., "Collector 36ft B-B w/ 5ft Sidewalk").
- Do not delete an assembly that is in use by a corridor. The corridor will lose its cross-section definition and fail to rebuild.
- When testing subassembly configurations, create a short test corridor (a few hundred feet) before applying to the full alignment. This saves rebuild time.
- Copy an assembly (`COPYASSEMBLY` or standard COPY command) to create variants — for example, a normal section and a superelevated section.

## Related

- [Subassembly catalogs and tool palettes](subassembly-catalogs.md)
- [Targets (surface, alignment, profile)](targets.md)
- [Corridor frequency and regions](frequency-and-regions.md)
- [Subassembly Composer](subassembly-composer.md)
