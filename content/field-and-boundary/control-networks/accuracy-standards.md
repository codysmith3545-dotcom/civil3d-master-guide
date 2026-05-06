---
title: "Accuracy Standards"
section: "field-and-boundary/control-networks"
order: 60
visibility: public
tags: [accuracy, fgdc, asprs, standards, positional-accuracy]
updated: 2026-05-06
sources:
  - title: "FGDC-STD-007.4-2002 — Geospatial Positioning Accuracy Standards, Part 4: Architecture, Engineering, Construction, and Facilities Management"
    url: https://www.fgdc.gov/standards/projects/accuracy/part4/GeosijPatialPositioningAccuracyStandards_part4.pdf
    verified: 2026-05-06
  - title: "ASPRS — Positional Accuracy Standards for Digital Geospatial Data, Edition 2, 2023"
    url: https://www.asprs.org/
    verified: 2026-05-06
  - title: "ALTA/NSPS 2021 Minimum Standard Detail Requirements"
    url: https://www.nsps.us.com/
    verified: 2026-05-06
  - title: "Indiana Administrative Code 865 IAC 1-12"
    url: https://www.in.gov/pla/professions/land-surveyor/
    verified: 2026-05-06
---

> **TL;DR**
> 1. The **FGDC Geospatial Positioning Accuracy Standards** define how to report positional accuracy using RMSE at the 95% confidence level. This is the framework for federal and most state work.
> 2. The **ASPRS Positional Accuracy Standards (2023)** define accuracy classes for digital geospatial data (maps, lidar, imagery) using RMSE-based thresholds.
> 3. For land title surveys, the **ALTA/NSPS standard** defines Relative Positional Accuracy: 0.07 ft + 50 ppm at the 95% confidence level. Table A Item 6 requires an explicit accuracy statement from a network adjustment.
> 4. Indiana minimum standards (865 IAC 1-12) set baseline requirements for surveying practice in the state.

## FGDC Geospatial Positioning Accuracy Standards

The Federal Geographic Data Committee (FGDC) standard FGDC-STD-007 provides a framework for reporting positional accuracy of geospatial data. Key concepts:

### Accuracy vs precision

- **Accuracy:** How close a measured position is to its true position. Includes both systematic and random errors.
- **Precision:** The repeatability of measurements. A precise but inaccurate survey consistently puts points in the wrong place.

FGDC reports accuracy, not precision. A survey can be very precise (tight cluster of repeated measurements) but inaccurate (cluster is offset from the true position) if there is a systematic error.

### RMSE reporting

The FGDC standard reports accuracy as Root Mean Square Error (RMSE) in the horizontal (RMSEr) and vertical (RMSEz) components.

**Horizontal accuracy (RMSEr):**

```
RMSEx = sqrt( sum((x_surveyed - x_check)^2) / n )
RMSEy = sqrt( sum((y_surveyed - y_check)^2) / n )
RMSEr = sqrt(RMSEx^2 + RMSEy^2)
```

Where x_check and y_check are independent check point coordinates of higher accuracy.

**95% confidence level:** For horizontal positions with approximately circular error distribution, the 95% confidence value = 1.7308 * RMSEr.

**Vertical accuracy (RMSEz):**

```
RMSEz = sqrt( sum((z_surveyed - z_check)^2) / n )
```

95% confidence vertical accuracy = 1.9600 * RMSEz (assumes normal distribution).

### FGDC accuracy classes for geodetic control

| Classification | Horizontal accuracy (95%) | Vertical accuracy (95%) |
|---|---|---|
| 1st order | 0.01 m (0.03 ft) | 0.005 m (0.02 ft) |
| 2nd order Class I | 0.02 m (0.07 ft) | 0.006 m (0.02 ft) |
| 2nd order Class II | 0.05 m (0.16 ft) | 0.008 m (0.03 ft) |
| 3rd order Class I | 0.10 m (0.33 ft) | 0.012 m (0.04 ft) |
| 3rd order Class II | 0.20 m (0.66 ft) | 0.012 m (0.04 ft) |

## ASPRS Positional Accuracy Standards (2023)

The American Society for Photogrammetry and Remote Sensing (ASPRS) published updated accuracy standards in 2023 (Edition 2) that define accuracy classes for digital geospatial data. These standards apply to aerial mapping, lidar, orthophotography, and ground surveys used to support those products.

### Accuracy classes

ASPRS defines accuracy classes by the RMSE thresholds for horizontal and vertical components. The classes are named by the RMSEx/RMSEy value in centimeters:

