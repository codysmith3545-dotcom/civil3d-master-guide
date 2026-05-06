---
title: "Alignment Labels and Tables"
section: "civil3d/alignments"
order: 30
visibility: public
tags: [alignment, labels, station, annotation, tables]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [ADDALIGNMENTLABELS, EDITALIGNMENTLABELSTYLE, ADDALIGNMENTTABLE]
updated: 2026-05-06
---

> **TL;DR**
> 1. Alignment labels break into four categories: **station labels** (major/minor ticks), **station-offset labels** (reference points off the alignment), **geometry point labels** (PC, PT, PI, spiral points), and **tag/table labels** (numbered references with a summary table).
> 2. Assign a **label set** to the alignment on creation or in Alignment Properties. The label set bundles station labels, geometry point labels, and station equation labels into one package.
> 3. Label styles control text content, orientation, tick marks, and dragged-state behavior. Edit them in Settings > Alignment > Label Styles.

## Station labels

Station labels place tick marks and station text at regular intervals along the alignment.

### Major station labels

Placed at the station index increment (default every 100 ft imperial, 1000 m metric). The label typically shows the full station value (e.g., `10+00`). The tick extends perpendicular to the alignment.

### Minor station labels

Placed at subdivisions of the major interval (e.g., every 25 ft or 50 ft). Minor labels usually show a shorter tick with no text, or abbreviated text.

### Configuring intervals

Station label intervals are set in the label set or in Alignment Properties > Labels tab:

- **Major Station Label Style**: choose the style; set the increment.
- **Minor Station Label Style**: choose the style; set the increment.
- **Stagger labels**: offset alternating labels to avoid overlap on tight curves.

## Geometry point labels

Geometry point labels annotate key geometric positions along the alignment:

- **PC** (Point of Curvature) — where a tangent meets the start of a curve.
- **PT** (Point of Tangency) — where a curve ends and a tangent begins.
- **PI** (Point of Intersection) — the intersection of extended tangent lines at a curve.
- **TS** / **ST** (Tangent to Spiral / Spiral to Tangent) — spiral transition endpoints.
- **SC** / **CS** (Spiral to Curve / Curve to Spiral) — where a spiral meets a circular arc.
- **RP** (Radius Point) — center of the curve.
- **POB** / **POE** — Point of Beginning / Point of Ending of the alignment.

Geometry point labels can display:

- Station value at the point.
- Curve data: radius, delta angle, arc length, tangent length, chord bearing and distance.
- Spiral data: spiral length, A-value, spiral angle.

These labels are defined in the label set under "Geometry Points." Each point type can have its own style.

## Station-offset labels

Station-offset labels reference a point that is not on the alignment. They show the alignment station and the perpendicular offset distance to the labeled point.

1. Annotate ribbon > Add Labels > Alignment > Station/Offset — Fixed Point.
2. Pick a point in the drawing. The label shows `Sta: XX+XX.XX, Offset: XX.XX L/R`.

Use station-offset labels for:

- Referencing utility crossings, trees, or other features relative to the alignment.
- Showing setback distances from a road centerline.
- Annotating right-of-way or easement boundary intersections.

## Tag labels and tables

Tag labels assign a sequential number to each geometry point (e.g., "PC1", "PT1", "PC2", "PT2"). The tag number references a row in a summary table placed in the drawing or layout.

### Workflow

1. In the label set, switch geometry point labels to "tag" mode (use a Tag label style instead of a full-data label style).
2. Place the alignment. Tags appear at each geometry point as small numbered markers.
3. Annotate ribbon > Add Tables > Add Alignment Table (Line, Curve, or Spiral table).
4. Pick the alignment. The table lists every entity with its tag number, radius, delta, length, bearing, chord, and other computed values.

Tag-and-table is the standard annotation method for plan-and-profile sheets where space along the alignment is limited. The table goes in a clear area of the sheet or in a separate table sheet.

## Label style components

A label style (Settings > Alignment > Label Styles) contains:

- **Text components**: each component references a property expression (e.g., `{Station Value}`, `{Curve Radius}`). Multiple text components can be stacked or offset.
- **Line/tick components**: the perpendicular tick mark at station labels. Configurable length, color, lineweight.
- **Block component**: an optional block reference (e.g., a north arrow, a custom symbol).
- **Dragged state**: what happens when the label is grip-dragged. Options: stacked text with leader, leader only, or no leader.
- **Orientation**: Plan Readable, Object (aligned to the alignment direction), or World Coordinate.
- **Anchor point**: where on the alignment the label attaches.
- **Text height**: annotative or fixed. Use annotative for multi-scale viewports.

## Common label issues

- **Labels overlapping on tight curves**: increase the label interval, stagger labels, or switch to tag-and-table mode.
- **Station text showing wrong precision**: edit the label style's text component and change the decimal precision.
- **Labels not appearing**: the label set may have no styles assigned, or the label layers may be frozen.
- **Geometry point labels missing for spirals**: the label set may not include TS/ST/SC/CS styles. Add them in the label set's Geometry Points section.

## Related

- [Horizontal alignment basics](horizontal-alignment-basics.md)
- [Stationing equations](stationing-equations.md)
- [Editing alignments](editing-alignments.md)
- [Offset alignments](offset-alignments.md)
