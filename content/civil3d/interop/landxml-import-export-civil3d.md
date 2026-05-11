---
title: "LandXML Import and Export in Civil 3D"
section: "civil3d/interop"
order: 20
visibility: public
tags: [landxml, import, export, civil3d, round-trip, alignment, surface]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [LANDXMLIN, LANDXMLOUT, IMPORTLANDXML, EXPORTLANDXML]
updated: 2026-05-11
---

> **TL;DR**
> 1. Import with `LANDXMLIN` (alias `IMPORTLANDXML`). Export with `LANDXMLOUT` (alias `EXPORTLANDXML`). Both honor the per-object filter dialog — uncheck things you do not want to round-trip.
> 2. What survives the round-trip well: alignment horizontal geometry, profile PVI/PVC/PVT, surface TIN points and faces, parcel polygons, points (with description and full property set), pipe network geometry (2018+).
> 3. What does **not** survive cleanly: corridor assemblies, surface boundaries marked as "hide", Civil 3D label and object styles, point group queries, descriptions keys, civil view object data, code-set styles. These either drop entirely or are rebuilt from defaults.

## The export dialog, in detail

`LANDXMLOUT` opens a tree of every Civil 3D object in the active drawing. Settings worth knowing:

- **LandXML version** (Edit Settings → General). 1.2 is the safer default for cross-vendor delivery; 2.0 unlocks `<PipeNetworks>` and the richer `<Roadways>` block but is rejected by some Trimble Business Center versions older than 5.x.
- **Surface data** — choose `Points and Triangles`, `Points only`, or `Points, Triangles, and Boundaries`. The "Boundaries" option only writes `<Boundaries>` for *outer* boundaries; show/hide/data-clip boundaries are dropped silently. Civil 3D itself can re-import only the outer boundary, so do not assume hides will round-trip even within Civil 3D.
- **Alignment** — toggle `Export Profile`, `Export Cross Sections`, and `Export Superelevation`. Cross sections export as `<CrossSects>` blocks under `<Roadway>` and are bulky; turn them off unless the recipient asked for them.
- **Pipe network** — toggle `Export Pipes` and `Export Structures` independently. The pipe network must be in the *current drawing*, not just referenced through a data shortcut, or the dialog skips it.
- **Read-only on import** — checking this will set `readOnly="true"` in the root `<LandXML>` element; many readers display a warning but still import.

## What the import does

`LANDXMLIN` opens a similar object tree of *what is in the file* and lets you cherry-pick. Some specifics:

- **Surfaces** are created as TIN surfaces named exactly as in the XML. If a surface of the same name already exists, Civil 3D appends ` (1)`, ` (2)`, etc. — there is no "merge into existing" option.
- **Alignments** import with the *site* you select in the dialog, defaulting to `<None>`. If you import multiple alignments that exist on different sites, you must run the import once per site.
- **Profiles** import as **layout profiles** even if they were originally surface profiles. Re-creating a surface profile post-import is one click but you lose any historic dynamic link.
- **Points** are imported into the drawing's main point group, not into a named group. Description key matching runs as part of the import — if your description keys are not loaded in the destination drawing, every point gets the default style.
- **Parcels** require a destination site; the importer needs to know which site owns the parcel topology.

## Round-trip survival matrix

| Object / property | Export | Re-import | Notes |
|---|---|---|---|
| Alignment horizontal (line / curve / spiral) | yes | yes | Spiral A-value preserved as length; some clothoid types degrade to symmetric NSW spirals |
| Alignment design criteria file | no | n/a | Discarded; superelevation values can be exported as data |
| Profile PVIs | yes | yes | Rebuilt as layout profile |
| Surface points/triangles | yes | yes | TIN faithful; user-defined contours and analyses dropped |
| Surface boundaries (outer) | yes | yes | Hides/data-clips dropped |
| Surface masks / watersheds | no | n/a | |
| Corridor assembly | no | no | Use AutoCAD WBLOCK or NWC instead |
| Pipe network (2.0) | yes | yes | Parts list is rebuilt from current drawing's parts list, not the XML |
| Pressure network | partial | partial | LandXML lacks dedicated pressure-pipe schema; Civil 3D uses an extension namespace that only round-trips Civil 3D ↔ Civil 3D |
| Points + descriptions | yes | yes | Point user-defined properties survive in `<Feature>` extension blocks |
| Description keys | no | no | Keys belong to the drawing template, not the points |
| Object/label styles | no | no | Always rebuilt from destination DWT |
| Survey database (`<Survey>`) | yes | yes | Civil 3D can import to a survey database; it will not auto-attach figures |

## Useful settings tweaks

- `Drawing Settings → Ambient → Direction`: must be `decimal degrees` if you want bearings as numeric `dir=` attributes the recipient can parse. Setting it to `bearings (NESW)` writes the bearing string into `desc` but leaves `dir=` blank.
- The Civil 3D LandXML exporter writes `<CoordinateSystem name="...">` from the drawing's assigned coord-system code (Settings → Edit Drawing Settings → Units and Zone). If `Selected coordinate system` is `<no datum, no projection>`, the element is omitted — the recipient has to guess.
- The XSD path embedded in the file is the **online** schema URL. If the recipient is offline, validation fails even though the XML is structurally fine. Civil 3D imports do not validate against XSD by default, so this only matters for third-party tools.

## Common pitfalls

- **"At least one object did not import. See the event viewer."** Open `Toolspace → Toolbox → Reports Manager → Event Viewer` (or `EVENTLOG`) — the actionable error is buried there, often a coordinate-system mismatch or a face referencing a missing point ID.
- **"Conflict in name. The object already exists in the destination."** As above — Civil 3D auto-renames with a suffix; if you wanted to overwrite, you have to delete first.
- **Empty pipe network after 2.0 import.** The destination drawing's parts list does not contain a part that matches the imported pipe's `<MatchPart>`; the network is created but every pipe is `<Null>`. Add a matching part to the parts list, then re-import.
- **Surface area changes by 0.01% on round-trip.** Floating-point rounding in the XML (default 4 decimals on coordinates). Bump the export precision in Edit Settings → Data Settings → Decimal precision.
- **"INTERNAL ERROR: divide by zero."** Almost always a zero-length alignment segment (start == end) generated by a faulty external tool — open the file in a text editor and remove the offending `<Line>`.

## Sources

- Autodesk Civil 3D Help, *Import and Export LandXML*, [https://help.autodesk.com/view/CIV3D/](https://help.autodesk.com/view/CIV3D/) — summarized; consult the live page for current version specifics.
- LandXML 2.0 schema, [http://www.landxml.org/](http://www.landxml.org/).
