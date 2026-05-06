---
title: "Referencing, Synchronizing, and Promoting"
section: "civil3d/data-shortcuts"
order: 25
visibility: public
tags: [data-shortcuts, reference, synchronize, promote, consumer-drawing]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CreateReference, SynchronizeReferences, PromoteDataShortcut]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Create Data References
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-5D6E7F8A-9B0C-1D2E-3F4A-5B6C7D8E9F0A
    verified: 2026-05-06
---

> **TL;DR**
> 1. **Create Reference** brings a published data shortcut into a consumer drawing as a read-only copy of the source object. The reference maintains a live link back to the source.
> 2. **Synchronize** updates the reference when the source has changed. It does not happen automatically — someone must trigger it.
> 3. **Promote** breaks the link and converts the reference into an editable local object. Use this when you need to modify something that belongs to another drawing (e.g., extending an alignment in a branch design).

## Creating a reference

Command: `CreateReference` (Prospector > Data Shortcuts > [Object Type] > right-click the shortcut > Create Reference).

Steps:

1. Open the consumer drawing (the drawing that needs to use the shared object).
2. In Prospector, expand Data Shortcuts. The published shortcuts for the current project appear, organized by type.
3. Right-click the desired shortcut > Create Reference.
4. Civil 3D reads the source drawing, copies the object data, and inserts a reference into the consumer drawing.

The reference appears in Prospector under its object type (e.g., Surfaces, Alignments) with a shortcut overlay icon indicating it is a reference, not a local object.

### What you can do with a reference

- **Use it for design.** A referenced surface can be used as a target for corridors, grading, and pipe networks. A referenced alignment can host profiles and serve as a corridor baseline.
- **Label it.** Add labels, tables, and annotations to the referenced object.
- **Display it.** Apply styles and control layer visibility just like a local object.
- **Section it.** Referenced surfaces and alignments can appear in section views.

### What you cannot do with a reference

- **Edit the geometry.** The surface triangulation, alignment geometry, profile PVIs, and pipe network layout are read-only. Attempting to edit produces a warning.
- **Delete source components.** You cannot remove breaklines from a referenced surface or points from a referenced alignment.
- **Change properties that affect the source.** Object properties that are owned by the source drawing (name, description, design parameters) are locked.

## Synchronizing references

When the source object changes (e.g., the survey team updates the surface with new data), consumer drawings do not update automatically. You must synchronize.

### How to know a reference is out of date

In Prospector, a stale reference displays a warning icon (yellow triangle). This icon appears when Civil 3D detects that the source drawing's timestamp is newer than the reference's last sync.

### Synchronizing

Method 1: Right-click the specific reference in Prospector > Synchronize.

Method 2: Right-click the Data Shortcuts node > Synchronize All References. This updates every reference in the drawing.

Method 3: Command `SynchronizeReferences`.

### What synchronization does

1. Opens the source drawing in the background (read-only).
2. Reads the current state of the source object.
3. Updates the reference in the consumer drawing with the new data.
4. Closes the source drawing.

After synchronization, any designs built on the reference (corridors, grading, pipe networks) recalculate to reflect the updated source data. This can cause cascading changes — a surface update may shift corridor daylight lines, which changes earthwork quantities.

### When to synchronize

- **Before starting design work.** Ensure you are working with the latest source data.
- **Before producing plan sheets.** Stale references on plan sheets lead to incorrect annotations.
- **After notification from the source drawing owner.** The team should communicate when significant source changes are published.

## Promoting a reference

Command: `PromoteDataShortcut` (right-click the reference in Prospector > Promote).

Promoting converts the reference into a local, editable object and breaks the link to the source drawing. After promotion:

- The object is fully editable (geometry, properties, definition).
- It no longer tracks changes to the source.
- It no longer displays the shortcut overlay icon.
- It cannot be "demoted" back to a reference.

### When to promote

- **Branch design.** You need to extend or modify an alignment that belongs to another drawing (e.g., a side-street alignment that branches off the main corridor alignment).
- **Independent edits.** You need a copy of the surface to test a design alternative without affecting the shared version.
- **Archiving.** You want the drawing to be self-contained (no external dependencies) for long-term archival or delivery to a client.

### Risks of promoting

- **Divergence.** Once promoted, the object in the consumer drawing will not receive future updates from the source. If the source alignment shifts, the promoted copy remains at the old position.
- **Duplication.** You now have two independent copies of the same object in two drawings. This can cause confusion if both are treated as authoritative.
- **No undo.** Promotion cannot be reversed. If you need the reference back, delete the promoted object and recreate the reference.

## Reference status icons

| Icon | Meaning |
|---|---|
| Normal (shortcut overlay) | Reference is current and linked to the source |
| Yellow triangle | Reference is out of date — source has changed since last sync |
| Red X | Reference is broken — source drawing or object cannot be found |
| No overlay | Object is local (not a reference) or has been promoted |

## Handling broken references

A broken reference (red X) occurs when:

- The source drawing was moved, renamed, or deleted.
- The object was removed from the source drawing.
- The project folder or working folder path changed.

To fix:

1. If the source drawing moved: repath the shortcuts (see [Repathing shortcuts](repathing-shortcuts.md)).
2. If the object was deleted: promote the reference (to keep the last-synced data) or delete the reference.
3. If the project folder moved: update the working folder and project folder settings, then repath.

## Related

- [Creating data shortcuts](creating-data-shortcuts.md)
- [Repathing shortcuts](repathing-shortcuts.md)
- [XREFs vs data shortcuts](xrefs-vs-data-shortcuts.md)
- [Multi-discipline coordination](multi-discipline.md)
