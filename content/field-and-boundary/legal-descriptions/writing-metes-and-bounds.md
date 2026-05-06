---
title: "Writing Metes-and-Bounds Descriptions"
section: "field-and-boundary/legal-descriptions"
order: 20
visibility: public
tags: [metes-and-bounds, legal-description, indiana, boundary]
updated: 2026-05-06
sources:
  - title: "865 IAC 1-12 Indiana Surveyor Rules"
    url: https://www.in.gov/pla/professions/professional-surveyors-home/
    verified: 2026-05-06
  - title: "Brown's Boundary Control and Legal Principles, 8th ed."
    url: https://www.wiley.com/en-us/Brown%27s+Boundary+Control+and+Legal+Principles%2C+8th+Edition-p-9781119911708
    verified: 2026-05-06
---

> **TL;DR**
> 1. Anatomy: Caption → Commencement → Point of Beginning (POB) → courses → return to POB → acreage. The description is closed; if it doesn't return, it isn't a description.
> 2. Indiana convention: bearings to the nearest second, distances to 0.01 foot, basis of bearings declared, ties to PLSS controlling corners.
> 3. Calls control. Write monumentation, adjoiners, and natural features into the courses; bearings and distances are the secondary record of where the line is.

## Anatomy of a metes-and-bounds description

A complete metes-and-bounds description has six predictable parts:

1. **Caption.** The host parcel: section/township/range, county, state. Anchors the description in space before any course is read.
2. **Commencement.** A path from a controlling monument to the **point of beginning**. Use a section corner, monumented corner of a recorded plat, or a similar durable point.
3. **Point of beginning (POB).** Named explicitly. The POB is where the perimeter starts and ends. If commencement and POB are the same, say so.
4. **Courses.** A sequence of bearing-and-distance calls describing the perimeter. Each course should call to its terminus by reference to a monument, a deed line, or another locatable feature when one exists.
5. **Return.** The last course closes back to the POB. The description states "to the point of beginning" explicitly.
6. **Acreage and exceptions.** Total area, less any excepted areas, with the surveyor's basis stated.

Optional but recommended: a basis-of-bearings paragraph, a date, and a surveyor signature block.

## Indiana conventions

Indiana surveyors should write to the precision required by 865 IAC 1-12 and to local custom:

- **Bearings:** to the nearest second of arc (e.g., N 87°23'14" E).
- **Distances:** to 0.01 foot.
- **Basis of bearings:** declared on every plat and description (Indiana State Plane East or West Zone, NAD83(2011), is most common). See [basis of bearings](basis-of-bearings.md).
- **PLSS tie:** Indiana is overwhelmingly PLSS; tie commencement to a section, quarter, or sixteenth corner whose perpetuation is on file with the county surveyor under IC 36-2-12.
- **County surveyor record:** when you rely on a section corner, cite the county surveyor's perpetuation reference (book and page or instrument number).

## Phrasing the calls

Each course should be unambiguous and read in the same direction it is to be retraced:

- "Thence North 87 degrees 23 minutes 14 seconds East, 256.78 feet to a 5/8-inch rebar with cap stamped 'XYZ LS-12345' set on the East line of said quarter."
- "Thence along said East line, South 02 degrees 11 minutes 06 seconds East, 412.30 feet to the centerline of County Road 600."
- "Thence along said centerline, the following four (4) courses..."

Useful phrases and what they commit you to:

- **"More or less"** — reserved for natural features (water, ridge), not used to forgive measured calls.
- **"Along"** — implies the line follows a feature (a road centerline, a section line, a creek). The feature controls if there is a conflict.
- **"To"** vs **"to a point"** — "to" a monument means you reach the monument. "To a point" means a calculated point with no physical mark; reserve for closing geometry.
- **"Thence"** — separates courses. One course per "thence."

## Curves

Curves are described with enough geometry to retrace without ambiguity. State at minimum: direction (left or right), radius, arc length, chord bearing, and chord distance. Indicate non-tangency when the curve does not begin tangent to the previous course.

Example: "Thence Southeasterly along a curve to the left having a radius of 350.00 feet, an arc length of 162.41 feet, and a chord bearing South 28 degrees 14 minutes 55 seconds East, 161.02 feet, to a point of tangency."

## Closure and acreage

Compute and report the closure. Indiana minimum standards specify closure precision by class of survey (see 865 IAC 1-12). Report acreage to a precision consistent with measurement quality — typically 0.001 acre for a sub-acre parcel and 0.01 acre for a parcel measured in tens of acres. Do not over-report precision.

## Common pitfalls

- **Floating POB.** Commencing without tying to a controlling monument leaves the description un-locatable.
- **Calls that contradict measurements.** If the call says "to the East line of the Southeast Quarter" and your measured bearing-distance does not reach it, fix the bearing-distance — calls control.
- **Missing return.** A description that lists nine courses and quits is not closed.
- **Ambiguous "along."** "Along the road" without naming centerline, edge of pavement, or right-of-way line invites litigation.
- **Mixing datums.** A description written with assumed bearings in 1962 cannot be read on a NAD83(2011) plat without a re-bearing note.
- **Excepting parcels by reference only.** "Excepting therefrom that part conveyed to ABC by Deed Book 123, Page 45" is acceptable only when that deed is itself fully described and recorded.

## Related

- [Call priority and Brown's hierarchy](call-priority.md)
- [Basis of bearings](basis-of-bearings.md)
- [PLSS descriptions](plss-descriptions.md)
- [Surveyor's report (Indiana)](../monuments-and-evidence/surveyors-report-indiana.md)
