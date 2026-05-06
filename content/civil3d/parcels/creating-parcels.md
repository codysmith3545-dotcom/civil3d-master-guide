---
title: "Creating Parcels"
section: "civil3d/parcels"
order: 10
visibility: public
tags: [parcel, create, polyline, row, right-of-way, layout]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [CreateParcelFromObjects, CREATEPARCELBYINTERACTIVELAYOUT, CREATEPARCELFROMENTITIES]
updated: 2026-05-06
---

> **TL;DR**
> 1. The most common method is `CreateParcelFromObjects` — select closed polylines, lines, or arcs, and Civil 3D converts them into parcel objects within a site. The polylines must form closed areas; gaps cause "open" parcels that have no area label.
> 2. Define the right-of-way (ROW) first as Parcel 0. The ROW parcel becomes the outer boundary; interior lot lines subdivide the remaining area and the topology engine automatically clips lots to the ROW edge.
> 3. All parcels live inside a **site**. Parcels within the same site share boundaries — moving a shared boundary adjusts both adjacent parcels. Use separate sites only when parcels should be topologically independent.

## Methods for creating parcels

### CreateParcelFromObjects

The standard workflow for converting linework into parcels:

1. Draw or import the parcel boundary geometry as AutoCAD polylines, lines, and arcs. Ensure every closed region is fully closed — `PEDIT` > Close if needed.
2. Home tab > Create Design panel > Parcel > Create Parcel from Objects (`CreateParcelFromObjects`).
3. Select the objects.
4. Civil 3D prompts for:
   - **Site**: which site to add parcels to (or create a new one).
   - **Parcel style**: the object style controlling display (fill color, boundary linetype).
   - **Label style**: area label, segment labels.
   - **Erase existing entities**: whether to delete the source polylines after conversion.
   - **Auto-add segment labels**: whether to place bearing-distance and curve labels on every segment.

Civil 3D identifies all closed loops formed by the selected geometry and creates one parcel per loop. If lines cross, the intersection creates additional parcels for each enclosed region.

### Interactive layout

`CREATEPARCELBYINTERACTIVELAYOUT` lets you draw parcel boundaries directly as Civil 3D parcel segments (not as raw polylines). Each segment snaps to existing parcel edges and alignment geometry, maintaining topology in real time. This method is useful for small-lot subdivision design where you want immediate visual feedback.

### From alignment and offsets

For road corridor subdivisions:

1. Create the centerline alignment.
2. Use offset alignments or feature lines to define the ROW edges.
3. Convert the ROW boundaries into a parcel (the ROW parcel).
4. Use the parcel sizing tools (slide line, swing line) to subdivide the remaining area into lots. See [Parcel sizing](parcel-sizing.md).

## Defining the right-of-way as Parcel 0

In subdivision plat work, the ROW parcel is conventionally numbered 0 (or given a descriptive name like "ROW" or "STREET"). It serves as the outer boundary that interior lots subtract from:

1. Draw the ROW boundaries as a closed polyline encompassing the street area.
2. `CreateParcelFromObjects` to convert it. Assign it to the desired site.
3. Rename the parcel to `ROW` or `0: Right-of-Way` in Prospector.
4. Now draw the lot boundaries inside the ROW area. Each closed loop inside the ROW becomes a lot parcel.

Because all parcels in the same site share topology, the lot parcels automatically reference the ROW edge as their front boundary. Moving the ROW edge adjusts the lot frontage.

## Parcel numbering and naming

Parcels are numbered automatically starting from 1 (or the next available number). Rename in Prospector or by selecting the parcel area label and editing properties.

Naming conventions vary by jurisdiction:

- **Subdivision plats**: Lot 1, Lot 2, ... Block A, Block B, ...
- **Boundary surveys**: Tract 1, Parcel A, etc.
- **ROW acquisitions**: Station-based names (e.g. Parcel 15+00 L).

## Parcels from legal descriptions

When retracing an existing legal description:

1. Enter the metes-and-bounds calls as lines and arcs (use `LINE` with bearings, or `CreatePoints` at corners and connect with polylines).
2. Close the traverse.
3. `CreateParcelFromObjects` to create the parcel.
4. Compare the computed area with the deed area to check closure.

For a formal map-check workflow, see [Parcel labels and map check](parcel-labels.md).

## Creating parcels from feature lines or grading

Feature lines from a grading plan can define parcel boundaries (e.g. pad limits, pond outlines). Convert them to parcels with `CreateParcelFromObjects` to compute enclosed areas and generate area labels for earthwork calculations.

## Common gotchas

- **Open boundaries.** If the source geometry has a gap (even 0.001 ft), the parcel is "open" — it has no area, no area label, and a warning icon in Prospector. Use `PEDIT` > Close or snap to the endpoint.
- **Self-intersecting polylines.** A polyline that crosses itself creates multiple parcels — one per enclosed loop. This is intentional behavior but surprises users who expected one parcel.
- **Wrong site.** Accidentally adding parcels to a site that already contains alignments or other parcels forces shared topology with those objects. To avoid unwanted interactions, create a dedicated site for the parcel layout.
- **Parcel 0 not first.** If lots are created before the ROW, the lots define their own boundaries. Adding the ROW later intersects existing lots, potentially splitting them. Always define the ROW parcel first.
- **Erase existing entities.** Choosing "Yes" deletes the source polylines permanently. If you may need the polylines later (e.g. for a different site), choose "No" and delete manually after verifying the parcels.
- **Curved segments.** Arcs in the source geometry become parcel curve segments. If the source is a polyline with arc segments, they transfer correctly. If the source is a spline, Civil 3D approximates it with line segments — use arcs for true curves.

## Related

- [Parcel sizing (slide line, swing line)](parcel-sizing.md)
- [Parcel labels and map check](parcel-labels.md)
- [Sites and topology](sites-and-topology.md)
- [Legal descriptions from parcels](legal-descriptions-from-parcels.md)
