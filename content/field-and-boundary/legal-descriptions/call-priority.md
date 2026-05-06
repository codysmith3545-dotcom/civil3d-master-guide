---
title: "Call Priority and Brown's Hierarchy"
section: "field-and-boundary/legal-descriptions"
order: 50
visibility: public
tags: [calls, brown-hierarchy, senior-junior, record-vs-measured, retracement]
updated: 2026-05-06
sources:
  - title: "Brown's Boundary Control and Legal Principles, 8th ed."
    url: https://www.wiley.com/en-us/Brown%27s+Boundary+Control+and+Legal+Principles%2C+8th+Edition-p-9781119911708
    verified: 2026-05-06
  - title: "BLM Manual of Surveying Instructions, 2009"
    url: https://www.blm.gov/sites/blm.gov/files/uploads/Manual%20of%20Surveying%20Instructions%202009.pdf
    verified: 2026-05-06
---

> **TL;DR**
> 1. When deed elements disagree, the long-standing rule of construction is that **calls control over distances and bearings**: monuments, adjoiners, and natural features outrank measurements.
> 2. Brown's hierarchy: original undisturbed monuments > relocated original monuments > original lines marked > calls (to monuments and adjoiners) > measurements (course and distance) > area > coordinates.
> 3. Senior rights apply across descriptions: when two grants out of common ownership conflict, the earlier grant prevails.

## Why a hierarchy exists

Deeds often contain inconsistent information. A description may say a course "runs N 88°00'00" E, 200.00 feet to an iron pin in the West line of Smith's tract" — and on the ground, the iron pin is found 198.62 feet away on a slightly different bearing. The retracing surveyor must decide which element controls. The hierarchy is the framework courts and surveyors use to make that choice.

## Brown's hierarchy of conflicting elements

Walter Robillard's update of Curtis Brown's classic statement orders the elements like this, from highest authority to lowest:

1. **Senior rights.** When two descriptions overlap, the senior conveyance controls the shared line. This is a doctrine, not a measurement; it sits above the measurement-element hierarchy.
2. **Written intentions of the parties.** The plain meaning of the deed, read as a whole and in the context of its making.
3. **Original undisturbed monuments.** A physical monument set by the original surveyor, found in place, controls every other element.
4. **Relocated original monuments.** A monument that has been disturbed but whose position can be re-established from corroborating evidence.
5. **Natural monuments.** Rivers, ridges, and other persistent natural features called for in the description, subject to migration in the case of water.
6. **Artificial monuments.** Iron pins, concrete monuments, fences, walls, and other constructed features called for in the description.
7. **Adjoiners.** A call "to the line of Jones" runs to that line, even if the bearing-distance to the line is wrong.
8. **Course and distance.** Bearings and distances as written.
9. **Area.** "Containing 5.00 acres, more or less" yields when prior elements disagree.
10. **Coordinates.** The lowest-priority element when stated; coordinates do not override monuments, calls, or distances.

The list is not absolute; courts can deviate when the parties' intent points elsewhere. But it is the working framework.

## "Calls control" in practice

When the deed says "to a stone, thence N 87° E, 200 feet to the line of Jones," and you find the stone undisturbed in the right relationship to the rest of the survey, you hold the stone — not 200 feet from where you started. When you find the line of Jones at 198.6 feet, you stop at the line — not at 200 feet beyond. The bearing and the distance describe the surveyor's measurement; the call describes the destination.

This applies even when modern measurements disagree by amounts that look indefensible. A 1900 deed measured to the nearest foot will always disagree with a modern total station; that does not mean the modern measurement controls.

## Record vs measured

A retracement plat shows both: the **record** call from the deed and the **measured** value from the field. The format is conventional:

- "S 02°11'06" E (R), S 02°10'42" E (M), 412.30 feet (R), 412.41 feet (M)"

Showing both protects the next surveyor and preserves the record. When the difference is consequential, write a note.

## Senior and junior rights

Calls within a single description are subject to the hierarchy above. Calls **across** descriptions — when your boundary is shared with an adjoiner whose deed predates yours — are subject to senior rights. The senior adjoiner's line wins on the shared boundary. Your description, even if drawn after the senior, cannot push that line.

This matters every time you read multiple deeds out of a common grantor. Read the oldest first; subsequent grants are constrained by what is left.

## When elements agree, all is well

The hierarchy is invoked only when elements conflict. If your monument, your bearing, your distance, your call, and your area all close cleanly, you do not need to choose — the description is internally consistent. Most clean retracements never invoke the hierarchy.

## Common pitfalls

- Holding a measurement-perfect coordinate over a found, undisturbed monument. The coordinate is the lowest priority; the monument is among the highest.
- Treating a found pin "by another surveyor" as if it were original when it is not. Verify provenance before holding.
- Forgetting that "to the line of Jones" is a call to an adjoiner — it runs to that line regardless of the stated distance.
- Letting GIS coordinates or a recent plat with coordinates trump record calls.
- Using area to override calls. Area is the floor.

## Related

- [Retracement methodology](../boundary-and-alta/retracement-methodology.md)
- [Hierarchy of evidence (monuments)](../monuments-and-evidence/hierarchy-of-evidence.md)
- [Writing metes-and-bounds](writing-metes-and-bounds.md)
