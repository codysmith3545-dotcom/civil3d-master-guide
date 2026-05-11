;;; ------------------------------------------------------------
;;; Routine : PERP-STAKE
;;; Purpose : Compute a perpendicular offset stake from a baseline.
;;;           Pick two points defining the baseline, then a target.
;;;           Report station-along-baseline and signed offset
;;;           (+ = right of baseline direction, - = left).
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------

(defun c:PERP-STAKE ( / pa pb tgt dx dy len bx by tx ty u v station offset
                         cross sign-sym)
  (setq pa (getpoint "\nBaseline start (sta 0+00): "))
  (cond
    ((null pa) (princ))
    (T
      (setq pb (getpoint pa "\nBaseline end (direction of increasing station): "))
      (cond
        ((null pb) (princ))
        (T
          (setq dx (- (car pb) (car pa)))
          (setq dy (- (cadr pb) (cadr pa)))
          (setq len (sqrt (+ (* dx dx) (* dy dy))))
          (cond
            ((<= len 0) (alert "Baseline length is zero."))
            (T
              (while (setq tgt (getpoint "\nTarget point [Enter to stop]: "))
                (setq tx (- (car tgt) (car pa)))
                (setq ty (- (cadr tgt) (cadr pa)))
                ;; project (tx,ty) onto (dx,dy)/len
                (setq station (/ (+ (* tx dx) (* ty dy)) len))
                ;; cross product (z-component) gives signed offset
                (setq cross (- (* dx ty) (* dy tx)))
                ;; offset magnitude is |cross|/len; sign: positive means
                ;; target is to the LEFT of baseline direction in math
                ;; convention. Survey convention: + = right. Flip.
                (setq offset (/ (- cross) len))
                (setq sign-sym (if (>= offset 0) "R" "L"))
                (prompt
                  (strcat "\n  Station="
                          (rtos station 2 4)
                          "   Offset=" (rtos (abs offset) 2 4) " " sign-sym))))))))))
  (princ))
(princ)
