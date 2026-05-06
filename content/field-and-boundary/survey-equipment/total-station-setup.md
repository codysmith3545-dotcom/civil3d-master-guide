---
title: "Total Station Setup & Checks"
section: "field-and-boundary/survey-equipment"
order: 10
visibility: public
tags: [total-station, edm, prism, setup, collimation]
updated: 2026-05-06
sources:
  - title: "Leica Geosystems — Prism Constants"
    url: https://leica-geosystems.com/
    verified: 2026-05-06
  - title: "Trimble — Prism and Target Overview"
    url: https://www.trimble.com/
    verified: 2026-05-06
  - title: "Wolf & Ghilani — Elementary Surveying, 16th ed."
    url: https://www.pearson.com/
    verified: 2026-05-06
---

> **TL;DR**
> 1. A proper setup means the instrument is **level**, **centered over the point**, and the **target height is measured and recorded correctly**. Rushing the setup is the most common source of preventable error.
> 2. Apply **atmospheric corrections** every session. The PPM correction for standard EDM is approximately C = 281.77 - 0.29065 * P / (1 + 0.00366 * T), where P is pressure in mmHg and T is temperature in degrees Celsius.
> 3. Check **2C error** (horizontal collimation) and **index error** (vertical collimation) at the start of every project. If 2C exceeds the instrument's angular accuracy specification, adjust before collecting data.

## Instrument setup procedure

### Tribrach and optical/laser plumb

