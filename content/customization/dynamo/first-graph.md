---
title: "Building Your First Dynamo Graph"
section: "customization/dynamo"
order: 15
visibility: public
tags: [dynamo, graph, tutorial, civil3d, alignment, select-object, get-property]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Autodesk Dynamo for Civil 3D Documentation"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-DynamoForCivil3D
    verified: 2026-05-06
---

> **TL;DR**
> 1. A Dynamo graph is built by placing nodes, connecting wires, and running. Start simple: **select objects**, **get properties**, **do something with the data** (write to file, set another property, filter).
> 2. Example 1: read all alignment names and lengths, write to a text file. Example 2: select a surface and query elevations at a grid of points.
> 3. Set the run mode to **Manual** when your graph modifies drawing objects to avoid repeated unintended changes.

## Example 1: List all alignment names to a file

This graph reads every alignment in the drawing and writes its name and length to a CSV file.

### Step-by-step

1. **Open Dynamo** from the Manage tab.
2. Place a **Civil 3D > Alignment > All Alignments** node. This outputs a list of all alignment objects in the drawing.
3. Place a **Civil 3D > Alignment > Name** node. Connect the alignment list output to its input. It outputs a list of name strings.
4. Place a **Civil 3D > Alignment > Length** node. Connect the same alignment list. It outputs a list of lengths.
5. Place a **List > List.Create** node. Connect the names list and the lengths list as inputs. This creates a list of sublists: `[["Centerline", 1234.56], ["ROW-Left", 1234.56], ...]`.
6. Place a **String > String.Join** node with separator `","`. Connect each sublist to format as CSV rows.
7. Place a **File > File.WriteText** node. Give it a file path (e.g., `C:\output\alignments.csv`) and connect the joined strings as the content.
8. Set run mode to **Manual** and click **Run**.

The result is a CSV file listing every alignment with its length.

### Variations

- Add **Station > Start Station** and **Station > End Station** nodes for more detail.
- Filter by layer using a **List.FilterByBoolMask** node with a string-contains test on the layer name.

## Example 2: Query surface elevations at a grid

1. Place a **Civil 3D > Surface > Select Surface** node. Click the node and pick a surface in the drawing.
2. Place a **Code Block** node and type a range for X coordinates: `0..100..10;` (0 to 100, step 10).
3. Place another **Code Block** for Y coordinates: `0..100..10;`.
4. Place a **Geometry > Point > Point.ByCoordinates** node. Connect X to the x input and Y to the y input. Set lacing to **Cross Product** to generate a grid.
5. Place a **Civil 3D > Surface > Elevation At Point** node. Connect the surface and the point grid.
6. The output is a grid of elevations. Connect to a **Watch** node to inspect the values.

## Example 3: Rename surfaces by convention

1. **All Surfaces** node to get every surface.
2. **Surface > Name** node to get current names.
3. **String > String.Replace** node to change "Existing" to "EG" (or whatever your convention requires).
4. **Surface > Set Name** node to apply the new names.
5. Run in **Manual** mode.

## Tips for building graphs

- **Start with a Watch node** — connect it to any output to see what data is flowing. This is the Dynamo equivalent of a print statement.
- **Use Code Block nodes** for quick expressions: math, string formatting, list creation (`{1, 2, 3}`).
- **Group related nodes** — select nodes, right-click > Group Selection. Add a title to the group for documentation.
- **Add notes** — right-click the canvas > Create Note. Document what each section of the graph does.
- **Save early and often** — Dynamo graphs are saved as .dyn files (JSON format). Save with Ctrl+S.

## Saving and sharing

Dynamo graphs are `.dyn` files. Share them with teammates by placing them on a network drive. See [Dynamo Player](dynamo-player.md) for running shared graphs without opening the Dynamo editor.

## Related

- [Dynamo overview](overview.md)
- [Civil 3D-specific packages](civil3d-packages.md)
- [Dynamo Player](dynamo-player.md)
- [Limitations](limitations.md)
