;;; ------------------------------------------------------------
;;; Routine : PL-2D
;;; Purpose : Flatten one or many selected polylines to Z = 0.
;;;           Calls PL-ELEV-SET style logic on each selected
;;;           polyline. For LWPOLYLINE sets group 38; for heavy
;;;           POLYLINE rewrites every VERTEX Z. Lines, points, and
;;;           text are also flattened.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun flatten-ent (ent / edata typ sub pt)
  (setq edata (entget ent))
  (setq typ (cdr (assoc 0 edata)))
  (cond
    ((= typ "LWPOLYLINE")
      (setq edata
        (if (assoc 38 edata)
          (subst (cons 38 0.0) (assoc 38 edata) edata)
          (append edata (list (cons 38 0.0)))))
      (entmod edata))
    ((= typ "POLYLINE")
      (setq sub (entnext ent))
      (while (and sub (not (= "SEQEND" (cdr (assoc 0 (setq edata (entget sub)))))))
        (if (= "VERTEX" (cdr (assoc 0 edata)))
          (progn
            (setq pt (cdr (assoc 10 edata)))
            (setq pt (list (car pt) (cadr pt) 0.0))
            (entmod (subst (cons 10 pt) (assoc 10 edata) edata))))
        (setq sub (entnext sub)))
      (entupd ent))
    ((member typ '("LINE"))
      (setq edata (subst (cons 10 (list (car (cdr (assoc 10 edata)))
                                        (cadr (cdr (assoc 10 edata))) 0.0))
                         (assoc 10 edata) edata))
      (setq edata (subst (cons 11 (list (car (cdr (assoc 11 edata)))
                                        (cadr (cdr (assoc 11 edata))) 0.0))
                         (assoc 11 edata) edata))
      (entmod edata))
    ((member typ '("POINT" "TEXT" "MTEXT" "INSERT" "CIRCLE" "ARC"))
      (setq pt (cdr (assoc 10 edata)))
      (setq pt (list (car pt) (cadr pt) 0.0))
      (entmod (subst (cons 10 pt) (assoc 10 edata) edata)))))

(defun c:PL-2D ( / ss i n)
  (princ "\nSelect entities to flatten to Z=0: ")
  (setq ss (ssget))
  (if (null ss)
    (prompt "\nNothing selected.")
    (progn
      (setq i 0 n (sslength ss))
      (while (< i n)
        (flatten-ent (ssname ss i))
        (setq i (1+ i)))
      (princ (strcat "\nFlattened " (itoa n) " entities to Z=0."))))
  (princ))

(princ "\nPL-2D loaded. Type PL-2D to flatten selected entities to Z=0.")
(princ)
