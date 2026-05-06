---
title: "User Profiles and Support File Paths"
section: "civil3d/fundamentals"
order: 50
visibility: public
tags: [fundamentals, user-profile, support-paths, appdata, customization, pgp, dwt, ctb]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [OPTIONS, PROFILEMANAGER, SYSVDLG]
updated: 2026-05-06
---

> **TL;DR**
> 1. AutoCAD user profiles (managed via `OPTIONS` > Profiles tab or `PROFILEMANAGER`) store per-user preferences including support file search paths, default template, printer paths, and tool palette locations. Switching profiles swaps all of these at once.
> 2. Civil 3D's customization files live under `%APPDATA%\Autodesk\C3D <version>\enu\` (roaming) and `%LOCALAPPDATA%\Autodesk\C3D <version>\enu\` (local cache). The roaming folder holds PGP, CUIx, plot styles, and templates; the local folder holds cached icons and temp data.
> 3. Support file search paths define where Civil 3D looks for linetypes, hatches, fonts, blocks, and custom programs. Add company-standard folders here rather than dumping files into the install directory.

## AutoCAD user profiles

A user profile is a named snapshot of nearly everything on every tab of the `OPTIONS` dialog: paths, display settings, plotting defaults, drafting aids, selection modes, and 3D navigation preferences. Profiles are stored in the Windows registry under `HKEY_CURRENT_USER\SOFTWARE\Autodesk\AutoCAD\<Rxx.x>\ACAD-xxxx:<lang>\Profiles\`.

Key operations:

- **Create**: `OPTIONS` > Profiles tab > Add to List. The new profile clones the current one.
- **Switch**: select a profile and click Set Current, or run `PROFILEMANAGER`.
- **Export/Import**: profiles export to an `.arg` file (AutoCAD Registry file). Distribute an `.arg` to standardize settings across an office. Import overwrites only the matching profile name.
- **Reset**: restores the profile to its saved state, discarding session changes.

Civil 3D adds its own extensions to the base AutoCAD profile — Toolspace layout, survey working folder, data shortcut project — but these are stored in drawing-level or project-level settings, not in the profile itself.

## The %APPDATA% structure

On a typical Windows installation the roaming application data folder for Civil 3D 2025 is:

```
%APPDATA%\Autodesk\C3D 2025\enu\
```

Within that folder:

| Subfolder / File | Purpose |
|---|---|
| `Support\` | Custom linetypes (`.lin`), hatch patterns (`.pat`), fonts (`.shx`), PGP alias file (`acad.pgp`), custom CUIx if redirected here |
| `Template\` | Default DWT files referenced by `QNEW` and `NEW` |
| `Plotters\` | PC3 and PMP files, plus `Plot Style Table\` holding CTB/STB files |
| `Data\` | Autodesk content (tool palettes, materials) |
| `PrinterDescriptions\` | Custom PMF files |

The local (non-roaming) counterpart:

```
%LOCALAPPDATA%\Autodesk\C3D 2025\enu\
```

This holds cached thumbnails, recently-used file lists, and other expendable data. Deleting it forces a rebuild on next launch — a common fix for corrupted workspaces.

## Support file search paths

`OPTIONS` > Files tab > Support File Search Path lists directories Civil 3D searches (in order) when resolving a filename that is not an absolute path. This controls where it finds:

- Linetypes (`.lin`)
- Hatch patterns (`.pat`)
- Shape/font files (`.shx`)
- Blocks inserted by name without a path
- AutoLISP/VLX loaded by name
- Menu bitmaps and icons

Best practices:

1. **Add company paths, do not modify install paths.** Place the company share (`S:\CAD Standards\Support\`) at the top of the list. Never copy files into `C:\Program Files\Autodesk\...` — updates and reinstalls erase them.
2. **Order matters.** If two folders contain a file with the same name, the first path wins. Put the company folder above the default to ensure company linetypes override shipped ones.
3. **Keep the list short.** Every entry is searched every time a file is resolved. Dozens of network paths slow startup and file open.
4. **Use environment variables or UNC paths.** `%SERVERPATH%\CAD\Support` works if the variable is set system-wide. UNC paths (`\\server\share\Support`) avoid mapped-drive issues.

## Other important path settings in OPTIONS > Files

- **Trusted Locations**: directories from which AutoLISP, VBA, .NET, and ObjectARX code loads without a security prompt. Add your LISP/plugin folder here; do not turn off the trust check globally.
- **Drawing Template File Location**: where `NEW` and `QNEW` look for DWT files. Point to the company template folder.
- **Plot Style Table Search Path**: where CTB/STB files are found. This is separate from the plotters folder for historical reasons.
- **Customization Files**: CUIx (main and enterprise) paths.
- **Printer Support File Path**: PC3 and PMP directory.

## How Civil 3D finds specific files

| File type | Resolution order |
|---|---|
| `acad.pgp` (command aliases) | Support File Search Path; first found wins. Civil 3D ships its own `acad.pgp` that adds Civil 3D commands. |
| DWT templates | Drawing Template File Location, then Support File Search Path. |
| CTB / STB plot styles | Plot Style Table Search Path. |
| CUIx menus | Customization Files paths (main and enterprise). |
| Tool palettes | Tool Palettes File Locations (under OPTIONS > Files). |
| Data shortcuts | Project path set in Toolspace > Prospector > right-click the project node. Not profile-dependent. |

## Managing profiles across an office

A repeatable deployment strategy:

1. Configure one workstation with correct paths, templates, and options.
2. Export the profile to `CompanyStd2025.arg`.
3. Distribute via login script, GPO, or installer. Import with `PROFILEMANAGER` or the command-line switch: `acad.exe /p "CompanyStd2025"`.
4. Pin the profile by setting it as default in `OPTIONS` > Profiles > Set Current.
5. Version the `.arg` file alongside the DWT in version control. When paths change, re-export and redistribute.

## Common gotchas

- **Profile resets after crash.** AutoCAD saves profile changes on clean exit. A crash loses changes made since the last clean exit. Export after any significant change.
- **Roaming profile vs Windows roaming.** The `%APPDATA%` folder roams with Windows roaming profiles, but the files can be large enough to slow login. Some IT departments redirect it to a local cache; this changes where Civil 3D looks for CTB and template files.
- **Multiple Civil 3D versions.** Each major version has its own `C3D <version>` folder. Settings do not migrate automatically. Run the migration utility on first launch of a new version or re-import the `.arg`.
- **PGP edits lost.** If `acad.pgp` is edited in one location but a different copy is found first in the search path, the edits appear to vanish. Verify which copy loads with `(findfile "acad.pgp")` at the command line.
- **Missing fonts.** When a DWG uses an SHX font not in any search path, Civil 3D substitutes `simplex.shx` and logs the substitution. Add the font folder to Support File Search Path or install the font to the Autodesk `Fonts` directory.

## Related

- [Templates and drawing settings](templates-and-settings.md)
- [Ambient settings, units, and abbreviations](ambient-settings.md)
- [Workspace and Toolspace](workspace-and-toolspace.md)
