---
title: "LiDAR for Topographic Surveys"
section: "field-and-boundary/topographic-surveys"
order: 40
visibility: public
tags: [lidar, point-cloud, mobile-lidar, static-scanner, recap, feature-extraction]
updated: 2026-05-06
sources:
  - title: "ASPRS Positional Accuracy Standards for Digital Geospatial Data (2023)"
    url: https://www.asprs.org/asprs-positional-accuracy-standards
    verified: 2026-05-06
---

> **TL;DR**
> 1. LiDAR (mobile or static) captures millions of points per second and can penetrate partial canopy to reach the ground — making it superior to photogrammetry in vegetated areas and faster than conventional survey on complex sites.
> 2. Accuracy depends on **scanner quality, control, registration, and ground classification** — expect 0.02 to 0.05 ft on hard surfaces with good control, degrading to 0.1 ft or more on soft or vegetated ground.
> 3. The raw point cloud is not a finished topo. It requires **classification, feature extraction, and breakline drafting** before it becomes a Civil 3D surface — budget office processing time accordingly.

## Scanner types

### Static (terrestrial) laser scanning (TLS)

A tripod-mounted scanner captures a dense, high-accuracy point cloud from a fixed position. The scanner is moved to multiple setup positions to cover the site; overlapping scans are registered together.

- **Accuracy:** 0.01 to 0.03 ft per scan at short range (less than 150 ft). Registration error adds to this.
- **Density:** Millions of points per setup. Point spacing of 0.01 to 0.1 ft is typical at moderate range.
- **Best for:** Small to medium sites with complex geometry (buildings, retaining walls, bridge abutments), where the detail density justifies the setup time.
- **Limitation:** Each setup sees only the hemisphere facing the scanner. Shadowed areas require additional setups or supplemental measurement.

Common instruments: Leica RTC360, Trimble X7, Faro Focus, RIEGL VZ series.

### Mobile laser scanning (MLS)

A scanner mounted on a vehicle, backpack, or handheld platform captures data while moving. An IMU/GNSS system tracks the scanner's position and orientation.

- **Vehicle-mounted:** Scanner on a truck or ATV. Captures roadway corridors at driving speed. Accuracy: 0.02 to 0.05 ft with good GNSS conditions and control.
- **Backpack/handheld:** SLAM-based systems (simultaneous localization and mapping) that work where GNSS is unavailable (under bridges, indoors). Accuracy: 0.03 to 0.10 ft, depending on SLAM drift and loop closures.
- **Best for:** Large sites, corridors, and areas where static scanning would require dozens of setups.

Common instruments: Trimble MX50/MX90, Leica Pegasus, GreenValley LiBackpack, Emesent Hovermap (for confined/GPS-denied).

### Airborne LiDAR (drone-mounted)

A LiDAR sensor mounted on a UAS. Combines the aerial coverage of a drone flight with LiDAR's ability to penetrate canopy.

- **Accuracy:** 0.03 to 0.10 ft vertical on bare ground with good control, depending on the sensor and flight altitude.
- **Canopy penetration:** Multi-return LiDAR captures ground returns through gaps in tree canopy — a significant advantage over photogrammetry.
- **Best for:** Wooded sites, large parcels, and corridor mapping where canopy blocks photogrammetric ground modeling.

Common sensors: DJI Zenmuse L2, YellowScan Mapper, RIEGL miniVUX, Trimble APX-15 with Velodyne.

## Registration and control

### Static scan registration

Multiple static scans are aligned using:

- **Targets:** Spheres or checkerboard targets placed in overlapping scan areas. Survey the targets with GNSS or total station for georeferencing.
- **Cloud-to-cloud:** Software matches overlapping geometry (walls, curbs, poles) between scans. Accurate but can drift over many setups without surveyed control.
- **Combination:** Use targets for georeferencing and cloud-to-cloud for fine alignment. This is the most reliable approach.

Registration residuals should be reviewed scan by scan. A single poorly registered scan will introduce a visible seam in the merged cloud.

