---
title: "Showing Easements on Surveys and Plats"
section: "field-and-boundary/easements-and-row"
order: 30
visibility: public
tags: [easements, plats, drafting, line-styles, labeling, alta]
updated: 2026-05-06
sources:
  - title: "ALTA/NSPS Minimum Standard Detail Requirements for Land Title Surveys (2021)"
    url: https://www.alta.org/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Easements are depicted with dashed or phantom line styles, distinct from property boundaries (solid). Each easement is labeled with its type, width, recording reference, and purpose.
> 2. ALTA/NSPS surveys require all recorded easements from the title commitment to be plotted or noted. If an easement cannot be plotted (blanket easement, ambiguous description), a note explains why.
> 3. Color coding is common in digital deliverables: utilities in green, drainage in blue, access in orange. Use a legend and be consistent within the drawing set.

## Line conventions

Standard drafting practice distinguishes easements from property lines by line style:

| Feature | Line style | Typical color (digital) |
|---|---|---|
| Property boundary | Solid, heavy weight | White or black |
| Easement line | Dashed or long-dash-dot | Varies by type |
| Setback / building line | Short dash or dot | Magenta or gray |
| ROW line | Solid, medium weight | Red |
| Centerline | Long-dash-short-dash (center) | Red |

Easement lines are drawn lighter in weight than property boundary lines so the boundary remains the dominant feature. When multiple easements overlap, each is drawn on a separate layer or with a distinct dash pattern so they can be distinguished.

## Labeling requirements

Every easement shown on a survey should be labeled with:

- **Type/purpose.** "Utility Easement," "Drainage Easement," "Access Easement," "Sanitary Sewer Easement," etc.
- **Width.** "20' Wide," "15' Each Side of CL," or area dimensions for irregular easements.
- **Recording reference.** Instrument number and recording date, or plat book and page. Example: "Per Inst. No. 2019-045678, recorded 2019-08-15."
- **Beneficiary.** "In favor of Duke Energy Indiana" or "In favor of the City of Indianapolis" when known from the document.

### Typical label format

```
20' UTILITY EASEMENT
PER INST. NO. 2019-045678
IN FAVOR OF DUKE ENERGY INDIANA
```

Place the label inside the easement area when the width permits; otherwise, use a leader line to a label outside the easement. Keep labels horizontal or aligned with the easement direction.

## ALTA/NSPS requirements

The 2021 ALTA/NSPS Minimum Standard Detail Requirements require:

- All easements referenced in Schedule B-II of the title commitment must be shown on the survey or addressed in a note.
- If the surveyor can locate the easement from the recorded document, it is plotted with dimensions and recording reference.
- If the easement cannot be plotted (ambiguous description, blanket easement, no legal description), the surveyor includes a note such as: "Easement per Inst. No. 2005-012345 is a blanket easement and cannot be plotted."
- Visible evidence of easement use (utility poles, manholes, overhead lines, underground utility markers) is shown even if no recorded easement is found.
- Table A Item 4 (optional) asks for interior setback and easement lines if requested by the client.

## Color conventions for digital deliverables

There is no universal standard, but common conventions in Indiana civil and survey offices:

| Easement type | Suggested color | AutoCAD color index |
|---|---|---|
| Utility (electric, gas, telecom) | Green | 3 (green) |
| Sanitary sewer | Brown or dark red | 31 |
| Storm drainage | Blue | 5 (blue) |
| Water main | Cyan | 4 (cyan) |
| Access / ingress-egress | Orange | 30 |
| Conservation / environmental | Dark green | 94 |
| General / unspecified | Yellow | 2 (yellow) |

Always include a legend on the drawing when using color to distinguish easement types. Print settings should ensure that color differences survive black-and-white printing — use line style variations as the primary differentiator, color as secondary.

## Overlapping easements

When multiple easements share the same area:

- Draw each easement boundary on a separate layer.
- Label each separately with its own recording reference.
- Use hatching or fill patterns sparingly — they can obscure other information. A note listing the overlapping easements is often clearer than multiple overlapping hatch patterns.
- In the notes section of the plat, describe the overlap: "The 20' drainage easement per Inst. No. 2010-034567 overlaps with the 25' utility easement per Inst. No. 2005-012345 within the area shown."

## Easements that cannot be plotted

When an easement from the title commitment cannot be plotted, the surveyor includes a general note. Examples:

- "A blanket easement for public utilities exists per the plat of Sunrise Acres, recorded in Plat Book 12, Page 45. This easement covers the entirety of the lot and cannot be plotted as a specific corridor."
- "Easement per Inst. No. 1998-078901 references 'a 10-foot strip along the rear of the lot' with no further description. The rear lot line is 150.00 feet long. A 10-foot strip is shown along the entire rear line as the most reasonable interpretation. The client should consult an attorney for confirmation."

## Related

- [Common easement language](common-easement-language.md)
- [Easement types](easement-types.md)
- [ROW dedication](row-dedication.md)
- [Half-width ROW](half-width-row.md)
