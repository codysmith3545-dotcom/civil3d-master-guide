---
title: "Transaction Model"
section: "customization/dotnet-api"
order: 20
visibility: public
tags: [dotnet, csharp, transaction, database, open-for-read, open-for-write, commit]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "AutoCAD .NET Developer's Guide — Transactions"
    url: https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-D793A8B1-CD73-4BA3-8D51-6A0A8E2F5F03
    verified: 2026-05-06
  - title: "Autodesk Civil 3D .NET Developer's Guide"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=Civil3D_Developer_Guide
    verified: 2026-05-06
---

> **TL;DR**
> 1. All database access in AutoCAD/.NET must go through a **Transaction**. Call `db.TransactionManager.StartTransaction()`, open objects with `tr.GetObject()`, and call `tr.Commit()` when done. If you do not commit, all changes are rolled back.
> 2. Open objects **ForRead** when you only need to inspect them, and **ForWrite** when you need to modify them. Opening ForWrite when ForRead suffices wastes resources and can cause unnecessary undo records.
> 3. Always wrap transactions in a `using` block so the transaction is disposed even if an exception occurs.

## Basic pattern

```csharp
using (Transaction tr = db.TransactionManager.StartTransaction())
{
    // Open objects
    BlockTable bt = tr.GetObject(db.BlockTableId, OpenMode.ForRead) as BlockTable;
    BlockTableRecord ms = tr.GetObject(bt[BlockTableRecord.ModelSpace],
        OpenMode.ForWrite) as BlockTableRecord;

    // Create a new line
    Line line = new Line(new Point3d(0, 0, 0), new Point3d(100, 100, 0));
    ms.AppendEntity(line);
    tr.AddNewlyCreatedDBObject(line, true);

    // Commit — saves all changes
    tr.Commit();
}
// Transaction is disposed here; if Commit() was not called, changes are rolled back
```

## Why transactions are required

The AutoCAD database uses a transactional model for several reasons:

- **Undo integration** — committed transactions become undo steps. If the user types `UNDO`, the entire transaction is reversed.
- **Object lifecycle management** — the transaction tracks which objects are open and ensures they are properly closed.
- **Thread safety** — transactions serialize access to the database.
- **Error recovery** — if your code throws an exception before Commit(), all changes are automatically rolled back, leaving the drawing in a consistent state.

## OpenMode: ForRead vs ForWrite

| Mode | Purpose | Undo record | Lock |
|---|---|---|---|
| ForRead | Inspect properties, read geometry | No | Shared (multiple readers OK) |
| ForWrite | Modify properties, change geometry | Yes | Exclusive |
| ForNotify | Internal use (rare) | No | — |

**UpgradeOpen()** — if you opened an object ForRead and later discover you need to modify it, call `obj.UpgradeOpen()` instead of re-opening it. This promotes the lock from shared to exclusive.

**DowngradeOpen()** — the reverse; demote from write to read after modifications are done (rarely needed).

## Nested transactions

Transactions can be nested. A nested transaction committed inside an outer transaction does not actually persist until the outer transaction commits:

```csharp
using (Transaction outerTr = db.TransactionManager.StartTransaction())
{
    // ... outer work ...

    using (Transaction innerTr = db.TransactionManager.StartTransaction())
    {
        // ... inner work ...
        innerTr.Commit();
        // Inner changes are tentative until outer commits
    }

    outerTr.Commit();
    // Now both inner and outer changes are persisted
}
```

If the outer transaction is aborted (not committed), the inner transaction's changes are also rolled back. Nested transactions are useful for isolating subtasks that may fail independently.

## Error handling

Always use `using` blocks and try/catch:

```csharp
using (Transaction tr = db.TransactionManager.StartTransaction())
{
    try
    {
        // ... do work ...
        tr.Commit();
    }
    catch (System.Exception ex)
    {
        ed.WriteMessage($"\nError: {ex.Message}");
        // Transaction auto-aborts on dispose without Commit()
    }
}
```

Do not call `tr.Abort()` explicitly unless you have a specific reason — the `using` block handles disposal, and an uncommitted transaction is automatically aborted on dispose.

## Common mistakes

- **Forgetting Commit()** — all changes silently disappear. The code runs without error but nothing changes in the drawing.
- **Opening ForWrite unnecessarily** — creates undo records for objects you never modified.
- **Using an object after the transaction is disposed** — the object reference becomes invalid. If you need data outside the transaction, copy it to local variables before the transaction ends.
- **Not adding new objects to the transaction** — if you create a new entity and append it to model space, you must also call `tr.AddNewlyCreatedDBObject(entity, true)`. Forgetting this causes a crash or orphaned object.

## Transaction alternatives

- **OpenCloseTransaction** — a lightweight alternative that uses `Open()`/`Close()` semantics instead of `GetObject()`. Slightly faster for simple read operations but does not participate in undo. Use sparingly and only when you do not modify objects.
- **Direct Open/Close** — `id.Open(OpenMode.ForRead)` without a transaction. Not recommended; it bypasses undo integration and error recovery.

## Related

- [Hello world plugin](hello-world.md)
- [Working with Civil 3D objects](working-with-objects.md)
- [.NET plugin setup](setup.md)
