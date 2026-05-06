---
title: "Sites and Topology"
section: "civil3d/parcels"
order: 40
visibility: public
tags: [parcel, site, topology, shared-boundary, alignment]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [CREATESITE, MOVEPARCELTOSITE]
updated: 2026-05-06
---

> **TL;DR**
> 1. A **site** is a topology container in Civil 3D. All parcels (and optionally alignments and grading groups) within the same site share boundaries — editing one shared edge adjusts both adjacent objects.
> 2. Shared-boundary topology is the core feature: when a lot line moves, both lots on either side update their areas and segment data automatically. This is what makes Civil 3D parcel layout tools powerful for subdivision design.
> 3. Use separate sites when objects should be topologically independent. A common pattern: one site for the subdivision plat, a separate site (or no site) for existing boundary parcels that should not interact with the design lots.

## What a site does

A site enforces planar topology rules on its members:

- **No overlapping parcels.** Two parcels in the same site cannot occupy the same area. Drawing a boundary that crosses an existing parcel splits the existing parcel into two.
- **Shared edges.** When two parcels share a boundary segment, that segment is stored once. Moving it moves the boundary for both parcels.
- **Automatic area update.** Because topology is maintained, parcel areas are always consistent. There is no risk of two adjacent lots claiming the same strip of land.

Objects that participate in site topology:

| Object | Behavior in site |
|---|---|
| Parcels | Share boundaries; subdivide each other |
| Alignments | Act as parcel edges if added to the site (e.g. a road centerline that splits a parcel) |
| Grading groups | Feature lines interact with parcel boundaries |

Surfaces, profiles, corridors, and pipe networks do **not** participate in site topology.

## Creating a site

- Prospector tab > right-click Sites > New (`CREATESITE`).
- A site is created automatically when you first create a parcel and no site exists.
- Name the site descriptively: `Plat_Phase1`, `Existing_Boundary`, `ROW_Acquisition`.

## Why alignments interact with parcels in the same site

An alignment placed in a site acts as a boundary line. If a horizontal alignment crosses a parcel, the parcel splits where the alignment intersects the boundary. This is useful for modeling a road ROW that divides a parent tract.

However, it catches users off guard: a proposed road alignment added to the subdivision site may unintentionally split lots. To avoid this:

- Place the alignment on a **separate site** (or on `<None>` — no site).
- Or create the ROW parcel from offset alignments converted to parcel boundaries, keeping the centerline alignment off the parcel site.

## Moving objects between sites

`MOVEPARCELTOSITE` (or right-click a parcel in Prospector > Move to Site) transfers a parcel from one site to another. When a parcel leaves a site:

- Its shared boundaries with remaining parcels are dissolved. The remaining parcels reclaim the area.
- In the new site, the parcel is independent unless other parcels share edges.

Moving between sites is an undo-able operation but can produce unexpected geometry changes. Verify areas after any move.

## When to use separate sites

| Scenario | Recommendation |
|---|---|
| Subdivision plat lots | One site for all lots + ROW |
| Existing deed parcels | Separate site per existing boundary (or one site for all existing parcels if they share boundaries) |
| ROW acquisition from multiple owners | One site per owner parcel, or one shared site if the topology should enforce no-gap coverage |
| Design alternatives | Separate sites so alternative layouts do not interact |
| Boundary survey (single parcel) | One site is fine; topology is trivial with one parcel |

## Topology rules in detail

### Enclosing parcel

Every site has an implied "enclosing parcel" — the area outside all defined parcels within the site's bounding region. When you create the first parcel in a site, the remainder becomes the enclosing parcel. As you add lots, the enclosing parcel shrinks. This ensures 100% area coverage within the site's topology.

### Splitting

Drawing a line across a parcel splits it into two. The split is immediate and creates two new parcels (or one new parcel and one modified parcel). To undo, `UNDO` within the same session.

### Merging

To merge two adjacent parcels, delete the shared boundary segment: select the segment > Delete key. The two parcels combine into one, and the area updates. The merged parcel takes the name/number of the lower-numbered parcel.

### Vertex editing

Individual vertices on parcel boundaries can be moved with grips. Moving a vertex that is shared among three or more parcels (a corner where three lots meet) updates all three lot areas and segment bearings/distances in real time.

## Sites and data shortcuts

Parcels are data-shortcuttable. When referencing parcels via data shortcuts, the topology travels with the parcel collection. Editing the source drawing's parcel boundaries updates all referenced drawings on synchronization.

However, data-shortcutted parcels are read-only in the referencing drawing. Topology edits must happen in the source drawing.

## Common gotchas

- **Unintended parcel splits.** Adding an alignment or drawing a feature line into a site with parcels can split existing parcels. Always check the site assignment before creating new objects.
- **Empty site.** A site with no parcels is valid but serves no purpose. Civil 3D does not prevent creation of empty sites.
- **Alignment in wrong site.** If an alignment was accidentally placed in the parcel site, move it to `<None>` or a different site. The parcels may need manual repair after the alignment is removed.
- **Shared boundary edit propagation.** Editing a shared boundary in a large subdivision can propagate changes through many lots (each lot adjusts its area). This is correct behavior but can be slow on large sites. Save before major edits.
- **Cross-site references.** A label on Parcel A cannot reference a property of Parcel B if they are on different sites. Keep related parcels (e.g. a lot and its adjacent easement) on the same site if labels must cross-reference.
- **Performance.** Sites with hundreds of parcels (large commercial subdivisions) can be slow to rebuild topology after edits. Consider breaking into phases on separate sites if real-time interaction is not needed between phases.

## Related

- [Creating parcels](creating-parcels.md)
- [Parcel sizing (slide line, swing line)](parcel-sizing.md)
- [Parcel labels and map check](parcel-labels.md)
- [Legal descriptions from parcels](legal-descriptions-from-parcels.md)
