;;; ------------------------------------------------------------
;;; Routine : LFRZ-PATTERN
;;; Purpose : Freeze all layers whose names match a wildcard pattern.
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------
;;; Usage   : LFRZ-PATTERN  then type a wildcard like  C-STRM-*
;;;           Wildcards follow AutoCAD's wcmatch syntax
;;;           (* matches any chars, ? matches one, # one digit, @ one letter).
;;; Notes   : Will not freeze the current layer (CLAYER) - AutoCAD refuses.
;;;           Uses (command "_.LAYER" "_F" pat "") to honor xref locking
;;;           and reactor side-effects.

(defun c:LFRZ-PATTERN ( / pat oce oclayer ed tbl name n frozen)
  (setq oce (getvar "CMDECHO"))
  (setvar "CMDECHO" 0)
  (setq oclayer (getvar "CLAYER"))
  (setq pat (getstring T "\nEnter layer wildcard pattern (e.g. C-STRM-*): "))
  (if (or (null pat) (= pat ""))
    (progn
      (prompt "\nNo pattern supplied. Cancelled.")
      (setvar "CMDECHO" oce)
      (princ))
    (progn
      ;; Walk the symbol table once to count what we will freeze.
      (setq n 0 frozen 0)
      (setq tbl (tblnext "LAYER" T))
      (while tbl
        (setq name (cdr (assoc 2 tbl)))
        (if (and (wcmatch (strcase name) (strcase pat))
                 (/= (strcase name) (strcase oclayer)))
          (setq n (1+ n)))
        (setq tbl (tblnext "LAYER")))
      (if (= n 0)
        (prompt (strcat "\nNo layers matched \"" pat "\"."))
        (progn
          (command "_.LAYER" "_F" pat "")
          (setq frozen n)
          (prompt (strcat "\nFroze " (itoa frozen)
                          " layer(s) matching \"" pat "\"."))))
      (setvar "CMDECHO" oce)
      (princ))))
(princ)
