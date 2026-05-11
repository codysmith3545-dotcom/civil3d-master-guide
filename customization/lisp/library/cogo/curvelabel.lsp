;;; ------------------------------------------------------------
;;; Routine : CURVELABEL
;;; Purpose : Label an arc with Radius (R), arc Length (L), and
;;;           central angle (Delta). Places one MTEXT block near
;;;           the arc midpoint.
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------
;;; Picks an ARC entity directly. For arcs inside a polyline use
;;; CURVELABEL-ALL.

(defun rad->deg (r) (* r (/ 180.0 pi)))

(defun deg->dms-str (deg / d m s)
  (setq deg (abs deg))
  (setq d (fix deg))
  (setq m (fix (* 60.0 (- deg d))))
  (setq s (* 3600.0 (- deg (+ d (/ m 60.0)))))
  (strcat (itoa d) "-" (itoa m) "-" (rtos s 2 2)))

(defun c:CURVELABEL ( / ent edata typ ctr radius sa ea delta arclen mid txh)
  (setq ent (car (entsel "\nPick an arc: ")))
  (setq txh (getreal "\nText height <2.0>: "))
  (if (or (null txh) (<= txh 0)) (setq txh 2.0))
  (cond
    ((null ent) (princ))
    (T
      (setq edata (entget ent))
      (setq typ (cdr (assoc 0 edata)))
      (cond
        ((/= typ "ARC") (alert "Pick an ARC entity (not LINE or polyline arc segment)."))
        (T
          (setq ctr    (cdr (assoc 10 edata)))
          (setq radius (cdr (assoc 40 edata)))
          (setq sa     (cdr (assoc 50 edata)))   ; start angle, radians
          (setq ea     (cdr (assoc 51 edata)))   ; end angle, radians
          (setq delta  (- ea sa))
          (if (< delta 0) (setq delta (+ delta (* 2.0 pi))))
          (setq arclen (* radius delta))
          ;; midpoint = polar from center at (sa + delta/2) at radius
          (setq mid (polar ctr (+ sa (/ delta 2.0)) radius))
          (command "_.MTEXT" mid "_H" txh "_W" 0
                   (strcat "R=" (rtos radius 2 2)
                           "  L=" (rtos arclen 2 2)
                           "  \\Delta=" (deg->dms-str (rad->deg delta)))
                   "")))))
  (princ))
(princ)
