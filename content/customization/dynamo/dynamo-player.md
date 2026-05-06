---
title: "Dynamo Player"
section: "customization/dynamo"
order: 25
visibility: public
tags: [dynamo, dynamo-player, automation, deployment, team, graphs]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Autodesk Dynamo Player Documentation"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-DynamoForCivil3D
    verified: 2026-05-06
---

> **TL;DR**
> 1. Dynamo Player runs pre-built .dyn graphs **without opening the Dynamo editor**. Users see a simple list of available graphs with input fields — they do not need to understand the node graph.
> 2. Graphs are deployed by placing .dyn files in a shared folder. Point Dynamo Player to that folder and every team member sees the same set of tools.
> 3. Mark input nodes as "Is Input" in the Dynamo editor to expose them as user-editable parameters in Dynamo Player.

## What Dynamo Player is

Dynamo Player is a panel within Civil 3D (Manage tab > Visual Programming panel > Dynamo Player) that provides a simplified interface for running Dynamo graphs. Instead of opening the full visual programming workspace, users see:

- A list of available .dyn files from a configured folder.
- For each graph, a set of input parameters (text fields, number fields, file pickers, or Boolean toggles).
- A "Play" button to execute the graph.

This makes Dynamo accessible to team members who do not know visual programming — they just fill in the inputs and click Play.

## Setting up graphs for Dynamo Player

### Marking inputs

In the Dynamo editor, right-click any input node and check **Is Input**. Supported input types:

| Node type | Player UI |
|---|---|
| Number Slider | Slider with min/max/step |
| Integer Slider | Integer slider |
| String | Text field |
| Boolean | Checkbox |
| File Path | File browser |
| Directory Path | Folder browser |
| Select Model Element(s) | Object picker (user selects in Civil 3D) |

Nodes not marked as "Is Input" use their default values and are hidden from the Player user.

### Marking outputs

Right-click output nodes and check **Is Output** to display results in the Player after execution (e.g., a summary string, a count of objects processed).

### Naming and description

- Give the graph a clear name (the .dyn filename appears in the Player list).
- Add a note at the top of the graph describing what it does — this is visible when the user hovers over the graph in Player.

## Deploying graphs to a team

### Network folder approach

1. Create a shared folder (e.g., `\\server\cad-standards\dynamo-graphs\`).
2. Place all team .dyn files in this folder (organized in subfolders if desired).
3. In Civil 3D, open Dynamo Player and set the graph path to the network folder.
4. Every user pointing to the same folder sees the same set of graphs.

The path is configured in Dynamo Player's settings (gear icon). It persists across sessions.

### Folder organization

```
dynamo-graphs/
  Survey/
    Export-Points-To-CSV.dyn
    Label-Coordinates.dyn
  Roads/
    Rename-Alignments.dyn
    Set-Corridor-Targets.dyn
  Utilities/
    Pipe-Network-Report.dyn
    Check-Pipe-Slopes.dyn
```

Dynamo Player displays the folder structure, making it easy for users to find the right graph.

## Example: batch rename alignments

A graph deployed to the team via Dynamo Player:

**Inputs exposed to the user:**
- "Find text" (string input, e.g., "Existing")
- "Replace with" (string input, e.g., "EG")

**Graph logic (hidden from the user):**
1. Get all alignments.
2. Get each name.
3. String.Replace with the user's find/replace text.
4. Set the new names.

**Output:** "Renamed 5 alignments."

The user sees only the two text fields and a Play button. No Dynamo knowledge required.

## Limitations of Dynamo Player

- Cannot handle interactive mid-graph selections (all object selections must happen at the input stage, not mid-execution).
- No conditional branching based on user input (the graph runs the same logic every time).
- Error messages from failed graphs are sometimes cryptic for end users.
- Package dependencies must be installed on each user's machine.

## Related

- [Dynamo overview](overview.md)
- [First graph](first-graph.md)
- [Civil 3D-specific packages](civil3d-packages.md)
- [Limitations](limitations.md)
