;;; ------------------------------------------------------------
;;; Routine : PARCELLABEL
;;; Purpose : Build a full parcel-label block at the centroid of
;;;           a closed LWPOLYLINE: lot number (prompted), area
;;;           in sq ft and acres, plus a bearing/distance label
;;;           drawn alongside each perimeter segment.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun rad2deg (r) (* r (/ 180.0 pi)))

;; Convert AutoLISP angle (radians, 0=east, CCW) to north-CW
;; azimuth string formatted as bearing (Nxx-xx-xxE).
(defun ang-to-bearing (a / az ns ew d deg mn sc rest str)
  (setq az (- (/ pi 2.0) a))                       ; rotate so 0=north, CW
  (while (< az 0) (setq az (+ az (* 2 pi))))
  (while (>= az (* 2 pi)) (setq az (- az (* 2 pi))))
  (cond
    ((and (>= az 0)            (< az (/ pi 2.0)))     (setq ns "N" ew "E" d az))
    ((and (>= az (/ pi 2.0))   (< az pi))             (setq ns "S" ew "E" d (- pi az)))
    ((and (>= az pi)           (< az (* 1.5 pi)))     (setq ns "S" ew "W" d (- az pi)))
    (T                                                (setq ns "N" ew "W" d (- (* 2 pi) az)))
  )
  (setq deg (fix (rad2deg d)))
  (setq rest (* (- (rad2deg d) deg) 60.0))
  (setq mn (fix rest))
  (setq sc (* (- rest mn) 60.0))
  (setq str (strcat ns
                    (itoa deg) "-"
                    (if (< mn 10) "0" "") (itoa mn) "-"
                    (if (< sc 10) "0" "") (rtos sc 2 1)
                    ew))
  str
)

(defun c:PARCELLABEL ( / ent edata vobj area-sqft area-acre bb-min bb-max
                        cen lay lot txt n i p1 p2 dist bearing midpt ang ht
                        verts pair old-cmd old-osm)
  (setq old-cmd (getvar "CMDECHO")
        old-osm (getvar "OSMODE"))
  (setvar "CMDECHO" 0)
  (setvar "OSMODE" 0)
  (vl-load-com)
  (princ "\nSelect closed lot polyline: ")
  (setq ent (car (entsel)))
  (if (and ent
           (setq edata (entget ent))
           (member (cdr (assoc 0 edata)) '("LWPOLYLINE")))
    (progn
      (setq lot (getstring T "\nLot number/label: "))
      (setq vobj (vlax-ename->vla-object ent))
      (setq area-sqft (vla-get-Area vobj))
      (setq area-acre (/ area-sqft 43560.0))
      (vla-GetBoundingBox vobj 'bb-min 'bb-max)
      (setq bb-min (vlax-safearray->list bb-min)
            bb-max (vlax-safearray->list bb-max))
      (setq cen (list (/ (+ (car bb-min) (car bb-max)) 2.0)
                      (/ (+ (cadr bb-min) (cadr bb-max)) 2.0)
                      0.0))
      (setq lay (cdr (assoc 8 edata)))
      (setq ht  (getvar "DIMTXT"))
      ;; Centroid block
      (setq txt (strcat "LOT " lot "\\P"
                        (rtos area-sqft 2 0) " sq ft\\P"
                        (rtos area-acre 2 3) " ac"))
      (command "_.-MTEXT" cen "_H" ht "_J" "_MC" "_W" 0.0 txt "")
      ;; Perimeter bearing/distance labels
      ;; Build vertex list from DXF group 10 entries.
      (setq i 0
            n (length edata))
      (setq verts nil)
      (foreach pair edata
        (if (= 10 (car pair))
          (setq verts (cons (cdr pair) verts))))
      (setq verts (reverse verts))
      (setq n (length verts))
      (setq i 0)
      (while (< i n)
        (setq p1 (nth i verts))
        (setq p2 (nth (rem (1+ i) n) verts))
        (setq dist (distance p1 p2))
        (setq ang  (angle p1 p2))
        (setq bearing (ang-to-bearing ang))
        (setq midpt (polar p1 ang (/ dist 2.0)))
        ;; Offset label perpendicular to the segment by half a text height.
        (setq midpt (polar midpt (+ ang (/ pi 2.0)) (* ht 0.6)))
        (setq txt (strcat bearing " " (rtos dist 2 2) "'"))
        (command "_.TEXT" "_J" "_MC" midpt ht (rad2deg ang) txt)
        (setq i (1+ i))
      )
      (princ (strcat "\nLabelled lot " lot " on layer " lay))
    )
    (prompt "\nSelect a closed LWPOLYLINE.")
  )
  (setvar "OSMODE" old-osm)
  (setvar "CMDECHO" old-cmd)
  (princ)
)

(princ "\nPARCELLABEL loaded. Type PARCELLABEL to label a lot with number, area, bearings, distances.")
(princ)
