---
title: "Cut/Fill Quick Checks"
section: "engineering/earthwork"
order: 10
visibility: public
tags: [earthwork, cut-fill, volume, average-end-area, tin-volume, estimating]
updated: 2026-05-06
---

> **TL;DR**
> 1. Three quick methods: **average-end-area** between cross sections, **TIN-to-TIN surface volume** in Civil 3D, and **grid method** (overlay a grid, compute depth x cell area). Each has a place depending on data and accuracy needs.
> 2. For bid estimates, within **10%** of the final quantity is generally considered adequate. For payment quantities, tighter methods (sections at 25 ft to 50 ft intervals, or composite TIN volumes) are expected.
> 3. Always check the result against intuition: a 1 ft average cut across a 1 acre site is roughly 1,600 CY. If your software reports 16,000 CY, something is wrong.

## Average-end-area method

The oldest and most widely used method. Cross sections are taken at intervals along an alignment. The volume between two adjacent sections is:

```
V = L x (A1 + A2) / 2
```

Where:
- V = volume between the two sections
- L = distance between sections
- A1, A2 = cut (or fill) area at each section

The total volume is the sum of all segment volumes.

### When to use

- Corridor projects (roads, channels, levees) where the geometry is linear.
- When cross sections already exist from design or survey.
- When the client or specification requires average-end-area (some DOT pay quantities are computed this way).

### Limitations

- Accuracy depends on section spacing. Wide spacing (100 ft) misses terrain variation between sections. Close spacing (25 ft) is more accurate but requires more data.
- Overestimates volume when cut or fill areas change rapidly (transitioning from cut to fill, for example). The prismoidal correction addresses this.
- Not ideal for irregularly shaped areas (detention ponds, borrow pits).

## TIN volume surface (Civil 3D)

Civil 3D can compute the volume between two TIN surfaces directly, without cross sections. This is done by creating a TIN Volume Surface (a composite surface that stores the difference between the two surfaces at every triangle vertex).

### How to create

1. Surfaces > Create Surface > select "TIN Volume Surface."
2. Select the base surface (existing ground) and the comparison surface (proposed grade).
3. Civil 3D computes cut and fill volumes across the entire bounded area.
4. View results in the Volumes Dashboard or in surface properties.

### When to use

- Site grading (pads, parking lots, detention ponds) where there is no single alignment.
- Checking corridor earthwork against section-based estimates.
- Any situation where both existing and proposed surfaces exist as TINs.

### Limitations

- Accuracy depends on the density and quality of both surfaces. A sparse existing surface with widely spaced shots will produce unreliable volumes.
- The boundary of the volume computation matters. If the TINs extend beyond the grading limits, the volume will include areas that are not being graded. Use a boundary polyline to limit the comparison area.
- TIN volume surfaces report net cut and net fill but do not directly output a mass haul diagram. For corridor work, section-based volumes are needed for haul analysis.

## Grid method

Overlay a rectangular grid on the site. At each grid node, compute the difference between existing and proposed elevations. The volume of each grid cell is:

```
V_cell = cell_area x average_depth_at_corners
```

Sum all cells.

### When to use

- Rough estimates when surfaces are not yet built.
- Checking results from other methods.
- Hand calculations for small areas.

### Limitations

- Grid resolution must be fine enough to capture terrain variation. A 50 ft grid on a 1 acre site gives only about 20 cells.
- Does not handle slopes and irregular boundaries well without adjustments.

## Quick sanity checks

| Situation | Quick math |
|---|---|
| 1 ft average depth over 1 acre | ~1,613 CY (43,560 SF / 27 CF per CY) |
| 1 ft average depth over 10,000 SF | ~370 CY |
| 6 in. average topsoil strip over 1 acre | ~807 CY |

If the software output does not align with a rough hand estimate, investigate before accepting the result. Common errors:

- Wrong surface assigned (comparing the wrong pair).
- Boundary not set (volume includes area outside the grading limits).
- Units mismatch (feet vs. meters, or CY vs. CF).
- Surface has spikes or flat triangles from bad survey data.

## Related

- [Volume methods](volume-methods.md)
- [Shrink and swell](shrink-swell.md)
- [Mass haul](mass-haul.md)
- [Topsoil stripping](topsoil-stripping.md)
