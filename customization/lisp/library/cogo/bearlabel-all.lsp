;;; ------------------------------------------------------------
;;; Routine : BEARLABEL-ALL
;;; Purpose : Label every straight segment of the selected polyline
;;;           with bearing + distance. Skips arcs (use CURVELABEL-ALL
;;;           for those). Labels at midpoint, rotated, kept upright.
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------

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
  (strcat nsval (deg->dms-str ang) ewval))

(defun c:BEARLABEL-ALL ( / ent edata verts bulges i p1 p2 d a az brg mid tht
                          cnt oce txh)
  (setq oce (getvar "CMDECHO"))
  (setvar "CMDECHO" 0)
  (setq ent (car (entsel "\nSelect polyline to label every straight segment: ")))
  (setq txh (getreal "\nText height <2.0>: "))
  (if (or (null txh) (<= txh 0)) (setq txh 2.0))
  (cond
    ((null ent) (princ))
    (T
      (setq edata (entget ent))
      (cond
        ((/= (cdr (assoc 0 edata)) "LWPOLYLINE")
          (alert "Pick an LWPOLYLINE."))
        (T
          ;; collect vertices AND bulges (DXF 42 attaches to preceding 10)
          (setq verts '() bulges '())
          (foreach pair edata
            (cond
              ((= (car pair) 10) (setq verts  (cons (cdr pair) verts)))
              ((= (car pair) 42) (setq bulges (cons (cdr pair) bulges)))))
          (setq verts (reverse verts))
          (setq bulges (reverse bulges))
          (setq i 0 cnt 0)
          (while (< i (1- (length verts)))
            (cond
              ((or (= 0 (length bulges))
                   (= 0.0 (nth i bulges)))
                (setq p1 (nth i verts))
                (setq p2 (nth (1+ i) verts))
                (setq d (distance p1 p2))
                (setq a (angle p1 p2))
                (setq az (ang-to-az-deg a))
                (setq brg (az-to-bearing az))
                (setq mid (list (/ (+ (car p1) (car p2)) 2.0)
                                (/ (+ (cadr p1) (cadr p2)) 2.0)))
                (setq tht (rad->deg a))
                (if (or (> tht 90) (< tht -90)) (setq tht (- tht 180)))
                (command "_.TEXT" "_J" "_MC" mid txh tht
                         (strcat brg "  " (rtos d 2 2)))
                (setq cnt (1+ cnt))))
            (setq i (1+ i)))
          (prompt (strcat "\nLabeled " (itoa cnt) " straight segment(s).")))))
    )
  (setvar "CMDECHO" oce)
  (princ))
(princ)
