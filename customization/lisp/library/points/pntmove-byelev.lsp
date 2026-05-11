;;; ------------------------------------------------------------
;;; Routine : PNTMOVE-BYELEV
;;; Purpose : Apply a vertical (elevation) delta to selected COGO
;;;           points. Useful for shifting a topo by a known offset
;;;           (e.g. resolving a benchmark conflict).
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------

(vl-load-com)

(defun c:PNTMOVE-BYELEV ( / sel delta i obj cur new cnt ans)
  (prompt "\nSelect COGO points to shift vertically: ")
  (setq sel (ssget '((0 . "AECC_COGO_POINT"))))
  (cond
    ((null sel) (prompt "\nNo points selected.") (princ))
    (T
      (setq delta (getreal "\nElevation delta (positive raises, negative lowers): "))
      (cond
        ((null delta) (prompt "\nCancelled."))
        (T
          (prompt (strcat "\nAbout to shift " (itoa (sslength sel))
                          " point(s) by " (rtos delta 2 4) ". Proceed? [Y/N] <Y>: "))
          (setq ans (getstring))
          (cond
            ((and ans (or (= (strcase ans) "N") (= (strcase ans) "NO")))
              (prompt "\nCancelled by user."))
            (T
              (setq i 0 cnt 0)
              (while (< i (sslength sel))
                (setq obj (vlax-ename->vla-object (ssname sel i)))
                (setq cur (vlax-get obj 'Elevation))
                (setq new (+ cur delta))
                (vlax-put obj 'Elevation new)
                (setq cnt (1+ cnt))
                (setq i (1+ i)))
              (prompt (strcat "\nShifted " (itoa cnt) " point(s) by "
                              (rtos delta 2 4) "."))))))))
  (princ))
(princ)
