---
title: "Coordinate Systems, Datums, Projections"
section: "field-and-boundary/coordinate-systems"
order: 80
visibility: public
tags: [coordinate-system, datum, projection, state-plane, geoid, nad83]
updated: 2026-05-06
---

> **TL;DR**
> 1. **Datum** = the reference frame (NAD83, NAD83(2011), NAD27, WGS84, ITRF…). **Projection** = how the curved earth gets flattened (state plane, UTM, transverse Mercator…). **Geoid** = the surface that defines orthometric height (Geoid18 is current US).
> 2. Indiana uses **State Plane Indiana East (FIPS 1301)** and **Indiana West (FIPS 1302)** in NAD83 (and NAD83(2011) for newer work). Both are transverse Mercator. The county line is **east of US-31** roughly — the actual boundary is published per county.
> 3. **Combined scale factor** = grid scale × elevation factor. Multiply ground distances by 1/CSF to get grid; multiply grid by CSF to get ground.

## Pages

- [Datums and projections explained](datums-and-projections.md)
- [State Plane Indiana East/West quick reference](state-plane-indiana-quick-reference.md)
- [NAD83 vs NAD83(2011) vs WGS84](nad83-vs-2011-vs-wgs84.md)
- [Geoid models and orthometric vs ellipsoid heights](geoid-and-heights.md)
- [Combined scale factor (ground vs grid)](combined-scale-factor.md)
- [Setting Civil 3D's coordinate system](setting-civil3d-cs.md)
- [Local-grid systems (low-distortion projections)](low-distortion-projections.md)
- [Transforming between systems](transforming-coordinates.md)
- [NSRS modernization (2022/2025) — what changes](nsrs-modernization.md)

## Related

- [Survey in Civil 3D](../../civil3d/survey/index.md)
- [Indiana state plane scale calculator](/tools/state-plane-scale)
