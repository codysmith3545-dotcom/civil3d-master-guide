---
title: "Project Structure"
section: "civil3d/data-shortcuts"
order: 15
visibility: public
tags: [data-shortcuts, project, working-folder, folder-structure, naming-conventions]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [SetWorkingFolder, SetProjectFolder, NewProject]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Set Up Data Shortcut Projects
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3B4C5D6E-7F8A-9B0C-1D2E-3F4A5B6C7D8E
    verified: 2026-05-06
---

> **TL;DR**
> 1. The **working folder** is the top-level directory (typically a network share) that contains all Civil 3D projects. The **project folder** is a subdirectory within the working folder for a specific project. Set both in Toolspace > Prospector > right-click the project node.
> 2. Inside the project folder, Civil 3D creates a `_Shortcuts` folder containing XML files organized by object type (Surfaces, Alignments, Pipe Networks, etc.). Source drawings live alongside or in subdirectories.
> 3. A consistent folder structure and naming convention is essential for multi-drawing projects. Standardize early — repathing after the fact is painful.

## Working folder and project folder concepts

Civil 3D uses a two-level hierarchy:

```
Working Folder (e.g., \\server\civil3d-projects\)
  └── Project Folder (e.g., 2026-001-Meridian-Rd\)
        ├── _Shortcuts\
        │     ├── Surfaces\
        │     ├── Alignments\
        │     ├── Profiles\
        │     ├── Pipe Networks\
        │     └── View Frame Groups\
        ├── Survey\
        ├── Design\
        ├── Drainage\
        ├── Plans\
        └── ...
```

### Setting the working folder

Toolspace > Prospector > right-click the top-level project node (shows the current project name or "No project") > Set Working Folder.

The working folder tells Civil 3D where to look for projects. It should be:

- A network share accessible to all team members (e.g., `\\server\civil3d-projects\` or `S:\civil3d-projects\`).
- A local path only for single-user projects or if the firm uses a synced cloud drive (OneDrive, Dropbox) — but be aware that sync services can cause conflicts with DWG files.

### Setting the project folder

After setting the working folder, right-click the project node > Set Project Folder. Select or create a subfolder for the specific project.

Civil 3D creates the `_Shortcuts` folder automatically when you first publish data shortcuts.

## The _Shortcuts folder

The `_Shortcuts` folder is managed by Civil 3D. It contains:

- **XML files** — one per data shortcut, containing the path to the source drawing and the object handle within that drawing.
- **Subfolders** — organized by object type: `Surfaces`, `Alignments`, `Profiles`, `Pipe Networks`, `View Frame Groups`.

Do not manually edit or move files in `_Shortcuts`. Doing so can break references in consumer drawings.

## Recommended folder structure

A well-organized project folder separates drawings by discipline and purpose:

```
2026-001-Meridian-Rd\
  ├── _Shortcuts\                    (managed by Civil 3D)
  ├── Survey\
  │     ├── EG-Survey.dwg            (existing ground surface, points, figures)
  │     └── Boundary-Survey.dwg      (boundary, parcels)
  ├── Design\
  │     ├── ALG-Meridian.dwg         (alignments, profiles)
  │     ├── COR-Meridian.dwg         (corridor)
  │     └── GRD-SitePlan.dwg         (grading, feature lines)
  ├── Drainage\
  │     ├── STM-Meridian.dwg         (storm pipe network)
  │     └── SAN-Meridian.dwg         (sanitary pipe network)
  ├── Plans\
  │     ├── PLN-Plan-Profile.dwg     (plan and profile sheets)
  │     ├── PLN-Cross-Sections.dwg   (cross-section sheets)
  │     └── PLN-Details.dwg          (detail sheets)
  ├── References\
  │     ├── Topo-Base.dwg            (XREF: existing topo base)
  │     └── Utility-Base.dwg         (XREF: existing utilities)
  └── Support\
        ├── Template.dwt             (office template)
        └── Standards.dws            (CAD standards)
```

### Key principles

- **One primary object per source drawing.** The survey drawing owns the existing-ground surface. The alignment drawing owns the alignments and profiles. This minimizes the blast radius of a corrupted file.
- **Source drawings are not plan sheets.** Keep design objects in source drawings and reference them into plan/sheet drawings. Sheet drawings consume shortcuts and XREFs but own no Civil 3D design data.
- **Consistent prefix convention.** Prefixes like `EG-`, `ALG-`, `COR-`, `STM-`, `SAN-`, `PLN-` make it obvious what each drawing contains.

## Naming conventions

### Drawing names

Use a prefix that identifies the object type or discipline:

| Prefix | Content |
|---|---|
| EG- | Existing ground (survey surfaces, points) |
| ALG- | Alignments and profiles |
| COR- | Corridors |
| GRD- | Grading |
| STM- | Storm pipe network |
| SAN- | Sanitary pipe network |
| WTR- | Water pipe network |
| PLN- | Plan sheets |
| XS- | Cross-section sheets |
| DET- | Detail sheets |

### Object names within drawings

Name Civil 3D objects clearly so they are recognizable in the data shortcuts list:

- Surface: `EG - Existing Ground`, `FG - Finished Grade`
- Alignment: `Meridian St CL`, `Elm Ave CL`
- Profile: `Meridian St - EG`, `Meridian St - FG`
- Pipe Network: `Storm - Meridian St`, `Sanitary - Trunk`

Avoid default names like `Surface (1)` or `Alignment (1)` — they are meaningless to other team members.

## Multi-drawing project workflow

1. **Survey** publishes the existing-ground surface and point groups as data shortcuts.
2. **Design** references the surface, creates alignments and profiles, publishes those as shortcuts.
3. **Corridor** references alignments, profiles, and surface. Creates the corridor. Publishes the corridor surface.
4. **Drainage** references alignments and surfaces. Creates pipe networks. Publishes them.
5. **Plans** references all of the above via data shortcuts and XREFs. Annotates and produces sheets.

Each drawing consumes shortcuts from upstream drawings and publishes its own objects for downstream drawings.

## Related

- [Data shortcuts vs Vault](data-shortcuts-vs-vault.md)
- [Creating data shortcuts](creating-data-shortcuts.md)
- [Repathing shortcuts](repathing-shortcuts.md)
- [Multi-discipline coordination](multi-discipline.md)
