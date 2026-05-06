---
title: "Sites and Feature Lines"
section: "civil3d/grading"
order: 30
visibility: public
tags: [site, feature-line, topology, parcel, siteless]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CreateSite, MoveToSite]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Sites Overview
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-0E1F2A3B-4C5D-6E7F-8A9B-0C1D2E3F4A5B
    verified: 2026-05-06
---

> **TL;DR**
> 1. A **site** in Civil 3D is a topological container — parcels and feature lines on the same site interact (split, merge, share boundaries). This is powerful for subdivision design but causes unexpected behavior when grading objects share a site with parcels.
> 2. Starting with Civil 3D 2018, feature lines can be **siteless** (not assigned to any site). Siteless feature lines avoid topology interaction entirely and are the recommended default for grading work.
> 3. If you must use sites, isolate grading feature lines on a separate site from parcel feature lines to prevent cross-contamination.

## What sites do

A site is a named topological space. Objects on the same site share topology:

- **Parcels** on the same site interact: if two parcel boundaries cross, Civil 3D splits them into separate parcels. This is by design for subdivision platting.
- **Feature lines** on the same site interact with parcels: a feature line that crosses a parcel boundary can split the parcel.
- **Grading objects** inherit their site from their baseline feature line.

Topology means that overlapping or crossing objects are automatically resolved. This is useful for parcels (where lot lines must tile without gaps or overlaps) but problematic for grading (where a swale feature line should not split an adjacent lot).

## The problem with shared sites

Consider this scenario:

1. A parcel layout exists on Site 1.
2. A grading feature line is created on Site 1 and crosses a parcel boundary.
3. Civil 3D splits the parcel at the crossing point, creating unintended sub-parcels.
4. Moving or editing the feature line further distorts the parcel layout.

This is the single most common source of confusion with sites. The solution is to keep grading feature lines off the parcel site.

## Siteless feature lines (Civil 3D 2018+)

Starting with Civil 3D 2018, feature lines can be created without a site assignment. Siteless feature lines:

- Do not participate in topology.
- Cannot split parcels.
- Cannot interact with other feature lines topologically.
- Can still be used as grading baselines and surface breaklines.

To create a siteless feature line:

1. Run `CreateFeatureLine`.
2. In the Create Feature Lines dialog, set Site to `<None>`.
3. The feature line is created outside any site.

Siteless is the recommended default for grading feature lines in Civil 3D 2018 and later. There is no loss of grading functionality.

## When to use sites

Sites still serve a purpose in specific workflows:

| Workflow | Use site? | Reason |
|---|---|---|
| Subdivision parcel layout | Yes | Parcels require site topology to split and merge correctly |
| Grading around building pads | No (siteless) | No interaction with parcels needed |
| Grading that must respect parcel boundaries | Separate site from parcels | Avoids cross-contamination; manually coordinate at shared edges |
| Feature lines for corridor targets | No (siteless) | Corridors reference feature lines by selection, not by site |

## Moving feature lines between sites

Command: `MoveToSite` (right-click a feature line > Move to Site).

This moves the feature line (and any attached grading objects) from one site to another, or to no site (siteless).

Steps:

1. Select the feature line(s).
2. Right-click > Move to Site.
3. Choose the destination site, or select `<None>` for siteless.

Consequences of moving:

- Grading objects attached to the feature line move with it.
- If moving to a site with parcels, the feature line may immediately interact with parcel topology.
- If moving to siteless, any topological interactions are dissolved.

## Site management best practices

- **Default to siteless** for all grading feature lines. There is rarely a reason to put grading on a site.
- **One site per parcel group.** If you have multiple independent parcel areas (e.g., two subdivisions in the same drawing), use separate sites so they do not interact.
- **Never put grading and parcels on the same site** unless you explicitly need them to interact (rare).
- **Name sites clearly.** Use descriptive names like "Parcels-Phase1", "Parcels-Phase2" rather than "Site 1", "Site 2".

## Checking which site objects belong to

In Prospector:

- Expand Sites. Each site lists its feature lines, grading groups, and parcels.
- Siteless feature lines appear under Feature Lines (at the top level, not under any site).

To find which site a specific feature line belongs to: select the feature line > Properties palette > the Site property shows the assignment.

## Upgrading older drawings

Drawings created before Civil 3D 2018 may have all feature lines on a default site (often "Site 1"). When opening these in 2018+:

1. The feature lines remain on their original site. They are not automatically moved to siteless.
2. To migrate: select the feature lines > right-click > Move to Site > `<None>`.
3. Test grading objects after moving to verify they still function correctly.

## Related

- [Feature lines](feature-lines.md)
- [Grading objects](grading-objects.md)
- [Grading groups](grading-groups.md)
- [Troubleshooting grading](troubleshooting-grading.md)
