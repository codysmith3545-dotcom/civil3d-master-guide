---
title: "Working with Civil 3D Objects"
section: "customization/dotnet-api"
order: 25
visibility: public
tags: [dotnet, csharp, civil3d-api, alignment, surface, profile, pipe-network, corridor]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Autodesk Civil 3D .NET Developer's Guide"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=Civil3D_Developer_Guide
    verified: 2026-05-06
---

> **TL;DR**
> 1. Start with **CivilDocument.GetCivilDocument(db)** to access the Civil 3D document wrapper. From there, get collections of alignments, surfaces, profiles, corridors, and pipe networks by their ObjectIdCollections.
> 2. Open each object via the transaction with `tr.GetObject(id, OpenMode.ForRead)` and cast to the Civil 3D type (e.g., `Alignment`, `TinSurface`, `Profile`).
> 3. Modifying Civil 3D objects follows the same pattern as AutoCAD objects: open ForWrite, change properties, commit the transaction.

## Getting the CivilDocument

```csharp
using Autodesk.Civil.ApplicationServices;
using Autodesk.Civil.DatabaseServices;

Document doc = Application.DocumentManager.MdiActiveDocument;
Database db = doc.Database;
CivilDocument civDoc = CivilDocument.GetCivilDocument(db);
```

`CivilDocument` is the entry point to all Civil 3D-specific collections: alignments, surfaces, profiles, sites, pipe networks, corridors, and more.

## Iterating alignments

```csharp
using (Transaction tr = db.TransactionManager.StartTransaction())
{
    ObjectIdCollection alignIds = civDoc.GetAlignmentIds();
    foreach (ObjectId id in alignIds)
    {
        Alignment al = tr.GetObject(id, OpenMode.ForRead) as Alignment;
        ed.WriteMessage($"\nAlignment: {al.Name}");
        ed.WriteMessage($"  Length: {al.Length:F2} ft");
        ed.WriteMessage($"  Start Station: {al.StartingStation:F2}");
        ed.WriteMessage($"  End Station: {al.EndingStation:F2}");
        ed.WriteMessage($"  Layer: {al.Layer}");
        ed.WriteMessage($"  Style: {al.StyleName}");
    }
    tr.Commit();
}
```

### Getting station/offset

```csharp
double station = 0, offset = 0;
al.StationOffset(pointX, pointY, ref station, ref offset);
```

### Getting a point on the alignment

```csharp
double northing = 0, easting = 0;
al.PointLocation(station, offset, ref easting, ref northing);
```

## Working with surfaces

```csharp
ObjectIdCollection surfIds = civDoc.GetSurfaceIds();
foreach (ObjectId id in surfIds)
{
    Surface surf = tr.GetObject(id, OpenMode.ForRead) as Surface;
    ed.WriteMessage($"\nSurface: {surf.Name}");

    if (surf is TinSurface tinSurf)
    {
        ed.WriteMessage($"  Points: {tinSurf.Vertices.Count}");
        ed.WriteMessage($"  Triangles: {tinSurf.Triangles.Count}");
        ed.WriteMessage($"  Min Elevation: {tinSurf.GetGeneralProperties().MinimumElevation:F2}");
        ed.WriteMessage($"  Max Elevation: {tinSurf.GetGeneralProperties().MaximumElevation:F2}");

        // Get elevation at a point
        double elev = tinSurf.FindElevationAtXY(1000.0, 2000.0);
    }
}
```

## Profiles

Profiles are associated with alignments. Access them through the alignment:

```csharp
Alignment al = tr.GetObject(alignId, OpenMode.ForRead) as Alignment;
ObjectIdCollection profIds = al.GetProfileIds();

foreach (ObjectId profId in profIds)
{
    Profile prof = tr.GetObject(profId, OpenMode.ForRead) as Profile;
    ed.WriteMessage($"\n  Profile: {prof.Name}  Type: {prof.ProfileType}");

    // Get elevation at a station
    double elev = prof.ElevationAt(station);
}
```

`ProfileType` distinguishes between existing-ground profiles (from a surface) and layout (design) profiles.

## Pipe networks

```csharp
ObjectIdCollection netIds = civDoc.GetPipeNetworkIds();
foreach (ObjectId netId in netIds)
{
    Network net = tr.GetObject(netId, OpenMode.ForRead) as Network;
    ed.WriteMessage($"\nNetwork: {net.Name}");

    // Iterate pipes
    ObjectIdCollection pipeIds = net.GetPipeIds();
    foreach (ObjectId pipeId in pipeIds)
    {
        Pipe pipe = tr.GetObject(pipeId, OpenMode.ForRead) as Pipe;
        ed.WriteMessage($"\n  Pipe: {pipe.Name}  Diameter: {pipe.InnerDiameterOrWidth:F2}");
        ed.WriteMessage($"    Length: {pipe.Length2D:F2}");
        ed.WriteMessage($"    Slope: {pipe.Slope:F4}");
    }

    // Iterate structures
    ObjectIdCollection structIds = net.GetStructureIds();
    foreach (ObjectId structId in structIds)
    {
        Structure str = tr.GetObject(structId, OpenMode.ForRead) as Structure;
        ed.WriteMessage($"\n  Structure: {str.Name}  Rim: {str.RimElevation:F2}");
    }
}
```

## Creating objects programmatically

### Adding a line to an alignment

```csharp
Alignment al = tr.GetObject(alignId, OpenMode.ForWrite) as Alignment;
AlignmentEntityCollection entities = al.Entities;
// Add a tangent from the last entity
// (Civil 3D entity creation varies by type — refer to the API documentation for specific methods)
```

### Adding points to a surface

```csharp
TinSurface surf = tr.GetObject(surfId, OpenMode.ForWrite) as TinSurface;
Point3dCollection points = new Point3dCollection();
points.Add(new Point3d(1000, 2000, 850));
points.Add(new Point3d(1010, 2010, 851));
surf.AddVertices(points);
```

## Modifying properties

```csharp
Alignment al = tr.GetObject(alignId, OpenMode.ForWrite) as Alignment;
al.Layer = "C-ROAD-CNTR";
al.StyleName = "Proposed";
// Commit the transaction to save changes
```

## Key namespaces

| Namespace | Contents |
|---|---|
| `Autodesk.Civil.ApplicationServices` | CivilApplication, CivilDocument |
| `Autodesk.Civil.DatabaseServices` | Alignment, Surface, Profile, Corridor, Network, Pipe, Structure, Parcel, etc. |
| `Autodesk.Civil.Settings` | Settings objects for units, precision, abbreviations |
| `Autodesk.Civil.Land.DatabaseServices` | Additional surface/parcel objects |

## Related

- [Transactions](transactions.md)
- [Hello world plugin](hello-world.md)
- [Adding a ribbon button](adding-ribbon-button.md)
- [.NET plugin setup](setup.md)
