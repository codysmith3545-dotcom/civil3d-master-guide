---
title: "Glossary"
section: ""
order: 999
visibility: public
tags: [glossary, reference]
updated: 2026-05-11
---

> **TL;DR**
> 1. Definitions of terms used throughout the guide. Hover-cards on the web app pull from this page.
> 2. Each term has a one-line definition and a link to the page where it's used most.
> 3. Add a term: alphabetical, lowercase first word, definition under 30 words, link to relevant page.

## A

- **Acquiescence** — Doctrine by which a boundary line is established by long-standing mutual recognition, typically evidenced by a fence or physical marker. → [Advanced Boundary Topics](field-and-boundary/advanced-boundary/index.md).
- **Adverse possession** — Legal doctrine allowing a person to claim ownership of land after meeting statutory requirements (in Indiana: open, notorious, hostile, continuous, exclusive for 10 years under IC 32-21-7). → [Advanced Boundary Topics](field-and-boundary/advanced-boundary/index.md).
- **Alignment** — A horizontal centerline made of lines, curves, and (optionally) spirals, carrying stationing. → [Alignments](civil3d/alignments/index.md).
- **ALTA/NSPS** — National survey standard for title-insurance-grade boundary surveys (current: 2021). → [Boundary & ALTA](field-and-boundary/boundary-and-alta/index.md).
- **As-built** — Survey of what was actually constructed, including deviations from plan. → [As-builts](field-and-boundary/as-builts/index.md).
- **ASPRS** — American Society for Photogrammetry and Remote Sensing. Publishes positional accuracy standards for geospatial data.
- **Assembly** — The cross-section template applied along an alignment+profile to build a corridor. → [Corridors](civil3d/corridors/index.md).

## B

- **Basis of bearings** — The reference frame for the directions in a survey or description (grid, geodetic, magnetic, assumed). → [Legal descriptions](field-and-boundary/legal-descriptions/index.md).
- **Breakline** — A 3D linear feature added to a TIN to enforce ridges/valleys/edges. → [Surfaces](civil3d/surfaces/index.md).

## C

- **Collimation** — The alignment of a survey instrument's optical/electronic axis. Checked and adjusted regularly to maintain measurement accuracy. → [Survey Equipment & Technology](field-and-boundary/survey-equipment/index.md).
- **Combined scale factor** — Grid scale × elevation factor; converts ground distance to grid distance. → [Coordinate systems](field-and-boundary/coordinate-systems/index.md).
- **CORS** — Continuously Operating Reference Station. A permanent GNSS receiver that provides correction data for RTK and post-processing. Indiana's network is InCORS. → [Control Networks & Adjustment](field-and-boundary/control-networks/index.md).
- **Corridor** — The 3D model produced by sweeping an assembly along an alignment+profile. → [Corridors](civil3d/corridors/index.md).
- **CSF** — See *combined scale factor*.

## D

- **Data shortcut** — Lightweight cross-drawing reference to a Civil 3D object (alignment, surface, profile, pipe network). → [Data shortcuts](civil3d/data-shortcuts/index.md).
- **Daylight** — The point where a graded slope meets existing ground. → [Grading](civil3d/grading/index.md).
- **Description key** — Rule that maps a point's raw description to a style, label style, layer, and full description. → [Description keys](civil3d/points/description-keys.md).
- **DMD** — Double Meridian Distance. A method for computing area from traverse data using departures and meridian distances. → [Control Networks & Adjustment](field-and-boundary/control-networks/index.md).
- **Dynamic datum** — A reference frame that represents station positions as time-dependent functions (x(t), y(t), z(t)) rather than freezing them at a single epoch. The NSRS 2022 frames are dynamic; NAD83(2011) is static. → [Dynamic datums and plate tectonics](field-and-boundary/datums/dynamic-datums-and-plate-tectonics.md).
- **DWT** — AutoCAD/Civil 3D drawing template. → [Templates](customization/templates-and-kits/index.md).

## E

- **Easement** — A right to use someone else's land for a specific purpose. → [Easements & ROW](field-and-boundary/easements-and-row/index.md).
- **Epoch** — The reference date to which a published coordinate is referred. Written as a decimal year (e.g., 2010.00 = 2010-01-01 00:00 UT). NAD83(2011) is published at epoch 2010.00. → [Dynamic datums and plate tectonics](field-and-boundary/datums/dynamic-datums-and-plate-tectonics.md).

