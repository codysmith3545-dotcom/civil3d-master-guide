---
title: "Surfaces"
section: "civil3d/surfaces"
order: 40
visibility: public
tags: [surface, tin, breakline, boundary, volume]
updated: 2026-05-06
---

> **TL;DR**
> 1. Surfaces are **TIN** (triangulated irregular network) by default. Build from **points + breaklines + boundaries** — in that order of importance for accuracy.
> 2. Always set an **outer boundary** (non-destructive) to clip the TIN to the area you actually surveyed.
> 3. **Volumes**: prefer **TIN-volume surface** for two-surface comparisons; **composite volume** for one-off quick numbers; **stockpile** wizard for stockpiles.

## Pages

- [Building a TIN surface](building-a-tin-surface.md)
- [Breaklines and boundaries](breaklines-and-boundaries.md)
- [Surface analysis (slope, elevation, watershed)](surface-analysis.md)
- [Volume calculations](volume-calculations.md)
- [Surface editing (paste, smooth, simplify)](surface-editing.md)
- [Grid surfaces vs TIN](grid-surfaces.md)
- [Importing existing surfaces (LandXML, DEM, GIS)](importing-surfaces.md)
- [Surface labels and contours](surface-labels-and-contours.md)
- [Troubleshooting surfaces](troubleshooting-surfaces.md)

## Related

- [Points](../points/index.md)
- [Grading](../grading/index.md)
- [Earthwork](../../engineering/earthwork/index.md)
