---
title: "Distributing a .NET Plugin"
section: "customization/dotnet-api"
order: 35
visibility: public
tags: [dotnet, csharp, distribution, bundle, packagecontents-xml, installer, app-store, autoloader]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Autodesk Autoloader (PackageContents.xml) Reference"
    url: https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-0E7D37BC-2E3F-43A0-8E52-4C0B6CC7E8CC
    verified: 2026-05-06
  - title: "Autodesk App Store Developer Center"
    url: https://apps.autodesk.com/
    verified: 2026-05-06
---

> **TL;DR**
> 1. The **Autodesk Autoloader** (.bundle folder with PackageContents.xml) is the recommended way to deploy plugins. Place the .bundle folder in `%AppData%\Autodesk\ApplicationPlugins\` and Civil 3D loads it automatically.
> 2. For team distribution, copy the .bundle folder to a shared network location and configure each user's ApplicationPlugins path, or use an MSI installer.
> 3. For public distribution, submit to the **Autodesk App Store**. Autodesk reviews the plugin and handles licensing, updates, and installation.

## .bundle folder structure

The Autodesk Autoloader scans for `.bundle` folders in predefined locations. A typical structure:

```
MyPlugin.bundle/
  PackageContents.xml
  Contents/
    MyPlugin.dll
    Resources/
      icon_16.png
      icon_32.png
```

## PackageContents.xml

The manifest file that tells Civil 3D how to load your plugin:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationPackage
  SchemaVersion="1.0"
  AppVersion="1.0.0"
  ProductCode="{YOUR-GUID-HERE}"
  Name="My Plugin"
  Description="Description of the plugin"
  Author="Your Company">

  <CompanyDetails
    Name="Your Company"
    Url="https://yourcompany.com"
    Email="support@yourcompany.com" />

  <RuntimeRequirements
    OS="Win64"
    Platform="AutoCAD|Civil3D"
    SeriesMin="R24.0"
    SeriesMax="R25.0" />

  <Components>
    <RuntimeRequirements
      OS="Win64"
      Platform="AutoCAD|Civil3D"
      SeriesMin="R24.0"
      SeriesMax="R25.0" />
    <ComponentEntry
      AppName="MyPlugin"
      Version="1.0.0"
      ModuleName="./Contents/MyPlugin.dll"
      AppDescription="My Civil 3D Plugin"
      LoadOnAutoCADStartup="True"
      LoadOnCommandInvocation="False" />
  </Components>
</ApplicationPackage>
```

### Key attributes

| Attribute | Description |
|---|---|
| SchemaVersion | Always "1.0" |
| ProductCode | A unique GUID for your plugin |
| SeriesMin/SeriesMax | AutoCAD version range (R24.0 = 2024, R25.0 = 2025, etc.) |
| LoadOnAutoCADStartup | True = load when Civil 3D starts; False = load on demand |
| LoadOnCommandInvocation | True = load when a registered command is invoked |
| ModuleName | Relative path to the DLL |

## Autoloader search paths

Civil 3D scans these folders for .bundle directories:

| Path | Scope |
|---|---|
| `%AppData%\Autodesk\ApplicationPlugins\` | Current user |
| `%ProgramData%\Autodesk\ApplicationPlugins\` | All users on the machine |
| Custom path via TRUSTEDPATHS | Network deployment |

For team deployment, place the .bundle on a network share and either:
- Add the network path to TRUSTEDPATHS in the Civil 3D deployment.
- Use a login script to copy/sync the .bundle folder to each user's local ApplicationPlugins directory.

## MSI installer

For a professional installation experience:

1. Create a WiX or Visual Studio Installer project.
2. The installer copies the .bundle folder to `%ProgramData%\Autodesk\ApplicationPlugins\`.
3. Register the ProductCode GUID for clean uninstallation.
4. Optionally add Start Menu shortcuts and documentation.

The MSI can also handle prerequisites (e.g., .NET runtime for 2026+), registry settings, and file associations.

## Autodesk App Store

For public or commercial distribution:

1. Create a developer account at https://apps.autodesk.com/.
2. Package the plugin as a .bundle (or as an MSI/EXE installer).
3. Submit for review. Autodesk tests for stability, security, and compliance.
4. Once approved, the plugin is listed in the App Store and available through the Civil 3D desktop app.

Benefits: Autodesk handles updates, licensing (free or paid), and user support infrastructure.

## Auto-loading vs manual NETLOAD

| Method | Pros | Cons |
|---|---|---|
| Autoloader (.bundle) | No user action; consistent | Must manage SeriesMin/Max for version compatibility |
| NETLOAD | Simple for testing | User must load manually every session |
| Registry demand-loading | Loads on first command use | Complex setup, version-specific registry keys |

For production plugins, always use the autoloader.

## Signing assemblies

Strong-naming (signing) your assembly is recommended for production:

- Prevents DLL tampering.
- Required for GAC installation.
- Required for some Autodesk App Store submissions.
- Use a `.snk` file: `sn -k MyPlugin.snk`, then reference it in the project properties.

## Related

- [.NET plugin setup](setup.md)
- [Adding a ribbon button](adding-ribbon-button.md)
- [Hello world plugin](hello-world.md)
- [Version to .NET target table](version-to-net-target.md)
