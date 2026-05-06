---
title: "Control Networks & Adjustment"
section: "field-and-boundary/control-networks"
order: 0
visibility: public
tags: [control, network, adjustment, index]
updated: 2026-05-06
---

> **TL;DR**
> 1. A control network is the framework of known positions that every other survey measurement hangs from. Get the control wrong and everything built on it is wrong.
> 2. This section covers network design, traverse types, leveling networks, GNSS static observations, least-squares adjustment concepts, accuracy standards, and site localization.
> 3. For the Civil 3D software mechanics of running an adjustment, see [Network adjustment in Civil 3D](../../civil3d/survey/network-adjustment.md). This section covers the underlying surveying principles.

## Pages in this section

| Page | Description |
|---|---|
| [Network design](network-design.md) | Geometry, redundancy, strength of figure, and planning a network for least-squares adjustment. |
| [Least-squares concepts](least-squares-concepts.md) | What least squares does, observation equations, weighting, statistical tests, and residual interpretation. |
| [Traverse types](traverse-types.md) | Open, closed loop, connecting, and double-run traverses. Adjustment methods and precision requirements. |
| [Level networks](level-networks.md) | Differential leveling networks, loop closures, allowable misclosure, and adjustment methods. |
| [GNSS static](gnss-static.md) | Static GNSS observation for control: session planning, baseline processing, and network adjustment. |
| [Accuracy standards](accuracy-standards.md) | FGDC and ASPRS positional accuracy standards, accuracy classes, and how to compute and report accuracy. |
| [Localization](localization.md) | Site calibration (GNSS localization to local control), when to localize, and how to document it. |

## Why control networks matter

Every survey measurement is relative. A total station angle-and-distance shot is relative to the instrument position and backsight orientation. A GNSS observation is relative to the satellites and the base station or network. The control network is what ties all of these relative measurements to a common, reproducible coordinate system.

A well-designed, properly adjusted control network:

- Provides **consistent coordinates** across the entire project, even when work spans multiple days, crews, or methods.
- Enables **quality checks** through redundancy — extra measurements that reveal blunders and quantify accuracy.
- Creates a **permanent reference** that future surveys can tie back to without repeating the original work.
- Supports **defensible accuracy reporting** required by standards (FGDC, ASPRS) and professional practice.

## Related

- [Survey equipment section](../survey-equipment/index.md)
- [Control for topographic surveys](../topographic-surveys/control-for-topos.md)
- [Network adjustment in Civil 3D](../../civil3d/survey/network-adjustment.md)
- [Coordinate systems](../coordinate-systems/index.md)