## F

- **FBK** — Field book file format used by Civil 3D Survey to import processed survey data. → [Survey](civil3d/survey/index.md).
- **Feature line** — A 3D line with elevation; backbone of grading. → [Grading](civil3d/grading/index.md).
- **FGDC** — Federal Geographic Data Committee. Publishes geospatial positioning accuracy standards (FGDC-STD-007). → [Control Networks & Adjustment](field-and-boundary/control-networks/index.md).
- **Figure** — A linework feature defined in the survey database, often used as breakline source.

## G

- **Geoid** — Equipotential surface used as the reference for orthometric heights (current US: Geoid18). → [Geoid models](field-and-boundary/datums/geoid-models-12b-18-and-2022.md).
- **Geopotential height** — A height computed from a geopotential number; the broader category that includes orthometric, dynamic, and normal heights. NAPGD2022 is defined in geopotential numbers. → [Vertical datums](field-and-boundary/datums/vertical-datums-navd88-vs-napgd2022.md).
- **Geopotential number (C)** — Difference in gravity potential between the geoid and a point, in m^2/s^2. The primary quantity in the NAPGD2022 vertical datum. → [Vertical datums](field-and-boundary/datums/vertical-datums-navd88-vs-napgd2022.md).
- **Grading group** — Container for grading objects that produces a surface.

## H

- **HGL** — Hydraulic Grade Line. The energy-elevation profile of pressurized or open-channel flow. → [Hydraulics](engineering/hydraulics/index.md).
- **HTDP** — Horizontal Time-Dependent Positioning. NGS tool that transforms coordinates between reference frames and epochs using published station velocities. → [Time-dependent positioning](field-and-boundary/datums/time-dependent-positioning.md).

## I

- **IDM** — Indiana Design Manual (INDOT). → [Indiana state](jurisdictions/indiana/state/index.md).
- **Invert** — The inside-bottom elevation of a pipe.

## K

- **K-value** — Vertical curve length per percent of algebraic difference: `K = L / |A|`. → [Vertical curve design](engineering/roadway-design/vertical-curve-design.md).

## L

- **LandXML** — Open XML schema for civil/survey data exchange.
- **Layout profile** — Designed profile (as opposed to a sampled surface profile).
- **Localization** — A site calibration that transforms GNSS-derived coordinates to match local project control, producing a combined scale factor. → [Control Networks & Adjustment](field-and-boundary/control-networks/index.md).

## M

- **Manning's n** — Channel/pipe roughness coefficient. → [Hydraulics](engineering/hydraulics/index.md).
- **Match line** — Line on a plan sheet indicating where the next sheet picks up.

## N

- **NAD27** — North American Datum of 1927. Pre-NAD83 horizontal datum based on the Clarke 1866 ellipsoid and a fixed origin at Meades Ranch, Kansas. → [NAD83 vs NAD27](field-and-boundary/datums/nad83-versus-nad27.md).
- **NAD83(2011)** — Current published realization of NAD83, derived from the NA2011 multi-year readjustment and frozen at epoch 2010.00. → [NAD83(2011) realization](field-and-boundary/datums/nad83-2011-realization.md).
- **NADCON** — NGS grid-based bilinear-interpolation transformation between NAD27 and NAD83 (and later realizations). → [NAD83 vs NAD27](field-and-boundary/datums/nad83-versus-nad27.md).
- **NAPGD2022** — North American-Pacific Geopotential Datum of 2022. Forthcoming gravimetric vertical datum that will replace NAVD88. → [Vertical datums](field-and-boundary/datums/vertical-datums-navd88-vs-napgd2022.md).
- **NATRF2022** — North American Terrestrial Reference Frame of 2022. Plate-fixed dynamic horizontal frame that will replace NAD83 in CONUS, Alaska, and parts of Canada/Mexico. → [NSRS 2022 overview](field-and-boundary/datums/nsrs-2022-overview.md).
- **NAVD88** — North American Vertical Datum of 1988. Current US vertical datum, defined by leveling adjustment anchored to one tide gauge at Father Point/Rimouski, Quebec. → [Vertical datums](field-and-boundary/datums/vertical-datums-navd88-vs-napgd2022.md).
- **NCS** — National CAD Standard (NIBS). → [CAD layer standards](standards/cad-layer-standards/index.md).
- **NGS** — National Geodetic Survey (NOAA agency).
- **NSRS** — National Spatial Reference System. The NGS-maintained collection of horizontal/vertical/gravity reference frames for the United States. → [Datums and reference frames](field-and-boundary/datums/index.md).
- **NSRS 2022** — Modernized NSRS comprising the NATRF2022/PATRF2022/CATRF2022/MATRF2022 horizontal frames and the NAPGD2022 vertical datum. Implementation deferred. → [NSRS 2022 overview](field-and-boundary/datums/nsrs-2022-overview.md).
- **NTRIP** — Networked Transport of RTCM via Internet Protocol. The standard for streaming GNSS corrections over the internet for RTK surveying. → [Survey Equipment & Technology](field-and-boundary/survey-equipment/index.md).

