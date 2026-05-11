---
title: "IFC 4.3 for Infrastructure"
section: "civil3d/interop"
order: 40
visibility: public
tags: [ifc, ifc4.3, bim, infrastructure, alignment, road, rail, bridge, civil3d]
appliesTo: [ifc-4.0, ifc-4.3, civil3d-2024, civil3d-2025]
updated: 2026-05-11
---

> **TL;DR**
> 1. **IFC 4.3 ADD2** is the first IFC release with first-class infrastructure entities: `IfcAlignment`, `IfcRoad`, `IfcRail`, `IfcBridge`, `IfcMarineFacility`, plus the geometry primitives `IfcCompositeCurve`, `IfcGradientCurve`, `IfcSegmentedReferenceCurve`, and `IfcTriangulatedIrregularNetwork` (TIN as a native IFC entity).
> 2. Civil 3D's IFC export (introduced in 2024, expanded in 2025) supports **alignments, profiles, corridors-as-IfcRoad, surfaces (as IfcGeographicElement with IfcTriangulatedIrregularNetwork), and pipe networks (as IfcDistributionElement)**. It does **not** export Civil 3D-specific styles, parcels (as IfcSpatialZone), or pressure networks.
> 3. The alignment representation in IFC 4.3 is structurally similar to LandXML's `<Alignment>` (horizontal `IfcCompositeCurve`, vertical `IfcGradientCurve`), but IFC adds a *spatial structure* hierarchy (`IfcProject` → `IfcSite` → `IfcRoad` → `IfcRoadPart`) that LandXML lacks.

## What changed in 4.3

IFC 4.0 (2013) had `IfcAlignment` but only as a placement curve, not a buildable element. IFC 4.3 (published 2024 as ISO 16739-1:2024) made these additions material to civil work:

| Entity | Purpose |
|---|---|
| `IfcAlignment` | A persistent alignment with horizontal + vertical + cant children |
| `IfcAlignmentHorizontal`, `IfcAlignmentVertical`, `IfcAlignmentCant` | Sub-alignments; cant only used in rail |
| `IfcAlignmentSegment` | One geometric segment (line, circular arc, clothoid, etc.) |
| `IfcCompositeCurve` (existing) | Container of segments |
| `IfcGradientCurve` (new in 4.3) | Vertical-curve container |
| `IfcSegmentedReferenceCurve` (new) | Re-parameterizable composite (rail use) |
| `IfcRoad`, `IfcRail`, `IfcBridge`, `IfcMarineFacility`, `IfcTunnel` | Spatial-structure facility types |
| `IfcRoadPart`, `IfcRailPart`, `IfcBridgePart` | Subdivisions of a facility |
| `IfcTriangulatedIrregularNetwork` | TIN surface as native IFC geometry |
| `IfcReferent` | Stationing reference points along an alignment |
| `IfcEarthworksFill`, `IfcEarthworksCut` | Excavation / fill volumes |
| `IfcPavement`, `IfcKerb` | Cross-section components |

Spirals are encoded as `IfcClothoid`, `IfcCosineSpiral`, `IfcSineSpiral`, `IfcCubic`, `IfcSecondOrderPolynomialSpiral`, etc. — a richer set than LandXML's enumeration.

## Civil 3D 2024/2025 IFC support

The export workflow lives at `Output → Export → IFC` (the legacy `IFCEXPORT` works for buildings; civil entities use the newer ribbon command). Settings:

- **MVD (model view definition)**: choose `IFC4X3 Reference View` for cross-vendor coordination, `IFC4X3 Design Transfer View` only when sending to a recipient who will edit. Civil 3D's writer is closer to a Reference View in practice.
- **Object filter** — by category (Alignment, Profile, Surface, Corridor, Pipe Network, Pressure Network).
- **Unit override** — independent of drawing units; commonly forced to metric for international projects.
- **Property set mapping** — Civil 3D properties (e.g. surface `Maximum Triangle Length`) are exported as `IfcPropertySet` with name `Pset_CivilSurface_Civil3D` (proprietary set; not standardized).

