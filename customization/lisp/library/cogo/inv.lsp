;;; ------------------------------------------------------------
;;; Routine : INV
;;; Purpose : Inverse between two picked points. Reports bearing
;;;           (quadrant N/S DD-MM-SS E/W), distance, and azimuth
;;;           (north-clockwise degrees).
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------
;;; Convention notes:
;;;   AutoLISP (angle p1 p2) returns radians, 0 = east, CCW positive.
;;;   To get a north-clockwise azimuth in radians:
;;;     az = (pi/2) - a    [then normalize to [0, 2*pi)]
;;;   To get a surveyor bearing, look at the quadrant from the
;;;   azimuth and report angle off N or S.

(defun rad->deg (r) (* r (/ 180.0 pi)))

(defun ang-to-az-deg (a / az)
  ;; a is AutoLISP angle in radians (0=E, CCW). Returns azimuth deg [0,360).
  (setq az (- (/ pi 2.0) a))
  (while (< az 0) (setq az (+ az (* 2.0 pi))))
  (while (>= az (* 2.0 pi)) (setq az (- az (* 2.0 pi))))
  (rad->deg az))

(defun deg->dms-str (deg / d m s sec sgn)
  (setq sgn (if (< deg 0) "-" ""))
  (setq deg (abs deg))
  (setq d (fix deg))
  (setq m (fix (* 60.0 (- deg d))))
  (setq s (* 3600.0 (- deg (+ d (/ m 60.0)))))
  (strcat sgn (itoa d) "-" (itoa m) "-" (rtos s 2 2)))

(defun az-to-bearing (az / quad ang nsval ewval)
  ;; az in degrees [0,360). Returns surveyor bearing string.
  (cond
    ((or (< az 90))      (setq nsval "N" ewval "E" ang az))
    ((< az 180)          (setq nsval "S" ewval "E" ang (- 180.0 az)))
    ((< az 270)          (setq nsval "S" ewval "W" ang (- az 180.0)))
    (T                   (setq nsval "N" ewval "W" ang (- 360.0 az))))
  (strcat nsval " " (deg->dms-str ang) " " ewval))

(defun c:INV ( / p1 p2 d a az bearing)
  (setq p1 (getpoint "\nFrom point: "))
  (cond
    ((null p1) (princ))
    (T
      (setq p2 (getpoint p1 "\nTo point: "))
      (cond
        ((null p2) (princ))
        (T
          (setq d (distance p1 p2))
          (setq a (angle p1 p2))
          (setq az (ang-to-az-deg a))
          (setq bearing (az-to-bearing az))
          (prompt (strcat "\n  Bearing : " bearing))
          (prompt (strcat "\n  Distance: " (rtos d 2 4)))
          (prompt (strcat "\n  Azimuth : " (deg->dms-str az) " ("
                          (rtos az 2 4) " deg)"))))))
  (princ))
(princ)
