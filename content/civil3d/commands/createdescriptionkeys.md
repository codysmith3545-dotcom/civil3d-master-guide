---
title: "CreateDescriptionKeys"
section: "civil3d/commands"
order: 204
visibility: public
command: CreateDescriptionKeys
category: points
ribbon: "Toolspace > Settings > Point > Description Key Sets > right-click > New (no direct ribbon entry)"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreatePoints, ImportPoints, CreatePointGroup, EditPoints]
symptoms:
  - "How do I make survey codes like EP, BC, IP automatically apply the right symbol?"
  - "Why do my imported points look like crosses with no symbol?"
  - "How do I match different curb codes (BC, EC, EP) to the same style?"
  - "How do I make a description key apply to a layer, not just a style?"
  - "Where do description keys live and how do I reuse them?"
tags: [description-keys, points, styles, code-matching]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Description Key Sets"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-13A4FCAB-29F8-49B7-A1DB-2D8F4DAFCB62
    verified: 2026-05-06
---

> **TL;DR**
> 1. Description keys translate a point's raw description (e.g., `EP`, `IP*`) into a point style, label style, layer, and optional rotation/scale.
> 2. They fire on point creation/import. After-the-fact code edits require explicit re-application.
> 3. Wildcard syntax: `*` matches any string, `?` any single character. `EP*` matches `EP`, `EP1`, `EP-CONC`.

## When to use

When you want imported survey points to take on the right symbology and layer automatically based on the field crew's coding convention, instead of styling each point by hand.

## Workflow

1. In Toolspace → Settings → Point, right-click **Description Key Sets** → **New**. Name the set (e.g., `Company-Standard`).
2. Right-click the new set → **Edit Keys**. Add rows: one per code pattern. Use wildcards.
3. For each row, set the **Style**, **Label Style**, **Layer**, and any **Format** override for the full description.
4. Order keys carefully — Civil 3D matches top-down. Put more specific patterns above generic ones (e.g., `EP-CONC` before `EP*`).
5. Confirm the set is enabled at Settings → Point → **Edit Feature Settings → Default Styles → Description Key Set**, or per point group.
6. Re-import or re-create points to see keys take effect; for already-existing points, right-click the point group → **Apply Description Keys**.

## Common gotchas

- Description keys are stored in the drawing or the template. Build them into the company template (`.dwt`); otherwise every project starts from scratch.
- Match column order matters. The first key that matches wins — generic catch-alls at the bottom.
- Format string interpolation uses `$0`, `$1`, etc. for parameters parsed from the raw description; if your codes don't include parameters, leave format alone.
- Layers referenced by keys must already exist in the drawing. A typo creates a "missing layer" error and the point falls to layer 0.

## Related commands

- [CreatePoints](createpoints.md)
- [ImportPoints](importpoints.md)
- [CreatePointGroup](createpointgroup.md)
- [EditPoints](editpoints.md)
