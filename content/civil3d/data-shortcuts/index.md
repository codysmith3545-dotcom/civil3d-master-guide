---
title: "Data Shortcuts and Project Structure"
section: "civil3d/data-shortcuts"
order: 120
visibility: public
tags: [data-shortcuts, vault, xref, project]
updated: 2026-05-06
---

> **TL;DR**
> 1. **Data shortcuts** let multiple drawings reference the same Civil 3D objects (alignment, surface, profile, pipe network) without copying them. They're the lightweight alternative to Vault.
> 2. The shortcut "working folder" is on a network share; each project has a `_Shortcuts` folder with XML pointers to the source drawings.
> 3. **Promote** a reference if you need to break the link and edit it locally; **synchronize** to pick up source changes.

## Pages

- [Data shortcuts vs Vault](data-shortcuts-vs-vault.md)
- [Project structure (working folder, project folder)](project-structure.md)
- [Creating data shortcuts](creating-data-shortcuts.md)
- [Referencing, synchronizing, promoting](referencing-syncing-promoting.md)
- [Repathing data shortcuts](repathing-shortcuts.md)
- [XREFs vs data shortcuts](xrefs-vs-data-shortcuts.md)
- [Multi-discipline coordination](multi-discipline.md)

## Related

- [Fundamentals](../fundamentals/index.md)
