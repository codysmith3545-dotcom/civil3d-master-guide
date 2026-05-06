---
title: ".NET API for Civil 3D"
section: "customization/dotnet-api"
order: 20
visibility: public
tags: [dotnet, api, customization, programming]
updated: 2026-05-06
---

> **TL;DR**
> 1. Civil 3D's .NET API runs on top of AutoCAD's. Reference both `accoremgd.dll` / `acdbmgd.dll` / `acmgd.dll` (AutoCAD) and `AeccDbMgd.dll` / `AeccPressurePipesMgd.dll` (Civil 3D) — these live in the install folder.
> 2. The Civil 3D managed namespace is `Autodesk.Civil.DatabaseServices` (alignments, surfaces, profiles, corridors, etc.). Most objects need to be opened in a **transaction**.
> 3. Build target: **netframework** matching the Civil 3D version (e.g., .NET Framework 4.8 for 2022–2025). Civil 3D 2026 moved to .NET 8 — verify before targeting.

## Pages

- [Setup: Visual Studio + references](setup.md)
- [Hello World plugin (NETLOAD)](hello-world.md)
- [Transactions and database basics](transactions.md)
- [Working with Civil 3D objects (alignment, surface, profile)](working-with-objects.md)
- [Adding a ribbon button](adding-ribbon-button.md)
- [Distributing a plugin](distributing.md)
- [Civil 3D version → .NET target table](version-to-net-target.md)

## Related

- [LISP](../lisp/index.md)
- [Dynamo](../dynamo/index.md)
