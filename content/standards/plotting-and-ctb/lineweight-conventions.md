---
title: "Lineweight Conventions"
section: "standards/plotting-and-ctb"
order: 30
visibility: public
tags: [lineweight, ctb, pen, plotting, cad-standards]
updated: 2026-05-06
---

> **TL;DR**
> 1. In a CTB workflow, lineweight is controlled by the color-to-pen mapping. A typical civil engineering CTB assigns 4 to 6 distinct lineweights ranging from 0.09 mm (very fine) to 0.70 mm (border/title block).
> 2. Standard assignments: **borders and title blocks** at 0.50 mm to 0.70 mm, **major linework** (road centerlines, building outlines) at 0.35 mm, **standard linework** (contours, lot lines, utilities) at 0.25 mm, **fine detail** (hatching, dimensions, leaders) at 0.13 mm to 0.18 mm, **text** at 0.18 mm to 0.25 mm.
> 3. Consistency matters more than the exact values. Pick a weight table, document it, and apply it uniformly across all project drawings.

## Why lineweight matters

Lineweight establishes visual hierarchy on a plotted sheet. Without varying weights, a drawing is a flat tangle of equal-weight lines. With proper hierarchy:

- The sheet border and title block frame the page visually.
- Major features (roads, buildings, property lines) stand out.
- Secondary features (contours, utilities, dimensions) recede.
- Fine detail (hatch, leaders, text underlines) is legible without competing with primary linework.

## Typical lineweight table (CTB)

The following table is representative of a civil engineering CTB. Actual values vary by firm.

| Pen weight | Metric (mm) | Imperial (in) | Typical use |
|---|---|---|---|
| Ultra-fine | 0.09 | 0.003 | Screening lines, reference grids, aerial-photo linework |
| Fine | 0.13 | 0.005 | Hatch patterns, dimension lines, leaders, text underlines |
| Light | 0.18 | 0.007 | Minor contours, dimension text, annotation leaders |
| Medium | 0.25 | 0.010 | Major contours, lot lines, utility lines, standard text |
| Heavy | 0.35 | 0.014 | Road centerlines, building outlines, property lines, section cuts |
| Extra-heavy | 0.50 | 0.020 | Sheet border, title block outlines, match lines |
| Border | 0.70 | 0.028 | Outer sheet border (if distinct from title block) |

## Color-to-lineweight mapping (CTB example)

A firm might assign lineweights to ACI colors as follows:

| ACI color | Screen appearance | CTB lineweight | Assigned to |
|---|---|---|---|
| 1 (red) | Red | 0.35 mm | Major proposed linework |
| 2 (yellow) | Yellow | 0.18 mm | Text, dimensions |
| 3 (green) | Green | 0.25 mm | Existing linework, contours |
| 4 (cyan) | Cyan | 0.13 mm | Hatch, fine detail |
| 5 (blue) | Blue | 0.25 mm | Water utilities |
| 6 (magenta) | Magenta | 0.25 mm | Sanitary sewer |
| 7 (white/black) | White/Black | 0.25 mm | General, text |
| 8 | Dark gray | 0.09 mm | Screened background, xref fade |
| 9 | Light gray | 0.13 mm | Reference/background |
| 10–13 | Various reds | 0.50 mm | Border, title block |
| 30–33 | Various oranges | 0.35 mm | Storm sewer |
| 40–43 | Various browns | 0.25 mm | Earthwork, grading |
| 250–253 | Dark grays | 0.09 mm | Screening, halftone |

The exact assignments are firm-specific. Document them in a reference sheet that accompanies the CTB file.

## Lineweight by element type

When designing a lineweight standard, start from the element types rather than colors:

| Element | Recommended weight | Reasoning |
|---|---|---|
| Sheet border | 0.50 mm–0.70 mm | Frames the drawing; must be the heaviest line |
| Title block lines | 0.35 mm–0.50 mm | Prominent but not as heavy as outer border |
| Section cut marks | 0.35 mm–0.50 mm | Distinguish cut plane from surrounding linework |
| Road centerlines | 0.35 mm | Primary design feature |
| Property / ROW lines | 0.35 mm | Legal significance; must stand out |
| Building outlines | 0.35 mm | Primary feature on site plans |
| Major contours | 0.25 mm | Readable but not dominant |
| Minor contours | 0.18 mm | Background terrain data |
| Utility lines | 0.25 mm | Standard weight for infrastructure |
| Lot lines | 0.25 mm | Standard weight |
| Dimension lines | 0.13 mm | Thin, subordinate to the features they measure |
| Leaders and callouts | 0.13 mm–0.18 mm | Annotation, not primary geometry |
| Hatch patterns | 0.09 mm–0.13 mm | Fill patterns should not overpower linework |
| Text (general) | 0.18 mm–0.25 mm | Legible at plot scale |
| Match lines | 0.50 mm | Must be visible for sheet navigation |

## Lineweight in STB mode

In an STB workflow, lineweights are assigned by named plot style rather than by color. Define named styles such as:

- `Fine` — 0.13 mm
- `Medium` — 0.25 mm
- `Heavy` — 0.35 mm
- `Border` — 0.50 mm

Assign the appropriate style to each layer. The screen color is then free to serve any purpose (discipline coding, feature highlighting) without affecting the print weight.

## Testing lineweights

Before finalizing a CTB or lineweight standard, plot a test sheet:

1. Create a drawing with sample linework at every assigned color/weight.
2. Label each line with its intended weight and ACI color.
3. Plot on the target device at full size.
4. Verify that the visual hierarchy is clear, fine lines are not invisible, and heavy lines are not blotchy.
5. Adjust values as needed. Some plotters have minimum reproducible lineweights (often 0.10 mm to 0.13 mm); lines below that threshold may not appear.

## Related

- [CTB vs STB](ctb-vs-stb.md)
- [Plotting quick reference](plotting-quick-reference.md)
- [Layer keys (properties)](../cad-layer-standards/layer-keys.md)
- [Common plotting issues](common-plotting-issues.md)
