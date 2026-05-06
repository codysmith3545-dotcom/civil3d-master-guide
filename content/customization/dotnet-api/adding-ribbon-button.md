---
title: "Adding a Ribbon Button"
section: "customization/dotnet-api"
order: 30
visibility: public
tags: [dotnet, csharp, ribbon, ui, button, iextensionapplication, wpf]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "AutoCAD .NET Developer's Guide — Ribbon API"
    url: https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-D793A8B1-CD73-4BA3-8D51-6A0A8E2F5F03
    verified: 2026-05-06
---

> **TL;DR**
> 1. Use the **RibbonControl** API from `Autodesk.Windows` to create a custom ribbon tab, panel, and buttons that call your plugin commands.
> 2. Implement **IExtensionApplication** to run initialization code (including ribbon setup) automatically when the plugin loads, without requiring NETLOAD each session.
> 3. Icon images should be embedded resources (16x16 for small, 32x32 for large) in BMP or PNG format.

## IExtensionApplication interface

Implement `IExtensionApplication` so your plugin runs initialization code at load time:

```csharp
using Autodesk.AutoCAD.Runtime;

public class MyPlugin : IExtensionApplication
{
    public void Initialize()
    {
        // Called when the plugin loads
        // Set up ribbon, event handlers, etc.
        CreateRibbon();
    }

    public void Terminate()
    {
        // Called when Civil 3D shuts down (cleanup)
    }
}
```

When the DLL is loaded (via NETLOAD, autoloader, or demand-loading), `Initialize()` is called automatically.

## Creating the ribbon

Reference `AdWindows.dll` (from the Civil 3D installation directory) and add `using Autodesk.Windows;`:

```csharp
using Autodesk.Windows;
using System.Windows.Media.Imaging;

private void CreateRibbon()
{
    RibbonControl ribbon = ComponentManager.Ribbon;
    if (ribbon == null) return;

    // Create a new tab
    RibbonTab tab = new RibbonTab();
    tab.Title = "My Tools";
    tab.Id = "MY_TOOLS_TAB";
    ribbon.Tabs.Add(tab);

    // Create a panel
    RibbonPanelSource panelSrc = new RibbonPanelSource();
    panelSrc.Title = "Survey Tools";
    RibbonPanel panel = new RibbonPanel();
    panel.Source = panelSrc;
    tab.Panels.Add(panel);

    // Create a button
    RibbonButton btn = new RibbonButton();
    btn.Text = "List Alignments";
    btn.ShowText = true;
    btn.Size = RibbonItemSize.Large;
    btn.CommandHandler = new RibbonCommandHandler();
    btn.CommandParameter = "LISTALIGNMENTS ";
    btn.LargeImage = LoadImage("MyPlugin.Resources.alignment_32.png");
    btn.Image = LoadImage("MyPlugin.Resources.alignment_16.png");

    panelSrc.Items.Add(btn);
}
```

## Command handler

The button needs a command handler that sends the command to the AutoCAD command line:

```csharp
using System.Windows.Input;

public class RibbonCommandHandler : ICommand
{
    public event EventHandler CanExecuteChanged;

    public bool CanExecute(object parameter)
    {
        return true;
    }

    public void Execute(object parameter)
    {
        if (parameter is RibbonButton btn)
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            if (doc != null)
            {
                doc.SendStringToExecute(
                    btn.CommandParameter.ToString(),
                    true, false, true);
            }
        }
    }
}
```

## Loading icon images

Embed icon images as resources in the project:

1. Add 16x16 and 32x32 PNG files to the project.
2. Set their Build Action to "Embedded Resource."
3. Load them at runtime:

```csharp
private BitmapImage LoadImage(string resourceName)
{
    var assembly = System.Reflection.Assembly.GetExecutingAssembly();
    using (var stream = assembly.GetManifestResourceStream(resourceName))
    {
        if (stream == null) return null;
        var image = new BitmapImage();
        image.BeginInit();
        image.StreamSource = stream;
        image.CacheOption = BitmapCacheOption.OnLoad;
        image.EndInit();
        return image;
    }
}
```

## Ribbon timing issue

The ribbon may not be available when `Initialize()` runs if the plugin loads before the UI is fully constructed. Handle this by subscribing to the idle event:

```csharp
public void Initialize()
{
    if (ComponentManager.Ribbon != null)
        CreateRibbon();
    else
        ComponentManager.ItemInitialized += OnRibbonInitialized;
}

private void OnRibbonInitialized(object sender, RibbonItemEventArgs e)
{
    if (ComponentManager.Ribbon != null)
    {
        CreateRibbon();
        ComponentManager.ItemInitialized -= OnRibbonInitialized;
    }
}
```

## Adding to an existing tab

Instead of creating a new tab, you can add a panel to an existing tab (such as the Civil 3D "Home" tab):

```csharp
RibbonTab homeTab = ribbon.FindTab("CIVIL3D_HOME");
if (homeTab != null)
{
    homeTab.Panels.Add(panel);
}
```

Tab IDs vary by Civil 3D version. Inspect the ribbon at runtime or check the Autodesk developer documentation for current tab IDs.

## Related

- [.NET plugin setup](setup.md)
- [Hello world plugin](hello-world.md)
- [Distributing a .NET plugin](distributing.md)
- [Working with Civil 3D objects](working-with-objects.md)
