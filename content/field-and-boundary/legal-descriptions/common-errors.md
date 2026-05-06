---
title: "Common Errors in Legal Descriptions"
section: "field-and-boundary/legal-descriptions"
order: 60
visibility: public
tags: [legal-description, errors, closure, ambiguity]
updated: 2026-05-06
sources:
  - title: "Brown's Boundary Control and Legal Principles, 8th ed."
    url: https://www.wiley.com/en-us/Brown%27s+Boundary+Control+and+Legal+Principles%2C+8th+Edition-p-9781119911708
    verified: 2026-05-06
  - title: "865 IAC 1-12 Indiana Surveyor Rules"
    url: https://www.in.gov/pla/professions/professional-surveyors-home/
    verified: 2026-05-06
---

> **TL;DR**
> 1. The most consequential errors are those that make a description **ambiguous** (describing more than one possible parcel) or **non-closing** (failing to return to the POB). Both can cloud title and delay transactions.
> 2. Many errors are introduced during transcription — copying from the survey plat to a deed, from one deed to the next, or from Civil 3D output to a word processor.
> 3. Every description should be **round-tripped** (keyed back into a closure computation independent of the original CAD file) before recording.

## Non-closing descriptions

A metes-and-bounds description that does not mathematically close fails its most basic requirement: defining a unique parcel. Common causes:

- **Omitted course.** A course is dropped during transcription. The remaining courses do not return to the POB.
- **Transposed digits.** A bearing of N 87 degrees 23 minutes 14 seconds E becomes N 87 degrees 32 minutes 14 seconds E. The closure error may be small enough to go unnoticed until a later survey.
- **Wrong direction quadrant.** A bearing that should be Southeast is written as Northeast. This usually produces a gross closure error that is easy to catch — but not always, especially in complex descriptions with many short courses.
- **Curve data inconsistency.** The radius, arc length, chord bearing, and chord distance are not mathematically consistent. This happens when individual elements are rounded independently instead of being computed from a single arc definition.

A description with a small closure error (e.g., 0.05 feet in 2,000 feet) is not necessarily defective — it may reflect the precision of the original survey. A description with a closure error of several feet or more is defective and should be corrected by a corrective instrument.

## Wrong basis of bearing

The basis of bearings anchors every bearing in the description to a reference direction. Errors:

- **Undeclared basis.** No basis of bearings is stated. The reader cannot determine whether bearings are based on State Plane, a magnetic observation, an assumed meridian, or a previous deed.
- **Mismatched basis.** The description states "bearings are based on Indiana State Plane East Zone, NAD83(2011)" but the bearings were actually computed on NAD83 (original 1986). The difference in Indiana is roughly 1 to 3 seconds of arc — enough to matter on long courses.
- **Assumed vs. geodetic.** Bearings based on an assumed meridian from a 1960 deed cannot be directly compared to NAD83 bearings without a rotation. If the description does not state this, the reader has no way to reconcile.

## Stale references to demolished or disturbed monuments

A description that commences at "a concrete monument found at the northeast corner of the Southeast Quarter" becomes problematic when that monument has been destroyed by road construction or development. The description is not invalid — the monument was the POB at the time the description was written — but the next surveyor must re-establish the corner from secondary evidence.

Prevention: when writing a new description, tie the commencement to a controlling corner whose perpetuation is on file with the county surveyor (IC 36-2-12). If you know the monument at the POB is vulnerable (e.g., in a construction zone), add a secondary tie.

## Conflicting calls

A single description may contain calls that conflict with each other:

- **"North 200.00 feet to the south line of Elm Street" when the south line of Elm Street is actually 214.00 feet away.** The call to the monument (Elm Street) controls over the distance (200.00 feet). See [call priority](call-priority.md).
- **"Along the centerline of the creek" with a bearing-distance that departs from the creek.** The natural monument (creek centerline) controls.
- **Two deed calls that describe the same line differently.** Successive deeds in a chain of title may restate a boundary with slightly different bearings and distances. The original (senior) description controls.

Conflicting calls are not necessarily errors in the description — they may be evidence of how the boundary was originally established. The surveyor resolves them by applying the hierarchy of calls (natural monuments > artificial monuments > adjoiners > courses > distances > area).

## Missing exceptions and easements

- **Unexcepted easement.** A utility easement or road right-of-way crosses the parcel but is not excepted in the description. The fee title still includes the easement area, but the buyer may be surprised. Best practice: list all known encumbrances in the description or reference the title commitment.
- **Missing right-of-way exception.** A portion of the parcel was previously conveyed for road right-of-way. If the description does not except that conveyance, it appears to include land the grantor no longer owns.
- **Stale exception.** An exception references a deed that has been superseded, vacated, or re-conveyed. The exception is still valid as a chain-of-title matter, but it creates confusion.

## Wrong acreage

Acreage is the weakest element in a legal description — it yields to all other calls. Nevertheless, a grossly wrong acreage can cause practical problems:

- **Tax assessment.** County assessors use the stated acreage for property tax purposes.
- **Transaction expectations.** A buyer purchasing "10.00 acres" who receives 8.50 acres after resurvey may have a claim.
- **Over-reported precision.** Stating acreage to 0.0001 acres implies a measurement precision that the survey may not support. Report acreage to a precision consistent with the survey method: typically 0.001 acres for a sub-acre parcel and 0.01 acres for a larger tract.

## Starting from the wrong POB

If the commencement identifies the wrong monument — or a monument that has been moved — the entire description is displaced on the ground. This error is rare but catastrophic:

- **Wrong section corner.** Commencing at the southeast corner of Section 14 when the parcel is in Section 15.
- **Wrong lot corner.** Commencing at the northeast corner of Lot 3 when the parcel is Lot 4.
- **Moved monument.** A found rebar is assumed to be original but was actually set by a later, incorrect survey.

Prevention: confirm the commencement monument against independent evidence (county surveyor records, adjacent plats, adjoiner surveys) before writing the description.

## Round-tripping as quality control

The single most effective quality-control step is to key the final description — exactly as it will appear in the deed — into an independent closure computation:

1. Start at the POB.
2. Enter each bearing, distance, and curve exactly as written.
3. Verify that the traverse closes within the expected tolerance.
4. Verify that the computed area matches the stated acreage.

This catches transcription errors that visual proofreading misses. Civil 3D's mapcheck analysis can perform this step, but using a tool independent of the original CAD file is stronger quality control.

## Related

- [Writing metes-and-bounds descriptions](writing-metes-and-bounds.md)
- [Call priority and Brown's hierarchy](call-priority.md)
- [Description from a parcel (Civil 3D workflow)](description-from-parcel.md)
- [Lot-and-block descriptions](lot-and-block.md)
