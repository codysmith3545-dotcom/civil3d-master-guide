---
title: "Workspace and Toolspace"
section: "civil3d/fundamentals"
order: 10
visibility: public
tags: [fundamentals, workspace, toolspace, prospector, settings, ui]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [WORKSPACE, SHOWTS, SHOWPS, SHOWSS, SHOWTBS, CUI]
updated: 2026-05-06
---

> **TL;DR**
> 1. Set the active workspace to `Civil 3D` so the discipline ribbons and Toolspace are loaded; verify with `WORKSPACE` or the gear icon at the bottom-right.
> 2. The Toolspace has four tabs: Prospector (drawing data), Settings (styles and ambient settings), Survey (survey databases and figures), and Toolbox (reports and add-ins). Use `SHOWTS` to show it if it has been closed.
> 3. Toolspace tabs are independent palettes — pin them, dock them in groups, and save the layout as part of the workspace via `WSSAVE`.

## What the workspace controls

A workspace in Civil 3D is an AutoCAD construct that snapshots which ribbons, toolbars, palettes, and menus are visible. Civil 3D ships with three relevant workspaces: `Civil 3D`, `Planning and Analysis`, and `2D Drafting & Annotation`. For nearly all design work, stay in `Civil 3D` — the others hide the discipline ribbons (Home, Insert, Annotate, Modify, Analyze, View, Manage, Output, Survey, Help) and several context-sensitive tabs that appear only when a Civil 3D object is selected.

Switch with the workspace selector on the lower-right status bar, the `WORKSPACE` command, or the Quick Access Toolbar drop-down. After arranging palettes the way you want, save with `WSSAVE`; otherwise the next session may revert.

## Toolspace, the four tabs

Toolspace is the docked palette that gives access to drawing data and settings. Open or hide it with `SHOWTS` (toggle), or use the four discrete toggles for individual tabs:

- `SHOWPS` — Prospector
- `SHOWSS` — Settings
- Survey tab — toggled from the Survey ribbon (`Survey` panel) or by re-running `SHOWTS`
- `SHOWTBS` — Toolbox

### Prospector

Lists the data inside the active drawing — points, point groups, surfaces, alignments, profiles, corridors, pipe networks, parcels, view frame groups, data shortcuts, and survey references. Right-click a node for context-appropriate commands. The "master view" toggle at the top of Prospector switches between the active drawing and an Open Drawings list, useful when juggling several DWGs.

### Settings

Controls the drawing's ambient settings, command settings, and all object/label styles. Each Civil 3D object family (Surface, Alignment, Profile, etc.) has its own subtree containing styles, label styles, table styles, and command-level overrides. Most "why does my new alignment look like the last one" questions trace back to a default style set here.

### Survey

Hosts the survey databases registered to the working folder. Even drawings that don't use a survey database will show this tab; it's only active when a database is opened.

### Toolbox

Holds report templates, the Reports Manager, and any custom subassemblies or add-ins published through `.NET`. Most teams ignore it after first setup, but it is where you launch the parcel/alignment/pipe reports.

## Layout tips that survive sessions

- Dock Toolspace on the left, Properties on the right, Panorama at the bottom. Save the workspace.
- Use `CUIIMPORT` to bring in a partial CUIx that adds custom panels without overwriting the shipped workspace. Modifying `acad.cuix` directly is fragile across upgrades.
- The Panorama (vista) auto-hides; if it disappears mid-task, run `SHOWPANO` or look for it on the active ribbon.
- In 2024+ the Project Explorer panel (Add-in) is bundled in the install. It is not the same as Prospector — it is a richer, read/write project browser. Toggle it from the Add-ins ribbon.

## Common gotchas

- **Wrong workspace after a crash.** Civil 3D occasionally loads `2D Drafting & Annotation` after a crash recovery. The ribbons look almost identical until you notice the Survey tab is missing.
- **Toolspace docked off-screen.** If a second monitor is unplugged, the palette can land outside the visible area. Run `SHOWTS` twice and grab the title bar with the keyboard move command, or reset with `Options > Profiles > Reset`.
- **Profile contamination.** AutoCAD user profiles (`Options > Profiles`) save the support paths but not the workspace. Mixing profiles between users on a shared machine produces phantom missing styles. Each user should `<<Unnamed Profile>> > Reset` after a Windows account change.
- **Locked CUI.** A read-only `acad.cuix` (common on managed IT installs) will throw a non-obvious error when you try to save a workspace. Check file permissions before chasing imaginary bugs.

## Related

- [Templates and drawing settings](templates-and-settings.md)
- [Ambient settings, units, abbreviations](ambient-settings.md)
- [DWT setup](../../customization/templates-and-kits/dwt-setup.md)
