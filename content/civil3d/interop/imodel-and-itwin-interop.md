---
title: "iModel and iTwin Interoperability"
section: "civil3d/interop"
order: 50
visibility: public
tags: [imodel, itwin, bentley, interop, federated-model, surveyors]
appliesTo: [civil3d-2024, civil3d-2025, itwin-platform]
updated: 2026-05-11
---

> **TL;DR**
> 1. **iModel** is Bentley's proprietary container format (a SQLite database with the `.bim` extension) that snapshots BIM data — geometry, properties, and the EC schema describing them. **iTwin** is the cloud platform that hosts iModels and federates them with reality data, GIS layers, and IoT.
> 2. Surveyors and Civil 3D users hit iTwin/iModel when working with **state DOTs that have standardized on Bentley** (Indiana INDOT publishes some deliverables via ProjectWise + iTwin), or when delivering survey data into a federated DOT/owner model.
> 3. Civil 3D cannot read or write `.bim` files directly. The supported handoff is via **IFC 4.3** or **LandXML**; iTwin Synchronizer ingests both, with IFC 4.3 the better fidelity.

## What an iModel actually is

An iModel is a SQLite file with a fixed set of tables backed by Bentley's "EC" (Entity-Class) data model. It carries:

- Geometric primitives in Bentley's BRep/mesh format (not STEP, not IFC).
- The schema (EC) declaring classes and properties.
- Element-by-element change history (ChangeSets), which is how iTwin syncs deltas.
- Spatial index for sub-second queries against billion-element models.

iModels are produced by Bentley desktop products (OpenRoads, OpenBuildings, MicroStation) directly, or by **iTwin Synchronizer** (free desktop tool) which converts third-party formats (.dwg, .ifc, .nwd, .rvt, .skp, .obj, etc.) into a `.bim` and pushes ChangeSets to an iTwin in the cloud.

## How a Civil 3D shop participates

The realistic delivery paths, in increasing order of fidelity:

1. **DWG → iModel (geometry only).** iTwin Synchronizer reads DWG natively. Civil 3D AECC objects collapse to AutoCAD primitives during this read — alignments become polylines, surfaces become 3D faces. Acceptable for visualization, not for engineering reuse.
2. **DWG with Civil 3D objects exploded → iModel.** Manually `EXPLODEAEC` (or use the Civil 3D Project Explorer's "Export to AutoCAD" workflow) before sync. Same fidelity penalty, but the DWG opens correctly in any AutoCAD-only seat.
3. **LandXML → iTwin Synchronizer.** Synchronizer added LandXML connector support in 2022; alignments and surfaces survive. Profiles partially survive (PVI list yes, vertical curve type sometimes downgraded).
4. **IFC 4.3 → iTwin Synchronizer (preferred).** Best fidelity for alignments + corridors + classification. Civil 3D 2024+ produces compliant 4.3 files; iTwin's IFC connector ingests them and preserves the `IfcAlignment` hierarchy as Bentley `BisCore.Element`.

## When surveyors specifically encounter iTwin

- **DOT projects.** State DOTs adopting Bentley as primary platform (UDOT, MnDOT, INDOT for some districts) increasingly require deliverables published through ProjectWise into an iTwin coordinated by the prime designer. The surveyor's job is to deliver a clean LandXML or IFC of the existing-conditions topo + alignment ties.
- **As-built turnover.** After construction, many owners require an "as-built iTwin" that mirrors the design iTwin. Survey provides as-built point clouds + breakline updates, typically as LAS + LandXML.
- **Reality data.** iTwin federates point clouds (.las/.laz) and reality meshes (3MX, Cesium 3D Tiles) without converting them to .bim — the surveyor's deliverable is a hosted Reality Data ID rather than a file.

## ProjectWise vs iTwin

These often get conflated:

- **ProjectWise** is Bentley's document management system (file vault + check-out/in + workflow). Files inside ProjectWise are the same DWG/IFC/PDF you're used to — ProjectWise just controls access and versioning.
- **iTwin** is the federated 3D model layer above (or independent of) ProjectWise. Files in ProjectWise can be *connected* to an iTwin so changes flow through.

Civil 3D users may have a ProjectWise plug-in installed (`pwwise.arx`); this lets them open/save DWGs through ProjectWise without ever touching iTwin.

## Schema-level interop notes

- `BisCore` is Bentley's base schema. `BisCore.GeometricElement3d` is the parent of every geometric element in an iModel. Civil-specific subclasses live in `RoadRailUnits`, `RoadRailAlignment`, etc.
- iTwin Connector configuration files (`.json`) control how IFC entities map to BisCore classes. The default IFC-4.3 connector mapping is published by Bentley and matches buildingSMART's recommendations for `IfcRoad` ⇒ `RoadRailUnits.Road`.
- Once data is in an iTwin, you query it with the **iTwin REST API** or the open-source **iTwin.js** TypeScript SDK — not via SQL against the `.bim` file directly (which Bentley's EULA does not permit for production use).

## Common pitfalls

- **"My LandXML alignment shows up in iTwin but with no profile."** iTwin Synchronizer's LandXML connector before v2.6 ignored `<Profile>` blocks. Update Synchronizer or send IFC instead.
- **"iModel is enormous after I added the surface."** A Civil 3D surface with > 1M triangles becomes a multi-GB BRep when re-meshed by Synchronizer. Decimate the surface before export, or send the surface as a LAS/LAZ point cloud (iTwin handles point clouds out-of-process and they don't bloat the .bim).
- **"I can't open the .bim file in MicroStation directly."** Correct — iModels are read-only snapshots. To edit, you need to roundtrip through OpenRoads/OpenBuildings against a hosted iModel, applying ChangeSets.
- **"Coordinates are in meters but my Civil 3D drawing is in feet."** iTwin defaults to metric; the IFC `IfcUnitAssignment` is read on import. If your IFC is missing `IfcUnitAssignment` (common in pre-2024 Civil 3D exports), every coordinate is interpreted as the iTwin default. Always verify `IfcUnitAssignment` is present in the IFC before sync.
- **"Survey points come in but every one has the same description."** The iTwin LandXML connector does not read `<CgPoint code="…">`; it reads `<CgPoint desc="…">`. Civil 3D writes both, but if your point group has empty descriptions only the code attribute is populated.

## Sources

- Bentley, *iTwin Platform Documentation*, [https://developer.bentley.com/](https://developer.bentley.com/).
- Bentley, *iTwin Synchronizer User Guide*, [https://docs.bentley.com/](https://docs.bentley.com/).
- Bentley, *BisCore Schema Reference*, public on GitHub at [iTwin/imodel-schemas](https://github.com/iTwin/imodel-schemas).
- ISO 16739-1:2024 (IFC 4.3), bridging spec for iTwin's IFC connector.
