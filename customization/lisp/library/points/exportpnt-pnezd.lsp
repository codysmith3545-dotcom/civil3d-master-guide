;;; ------------------------------------------------------------
;;; Routine : EXPORTPNT-PNEZD
;;; Purpose : Export Civil 3D COGO points to a PNEZD comma-delimited
;;;           text file (Point,Northing,Easting,Elevation,Description).
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026 (requires Civil 3D - COGO
;;;           points are AeccDbCogoPoint objects accessed via COM).
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------
;;; Notes   : Uses (ssget "_X") with DXF filter for AECC_COGO_POINT
;;;           entity name. For each point, pulls Number/Northing/
;;;           Easting/Elevation/RawDescription via vla- accessors.
;;;           Coordinates are written with 4-decimal precision; tweak
;;;           the (rtos ... 2 4) call if your spec is different.

(vl-load-com)

(defun c:EXPORTPNT-PNEZD ( / fpath fh ss i ent obj n e z d num cnt)
  (setq fpath (getstring T "\nOutput PNEZD CSV path: "))
  (cond
    ((or (null fpath) (= fpath ""))
      (prompt "\nNo path. Cancelled.")
      (princ))
    (T
      (setq ss (ssget "_X" '((0 . "AECC_COGO_POINT"))))
      (cond
        ((null ss)
          (alert "No Civil 3D COGO points found in drawing."))
        (T
          (setq fh (open fpath "w"))
          (cond
            ((null fh) (alert (strcat "Cannot open " fpath " for write.")))
            (T
              (setq i 0 cnt 0)
              (while (< i (sslength ss))
                (setq ent (ssname ss i))
                (setq obj (vlax-ename->vla-object ent))
                (setq num (vlax-get obj 'Number))
                (setq n   (vlax-get obj 'Northing))
                (setq e   (vlax-get obj 'Easting))
                (setq z   (vlax-get obj 'Elevation))
                (setq d   (vlax-get obj 'RawDescription))
                (write-line
                  (strcat
                    (itoa (fix num)) ","
                    (rtos n 2 4) ","
                    (rtos e 2 4) ","
                    (rtos z 2 4) ","
                    (if d d ""))
                  fh)
                (setq cnt (1+ cnt))
                (setq i (1+ i)))
              (close fh)
              (prompt (strcat "\nWrote " (itoa cnt) " point(s) to " fpath "."))))))))
  (princ))
(princ)
