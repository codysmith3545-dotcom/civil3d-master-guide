---
title: "Drone (UAS) Topographic Surveys"
section: "field-and-boundary/topographic-surveys"
order: 35
visibility: public
tags: [drone, uas, photogrammetry, part-107, gcp, pix4d, metashape, dronedeploy]
updated: 2026-05-06
sources:
  - title: "14 CFR Part 107 — Small Unmanned Aircraft Systems"
    url: https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-107
    verified: 2026-05-06
  - title: "ASPRS Positional Accuracy Standards for Digital Geospatial Data (2023)"
    url: https://www.asprs.org/asprs-positional-accuracy-standards
    verified: 2026-05-06
---

> **TL;DR**
> 1. A drone topo can cover large open sites in hours instead of days, but it requires a **Part 107 licensed pilot**, properly distributed **ground control points (GCPs)**, and photogrammetric processing to produce a usable surface.
> 2. Expect **0.05 to 0.15 ft vertical accuracy** on bare, open ground with good GCP coverage and proper processing — comparable to conventional topo for 1 ft contour work but not sufficient for tight-tolerance grading without supplemental conventional shots.
> 3. Drones cannot see through vegetation or water. Under canopy, in dense grass, or for utility features (rims, inverts), **conventional survey supplements the drone** — plan for both.

## Regulatory requirements (Part 107)

Any commercial UAS operation in the United States requires compliance with 14 CFR Part 107.

- The pilot in command must hold a **Remote Pilot Certificate** (Part 107 license).
- Maximum altitude is **400 ft AGL** unless within 400 ft of a structure or with an approved waiver.
- Flights must be in **visual line of sight** (VLOS) of the pilot or a visual observer unless a Part 107.31 waiver is obtained.
- Operations in **controlled airspace** (Class B, C, D, or surface E) require LAANC authorization or an airspace waiver.
- Night operations are permitted under the 2021 rule update with anti-collision lighting visible for 3 statute miles.
- Indiana has no separate state UAS licensing requirement beyond Part 107, but individual municipalities may have local ordinances restricting launch/landing locations.

Check for NOTAMs and TFRs before every flight. File LAANC through an approved provider (DroneZone, Aloft/Kittyhawk, AirMap) for controlled airspace.

## Ground control points (GCPs) and checkpoints

GCPs are surveyed targets on the ground that tie the photogrammetric model to real-world coordinates. Without them, the model floats and accuracy degrades by one to two orders of magnitude.

**Placement guidelines:**

- Minimum **5 GCPs** for a typical site; more for sites larger than 20 acres or with significant elevation change.
- Distribute GCPs around the **perimeter and interior** of the flight area. Avoid clustering.
- Place additional GCPs at elevation extremes (hilltop, low point) to constrain the vertical adjustment.
- Set **2 to 4 independent checkpoints** that are not used in the adjustment. Checkpoints provide an independent accuracy assessment.

**Target design:**

- Targets should be clearly visible from flight altitude. A 12 to 18 in. cross or checkerboard pattern in contrasting colors (black and white, or orange on dark pavement) works well.
- Use pre-made fabric targets, painted plywood, or spray-painted ground marks.
- Survey each target center with GNSS RTK or total station to the same datum and projection as the project.

## Flight planning

- **Overlap:** 75% forward overlap, 65% side overlap minimum. Higher overlap (80/70) improves matching in uniform-texture areas (bare dirt, grass).
- **Altitude and GSD:** Ground sample distance (GSD) controls the theoretical resolution. For 1 ft contour work, a GSD of 1 to 2 cm/pixel (flight altitude of 200 to 300 ft with a 20 MP camera) is typical.
- **Flight pattern:** Grid pattern for flat sites; crosshatch (two perpendicular grids) for sites with elevation change or complex geometry.
- **Lighting:** Overcast skies produce more uniform exposure than harsh midday sun. Avoid long shadows (early morning, late afternoon) unless the site is flat and treeless.
- **Wind:** Most mapping drones operate reliably up to 15 to 20 mph sustained winds. Higher winds degrade image sharpness and reduce battery endurance.

## Processing software

Common photogrammetric processing platforms:

| Software | Notes |
|---|---|
| Pix4Dmapper | Desktop or cloud; mature, widely used in surveying |
| Agisoft Metashape | Desktop; flexible, well-documented accuracy reporting |
| DroneDeploy | Cloud-based; simpler workflow, less manual control |
| Bentley ContextCapture | Enterprise; strong for large corridor projects |

The processing pipeline: image alignment, dense point cloud generation, GCP refinement, mesh/DSM generation, orthomosaic export. Review the GCP residuals and checkpoint errors before accepting the output. Typical checkpoint RMSE targets for 1 ft contour work: 0.05 to 0.10 ft horizontal, 0.08 to 0.15 ft vertical.

## Accuracy expectations

On **bare, open ground** with good GCP distribution:

- Horizontal: 1 to 2 times the GSD (0.03 to 0.06 ft at 1 cm GSD).
- Vertical: 1.5 to 3 times the GSD (0.05 to 0.10 ft), depending on terrain texture and overlap.

On **vegetated ground**, accuracy degrades because the point cloud models the top of the vegetation, not the bare earth. Photogrammetry cannot penetrate canopy. In grass taller than 6 in., expect vertical errors of 0.2 to 0.5 ft or more. Ground-classification algorithms help in sparse vegetation but are unreliable in dense cover.

On **hard surfaces** (pavement, concrete, rooftops), accuracy is best because the surface is well-defined and has good texture for matching.

## When drone topo replaces conventional

Drones excel at:

- Large, open sites (grading projects, farm fields, open lots) where walking every shot would take days.
- Stockpile volume calculations.
- Rough-grade verification across wide areas.
- Orthophoto production for plan backgrounds.

## When drone topo supplements conventional

Drones cannot replace conventional survey for:

- **Utility features.** Rims, inverts, valve covers, and pipe data require physical measurement.
- **Tree surveys.** Species identification, DBH measurement, and drip lines require a person on the ground.
- **Obscured ground.** Under canopy, under structures, in dense brush.
- **Tight tolerances.** Subgrade checks at 0.02 ft tolerance require rod-and-level methods.
- **Breakline features.** Curb flow lines, swale inverts, and wall bases are better defined by coded conventional shots than by point-cloud extraction.

The most efficient approach for complex sites: fly the drone for general surface coverage and orthophoto, then send a ground crew for utilities, trees, breaklines, and obscured areas. Merge the datasets in Civil 3D.

## Deliverables and Civil 3D integration

Typical drone topo deliverables:

- **Point cloud** (LAS/LAZ) — import into ReCap, then reference in Civil 3D.
- **Raster DSM/DTM** (GeoTIFF) — usable as a Civil 3D raster surface reference.
- **TIN surface** (LandXML) — direct import into Civil 3D.
- **Orthomosaic** (GeoTIFF) — georeferenced image for plan backgrounds.
- **Processing report** — GCP residuals, checkpoint errors, flight parameters.

## Related

- [LiDAR topos](lidar-topos.md)
- [Pre-survey planning](pre-survey-planning.md)
- [Control for topos](control-for-topos.md)
- [Topo QA/QC](topo-qa-qc.md)
- [Difficult ground](difficult-ground.md)
