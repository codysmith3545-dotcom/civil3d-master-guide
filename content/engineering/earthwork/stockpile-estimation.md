---
title: "Stockpile Volume Estimation"
section: "engineering/earthwork"
order: 30
visibility: public
tags: [earthwork, stockpile, volume, drone, gps, civil3d, measurement]
appliesTo: [civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. Stockpile volumes are measured by creating a surface of the stockpile and computing the volume above the base grade. Methods: **drone survey** (fastest for large stockpiles), **GPS topo** (reliable, no flight logistics), **conventional total station** (highest accuracy per point), and **cross-section** (simplest field method).
> 2. Civil 3D's Volumes Dashboard or a TIN volume surface computes stockpile volume by comparing the stockpile surface to a base surface (the pad beneath the pile). Define the base carefully — errors in the base surface directly affect the volume.
> 3. Accuracy expectations: drone survey +/- 3% to 5%, GPS topo +/- 5% to 8%, cross-section +/- 5% to 10%. For payment quantities, the method and accuracy should be agreed upon before measurement.

## Survey methods

### Drone (UAS) photogrammetry

A drone flies a grid pattern over the stockpile, capturing overlapping photographs. Photogrammetric processing (Pix4D, DroneDeploy, Agisoft, etc.) generates a dense point cloud and a surface model.

Advantages:
- Fast data collection, especially for large or multiple stockpiles.
- Dense surface model (thousands of points per stockpile).
- Photo documentation included.

Limitations:
- Requires ground control points (GCPs) for accurate georeferencing. Without GCPs, the vertical accuracy may be insufficient for volume measurement.
- Dark, uniform material (black asphalt millings, dark topsoil) can challenge photogrammetric matching.
- FAA Part 107 certification required for commercial operations.

Typical accuracy: +/- 0.1 ft vertical with adequate GCPs, translating to +/- 3% to 5% volume accuracy for stockpiles over 500 CY.

### GPS topo

A surveyor walks the stockpile with an RTK GPS rover, collecting points along the base, the toe, the slopes, and the crown.

Advantages:
- No flight logistics or regulatory requirements.
- Direct coordinate and elevation accuracy per point.
- Works in all weather and lighting conditions.

Limitations:
- Point density is limited by how many points the surveyor collects. A stockpile with a complex shape requires more shots.
- Walking on loose, steep stockpiles can be difficult and unsafe (especially aggregate piles with steep angles of repose).

Typical point spacing: 5 ft to 15 ft on the surface, with breaklines along the toe and crest. Accuracy: +/- 5% to 8% volume depending on point density and pile shape.

### Conventional total station

The surveyor sets up a total station and shoots points on the stockpile with a prism rod or reflectorless mode.

Advantages:
- Highest positional accuracy per point.
- No satellite reception issues (works under trees, near buildings).

Limitations:
- Slower than GPS for large piles.
- Requires line of sight to each point.
- Point density is typically lower than GPS.

### Cross-section method

The simplest field method. The surveyor measures cross sections across the stockpile at regular intervals (10 ft to 25 ft). Each section is defined by horizontal distance and elevation readings. The volume is computed by the average-end-area method between sections.

This method does not require a total station or GPS — a tape and level are sufficient. It is appropriate for small stockpiles, quick checks, and situations where survey equipment is not available.

## Computing volume in Civil 3D

### TIN volume surface approach

1. Create a TIN surface from the stockpile survey data (the "stockpile surface").
2. Create or obtain a surface of the base grade beneath the pile (the "base surface"). This may be:
   - A surface from a survey of the pad before the stockpile was placed.
   - A flat plane at the elevation of the pad.
   - A surface interpolated from the toe-of-pile points.
3. Create a TIN Volume Surface: base = base surface, comparison = stockpile surface.
4. Add a boundary at the toe of the pile.
5. Read the fill volume from the surface statistics. This is the stockpile volume.

### Volumes Dashboard approach

1. Analyze > Volumes Dashboard.
2. Select the base surface, the stockpile surface, and a boundary polyline.
3. Read the fill volume.

### Critical: the base surface

The base surface has the largest impact on volume accuracy. If the base surface is 0.2 ft too high across a 10,000 SF stockpile, the volume error is approximately 74 CY. Common approaches:

- **Pre-stockpile survey.** Survey the pad before the pile is placed. Best accuracy.
- **Toe-of-pile interpolation.** Survey the toe of the pile and let Civil 3D create a surface from the toe points. Assumes the base is a smooth surface between the toe points.
- **Flat datum.** Use a flat surface at the lowest toe elevation. Overestimates volume if the pad slopes.

## Accuracy and agreement

For payment purposes, the measurement method and expected accuracy should be agreed upon in writing before the measurement. Key items to agree on:

- Method (drone, GPS, section).
- Who performs the measurement (owner's surveyor, contractor's surveyor, or both independently).
- How the base surface is determined.
- Whether the volume is reported in BCY, LCY, or CCY (stockpile volumes are typically LCY — the material has been excavated and loosely placed).
- Tolerance for acceptance (e.g., if independent measurements differ by less than 5%, average them; if they differ by more, re-measure).

## Related

- [Cut/fill quick checks](cut-fill-quick-checks.md)
- [Volume methods](volume-methods.md)
- [Shrink and swell](shrink-swell.md)
- [Topsoil stripping](topsoil-stripping.md)
