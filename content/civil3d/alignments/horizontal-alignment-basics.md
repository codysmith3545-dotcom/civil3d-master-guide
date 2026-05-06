---
title: "Horizontal Alignment Basics"
section: "civil3d/alignments"
order: 10
visibility: public
tags: [alignment, horizontal, line, curve, spiral, stationing]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEALIGNMENT, CREATEALIGNMENTLAYOUT, EDITGEOMETRY]
updated: 2026-05-06
---

> **TL;DR**
> 1. A Civil 3D alignment is a series of **lines** (tangents), **circular curves**, and (optionally) **spirals** that define a horizontal path with continuous stationing. It is the backbone of profiles, corridors, and plan production.
> 2. Each sub-entity is classified as **Fixed** (fully constrained by input geometry), **Float** (one end free to move so it stays tangent to an adjacent entity), or **Free** (both ends float to maintain tangency). Understanding this system is essential for controlled editing.
> 3. Curves are defined by direction of curvature: **clockwise (CW)** or **counterclockwise (CCW)** relative to the alignment's stationing direction. This affects superelevation and offset alignment behavior.

## What an alignment represents

An alignment is a 2D horizontal path. In road design it represents the road centerline; in utility design, the pipe run; in surveying, a boundary or traverse line. The alignment carries a station value along its length, starting at a user-defined Station 0+00 (or other start station).

Alignments are Civil 3D objects, not simple polylines. They support:

- Design criteria checking against AASHTO or custom standards.
- Profiles (vertical design) and profile views.
- Corridor assembly attachment for 3D roadway modeling.
- Plan production sheet layouts with automatic match lines and station references.
- Dynamic relationships to offset alignments, sample lines, and pipe networks.

## Sub-entity types

Every alignment is a chain of sub-entities. The three fundamental geometric types are:

### Lines (tangents)

Straight segments defined by a start point and end point, or by a direction and length. In road design, these are the tangent runs between curves.

### Circular curves

Arcs of constant radius connecting two tangents. Defined by radius, curve direction (CW or CCW), and one or more of: length, delta angle, chord, tangent length, mid-ordinate, or external distance.

### Spirals

Transition curves with linearly varying curvature (typically Euler spirals / clothoids). Spirals ease the transition from a tangent (infinite radius) to a circular curve (finite radius). Civil 3D supports multiple spiral types: clothoid, Bloss, sinusoidal, and others. AASHTO design practice requires spirals on high-speed roadways.

## Fixed, Float, and Free entities

When you draw alignment sub-entities in the layout tools, each entity has a constraint classification:

| Type | Constraint | Behavior on edit |
|---|---|---|
| **Fixed** | Fully defined by its own parameters (start point, end point, radius, etc.) | Does not move when neighbors are edited |
| **Float** | One end is free; maintains tangency to one adjacent entity | Adjusts its free end to stay tangent when the adjacent entity changes |
| **Free** | Both ends are free; maintains tangency to both adjacent entities | Adjusts both ends when either neighbor changes |

A typical layout workflow: place **fixed tangents** at key control points, then insert **free curves** between them so the curves adjust automatically as you refine the tangent positions.

When a float or free entity cannot satisfy its tangency constraint (e.g., the adjacent tangents diverge beyond the possible radius), the alignment breaks. Civil 3D flags the violation in the Geometry Editor.

## Clockwise vs counterclockwise curves

Curve direction matters for:

- **Superelevation**: a CW curve in the alignment's stationing direction banks one way; CCW banks the other. Superelevation calculations use the curve direction to determine which side of the road is high.
- **Offset alignments**: a curve's inside and outside are defined by its CW/CCW orientation relative to the alignment direction.
- **Station equations**: the alignment's start-to-end direction establishes the stationing direction. Reversing the direction inverts all CW/CCW designations.

In the alignment layout tools, the curve direction is set by the order in which you pick points or by the direction you drag the grip.

## Alignment properties

Key properties (right-click alignment > Alignment Properties):

- **Start station**: the station value at the first entity's start point. Default is 0+00.000.
- **Station index increment**: usually 100 ft for imperial, 1000 m for metric.
- **Design speed**: reference speed for design criteria checks.
- **Design criteria file**: XML file containing minimum radius, spiral length, and other AASHTO or custom standards.
- **Style and label set**: control display and annotation.

## Related

- [Alignment creation tools](alignment-creation-tools.md)
- [Design criteria and check sets](design-criteria.md)
- [Editing alignments](editing-alignments.md)
- [Stationing equations](stationing-equations.md)
