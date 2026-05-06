---
title: "Data shortcut commands"
section: "civil3d/commands/by-category"
order: 120
visibility: public
tags: [commands, data-shortcuts, references, working-folder, project]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. Data shortcuts are lightweight XML pointers that let multiple drawings share the same source object (alignment, profile, surface, pipe network, view frame group, corridor).
> 2. The "working folder" holds the project subfolders; "_Shortcuts\\<project>\\" holds the .xml pointer files.
> 3. Use `CreateDataShortcuts` in the source drawing; use the Prospector → Data Shortcuts tree in any other drawing to consume them.

## Commands in this category

- `CreateDataShortcuts` — see [createdatashortcuts.md](../createdatashortcuts.md)
- `DataShortcutsManager` — see [datashortcutsmanager.md](../datashortcutsmanager.md)
- `SetWorkingFolder` — change the parent folder containing project subfolders.
- `NewShortcutsFolder` — create the project's `_Shortcuts` folder.
- `SetShortcutsFolder` — point the drawing at an existing project's shortcuts.
- `AssociateShortcutsToProject` — used when promoting a working drawing into Vault.
- `PromoteToObject` — convert a referenced object to a local copy (breaks the link).
- `SynchronizeReferences` — refresh references to pick up source changes.

## Typical workflow

1. Set the working folder once per machine.
2. In the source drawing, run `CreateDataShortcuts` and pick which alignments, profiles, surfaces, pipe networks, etc. to publish.
3. In a downstream drawing, drag the data-shortcut node from Prospector into the drawing to create a reference.
4. When the source updates, downstream drawings get a "out of date" badge — `SynchronizeReferences` to refresh.
5. Avoid renaming or moving source DWGs without using `DataShortcutsManager` to repath.

## Related

- [Data shortcuts workflows](../../data-shortcuts/index.md)
- [Plan production commands](plan-production.md)
- [Plot / sheet commands](plot.md)
