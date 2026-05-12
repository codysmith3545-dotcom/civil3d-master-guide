;;; ------------------------------------------------------------
;;; Routine : MIDPT-STAKE
;;; Purpose : Compute midpoint of two picked points (or the midpoint
;;;           of an entire polyline by its length). Reports coords
;;;           and optionally places a POINT entity.
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------

(defun c:MIDPT-STAKE ( / mode p1 p2 mid ent edata verts i pa pb d seglen
                          cum half placed ans)
  (prompt "\nMode: [P]oints or [L]ine/polyline midpoint <P>: ")
  (setq mode (getstring))
  (if (or (null mode) (= mode "")) (setq mode "P"))
  (setq mode (strcase mode))
  (cond
    ((= mode "P")
      (setq p1 (getpoint "\nFirst point: "))
      (cond
        ((null p1) (princ))
        (T
          (setq p2 (getpoint p1 "\nSecond point: "))
          (cond
            ((null p2) (princ))
            (T
              (setq mid (list (/ (+ (car p1) (car p2)) 2.0)
                              (/ (+ (cadr p1) (cadr p2)) 2.0)))
              (prompt (strcat "\nMidpoint: " (rtos (car mid) 2 4)
                              ", " (rtos (cadr mid) 2 4)))
              (setq placed mid))))))
    ((= mode "L")
      (setq ent (car (entsel "\nSelect line or polyline: ")))
      (cond
        ((null ent) (princ))
        (T
          (setq edata (entget ent))
          (cond
            ((= (cdr (assoc 0 edata)) "LINE")
              (setq p1 (cdr (assoc 10 edata)))
              (setq p2 (cdr (assoc 11 edata)))
              (setq mid (list (/ (+ (car p1) (car p2)) 2.0)
                              (/ (+ (cadr p1) (cadr p2)) 2.0)))
              (prompt (strcat "\nMidpoint: " (rtos (car mid) 2 4)
                              ", " (rtos (cadr mid) 2 4)))
              (setq placed mid))
            ((= (cdr (assoc 0 edata)) "LWPOLYLINE")
              (setq verts '())
              (foreach pair edata
                (if (= (car pair) 10) (setq verts (cons (cdr pair) verts))))
              (setq verts (reverse verts))
              ;; compute total length, then walk to the half-length mark
              (setq cum 0.0 i 0)
              (while (< i (1- (length verts)))
                (setq cum (+ cum (distance (nth i verts) (nth (1+ i) verts))))
                (setq i (1+ i)))
              (setq half (/ cum 2.0))
              (setq cum 0.0 i 0)
              (while (and (< i (1- (length verts))) (null placed))
                (setq pa (nth i verts) pb (nth (1+ i) verts))
                (setq seglen (distance pa pb))
                (cond
                  ((>= (+ cum seglen) half)
                    (setq d (- half cum))
                    (setq placed (polar pa (angle pa pb) d)))
                  (T (setq cum (+ cum seglen))))
                (setq i (1+ i)))
              (cond
                (placed
                  (prompt (strcat "\nMidpoint by length: "
                                  (rtos (car placed) 2 4)
                                  ", " (rtos (cadr placed) 2 4))))))
            (T (alert "Pick a LINE or LWPOLYLINE."))))))
    (T (prompt "\nUnknown mode.")))
  (cond
    (placed
      (prompt "\nDrop POINT entity at midpoint? [Y/N] <N>: ")
      (setq ans (getstring))
      (cond
        ((and ans (or (= (strcase ans) "Y") (= (strcase ans) "YES")))
          (command "_.POINT" placed)
          (prompt "\nPlaced POINT.")))))
  (princ))
(princ)