| ASPRS Class | RMSEx = RMSEy | RMSEr (horizontal) | RMSEz (vertical, non-vegetated) |
|---|---|---|---|
| 1 cm | 1.0 cm (0.03 ft) | 1.4 cm (0.05 ft) | 1.0 cm (0.03 ft) |
| 2.5 cm | 2.5 cm (0.08 ft) | 3.5 cm (0.12 ft) | 2.5 cm (0.08 ft) |
| 5 cm | 5.0 cm (0.16 ft) | 7.1 cm (0.23 ft) | 5.0 cm (0.16 ft) |
| 10 cm | 10.0 cm (0.33 ft) | 14.1 cm (0.46 ft) | 10.0 cm (0.33 ft) |
| 15 cm | 15.0 cm (0.49 ft) | 21.2 cm (0.70 ft) | 15.0 cm (0.49 ft) |

### Check points

ASPRS specifies minimum numbers of check points for accuracy testing:

- **Horizontal:** At least 20 check points, well-distributed across the project area.
- **Vertical (non-vegetated):** At least 20 check points on hard, open surfaces.
- **Vertical (vegetated):** At least 20 additional check points in vegetated areas (for lidar/photogrammetric data).

Check points must be of higher accuracy than the data being tested — typically surveyed using GNSS static or precise leveling.

## How accuracy classes map to project requirements

| Project type | Typical ASPRS class | Practical interpretation |
|---|---|---|
| Survey-grade control network | 1 cm or 2.5 cm | Sub-inch accuracy. Static GNSS or precise traverse required. |
| ALTA/NSPS land title survey | 2.5 cm (approximately) | 0.07 ft + 50 ppm Relative Positional Accuracy. |
| 1 ft contour topographic survey | 5 cm horizontal, 5 cm vertical | Achievable with RTK GNSS or robotic total station. |
| 2 ft contour topographic survey | 10 cm horizontal, 10 cm vertical | Achievable with RTK GNSS. |
| Aerial lidar for engineering design | 5 cm vertical | QL1 or QL2 lidar with ground control. |
| Aerial mapping for planning | 15 cm | Standard aerial photogrammetry. |

## Computing and reporting positional accuracy

### From a network adjustment

If you run a least-squares adjustment, the software reports standard deviations (sigma) for each adjusted coordinate. Convert to 95% confidence:

```
Horizontal accuracy (95%) = 2.4477 * average(sigma_N, sigma_E)
```

This uses the 95% confidence multiplier for a 2D normal distribution. For non-circular error ellipses, the computation is more complex; use the semi-major axis of the 95% error ellipse.

Alternatively, if the adjustment reports a circular error probable (CEP) or 95% error ellipse directly, use those values.

### From check points

If you have independent check points (surveyed by a higher-accuracy method):

1. Compute the difference between the survey coordinate and the check point coordinate for each check point.
2. Compute RMSEx, RMSEy, and RMSEz per the FGDC formulas above.
3. Compute RMSEr = sqrt(RMSEx^2 + RMSEy^2).
4. Report the 95% confidence values: 1.7308 * RMSEr (horizontal) and 1.9600 * RMSEz (vertical).
5. State the number of check points, their distribution, and their accuracy class.

### ALTA/NSPS Relative Positional Accuracy

For ALTA/NSPS surveys, the accuracy metric is **Relative Positional Accuracy (RPA)** — the accuracy of positions relative to each other within the survey, not relative to an external datum. The 2021 standard requires:

```
RPA <= 0.07 ft + 50 ppm at the 95% confidence level
```

For a 1,000 ft distance, the allowable RPA = 0.07 + (50/1,000,000) * 1,000 = 0.07 + 0.05 = 0.12 ft. For a 100 ft distance, RPA = 0.07 + 0.005 = 0.075 ft.

RPA is demonstrated through a least-squares adjustment of the survey observations. The adjusted relative positional uncertainty between any two points in the survey must meet the threshold.

When Table A Item 6 is selected, the surveyor must provide an explicit statement of the positional accuracy achieved, supported by the adjustment results.

## Indiana minimum technical standards

Indiana's minimum standards for land surveying (865 IAC 1-12) establish requirements for survey practice in the state. Key provisions include:

- Minimum angular closure, linear closure, and measurement procedures for boundary surveys.
- Requirements for monument recovery and description.
- Requirements for plat content and certification language.

These standards set a floor, not a ceiling. Project specifications, client requirements, and professional judgment may require tighter tolerances. Always check the current version of 865 IAC 1-12 and any applicable local ordinances.

## Related

- [Network design](network-design.md)
- [Least-squares concepts](least-squares-concepts.md)
- [GNSS static](gnss-static.md)
- [Level networks](level-networks.md)
- [Localization](localization.md)
- [Network adjustment in Civil 3D](../../civil3d/survey/network-adjustment.md)
