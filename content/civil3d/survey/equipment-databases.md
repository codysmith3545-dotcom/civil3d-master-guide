---
title: "Equipment Databases"
section: "civil3d/survey"
order: 55
visibility: public
tags: [survey, equipment-database, edm-constant, prism-offset, atmospheric-correction]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [IMPORTSURVEYDATA, SHOWSURVEYTAB]
updated: 2026-05-06
---

> **TL;DR**
> 1. An equipment database stores instrument and prism specifications — EDM constant, prism offset, atmospheric correction parameters, and standard errors — so that imported observations are corrected consistently.
> 2. Create one equipment database per instrument/prism combination used in the office. Assign the correct database at import time; changing it after import reprocesses all affected distances.
> 3. Accurate standard errors (angular and distance) are critical for least-squares adjustment. Use the manufacturer's published specs, not the Civil 3D defaults.

## What an equipment database stores

Each equipment database entry contains:

### Instrument properties

- **EDM constant (additive constant)**: a fixed offset in the instrument's distance measurement, typically a few millimeters. Determined by baseline calibration. Applied to every slope distance.
- **Angular standard error**: the manufacturer's rated accuracy for a single angle measurement (e.g. 1", 2", 5"). Used as the angular weight in least-squares adjustment.
- **Distance standard error**: expressed as a constant plus a parts-per-million (ppm) component (e.g. 2 mm + 2 ppm). Used as the distance weight in least-squares adjustment.

### Prism properties

- **Prism constant (offset)**: the distance offset for the specific prism type. Standard Leica circular prism: -34.4 mm. Trimble 360-degree prism: 0.0 mm. Nodal prism (Sokkia): -30.0 mm. Values vary by manufacturer and must match what was set in the data collector during the survey.
- **Target height default**: the default rod/pole height. Can be overridden per setup or per observation.

### Atmospheric corrections

- **Temperature**: ambient temperature at the time of observation (degrees F or C).
- **Pressure**: barometric pressure (inHg or mbar).
- **Refraction coefficient**: typically 0.13 for standard atmospheric conditions.
- **Apply atmospheric correction**: toggle. When on, Civil 3D applies the first velocity correction to slope distances based on temperature and pressure.

Most modern instruments apply atmospheric corrections internally. If the instrument was set to correct in real time, leave the correction off in the equipment database to avoid double-correction.

## Creating an equipment database

1. Survey tab > expand the open survey database.
2. Right-click `Equipment Databases` > New.
3. Name it descriptively: `Trimble_S7_Leica360Prism` or `Topcon_GT1001_StandardPrism`.
4. Enter the manufacturer's published specs for angular accuracy, distance accuracy, and prism constant. These values are in the instrument's technical data sheet.
5. Set atmospheric parameters if the instrument was not correcting in real time.
6. Save and close.

## Assigning during import

When running `IMPORTSURVEYDATA`, the wizard prompts for the equipment database. Select the entry that matches the instrument and prism used for that field session. If multiple instruments were used on the same job (e.g. a total station for control and a GPS for topo), import each dataset separately with the appropriate equipment database.

## Editing after import

Right-click a setup in the database > Properties > Equipment tab. Changing the equipment database here re-applies the new EDM constant and prism offset to all observations under that setup and recomputes coordinates. This is the correct fix when the wrong equipment database was selected during import.

## Standard errors and least-squares

The angular and distance standard errors from the equipment database feed directly into the stochastic model for least-squares network adjustment. If these values are wrong:

- **Standard errors too small**: the adjustment trusts the observations more than warranted. Residuals look good but the adjusted coordinates are unreliable.
- **Standard errors too large**: the adjustment over-weights control and underweights observations. The adjusted network clings to the control points and ignores real measurement quality.

Use the manufacturer's spec-sheet values as a starting point. For a well-maintained instrument on a recently calibrated baseline, these are appropriate. For older equipment, inflate them based on calibration results.

## Multiple prisms on one job

It is common to use different prisms during a single day: a standard prism on a tribrach for control, a mini-prism or 360 prism on a pole for topo. The prism constant changes between these.

In the `.fbk` file, the `PRISM` keyword sets the target height but not the prism constant. The prism constant comes from the equipment database. To handle mixed prisms, either:

- Import the control shots and topo shots as separate `.fbk` files, each with its own equipment database entry.
- Set the prism constant correctly in the data collector for each target swap so the raw distances are already corrected, then use a single equipment database with prism constant of 0.

## Common gotchas

- **Double atmospheric correction.** If the data collector applied atmospheric correction in real time and the equipment database also applies it, distances are corrected twice. Check the data collector's settings log.
- **Zero prism constant assumption.** Some surveyors set the data collector to "no prism" mode for reflectorless shots, which uses offset 0. Importing those observations with an equipment database that has a -34.4 mm prism constant subtracts that offset from every distance.
- **Forgetting to update after calibration.** When the instrument goes in for service and the EDM constant changes, update the equipment database entry. Old projects using the old constant are not affected; only new imports use the current entry.
- **Default standard errors.** Civil 3D ships generous defaults. A 5" angular standard error is appropriate for a builder's level, not a 1" total station. Fix before running network adjustment.

## Related

- [Survey database](survey-database.md)
- [Importing raw observations](importing-raw-observations.md)
- [Field book format (.fbk)](field-book-format.md)
- [Network adjustment](network-adjustment.md)
