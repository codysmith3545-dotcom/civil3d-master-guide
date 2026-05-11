;;; ------------------------------------------------------------
;;; Routine : PNTFILTER-DESC
;;; Purpose : Select all Civil 3D COGO points whose RawDescription
;;;           matches a wildcard, and put them in the AutoCAD pickset
;;;           (i.e. the user can then run any command that takes a
;;;           selection set, e.g. ERASE, MOVE).
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------
;;; Notes   : Builds a fresh selection set via (ssadd) one ename at
;;;           a time. After this returns, the user can immediately
;;;           type "ERASE P <Enter>" to act on it (P = "previous").

(vl-load-com)

(defun c:PNTFILTER-DESC ( / pat ss i ent obj desc result cnt)
  (setq pat (getstring T "\nDescription wildcard (e.g. EP, IP*, *MH*): "))
  (cond
    ((or (null pat) (= pat ""))
      (prompt "\nNo pattern. Cancelled.")
      (princ))
    (T
      (setq ss (ssget "_X" '((0 . "AECC_COGO_POINT"))))
      (cond
        ((null ss) (alert "No COGO points found."))
        (T
          (setq result (ssadd))
          (setq i 0 cnt 0)
          (while (< i (sslength ss))
            (setq ent (ssname ss i))
            (setq obj (vlax-ename->vla-object ent))
            (setq desc (vlax-get obj 'RawDescription))
            (if (and desc (wcmatch (strcase desc) (strcase pat)))
              (progn
                (ssadd ent result)
                (setq cnt (1+ cnt))))
            (setq i (1+ i)))
          (cond
            ((= cnt 0)
              (prompt (strcat "\nNo COGO points matched description \""
                              pat "\".")))
            (T
              (sssetfirst nil result)
              (prompt (strcat "\nSelected " (itoa cnt)
                              " point(s) matching \"" pat "\".")
                      )))))))
  (princ))
(princ)
