;;; ------------------------------------------------------------
;;; Routine : TRAV
;;; Purpose : Interactive traverse entry. Prompt for a starting
;;;           point, then loop asking "bearing distance" pairs.
;;;           Builds an LWPOLYLINE as it goes. Type "C" to close
;;;           or Enter on bearing to stop.
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------
;;; Bearing input format:
;;;   "N 12-34-56 E"   or   "S 89-59-59 W"   (whitespace flexible)
;;;   Single quadrant char N/S, DD-MM-SS, single quadrant char E/W.
;;;   Case-insensitive.
;;;   Distance: positive real.

(defun deg->rad (d) (* d (/ pi 180.0)))

(defun az-to-anglisp (az-deg / az-rad)
  ;; convert north-clockwise azimuth (deg) to AutoLISP angle (E=0,CCW,rad)
  (setq az-rad (deg->rad az-deg))
  (- (/ pi 2.0) az-rad))

(defun parse-bearing (s / s2 ns ew dms parts d m sec az toks tok i ch)
  ;; Tokenize on whitespace
  (setq s2 (strcase s))
  (setq toks '() tok "" i 0)
  (while (< i (strlen s2))
    (setq ch (substr s2 (1+ i) 1))
    (cond
      ((or (= ch " ") (= ch "\t"))
        (if (> (strlen tok) 0)
          (progn (setq toks (cons tok toks)) (setq tok ""))))
      (T (setq tok (strcat tok ch))))
    (setq i (1+ i)))
  (if (> (strlen tok) 0) (setq toks (cons tok toks)))
  (setq toks (reverse toks))
  (cond
    ((/= (length toks) 3) nil)
    (T
      (setq ns (nth 0 toks))
      (setq dms (nth 1 toks))
      (setq ew (nth 2 toks))
      ;; parse DD-MM-SS
      (setq parts '() tok "" i 0)
      (while (< i (strlen dms))
        (setq ch (substr dms (1+ i) 1))
        (cond
          ((= ch "-")
            (setq parts (cons tok parts)) (setq tok ""))
          (T (setq tok (strcat tok ch))))
        (setq i (1+ i)))
      (setq parts (cons tok parts))
      (setq parts (reverse parts))
      (cond
        ((/= (length parts) 3) nil)
        (T
          (setq d (atof (nth 0 parts)))
          (setq m (atof (nth 1 parts)))
          (setq sec (atof (nth 2 parts)))
          (setq d (+ d (/ m 60.0) (/ sec 3600.0)))
          (cond
            ((and (= ns "N") (= ew "E")) (setq az d))
            ((and (= ns "S") (= ew "E")) (setq az (- 180.0 d)))
            ((and (= ns "S") (= ew "W")) (setq az (+ 180.0 d)))
            ((and (= ns "N") (= ew "W")) (setq az (- 360.0 d)))
            (T (setq az nil)))
          az)))))

(defun c:TRAV ( / p0 cur pts inp parts brg dist az ang p2 done)
  (setq p0 (getpoint "\nStart point: "))
  (cond
    ((null p0) (princ))
    (T
      (setq cur p0)
      (setq pts (list p0))
      (setq done nil)
      (while (not done)
        (setq inp (getstring T "\nBearing (e.g. N 12-34-56 E) [Enter=stop / C=close]: "))
        (cond
          ((or (null inp) (= inp ""))
            (setq done T))
          ((or (= (strcase inp) "C") (= (strcase inp) "CLOSE"))
            (setq pts (append pts (list p0)))
            (setq done T))
          (T
            (setq az (parse-bearing inp))
            (cond
              ((null az)
                (prompt "\nCould not parse bearing. Expected: N 12-34-56 E"))
              (T
                (setq dist (getreal "\nDistance: "))
                (cond
                  ((or (null dist) (<= dist 0))
                    (prompt "\nDistance must be positive."))
                  (T
                    (setq ang (az-to-anglisp az))
                    (setq p2 (polar cur ang dist))
                    (setq pts (append pts (list p2)))
                    (setq cur p2))))))))
      ;; draw polyline from accumulated pts
      (cond
        ((< (length pts) 2)
          (prompt "\nNo segments entered."))
        (T
          (command "_.PLINE")
          (foreach p pts (command p))
          (command "")
          (prompt (strcat "\nDrew traverse with " (itoa (1- (length pts)))
                          " segment(s)."))))))
  (princ))
(princ)