## O

- **OPUS** — Online Positioning User Service. NGS web tool that returns NAD83(2011) and ITRF coordinates from a submitted static GNSS RINEX file. → [GNSS vector processing](field-and-boundary/datums/gnss-vector-processing-and-pp.md).
- **OPUS-Projects** — NGS hosted workflow for multi-station, multi-session network adjustment of GNSS observations, producing a constrained least-squares solution. → [GNSS vector processing](field-and-boundary/datums/gnss-vector-processing-and-pp.md).

## P

- **Parcel** — A 2D enclosed area on a site (in Civil 3D); a legally defined property tract (in surveying).
- **Pipe network** — Civil 3D object representing a system of pipes and structures.
- **PNEZD** — Default point file format: Point, Northing, Easting, Z (elevation), Description.
- **Point group** — Filter that selects points by criteria; controls visibility, plotting, export.
- **Profile view** — The "window" that draws profiles in plan production.
- **Proportioning** — The BLM method for restoring lost PLSS corners by proportional measurement between existing corners. Single proportioning uses one line; double proportioning uses two. → [Advanced Boundary Topics](field-and-boundary/advanced-boundary/index.md).
- **PROWAG** — Public Right-of-Way Accessibility Guidelines (US Access Board, 2023). → [ADA](engineering/ada-and-accessibility/index.md).

## R

- **Right-of-way (ROW)** — A specific kind of easement, usually for transit. → [Easements & ROW](field-and-boundary/easements-and-row/index.md).
- **Riparian** — Relating to the bank of a river or stream. Riparian rights and boundaries follow the water's ordinary high water mark. → [Advanced Boundary Topics](field-and-boundary/advanced-boundary/index.md).
- **RTK** — Real-Time Kinematic. A GNSS technique providing centimeter-level positioning in real time using carrier-phase corrections from a base station or VRS network. → [Survey Equipment & Technology](field-and-boundary/survey-equipment/index.md).

## S

- **Sight distance** — Distance a driver can see ahead. SSD = stopping; PSD = passing; DSD = decision; ISD = intersection.
- **Site (Civil 3D)** — Topology container for parcels and feature lines.
- **SPCS2022** — State Plane Coordinate System of 2022. Forthcoming State Plane redefinition on NATRF2022, allowing low-distortion projection (LDP) zones and standardizing on the international foot. → [State Plane 2022](field-and-boundary/datums/state-plane-2022.md).
- **State plane** — A US national family of projections for state-by-state high-accuracy mapping. → [Coordinate systems](field-and-boundary/coordinate-systems/index.md).
- **Subassembly** — A piece of an assembly (lane, curb, sidewalk, daylight).
- **Surveyor's report** — Indiana statutory report (IC 36-2-12-14) summarizing a survey. → [Monuments & evidence](field-and-boundary/monuments-and-evidence/index.md).

## T

- **Target (corridor)** — Object a subassembly follows (surface, alignment, profile).
- **TIN** — Triangulated Irregular Network. The default Civil 3D surface representation. → [Surfaces](civil3d/surfaces/index.md).
- **Time of concentration (Tc)** — Time for runoff to travel from the hydraulically most distant point of a catchment to the design point. → [Stormwater](engineering/stormwater/index.md).

## V

- **Vertical curve** — Parabolic curve connecting two profile tangents; quantified by K-value.
- **View frame** — Rectangle along an alignment that defines a plan/profile sheet's extent.

## Related

- [Master index](00-index.md)
