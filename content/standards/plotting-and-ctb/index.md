---
title: "Plotting & CTB / STB"
section: "standards/plotting-and-ctb"
order: 50
visibility: public
tags: [plot, ctb, stb, page-setup, lineweight]
updated: 2026-05-06
---

> **TL;DR**
> 1. **CTB** plot styles map by **color** to lineweight/screening — the legacy "ACI 1=red=0.3mm" world. **STB** maps by named style — more flexible but requires up-front discipline.
> 2. Set the company's plot styles in `%APPDATA%\Autodesk\<release>\enu\Plotters\Plot Styles\` (or wherever the support paths point). Distribute via deployment so everyone sees the same files.
> 3. **Page setups** in a master DWT save the page setup → printer → paper size → CTB combination so anybody can plot the right way without thinking.

## Pages

- [CTB vs STB (when to use which)](ctb-vs-stb.md)
- [Plotting quick reference](plotting-quick-reference.md)
- [Page setups in a template](page-setups.md)
- [Lineweight conventions](lineweight-conventions.md)
- [PDF publishing (multi-sheet)](pdf-publishing.md)
- [Common plotting issues](common-plotting-issues.md)

## Related

- [Plan production](../../civil3d/plan-production/index.md)
- [CAD layer standards](../cad-layer-standards/index.md)
