---
title: "Grade Checks During Construction"
section: "field-and-boundary/construction-staking"
order: 45
visibility: public
tags: [construction-staking, grade-check, subgrade, finish-grade, tolerance, verification]
updated: 2026-05-06
---

> **TL;DR**
> 1. Grade checks verify that the contractor has built the surface to the **design elevation within tolerance** — typically 0.05 ft for subgrade, 0.02 ft for finish grade, and 0.01 ft for concrete paving.
> 2. Shoot a **grid of check shots** across the graded area (25 to 50 ft spacing), compute the deviation at each point, and provide a **pass/fail report** to the contractor before the next course goes down.
> 3. When a grade check fails, give the contractor the location and magnitude of the deviation clearly and promptly — vague or delayed feedback wastes time and money for everyone.

## What grade checks are for

Grade checks are independent elevation measurements taken after the contractor has graded a surface, confirming that the as-built elevation matches the design. They serve as a quality gate: the next construction layer (base, pavement, building slab) should not proceed until the underlying grade passes.

The surveyor acts as an independent checker. The contractor's own grade work (string lines, laser, machine control) is their primary method; the surveyor's grade check is verification.

## When grade checks happen

| Construction phase | What is checked | Typical tolerance |
|---|---|---|
| Rough grading | Subgrade of road, pad, or detention basin | 0.05 to 0.10 ft |
| Fine grading | Subgrade before aggregate base placement | 0.03 to 0.05 ft |
| Aggregate base | Top of stone before paving | 0.02 to 0.03 ft |
| Concrete subgrade/forms | Subgrade and form elevation for concrete paving or slabs | 0.01 to 0.02 ft |
| Finished pavement | Top of asphalt or concrete after paving | 0.02 ft |
| Final site grading | Detention basins, swales, landscape areas | 0.05 to 0.10 ft |

Tolerances come from the project specifications, INDOT standard specifications (for public roads), or the engineer's requirements. Confirm before the first check.

## Field procedure

1. **Set up on control.** Occupy a project control point and check into a second known point. Accept only if the closing error is within the survey tolerance (typically 0.02 ft vertical for grade-check work).
2. **Shoot a grid.** Walk a regular grid across the graded area. Common spacing: 25 ft for road subgrade, 50 ft for large pads or detention basins, 10 to 15 ft for concrete slab areas. Add shots at critical features: edges, grade breaks, drain locations, control joints.
3. **Record each shot.** At each grid point, record the shot number, location (station/offset or northing/easting), existing elevation, design elevation, and deviation (cut/fill).
4. **Compute deviations.** Many data collectors compute the deviation in real time against a loaded design surface. If not, compute in the office from the exported shots and the design model.
5. **Identify failures.** Flag any point where the deviation exceeds the specified tolerance. Note the location and magnitude.

## Equipment considerations

- For tolerances of 0.03 ft or tighter, use a **digital level and rod** or a **total station** for vertical measurements. RTK GNSS vertical accuracy (typically 0.03 to 0.05 ft under good conditions) is marginal for fine-grade checks.
- For rough-grade checks (0.05 ft tolerance), RTK is adequate and much faster.
- A robotic total station with a rod-mounted prism is a good compromise: near-level accuracy with single-person operation.

## Reporting

Generate a grade-check report that includes:

- Date, weather, equipment used, and control check results.
- Design surface reference (plan revision, surface name, date).
- Table of all check shots: point number, location, design elevation, observed elevation, deviation.
- Summary: total number of points checked, number passing, number failing.
- A plan-view map showing the check-shot locations with pass (green) and fail (red) annotations is useful for the contractor.

Deliver the report promptly — ideally the same day or the next morning. The contractor cannot proceed until the grade is accepted, so a delayed report delays the project.

## Communicating with the grading crew

When shots fail:

- Provide specific, actionable information: "Station 14+00, 15 ft left of centerline — 0.08 ft high. Cut 0.08."
- If a pattern emerges (e.g., the entire left side is 0.05 ft high), report the pattern as well as the individual points.
- Mark the failed locations on the ground with paint or flagging if the contractor requests it.
- Avoid judgmental language. The report is a measurement, not a criticism.

After the contractor regrading, perform a **re-check** on the previously failed areas and any adjacent areas that may have been affected.

## Documenting pass/fail

Maintain a log of all grade checks for the project:

- Date, area checked, result (pass or conditional pass or fail).
- If conditional pass: which points were marginal and what accommodation was agreed to.
- Signature or initials of the surveyor and the contractor's superintendent acknowledging the result.

This log becomes part of the project record and may be required for contract closeout or dispute resolution.

## Related

- [Pavement staking](pavement-staking.md)
- [Staking checklist](staking-checklist.md)
- [Working with contractors](working-with-contractors.md)
- [Site as-builts](../as-builts/site-as-builts.md)
