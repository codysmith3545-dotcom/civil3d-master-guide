---
title: "Repathing Data Shortcuts"
section: "civil3d/data-shortcuts"
order: 30
visibility: public
tags: [data-shortcuts, repath, working-folder, broken-reference, migration]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [RepathDataShortcuts, SetWorkingFolder, SetProjectFolder]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Repath Data Shortcuts
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-6E7F8A9B-0C1D-2E3F-4A5B-6C7D8E9F0A1B
    verified: 2026-05-06
---

> **TL;DR**
> 1. Repathing is needed when the project moves to a new server, the folder structure changes, or the drive letter mapping changes. Data shortcuts store relative paths from the `_Shortcuts` folder to source drawings — if those paths break, references fail.
> 2. Use the **Repath Data Shortcuts** tool (Prospector > Data Shortcuts > right-click > Repath) to update paths. For bulk changes, edit the shortcut XML files directly with a text editor (carefully).
> 3. After repathing, every consumer drawing must synchronize its references to reconnect to the updated paths. Test one drawing first before rolling the change across the team.

## Why repathing is necessary

Data shortcut XML files contain a relative path from the `_Shortcuts` folder to the source drawing. For example:

```xml
<SourceFile>..\..\Survey\EG-Survey.dwg</SourceFile>
```

This path breaks when:

- The project folder moves to a different server (e.g., `\\oldserver\projects\` to `\\newserver\projects\`).
- The drive letter mapping changes (e.g., `S:\` becomes `P:\`).
- The folder structure inside the project is reorganized (e.g., source drawings move from `Survey\` to `Base\Survey\`).
- The source drawing is renamed.

When a path breaks, consumer drawings show a red X on their references and cannot synchronize.

## Repathing from Toolspace

### Individual repath

1. In Prospector, expand Data Shortcuts.
2. Right-click the broken shortcut (red X icon) > Repath.
3. Browse to the new location of the source drawing.
4. Click OK. Civil 3D updates the XML file with the corrected path.

### Bulk repath

1. Right-click the Data Shortcuts node (not an individual shortcut) > Repath Shortcuts.
2. Civil 3D lists all shortcuts with their current source paths.
3. Use the **Find and Replace** functionality (if available in your version) or manually update each path.
4. Click OK to write the changes.

## Editing shortcut XML directly

For large projects with many shortcuts, editing the XML files with a text editor can be faster than using the GUI one-by-one.

### Steps

1. Navigate to the `_Shortcuts` folder in the project directory.
2. Open a shortcut XML file in a text editor (Notepad++, VS Code).
3. Locate the `<SourceFile>` element. It contains the relative path to the source drawing.
4. Update the path to reflect the new location.
5. Save the file.
6. Repeat for all affected shortcuts.

### Batch find-and-replace

If the change is systematic (e.g., all source drawings moved from `Survey\` to `Base-Data\Survey\`), use a find-and-replace across all XML files:

- Find: `..\..\Survey\`
- Replace: `..\..\Base-Data\Survey\`

Use a tool that supports multi-file find-and-replace (VS Code, Notepad++, PowerShell).

### Caution

- Back up the `_Shortcuts` folder before editing.
- Preserve the XML structure. Do not alter element names, handles, or other attributes.
- Use relative paths (starting with `..\`) consistent with the existing convention.

## Updating the working folder

If the entire working folder moved (e.g., from `\\oldserver\civil3d-projects\` to `\\newserver\civil3d-projects\`), every user on the team must update their working folder setting:

1. Prospector > right-click the project node > Set Working Folder.
2. Browse to the new location.
3. Then set the project folder within the new working folder.

This does not automatically fix broken shortcut XML paths — those still reference relative paths from `_Shortcuts` to source drawings. If the internal project structure is unchanged, the relative paths may still be valid after updating the working folder. Test by opening a consumer drawing and attempting to synchronize.

## Common repath errors

| Error | Cause | Fix |
|---|---|---|
| "Source drawing not found" | The path in the XML does not resolve to an actual file | Verify the path is correct; check for typos, missing folders, or permission issues |
| "Object not found in source drawing" | The source drawing exists but the object handle is invalid (object was deleted and recreated) | Re-publish the data shortcut from the source drawing; the new XML will have the correct handle |
| "Access denied" | Network permissions prevent reading the source drawing | Fix file/folder permissions on the server |
| Reference still shows red X after repath | The consumer drawing cached the old path; synchronize or close and reopen the consumer drawing | Run `SynchronizeReferences` or reopen the drawing |

## Preventing repath headaches

- **Standardize the working folder path across all workstations.** Use a UNC path (e.g., `\\server\civil3d-projects\`) rather than a mapped drive letter. Drive letters can differ between users; UNC paths are universal.
- **Do not reorganize the project folder after publishing shortcuts.** If you must restructure, repath all shortcuts and notify the team.
- **Use relative paths in the project structure.** Keep source drawings close to the `_Shortcuts` folder (within the project directory) so relative paths are short and less likely to break.
- **Document the folder structure.** A project README or standards document that describes where each drawing lives helps future team members (and future-you) understand the layout.

## Related

- [Project structure](project-structure.md)
- [Creating data shortcuts](creating-data-shortcuts.md)
- [Referencing, synchronizing, promoting](referencing-syncing-promoting.md)
- [Data shortcuts vs Vault](data-shortcuts-vs-vault.md)
