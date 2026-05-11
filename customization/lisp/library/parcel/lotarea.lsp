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
