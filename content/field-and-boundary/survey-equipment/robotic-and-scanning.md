---
title: "Robotic Total Stations & Scanning"
section: "field-and-boundary/survey-equipment"
order: 60
visibility: public
tags: [robotic, total-station, scanning, lidar, point-cloud]
updated: 2026-05-06
sources:
  - title: "Trimble — SX12 Scanning Total Station"
    url: https://geospatial.trimble.com/
    verified: 2026-05-06
  - title: "Leica Geosystems — RTC360 Scanner"
    url: https://leica-geosystems.com/
    verified: 2026-05-06
  - title: "ASPRS — Positional Accuracy Standards for Digital Geospatial Data"
    url: https://www.asprs.org/
    verified: 2026-05-06
---

> **TL;DR**
> 1. **Robotic total stations** enable one-person crews, but lock-loss in dense vegetation or high-traffic areas reduces efficiency. They work best in open areas with clear line-of-sight.
> 2. **Terrestrial laser scanning (TLS)** captures millions of points in minutes, making it superior for as-built documentation, complex topo, and facades. Registration accuracy depends on target placement and overlap.
> 3. For Civil 3D deliverables, point clouds must be converted to surfaces, breaklines, or feature-extracted linework. The raw point cloud alone is not a finished survey product.

## Robotic total stations

A robotic total station has servo motors and automatic target recognition (ATR) that allow it to track and follow a prism carried by a single rod person. The instrument operator works at the prism pole, controlling the instrument remotely via the data collector.

### One-person crew workflow

1. **Set up the instrument** on a known point and sight a backsight. Lock onto the backsight prism, verify the angle and distance, and accept the orientation.
2. **Walk to each shot point** with the prism pole and data collector. The instrument tracks the prism as you move.
3. **Pause at each point**, let the instrument lock on, and trigger the measurement from the collector.
4. **Monitor lock status.** When the instrument loses lock (obstructed line of sight), it enters search mode. Some instruments search quickly (1-3 seconds); others may take 10-30 seconds or fail to reacquire.

### Advantages

