---
title: "Subassembly Catalogs and Tool Palettes"
section: "civil3d/corridors"
order: 15
visibility: public
tags: [subassembly, tool-palette, catalog, stock-subassembly, custom-subassembly]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [TOOLPALETTES, TOOLPALETTESCLOSE, ADDSUBASSEMBLY, IMPORTSUBASSEMBLY]
sources:
  - title: "Autodesk Civil 3D Help — Subassembly Catalog"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-B6CD7A57-1C4D-4E51-9B1C-1B3E6F3D3F3B"
updated: 2026-05-06
---

> **TL;DR**
> 1. Civil 3D ships approximately 200 stock subassemblies organized in the **Tool Palettes** (Ctrl+3) across categories: lanes, curbs, shoulders, daylight, generic links, marked channels, and rehab overlays. The **Catalog Browser** provides a searchable view of the full library.
> 2. Stock subassemblies handle the vast majority of road, channel, and utility-trench cross-sections. Key ones to know: `LaneSuperelevationAOR`, `BasicCurbAndGutter`, `DaylightBench`, `LinkSlopeToSurface`, and `ShoulderExtendSubbase`.
> 3. Custom subassemblies (from Subassembly Composer, .NET, or third parties) are imported into the palettes via right-click > Import Subassemblies or by dragging from the catalog.

## Tool Palettes overview

The Tool Palettes window (View tab > Palettes > Tool Palettes, or Ctrl+3) is the primary interface for browsing and placing subassemblies. Civil 3D installs several palette groups:

- **Civil Imperial Subassemblies** / **Civil Metric Subassemblies** — the main set, organized by tabs.
- **Civil Multiuse Subassemblies** — generic subassemblies that work in either unit system.

Right-click the palette title bar > select the palette group to switch between them.

### Palette tabs (Imperial, typical)

| Tab | Key subassemblies |
|---|---|
| Basic | LaneSuperelevationAOR, BasicLane, BasicCurbAndGutter, BasicShoulder, BasicSidewalk |
| Generic | LinkWidthAndSlope, LinkSlopeToElevation, LinkSlopeToSurface, ShapeFlowArea |
| Daylight | DaylightBench, DaylightCut, DaylightFill, DaylightMaxWidth, DaylightStandard |
| Rehab | MillOverlay, ConditionalCutOrFill, OverlayBridgeDeck |
| Channels | TrapezoidalChannel, TriangularDitch, VShapedDitch |
| Marked Point, Link, Shape | Utility shapes and marking points for custom geometry |

## Catalog Browser

For a more detailed view, use the Subassembly Catalog Browser:

1. Home tab > Create Design panel > Subassembly > Subassembly Catalog.
2. The browser lists every installed subassembly with:
   - Description and preview image.
   - Parameter list with defaults and ranges.
   - Help topic link.
3. Drag a subassembly from the catalog directly onto an assembly in the drawing.

The catalog is especially helpful when you know what behavior you need but not which subassembly provides it. For example, searching "daylight" returns all subassemblies that can cut/fill to an existing surface.

## Key stock subassemblies

### LaneSuperelevationAOR

The most commonly used lane subassembly for road design. It models a travel lane with:

- Configurable width, default cross slope, and pavement depth.
- Automatic superelevation response when superelevation data is attached to the alignment (Axis of Rotation method).
- Subbase layer with independent depth.

Use this for any crowned or superelevated roadway lane.

### BasicCurbAndGutter

Models a standard curb-and-gutter section. Parameters include gutter width, curb height above gutter flowline, curb depth below subgrade, and flag width (the flat top of the curb). Attachment points connect to the lane on one side and the sidewalk/daylight on the other.

### DaylightBench

Transitions from the last roadway component to the existing ground surface. Supports:

- Cut slope and fill slope (independently configurable).
- Benching: inserts horizontal benches at specified vertical intervals in cut situations.
- Maximum cut height before benching triggers.

Requires a **surface target** so it knows where existing ground is.

### LinkSlopeToSurface

A simpler daylight subassembly that slopes at a constant grade until it hits the target surface. No benching. Used for ditches, simple fill slopes, and utility trench backfill.

### ShoulderExtendSubbase

Extends the subbase layer from the lane through the shoulder. Models the aggregate base course that continues beyond the pavement edge to support the shoulder.

## Importing custom subassemblies

Custom subassemblies (built in Subassembly Composer, coded in .NET, or obtained from third parties) can be added to the palettes:

1. Right-click a palette tab > Import Subassemblies.
2. Browse to the `.pkt` file (Subassembly Composer output) or `.dll` (compiled .NET subassembly).
3. The subassembly appears on the palette tab, ready to use like any stock component.

Alternatively, drag a `.pkt` file from Windows Explorer directly onto a palette tab.

### Subassembly sources

| Source | Format | Notes |
|---|---|---|
| Subassembly Composer | `.pkt` | Flowchart-based design; no coding required |
| .NET API | `.dll` | Full programmatic control; requires Visual Studio |
| Autodesk App Store | `.pkt` or `.dll` | Third-party subassemblies for specialized geometry |
| Tool Palette exchange | `.xtp` | Export/import entire palette tabs between users |

## Managing palettes

- **Export a palette tab** — right-click > Export. Produces a `.xtp` file you can share.
- **Import a palette tab** — right-click > Import. Load a `.xtp` from a colleague or company standard.
- **Reorder tabs** — right-click > Customize Palettes to drag tabs into the desired order.
- **Company standard palettes** — save the palette file (`.atc`) to a shared network location and point all users to it via Options > Files > Tool Palette File Locations.

## Tips

- Before building a custom subassembly, check the full catalog. Civil 3D's stock library is extensive, and combining two or three generic subassemblies often achieves what looks like a custom requirement.
- When a stock subassembly almost works but needs a minor tweak, try adjusting its parameters first. Many parameters accept expressions (e.g., conditional slopes based on another parameter).
- Keep a reference assembly in each project DWG with labeled subassemblies. This helps new team members understand the corridor cross-section without digging into properties.

## Related

- [Assemblies and subassemblies](assemblies-and-subassemblies.md)
- [Subassembly Composer](subassembly-composer.md)
- [Targets (surface, alignment, profile)](targets.md)
- [Corridor troubleshooting](troubleshooting-corridors.md)
