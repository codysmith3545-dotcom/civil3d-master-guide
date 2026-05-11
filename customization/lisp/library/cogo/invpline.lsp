;;; ------------------------------------------------------------
;;; Routine : INVPLINE
;;; Purpose : Inverse along a polyline vertex by vertex. For each
;;;           segment, dump segment number, bearing, distance, and
;;;           cumulative distance. Output to a text file.
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------
;;; Notes   : Works on LWPOLYLINE (DXF 0 = LWPOLYLINE). Treats arc
;;;           segments by their chord (no curve handling here -
;;;           see CURVELABEL-ALL for arc-aware reporting).

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

(defun c:INVPLINE ( / ent edata verts fpath fh i p1 p2 d a az
                      cum cnt header)
  (setq ent (car (entsel "\nSelect polyline: ")))
  (cond
    ((null ent) (princ))
    (T
      (setq edata (entget ent))
      (cond
        ((/= (cdr (assoc 0 edata)) "LWPOLYLINE")
          (alert "Pick an LWPOLYLINE (2D polyline)."))
        (T
          ;; collect DXF 10 vertex points
          (setq verts '())
          (foreach pair edata
            (if (= (car pair) 10)
              (setq verts (cons (cdr pair) verts))))
          (setq verts (reverse verts))
          (setq fpath (getstring T "\nOutput TXT path: "))
          (cond
            ((or (null fpath) (= fpath ""))
              (prompt "\nNo path. Cancelled."))
            (T
              (setq fh (open fpath "w"))
              (cond
                ((null fh) (alert (strcat "Cannot open " fpath)))
                (T
                  (setq header "Seg,From X,From Y,To X,To Y,Bearing,Distance,Cumulative")
                  (write-line header fh)
                  (setq i 0 cum 0.0 cnt 0)
                  (while (< i (1- (length verts)))
                    (setq p1 (nth i verts))
                    (setq p2 (nth (1+ i) verts))
                    (setq d (distance p1 p2))
                    (setq a (angle p1 p2))
                    (setq az (ang-to-az-deg a))
                    (setq cum (+ cum d))
                    (write-line
                      (strcat
                        (itoa (1+ i)) ","
                        (rtos (car p1) 2 4) "," (rtos (cadr p1) 2 4) ","
                        (rtos (car p2) 2 4) "," (rtos (cadr p2) 2 4) ","
                        "\"" (az-to-bearing az) "\","
                        (rtos d 2 4) ","
                        (rtos cum 2 4))
                      fh)
                    (setq cnt (1+ cnt))
                    (setq i (1+ i)))
                  (close fh)
                  (prompt (strcat "\nWrote " (itoa cnt)
                                  " segment(s) to " fpath
                                  ". Total = " (rtos cum 2 4)))))))))))
  (princ))
(princ)
