---
title: "Object Styles vs Label Styles"
section: "civil3d/fundamentals"
order: 30
visibility: public
tags: [fundamentals, object-styles, label-styles, style-inheritance, templates]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [EDITDRAWINGSETTINGS, STYLESEDITOR]
updated: 2026-05-06
---

> **TL;DR**
> 1. **Object styles** control the graphic appearance of the Civil 3D object itself (colors, layers, linetypes, component visibility), while **label styles** control the text, leaders, tick marks, and dragged-state behavior displayed around the object.
> 2. Both follow a drawing-level inheritance chain: Drawing Settings > Feature Settings > individual object or label. A style override at the object level wins over everything above it.
> 3. Build and maintain styles in a single office DWT. Import styles between drawings via the Settings tab drag-and-drop or `STYLESEDITOR`; never recreate by hand.

## Object styles

An object style defines how Civil 3D renders the object's geometry. Every object family (surface, alignment, profile, corridor, parcel, pipe, point, etc.) has its own object-style type, but the structure is the same:

- **Display tab** — toggles component visibility and assigns layer, color, linetype, lineweight, and plot style per component. Components vary by object type; a surface style has triangles, contours, grid, points, borders, and watersheds; an alignment style has lines, curves, spirals, and markers.
- **Summary tab** — flat view of all properties for quick scanning.
- **Information tab** — name, description, creator, date. The name is what appears in dropdowns and Toolspace.

Object styles live in the drawing. They travel with the DWG or DWT and can be dragged between drawings through Toolspace > Settings. When you import a style that already exists (same name), Civil 3D asks whether to overwrite.

### Layer control within styles

Each component row in the Display tab has a layer assignment. When the layer is set to `0`, the object plots on whatever layer the object itself resides on. When set to a named layer (e.g. `C-TOPO-CONT-MAJR`), that layer is auto-created if missing. This is how one surface style can put major contours on one layer and minor contours on another without the user manually managing layers.

## Label styles

Label styles control annotations that attach to or reference a Civil 3D object. A label style defines:

- **Layout** — one or more text components, each with a content expression (e.g. `{Surface Elevation}`), text height, color, anchor point, and attachment.
- **Dragged State** — how the label appears when the user drags it away from its default position: leader, stacked text, gap.
- **General** — visibility, layer, plan readability, orientation reference, forced insertion.
- **Border** — optional box or rounded rectangle around the text.

Label styles also support **child styles** and **referenced text styles**. The text content uses property fields in curly braces (e.g. `{Parcel Area}`, `{Alignment Station Value}`) combined with literal text and formatting codes.

### Label style inheritance

Civil 3D evaluates label formatting in this order (top wins):

1. **Component-level override** in the Layout tab (e.g. precision set on one text component).
2. **Label style** general properties.
3. **Label Style Defaults** (per feature family, editable via Settings tab > right-click the family > Edit Label Style Defaults).
4. **Drawing ambient settings** (the fallback for precision, units, direction format).

Clear the child override column to re-inherit from the parent level.

## Managing styles in a company template

A disciplined approach prevents style sprawl:

1. **One master DWT.** Define every object style and label style in a single template (or a small set: survey, design, construction). All new drawings start from this template.
2. **Naming convention.** Prefix with the office's abbreviation or standard set name (e.g. `NCS_Surface_Contour_1ft`, `NCS_Alignment_Proposed`). Avoid names like `Style 1` or `Copy of Standard`.
3. **Lock down overrides.** After configuring styles, walk the Override column in feature settings and clear any stale overrides. Document which settings are intentionally overridden and why.
4. **Version the DWT.** Store the template in version control or a managed location. Date-stamp or version-number the file name. When the template changes, distribute and have users start new drawings from the updated version.
5. **Import, don't recreate.** To bring a style into an existing drawing, drag from the Settings tab of a second open drawing or use `STYLESEDITOR`. Recreating by hand introduces drift.
6. **Purge unused styles.** `PURGE` removes unreferenced styles. Run periodically on deliverable drawings to reduce file size and confusion.

## Overriding at the drawing vs object level

- **Drawing-level override**: change the style assigned to an object family's default in Feature Settings. Every new object of that type picks up the new style. Existing objects keep their current assignment unless you select them and reassign.
- **Object-level override**: select the object > Properties > change the Object Style or Label Style. This is the strongest override and is not affected by feature-setting changes. Use sparingly; it makes bulk style updates harder.
- **Point groups**: for points specifically, the point group can override both the point style and the label style for its members. Group overrides sit between object-level and description-key-level in priority.

## Common gotchas

- **Copied styles accumulate.** Importing from many sources creates `Standard (1)`, `Standard (2)`, etc. Merge them immediately or rename to the office convention.
- **Style references another style.** Some label styles reference a text style (AutoCAD `STYLE` command). If that text style is missing, Civil 3D substitutes `Standard` and the font/height changes unexpectedly.
- **Display order confusion.** Object styles control what you see in model space. Plot styles (`CTB`/`STB`) can override colors/lineweights at plot time. Make sure both agree.
- **Label precision vs ambient precision.** A label style can have its own precision override (e.g. area to 1 sq ft) that differs from the ambient setting. When the numbers look wrong, check the label style's Layout tab first.

## Related

- [Ambient settings, units, and abbreviations](ambient-settings.md)
- [Templates and drawing settings](templates-and-settings.md)
- [Workspace and Toolspace](workspace-and-toolspace.md)