What gets generated, by Civil 3D object:

| Civil 3D object | IFC 4.3 entity |
|---|---|
| Alignment | `IfcAlignment` with `IfcAlignmentHorizontal` |
| Profile (PVI layout) | `IfcAlignmentVertical` linked to parent `IfcAlignment` |
| Surface (TIN) | `IfcGeographicElement` with `IfcShapeRepresentation` ⇒ `IfcTriangulatedIrregularNetwork` |
| Corridor | `IfcRoad` containing `IfcRoadPart`s; baseline → `IfcAlignment`; assemblies → `IfcSweptDiskSolid` along stations |
| Pipe (gravity) | `IfcDistributionElement` (subtype `IfcPipeSegment`) with `IfcSweptDiskSolid` |
| Structure | `IfcDistributionFlowElement` (subtype `IfcDistributionChamberElement`) |
| Pressure pipe | not exported (use industry-foundation extension, or LandXML pressure-pipe ext for Civil 3D ↔ Civil 3D) |
| Parcel | not exported |
| Survey point | `IfcReferent` (only along an alignment), otherwise dropped |

## Inspecting an IFC file

IFC is text-based STEP-21 (ISO 10303-21), not XML. A snippet from an IFC 4.3 alignment file:

```step
#42=IFCPROJECT('1mZ2x...','Demo Road',$,$,$,$,$,(#43,#44),#41);
#100=IFCALIGNMENT('2nB...','Mainline CL',$,$,$,#101,#150,$,.NOTDEFINED.);
#101=IFCAXIS2PLACEMENT3D(#10,$,$);
#150=IFCPRODUCTDEFINITIONSHAPE($,$,(#151));
#151=IFCSHAPEREPRESENTATION(#102,'Axis','Curve3D',(#160));
#160=IFCCOMPOSITECURVE((#161,#162,#163),.F.);
#161=IFCALIGNMENTSEGMENT(...);
```

Useful free viewers: **BIMcollab Zoom** (free tier, 4.3 compliant since 2024), **Solibri Anywhere** (read-only), **xBIM Xplorer**. Avoid Navisworks for IFC 4.3 — its parser still degrades 4.3 alignment to 4.0 placement curves.

## Common pitfalls

- **"Civil 3D 2024 won't export alignment to IFC."** The 2024 release exports alignments only when the IFC version is set to `IFC4X3` (not `IFC4` or `IFC2X3`). The dropdown defaults to `IFC4`; switch it.
- **"Surface exports but is missing in Solibri."** Solibri until v9.13.4 ignored `IfcGeographicElement`; it expects surfaces to be children of an `IfcSite`. Civil 3D's exporter places them under the project root. Workaround: post-process with the open-source `IfcOpenShell` to re-parent.
- **"Corridor exported but cross sections are flat."** Subassemblies that use Civil 3D conditional logic (e.g. daylight links) export as their *evaluated* geometry only, frozen at that station. Editing the recipient IFC has no effect on the assembly logic.
- **Coordinate origin offset by 1e6.** IFC files prefer local coordinates near the origin for floating-point precision. Civil 3D 2025 added an "IfcMapConversion" that records the survey-point offset; older versions write absolute state-plane coordinates and many viewers crash trying to render geometry that far from origin.
- **"Pipe diameter wrong."** IFC encodes pipe geometry as `IfcSweptDiskSolid` with `Radius` (not `Diameter`). Make sure the recipient is reading radius.

## Sources

- buildingSMART, *IFC 4.3 ADD2 Specification*, [https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/), 2024.
- ISO 16739-1:2024, *Industry Foundation Classes (IFC) for data sharing in the construction and facility management industries*.
- buildingSMART, *Infra Room IFC alignment-based deliverables*.
- Autodesk Civil 3D 2024/2025 release notes, IFC 4.3 export sections.
