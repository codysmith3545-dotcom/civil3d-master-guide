---
title: "Data Shortcuts Workflow"
section: "civil3d/data-shortcuts-and-collaboration"
order: 10
visibility: public
tags: [data-shortcuts, workflow, promote, validate, working-folder, project]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEDATASHORTCUTS, EDITSHORTCUTS, PROMOTECONTACTREFERENCE]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - To Create Data Shortcuts"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-2D6AD80B-2F44-44B8-9AE3-95FF02A2A6A4"
    verified: 2026-05-11
  - title: "Autodesk Civil 3D Help - To Create a Reference to a Data Shortcut"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-FDFAB57C-C25A-4CA8-A85F-3F6D8A2B5BFB"
    verified: 2026-05-11
---

> **TL;DR**
> 1. Set the working folder, then create or pick a data shortcut project; Civil 3D writes shortcut XML files under `_Shortcuts/` in that project folder.
> 2. Source drawings publish shortcuts (`CREATEDATASHORTCUTS`); consumer drawings create references that read the source's geometry without copying it.
> 3. Promote a reference to break the link when an object must be edited locally; validate when source paths or names change.

## Object types that support shortcuts

Civil 3D data shortcuts support: surfaces, alignments, profiles, pipe networks, pressure networks, view frame groups, corridors (since 2018).

Not supported: assemblies, parcels, points and point groups (use the survey database or external point file instead), grading objects.

## Working folder and project

UI path: Toolspace > Prospector > Data Shortcuts > right-click > **Set Working Folder** > pick the folder that contains all projects (or where new projects will live). The folder commonly sits on a network share.

Then right-click Data Shortcuts > **New Data Shortcuts Project Folder** to scaffold a new project. The wizard creates:

```
ProjectName/
  _Shortcuts/       (XML shortcut files)
  Source Drawings/  (optional; firm convention)
  Production Drawings/
```

To switch projects: right-click Data Shortcuts > **Set Data Shortcuts Project Folder**.

## Publishing shortcuts (source side)

UI path: with the source drawing open, Toolspace > Prospector > Data Shortcuts > right-click > **Create Data Shortcuts** (`CREATEDATASHORTCUTS`).

1. The **Create Data Shortcuts** dialog lists every supported object in the current drawing.
2. Tick objects to publish. Click OK.
3. Civil 3D writes `<ObjectName>.xml` under `_Shortcuts/<ObjectType>/`.

Re-running the dialog overwrites existing shortcut XML for selected objects - no manual cleanup needed when geometry changes (the source drawing being saved is enough; the shortcut is a thin pointer).

## Consuming shortcuts (reference side)

UI path: in the consumer drawing, Toolspace > Prospector > Data Shortcuts > expand object type > right-click an object > **Create Reference**.

1. The Create Reference dialog asks for a style, layer, and (for alignments) a label set. These apply only to the local reference, not the source.
2. Click OK. The object appears in Prospector with a small **Reference** indicator icon.

Edits to the reference are not allowed (most properties are read-only). Edits in the source drawing propagate on the next synchronize.

## Synchronize, validate, repath

| Action | When | UI path |
|---|---|---|
| Synchronize | Source changed; bring reference up to date | Right-click reference > Synchronize |
| Synchronize references (drawing-wide) | After opening | Notification balloon: Synchronize, or Prospector > right-click drawing > Synchronize References |
| Validate Data Shortcuts | Source path moved | Right-click Data Shortcuts node > Validate Data Shortcuts |
| Set source file | Repoint a single shortcut | Right-click shortcut XML > Set Source File |

A synchronize that takes more than a few seconds usually indicates many references or a large surface. This is normal.

## Promote

UI path: in the consumer drawing, right-click the reference object > **Promote**.

Promotion converts the reference to a local, editable object. The link to the source is broken. Use cautiously - promoted objects no longer update when the source changes.

Use cases:

- The reference must be edited locally for a one-off (a temporary clip).
- The source drawing is being retired and the consumer needs to retain the geometry.

## Common errors

- `Source file not found`: the source moved or the working folder was set wrong. Use Validate Data Shortcuts to repoint.
- `Reference is out of date`: source was saved. Synchronize references.
- `Cannot create data shortcut - object not supported`: assemblies and parcels are not supported. Use xrefs of the source drawing or export the object.
- `Data shortcut name conflicts with existing object`: an object with the same name already exists locally. Rename one.
- `Cannot promote - reference is locked by data shortcut project`: another drawing has the reference open. Close other drawings.

## Related

- [Vault vs Shortcuts vs BIM Collaborate](vault-vs-shortcuts-vs-bim360.md)
- [Broken references recovery](broken-references-recovery.md)
- [Foundational data shortcut creation](../data-shortcuts/creating-data-shortcuts.md)
