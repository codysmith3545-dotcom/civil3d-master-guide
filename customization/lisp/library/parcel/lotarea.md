---
title: "LOTAREA — Label closed polyline with acres and square feet"
section: customization/lisp/library/parcel
tags: [autolisp, lisp, parcel, area, label]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Pick a closed polyline.
> 2. LOTAREA reads `Area` from the polyline's ActiveX object and writes a two-line MText label (`sq ft` / `ac`) at the bounding-box midpoint.
> 3. Drawing units must be feet for the "sq ft" / "ac" wording to be correct.

## Command

`c:LOTAREA`

## What it does

LOTAREA prompts for a single LWPOLYLINE or POLYLINE entity. It refuses the selection if the polyline is not closed (DXF group 70 bit 1 not set). For a closed polyline it reads `Area` via the polyline's `IAcadLWPolyline` interface, divides by 43 560 to get acres, and writes an MText that reads `Area: <sqft> sq ft / <ac> ac`.

The label is placed at the midpoint of the polyline's bounding box (`vla-GetBoundingBox`). That is *not* the geometric centroid; for an irregular lot you may need to drag the label after placement. The MText uses the current text style and `DIMTXT` height so it matches the active dimension scale.

Output goes to the current layer. Wrap the routine in a layer-set helper (or set `CLAYER` before calling) to drop the label on a dedicated annotation layer such as `V-PROP-LINE-TEXT`.

## Prompts

1. `Select closed polyline for lot-area label:` — pick the lot polyline.

## Notes & gotchas

- Drawing units must be decimal feet. If the drawing is in inches or metric, the labelled "sq ft" and "ac" strings will be wrong — replace the unit literals or convert before labelling.
- The bounding-box midpoint is an approximation. For an L-shaped or concave lot the midpoint can land outside the polyline.
- This routine intentionally does *not* create a Civil 3D Parcel. To create a real `AeccDbParcel`, use `CreateParcelFromObjects` (`MAPPCLCREATE`) — that operation needs a parcel style and label style and is out of scope for a vanilla AutoLISP helper.
- ActiveX (`vl-load-com`) is required; the polyline `Area` property comes from the COM interface.

## Source listing

```lisp
;;; ------------------------------------------------------------
;;; Routine : LOTAREA
;;; Purpose : Compute area of a selected closed LWPOLYLINE
;;;           and place an MText label (acres + square feet)
;;;           near the polyline's bounding-box midpoint.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026 (vanilla AutoCAD too)
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun c:LOTAREA ( / ent edata area-sqft area-acre vobj bb-min bb-max
                    mid lay txt old-cmd old-osm)
  (setq old-cmd (getvar "CMDECHO")
        old-osm (getvar "OSMODE"))
  (setvar "CMDECHO" 0)
  (setvar "OSMODE" 0)
  (vl-load-com)
  (princ "\nSelect closed polyline for lot-area label: ")
  (setq ent (car (entsel)))
  (if ent
    (progn
      (setq edata (entget ent))
      (cond
        ((not (member (cdr (assoc 0 edata)) '("LWPOLYLINE" "POLYLINE")))
          (prompt "\nSelected entity is not a polyline.")
        )
        ((not (= 1 (logand 1 (cdr (assoc 70 edata)))))
          (prompt "\nPolyline is not closed - cannot compute lot area.")
        )
        (T
          (setq vobj (vlax-ename->vla-object ent))
          (setq area-sqft (vla-get-Area vobj))
          (setq area-acre (/ area-sqft 43560.0))
          (vla-GetBoundingBox vobj 'bb-min 'bb-max)
          (setq bb-min (vlax-safearray->list bb-min)
                bb-max (vlax-safearray->list bb-max))
          (setq mid (list (/ (+ (car bb-min) (car bb-max)) 2.0)
                          (/ (+ (cadr bb-min) (cadr bb-max)) 2.0)
                          0.0))
          (setq lay (cdr (assoc 8 edata)))
          (setq txt (strcat "Area: "
                            (rtos area-sqft 2 0) " sq ft\\P"
                            (rtos area-acre 2 3) " ac"))
          (command "_.-MTEXT" mid
                              "_H" (getvar "DIMTXT")
                              "_J" "_MC"
                              "_W" 0.0
                              txt "")
          (princ (strcat "\nLot area on layer " lay
                         ": " (rtos area-sqft 2 0) " sq ft / "
                         (rtos area-acre 2 3) " ac"))
        )
      )
    )
    (prompt "\nNothing selected.")
  )
  (setvar "OSMODE" old-osm)
  (setvar "CMDECHO" old-cmd)
  (princ)
)

(princ "\nLOTAREA loaded. Type LOTAREA to label a closed polyline with area.")
(princ)
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Should work; relies only on stock ActiveX. |
| 2024 | not tested in sandbox | Should work. |
| 2025 | not tested in sandbox | Should work. |
| 2026 | not tested in sandbox | Should work. |
