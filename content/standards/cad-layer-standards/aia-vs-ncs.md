---
title: "AIA vs NCS"
section: "standards/cad-layer-standards"
order: 30
visibility: public
tags: [aia, ncs, cad-standards, layer-naming, history]
sources:
  - label: "National CAD Standard (NCS) — NIBS"
    url: "https://www.nationalcadstandard.org/"
updated: 2026-05-06
---

> **TL;DR**
> 1. The **AIA CAD Layer Guidelines** (1990, revised through 1997) were the original U.S. layer naming standard. The **NCS** (first published 1999) incorporated and superseded AIA layers, adding plotting standards, sheet organization, and schedules.
> 2. Key difference: AIA used a two-character discipline designator (e.g., `A-` for Architecture, `C-` for Civil) with a four-character major group, while NCS formalized the Minor and Status fields and expanded discipline codes. In practice, AIA and NCS layer names often look identical for the Discipline-Major portion.
> 3. If your firm uses AIA naming, a translation table to NCS is straightforward because the Major group codes are largely the same. Pick one standard and enforce it company-wide.

## Historical context

### AIA CAD Layer Guidelines

The American Institute of Architects published the first edition of the *CAD Layer Guidelines* in 1990 to address the chaos of every firm inventing its own layer names. The standard defined:

- A discipline character (A, C, E, L, M, P, S, etc.).
- A four-character major group (e.g., `WALL`, `ROAD`, `TOPO`).
- An optional four-character minor group modifier.
- Format: `D-MMMM` or `D-MMMM-MMMM`.

The AIA guidelines went through several revisions (2nd edition 1997) and were widely adopted by architectural firms. Civil engineering and surveying firms adapted them with `C-` and `V-` prefixes.

### National CAD Standard (NCS)

The NCS was developed by NIBS (National Institute of Building Sciences) starting in 1997, with version 1.0 published in 1999. It unified three components:

1. **AIA CAD Layer Guidelines** (incorporated as the layer naming module).
2. **Uniform Drawing System (UDS)** — sheet organization, title blocks, schedules.
3. **Plotting guidelines** — pen weights, line types, screening.

NCS v6 (current) retains the AIA layer naming structure but adds:

- A formal **Status** field (N, E, D, F, T, M) as the fourth field.
- Expanded discipline designators (V for Survey, H for Hazardous Materials, Q for Equipment, etc.).
- Guidance on layer properties (color, linetype, lineweight) in the context of plot styles.

## Key differences

| Feature | AIA (1997) | NCS v6 |
|---|---|---|
| Discipline codes | A, C, E, F, G, H, I, L, M, P, S, T | Same + V, Q, R, X, Z added |
| Major group | 4 chars, required | Up to 4 chars, required |
| Minor group | 4 chars, optional | Up to 4 chars, optional |
| Status field | Not formalized | 1 char (N, E, D, F, T, M), optional |
| Plotting guidance | Not included | Included (pen weights, screening) |
| Sheet organization | Not included | Included (UDS module) |
| Coordinate with BIM | Not addressed | NCS v6 addresses BIM layer mapping |

## Translating between AIA and NCS

Because NCS incorporated the AIA layer names, most AIA layers are already NCS-compliant at the Discipline-Major level. The main translation tasks are:

1. **Add the Status field** where needed. An AIA layer `C-ROAD-CNTR` becomes `C-ROAD-CNTR-N` (new/proposed) or `C-ROAD-CNTR-E` (existing) in NCS.
2. **Map non-standard discipline codes.** If the AIA-era drawing uses `S-` for Survey (some firms did this), remap to `V-` per NCS.
3. **Rename any non-conforming custom layers.** Layers like `C-EXIST-ROAD` (which embed status in the major group) should be restructured to `C-ROAD-N` or `C-ROAD-E`.

The AutoCAD `LAYTRANS` (Layer Translator) command can automate bulk renaming. Build a translation map file (`.dwg` or `.dwt` with the target layers) and apply it across drawings.

## Which should you use?

NCS v6 is the current consensus standard and the one referenced by federal (GSA, USACE) and many state (DOT) agencies. For new firms or firms revising their standards, adopt NCS.

If your firm has decades of AIA-named drawings in archive, there is no need to retroactively rename everything. Maintain a translation table for when legacy drawings enter active projects, and use NCS for all new production.

## Related

- [NCS overview](ncs-overview.md)
- [Standardizing across a company](standardizing-company-wide.md)
- [Civil 3D layer mappings](civil3d-layer-mappings.md)
