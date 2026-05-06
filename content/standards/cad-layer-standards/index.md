---
title: "CAD Layer Standards"
section: "standards/cad-layer-standards"
order: 40
visibility: public
tags: [cad-standards, ncs, layers, naming]
updated: 2026-05-06
---

> **TL;DR**
> 1. The **National CAD Standard (NCS)** is the U.S. consensus layer naming convention — published by NIBS, used widely in AEC. It uses fields: **Discipline** + **Major** + **Minor** + **Status** (e.g., `C-ROAD-CNTR-N` for new road centerline).
> 2. **AIA layers** are NCS's predecessor; many firms still use a hybrid. Don't fight it — pick one company-wide standard and a translation table for the other.
> 3. Civil 3D respects layers via **object styles** and **label styles**; don't draw on them with `LAYER` — let styles control display.

## Pages

- [NCS overview (discipline / major / minor / status)](ncs-overview.md)
- [Common Civil 3D layer mappings (NCS-aligned)](civil3d-layer-mappings.md)
- [AIA vs NCS](aia-vs-ncs.md)
- [Layer keys (transparency, lineweight, plot color)](layer-keys.md)
- [Standardizing across a company](standardizing-company-wide.md)

## Related

- [Templates & country kits](../../customization/templates-and-kits/index.md)
- [Plotting & CTB](../plotting-and-ctb/index.md)
