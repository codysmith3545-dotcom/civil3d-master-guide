---
title: "Description Keys"
section: "civil3d/points"
order: 20
visibility: public
tags: [points, description-keys, dks, point-styles, label-styles]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEDESCRIPTIONKEYSET, EDITDESCRIPTIONKEYSET, APPLYDESCRIPTIONKEYS]
updated: 2026-05-06
---

> **TL;DR**
> 1. A Description Key is a wildcard rule that matches a point's Raw Description and assigns a Point Style, Point Label Style, layer, scale, and Full Description automatically. Keys live inside Description Key Sets.
> 2. Civil 3D evaluates description keys when points are imported, when `APPLYDESCRIPTIONKEYS` is run, or when the description is edited and matching is enabled. Match order matters — the first set in the list wins.
> 3. Build a single office-wide Description Key Set in the master DWT. Use prefix wildcards (`TREE*`), parameter substitution ($1, $2), and translate raw codes (`MH-S`) into human-readable Full Descriptions (`Sanitary Manhole`).

## Anatomy of a Description Key

Each row in a key set has these columns:

- **Code** — a wildcard pattern matched against the Raw Description. Wildcards: `*` (any), `?` (single character), `#` (single digit), `@` (alpha), `[abc]` (one of), `~` (negate).
- **Format** — the Full Description template. Use `$*` to insert the entire raw description; `$1`, `$2`, etc. to insert space-delimited tokens from the raw description.
- **Point Style** — the Civil 3D point style applied (controls marker symbol).
- **Point Label Style** — the label style applied (controls labels around the point).
- **Layer** — the AutoCAD layer for the point object. Special value `<None>` means no layer override; use the style's layer.
- **Scale parameters** — separate scale factors for the point marker and the label, with checkboxes for whether each scales with model or paper space.
- **Rotate parameters** — rotation override per point, useful for symbols that should align with a feature.

## How matching works

When points are processed, Civil 3D walks the active Description Key Sets in the order shown in Toolspace > Settings > Point > Description Key Sets. The first key whose Code wildcard matches the Raw Description wins; subsequent sets are not consulted. Within a set, the first matching row wins.

For most offices, one set is enough. Multiple sets are useful when a project requires temporary overrides (e.g. an "as-built" set added at the top during the closeout phase).

## Writing wildcards

- `TREE*` matches `TREE`, `TREE-1`, `TREEMAPLE`.
- `MH-S*` matches `MH-S`, `MH-SAN`, `MH-S5`.
- `EP[0-9]` matches `EP1` through `EP9` but not `EP10`.
- `PP#` matches `PP1`, `PP2`, ... `PP9`.
- `~TMP*` matches anything not starting with `TMP`.

Civil 3D wildcards are AutoCAD wildcards, the same set used by `LAYER` and `FILTER`.

## Format string substitutions

Format pulls tokens from the raw description (split on spaces by default):

- `$*` — the whole raw description.
- `$1`, `$2`, `$3` — space-delimited tokens.
- Mix literal text and tokens: `Hydrant size $2"`.

Example: a raw description `HYD 6` with code `HYD*` and format `Hydrant $2"` produces full description `Hydrant 6"`.

Parameters can also drive scale and rotation:

- Scale by parameter: `$3` would read the third token as a scale factor.
- Rotation by parameter: same idea, in degrees.

This is handy for tree symbols where the surveyor codes the trunk diameter as a parameter and the symbol scales accordingly.

## Creating and editing a set

1. Toolspace > Settings tab > Point > Description Key Sets.
2. Right-click `Description Key Sets` > New (`CREATEDESCRIPTIONKEYSET`). Name it.
3. Right-click the new set > Edit Keys (`EDITDESCRIPTIONKEYSET`). Add rows.
4. To reorder match priority, right-click the parent node > Properties > use the up/down arrows.

To save the set into the office DWT, define it in the template and re-save. Description Key Sets are drawing-resident.

## Applying keys

- **Automatic on import**: The "Match on creation" flag is on by default. New points coming in from a file or COGO are matched immediately.
- **Manual**: `APPLYDESCRIPTIONKEYS` re-runs matching against existing points. Use after editing keys.
- **Per-point disable**: A point's properties have a "Description Keys Matching" toggle; turning it off freezes the current style on that point.

## Common gotchas

- **Spaces in raw description.** Tokens are split on spaces, not on hyphens. Code `MH-SAN` is one token; `MH SAN` is two — Format `$1` returns `MH` in the second case.
- **Forgotten layer override.** Setting Layer to `<None>` is not the same as the layer being empty; explicit `<None>` means the style decides. A blank cell can interpret as `0`.
- **Wildcard order.** A row with `*` will match everything before more specific rows below it. Put `*` last.
- **Updating keys does not update existing points.** Civil 3D does not auto-rematch; run `APPLYDESCRIPTIONKEYS`.
- **Style not in drawing.** A key referencing a style that has been purged silently fails the layer/scale assignments. Audit after style cleanup.
- **Survey database points.** Description keys apply when points are inserted from the survey database into the drawing. Database points themselves are not styled by keys.

## Related

- [Point groups](point-groups.md)
- [Point import and export formats](import-export-formats.md)
- [Figure prefixes](../survey/figures-and-figure-prefixes.md)
