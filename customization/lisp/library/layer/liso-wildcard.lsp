;;; ------------------------------------------------------------
;;; Routine : LISO-WILDCARD
;;; Purpose : Isolate layers matching a wildcard - freeze everything else.
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------
;;; Usage   : LISO-WILDCARD  then a pattern like  C-ROAD-*
;;;           Layers that match stay thawed and on; all others freeze.
;;;           The current layer is automatically kept thawed so AutoCAD
;;;           doesn't reject the freeze command.

(defun c:LISO-WILDCARD ( / pat oce oclayer tbl name kept frozen)
  (setq oce (getvar "CMDECHO"))
  (setvar "CMDECHO" 0)
  (setq oclayer (getvar "CLAYER"))
  (setq pat (getstring T "\nIsolate layers matching pattern: "))
  (cond
    ((or (null pat) (= pat ""))
      (prompt "\nNo pattern. Cancelled."))
    (T
      (setq kept 0 frozen 0)
      (setq tbl (tblnext "LAYER" T))
      (while tbl
        (setq name (cdr (assoc 2 tbl)))
        (cond
          ((wcmatch (strcase name) (strcase pat))
            (setq kept (1+ kept))
            ;; Thaw + turn on matched layers via LAYER command
            (command "_.LAYER" "_T" name "_ON" name ""))
          ((= (strcase name) (strcase oclayer))
            ;; never freeze the current layer
            nil)
          (T
            (setq frozen (1+ frozen))
            (command "_.LAYER" "_F" name "")))
        (setq tbl (tblnext "LAYER")))
      (prompt (strcat "\nIsolated " (itoa kept)
                      " layer(s); froze " (itoa frozen) " other(s)."))))
  (setvar "CMDECHO" oce)
  (princ))
(princ)
