;;; ------------------------------------------------------------
;;; Routine : ZOOM-EXTENTS-ALL-TABS
;;; Purpose : Switch through every layout tab (and model), run
;;;           ZOOM Extents on each, then return to the originally
;;;           active tab. Useful before publishing / sheet set
;;;           batch plots so each layout looks framed.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun c:ZOOM-EXTENTS-ALL-TABS ( / start layouts i n lay name old-cmd)
  (vl-load-com)
  (setq old-cmd (getvar "CMDECHO"))
  (setvar "CMDECHO" 0)
  (setq start (getvar "CTAB"))
  (setq layouts
    (vla-get-Layouts
      (vla-get-ActiveDocument (vlax-get-acad-object))))
  (setq n (vla-get-Count layouts) i 0)
  (princ (strcat "\nZooming extents on " (itoa n) " layout/model tab(s)..."))
  (while (< i n)
    (setq lay (vla-Item layouts i))
    (setq name (vla-get-Name lay))
    (setvar "CTAB" name)
    (command "_.ZOOM" "_E")
    (princ (strcat "\n  zoomed " name))
    (setq i (1+ i)))
  (setvar "CTAB" start)
  (setvar "CMDECHO" old-cmd)
  (princ (strcat "\nReturned to tab " start "."))
  (princ)
)

(princ "\nZOOM-EXTENTS-ALL-TABS loaded. Type ZOOM-EXTENTS-ALL-TABS to zoom-extents every layout tab.")
(princ)
