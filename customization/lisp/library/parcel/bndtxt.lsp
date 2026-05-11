;;; ------------------------------------------------------------
;;; Routine : BNDTXT
;;; Purpose : Write a plain-text metes-and-bounds description of
;;;           a selected LWPOLYLINE to a user-named .txt file.
;;;           One line per segment: bearing, distance.
;;;           Curve segments (bulge != 0) emit a CURVE line.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun rad2deg (r) (* r (/ 180.0 pi)))

(defun ang-to-bearing (a / az ns ew d deg mn sc rest)
  (setq az (- (/ pi 2.0) a))
  (while (< az 0) (setq az (+ az (* 2 pi))))
  (while (>= az (* 2 pi)) (setq az (- az (* 2 pi))))
  (cond
    ((and (>= az 0) (< az (/ pi 2.0)))           (setq ns "N" ew "E" d az))
    ((and (>= az (/ pi 2.0)) (< az pi))          (setq ns "S" ew "E" d (- pi az)))
    ((and (>= az pi) (< az (* 1.5 pi)))          (setq ns "S" ew "W" d (- az pi)))
    (T                                           (setq ns "N" ew "W" d (- (* 2 pi) az))))
  (setq deg (fix (rad2deg d)))
  (setq rest (* (- (rad2deg d) deg) 60.0))
  (setq mn (fix rest))
  (setq sc (* (- rest mn) 60.0))
  (strcat ns (itoa deg) "-"
          (if (< mn 10) "0" "") (itoa mn) "-"
          (if (< sc 10) "0" "") (rtos sc 2 1) ew))

(defun c:BNDTXT ( / ent edata verts bulges n i p1 p2 b path fp
                   line dist bearing)
  (princ "\nSelect closed LWPOLYLINE to describe: ")
  (setq ent (car (entsel)))
  (cond
    ((null ent) (prompt "\nNothing selected."))
    ((not (= "LWPOLYLINE" (cdr (assoc 0 (setq edata (entget ent))))))
      (prompt "\nMust be an LWPOLYLINE."))
    (T
      (setq path (getstring T "\nOutput file path (e.g. C:/temp/lot.txt): "))
      (if (or (null path) (= path ""))
        (prompt "\nNo output path supplied.")
        (progn
          (setq verts nil bulges nil)
          (foreach pair edata
            (cond
              ((= 10 (car pair)) (setq verts  (cons (cdr pair) verts)))
              ((= 42 (car pair)) (setq bulges (cons (cdr pair) bulges)))))
          (setq verts (reverse verts) bulges (reverse bulges))
          (setq n (length verts))
          (setq fp (open path "w"))
          (if (null fp)
            (prompt (strcat "\nCould not open " path " for writing."))
            (progn
              (write-line "Metes and bounds description" fp)
              (write-line (strcat "Generated from drawing " (getvar "DWGNAME")) fp)
              (write-line "" fp)
              (write-line (strcat "POINT OF BEGINNING: "
                                  (rtos (car  (car verts)) 2 3) ", "
                                  (rtos (cadr (car verts)) 2 3)) fp)
              (setq i 0)
              (while (< i n)
                (setq p1 (nth i verts))
                (setq p2 (nth (rem (1+ i) n) verts))
                (setq b  (nth i bulges))
                (setq dist (distance p1 p2))
                (setq bearing (ang-to-bearing (angle p1 p2)))
                (if (and b (not (equal b 0.0 1e-12)))
                  (setq line
                    (strcat "  Course " (itoa (1+ i)) ": CURVE chord "
                            bearing " " (rtos dist 2 2) "' (bulge "
                            (rtos b 2 4) ") - verify radius/arc data"))
                  (setq line
                    (strcat "  Course " (itoa (1+ i)) ": "
                            bearing " " (rtos dist 2 2) "'")))
                (write-line line fp)
                (setq i (1+ i)))
              (write-line "" fp)
              (write-line "TO THE POINT OF BEGINNING." fp)
              (close fp)
              (princ (strcat "\nWrote " (itoa n) " courses to " path))
            )
          )
        )
      )
    )
  )
  (princ)
)

(princ "\nBNDTXT loaded. Type BNDTXT to write a metes-and-bounds text file from a polyline.")
(princ)
