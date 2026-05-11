;;; ------------------------------------------------------------
;;; Routine : CURVELABEL-ALL
;;; Purpose : Label every arc segment in a selected polyline with
;;;           R, L, Delta. Skips straight segments (use BEARLABEL-ALL
;;;           for those).
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------
;;; Note on polyline bulges:
;;;   bulge = tan(delta / 4)
;;;   so delta = 4 * atan(bulge), with sign giving direction.
;;;   radius = chord / (2 * sin(delta/2))

(defun rad->deg (r) (* r (/ 180.0 pi)))

(defun deg->dms-str (deg / d m s)
  (setq deg (abs deg))
  (setq d (fix deg))
  (setq m (fix (* 60.0 (- deg d))))
  (setq s (* 3600.0 (- deg (+ d (/ m 60.0)))))
  (strcat (itoa d) "-" (itoa m) "-" (rtos s 2 2)))

(defun arc-from-bulge (p1 p2 b / chord delta radius arclen midchord
                                 perpang sign sag center-ang midpt)
  (setq chord (distance p1 p2))
  (setq delta (* 4.0 (atan b)))     ; signed
  (cond
    ((= delta 0) nil)
    (T
      (setq radius (abs (/ chord (* 2.0 (sin (/ delta 2.0))))))
      (setq arclen (abs (* radius delta)))
      ;; midpoint of arc lies perpendicular to chord midpoint, on the
      ;; "convex" side. Sagitta = R - R*cos(delta/2) = R*(1 - cos(delta/2))
      (setq sag (* radius (- 1.0 (cos (/ (abs delta) 2.0)))))
      (setq sign (if (> b 0) 1.0 -1.0))
      (setq midchord (list (/ (+ (car p1) (car p2)) 2.0)
                           (/ (+ (cadr p1) (cadr p2)) 2.0)))
      (setq perpang (+ (angle p1 p2) (* sign (/ pi 2.0))))
      (setq midpt (polar midchord perpang sag))
      (list (abs radius) arclen (abs delta) midpt))))

(defun c:CURVELABEL-ALL ( / ent edata verts bulges i p1 p2 b arc r l dlt midpt
                            cnt txh)
  (setq ent (car (entsel "\nSelect polyline: ")))
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
          (setq verts '() bulges '())
          (foreach pair edata
            (cond
              ((= (car pair) 10) (setq verts  (cons (cdr pair) verts)))
              ((= (car pair) 42) (setq bulges (cons (cdr pair) bulges)))))
          (setq verts (reverse verts))
          (setq bulges (reverse bulges))
          (cond
            ((= 0 (length bulges))
              (prompt "\nPolyline has no bulge data; no arcs to label."))
            (T
              (setq i 0 cnt 0)
              (while (< i (1- (length verts)))
                (setq b (nth i bulges))
                (cond
                  ((and b (/= b 0.0))
                    (setq p1 (nth i verts))
                    (setq p2 (nth (1+ i) verts))
                    (setq arc (arc-from-bulge p1 p2 b))
                    (cond
                      (arc
                        (setq r     (nth 0 arc))
                        (setq l     (nth 1 arc))
                        (setq dlt   (nth 2 arc))
                        (setq midpt (nth 3 arc))
                        (command "_.MTEXT" midpt "_H" txh "_W" 0
                                 (strcat "R=" (rtos r 2 2)
                                         "  L=" (rtos l 2 2)
                                         "  \\Delta=" (deg->dms-str (rad->deg dlt)))
                                 "")
                        (setq cnt (1+ cnt))))))
                (setq i (1+ i)))
              (prompt (strcat "\nLabeled " (itoa cnt) " arc segment(s).")))))))
    )
  (princ))
(princ)
