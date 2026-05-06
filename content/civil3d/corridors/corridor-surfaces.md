---
title: "Corridor Surfaces"
section: "civil3d/corridors"
order: 30
visibility: public
tags: [corridor-surface, surface-boundary, feature-line, data-shortcut, tin-surface]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CORRIDORPROPERTIES, CORRIDORSURFACE, CREATESHORTCUT]
sources:
  - title: "Autodesk Civil 3D Help — Corridor Surfaces"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-7F5D6C3F-7B9F-4D5D-8F6E-B5E3D5A8E3F7"
updated: 2026-05-06
---

> **TL;DR**
> 1. A corridor does not automatically produce a usable TIN surface. You must **extract surfaces** from the corridor by specifying which links (Top, Datum, or named codes) to triangulate. The result is a corridor surface that updates when the corridor rebuilds.
> 2. **Boundaries** prevent the corridor surface from triangulating across voids (medians, bridges) or beyond the corridor's daylight limits. The most reliable boundary source is a corridor feature line (e.g., the daylight code).
> 3. Corridor surfaces can be promoted to **data shortcuts** so other drawings (grading, drainage, earthwork) can reference them without opening the corridor drawing.

## Why extract a corridor surface

The corridor model is a set of cross-sections connected by links and feature lines. It is not a TIN surface by itself. To perform grading, compute earthwork volumes, generate contours, or reference the corridor elevation in other objects (pipe networks, grading groups), you need to extract one or more surfaces from the corridor data.

## Creating corridor surfaces

1. Select the corridor > right-click > Corridor Properties > Surfaces tab.
2. Click "Create a corridor surface" (the + icon).
3. Name the surface (e.g., "Corridor - Top", "Corridor - Datum").
4. Under **Specify Code**, choose which link codes to include. Common choices:
   - **Top** — the finished-grade surface (pavement, shoulder, daylight slopes).
   - **Datum** — the bottom of pavement structure (subgrade level).
   - **Specific codes** — e.g., only "Pave" links for the paved area, or only "Daylight" for the earthwork limits.
5. Check "Add as Surface Link." Civil 3D adds the selected links to the surface.
6. Add a boundary (see below).
7. Click Apply. The surface generates.

### Multiple surfaces from one corridor

You can extract several surfaces simultaneously:

| Surface | Links included | Use |
|---|---|---|
| Top (finished grade) | Top | Grading tie-ins, contour display, pipe cover checks |
| Datum (subgrade) | Datum | Subgrade earthwork volume, proof-roll area |
| Pave only | Pave | Paving quantity (area and volume between Top and Datum) |

## Boundaries

Without a boundary, the corridor surface triangulates across gaps and beyond the corridor's physical limits, producing erratic triangles. Always add a boundary.

### Boundary from corridor feature lines

The most common approach:

1. In the Surfaces tab, expand the surface > right-click Boundaries > Add from Corridor.
2. Choose a feature line code:
   - **Daylight** — the outermost code on each side. Creates a boundary that follows the daylight line along the full corridor length.
   - **ETW** (edge of travel way) — useful if you only want the paved surface.
3. Select the side (left, right, or both).
4. Set the boundary type: **Hide** (most common — clips surface triangulation) or **Show** (keeps only the area inside the boundary and hides the rest; less commonly used for corridor surfaces).

### Boundary from polyline

If the corridor feature lines don't form a clean closed boundary (e.g., at intersections or cul-de-sacs), draw a polyline around the desired area and use it as an outer boundary:

1. Surfaces tab > Boundaries > Add Interactively.
2. Select the polyline. Choose Non-Destructive or Destructive breakline behavior.

### Multiple boundaries

Complex corridors may need multiple boundaries:

- An outer boundary from daylight lines.
- Inner "hide" boundaries to mask medians, bridge decks, or other voids where the corridor surface should not exist.

## Corridor surface properties

Corridor surfaces inherit the standard Civil 3D surface properties:

- **Style** — controls contour display, triangulation visibility, and elevation banding.
- **Analysis** — slope arrows, watersheds, elevation analysis.
- **Volume surface** — a corridor surface can be one half of a volume surface (compared against existing ground to compute cut/fill).

However, corridor surfaces cannot be edited the way a standalone TIN surface can. You cannot manually add breaklines or edit triangles. The surface is regenerated from the corridor data on each rebuild.

## Sharing corridor surfaces via data shortcuts

To use the corridor surface in other drawings (e.g., a grading drawing that ties into the road):

1. Prospector > Data Shortcuts > right-click > Create Data Shortcuts.
2. Check the corridor surface(s) to share.
3. In the referencing drawing, Prospector > Data Shortcuts > Surfaces > right-click the shared surface > Create Reference.

The referenced surface is read-only in the target drawing and updates when the source corridor is rebuilt and shortcuts are synchronized.

### Tips for data-shortcut surfaces

- Share the corridor's finished-grade surface, not the corridor object itself. Corridor objects cannot be shared via data shortcuts; only their extracted surfaces, alignments, and profiles can.
- If the corridor surface boundary changes (e.g., the corridor is extended), re-create the data shortcut or synchronize in the referencing drawing.
- Keep the corridor drawing and referencing drawings in the same project folder structure for reliable path resolution.

## Rebuilding and performance

Corridor surfaces rebuild whenever the corridor rebuilds. For large corridors, surface extraction adds time to each rebuild cycle. To mitigate:

- Extract only the surfaces you need. Do not create a "Top" surface if you only need "Datum."
- Set the corridor to manual rebuild mode during heavy editing.
- Use a coarser frequency for preliminary design; refine for final.
- If the corridor surface is only needed for volume computation, consider extracting it once (using `CORRIDORSURFACE` to export to a standalone surface) rather than keeping it dynamic.

## Related

- [Corridor frequency and regions](frequency-and-regions.md)
- [Corridor sections and section views](corridor-sections.md)
- [Targets (surface, alignment, profile)](targets.md)
- [Corridor troubleshooting](troubleshooting-corridors.md)
