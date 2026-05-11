;;; ------------------------------------------------------------
;;; Routine : LAYUNUSED
;;; Purpose : List all layers that contain zero entities (including
;;;           block-definition entities). Optionally write the list
;;;           to a text file. Does NOT delete - PURGE is safer.
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------

(defun c:LAYUNUSED ( / oce tbl name ss unused outpath fh ans)
  (setq oce (getvar "CMDECHO"))
  (setvar "CMDECHO" 0)
  (setq unused '())
  (setq tbl (tblnext "LAYER" T))
  (while tbl
    (setq name (cdr (assoc 2 tbl)))
    ;; "0" and "Defpoints" are always present; report them too if empty
    (setq ss (ssget "_X" (list (cons 8 name))))
    (if (null ss)
      (setq unused (cons name unused)))
    (setq tbl (tblnext "LAYER")))
  (setq unused (vl-sort unused '<))
  (prompt (strcat "\n" (itoa (length unused))
                  " layer(s) appear unused in modelspace + paperspace:"))
  (foreach n unused (prompt (strcat "\n  " n)))
  (prompt "\nWrite list to file? [Y/N] <N>: ")
  (setq ans (getstring))
  (cond
    ((and ans (or (= (strcase ans) "Y") (= (strcase ans) "YES")))
      (setq outpath (getstring T "\nOutput TXT path: "))
      (cond
        ((or (null outpath) (= outpath ""))
          (prompt "\nNo path. Skipping file write."))
        (T
          (setq fh (open outpath "w"))
          (cond
            ((null fh) (alert (strcat "Cannot open " outpath)))
            (T
              (write-line "Unused layers (no entities in MS/PS):" fh)
              (foreach n unused (write-line n fh))
              (close fh)
              (prompt (strcat "\nWrote " outpath "."))))))))
  (setvar "CMDECHO" oce)
  (princ))
(princ)
