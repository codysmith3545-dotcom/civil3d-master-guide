---
title: "Setting the Coordinate System in Civil 3D"
section: "field-and-boundary/coordinate-systems"
order: 45
visibility: public
tags: [civil3d, coordinate-system, drawing-settings, state-plane, nad83, indiana]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [EDITDRAWINGSETTINGS, MAPCSASSIGN, AECC_COORDINATE_SYSTEM]
updated: 2026-05-06
---

> **TL;DR**
> 1. Set the coordinate system in Drawing Settings > Units and Zone tab. Select the category (USA, Indiana) and the zone (Indiana East FIPS 1301 or Indiana West FIPS 1302, NAD83).
> 2. Save the setting in your drawing template (DWT) so every new drawing starts with the correct zone. A mismatch between drawings causes XREF shifts and data-sharing errors.
> 3. If coordinates look wrong after setting the zone (points shifted by thousands of feet), the data was likely created in a different coordinate system or with no system assigned — use coordinate transformation, not reassignment.

## Setting the coordinate system

1. Open the Drawing Settings dialog:
   - Toolspace > Settings tab > right-click the drawing name > Edit Drawing Settings.
   - Or type `EDITDRAWINGSETTINGS` at the command line.
2. Go to the **Units and Zone** tab.
3. Under **Zone**, select:
   - **Categories:** United States - Indiana
   - **Available coordinate systems:** Choose the appropriate zone:
     - `NAD83 Indiana State Planes, East Zone, US Foot` (FIPS 1301) — covers the eastern part of Indiana, roughly east of a line from Terre Haute to Kokomo.
     - `NAD83 Indiana State Planes, West Zone, US Foot` (FIPS 1302) — covers the western part of Indiana.
   - For NAD83(2011) realization, select the corresponding entry if available, or note the realization in your project metadata.
4. Set **Drawing units** to US Foot (not International Foot) for Indiana work.
5. Click **Apply** and **OK**.

Alternatively, use `MAPCSASSIGN` to assign a coordinate system by EPSG code or coordinate system code string.

### Common coordinate system codes for Indiana

| Zone | Civil 3D code | EPSG |
|---|---|---|
| Indiana East, NAD83, US Foot | IN83-EF | 2965 |
| Indiana West, NAD83, US Foot | IN83-WF | 2966 |
| Indiana East, NAD83(2011), US Foot | — | 6457 |
| Indiana West, NAD83(2011), US Foot | — | 6458 |

Note: Civil 3D's built-in coordinate system library may use different code strings depending on the version. Search by FIPS code (1301 or 1302) if the name search does not return expected results.

## Saving in a template

To ensure every new drawing uses the correct zone:

1. Open your office DWT file.
2. Set the coordinate system as above.
3. Save the DWT.

All drawings created from this template will inherit the coordinate system. Drawings created from `acad.dwt` or other generic templates have no coordinate system assigned and will cause problems when combined with georeferenced data.

## Troubleshooting mismatched coordinate systems

### Symptoms

- XREF inserts thousands or millions of feet from the host drawing origin.
- Points imported from a CSV or PNEZD file plot in the wrong location.
- A surface imported from LandXML does not align with existing data.

### Diagnosis

1. Check the coordinate system of each drawing involved (Drawing Settings > Units and Zone).
2. Check whether the source data uses a different zone, datum, or unit (International Foot vs. US Foot).
3. Check whether one drawing has no coordinate system assigned (listed as "No Datum, No Projection").

### Resolution

- If both drawings use the same coordinate system and the shift persists, the source data was likely collected in a different system. Use coordinate transformation (not reassignment) to convert.
- If one drawing has no coordinate system and the other does, assign the correct system to the unassigned drawing. This does not transform coordinates — it tells Civil 3D what the existing coordinates mean.
- **Do not reassign a coordinate system to transform data.** Changing the assigned system tells Civil 3D to interpret existing numbers in the new system; it does not convert the numbers. Use `MAPIMPORT` with "assign coordinate system to source" or external transformation tools.

### US Foot vs. International Foot

Indiana uses the US Survey Foot (1 ft = 1200/3937 m). The International Foot (1 ft = 0.3048 m exactly) differs by approximately 0.01 ft per mile. Selecting the wrong foot definition causes a systematic position error that grows with distance from the origin. Always select the "US Foot" variant for Indiana state plane coordinates.

## Related

- [State Plane Indiana quick reference](state-plane-indiana-quick-reference.md)
- [Combined scale factor](combined-scale-factor.md)
- [Datums and projections](datums-and-projections.md)
- [Transforming coordinates](transforming-coordinates.md)
