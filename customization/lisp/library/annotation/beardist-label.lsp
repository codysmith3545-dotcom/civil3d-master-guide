;;; ------------------------------------------------------------
;;; Routine : BEARDIST-LABEL
;;; Purpose : Label a picked LINE or LWPOLYLINE segment with
;;;           bearing + distance text drawn parallel to the line,
;;;           offset perpendicular by half a text height.
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
    ((and (>= az 0) (< az (/ pi 2.0)))  (setq ns "N" ew "E" d az))
    ((and (>= az (/ pi 2.0)) (< az pi)) (setq ns "S" ew "E" d (- pi az)))
    ((and (>= az pi) (< az (* 1.5 pi))) (setq ns "S" ew "W" d (- az pi)))
    (T                                  (setq ns "N" ew "W" d (- (* 2 pi) az))))
  (setq deg (fix (rad2deg d)))
  (setq rest (* (- (rad2deg d) deg) 60.0))
  (setq mn (fix rest))
  (setq sc (* (- rest mn) 60.0))
  (strcat ns (itoa deg) "-"
          (if (< mn 10) "0" "") (itoa mn) "-"
          (if (< sc 10) "0" "") (rtos sc 2 1) ew))

(defun c:BEARDIST-LABEL ( / pick ent edata p1 p2 mid ang dist
                           bearing ht rot lbl old-cmd old-osm)
  (setq old-cmd (getvar "CMDECHO")
        old-osm (getvar "OSMODE"))
  (setvar "CMDECHO" 0)
  (setvar "OSMODE" 0)
  (princ "\nPick line to label (LINE entity): ")
  (setq pick (entsel))
  (if pick
    (progn
      (setq ent  (car pick))
      (setq edata (entget ent))
      (cond
        ((= "LINE" (cdr (assoc 0 edata)))
          (setq p1 (cdr (assoc 10 edata))
                p2 (cdr (assoc 11 edata))))
        (T
          (setq p1 nil p2 nil)
          (prompt "\nPick a LINE entity. For polyline segments, explode first or use a future PLBEARDIST helper.")))
      (if (and p1 p2)
        (progn
          (setq dist (distance p1 p2))
          (setq ang  (angle p1 p2))
          (setq bearing (ang-to-bearing ang))
          (setq mid  (polar p1 ang (/ dist 2.0)))
          (setq ht   (getvar "DIMTXT"))
          ;; Offset perpendicular to line
          (setq mid  (polar mid (+ ang (/ pi 2.0)) (* ht 0.6)))
          ;; Keep label readable: flip 180 if angle is in left half-plane
          (setq rot  (rad2deg ang))
          (if (or (> rot 90) (< rot -90)) (setq rot (- rot 180)))
          (setq lbl (strcat bearing "  " (rtos dist 2 2) "'"))
          (command "_.TEXT" "_J" "_MC" mid ht rot lbl)
          (princ (strcat "\n" lbl))
        )
      )
    )
    (prompt "\nNothing selected.")
  )
  (setvar "OSMODE" old-osm)
  (setvar "CMDECHO" old-cmd)
  (princ)
)

(princ "\nBEARDIST-LABEL loaded. Type BEARDIST-LABEL to label a line with bearing/distance.")
(princ)
