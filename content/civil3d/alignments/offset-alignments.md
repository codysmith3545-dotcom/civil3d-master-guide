---
title: "Offset Alignments"
section: "civil3d/alignments"
order: 25
visibility: public
tags: [alignment, offset, edge-of-pavement, row, widening]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEOFFSETALIGNMENT, EDITOFFSETALIGNMENT]
updated: 2026-05-06
---

> **TL;DR**
> 1. An offset alignment is dynamically linked to a parent alignment. Move the parent and the offset follows. Create with `CREATEOFFSETALIGNMENT` and specify a constant or variable offset distance.
> 2. Use offset alignments for edge of pavement, right-of-way lines, curb lines, sidewalk edges, and utility offsets. They carry their own stationing (inherited from the parent) and can host profiles.
> 3. Variable offsets (widenings) are defined by station-offset pairs in the Offset Alignment Properties. Use them for turn lanes, tapers, and intersection flares.

## Creating an offset alignment

1. Home ribbon > Alignment > Create Offset Alignment, or `CREATEOFFSETALIGNMENT`.
2. Select the parent alignment.
3. Enter the offset distance. Positive values offset to the right (in the alignment's stationing direction); negative values offset to the left.
4. Name the offset alignment (e.g., `CL-MAIN ST - RT EP` for right edge of pavement).
5. Set the style and label set.
6. OK. The offset alignment appears parallel to the parent.

You can create multiple offsets from the same parent in a single command invocation by entering additional offset values before pressing Enter to finish.

## Dynamic updates

Offset alignments update automatically when the parent alignment changes:

- Moving a tangent on the parent shifts the offset's corresponding tangent.
- Changing a curve radius on the parent recalculates the offset's curve (the offset curve has its own radius: parent radius +/- offset distance).
- Adding or removing entities on the parent propagates to the offset.

This dynamic link is the primary advantage over manually drawing a parallel polyline: no redrawing when the design changes.

## Variable offsets (widenings)

For roads that change width (turn lanes, tapers, road widenings), define a variable offset:

1. Right-click the offset alignment > Offset Alignment Properties.
2. In the Widening tab, add station-offset pairs:
   - Start station and start offset (e.g., Sta 10+00, Offset 12.00 ft).
   - End station and end offset (e.g., Sta 12+00, Offset 18.00 ft — a 6 ft widening over 200 ft).
3. Civil 3D interpolates linearly between the pairs.
4. Multiple widenings can be stacked along the alignment.

Widenings can also be specified as transitions:

- **Linear** — constant rate of change.
- **Taper** — defined by a taper rate (e.g., 15:1, meaning 1 ft of offset change per 15 ft of station).

## Offset alignment profiles

Offset alignments can host their own profiles. This is useful for:

- Designing a gutter profile that differs from the centerline profile (e.g., cross-slope creates an elevation difference).
- Creating a ROW profile for grading design beyond the corridor.
- Modeling a median edge with independent vertical geometry.

To create a profile on an offset alignment, use the same `CREATEPROFILE` workflow as on any alignment. The profile samples the existing ground along the offset path.

## Common uses

| Offset alignment for | Typical offset (imperial) | Notes |
|---|---|---|
| Edge of pavement (2-lane) | 12 ft (one lane width) | From centerline to pavement edge |
| Edge of pavement (4-lane divided) | 24 ft or per typical section | May vary with widenings at intersections |
| Right-of-way | 30 ft, 40 ft, 50 ft (varies) | Per plat or ROW plan |
| Curb line | Pavement width + gutter offset | Often 0.5 ft to 1.5 ft from EP |
| Sidewalk | ROW offset or 5 ft from curb face | Per local ordinance |

## Editing offset alignments

- **Change constant offset**: Offset Alignment Properties > adjust the nominal offset value.
- **Add/edit widenings**: Offset Alignment Properties > Widening tab.
- **Grip editing**: grip-drag is not available on offset alignments because they are constrained to the parent. Edit the parent instead.
- **Delete**: deleting an offset alignment does not affect the parent. Deleting the parent orphans the offset (it becomes a static alignment at its last computed geometry).

## Related

- [Horizontal alignment basics](horizontal-alignment-basics.md)
- [Alignment creation tools](alignment-creation-tools.md)
- [Alignment labels and tables](alignment-labels.md)
- [Editing alignments](editing-alignments.md)
