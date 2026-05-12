;;; ------------------------------------------------------------
;;; Routine : LOTNUM-AUTO
;;; Purpose : Auto-number a set of selected closed lot polylines
;;;           in the order they are intersected by a user-picked
;;;           frontage line. Places centred MText "LOT n" at each
;;;           lot's bounding-box midpoint, starting from a user-
;;;           supplied integer.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun c:LOTNUM-AUTO ( / ss start p1 p2 lots sorted ent vobj bb-min bb-max
                       mid proj along ht n i lot lay old-cmd old-osm)
  (setq old-cmd (getvar "CMDECHO")
        old-osm (getvar "OSMODE"))
  (setvar "CMDECHO" 0)
  (vl-load-com)
  (princ "\nSelect closed lot polylines to number: ")
  (setq ss (ssget '((0 . "LWPOLYLINE") (-4 . "&") (70 . 1))))
  (if ss
    (progn
      (initget 1)
      (setq p1 (getpoint "\nPick start point of frontage line: "))
      (initget 1)
      (setq p2 (getpoint p1 "\nPick end point of frontage line: "))
      (setq start (getint "\nStarting lot number <1>: "))
      (if (or (null start) (< start 0)) (setq start 1))
      (setq ht (getvar "DIMTXT"))
      (setq lots nil)
      (setq i 0
            n (sslength ss))
      (while (< i n)
        (setq ent (ssname ss i))
        (setq vobj (vlax-ename->vla-object ent))
        (vla-GetBoundingBox vobj 'bb-min 'bb-max)
        (setq bb-min (vlax-safearray->list bb-min)
              bb-max (vlax-safearray->list bb-max))
        (setq mid (list (/ (+ (car bb-min) (car bb-max)) 2.0)
                        (/ (+ (cadr bb-min) (cadr bb-max)) 2.0)
                        0.0))
        ;; Project mid onto frontage p1-p2; store the along-distance as sort key.
        (setq along
          (+ (* (- (car mid) (car p1)) (- (car p2) (car p1)))
             (* (- (cadr mid) (cadr p1)) (- (cadr p2) (cadr p1)))))
        (setq lots (cons (list along ent mid) lots))
        (setq i (1+ i))
      )
      (setq sorted (vl-sort lots (function (lambda (a b) (< (car a) (car b))))))
      (setq i 0)
      (foreach rec sorted
        (setq lot (+ start i))
        (setq mid (caddr rec))
        (setq lay (cdr (assoc 8 (entget (cadr rec)))))
        (command "_.-MTEXT" mid "_H" ht "_J" "_MC" "_W" 0.0
                 (strcat "LOT " (itoa lot)) "")
        (princ (strcat "\n  Lot " (itoa lot) " on layer " lay))
        (setq i (1+ i))
      )
      (princ (strcat "\nNumbered " (itoa (length sorted)) " lots starting at " (itoa start) "."))
    )
    (prompt "\nNo closed LWPOLYLINEs selected.")
  )
  (setvar "OSMODE" old-osm)
  (setvar "CMDECHO" old-cmd)
  (princ)
)

(princ "\nLOTNUM-AUTO loaded. Type LOTNUM-AUTO to number lots along a frontage line.")
(princ)
