---
title: "INDOT Indiana Design Manual — Verbatim Mirror"
section: "docs-mirror/indot-idm"
order: 10
visibility: public
tags: [indot, idm, indiana, docs-mirror, public-domain]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "INDOT Indiana Design Manual (chapter index)"
    url: https://www.in.gov/indot/engineering/design-manual/
    verified: 2026-05-11
license: "public-domain (work of the State of Indiana, IC 5-14-3)"
mirror_status: "complete"
---

> **TL;DR**
> 1. This folder mirrors a curated set of Indiana Design Manual (IDM) chapters verbatim under `docs-mirror/indot-idm/`.
> 2. The IDM is a work of the State of Indiana, published by INDOT, and is in the public domain under IC 5-14-3 (Access to Public Records Act). Verbatim mirroring is permitted.
> 3. Each chapter page declares its `mirror_status:` — `placeholder` (outline only, awaiting a human to paste verbatim text) or `complete` (verbatim chapter text in place).

## Scope of the mirror

The IDM is a large multi-part manual. This mirror covers the chapters most directly relevant to civil-survey and Civil 3D production work in Indiana:

| Chapter | Title | File |
|---|---|---|
| 20 | Project Development Process | [ch20-project-development-process.md](ch20-project-development-process.md) |
| 23 | Coordinate Systems and Datums | [ch23-coordinate-systems-and-datums.md](ch23-coordinate-systems-and-datums.md) |
| 33 | Pavement Design | [ch33-pavement-design.md](ch33-pavement-design.md) |
| 40 | Drainage of Highway Pavements | [ch40-drainage-of-highway-pavements.md](ch40-drainage-of-highway-pavements.md) |
| 41 | Surface Drainage Facilities | [ch41-surface-drainage-facilities.md](ch41-surface-drainage-facilities.md) |
| 42 | Cross Drainage Facilities (Culverts) | [ch42-cross-drainage-facilities.md](ch42-cross-drainage-facilities.md) |
| 43 | Storm Drainage Systems | [ch43-storm-drainage-systems.md](ch43-storm-drainage-systems.md) |
| 44 | Bridge Hydraulics | [ch44-bridge-hydraulics.md](ch44-bridge-hydraulics.md) |
| 53 | Geometric Design — Two-Lane Highways | [ch53-geometric-design-two-lane.md](ch53-geometric-design-two-lane.md) |
| 54 | Geometric Design — Multi-Lane Highways | [ch54-geometric-design-multi-lane.md](ch54-geometric-design-multi-lane.md) |
| 55 | Geometric Design — Freeways | [ch55-geometric-design-freeways.md](ch55-geometric-design-freeways.md) |
| 60 | Pavement Markings, Signs, Signals | [ch60-pavement-markings-signs-signals.md](ch60-pavement-markings-signs-signals.md) |
| 70 | Construction Plans | [ch70-construction-plans.md](ch70-construction-plans.md) |
| 71 | Structures Plans | [ch71-structures-plans.md](ch71-structures-plans.md) |
| 72 | Right-of-Way Plans | [ch72-right-of-way-plans.md](ch72-right-of-way-plans.md) |
| 80 | Survey | [ch80-survey.md](ch80-survey.md) |

INDOT periodically reorganizes the IDM. The chapter numbers above follow the legacy "Part 2 Roadway Design" / "Part 3 Hydraulics" / "Part 4 Geometric Design" / "Part 5 Plans" / "Part 6 Survey" numbering used in INDOT's published `chNN.pdf` files. If INDOT has restructured the manual between this mirror's `verified:` date and your current work, follow the upstream link to confirm.

## How to fill in a placeholder

Each chapter file starts with `mirror_status: placeholder` and lists the exact section headings (with their official §NN-X.YY numbering) that should appear once a human pastes in the verbatim text.

To complete a chapter mirror:

1. Open the source PDF or HTML at the URL listed in the chapter's frontmatter `sources:` block.
2. Verify the chapter's revision date matches what is in this repo. If INDOT has issued a newer revision, update the `verified:` date and `updated:` date.
3. Paste each section's verbatim text under the matching `## §NN-X.YY ...` heading, in order. Keep INDOT's section numbering exactly as published.
4. Change `mirror_status: placeholder` to `mirror_status: complete`.
5. Run `node scripts/check-mirror-status.mjs` to confirm the file no longer shows as placeholder.
6. Run `node scripts/lint-content.mjs` to confirm the file still lints.

Time per chapter, once the source is open: typically under 5 minutes for a summary-level mirror, longer if you choose to mirror the full chapter rather than the curated summary outline.

## Why we mirror verbatim

INDOT's manual is updated in place; old revisions are not always preserved at the upstream URL. Mirroring the version-in-effect-at-submittal gives consultants and reviewers a citable, dated snapshot. Because the IDM is a public-domain work of the State of Indiana, verbatim mirroring with attribution is permitted.

## Related

- [Docs mirror index](../index.md)
- [INDOT IDM chapter map](../../jurisdictions/indiana/state/indot-idm-chapter-map.md)
- [State of Indiana overview](../../jurisdictions/indiana/state/index.md)