1. **Set the tripod** over the point. Spread the legs so the head is roughly level and at a comfortable working height (approximately chin height). Push the legs firmly into the ground.
2. **Attach the tribrach** (or the instrument if using a fixed tribrach). Center the optical plummet or laser plummet on the point by sliding the tribrach on the tripod head.
3. **Level the circular (bull's-eye) bubble** using the tripod leg lengths.
4. **Level the plate bubble** (tubular or electronic) using the tribrach leveling screws. Follow the standard two-step leveling process: align the plate level parallel to two screws, center the bubble, rotate 90 degrees, center with the third screw. Repeat until stable.
5. **Re-check centering.** After leveling, the plummet may have shifted off the point. Loosen the tribrach clamp, slide to re-center over the point, re-tighten, and re-check the level. Iterate until both centering and leveling are correct.
6. **Measure and record the instrument height (HI).** Measure from the point to the tilting axis mark on the instrument. Most instruments mark this with a horizontal line or notch. Measure to the nearest 0.005 ft (or 1 mm). On a sloped setup, measure the slant height and apply the correction, or measure vertically with a tape.

### Target height

Measure the height of the prism (HR) from the ground point to the prism center. For a standard prism pole, this is the pole reading. Verify the pole is plumb (use the pole bubble) and that the correct prism constant is set.

Target height errors are the single most common cause of vertical busts. A 0.1 ft error in HR propagates directly to the elevation of every shot taken from that setup.

## Atmospheric corrections

EDM instruments measure distance using the travel time of an electromagnetic wave. The speed of that wave depends on air temperature, pressure, and humidity. Most modern total stations accept temperature and pressure inputs and compute the correction internally, but you need to understand the formula to verify the instrument is doing it right.

The first-velocity correction in parts per million (PPM) for standard group-refractive-index EDM is:

```
C (ppm) = 281.77 - (0.29065 * P) / (1 + 0.00366 * T)
```

Where:
- P = atmospheric pressure in mmHg (1 atm = 760 mmHg; 1 in Hg = 25.4 mmHg)
- T = air temperature in degrees Celsius

For field conditions in Indiana (say 20 degrees C, 750 mmHg):

```
C = 281.77 - (0.29065 * 750) / (1 + 0.00366 * 20)
    = 281.77 - 217.99 / 1.0732
    = 281.77 - 203.12
    = 78.65 ppm (not applied; correction is negative of this)
```

At standard conditions (15 degrees C, 760 mmHg), C = 0 ppm by design.

**Practical rule:** A 1 degree C temperature error causes approximately 1 ppm distance error. A 2.5 mmHg pressure error causes approximately 1 ppm distance error. On a 1,000 ft shot, 1 ppm = 0.001 ft. For most survey work, reading temperature to the nearest degree and pressure to the nearest 1 mmHg is sufficient.

Measure temperature and pressure at the instrument, ideally with a sling psychrometer or digital weather meter. Do not rely on weather-app readings from a station miles away; local conditions (sun/shade, elevation) matter.

## Prism constants

Each prism has a constant that accounts for the offset between the mechanical center of the prism housing and the effective reflection point inside the glass. Common values:

| Manufacturer / Prism | Constant |
|---|---|
| Leica GPR1 / standard round prism | -34.4 mm |
| Leica GMP111 mini prism | -16.5 mm |
| Trimble with Trimble prisms | 0 mm (Trimble instruments apply the constant internally) |
| Trimble prism used on non-Trimble instrument | -17.5 mm |
| Topcon standard prism | -30 mm |
| Sokkia standard prism | -30 mm |
| Generic 0 mm prism (360-degree type varies) | Check manufacturer spec |

**Mixing prisms and instruments across manufacturers is a common source of systematic distance error.** If you use a Leica prism on a Trimble instrument, you must manually enter the Leica prism constant. Verify by measuring a known baseline distance and comparing.

## Checking and adjusting 2C error (horizontal collimation)

The 2C error is twice the collimation error — the angle by which the line of sight deviates from the perpendicular to the horizontal axis. To check:

1. Set up the instrument and sight a well-defined target at least 300 ft (100 m) away.
2. Read the horizontal angle in **Face 1** (direct position).
3. Plunge the telescope and read the horizontal angle in **Face 2** (reverse position).
4. Compute: 2C = Face 1 - (Face 2 +/- 180 degrees). The sign convention varies by manufacturer; consult your manual.

For a 2-second instrument, 2C should be less than about 10 seconds. If it exceeds this, adjust electronically (most modern instruments have an on-board calibration routine) or send the instrument for service.

**Taking face-1 and face-2 readings and meaining eliminates 2C error from the final value.** This is the primary reason to observe in both faces for control work.

## Checking index (vertical) error

The index error is the zero-offset of the vertical circle. To check:

1. Sight a target in Face 1 and read the zenith angle (Z1).
2. Plunge and sight the same target in Face 2; read the zenith angle (Z2).
3. Index error = (Z1 + Z2 - 360 degrees) / 2.

For a 2-second instrument, the index error should be less than about 10 seconds. Most instruments allow electronic adjustment. Alternatively, observing in both faces and meaning eliminates the index error.

## Reflectorless (prismless) mode

Modern total stations can measure distances without a prism by using a stronger laser pulse reflected from the target surface. Use reflectorless mode when:

- Access to the point is impossible or unsafe (building face, bridge soffit, traffic area).
- You need to shoot points that cannot hold a prism (wall corners, overhead obstructions).

Limitations of reflectorless mode:

- **Accuracy is reduced.** Typical reflectorless accuracy is 2-3 mm + 2 ppm at moderate range, compared to 1-2 mm + 1 ppm with a prism. At long range (over 500 ft), the accuracy degrades further.
- **The beam footprint spreads.** At 300 ft, the laser spot may be 10-15 mm wide, making it difficult to hit the exact point you intend. The return signal represents an average across the spot.
- **Surface reflectivity matters.** Dark or wet surfaces return weaker signals, reducing range and accuracy. Highly reflective surfaces (glass, metal) may give spurious returns.
- **Not suitable for control work.** Never use reflectorless mode for traverse or control observations where you need sub-centimeter accuracy.

## Related

- [GNSS RTK](gnss-rtk.md)
- [Calibration and maintenance](calibration-and-maintenance.md)
- [Data collectors](data-collectors.md)
- [Control for topographic surveys](../topographic-surveys/control-for-topos.md)
- [Network adjustment in Civil 3D](../../civil3d/survey/network-adjustment.md)
