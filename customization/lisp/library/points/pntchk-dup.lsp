;;; ------------------------------------------------------------
;;; Routine : PNTCHK-DUP
;;; Purpose : Scan all Civil 3D COGO points and report any duplicate
;;;           point numbers (which should not normally exist - Civil
;;;           3D enforces uniqueness, but legacy imports and bad
;;;           merges can leave dupes behind).
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------

(vl-load-com)

(defun c:PNTCHK-DUP ( / ss i obj nums sorted prev dups)
  (setq ss (ssget "_X" '((0 . "AECC_COGO_POINT"))))
  (cond
    ((null ss) (alert "No COGO points found."))
    (T
      (setq nums '())
      (setq i 0)
      (while (< i (sslength ss))
        (setq obj (vlax-ename->vla-object (ssname ss i)))
        (setq nums (cons (fix (vlax-get obj 'Number)) nums))
        (setq i (1+ i)))
      (setq sorted (vl-sort nums '<))
      (setq dups '() prev nil)
      (foreach n sorted
        (if (and prev (= n prev))
          (if (not (member n dups)) (setq dups (cons n dups))))
        (setq prev n))
      (cond
        ((null dups)
          (prompt (strcat "\nNo duplicate point numbers. Scanned "
                          (itoa (sslength ss)) " point(s).")))
        (T
          (prompt (strcat "\nFound " (itoa (length dups))
                          " duplicate point number(s):"))
          (foreach d (vl-sort dups '<)
            (prompt (strcat "\n  " (itoa d))))))))
  (princ))
(princ)
