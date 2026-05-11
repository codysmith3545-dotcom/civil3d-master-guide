;;; ------------------------------------------------------------
;;; Routine : LAYREPORT
;;; Purpose : Write a CSV report of every layer plus the count of
;;;           entities residing on it in modelspace and paperspace.
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------
;;; Usage   : LAYREPORT  -> prompts for an output path. Writes CSV with
;;;           columns: Layer,Color,Linetype,Frozen,Locked,On,EntityCount
;;;           Entity count is from the entire drawing's modelspace + paper.
;;; Notes   : Counts via (ssget "_X" ...) which is fast even on large dwgs.

(defun c:LAYREPORT ( / fpath fh tbl name color ltype flags
                      frozen locked offstate ss cnt total)
  (setq fpath (getstring T "\nOutput CSV path (e.g. C:\\temp\\layers.csv): "))
  (cond
    ((or (null fpath) (= fpath ""))
      (prompt "\nNo path supplied. Cancelled.")
      (princ))
    (T
      (setq fh (open fpath "w"))
      (cond
        ((null fh)
          (alert (strcat "Could not open " fpath " for writing.")))
        (T
          (write-line "Layer,Color,Linetype,Frozen,Locked,On,EntityCount" fh)
          (setq total 0)
          (setq tbl (tblnext "LAYER" T))
          (while tbl
            (setq name    (cdr (assoc 2  tbl))
                  flags   (cdr (assoc 70 tbl))
                  color   (cdr (assoc 62 tbl))
                  ltype   (cdr (assoc 6  tbl)))
            ;; flag bits: 1 = frozen, 4 = locked. Off = negative color.
            (setq frozen   (if (= (logand flags 1) 1) "Y" "N"))
            (setq locked   (if (= (logand flags 4) 4) "Y" "N"))
            (setq offstate (if (< color 0) "N" "Y"))
            (setq color    (abs color))
            (setq ss (ssget "_X" (list (cons 8 name))))
            (setq cnt (if ss (sslength ss) 0))
            (setq total (+ total cnt))
            (write-line
              (strcat
                "\"" name "\","
                (itoa color) ","
                "\"" ltype "\","
                frozen "," locked "," offstate ","
                (itoa cnt))
              fh)
            (setq tbl (tblnext "LAYER")))
          (close fh)
          (prompt (strcat "\nWrote layer report to " fpath
                          " (" (itoa total) " entities counted).")))))
    )
  (princ))
(princ)
