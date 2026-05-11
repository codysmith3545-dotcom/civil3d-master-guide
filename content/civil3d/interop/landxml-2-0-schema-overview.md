---
title: "LandXML 2.0 Schema Overview"
section: "civil3d/interop"
order: 10
visibility: public
tags: [landxml, schema, xml, interop, alignment, surface, parcel, survey]
appliesTo: [landxml-1.2, landxml-2.0]
updated: 2026-05-11
---

> **TL;DR**
> 1. LandXML is a flat XML container with one `<LandXML>` root and a small set of top-level child elements: `<Project>`, `<Application>`, `<Units>`, `<CoordinateSystem>`, `<Surfaces>`, `<Alignments>`, `<Parcels>`, `<Survey>`, `<CgPoints>`, `<Roadways>`, `<PlanFeatures>`, `<Monuments>`, `<PipeNetworks>`.
> 2. The 2.0 schema (2008) added `<PipeNetworks>` and richer `<Roadways>` content but never reached the adoption of 1.2; most exporters still default to 1.2 for compatibility, then opt into 2.0 only when the recipient asks for it.
> 3. The schema namespace is `http://www.landxml.org/schema/LandXML-2.0` (or `-1.2`). Mismatched namespaces are the most common cause of "valid XML but importer rejects it" errors.

## Document shape

A minimal valid LandXML 2.0 file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LandXML xmlns="http://www.landxml.org/schema/LandXML-2.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.landxml.org/schema/LandXML-2.0
                             http://www.landxml.org/schema/LandXML-2.0/LandXML-2.0.xsd"
         date="2026-05-11" time="14:32:10" version="2.0"
         language="English" readOnly="false">
  <Units>
    <Imperial areaUnit="squareFoot" linearUnit="foot" volumeUnit="cubicYard"
              temperatureUnit="fahrenheit" pressureUnit="inHG"
              angularUnit="decimal degrees" directionUnit="decimal degrees"/>
  </Units>
  <CoordinateSystem name="NAD83 Indiana East (ftUS)" epsgCode="2965"
                    horizontalDatum="NAD83" verticalDatum="NAVD88"/>
  <Project name="Sample"/>
  <Application name="AutoCAD Civil 3D" version="2025"/>
  <CgPoints>
    <CgPoint name="1" code="EP" pntSurv="control">39250.123 178432.456 712.34</CgPoint>
  </CgPoints>
</LandXML>
```

Note the order: the schema requires `<Units>` before `<CoordinateSystem>` before any geometry. Civil 3D will accept out-of-order children but the W3C validator (and Bentley OpenRoads) will not.

## Top-level elements you actually use

### `<Surfaces>` / `<Surface>` / `<Definition>`

A Surface is a TIN (`surfType="TIN"`) or grid (`surfType="grid"`). Inside `<Definition>` are `<Pnts>` (the point list) and `<Faces>` (the triangle list, by 1-based index into `<Pnts>`).

```xml
<Surfaces>
  <Surface name="EG" desc="Existing Ground">
    <Definition surfType="TIN" elevMin="700.10" elevMax="745.88">
      <Pnts>
        <P id="1">39250.0 178400.0 712.34</P>
        <P id="2">39260.0 178400.0 711.98</P>
        <P id="3">39255.0 178410.0 712.55</P>
      </Pnts>
      <Faces>
        <F>1 2 3</F>
      </Faces>
    </Definition>
  </Surface>
