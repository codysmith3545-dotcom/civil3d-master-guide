;;; ------------------------------------------------------------
;;; Routine : BEARLABEL
;;; Purpose : Label one selected line or polyline segment with its
;;;           bearing and distance as an MTEXT block placed at the
;;;           segment midpoint, rotated to the segment direction.
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

(defun seg-endpoints (ent pickpt / edata typ p1 p2 verts i d closest cd
                                    candidate-a candidate-b)
  ;; returns a list (p1 p2) for the segment under pickpt
  (setq edata (entget ent))
  (setq typ (cdr (assoc 0 edata)))
  (cond
    ((= typ "LINE")
      (list (cdr (assoc 10 edata)) (cdr (assoc 11 edata))))
    ((= typ "LWPOLYLINE")
      (setq verts '())
      (foreach pair edata
        (if (= (car pair) 10) (setq verts (cons (cdr pair) verts))))
      (setq verts (reverse verts))
      ;; Find segment whose midpoint is closest to pickpt
      (setq closest nil cd 1.0e99 i 0)
      (while (< i (1- (length verts)))
        (setq candidate-a (nth i verts))
        (setq candidate-b (nth (1+ i) verts))
        (setq d (distance pickpt
                          (list (/ (+ (car candidate-a) (car candidate-b)) 2.0)
                                (/ (+ (cadr candidate-a) (cadr candidate-b)) 2.0))))
        (cond
          ((< d cd)
            (setq cd d)
            (setq closest (list candidate-a candidate-b))))
        (setq i (1+ i)))
      closest)
    (T nil)))

(defun c:BEARLABEL ( / picked ent pt segpts p1 p2 d a az brg mid tht oce)
  (setq oce (getvar "CMDECHO"))
  (setvar "CMDECHO" 0)
  (setq picked (entsel "\nPick a line or a polyline segment: "))
  (cond
    ((null picked) (princ))
    (T
      (setq ent (car picked))
      (setq pt  (cadr picked))
      (setq segpts (seg-endpoints ent pt))
      (cond
        ((null segpts) (alert "Unsupported entity. Pick a LINE or LWPOLYLINE."))
        (T
          (setq p1 (car segpts) p2 (cadr segpts))
          (setq d (distance p1 p2))
          (setq a (angle p1 p2))
          (setq az (ang-to-az-deg a))
          (setq brg (az-to-bearing az))
          (setq mid (list (/ (+ (car p1) (car p2)) 2.0)
                          (/ (+ (cadr p1) (cadr p2)) 2.0)))
          ;; Keep text upright: if angle is in 90-270, add 180
          (setq tht (rad->deg a))
          (if (or (> tht 90) (< tht -90)) (setq tht (- tht 180)))
          (command "_.TEXT" "_J" "_MC" mid 2.0 tht
                   (strcat brg "  " (rtos d 2 2)))))))
  (setvar "CMDECHO" oce)
  (princ))
(princ)
