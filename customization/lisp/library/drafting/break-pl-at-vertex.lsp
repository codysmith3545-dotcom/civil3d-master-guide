;;; ------------------------------------------------------------
;;; Routine : BREAK-PL-AT-VERTEX
;;; Purpose : Break a polyline into two at a picked vertex. The
;;;           pick is snapped to the closest vertex (not segment
;;;           interior). The originally-picked polyline becomes
;;;           segments 0..k; a new polyline is created containing
;;;           segments k..n. Uses the built-in BREAK command
;;;           rather than rebuilding the polyline by hand.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun closest-vertex (ent pick / edata verts best best-d v d)
  (setq edata (entget ent))
  (setq verts nil)
  (foreach pair edata
    (if (= 10 (car pair)) (setq verts (cons (cdr pair) verts))))
  (setq verts (reverse verts))
  (setq best     (car verts)
        best-d   (distance (car verts) pick))
  (foreach v verts
    (setq d (distance v pick))
    (if (< d best-d)
      (progn (setq best v) (setq best-d d))))
  best)

(defun c:BREAK-PL-AT-VERTEX ( / pick ent edata typ pt old-cmd old-osm)
  (setq old-cmd (getvar "CMDECHO")
        old-osm (getvar "OSMODE"))
  (setvar "CMDECHO" 0)
  (princ "\nPick polyline near the vertex to break at: ")
  (setq pick (entsel))
  (if (null pick)
    (prompt "\nNothing selected.")
    (progn
      (setq ent  (car pick))
      (setq edata (entget ent))
      (setq typ (cdr (assoc 0 edata)))
      (if (not (= typ "LWPOLYLINE"))
        (prompt "\nBREAK-PL-AT-VERTEX requires an LWPOLYLINE (heavy POLYLINE not supported).")
        (progn
          (setq pt (closest-vertex ent (cadr pick)))
          (setvar "OSMODE" 0)
          ;; BREAK with first=second point splits without a gap.
          (command "_.BREAK" ent "_F" pt pt)
          (princ (strcat "\nBroke polyline at vertex " (rtos (car pt) 2 3)
                         ", " (rtos (cadr pt) 2 3) ".")))))
  )
  (setvar "OSMODE" old-osm)
  (setvar "CMDECHO" old-cmd)
  (princ))

(princ "\nBREAK-PL-AT-VERTEX loaded. Type BREAK-PL-AT-VERTEX to break an LWPOLYLINE at the nearest vertex.")
(princ)
