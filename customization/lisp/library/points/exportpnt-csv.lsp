;;; ------------------------------------------------------------
;;; Routine : EXPORTPNT-CSV
;;; Purpose : Export Civil 3D COGO points to a CSV with a user-chosen
;;;           field order. Choices: P N E Z D (number/northing/easting
;;;           /elevation/description). User types a code like "PNEZD",
;;;           "ENZD", "PENZD" etc.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------

(vl-load-com)

(defun expnt-field (code obj)
  (cond
    ((= code "P") (itoa (fix (vlax-get obj 'Number))))
    ((= code "N") (rtos (vlax-get obj 'Northing) 2 4))
    ((= code "E") (rtos (vlax-get obj 'Easting) 2 4))
    ((= code "Z") (rtos (vlax-get obj 'Elevation) 2 4))
    ((= code "D") (vlax-get obj 'RawDescription))
    (T "")))

(defun c:EXPORTPNT-CSV ( / fpath fh ss i ent obj fields fld cnt line k codes)
  (setq fields (strcase (getstring T "\nField order code (e.g. PNEZD, ENZD): ")))
  (cond
    ((or (null fields) (= fields ""))
      (prompt "\nNo field code. Cancelled.")
      (princ))
    (T
      ;; validate every character is in {P,N,E,Z,D}
      (setq k 0 codes T)
      (while (and codes (< k (strlen fields)))
        (if (not (vl-position (substr fields (1+ k) 1) '("P" "N" "E" "Z" "D")))
          (setq codes nil))
        (setq k (1+ k)))
      (cond
        ((null codes)
          (alert "Field code may only contain P,N,E,Z,D."))
        (T
          (setq fpath (getstring T "\nOutput CSV path: "))
          (cond
            ((or (null fpath) (= fpath ""))
              (prompt "\nNo path. Cancelled."))
            (T
              (setq ss (ssget "_X" '((0 . "AECC_COGO_POINT"))))
              (cond
                ((null ss) (alert "No Civil 3D COGO points found."))
                (T
                  (setq fh (open fpath "w"))
                  (cond
                    ((null fh) (alert (strcat "Cannot write to " fpath)))
                    (T
                      ;; header row: characters separated by commas
                      (setq line "" k 0)
                      (while (< k (strlen fields))
                        (setq line (strcat line
                                           (if (= k 0) "" ",")
                                           (substr fields (1+ k) 1)))
                        (setq k (1+ k)))
                      (write-line line fh)
                      (setq i 0 cnt 0)
                      (while (< i (sslength ss))
                        (setq ent (ssname ss i))
                        (setq obj (vlax-ename->vla-object ent))
                        (setq line "" k 0)
                        (while (< k (strlen fields))
                          (setq fld (expnt-field (substr fields (1+ k) 1) obj))
                          (setq line (strcat line (if (= k 0) "" ",") fld))
                          (setq k (1+ k)))
                        (write-line line fh)
                        (setq cnt (1+ cnt))
                        (setq i (1+ i)))
                      (close fh)
                      (prompt (strcat "\nWrote " (itoa cnt)
                                      " point(s) with order \"" fields
                                      "\" to " fpath "."))))))))))))
  (princ))
(princ)
