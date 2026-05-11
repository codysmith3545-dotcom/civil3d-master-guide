;;; ------------------------------------------------------------
;;; Routine : LAYSAVE-SET  /  LAYREST-SET
;;; Purpose : Friendly wrapper around AutoCAD's layer-state manager.
;;;           LAYSAVE-SET saves the current layer state under a name.
;;;           LAYREST-SET restores a saved state by name.
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------
;;; Notes   : Uses the LAYERSTATE command. The state captures
;;;           on/off, freeze/thaw, color, linetype, lineweight,
;;;           plotstyle, plotability, and viewport-freeze status.

(defun c:LAYSAVE-SET ( / sname desc oce)
  (setq oce (getvar "CMDECHO"))
  (setvar "CMDECHO" 0)
  (setq sname (getstring T "\nName for new layer state: "))
  (cond
    ((or (null sname) (= sname ""))
      (prompt "\nNo name supplied. Cancelled."))
    (T
      (setq desc (getstring T "\nDescription (optional, press Enter to skip): "))
      ;; LAYERSTATE _SAVE name [description]
      (if (or (null desc) (= desc ""))
        (command "_.LAYERSTATE" "_SAVE" sname "")
        (command "_.LAYERSTATE" "_SAVE" sname desc))
      (prompt (strcat "\nSaved layer state \"" sname "\"."))))
  (setvar "CMDECHO" oce)
  (princ))

(defun c:LAYREST-SET ( / sname oce)
  (setq oce (getvar "CMDECHO"))
  (setvar "CMDECHO" 0)
  (setq sname (getstring T "\nLayer state to restore: "))
  (cond
    ((or (null sname) (= sname ""))
      (prompt "\nNo name supplied. Cancelled."))
    (T
      (command "_.LAYERSTATE" "_RESTORE" sname)
      (prompt (strcat "\nRestored layer state \"" sname "\"."))))
  (setvar "CMDECHO" oce)
  (princ))
(princ)
