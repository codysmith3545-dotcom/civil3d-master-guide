;;; ------------------------------------------------------------
;;; Routine : UNITS-IMPERIAL-SET
;;; Purpose : Set drawing units / unit-mode system variables to
;;;           the U.S. survey defaults: decimal feet linear,
;;;           surveyor's units angular, INSUNITS = 2 (feet),
;;;           LUPREC 3, AUPREC 4, four-digit precision angles.
;;;           Reports prior values so the user can revert.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(setq UNITS-IMPERIAL-DEFAULTS*
  '(("LUNITS"    . 2)   ;; decimal
    ("LUPREC"    . 3)   ;; 3 decimals
    ("AUNITS"    . 4)   ;; surveyor's units
    ("AUPREC"    . 4)   ;; 4 decimals on angles
    ("INSUNITS"  . 2)   ;; feet
    ("MEASUREMENT" . 0) ;; imperial
    ("PDMODE"    . 3)   ;; cross point
    ("PDSIZE"    . -3))) ;; 3% of viewport

(defun c:UNITS-IMPERIAL-SET ( / pair name target prev)
  (princ "\nSetting U.S. survey imperial unit defaults...")
  (princ "\nPrior values:")
  (foreach pair UNITS-IMPERIAL-DEFAULTS*
    (setq name   (car pair))
    (setq target (cdr pair))
    (setq prev   (getvar name))
    (princ (strcat "\n  " name " was " (vl-princ-to-string prev)
                   " -> setting " (vl-princ-to-string target)))
    (setvar name target))
  (princ "\nDone. UNITS dialog will reflect these settings.")
  (princ)
)

(princ "\nUNITS-IMPERIAL-SET loaded. Type UNITS-IMPERIAL-SET to apply U.S. survey unit defaults.")
(princ)
