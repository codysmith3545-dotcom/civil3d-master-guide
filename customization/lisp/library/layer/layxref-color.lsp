;;; ------------------------------------------------------------
;;; Routine : LAYXREF-COLOR
;;; Purpose : Recolor every xref-dependent layer to a single AutoCAD
;;;           Color Index value. Useful when a survey base needs to
;;;           plot in a uniform grey/light color.
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------
;;; Notes   : Xref layers are identified by the "|" pipe character in
;;;           the name (e.g.  SURVEY|C-TOPO ). The routine uses the
;;;           LAYER command rather than touching the symbol table so
;;;           VISRETAIN behavior is honored.

(defun c:LAYXREF-COLOR ( / cval oce tbl name n)
  (setq oce (getvar "CMDECHO"))
  (setvar "CMDECHO" 0)
  (setq cval (getint "\nAutoCAD Color Index for all xref layers [1-255]: "))
  (cond
    ((or (null cval) (< cval 1) (> cval 255))
      (prompt "\nColor must be 1-255. Cancelled."))
    (T
      (setq n 0)
      (setq tbl (tblnext "LAYER" T))
      (while tbl
        (setq name (cdr (assoc 2 tbl)))
        (cond
          ((vl-string-search "|" name)
            (command "_.LAYER" "_C" (itoa cval) name "")
            (setq n (1+ n))))
        (setq tbl (tblnext "LAYER")))
      (prompt (strcat "\nRecolored " (itoa n) " xref-dependent layer(s) to ACI "
                      (itoa cval) "."))))
  (setvar "CMDECHO" oce)
  (princ))
(princ)
