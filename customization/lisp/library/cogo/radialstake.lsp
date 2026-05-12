;;; ------------------------------------------------------------
;;; Routine : RADIALSTAKE
;;; Purpose : Radial stakeout report from a base setup point.
;;;           Pick a base, pick a backsight, then pick target points
;;;           one at a time. For each target, report:
;;;             - target ID (auto: T1, T2, ...)
;;;             - horizontal distance from base
;;;             - bearing from base (north-clockwise azimuth)
;;;             - angle right from backsight (turned clockwise)
;;;           Output to a TXT file.
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

(defun c:RADIALSTAKE ( / base back bsaz fpath fh tgt d a az ar tname cnt)
  (setq base (getpoint "\nBase setup point: "))
  (cond
    ((null base) (princ))
    (T
      (setq back (getpoint base "\nBacksight point: "))
      (cond
        ((null back) (princ))
        (T
          (setq bsaz (ang-to-az-deg (angle base back)))
          (setq fpath (getstring T "\nOutput TXT path: "))
          (cond
            ((or (null fpath) (= fpath ""))
              (prompt "\nNo path. Cancelled."))
            (T
              (setq fh (open fpath "w"))
              (cond
                ((null fh) (alert (strcat "Cannot open " fpath)))
                (T
                  (write-line "Target,Distance,Azimuth,AngleRightFromBacksight" fh)
                  (prompt (strcat "\nBacksight azimuth = " (deg->dms-str bsaz)))
                  (setq cnt 0)
                  (while
                    (setq tgt (getpoint base
                              (strcat "\nTarget point T" (itoa (1+ cnt))
                                      " [Enter to stop]: ")))
                    (setq d (distance base tgt))
                    (setq a (angle base tgt))
                    (setq az (ang-to-az-deg a))
                    (setq ar (- az bsaz))
                    (while (< ar 0) (setq ar (+ ar 360.0)))
                    (while (>= ar 360.0) (setq ar (- ar 360.0)))
                    (setq tname (strcat "T" (itoa (1+ cnt))))
                    (write-line
                      (strcat tname ","
                              (rtos d 2 4) ","
                              (deg->dms-str az) ","
                              (deg->dms-str ar))
                      fh)
                    (prompt (strcat "\n  " tname " D=" (rtos d 2 4)
                                    " AZ=" (deg->dms-str az)
                                    " AR=" (deg->dms-str ar)))
                    (setq cnt (1+ cnt)))
                  (close fh)
                  (prompt (strcat "\nWrote " (itoa cnt)
                                  " target(s) to " fpath "."))))))))))
  (princ))
(princ)
