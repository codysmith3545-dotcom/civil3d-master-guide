;;; ------------------------------------------------------------
;;; Routine : STA-OFFSET-LABEL
;;; Purpose : Station + offset labels relative to a reference
;;;           alignment polyline. Repeatedly pick points; for
;;;           each, label "STA xx+xx.xx OFF yy.yy R/L". The
;;;           reference is a vanilla polyline so the routine
;;;           works without a real Civil 3D Alignment.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun format-sta (s / sign hund whole frac)
  (setq sign (if (< s 0) "-" ""))
  (setq s (abs s))
  (setq hund (fix (/ s 100.0)))
  (setq frac (- s (* hund 100.0)))
  (strcat sign (itoa hund) "+"
          (if (< frac 10.0) "0" "")
          (rtos frac 2 2)))

(defun c:STA-OFFSET-LABEL ( / aln p sta off side ang0 cp ang txt ht
                             pAt par old-cmd old-osm)
  (setq old-cmd (getvar "CMDECHO")
        old-osm (getvar "OSMODE"))
  (setvar "CMDECHO" 0)
  (vl-load-com)
  (princ "\nSelect reference alignment polyline: ")
  (setq aln (car (entsel)))
  (if (or (null aln)
          (not (member (cdr (assoc 0 (entget aln)))
                       '("LWPOLYLINE" "POLYLINE" "LINE" "ARC" "SPLINE"))))
    (prompt "\nReference must be a LINE/LWPOLYLINE/POLYLINE/ARC/SPLINE.")
    (progn
      (setq ht (getvar "DIMTXT"))
      (setvar "OSMODE" 33) ;; endpoint + intersect snap
      (while (setq p (getpoint "\nPick point to label (Enter to quit): "))
        (setq pAt  (vlax-curve-getClosestPointTo aln p))
        (setq par  (vlax-curve-getParamAtPoint aln pAt))
        (setq sta  (vlax-curve-getDistAtParam aln par))
        (setq ang  (vlax-curve-getFirstDeriv aln par))
        (setq ang  (angle '(0 0 0) ang))
        (setq off  (distance pAt p))
        ;; Determine side via 2D cross product (alignment direction X to-pick)
        (setq side
          (if (> (- (* (cos ang) (- (cadr p) (cadr pAt)))
                    (* (sin ang) (- (car p)  (car pAt))))
                 0.0)
            "L" "R"))
        (setq txt (strcat "STA " (format-sta sta)
                          " OFF " (rtos off 2 2) " " side))
        (setvar "OSMODE" 0)
        (command "_.-MTEXT" p "_H" ht "_J" "_BL" "_W" 0.0 txt "")
        (setvar "OSMODE" 33)
        (princ (strcat "\n  " txt))
      )
    )
  )
  (setvar "OSMODE" old-osm)
  (setvar "CMDECHO" old-cmd)
  (princ)
)

(princ "\nSTA-OFFSET-LABEL loaded. Type STA-OFFSET-LABEL to label points by station+offset from a polyline.")
(princ)
