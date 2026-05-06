---
title: "Civil 3D Dynamo Packages"
section: "customization/dynamo"
order: 20
visibility: public
tags: [dynamo, packages, civilconnection, camber, civil3d-toolkit, package-manager]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Dynamo Package Manager"
    url: https://dynamopackages.com/
    verified: 2026-05-06
  - title: "Camber (open-source Civil 3D Dynamo package)"
    url: https://github.com/mzjensen/Camber
    verified: 2026-05-06
---

> **TL;DR**
> 1. The **built-in Civil 3D nodes** cover core objects (alignments, surfaces, profiles, corridors, pipe networks) but leave gaps. Third-party packages fill them.
> 2. **Camber** (open-source, by mzjensen) is the most comprehensive community package — it adds nodes for labels, styles, settings, sections, and many objects the built-in nodes miss.
> 3. Install packages from within Dynamo: **Packages > Search for a Package**. Packages install per-user under `%AppData%\Dynamo\`.

## Built-in Civil 3D nodes

Dynamo ships with a set of Civil 3D nodes covering:

- **Alignments** — select, create, get/set name, get station/offset, get points at stations.
- **Surfaces** — select, get elevation, get contours, add/remove points.
- **Profiles** — select, get elevation at station, create from surface.
- **Corridors** — select, get regions, get feature lines from corridor.
- **Pipe Networks** — select pipes/structures, get properties (diameter, rim elevation, invert).
- **COGO Points** — select, get coordinates, get description.
- **Feature Lines** — select, get points, get elevations.

These nodes handle the most common workflows but lack coverage for:
- Label styles and label placement.
- Object styles and style assignment.
- Civil 3D settings (ambient settings, drawing settings).
- Cross sections and sample lines.
- Grading objects and grading groups.
- Quantity takeoff.

## Camber (open-source)

Camber is a community-developed, open-source package maintained on GitHub. It significantly extends the Civil 3D node library.

**Key node categories:**

- **Styles** — read and assign alignment styles, surface styles, profile styles, label styles.
- **Labels** — create and modify alignment station labels, profile labels, pipe/structure labels.
- **Settings** — read and modify ambient settings (precision, units, abbreviations).
- **Sections** — create sample lines, get section data, work with cross-section views.
- **Data Shortcuts** — work with Civil 3D data references.
- **Band Sets** — configure profile view and section view bands.
- **Miscellaneous** — document settings, coordinate systems, feature line operations.

**Installation:**
1. In Dynamo, go to Packages > Search for a Package.
2. Search for "Camber".
3. Click Install.

Camber is free and updated regularly. Review the GitHub repository for documentation and known issues.

## Civil 3D Toolkit (Autodesk)

Autodesk occasionally publishes a "Civil 3D Toolkit" package on the Dynamo Package Manager. This package adds nodes that Autodesk developed but did not include in the shipping product. Availability and content vary by Civil 3D version — check the Package Manager for the current version.

Typical additions:
- Corridor target assignment.
- Corridor surface extraction.
- Additional alignment and profile creation nodes.

## Other useful packages

| Package | Description |
|---|---|
| **Data-Shapes** | Custom UI nodes: dropdown selectors, multi-input forms, file pickers. Essential for making user-friendly graphs. |
| **archi-lab.net** | General Dynamo utilities: list management, string tools, Revit interop. |
| **Clockwork** | Math, string, list, and geometry utilities. |
| **DynaShape** | Physics-based geometry solver (niche but powerful for form-finding). |

## Installing packages

From within Dynamo:

1. **Packages** menu > **Search for a Package**.
2. Type the package name and press Enter.
3. Click **Install** on the desired version.

Packages install to `%AppData%\Dynamo\Dynamo Core\2.x\packages\` (the exact path varies by Dynamo version). For team deployment, copy the package folder to a shared location and add it to Dynamo's package paths: **Settings > Manage Node and Package Paths**.

## Package compatibility

Packages are built against specific Dynamo versions. A package built for Dynamo 2.x may not work in Dynamo 3.x (which ships with Civil 3D 2025+). Always check the package's listed compatibility. When upgrading Civil 3D, test all packages in the new version before deploying.

## Related

- [Dynamo overview](overview.md)
- [First graph](first-graph.md)
- [Dynamo Player](dynamo-player.md)
- [Limitations](limitations.md)
