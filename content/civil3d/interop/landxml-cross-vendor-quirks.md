---
title: "LandXML Cross-Vendor Quirks"
section: "civil3d/interop"
order: 30
visibility: public
tags: [landxml, bentley, openroads, trimble, tbc, geopak, leica, interop, quirks]
appliesTo: [landxml-1.2, landxml-2.0]
updated: 2026-05-11
---

> **TL;DR**
> 1. Every vendor's LandXML implementation deviates from the spec in small but predictable ways. The four you will hit most are **Civil 3D**, **Bentley OpenRoads / OpenRail (formerly Geopak / InRoads / MX)**, **Trimble Business Center (TBC)**, and **Leica Infinity**.
> 2. The biggest cross-vendor incompatibilities cluster in: spiral types (clothoid vs Bloss vs sinusoidal), profile vertical-curve types (parabolic, asymmetric parabolic, circular), survey database export, and pressure-pipe extensions.
> 3. Workarounds: export the lowest-common-denominator version (LandXML 1.2), turn off cross sections and superelevation unless explicitly requested, validate against the XSD before sending, and **always** include a small README naming the source application + version + units.

## Vendor matrix

| Issue | Civil 3D | OpenRoads | TBC | Geopak | Leica Infinity |
|---|---|---|---|---|---|
| LandXML 2.0 read | yes | yes (2018+) | yes (5.0+) | yes (via OpenRoads engine) | partial |
| LandXML 2.0 write | yes | yes | optional | yes | no (1.2 only) |
| `<PipeNetworks>` 2.0 | read/write | read | ignore | read | ignore |
| Pressure pipes (`PressurePipeNetworks` ext) | read/write own | ignore | ignore | ignore | ignore |
| Spiral type "clothoid" | yes | yes | yes | yes | yes |
| Spiral types Bloss/sinusoidal/cosine | yes (2024+) | yes | partial | yes | no |
| Asymmetric parabolic VC | yes | yes | partial (3.x+) | yes | no |
| Survey raw observations | read/write | read only | yes | partial | yes |
| Linework code parsing on import | description-key based | feature-string based | FXL based | code-table | XML coding |
| Coordinate system from `<CoordinateSystem>` | applied if matched | applied | ignored on read (uses project) | applied | ignored on read |

## Specific known incompatibilities

### Civil 3D ⇄ Bentley OpenRoads

- **Alignment station equations.** OpenRoads expresses station equations through a `<StaEquation>` block; Civil 3D's importer reads them but the resulting alignment will not have an "equation" relationship — the alignment is split into a new alignment at each equation. Workaround: import, then re-add equations manually.
- **Profile from OpenRoads → Civil 3D.** OpenRoads writes profiles with `<CircCurve>` (true circular vertical curves). Civil 3D imports these as `<ParaCurve>` parabolic with the same chord, introducing 0.0–0.05 ft elevation error mid-curve depending on length. For paving tolerance work, recreate the vertical curve in Civil 3D as a circular curve manually.
- **Surface from Civil 3D → OpenRoads.** OpenRoads expects `<Definition surfType="TIN">`. Civil 3D's exporter occasionally writes `surfType="grid"` for grid-surface (DEM) exports — OpenRoads will reject the surface. Force TIN by exporting from a TIN surface, not a grid/DEM surface.
- **Corridor.** Neither side round-trips corridors via LandXML; use IFC 4.3 with the OpenRoads IFC export, or send the alignment + cross-sections and rebuild.

### Civil 3D ⇄ Trimble Business Center

- **Linework vs figures.** Civil 3D survey figures export as `<PlanFeature>` polylines, *not* as `<Survey>/<Figure>` (which the schema lacks for linework anyway). TBC reads them as plain linework and loses the survey-figure association. Re-codify on the TBC side.
- **Description key auto-styling.** TBC ignores Civil 3D description keys entirely; the `<CgPoint code="EP">` field is treated as a free-text label. To preserve point styling in TBC, embed a Trimble feature code in the `code` attribute (e.g. `code="EP01"` matching a TBC feature code in the `.fxl`).
- **Heights.** TBC's default vertical mode is ellipsoidal; Civil 3D's is orthometric. Both are written into the same body text. Always state vertical datum in `<CoordinateSystem verticalDatum="...">` and confirm with the recipient — unit mismatch can disguise a 30 m geoid offset.
- **TBC 5.7+** quietly upgraded to LandXML 2.0 read/write but still writes `<CgPoints>` with `pntSurv` blank for non-control points; Civil 3D reads them as `sideShot` by default.

### Civil 3D ⇄ Geopak (legacy)

Geopak is now part of OpenRoads but legacy DOTs (Indiana INDOT pre-2020 included) still exchange `.dgn`-based projects with LandXML overlays. Specific quirks:

- **GPK file export is one-way to LandXML.** You cannot re-import a LandXML alignment into a GPK and have it match station-by-station; rounding accumulates.
- **Geopak's Project Manager** prefers LandXML 1.2 even where 2.0 is available.

### Trimble Business Center ⇄ Leica Infinity

Of historical note: both write LandXML 1.2 by default. Trimble writes survey observations under `<Survey>/<ObservationGroup>`; Leica writes them under `<Survey>/<InstrumentSetup>` directly. Each can read the other but reduced-observation order may shuffle.

## Recommended cross-vendor profile

When sending LandXML to an unknown recipient:

1. Write **LandXML 1.2** unless the recipient confirmed 2.0 support.
2. Include **`<CoordinateSystem epsgCode="…" horizontalDatum="…" verticalDatum="…"/>`** explicitly.
3. **Disable** cross-section and superelevation export unless requested.
4. Disable pressure-pipe export entirely; pressure pipes have no standard schema.
5. Force `linearUnit="foot"` (intl) or `linearUnit="meter"` deliberately; never leave it blank or use `surveyFoot` unless the recipient is in a US State Plane Zone and uses ftUS.
6. Validate against the XSD before sending. A free option: `xmllint --noout --schema LandXML-1.2.xsd file.xml`.
7. Send a one-paragraph README: source app + version, coord system, vertical datum, units, what objects are included.

## Common pitfalls

- **"OpenRoads imported the alignment but it ends 1.2 ft short."** Spiral A-value vs spiral length mismatch — Civil 3D wrote both `length` and `radiusEnd`, OpenRoads recomputed length from radius and the rounding diverges. Round station to nearest hundredth before exporting.
- **"TBC imports my points but loses the elevation."** Body text was `northing easting` (2D) without elevation, because the source object was a 2D polyline and Civil 3D exported as a planimetric figure.
- **"Leica Infinity says 'unknown spiral type'."** Bloss / sinusoidal / cosine spirals are not in the LandXML 1.2 enumeration. Convert to clothoid before export, or ship the alignment as densified line segments.
- **Pipe inverts off by 0.01 ft after Civil 3D → Civil 3D round-trip.** XML default precision is 4 decimal places; pipe inverts may round. Bump precision to 5 in Drawing Settings.

## Sources

- Bentley, *OpenRoads Designer LandXML Workflows*, [https://docs.bentley.com/](https://docs.bentley.com/) (registration required).
- Trimble, *Business Center Help: LandXML Import/Export*, in-product help.
- LandXML 1.2 schema, [http://www.landxml.org/schema/LandXML-1.2/LandXML-1.2.xsd](http://www.landxml.org/schema/LandXML-1.2/LandXML-1.2.xsd).
- Autodesk Knowledge Network forum threads (search: "LandXML OpenRoads alignment").
