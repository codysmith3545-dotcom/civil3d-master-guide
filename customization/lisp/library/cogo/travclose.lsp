;;; ------------------------------------------------------------
;;; Routine : TRAVCLOSE
;;; Purpose : Compute closure on the selected polyline. Reports
;;;           latitude error, departure error, linear misclosure,
;;;           perimeter, and precision (1:N ratio).
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------
;;; Convention:
;;;   latitude  = sum of (dy) along each segment = N component
;;;   departure = sum of (dx) along each segment = E component
;;;   linear closure = sqrt(lat^2 + dep^2)
;;;   precision = perimeter / linear closure   (reported as 1:N)
;;; Treats arc segments by chord.

(defun c:TRAVCLOSE ( / ent edata verts i p1 p2 lat dep d perim closure prec)
  (setq ent (car (entsel "\nSelect polyline traverse: ")))
  (cond
    ((null ent) (princ))
    (T
      (setq edata (entget ent))
      (cond
        ((/= (cdr (assoc 0 edata)) "LWPOLYLINE")
          (alert "Pick an LWPOLYLINE."))
        (T
          (setq verts '())
          (foreach pair edata
            (if (= (car pair) 10)
              (setq verts (cons (cdr pair) verts))))
          (setq verts (reverse verts))
          (cond
            ((< (length verts) 2) (alert "Polyline has fewer than two vertices."))
            (T
              (setq lat 0.0 dep 0.0 perim 0.0)
              (setq i 0)
              (while (< i (1- (length verts)))
                (setq p1 (nth i verts))
                (setq p2 (nth (1+ i) verts))
                (setq d (distance p1 p2))
                (setq perim (+ perim d))
                (setq dep (+ dep (- (car p2) (car p1))))
                (setq lat (+ lat (- (cadr p2) (cadr p1))))
                (setq i (1+ i)))
              ;; Add closing leg back to start, like a closed traverse
              (setq p1 (nth (1- (length verts)) verts))
              (setq p2 (nth 0 verts))
              (setq d (distance p1 p2))
              (prompt "\n--- Open polyline closure (last vertex to first vertex) ---")
              (prompt (strcat "\n  Departure error: " (rtos dep 2 4)))
              (prompt (strcat "\n  Latitude error : " (rtos lat 2 4)))
              (setq closure (sqrt (+ (* dep dep) (* lat lat))))
              (prompt (strcat "\n  Linear closure : " (rtos closure 2 4)))
              (prompt (strcat "\n  Perimeter      : " (rtos perim 2 4)))
              (cond
                ((> closure 0)
                  (setq prec (/ perim closure))
                  (prompt (strcat "\n  Precision      : 1:"
                                  (rtos prec 2 0))))
                (T
                  (prompt "\n  Precision      : EXACT (zero misclosure)")))
              (prompt (strcat "\n  Gap to start   : " (rtos d 2 4))))))))
    )
  (princ))
(princ)
