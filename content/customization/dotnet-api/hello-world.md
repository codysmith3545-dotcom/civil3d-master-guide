---
title: "Hello World .NET Plugin"
section: "customization/dotnet-api"
order: 15
visibility: public
tags: [dotnet, csharp, hello-world, commandmethod, netload, plugin]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Autodesk Civil 3D .NET Developer's Guide"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=Civil3D_Developer_Guide
    verified: 2026-05-06
---

> **TL;DR**
> 1. A minimal plugin is one class with one method decorated with **[CommandMethod("HELLO")]**. Build the DLL, type **NETLOAD** in Civil 3D to load it, then type **HELLO** to run.
> 2. Use **Editor.WriteMessage()** to print output to the command line. Use **Application.DocumentManager.MdiActiveDocument** to get the current document.
> 3. The build-load-test cycle is: edit code in VS, build (Ctrl+Shift+B), switch to Civil 3D, NETLOAD (first time), run command. Subsequent builds may require restarting Civil 3D since DLLs are locked.

## Minimal plugin code

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;

namespace MyC3DPlugin
{
    public class Commands
    {
        [CommandMethod("HELLO")]
        public void HelloWorld()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Editor ed = doc.Editor;
            ed.WriteMessage("\nHello from Civil 3D .NET plugin!");
        }
    }
}
```

### What each line does

- `using Autodesk.AutoCAD.ApplicationServices` — access to the Application and Document objects.
- `using Autodesk.AutoCAD.EditorInput` — access to the Editor for command-line I/O.
- `using Autodesk.AutoCAD.Runtime` — the `[CommandMethod]` attribute.
- `[CommandMethod("HELLO")]` — registers the method as a command. The user types `HELLO` at the command line.
- `Application.DocumentManager.MdiActiveDocument` — the currently active drawing.
- `doc.Editor` — the command-line editor object for the document.
- `ed.WriteMessage(...)` — prints text to the command line.

## Building and loading

1. Build the project in Visual Studio (Ctrl+Shift+B or Build > Build Solution).
2. Open Civil 3D (or switch to it if already open).
3. Type `NETLOAD` at the command line.
4. Browse to the output folder and select `MyC3DPlugin.dll`.
5. Type `HELLO` at the command line.
6. The message "Hello from Civil 3D .NET plugin!" appears on the command line.

## Accessing the database

To read or modify drawing objects, you need the database and a transaction:

```csharp
using Autodesk.AutoCAD.DatabaseServices;

[CommandMethod("COUNTLINES")]
public void CountLines()
{
    Document doc = Application.DocumentManager.MdiActiveDocument;
    Database db = doc.Database;
    Editor ed = doc.Editor;

    int count = 0;
    using (Transaction tr = db.TransactionManager.StartTransaction())
    {
        BlockTable bt = tr.GetObject(db.BlockTableId, OpenMode.ForRead)
            as BlockTable;
        BlockTableRecord ms = tr.GetObject(bt[BlockTableRecord.ModelSpace],
            OpenMode.ForRead) as BlockTableRecord;

        foreach (ObjectId id in ms)
        {
            Entity ent = tr.GetObject(id, OpenMode.ForRead) as Entity;
            if (ent is Line)
                count++;
        }
        tr.Commit();
    }
    ed.WriteMessage($"\nFound {count} lines in model space.");
}
```

This pattern — get document, get database, start transaction, open objects, commit — is the foundation of all .NET plugin work. See [Transactions](transactions.md) for details.

## Accessing Civil 3D objects

```csharp
using Autodesk.Civil.ApplicationServices;
using Autodesk.Civil.DatabaseServices;

[CommandMethod("LISTALIGNMENTS")]
public void ListAlignments()
{
    Document doc = Application.DocumentManager.MdiActiveDocument;
    Editor ed = doc.Editor;
    CivilDocument civDoc = CivilDocument.GetCivilDocument(doc.Database);

    using (Transaction tr = doc.Database.TransactionManager.StartTransaction())
    {
        ObjectIdCollection alignIds = civDoc.GetAlignmentIds();
        foreach (ObjectId id in alignIds)
        {
            Alignment al = tr.GetObject(id, OpenMode.ForRead) as Alignment;
            ed.WriteMessage($"\n{al.Name}  Length={al.Length:F2}");
        }
        tr.Commit();
    }
}
```

## DLL locking issue

Once a DLL is loaded via NETLOAD, it is locked by the Civil 3D process. You cannot overwrite it with a new build without closing Civil 3D. Workarounds:

- Close and restart Civil 3D between builds (tedious but reliable).
- Use the `IExtensionApplication` interface with demand-loading so you can use `NETLOAD` only once per session, then rely on auto-loading.
- During active development, some developers use a "proxy loader" pattern that loads the actual DLL from a shadow copy location.

## Related

- [.NET plugin setup](setup.md)
- [Transactions](transactions.md)
- [Working with Civil 3D objects](working-with-objects.md)
- [Version to .NET target table](version-to-net-target.md)
