---
title: "Civil 3D"
section: "civil3d"
order: 10
visibility: public
tags: [civil3d, overview]
updated: 2026-05-06
---

> **TL;DR**
> 1. This section covers Civil 3D objects and the workflows that produce them.
> 2. Most projects move points → surface → alignment → profile → corridor → grading → pipe networks → plan production.
> 3. Use [data shortcuts](data-shortcuts/index.md) early to keep design objects shared and not duplicated.

## Sub-sections

| Section | What's there |
|---|---|
| [Fundamentals](fundamentals/index.md) | Workspace, toolspace, templates, drawing settings |
| [Survey](survey/index.md) | Survey database, FBK, figures, linework, network adjustment |
| [Points](points/index.md) | Import/export, description keys, point groups, styles |
| [Surfaces](surfaces/index.md) | TIN, breaklines, boundaries, analysis, volumes |
| [Alignments](alignments/index.md) | Horizontal geometry, design criteria, offsets |
| [Profiles](profiles/index.md) | Surface and layout profiles, vertical curves, profile views |
| [Corridors](corridors/index.md) | Assemblies, subassemblies, targets, corridor surfaces |
| [Pipe networks](pipe-networks/index.md) | Gravity and pressure networks, parts list, rules |
| [Grading](grading/index.md) | Feature lines, grading groups, daylighting |
| [Parcels](parcels/index.md) | Creation, sizing, legal labeling |
| [Plan production](plan-production/index.md) | View frames, match lines, sheet sets |
| [Data shortcuts](data-shortcuts/index.md) | Project structure, shortcuts vs Vault |
| [Commands](commands/index.md) | The full Civil 3D command catalog |

## A typical project workflow

1. **Set up the survey drawing** — coordinate system, units, survey database, figure prefix DB.
2. **Import points** — from a `.fbk` field book or a `.txt` PNEZD file. Apply description keys and figure linework.
3. **Build the existing surface** from points + breaklines + boundaries.
4. **Create design horizontal alignments** for road centerlines, sewer trunks, etc.
5. **Generate existing-ground profiles** along each alignment.
6. **Lay out design profiles** with vertical curves that meet AASHTO criteria.
7. **Build assemblies** and run a **corridor** along each alignment.
8. **Extract corridor surfaces** (top, datum) for QTO and grading.
9. **Add pipe networks** (storm, sanitary) on alignments and reference them in profile views.
10. **Grade the site** with feature lines and grading groups.
11. **Set parcels** for the platting.
12. **Produce plans** — view frames, match lines, plan & profile sheets, sections.

This linear story isn't how a real project goes — design iterates — but the dependencies follow this order.