### Mobile scan control

Mobile systems rely on GNSS/IMU trajectory for initial positioning. Post-processing the trajectory against a base station or CORS improves accuracy. Ground control points (surveyed targets or known features) are used to verify and adjust the trajectory.

For mobile scans, distribute control points along the corridor at intervals no greater than 500 to 1,000 ft, and always at the beginning and end of each run.

## Point cloud processing

Raw point clouds contain millions to billions of points, including vegetation, vehicles, people, and noise. Processing steps:

1. **Import and merge.** Combine all scans or trajectory segments into a single project. Verify registration.
2. **Noise removal.** Delete obvious outliers (birds, multipath, scanner artifacts).
3. **Classification.** Assign each point to a class: ground, vegetation (low, medium, high), building, noise, water, etc. Automated ground classification algorithms (progressive morphological filter, cloth simulation filter) work well on open terrain but require manual editing in complex areas.
4. **Bare-earth extraction.** Filter to ground-classified points only. This is the basis for the topographic surface.
5. **Thinning (optional).** Reduce point density to a manageable level for surface modeling. A 0.5 to 1.0 ft grid thinning is common for Civil 3D surfaces; keep full density along breakline features.

## Feature extraction

LiDAR captures geometry but not feature identity. Extracting survey features (curbs, edges of pavement, building corners, utility structures) from the point cloud is a manual or semi-automated office task.

- **Curbs and pavement edges:** Visible as linear grade breaks in the classified ground cloud. Trace them in a 3D viewer or use edge-detection tools.
- **Building footprints:** Extract from building-classified points or from intensity images.
- **Utility structures:** Manholes, valve boxes, and hydrants appear as small geometric features in the cloud but often require conventional field verification for attributes (rim elevation, invert, pipe size).
- **Trees:** Canopy extents are visible in the unclassified cloud. DBH and species still require field measurement.

Feature extraction is the most labor-intensive part of a LiDAR topo. Budget 50 to 100% of the field time as additional office processing time, depending on site complexity.

## Accuracy vs. density tradeoffs

More points do not automatically mean higher accuracy. Factors that control accuracy:

- **Control quality.** The point cloud is only as accurate as its georeference. Poor control shifts the entire cloud.
- **Scanner noise.** Each individual point has measurement noise (range noise). Averaging many points reduces the effective noise on a surface, but individual point accuracy may be 0.01 to 0.03 ft.
- **Classification accuracy.** If a vegetation point is misclassified as ground, it raises the surface. Manual review of classified ground is essential in vegetated areas.
- **Registration error.** Poorly aligned scans introduce systematic offsets.

For most Civil 3D surface modeling, a thinned ground cloud at 0.5 to 1.0 ft spacing with manually verified breaklines produces a surface comparable to a conventional topo at 25 ft shot spacing — but with better coverage in complex terrain.

## Integrating point clouds into Civil 3D

1. **ReCap.** Import LAS/LAZ or E57 files into Autodesk ReCap to create an RCP/RCS project. ReCap handles visualization, clipping, and basic classification.
2. **Attach in Civil 3D.** Insert the ReCap point cloud as a reference. Use it as a visual backdrop and for point-cloud surface creation.
3. **Point cloud surface.** Civil 3D can create a TIN surface directly from a point cloud (added in Civil 3D 2020+). Set a maximum triangle length to avoid spanning gaps. This is useful for quick surfaces but may lack the precision of a breakline-enforced surface.
4. **Breakline-enforced surface.** The preferred workflow: extract breaklines from the cloud (in Civil 3D, MicroStation, or a point-cloud processing tool), then build the surface from the classified ground points plus the breaklines.

## Related

- [Drone topos](drone-topos.md)
- [Difficult ground](difficult-ground.md)
- [Breakline strategy](breakline-strategy.md)
- [Topo QA/QC](topo-qa-qc.md)
- [Pre-survey planning](pre-survey-planning.md)
