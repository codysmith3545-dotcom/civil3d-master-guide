---
title: "Civil Interoperability and Data Exchange"
section: "civil3d/interop"
order: 130
visibility: public
tags: [interop, landxml, ifc, collada, imodel, point-cloud, exchange]
updated: 2026-05-11
---

> **TL;DR**
> 1. Civil 3D talks to the rest of the AEC world through a small set of exchange formats: **LandXML** (geometry + survey + alignments), **IFC 4.3** (BIM, including infrastructure extensions), **COLLADA / glTF / FBX** (visualization), and proprietary container formats like Bentley **iModel** and Autodesk **AnyCAD**.
> 2. None of these formats round-trip everything. Pick the format whose object coverage matches what you actually need on the other side: alignments + surfaces ⇒ LandXML; full BIM with classification ⇒ IFC; visualization only ⇒ glTF/FBX.
> 3. The single largest source of interop pain is **coordinate systems** (string mismatch, EPSG vs ESRI vs Autodesk codes) and **vertical datums** (NAVD88 vs NGVD29 vs ellipsoidal). Lock these down before you export anything.

## Pages

- [LandXML 2.0 schema overview](landxml-2-0-schema-overview.md)
- [LandXML import and export in Civil 3D](landxml-import-export-civil3d.md)
- [LandXML cross-vendor quirks (Bentley, Trimble, Geopak)](landxml-cross-vendor-quirks.md)
- [IFC 4.3 for infrastructure](ifc-for-infrastructure.md)
- [iModel and iTwin interop](imodel-and-itwin-interop.md)
- [Point cloud formats: LAS, LAZ, E57](point-cloud-formats-las-laz-e57.md)
- [Coordinate-system strings during export](coordinate-system-strings-during-export.md)

## When to use which format

| Need to send… | To… | Use |
|---|---|---|
| Survey points + figures | Trimble Business Center / Leica Infinity | LandXML 1.2 (still widest support) |
| Alignment + profile | Bentley OpenRoads | LandXML 2.0 or IFC 4.3 |
| Surface (TIN) | Almost anything | LandXML; for huge surfaces, also export `.xml` chunk-by-chunk or use IFC's `IfcTriangulatedIrregularNetwork` (4.3) |
| BIM model with classification | Project lead in Revit / Navisworks | IFC 4.3 (or IFC 4.0 if the recipient is older) |
| Visualization / clash-detection only | Navisworks / 3ds Max | FBX or NWC; never use LandXML for this |
| Federated coordination | iTwin / BIM 360 | iModel + IFC overlay; LandXML is not a coordination format |
| Point cloud | Anything | LAZ for archive, LAS 1.4 for working copy, E57 if structured scans + imagery are needed |

## Related

- [Field-and-boundary coordinate systems](../../field-and-boundary/coordinate-systems/index.md)
- [Survey: figure prefix DB](../survey/index.md)
- [Customization: templates and country kits](../../customization/templates-and-kits/index.md)

## Sources

- LandXML 2.0 schema, [landxml.org](http://www.landxml.org/) (specification last published 2008; still the de-facto baseline).
- buildingSMART, *IFC 4.3 ADD2 specification*, [https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/), 2024.
- OGC, *LAS 1.4 Specification*, ASPRS, [https://www.asprs.org/divisions-committees/lidar-division/laser-las-file-format-exchange-activities](https://www.asprs.org/divisions-committees/lidar-division/laser-las-file-format-exchange-activities).
- ASTM E2807-11, *Standard Specification for 3D Imaging Data Exchange (E57)*.
