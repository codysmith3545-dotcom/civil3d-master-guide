---
title: "Point Groups"
section: "civil3d/points"
order: 30
visibility: public
tags: [points, point-groups, query, override, surface]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEPOINTGROUP, EDITPOINTGROUPPROPERTIES, UPDATEPOINTGROUP]
updated: 2026-05-06
---

> **TL;DR**
> 1. A Point Group is a saved query over the drawing's COGO points. Membership is dynamic — change the query, the membership updates. Groups can also override Point Style, Label Style, and visibility for their members.
> 2. Use point groups to feed surfaces (`Existing Ground` group fed to a TIN surface), to display subsets (`_All Points` minus utility points on a topo sheet), and to run reports.
> 3. Groups have a strict draw order. Right-click `Point Groups > Properties > Point Groups` order tab. The group at the top wins for style overrides.

## Point Group properties — the seven tabs

`EDITPOINTGROUPPROPERTIES` opens the group dialog. Tabs:

1. **Information** — name, description, point style, label style override flags.
2. **Point Groups** — include or exclude entire other groups (set algebra).
3. **Raw Desc Matching** — include points where the raw description matches a description-key code in a chosen Description Key Set.
4. **Include** — point numbers, descriptions (raw or full), elevations, names, plus the `Include all points` checkbox.
5. **Exclude** — same fields, but exclusions trump inclusions.
6. **Query Builder** — boolean expression combining any property: `Northing > 1000000 AND Description ~= 'TREE*'`. The advanced way to express what the simpler tabs cannot.
7. **Overrides** — toggle which member-point properties this group overrides: style, label, layer.

The group's effective member set is `(Includes - Excludes) intersected with (any active Query Builder filter)`.

## The `_All Points` group

Civil 3D auto-creates a group called `_All Points` containing every COGO point in the drawing. It cannot be deleted. Use it as a base for inclusion logic in other groups.

## Draw order and overrides

When a point belongs to multiple groups, Civil 3D applies the style override of the group highest in the draw order. Reorder via Toolspace > Prospector > Point Groups > Properties > Point Groups order tab.

Style override behavior:

- A group with **Override Point Style: On** applies its style to its members, regardless of the points' individual style assignment.
- Description-key style assignments are below group overrides in priority.
- The point's manually assigned style is the highest priority of all (set via point properties), unless the description-key match is forced.

To stop a group from changing styles, simply turn off the Override flags on the Information tab.

## Feeding a surface

The cleanest way to build an existing-ground surface from points is:

1. Make a `EG_Points` point group with raw-description matching `EG-*`, `SHOT*`, etc., or by elevations within an expected range.
2. Surface > Definition > Point Groups > Add > pick `EG_Points`.
3. Future imports that match the descriptions automatically update the group, which automatically rebuilds the surface.

Use exclusions to drop spurious or above-ground points (`TREE*`, `BLDG*`, `POW*`).

## Refresh and update

Point groups stay current automatically when points are added or edited. Manual refresh is sometimes needed after batch operations:

- Right-click the group > Update.
- Right-click `Point Groups` parent > Update All Point Groups.
- `UPDATEPOINTGROUP` from the command line.

The "out-of-date" indicator (yellow shield icon) shows on a group whose last evaluation predates a property change.

## Useful Query Builder expressions

- `Raw Description ~= 'EP*' AND Elevation > 700`
- `Number >= 1000 AND Number <= 1999`
- `(Full Description LIKE '%MANHOLE%') OR (Full Description LIKE '%MH%')`
- `Northing BETWEEN 1900000 AND 1950000`
- `Style = 'EG_Marker'` (filter by current style assignment)

The Query Builder operators are SQL-like; LIKE uses `%` as a wildcard, not `*`. The simpler tabs use the AutoCAD `*`/`?` wildcards.

## Common gotchas

- **Override stuck on.** Forgetting to clear the override means the wrong style sticks even when the design moves on. Audit overrides per group, not per point.
- **Out-of-order processing.** A new group that should override another, placed lower in the draw order, will be ignored for style. Reorder.
- **Description match vs raw vs full.** Description Key Matching uses raw; the Include/Exclude tab can use either. They are not interchangeable.
- **Numeric range gotcha.** Number ranges include both endpoints in the Include tab UI but only `>` / `<` style in Query Builder. Check both ends.
- **Surface not rebuilding.** A surface fed from a point group does not auto-rebuild on point changes unless `Rebuild – Automatic` is enabled on the surface. Otherwise right-click > Rebuild.
- **Disabled override layer.** When a group overrides layer but the layer is frozen or off, the points appear missing. Check layer state in addition to group properties.

## Related

- [Description keys](description-keys.md)
- [Building a TIN surface](../surfaces/building-a-tin-surface.md)
- [Point import and export formats](import-export-formats.md)
