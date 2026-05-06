---
title: "Ambient Settings, Units, and Abbreviations"
section: "civil3d/fundamentals"
order: 40
visibility: public
tags: [fundamentals, ambient-settings, units, precision, abbreviations]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [EDITDRAWINGSETTINGS, EDITFEATURESETTINGS, EDITLABELSTYLEDEFAULTS]
updated: 2026-05-06
---

> **TL;DR**
> 1. Ambient settings define the default formatting (precision, rounding, sign convention, suffixes) that every Civil 3D label, table, and report falls back to when not explicitly overridden.
> 2. Three levels of inheritance: drawing > feature (object family) > command/label. A child setting marked "Yes" for override breaks the inheritance link; clear it to re-inherit.
> 3. Edit at the drawing level with `EDITDRAWINGSETTINGS` > Ambient Settings tab. Edit at the feature level by right-clicking a feature node in the Settings tab of Toolspace and choosing Edit Feature Settings.

## What ambient settings cover

Ambient settings are the default unit and format rules that downstream styles inherit. Categories include:

- **General**: plotted unit display, set/replace policy, save command changes to settings.
- **Distance**: precision, rounding (round normal/up/down/truncate), sign (sign negative, parentheses, signed/unsigned).
- **Dimension**: precision, rounding.
- **Coordinate**: precision, sign, format (X/Y vs Easting/Northing label order).
- **Grid coordinate**: precision and sign for state-plane/grid display.
- **Elevation**: precision, sign, rounding.
- **Latitude/Longitude**: format (decimal vs DMS), precision.
- **Direction**: format (bearing, azimuth N/S, decimal), precision; bearing seconds rounding.
- **Angle**: precision and rounding.
- **Slope/Grade**: format (rise:run, run:rise, percent, per mille), precision, sign convention.
- **Station**: format (`SS+SS.SS` or `SS+SSS.SS`), precision.
- **Speed**: mph or km/h, precision.
- **Pressure, Volume, Time, Temperature, Pressure Head, Acceleration, Force, Energy, Power**: precision and units. Most affect pressure-pipe and hydrology labels.

## The inheritance chain

Civil 3D evaluates a setting in this order, top wins:

1. **Label-style override** (set on the individual label or the label style).
2. **Command setting** (the per-command defaults, e.g. `CreateAlignment`).
3. **Feature setting** (the entire object class, e.g. Alignment).
4. **Drawing setting** (the Ambient Settings tab).

A child cell shows a green "Yes" in the Override column when it has been explicitly broken from its parent. Clearing the Yes restores inheritance and lets a single drawing-level change ripple everywhere.

## Where to edit

- **Drawing level**: `EDITDRAWINGSETTINGS` > Ambient Settings tab. Affects everything not overridden.
- **Feature level**: Toolspace > Settings tab > right-click an object family (e.g. `Surface`) > Edit Feature Settings. Limits the change to that family.
- **Command level**: Settings tab > expand the family > Commands node > right-click a command > Edit Command Settings. Limits to that one command's defaults.
- **Label-style level**: open the style in Edit Label Style Composer; on the Layout tab the format string for each component carries its own precision/format.

## Units, the U.S. survey foot question

The U.S. survey foot was officially deprecated by NIST and NGS effective 2023-01-01 in favor of the international foot, but state plane zones in the U.S. were defined in survey feet for decades and many state DOTs still publish control in U.S. survey feet. Civil 3D exposes both: choose **US Foot** or **International Foot** under Drawing Units. The difference is roughly 2 ppm — about 0.01 ft over 5,000 ft — which is enough to break boundary work if mismatched. Match what the project's control sheet specifies. (NGS notice on policy change: National Geodetic Survey, "Frequently Asked Questions about the Final Federal Register Notice of the U.S. Survey Foot Deprecation".)

## Abbreviations

The Abbreviations tab in `EDITDRAWINGSETTINGS` is a key/value table referenced by labels through formulas. Examples: `ROW = ROW`, `BVCS = BVCS`, `Highpoint = HIGH POINT`. Adjusting here means you don't have to open every label style when the office decides to use `R/W` instead of `ROW`.

## Practical recipes

- **Switch a project from bearings to azimuths**: Drawing settings > Ambient > Direction > Format = `Azimuth (N)`. All directional labels not overridden flip immediately.
- **Round station to whole feet on construction sheets**: Drawing settings > Ambient > Station > Precision = 0; or feature setting on Profile View labels only if you want the change scoped.
- **Force grade as ratio (1:4) instead of percent**: Ambient > Slope > Format = `1:Run`. Note: subassembly side-slope target inputs may still expect percent — they read command settings, not label settings.
- **Show coordinates as Northing first**: Ambient > Coordinate > Format = `Northing-Easting`.

## Common gotchas

- **Override creep.** Years of small overrides leave a drawing where nothing inherits properly. Periodically scroll the Override column for the family you are editing and clear stale Yes flags.
- **Style copy carries overrides.** Importing a style from another DWG via the Settings tab copies its overrides too. Inspect after import.
- **Slope sign.** Civil 3D treats falling grade as negative when set to "Sign negative". Some agencies prefer absolute value with a leading `-` glyph; that is a label-style choice, not an ambient one.
- **Bearings precision rounding.** A bearing precision of 1 second hides true mis-closure; for boundary work consider 0.1 second display so the math is auditable.

## Related

- [Templates and drawing settings](templates-and-settings.md)
- [Workspace and Toolspace](workspace-and-toolspace.md)
