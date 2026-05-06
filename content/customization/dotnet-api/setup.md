---
title: ".NET Plugin Setup"
section: "customization/dotnet-api"
order: 10
visibility: public
tags: [dotnet, csharp, visual-studio, objectarx, civil3d-sdk, plugin, setup]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Autodesk Civil 3D .NET Developer's Guide"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=Civil3D_Developer_Guide
    verified: 2026-05-06
  - title: "Autodesk ObjectARX SDK Downloads"
    url: https://www.autodesk.com/developer-network/platform-technologies/autocad/objectarx
    verified: 2026-05-06
---

> **TL;DR**
> 1. Create a **Class Library** project in Visual Studio targeting the correct .NET version for your Civil 3D release (see [version table](version-to-net-target.md)): .NET Framework 4.8 for Civil 3D 2022-2025, .NET 8 for 2026.
> 2. Reference the Civil 3D DLLs (AcMgd.dll, AcDbMgd.dll, AcCoreMgd.dll, AeccDbMgd.dll, AeccRuntimeMgd.dll) and set **CopyLocal = false** for all of them.
> 3. The NuGet packages `Autodesk.AutoCAD.Sdk` and `Autodesk.Civil3D.Sdk` (available from the Autodesk NuGet feed) simplify reference management for 2024+.

## Prerequisites

- **Visual Studio** 2022 (Community edition is sufficient). Install the ".NET desktop development" workload.
- **Civil 3D** installed on the development machine (required for the DLLs and for testing).
- **ObjectARX SDK** (optional but recommended) — provides header files, samples, and documentation. Download from Autodesk Developer Network.

## Creating the project

### For Civil 3D 2022-2025 (.NET Framework 4.8)

1. File > New > Project > Class Library (.NET Framework).
2. Name the project (e.g., `MyC3DPlugin`).
3. Set the target framework to **.NET Framework 4.8**.

### For Civil 3D 2026+ (.NET 8)

1. File > New > Project > Class Library (targeting .NET 8.0).
2. Civil 3D 2026 moved to .NET 8 (the first version to leave .NET Framework). The project file should specify `<TargetFramework>net8.0-windows</TargetFramework>`.

## Adding references

### Manual references (all versions)

Add references to DLLs from the Civil 3D installation directory (typically `C:\Program Files\Autodesk\AutoCAD 20xx\`):

| DLL | Purpose |
|---|---|
| AcMgd.dll | AutoCAD managed wrapper (Application, Document, Editor) |
| AcDbMgd.dll | AutoCAD database objects (Entity, BlockTableRecord, etc.) |
| AcCoreMgd.dll | Core runtime (required for 2013+) |
| AeccDbMgd.dll | Civil 3D database objects (Alignment, Surface, Profile, etc.) |
| AeccRuntimeMgd.dll | Civil 3D runtime (CivilApplication, CivilDocument) |

For every referenced DLL, set **Copy Local = false** in the reference properties. These DLLs are already loaded by Civil 3D at runtime; copying them into your output folder causes version conflicts.

### NuGet packages (2024+)

Autodesk publishes NuGet packages that bundle the correct DLLs:

```xml
<PackageReference Include="Autodesk.AutoCAD.Sdk" Version="25.0.0" />
<PackageReference Include="Autodesk.Civil3D.Sdk" Version="25.0.0" />
```

Add the Autodesk NuGet feed: `https://www.myget.org/F/autodeskapistagingfeed/api/v3/index.json` (or check the current Autodesk developer documentation for the active feed URL). The NuGet packages automatically set CopyLocal = false.

## Project configuration

### Output path

Set the build output path to a convenient location for testing. A common pattern is to output directly to a folder you can NETLOAD from:

```xml
<OutputPath>$(AppData)\Autodesk\ApplicationPlugins\MyPlugin\</OutputPath>
```

### Debug settings

To launch Civil 3D for debugging:

1. Project Properties > Debug.
2. Set "Start external program" to `acad.exe` in the Civil 3D installation folder.
3. Set the command-line arguments if needed (e.g., `/product C3D /language en-US`).
4. Press F5 to build and launch Civil 3D with the debugger attached.

### Assembly signing

Not required for development but recommended for production distribution. Strongly named assemblies prevent version conflicts and are required for some deployment scenarios (GAC, Autodesk App Store).

## Verifying the setup

After building, test:

1. Launch Civil 3D.
2. Type `NETLOAD` at the command line.
3. Browse to the built DLL and load it.
4. Type the command name defined in your `[CommandMethod]` attribute.

If you get a "cannot load" error, check:
- Target framework mismatch (must match Civil 3D's runtime).
- Missing DLL references.
- CopyLocal set to true (causing version conflicts).

## Related

- [Hello world plugin](hello-world.md)
- [Transactions](transactions.md)
- [Version to .NET target table](version-to-net-target.md)
- [Distributing a .NET plugin](distributing.md)
