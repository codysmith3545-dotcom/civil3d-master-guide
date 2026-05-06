---
title: "Surrounding-State DOT Quick Reference"
section: "standards/state-dot"
order: 50
visibility: public
tags: [state-dot, idot, odot, kytc, mdot, surrounding-states, design-manual]
sources:
  - title: "IDOT Bureau of Design and Environment Manual"
    url: "https://idot.illinois.gov/doing-business/procurements/engineering-architectural-professional-services/consultants-toolkit/highway-standards-and-manuals.html"
  - title: "ODOT Location & Design Manual"
    url: "https://www.transportation.ohio.gov/working/engineering/roadway/manuals-standards/location-and-design"
  - title: "KYTC Highway Design Manual"
    url: "https://transportation.ky.gov/Highway-Design/Pages/Manuals-and-Guidance.aspx"
  - title: "MDOT Road Design Manual"
    url: "https://www.michigan.gov/mdot/programs/design/guides-and-manuals"
updated: 2026-05-06
---

> **TL;DR**
> 1. Indiana borders four states whose DOTs have their own design manuals, standard specifications, and standard drawings. Projects near state lines or firms working across borders need to know where the requirements differ from INDOT.
> 2. All four surrounding-state manuals are AASHTO-based but differ in specific values: superelevation rates, minimum curve radii, ditch cross-sections, and pavement design methods vary.
> 3. This page provides entry-point links and highlights the key differences a civil/survey practitioner accustomed to INDOT will encounter.

## Illinois — IDOT

### Governing documents

- **Bureau of Design and Environment (BDE) Manual**: IDOT's primary design guide, equivalent to INDOT's IDM. Covers geometric design, drainage, environmental, and plan preparation. Published online as chapters.
- **Standard Specifications for Road and Bridge Construction**: construction specs equivalent to INDOT Standard Specifications. Updated on a regular cycle (the "Blue Book").
- **Highway Standards**: standard detail drawings (equivalent to INDOT E-drawings). Available as PDFs and DWG files.

### Key differences from INDOT

| Topic | INDOT | IDOT |
|---|---|---|
| Design manual | Indiana Design Manual (IDM) | BDE Manual |
| Units | U.S. survey foot (transitioning to international foot per NGS) | U.S. survey foot (same transition) |
| Superelevation max (rural) | 8% (IDM Ch. 44) | 8% (BDE Ch. 36) — same as INDOT |
| Pavement design method | INDOT's own catalog (IDM Ch. 52) based on structural number | Mechanistic-Empirical (MEPDG) for new designs |
| Drainage manual | IDM Ch. 28-29, 200-203 | IDOT Drainage Manual (separate document) |
| CADD standards | IDM Ch. 56, INDOT layer naming | IDOT CADD Manual, MicroStation and Civil 3D templates available |
| Permit portal | INDOT district offices | IDOT District permit offices; Access Permit Application via IDOT website |

### Plan-preparation notes

IDOT uses MicroStation as its primary CADD platform but accepts Civil 3D deliverables. The IDOT CADD Manual defines DGN layer naming; Civil 3D users working on IDOT projects should obtain the IDOT Civil 3D template if available or map layers to match the IDOT standard.

## Ohio — ODOT

### Governing documents

- **Location & Design (L&D) Manual**: ODOT's equivalent to the IDM. Three volumes covering project development, roadway design, and plan preparation.
- **Construction and Material Specifications (CMS)**: construction specs.
- **Standard Construction Drawings**: equivalent to INDOT E-drawings.

### Key differences from INDOT

| Topic | INDOT | ODOT |
|---|---|---|
| Design manual | IDM | Location & Design Manual |
| Superelevation max (rural) | 8% | 8% (same) |
| Clear zone width | AASHTO Roadside Design Guide values via IDM Ch. 67 | ODOT L&D Vol. 1 §301.3 — similar AASHTO-based values with Ohio-specific adjustments |
| Drainage | IDM Ch. 28-29 | ODOT Drainage Manual (separate publication) |
| Survey standards | IDM Ch. 20 | ODOT Survey and Mapping Manual |
| CADD standards | IDM Ch. 56 | ODOT CADD Engineering Standards Manual — ODOT uses MicroStation/OpenRoads but publishes Civil 3D guidance |

