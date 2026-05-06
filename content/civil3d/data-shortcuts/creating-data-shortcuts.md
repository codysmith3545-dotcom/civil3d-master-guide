---
title: "Creating Data Shortcuts"
section: "civil3d/data-shortcuts"
order: 20
visibility: public
tags: [data-shortcuts, create, publish, surface, alignment, profile, pipe-network]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CreateDataShortcuts, UpdateDataShortcuts]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Create Data Shortcuts
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-4C5D6E7F-8A9B-0C1D-2E3F-4A5B6C7D8E9F
    verified: 2026-05-06
---

> **TL;DR**
> 1. Open the source drawing and run `CreateDataShortcuts`. Select the objects to publish (surfaces, alignments, profiles, pipe networks, view frame groups). Civil 3D writes XML pointers to the `_Shortcuts` folder in the project directory.
> 2. After modifying a source object, run `UpdateDataShortcuts` or re-publish to update the XML. Consumer drawings then need to synchronize to pick up changes.
> 3. Only objects that are logically "finished enough to share" should be published. Do not publish work-in-progress objects that will confuse other team members.

## What can be published as a data shortcut

Civil 3D supports data shortcuts for these object types:

| Object type | What gets shared |
|---|---|
| Surface | The TIN surface definition (triangulation, contours, analysis) |
| Alignment | Horizontal geometry (tangents, curves, spirals) |
| Profile | Vertical geometry (PVIs, vertical curves); must be associated with a published alignment |
| Pipe network | Gravity network (pipes and structures) or pressure network |
| View frame group | View frames for plan/profile sheet layout |
| Corridor | Available via Vault or as a surface extraction; direct corridor shortcuts are limited |

Note: corridors themselves are not directly shared via data shortcuts. To share corridor data, extract the corridor surface and publish it as a surface shortcut.

## Creating data shortcuts

### Prerequisites

1. The working folder and project folder must be set (see [Project structure](project-structure.md)).
2. The source drawing must be saved. Unsaved drawings cannot publish shortcuts.
3. The source drawing must be in or below the project folder. Civil 3D records relative paths from the `_Shortcuts` folder to the source drawing.

### Steps

1. Open the source drawing containing the objects to publish.
2. Run `CreateDataShortcuts` (Prospector > right-click Data Shortcuts > Create Data Shortcuts; or ribbon: Manage > Data Shortcuts > Create Data Shortcuts).
3. The Create Data Shortcuts dialog displays all eligible objects in the drawing, organized by type (Surfaces, Alignments, Profiles, Pipe Networks, View Frame Groups).
4. Check the objects to publish. Uncheck those you do not want to share.
5. Click OK.

Civil 3D writes XML files to `_Shortcuts\<ObjectType>\` within the project folder. Each shortcut XML contains:

- The relative path to the source drawing.
- The object handle (a unique identifier within the drawing).
- The object name and type.

### What happens in the project folder

After publishing, the `_Shortcuts` folder structure looks like:

```
_Shortcuts\
  ├── Surfaces\
  │     └── EG - Existing Ground.xml
  ├── Alignments\
  │     └── Meridian St CL.xml
  ├── Profiles\
  │     └── Meridian St CL\
  │           ├── Meridian St - EG.xml
  │           └── Meridian St - FG.xml
  └── Pipe Networks\
        └── Storm - Meridian St.xml
```

Profiles are nested under their parent alignment folder.

## Updating data shortcuts after source changes

When the source object is modified (e.g., the surface is rebuilt with new survey data, or an alignment is adjusted), the shortcut XML must be updated so consumer drawings can pick up the changes.

### Method 1: Update shortcut

Right-click the specific shortcut in Prospector > Data Shortcuts > Update Data Shortcut. This refreshes the XML file.

### Method 2: Re-publish

Run `CreateDataShortcuts` again. If a shortcut already exists for an object, Civil 3D overwrites the XML with the current state. This is essentially the same as updating.

### Method 3: Automatic (save)

In many configurations, the shortcut XML updates when the source drawing is saved. The behavior depends on the Civil 3D version and the "Synchronize data shortcuts on save" setting (Options > Data Shortcut Sync).

After updating the shortcut, consumer drawings still need to run `SynchronizeReferences` to pull the latest data. See [Referencing, synchronizing, promoting](referencing-syncing-promoting.md).

## Selecting what to publish

Best practices for deciding which objects to publish:

- **Publish finished objects.** An alignment that is still being adjusted daily does not need to be a shortcut yet — it will just cause churn in consumer drawings.
- **Publish the minimum set.** Only share objects that downstream drawings actually need. Publishing everything clutters the shortcut list and creates unnecessary dependencies.
- **Name objects before publishing.** Once published, renaming an object can break shortcuts. Get the name right first.
- **Save before publishing.** The shortcut references the saved state of the object. Unsaved changes are not captured.

## Removing a data shortcut

To remove a published shortcut:

1. In Prospector > Data Shortcuts, right-click the shortcut > Delete.
2. Civil 3D deletes the XML file from the `_Shortcuts` folder.

If consumer drawings still reference the deleted shortcut, their references become broken (display a warning icon). The consumer must either re-reference a replacement shortcut or promote the existing reference to a local object.

## Related

- [Project structure](project-structure.md)
- [Referencing, synchronizing, promoting](referencing-syncing-promoting.md)
- [Repathing shortcuts](repathing-shortcuts.md)
- [Data shortcuts vs Vault](data-shortcuts-vs-vault.md)
