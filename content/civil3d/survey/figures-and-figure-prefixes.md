---
title: "Figures and Figure Prefixes"
section: "civil3d/survey"
order: 20
visibility: public
tags: [survey, figures, figure-prefix, breaklines, linework]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEFIGUREFROMOBJECT, EDITFIGUREPREFIXDATABASE, INSERTFIGURESINTODRAWING]
updated: 2026-05-06
---

> **TL;DR**
> 1. A Figure is a survey-aware polyline that lives in the survey database. Figures connect points by description code (e.g. all points coded `EP` form an edge of pavement figure) and can carry curves resolved from PC/PT/RC tags.
> 2. The Figure Prefix Database is a lookup table that maps the leading characters of a point description to a layer, style, breakline flag, lot-line flag, and surface-membership flag. It is what causes `EP1`, `EP2`, `EP3` to land on the right layer with the right symbology automatically.
> 3. Build the prefix database once per office, store it under the Working Folder, and reference it from every job. Edits made there ripple to all linked databases on next import or `Update Linework`.

## What a figure is

A figure is a 2D or 3D polyline owned by the survey database, not by the drawing. It is created either by linework codes during field-book processing, by `CreateFigureFromObject` on an existing polyline, or manually in the Figures editor. Each vertex of a figure is a survey point; the figure inherits Z values from those points.

Because figures live in the database, they can be inserted into any drawing as references. Edits to the underlying observations (a recomputed network, a corrected target height) update the figure, which then prompts referenced drawings to refresh.

Figures are first-class candidates for surface breaklines: right-click `Surface > Definition > Breaklines > Add` and choose `From figure`.

## Anatomy of a figure prefix database

A Figure Prefix Database (`.fdb_xdef`) is a list of records, each with:

- **Name / prefix** — the leading characters of the point description that match this rule. `EP` matches `EP`, `EP1`, `EP-A`, `EPCURB`.
- **Breakline** — yes/no flag that pre-tags figures with this prefix as breakline candidates.
- **Lot Line** — yes/no flag for parcel-segment processing.
- **Layer** — the layer the figure is drawn on.
- **Style** — figure style controlling display.
- **Site** — site assignment (typically `<None>` for non-parcel figures so they don't auto-clean).

Civil 3D matches longest prefix first. If both `EP` and `EPCURB` are defined, `EPCURB1` matches the longer rule.

## Creating and editing a prefix database

1. Toolspace > Survey tab. Right-click `Figure Prefix Databases` > New.
2. Name the file something like `Office_Standard.fdb`. It is stored under `Working Folder\\Equipment\\` by default; centralize on a network share so every user opens the same one.
3. Right-click the new database > Manage Figure Prefix Database. Add rows for every code your field crews use.
4. Set defaults for breakline, layer, and style per row.
5. Save and close. Link the database to a survey database during `IMPORTSURVEYDATA`, or right-click the survey database > Edit Survey Database Settings > Figure Prefix Database.

## How linework codes drive figures

Linework code sets (see [Linework code sets](linework-code-sets.md)) tell Civil 3D when a figure starts (`B`), continues, ends (`E`), is a curve (`PC`/`PT`/`RC`), or is closed (`CLS`). The point description carries the code; the prefix database picks up the figure name from the leading text. Example: a point shot with `EP B` starts a figure named `EP`; subsequent `EP` points extend it; `EP E` closes it.

Curves are resolved by either:

- **Three-point curve**: shoot `EP PC`, an intermediate point, and `EP PT`. Civil 3D fits a circular arc.
- **Tangent curve with radius**: shoot `EP RC <radius>`. The arc is computed from radius and tangent in/out.

Codes can be combined: `EP B PC` starts a figure on a curve.

## Inserting figures into a drawing

- Toolspace > Survey > expand the database > Figures node > select figures > right-click > Insert into drawing.
- The drawing now holds a reference to those figures. The Prospector tab shows a `Survey Figures` node listing references.
- Use `INSERTFIGURESINTODRAWING` for a command-line equivalent.

## Common gotchas

- **Prefix not matched.** If a point's description begins with whitespace or contains a special character before the prefix, the match fails silently and the figure lands on layer 0 with the default style. Trim descriptions in the data collector.
- **Style and layer disagree.** A prefix rule sets a layer, but the figure style references its own layer for components. The figure ends up on the prefix layer, but its label or marker may still draw on the style's layer.
- **Site collision.** Putting figures on the same Site as parcels causes Civil 3D to attempt parcel cleanup on every edit. Keep figures on `<None>` unless you specifically want them in parcel topology.
- **Breakline flag without 3D.** A figure tagged as a breakline but built from 2D points (no Z) creates a flat breakline, distorting the surface to elevation 0. Always confirm point Z before adding to surface.
- **Editing in DWG vs database.** Modifying the figure with `PEDIT` after insertion does not update the database. Right-click the figure > Edit Figure to push changes back, or edit in the survey database directly.

## Related

- [Survey database](survey-database.md)
- [Linework code sets](linework-code-sets.md)
- [Breaklines and boundaries](../surfaces/breaklines-and-boundaries.md)
