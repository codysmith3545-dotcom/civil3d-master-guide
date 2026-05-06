---
title: "Parcel Sizing Tools"
section: "civil3d/parcels"
order: 20
visibility: public
tags: [parcel, sizing, slide-line, swing-line, lot-layout, subdivision]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [PARCELSLIDELINECREATE, PARCELSWINGLINECREATE, PARCELFREEFORMCREATE]
updated: 2026-05-06
---

> **TL;DR**
> 1. **Slide line** moves a lot line laterally along the frontage until the parcel reaches a target area, minimum width, or minimum depth. It is the primary tool for sizing rectangular or near-rectangular lots along a straight or curved frontage.
> 2. **Swing line** pivots a lot line around a fixed point (typically a front corner) until the parcel hits the target area. It is suited to irregular-shaped parcels where sliding is not practical.
> 3. Both tools work on an existing parcel and subdivide it. Start with a large "remainder" parcel, then repeatedly apply slide or swing to carve out lots of the required size.

## Slide line

### Concept

The slide line tool takes an existing parcel, identifies a frontage (the side along the road or ROW), and slides an internal lot line parallel to that frontage until the carved-out lot meets the specified sizing criteria.

### Workflow

1. Home tab > Create Design > Parcel > Parcel Creation Tools (opens the Parcel Layout Tools toolbar).
2. Select `Slide Line — Create` from the toolbar.
3. Civil 3D prompts:
   - **Parcel to subdivide**: select the large remainder parcel.
   - **Frontage**: click the frontage segment (the edge of the ROW or road).
   - **Start point**: the corner where the first lot begins.
   - **Sizing parameters**: target area (e.g. 10,000 sq ft), minimum width (e.g. 50 ft at the building setback line), minimum depth (e.g. 100 ft), and whether to use the frontage at the ROW or at a specified offset.
4. Civil 3D places the first lot line, computes the area, and adjusts until the target is met.
5. Accept or adjust. The tool then offers to create the next lot along the same frontage.

Repeat until the remainder parcel is too small for another lot.

### Parameters

| Parameter | Description |
|---|---|
| **Minimum area** | The smallest acceptable lot area. The tool stops sliding when this is reached. |
| **Maximum area** | Upper bound; the tool will not exceed this. |
| **Minimum width** | Measured at the frontage (or at an offset line). Ensures the lot is wide enough for a building pad. |
| **Minimum depth** | Perpendicular distance from the frontage to the rear lot line. |
| **Use minimum frontage at offset** | When on, width is measured not at the ROW edge but at a setback distance (e.g. 25 ft from the front property line). |
| **Multiple solution preference** | When the geometry allows more than one position that meets the criteria, choose smallest area, largest area, or nearest to the start point. |

### Curved frontage

On a curved frontage (cul-de-sac, curvilinear street), the slide line tool creates radial lot lines emanating from the curve center. Lots are wedge-shaped with a narrow front on the curve and a wider rear boundary. The minimum-width parameter is measured along the arc at the frontage or at the offset line.

## Swing line

### Concept

The swing line tool pivots a lot line around a fixed point — typically one corner of the lot — until the enclosed area meets the target. This produces a trapezoidal or triangular lot, unlike the rectangular lots from slide line.

### Workflow

1. Parcel Layout Tools toolbar > `Swing Line — Create`.
2. Select the parcel to subdivide.
3. Select the pivot point (an existing parcel corner).
4. Enter the target area.
5. Civil 3D rotates the lot line around the pivot until the area is satisfied. Two solutions may exist (one on each side); select the desired one.

Swing line is useful for:

- **Irregular parcels** where the rear boundary is not parallel to the frontage.
- **Flag lots** where the access strip connects to a wider rear area.
- **Corner lots** at street intersections where both frontages constrain the geometry.

## Free-form create

`PARCELFREEFORMCREATE` lets you draw a parcel boundary segment by segment with no sizing automation. Use this when the lot shape is dictated by existing features (creek, easement, building footprint) rather than a numeric target.

After drawing, the tool reports the enclosed area. You can then manually adjust vertices with grips until the area meets requirements.

## Sizing workflow for a subdivision

A typical subdivision plat workflow:

1. **Define the ROW parcel** encompassing the street. See [Creating parcels](creating-parcels.md).
2. **Create the remainder parcel** — the entire developable area outside the ROW.
3. **Set lot standards**: target area per the local zoning ordinance (e.g. R-1 zone requires 10,000 sq ft minimum lots with 70 ft minimum frontage).
4. **Slide line** along the first frontage to carve out lots. Accept each lot as it meets the standard.
5. **Repeat** for the opposite side of the street.
6. **Swing line** on corner parcels and irregular shapes.
7. **Verify** that the remainder parcel (if any) is labeled and accounted for (e.g. designated as a common area or open space).
8. **Renumber lots** in Prospector to match the desired plat numbering.

## Minimum-frontage compliance

Many zoning ordinances require a minimum lot width measured at the building setback line, not at the property line. The "Use minimum frontage at offset" parameter handles this:

- Set the offset distance equal to the front setback (e.g. 25 ft).
- The tool ensures the lot is at least the specified width at that depth, even if the frontage on the ROW is narrower (common on cul-de-sac lots).

## Common gotchas

- **Wrong frontage selected.** If you select the rear boundary instead of the front, the lots are created backwards — fronting the wrong direction. Undo and reselect.
- **Remainder too small.** When the last lot in a row is smaller than the minimum area, the tool reports a failure. Options: combine the remainder with the adjacent lot, reduce lot count, or adjust the minimum area for the last lot.
- **Topology conflicts.** The new lot line must not cross existing lot boundaries within the same site. If it does, Civil 3D adjusts or warns. Ensure the remainder is a clean closed parcel before subdividing.
- **Undo behavior.** Each lot creation is a separate undo step. `UNDO` removes the last lot and restores the remainder to its previous size.
- **Precision and rounding.** The target area is an exact number; the tool iterates until within a tolerance (usually 0.01 sq ft). If the geometry makes exact compliance impossible (e.g. an irregular rear boundary), the tool reports the closest achievable area.

## Related

- [Creating parcels](creating-parcels.md)
- [Parcel labels and map check](parcel-labels.md)
- [Sites and topology](sites-and-topology.md)
- [Legal descriptions from parcels](legal-descriptions-from-parcels.md)
