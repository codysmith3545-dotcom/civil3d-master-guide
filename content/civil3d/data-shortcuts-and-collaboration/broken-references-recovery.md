---
title: "Broken References Recovery"
section: "civil3d/data-shortcuts-and-collaboration"
order: 40
visibility: public
tags: [broken-reference, repath, validate, missing-source, recovery, troubleshooting]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [VALIDATEDATASHORTCUTS, EDITSHORTCUTS, EXTERNALREFERENCES]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - To Validate Data Shortcuts"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-EBE5EF6A-46B7-4F90-A4E1-5A9F4F60E0CD"
    verified: 2026-05-11
  - title: "Autodesk Civil 3D Help - To Repair a Broken Reference"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-7E8F0DDA-9CC2-4D1F-BFA2-D9B8AF93C014"
    verified: 2026-05-11
---

> **TL;DR**
> 1. Broken references happen when source drawings move, get renamed, or are deleted - or when the working folder is set incorrectly on a different machine.
> 2. Diagnose: Toolspace > Prospector > Data Shortcuts > **Validate Data Shortcuts** lists every shortcut and flags missing sources.
> 3. Fix by repathing the shortcut XML (`EDITSHORTCUTS`) or by re-creating the shortcut from the source - then synchronize every consumer drawing.

## What is broken

A "broken" reference in Civil 3D usually means one of:

| Symptom | Underlying cause |
|---|---|
| Reference object missing or marked invalid in Prospector | Source drawing path in the shortcut XML points to a missing file |
| Surface or alignment displays but does not update | Shortcut XML still points to an old source; new source is unreferenced |
| `Source file is locked or in use` error on sync | Another session has the source open |
| Reference shows as **out of date** repeatedly even after sync | Working folder mismatch between users |

For xrefs, similar issues surface in the External References palette (`ERR`): a yellow caution icon means **needs reload**; a red X means **not found**.

## Validate Data Shortcuts

UI path: Toolspace > Prospector > Data Shortcuts > right-click > **Validate Data Shortcuts**.

The Validate Data Shortcuts panorama lists every shortcut in the active project, with columns:

- Object name and type.
- Source drawing path.
- Status (Valid, Source not found, Source modified, Object missing in source).

For each broken row, right-click and pick one of:

- **Set Source File** - browse to the new source `.dwg`. Civil 3D updates the shortcut XML.
- **Synchronize** - if the source moved within the project and the path resolved at next open.
- **Remove** - if the object is no longer needed.

## Repathing a single shortcut (`EDITSHORTCUTS`)

Run `EDITSHORTCUTS` at the command line, or right-click an individual shortcut XML in Prospector > **Edit**.

The Edit Data Shortcut dialog shows the current path. Click the path field and pick a new source drawing. The reference now points to the new source.

Use this when you only need to fix one shortcut without scanning the whole project.

## Re-creating shortcuts

If a source drawing was renamed or split into multiple files:

1. Open the new source drawing.
2. Run `CREATEDATASHORTCUTS` on the relevant objects.
3. In consumer drawings, right-click the broken reference > **Repath** (or delete the broken reference and create a new one to the new shortcut).

## Working folder issues

Civil 3D resolves shortcut sources relative to the working folder. If two team members have different working-folder settings, both will see different "broken" references.

Verify with Toolspace > Prospector > Data Shortcuts > right-click > **Set Working Folder**. Every team member's working folder must point to the same root (typically a mapped drive letter to the network share).

For BIM Collaborate, the cloud project folder substitutes for the network share; Civil 3D maps the local sync folder transparently, but a Reload Working Folder is sometimes required after a project re-link.

## Xref repath

UI path: Insert tab > Reference panel > **External References** (`EXTERNALREFERENCES`).

Right-click the broken xref > **Select New Path** (one file) or **Find and Replace** (batch by string match).

Use **Find and Replace** when an entire folder has moved - all xrefs sharing a path prefix can be repathed at once.

## Recovery checklist

When a project's references break en masse (post-archive restore, post-folder migration):

1. Set the working folder to the correct project root.
2. Run **Validate Data Shortcuts** at the project root.
3. Sort the list by Status - tackle all "Source not found" first.
4. Repath one source to confirm the path correction is correct.
5. Use **Find and Replace** in the External References palette for xrefs sharing the same broken prefix.
6. Open every consumer drawing once and synchronize references.
7. Save each drawing - this writes the corrected references into the file.

## Common errors

- `Source file not found` even though the file exists: the working folder is wrong, or the path is case-sensitive on a network share. Verify both.
- `Cannot edit shortcut - another user is editing the source`: someone else has the source `.dwg` open exclusively. Coordinate.
- `Reference promotes successfully but data goes stale`: promotion broke the link intentionally. If you wanted to keep the link, undo and try Validate / Set Source File instead.
- `Validate Data Shortcuts reports all valid but consumer still shows broken`: open the consumer drawing and synchronize references; the broken state was cached.

## Related

- [Data shortcuts workflow](data-shortcuts-workflow.md)
- [Vault vs Shortcuts vs BIM Collaborate](vault-vs-shortcuts-vs-bim360.md)
- [Xref vs data reference - best practices](xref-vs-data-reference-best-practices.md)
- [Foundational repathing](../data-shortcuts/repathing-shortcuts.md)