### Notable practice differences

ODOT's plan preparation standards require specific sheet sizes (22" x 34") and title block formats. ODOT also uses a project-specific coordinate system ("project datum") for many projects, similar to INDOT's approach but with different grid-to-ground scale factor documentation requirements.

## Kentucky — KYTC

### Governing documents

- **Highway Design Manual (HDM)**: KYTC's primary design guide.
- **Standard Specifications for Road and Bridge Construction**: construction specs.
- **Standard Drawings**: construction detail drawings.

### Key differences from INDOT

| Topic | INDOT | KYTC |
|---|---|---|
| Design manual | IDM | Highway Design Manual (HDM) |
| Max superelevation (rural, non-freeway) | 8% | 8% — Kentucky also allows 6% max on low-speed urban roads |
| Pavement design | INDOT catalog / structural number | Kentucky uses an AASHTO 1993-based method |
| Stormwater | IDM Ch. 29 / 203 | KYTC Drainage Manual (separate, multi-volume) |
| ROW acquisition process | IDM Ch. 80-82 | KYTC Division of Right of Way procedures — similar federal (Uniform Act) basis |
| Coordinate system | Indiana State Plane (East and West zones) | Kentucky State Plane (single zone, North and South were consolidated) |

### Notable practice differences

KYTC uses a single statewide coordinate zone for most highway projects, simplifying zone-boundary issues compared to Indiana's two zones. Kentucky projects near the Indiana border are in the Kentucky Single Zone (FIPS 1600); Indiana projects just across the river are in Indiana East (FIPS 1301) or Indiana West (FIPS 1302). Coordinate transformations are required when integrating survey data across the state line.

## Michigan — MDOT

### Governing documents

- **Road Design Manual (RDM)**: MDOT's primary design guide.
- **Standard Specifications for Construction**: construction specs.
- **Standard Plans**: equivalent to INDOT E-drawings.

### Key differences from INDOT

| Topic | INDOT | MDOT |
|---|---|---|
| Design manual | IDM | Road Design Manual (RDM) |
| Max superelevation (rural) | 8% | 8% (same) |
| Design speed policy | IDM Ch. 41 (AASHTO-based) | RDM Ch. 5 — MDOT has a "target speed" approach in addition to design speed |
| Drainage | IDM Ch. 28-29 | MDOT Drainage Manual |
| CADD | IDM Ch. 56 (Civil 3D / MicroStation) | MDOT uses ProjectWise + MicroStation/OpenRoads; Civil 3D is less common on MDOT projects |
| Pavement marking | INDOT E 810 series | MDOT Standard Plans — similar MUTCD-based layouts but different Michigan-specific modifications |

### Notable practice differences

Michigan uses metric for some legacy projects (MDOT converted to metric in the 1990s and then reverted; some older plans remain in metric). Current MDOT projects are in U.S. customary units. Verify the unit system on any Michigan project before setting up the Civil 3D drawing.

MDOT's approach to context-sensitive design ("CSS/Practical Design") may produce different cross-section standards than INDOT for comparable road classifications, particularly for non-motorized facilities (bike lanes, shared-use paths).

## Cross-border project tips

When working on a project that spans or sits near a state border:

1. **Determine the governing authority.** The DOT with jurisdiction over the roadway being accessed or modified sets the design standards. A driveway onto an Indiana state highway uses INDOT standards even if the property is in a Kentucky-border county.
2. **Coordinate system.** State Plane zones do not align at borders. Set up Civil 3D with the correct zone for each state's portion and transform as needed.
3. **Permit coordination.** Work within one state's ROW requires that state's permit. A project touching both requires permits from both.
4. **Material specifications.** Concrete and asphalt mixes differ. An INDOT-spec HMA surface mix may not be the same gradation as an ODOT-spec surface mix. Use the governing state's specs for each segment.

## Related

- [INDOT IDM chapter map](indot-idm-chapter-map.md)
- [INDOT Standard Specifications](indot-standard-specs.md)
- [INDOT Standard Drawings](indot-standard-drawings.md)
- [INDOT permitting](indot-permitting.md)
