---
title: "Profiles in Data Shortcuts"
section: "civil3d/profiles"
order: 70
visibility: public
tags: [profile, data-shortcut, reference, project, dref]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateDataShortcuts, CreateReferenceFromShortcut, PromoteReference, EditDataShortcuts]
updated: 2026-05-11
sources:
  - title: Autodesk Civil 3D 2025 Help — Data Shortcuts
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-0F1A2B3C-4D5E-6F7A-8B9C-0D1E2F3A4B5C
    verified: 2026-05-11
  - title: Autodesk Civil 3D 2025 Help — Promoting References
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-1A2B3C4D-5E6F-7A8B-9C0D-1E2F3A4B5C6D
    verified: 2026-05-11
---

> **TL;DR**
> 1. Profiles can be **published as data shortcuts** so other drawings reference them read-only and stay in sync with the source DWG.
> 2. A profile reference inherits its alignment reference; you cannot publish a profile without first publishing its **alignment**.
> 3. Use **Promote** to convert a reference into an editable copy if the downstream drawing needs to take ownership.

## Publishing a profile

Prerequisites: a working data-shortcut project folder with `_Shortcuts` set, and the alignment that owns the profile is already published.

1. Toolspace > Prospector > **Data Shortcuts** node.
2. Right-click > **Create Data Shortcuts** (command: `CreateDataShortcuts`).
3. In the **Create Data Shortcuts** dialog, expand **Alignments** and check the parent alignment (if not already shared); expand **Profiles** under the alignment and check the profile to share.
4. **OK**. Civil 3D writes XML in the `_Shortcuts/Profiles` folder.

The source DWG is now the master; references in other DWGs can attach.

## Creating a profile reference

In a downstream drawing:

1. Toolspace > Prospector > **Data Shortcuts** > expand **Profiles** under the parent alignment.
2. Right-click the profile > **Create Reference** (command: `CreateReferenceFromShortcut`).
3. Pick a style and label set.
4. The profile appears as a reference in Prospector with a small reference badge.

## Promoting a reference

If the downstream drawing needs to edit the profile (e.g., a separate alternates analysis):

1. Right-click the reference profile > **Promote** (command: `PromoteReference`).
2. The reference becomes a local, editable profile; the link to the source breaks.

Promotion is irreversible without re-attaching as a new reference; document why you promoted.

## Updating after the source changes

1. In the downstream drawing, the reference shows an **out-of-date** indicator in Prospector.
2. Right-click the reference > **Synchronize** to pull the latest geometry.
3. If the source profile was renamed or deleted, repair the link via **Data Shortcuts > Repair Broken References**.

## Best practices

- Keep one **profile-master DWG per corridor** so the data-shortcut chain is traceable.
- Standardize folder structure under `_Shortcuts/`; the path is stored in the XML and is sensitive to renames.
- Do not promote casually; once promoted, divergence happens.
- Pair profile references with their **alignment** and **surface** references so a downstream drawing can rebuild without opening the source.

## Common errors

- **"Cannot create reference: parent alignment is not in this drawing"** — attach the alignment reference first.
- **Profile reference is missing data** — source DWG was saved while a profile edit was in progress; reopen and save the source.
- **Synchronize does nothing** — working folder path differs between source and downstream; verify on **Toolspace > Master View > Set Working Folder**.
- **Profile shows wrong stationing** — the alignment in the downstream drawing has a different station equation; the reference is correct but presentation differs.
- **Style overrides lost** — references take styles from the downstream drawing's settings; restyle locally rather than expecting source styles to follow.

## Related

- [Data shortcuts (overview)](../data-shortcuts/index.md)
- [Layout profile design](layout-profile-design.md)
- [Profile creation from surface](profile-creation-from-surface.md)
- [Profile view styles](profile-view-styles.md)
