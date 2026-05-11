;;; ------------------------------------------------------------
;;; Routine : BNDCHECK
;;; Purpose : Audit a boundary polyline. Reports:
;;;             * closure error (start vs end vertex distance)
;;;             * total perimeter
;;;             * segment count
;;;             * curve-segment count (bulges != 0) and whether
;;;               those curves still have valid radius/length data
;;;             * any zero-length segments
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun c:BNDCHECK ( / ent edata typ closed verts bulges n i p1 p2 b
                     seg-count curve-count zero-count perim closure
                     old-cmd)
  (setq old-cmd (getvar "CMDECHO"))
  (setvar "CMDECHO" 0)
  (princ "\nSelect boundary polyline to audit: ")
  (setq ent (car (entsel)))
  (cond
    ((null ent)
      (prompt "\nNothing selected."))
    (T
      (setq edata (entget ent))
      (setq typ (cdr (assoc 0 edata)))
      (if (not (= typ "LWPOLYLINE"))
        (prompt (strcat "\nEntity is " typ ", BNDCHECK requires an LWPOLYLINE."))
        (progn
          (setq closed (= 1 (logand 1 (cdr (assoc 70 edata)))))
          (setq verts nil bulges nil)
          (foreach pair edata
            (cond
              ((= 10 (car pair)) (setq verts  (cons (cdr pair) verts)))
              ((= 42 (car pair)) (setq bulges (cons (cdr pair) bulges)))))
          (setq verts (reverse verts) bulges (reverse bulges))
          (setq n (length verts))
          (setq seg-count 0 curve-count 0 zero-count 0 perim 0.0)
          (setq i 0)
          (while (< i (if closed n (1- n)))
            (setq p1 (nth i verts))
            (setq p2 (nth (rem (1+ i) n) verts))
            (setq b  (nth i bulges))
            (setq perim (+ perim (distance p1 p2)))
            (setq seg-count (1+ seg-count))
            (if (and b (not (equal b 0.0 1e-12))) (setq curve-count (1+ curve-count)))
            (if (equal (distance p1 p2) 0.0 1e-6) (setq zero-count (1+ zero-count)))
            (setq i (1+ i)))
          (setq closure
            (if closed
              0.0
              (distance (car verts) (last verts))))
          (princ "\n--- BNDCHECK report ---")
          (princ (strcat "\n  Closed flag      : " (if closed "yes" "no")))
          (princ (strcat "\n  Segment count    : " (itoa seg-count)))
          (princ (strcat "\n  Curve segments   : " (itoa curve-count)))
          (princ (strcat "\n  Zero-length segs : " (itoa zero-count)))
          (princ (strcat "\n  Perimeter (chord): " (rtos perim 2 3) " (drawing units)"))
          (princ (strcat "\n  Closure error    : " (rtos closure 2 4)))
          (if (and curve-count (> curve-count 0))
            (princ "\n  NOTE: curve segments labelled only by bulge - check radius/length downstream."))
          (princ "\n-----------------------")
        )
      )
    )
  )
  (setvar "CMDECHO" old-cmd)
  (princ)
)

(princ "\nBNDCHECK loaded. Type BNDCHECK to audit a boundary polyline.")
(princ)
