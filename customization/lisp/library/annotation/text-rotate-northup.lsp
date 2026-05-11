;;; ------------------------------------------------------------
;;; Routine : TEXT-ROTATE-NORTHUP
;;; Purpose : Force every selected TEXT/MTEXT to a rotation that
;;;           is readable from a north-up plan view. Text that is
;;;           rotated between 90 and 270 deg (left half) is
;;;           flipped 180 deg. All other rotations are clamped to
;;;           the range -90..+90 deg.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun c:TEXT-ROTATE-NORTHUP ( / ss i n ent edata typ rot newrot pair old-cmd)
  (setq old-cmd (getvar "CMDECHO"))
  (setvar "CMDECHO" 0)
  (princ "\nSelect text/mtext to normalise rotation: ")
  (setq ss (ssget '((0 . "TEXT,MTEXT"))))
  (if ss
    (progn
      (setq i 0
            n (sslength ss))
      (while (< i n)
        (setq ent (ssname ss i))
        (setq edata (entget ent))
        (setq typ (cdr (assoc 0 edata)))
        (setq pair (assoc 50 edata))
        (if pair
          (progn
            (setq rot (* (/ 180.0 pi) (cdr pair)))
            ;; Normalise to -180..+180
            (while (> rot  180.0) (setq rot (- rot 360.0)))
            (while (< rot -180.0) (setq rot (+ rot 360.0)))
            (setq newrot
              (cond
                ((or (> rot 90.0) (< rot -90.0)) (- rot 180.0))
                (T rot)))
            (while (> newrot  180.0) (setq newrot (- newrot 360.0)))
            (while (< newrot -180.0) (setq newrot (+ newrot 360.0)))
            (setq edata (subst (cons 50 (* (/ pi 180.0) newrot)) pair edata))
            (entmod edata)
          )
        )
        (setq i (1+ i))
      )
      (princ (strcat "\nNormalised " (itoa n) " text entities."))
    )
    (prompt "\nNothing selected.")
  )
  (setvar "CMDECHO" old-cmd)
  (princ)
)

(princ "\nTEXT-ROTATE-NORTHUP loaded. Type TEXT-ROTATE-NORTHUP to flip selected text into the readable half-plane.")
(princ)