- Eliminates one crew member (significant cost savings on labor-intensive projects).
- The person at the rod can verify feature identification on the spot rather than relying on radio communication.
- Modern robotics with ATR achieve measurement accuracy equal to conventional mode (1-2 mm + 1 ppm EDM, 1-2" angular).

### Limitations

- **Lock-loss** in areas with dense vegetation, moving traffic, pedestrians, or other prisms operating nearby. Frequent lock-loss makes robotics slower than a two-person crew.
- **No one watches the instrument.** Theft, disturbance by the public, or tripod settlement goes unnoticed until the next backsight check.
- **Battery consumption** is higher due to servo motors and ATR. Carry spare batteries.
- **Prism pole stability** is more critical when the rod person is also the observer. Use a bipod for shots where sub-centimeter accuracy is needed.

## Terrestrial laser scanning (TLS)

TLS instruments (e.g., Leica RTC360, Trimble X7, Faro Focus, Topcon GLS-2200) emit thousands to millions of laser pulses per second, creating a dense 3D point cloud of the scanned environment.

### Typical applications

- **As-built surveys** of buildings, bridges, and utilities where high detail is needed.
- **Topographic surveys** of complex sites (quarries, stockpiles, embankments) where conventional point-by-point collection would be impractical.
- **Facade and interior documentation** for renovation or BIM projects.
- **Forensic / accident reconstruction.**

### Scan workflow

1. **Plan scan positions.** Each scan captures a hemispherical (or near-hemispherical) point cloud from the instrument's location. Overlap between adjacent scans should be at least 30% for reliable registration. Typical spacing: 15-50 m depending on site complexity and required density.
2. **Place registration targets.** Checkerboard or sphere targets placed in overlapping areas allow the software to align (register) scans to each other. Use at least 3 common targets between adjacent scan pairs, well-distributed in 3D (not all in a plane).
3. **Scan.** Each scan takes 1-5 minutes depending on resolution setting and instrument. Higher resolution increases file size and processing time.
4. **Tie to survey control.** Occupy at least 3-4 targets with GNSS or total station to georeference the point cloud in the project coordinate system. More control points improve the georeferencing accuracy and provide redundancy for quality checks.
5. **Register scans** in office software. Registration quality is reported as RMS of target residuals and cloud-to-cloud alignment error. Target residuals should be less than 3-5 mm for typical survey work; cloud-to-cloud alignment should be less than 5-10 mm.

### Point cloud density

Density depends on scan resolution and range. At 10 m range with a medium resolution setting, typical density is 3-6 mm point spacing. At 50 m range, density drops to 15-30 mm spacing. Specify the required density based on the deliverable:

- 1 ft contour topo: 25-50 mm spacing is sufficient.
- Detailed as-built (pipe inverts, structural members): 5-10 mm spacing.
- BIM modeling: 3-5 mm spacing.

## Scanning vs conventional for topo and as-built

| Factor | Conventional (total station/GNSS) | TLS |
|---|---|---|
| Data density | Selective (operator chooses points) | Comprehensive (captures everything in line of sight) |
| Field time | Longer for complex sites | Shorter for complex sites; similar for simple sites |
| Office time | Minimal processing | Significant processing (registration, classification, extraction) |
| Feature identification | Identified in the field by surveyor | Must be interpreted from point cloud in the office |
| Accuracy (individual points) | 0.01-0.02 ft | 0.01-0.02 ft at moderate range |
| Missed features | Possible (operator did not shoot it) | Unlikely (captured if in line of sight) |
| Under canopy | Works fine (prism/reflectorless) | Poor (laser returns from leaves, not ground) |
| File sizes | Small (KB) | Very large (GB per scan) |

For most survey firms, the best approach is hybrid: use TLS for areas with high complexity or detail requirements, and conventional methods for areas with canopy, simple terrain, or where specific features (underground utilities, property corners) must be positively identified.

## Mobile mapping

Mobile mapping systems mount scanners, cameras, and GNSS/IMU units on a vehicle (car, ATV, backpack, or drone) to collect point clouds while moving. They are effective for corridor surveys (roads, highways, railroads, pipelines) where linear coverage is needed.

Accuracy is typically 0.03-0.10 ft depending on the system and GNSS conditions. This is sufficient for many topo applications but may not meet requirements for boundary or precise vertical control.

## Extracting deliverables for Civil 3D

The point cloud itself is a data source, not a finished deliverable. To create Civil 3D-compatible products:

### Point cloud to surface

1. Import the point cloud into Civil 3D (RCS/RCP format via Autodesk ReCap).
2. Classify ground points (remove vegetation, vehicles, structures) using ReCap, CloudCompare, or similar software.
3. Create a TIN surface from the classified ground points. Alternatively, downsample to a regular grid and create the surface from the grid.
4. Add breaklines manually where the point cloud defines edges (top of curb, flowline, ditch bottom) that the TIN surface might bridge incorrectly.

### Feature extraction

1. Use feature extraction software (Trimble RealWorks, Leica Cyclone, TopoDOT, or Civil 3D's point cloud tools) to trace linework from the point cloud.
2. Extract 3D polylines for edges of pavement, curbs, building footprints, and other features.
3. Import the extracted linework into Civil 3D as standard drawing objects.

### Practical notes

- Feature extraction from point clouds is labor-intensive and requires a skilled operator. Budget office time accordingly.
- Always field-verify critical features (utility inverts, property corners, hidden conditions) that the scanner cannot see.
- Attach the point cloud to the Civil 3D drawing as a visual reference even after extracting surfaces and features. It allows future users to check interpretations against the original data.

## Related

- [Total station setup](total-station-setup.md)
- [Data collectors](data-collectors.md)
- [GNSS RTK](gnss-rtk.md)
- [Control for topographic surveys](../topographic-surveys/control-for-topos.md)
- [Civil 3D point clouds and surfaces](../../civil3d/survey/survey-database.md)
