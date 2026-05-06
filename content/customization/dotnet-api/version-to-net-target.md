---
title: "Civil 3D Version to .NET Target Table"
section: "customization/dotnet-api"
order: 40
visibility: public
tags: [dotnet, version, net-framework, net8, objectarx, compatibility]
appliesTo: [civil3d-2020, civil3d-2021, civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Autodesk ObjectARX SDK Release Notes"
    url: https://www.autodesk.com/developer-network/platform-technologies/autocad/objectarx
    verified: 2026-05-06
  - title: "Autodesk Civil 3D Developer Documentation"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=Civil3D_Developer_Guide
    verified: 2026-05-06
---

> **TL;DR**
> 1. Civil 3D 2020-2025 targets **.NET Framework 4.7 to 4.8**. Civil 3D 2026 is the first version to target **.NET 8**.
> 2. The .NET 8 migration for 2026 is a breaking change — plugins compiled for .NET Framework do not load in 2026 without recompilation and code changes.
> 3. For multi-version support, use conditional compilation or separate project configurations targeting different frameworks.

## Version table

| Civil 3D version | AutoCAD version | ObjectARX version | .NET target | C# version |
|---|---|---|---|---|
| 2020 | 2020 (R23.1) | 2020 | .NET Framework 4.7 | C# 7.3 |
| 2021 | 2021 (R24.0) | 2021 | .NET Framework 4.7.2 | C# 7.3 |
| 2022 | 2022 (R24.1) | 2022 | .NET Framework 4.8 | C# 7.3+ |
| 2023 | 2023 (R24.2) | 2023 | .NET Framework 4.8 | C# 7.3+ |
| 2024 | 2024 (R24.3) | 2024 | .NET Framework 4.8 | C# 7.3+ |
| 2025 | 2025 (R25.0) | 2025 | .NET Framework 4.8 | C# 7.3+ |
| 2026 | 2026 (R25.1) | 2026 | .NET 8 | C# 12 |

## .NET Framework 4.8 era (2022-2025)

Most current plugins target .NET Framework 4.8. A plugin compiled for 4.8 will load in any Civil 3D version from 2022 through 2025 (assuming the ObjectARX API calls are compatible). Key characteristics:

- Windows-only (.NET Framework does not run on Linux/macOS, which is irrelevant for Civil 3D).
- NuGet ecosystem is mature but the framework is in maintenance mode (no new features from Microsoft).
- WinForms and WPF fully supported for plugin UIs.

## .NET 8 migration (2026)

Civil 3D 2026 moved to .NET 8, which is a significant change:

- **Recompilation required** — .NET Framework DLLs cannot load in the .NET 8 runtime.
- **API changes** — some ObjectARX APIs changed signatures or namespaces. Review the migration guide in the 2026 ObjectARX SDK.
- **C# language features** — .NET 8 supports C# 12, enabling pattern matching, records, global usings, and other modern features.
- **Performance** — .NET 8 has better JIT compilation and garbage collection, which may improve plugin performance.
- **Third-party dependencies** — any NuGet packages your plugin uses must also support .NET 8 (or netstandard2.0 at minimum).

## Multi-targeting strategies

If you need to support multiple Civil 3D versions from a single codebase:

### Separate project configurations

Create separate build configurations (e.g., Release-2025, Release-2026) with different target frameworks and reference paths:

```xml
<PropertyGroup Condition="'$(Configuration)' == 'Release-2025'">
  <TargetFramework>net48</TargetFramework>
  <DefineConstants>C3D2025</DefineConstants>
</PropertyGroup>
<PropertyGroup Condition="'$(Configuration)' == 'Release-2026'">
  <TargetFramework>net8.0-windows</TargetFramework>
  <DefineConstants>C3D2026</DefineConstants>
</PropertyGroup>
```

### Conditional compilation

Use preprocessor directives for version-specific code:

```csharp
#if C3D2026
    // .NET 8 specific code
#else
    // .NET Framework 4.8 code
#endif
```

### Shared project / source linking

Put common code in a shared project referenced by version-specific projects. Each version project adds only the references and configuration specific to that Civil 3D version.

## ObjectARX version correspondence

The ObjectARX SDK version generally matches the AutoCAD version year. Each SDK release may add new API methods, deprecate old ones, or change behavior. Always compile against the SDK matching your minimum target version, and test against the maximum version.

## Related

- [.NET plugin setup](setup.md)
- [Distributing a .NET plugin](distributing.md)
- [Hello world plugin](hello-world.md)