</Surfaces>
```

**XPath to count triangles:** `count(//ls:Surface[@name='EG']/ls:Definition/ls:Faces/ls:F)` (with `ls` bound to the LandXML namespace).

### `<Alignments>` / `<Alignment>`

Each alignment carries a `<CoordGeom>` block holding a sequence of `<Line>`, `<Curve>` (circular), `<Spiral>`, and `<IrregularLine>` segments. Vertical geometry lives in nested `<Profile>` → `<ProfAlign>` → `<PVI>` / `<ParaCurve>` / `<CircCurve>` / `<UnsymParaCurve>` elements.

```xml
<Alignment name="CL-Main" length="1234.567" staStart="0+00.00">
  <CoordGeom>
    <Line dir="89.5000" length="500.000">
      <Start>178000.0 39000.0</Start>
      <End>178000.0 39500.0</End>
    </Line>
    <Curve rot="cw" radius="500.0" length="392.699"
           crvType="arc" delta="45.0">
      <Start>178000.0 39500.0</Start>
      <Center>178500.0 39500.0</Center>
      <End>178353.55 39853.55</End>
    </Curve>
  </CoordGeom>
  <Profile>
    <ProfAlign name="CL-Main-EG">
      <PVI>0.000 712.34</PVI>
      <ParaCurve length="100.0">450.000 715.50</ParaCurve>
      <PVI>1234.567 720.10</PVI>
    </ProfAlign>
  </Profile>
</Alignment>
```

Bearing in `<Line dir>` is in **decimal degrees azimuth** (north-zero, clockwise) when `<Units>` declares `directionUnit="decimal degrees"`. If `directionUnit` is `radians` or `gradians` the value is interpreted accordingly — readers that ignore `<Units>` will silently mis-orient your alignment.

### `<Parcels>` / `<Parcel>`

A parcel is a closed polygon described by a `<CoordGeom>` (same primitives as alignment) plus area, parcel type, and class. LandXML 2.0 added `<Center>` for the centroid label point.

### `<Survey>`

Holds the raw observation graph: `<InstrumentSetup>`, `<ObservationGroup>`, `<RawObservation>` (slope distance, horizontal angle, vertical angle), `<ReducedObservation>`, `<RedHorizontalPosition>`. This is what makes LandXML *the* working file for transferring a survey job from instrument software to a CAD package, not a "send me the points" CSV.

### `<CgPoints>` / `<CgPoint>`

Coordinate geometry points. Body text is `northing easting elevation` (or `Y X Z` depending on `<CoordinateSystem>` setup — see below). Attributes carry name (`name`), description (`desc`), code (`code`), and survey class (`pntSurv` ∈ {control, sideShot, intersection, monument, ...}).

### `<PipeNetworks>` (2.0 only)

Pipes (`<Pipe>`) and structures (`<Struct>`) with explicit material, diameter, invert in/out, and bedding. Civil 3D 2018+ writes this block; OpenRoads can read it; TBC ignores it.

## Coordinate ordering — the silent foot-gun

LandXML body text for `<P>`, `<CgPoint>`, `<Start>`, `<End>`, `<Center>`, `<PntList2D>`, `<PntList3D>` is **`northing easting [elevation]`** — i.e. **Y first, then X**. This matches surveyor convention but is the opposite of what most GIS tools assume. Civil 3D writes and reads northing-first; QGIS-based readers will plot your alignment rotated 90°.

## Common pitfalls

- **"Schema validation failed: element 'CoordinateSystem' is unexpected here."** Almost always element-order: `<CoordinateSystem>` must follow `<Units>`, never precede it.
- **"The application could not parse the XML file."** (Civil 3D import.) Usually a stray BOM in a file generated by Notepad on Windows, or non-UTF-8 encoding (CP1252 from a legacy exporter). Re-save as UTF-8 without BOM.
- **Alignment imports as a straight line.** `<CoordGeom>` segments are missing — only `<Start>` and `<End>` are populated. Some legacy tools export the bounding box only and put the real geometry into a vendor extension namespace that Civil 3D ignores.
- **All points 1000 ft off.** Mismatch between `linearUnit` (foot vs ftUS vs meter) — the US survey foot and the international foot differ by 2 ppm, which is enough to break monument alignment over a section.

## Sources

- LandXML 2.0 schema, [http://www.landxml.org/schema/LandXML-2.0/LandXML-2.0.xsd](http://www.landxml.org/schema/LandXML-2.0/LandXML-2.0.xsd).
- LandXML 1.2 schema (still the practical baseline), [http://www.landxml.org/schema/LandXML-1.2/LandXML-1.2.xsd](http://www.landxml.org/schema/LandXML-1.2/LandXML-1.2.xsd).
- ASPRS, *LandXML Implementation Notes*, public mailing list archive.
