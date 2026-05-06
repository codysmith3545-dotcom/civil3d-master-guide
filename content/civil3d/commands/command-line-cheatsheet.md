---
title: "Command-Line Cheatsheet"
section: "civil3d/commands"
order: 6
visibility: public
tags: [commands, command-line, cheatsheet]
updated: 2026-05-06
---

> **TL;DR**
> 1. Most Civil 3D objects can be created without touching the ribbon. Memorize the `Create…` family of command names.
> 2. **System variables** (the things you toggle with `OSMODE`, `ORTHO`, `LWDISPLAY`…) are persistent per drawing — set them in your DWT.
> 3. Use `_-` prefix to force command-line versions of dialogs (faster, scriptable).

## Drawing setup

| Type | Command |
|---|---|
| Drawing settings dialog | `EditDrawingSettings` |
| Set current coordinate system | `EditDrawingSettings` → Units & Zone tab |
| Save as DWT | `SAVEAS` → Drawing Template (.dwt) |
| Set ambient settings (precision, units) | `EditDrawingSettings` → Ambient Settings tab |

## Survey

| Type | Command |
|---|---|
| Open Survey panel | Toolspace → Survey tab |
| Create survey database | (Survey tab right-click) |
| Import field book | (Survey tab → Networks → Import) |
| Show import field book CLI | `SurveyImportFieldBook` |

## Points

| Type | Command |
|---|---|
| Create points (toolbar) | `CreatePoints` |
| Edit point | `EditPoints` |
| Import points | `ImportPoints` |
| Export points | `ExportPoints` |
| Create point group | `CreatePointGroup` |
| Description key set | `CreateDescriptionKeys` |
| Add to point group / refresh | (Prospector → Point Groups → right-click) |

## Surfaces

| Type | Command |
|---|---|
| Create surface | `CreateSurface` |
| Add point group | (Prospector → Surfaces → Definition → Point Groups) |
| Add breaklines | `AddBreaklines` |
| Add boundary | `AddSurfaceBoundary` |
| Rebuild | `RebuildSurface` |
| Volumes (composite) | `ComputeVolumes` |
| Volume surface | `CreateVolumeSurface` |
| Surface analysis | `AnalyzeSurface` |

## Alignments

| Type | Command |
|---|---|
| Create from objects | `CreateAlignmentFromObjects` |
| Create alignment by layout | `CreateAlignmentLayout` |
| Edit geometry | `EditAlignmentGeometry` |
| Add labels | (Toolspace → Settings → Alignment → Label Styles) |
| Offset alignment | `CreateOffsetAlignment` |

## Profiles

| Type | Command |
|---|---|
| Profile from surface | `CreateProfileFromSurface` |
| Layout profile | `CreateProfileLayout` |
| Profile view | `CreateProfileView` |
| Edit profile geometry | `EditProfileGeometry` |
| Add profile labels | (Settings → Profile → Label Styles) |

## Corridors

| Type | Command |
|---|---|
| Create corridor | `CreateCorridor` |
| Create assembly | `CreateAssembly` |
| Add subassembly | (Tool palette → drag onto assembly) |
| Edit corridor | `EditCorridor` |
| Corridor surface | (Prospector → Corridor → right-click → Surface) |

## Pipe networks

| Type | Command |
|---|---|
| Create pipe network | `CreateNetwork` |
| Create from objects | `CreateNetworkFromObject` |
| Add network in profile view | `DrawNetworkInProfileView` |
| Edit pipe network | `EditPipeNetwork` |

## Grading

| Type | Command |
|---|---|
| Feature line from polyline | `CreateFeatureLineFromObject` |
| Feature line elevations | `EditFeatureLineElevations` |
| Grading | `GradingCreate` |
| Grading group | `CreateGradingGroup` |

## Parcels

| Type | Command |
|---|---|
| Create from polyline | `CreateParcelFromObjects` |
| Sizing tool | `CreateParcelLayout` |

## Plan production

| Type | Command |
|---|---|
| View frames | `CreateViewFrames` |
| Sheets | `CreateSheets` |

## Data shortcuts

| Type | Command |
|---|---|
| Open shortcuts manager | `DataShortcutsManager` |
| Set working folder | `SetWorkingFolder` |
| Create shortcuts (from drawing) | `CreateDataShortcuts` |
| Reference into current drawing | (Toolspace → Data Shortcuts → right-click → Create Reference) |
| Promote a reference | `PromoteDataShortcut` |
| Synchronize references | `SynchronizeReferences` |
| Repath shortcuts | (Toolspace → Data Shortcuts → right-click → Repath) |

## Useful system variables

| Variable | What it controls |
|---|---|
| `OSMODE` | Object snap modes (bitcoded) |
| `ORTHOMODE` | Ortho on/off |
| `LWDISPLAY` | Show lineweights on screen |
| `MEASUREMENT` | 0 = imperial linetypes, 1 = metric |
| `INSUNITS` | Insertion units |
| `ANNOAUTOSCALE` | Automatic annotation scaling |
| `CANNOSCALE` | Current annotation scale |
| `VTENABLE` | View transitions |
| `WHIPARC` | Smooth circle/arc display |
| `STARTUP` | Startup dialog mode |

## Related

- [Shortcuts & aliases](shortcuts.md)
- [Commands index](index.md)
