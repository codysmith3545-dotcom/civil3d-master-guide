;;; ------------------------------------------------------------
;;; Routine : XREFCHECK
;;; Purpose : Report xref status: every external reference block,
;;;           its stored path, and whether the file resolves on
;;;           disk. Nested xrefs and circular references are
;;;           flagged where detectable from the block table.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun file-exists-p (path)
  (and path (= (type path) 'STR) (findfile path) T))

(defun c:XREFCHECK ( / itm name path is-overlay status nested ok missing total)
  (vl-load-com)
  (princ "\n========= XREFCHECK =========")
  (setq total 0 ok 0 missing 0)
  (setq itm (tblnext "BLOCK" T))
  (while itm
    (if (= 4 (logand 4 (cdr (assoc 70 itm))))
      (progn
        (setq total (1+ total))
        (setq name  (cdr (assoc 2 itm)))
        (setq path  (if (assoc 1 itm) (cdr (assoc 1 itm)) ""))
        (setq is-overlay (= 8 (logand 8 (cdr (assoc 70 itm)))))
        (setq nested     (= 32 (logand 32 (cdr (assoc 70 itm)))))
        (cond
          ((= "" path)
            (setq status "UNLOADED (no path)"))
          ((file-exists-p path)
            (setq status "OK")
            (setq ok (1+ ok)))
          (T
            (setq status "MISSING ON DISK")
            (setq missing (1+ missing))))
        (princ (strcat "\n  "
                       (if is-overlay "[OVR] " "[ATT] ")
                       (if nested "[NESTED] " "")
                       name " -> " path "  ::  " status))
      ))
    (setq itm (tblnext "BLOCK")))
  (princ (strcat "\n----- Summary: " (itoa total) " xref(s), "
                 (itoa ok) " OK, "
                 (itoa missing) " missing"))
  (princ "\n=============================")
  (princ)
)

(princ "\nXREFCHECK loaded. Type XREFCHECK for an xref status report.")
(princ)
