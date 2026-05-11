;;; ------------------------------------------------------------
;;; Routine : BND-TRAV
;;; Purpose : Write a boundary traverse table from a closed polyline.
;;;           Output rows: Course, From, To, Bearing, Distance.
;;;           Vertices are labeled alphabetically (A, B, C, ...).
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------
;;; Notes   : This is the legal-description side of INVPLINE.
;;;           Output is a single CSV that you paste into a Word doc.
;;;           Beyond Z=Z course, only 26 vertices handled cleanly
;;;           (A-Z). For longer boundaries, edit the label scheme.

(defun rad->deg (r) (* r (/ 180.0 pi)))

(defun ang-to-az-deg (a / az)
  (setq az (- (/ pi 2.0) a))
  (while (< az 0) (setq az (+ az (* 2.0 pi))))
  (while (>= az (* 2.0 pi)) (setq az (- az (* 2.0 pi))))
  (rad->deg az))

(defun deg->dms-str (deg / d m s)
  (setq deg (abs deg))
  (setq d (fix deg))
  (setq m (fix (* 60.0 (- deg d))))
  (setq s (* 3600.0 (- deg (+ d (/ m 60.0)))))
  (strcat (itoa d) "-" (itoa m) "-" (rtos s 2 2)))

(defun az-to-bearing (az / ang nsval ewval)
  (cond
    ((< az 90)  (setq nsval "N" ewval "E" ang az))
    ((< az 180) (setq nsval "S" ewval "E" ang (- 180.0 az)))
    ((< az 270) (setq nsval "S" ewval "W" ang (- az 180.0)))
    (T          (setq nsval "N" ewval "W" ang (- 360.0 az))))
  (strcat nsval " " (deg->dms-str ang) " " ewval))

(defun letter-label (i)
  (if (and (>= i 0) (< i 26))
    (chr (+ 65 i))
    (strcat "V" (itoa i))))

(defun c:BND-TRAV ( / ent edata verts closed fpath fh i p1 p2 d a az brg
                      lblA lblB cnt)
  (setq ent (car (entsel "\nSelect closed boundary polyline: ")))
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
            (if (= (car pair) 10) (setq verts (cons (cdr pair) verts))))
          (setq verts (reverse verts))
          (setq closed (= 1 (logand 1 (cdr (assoc 70 edata)))))
          (setq fpath (getstring T "\nOutput CSV path: "))
          (cond
            ((or (null fpath) (= fpath ""))
              (prompt "\nNo path. Cancelled."))
            (T
              (setq fh (open fpath "w"))
              (cond
                ((null fh) (alert (strcat "Cannot open " fpath)))
                (T
                  (write-line "Course,From,To,Bearing,Distance" fh)
                  (setq i 0 cnt 0)
                  (while (< i (1- (length verts)))
                    (setq p1 (nth i verts))
                    (setq p2 (nth (1+ i) verts))
                    (setq d (distance p1 p2))
                    (setq a (angle p1 p2))
                    (setq az (ang-to-az-deg a))
                    (setq brg (az-to-bearing az))
                    (setq lblA (letter-label i))
                    (setq lblB (letter-label (1+ i)))
                    (write-line (strcat (itoa (1+ cnt)) ","
                                        lblA "," lblB ","
                                        "\"" brg "\","
                                        (rtos d 2 4)) fh)
                    (setq cnt (1+ cnt))
                    (setq i (1+ i)))
                  ;; If closed, write the closing course from last back to first
                  (cond
                    (closed
                      (setq p1 (nth (1- (length verts)) verts))
                      (setq p2 (nth 0 verts))
                      (setq d (distance p1 p2))
                      (cond
                        ((> d 1.0e-9)
                          (setq az (ang-to-az-deg (angle p1 p2)))
                          (setq brg (az-to-bearing az))
                          (setq lblA (letter-label (1- (length verts))))
                          (setq lblB (letter-label 0))
                          (write-line (strcat (itoa (1+ cnt)) ","
                                              lblA "," lblB ","
                                              "\"" brg "\","
                                              (rtos d 2 4)) fh)
                          (setq cnt (1+ cnt))))))
                  (close fh)
                  (prompt (strcat "\nWrote " (itoa cnt)
                                  " course(s) to " fpath
                                  (if closed " (polyline is closed)"
                                             " (polyline is OPEN - no closing course)"))))))))))
    )
  (princ))
(princ)
