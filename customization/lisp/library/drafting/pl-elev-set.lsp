;;; ------------------------------------------------------------
;;; Routine : PL-ELEV-SET
;;; Purpose : Set the elevation (Z) of a picked polyline. For an
;;;           LWPOLYLINE this updates group 38; for a heavy
;;;           POLYLINE or a 3DPOLY this rewrites every vertex's
;;;           group 10 Z to the user-supplied value.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun set-z-on-vertices (parent-ent new-z / sub edata pt)
  (setq sub (entnext parent-ent))
  (while (and sub (not (= "SEQEND" (cdr (assoc 0 (setq edata (entget sub)))))))
    (if (= "VERTEX" (cdr (assoc 0 edata)))
      (progn
        (setq pt (cdr (assoc 10 edata)))
        (setq pt (list (car pt) (cadr pt) new-z))
        (entmod (subst (cons 10 pt) (assoc 10 edata) edata))))
    (setq sub (entnext sub)))
  (entupd parent-ent))

(defun c:PL-ELEV-SET ( / ent edata typ z new-edata)
  (princ "\nPick polyline to set elevation: ")
  (setq ent (car (entsel)))
  (cond
    ((null ent) (prompt "\nNothing selected."))
    (T
      (setq edata (entget ent))
      (setq typ (cdr (assoc 0 edata)))
      (cond
        ((not (member typ '("LWPOLYLINE" "POLYLINE")))
          (prompt (strcat "\nEntity is " typ "; PL-ELEV-SET requires a polyline.")))
        (T
          (setq z (getreal "\nNew elevation Z: "))
          (if (null z) (setq z 0.0))
          (cond
            ((= typ "LWPOLYLINE")
              (setq new-edata
                (if (assoc 38 edata)
                  (subst (cons 38 z) (assoc 38 edata) edata)
                  (append edata (list (cons 38 z)))))
              (entmod new-edata)
              (princ (strcat "\nSet elevation on LWPOLYLINE to " (rtos z 2 3))))
            ((= typ "POLYLINE")
              (set-z-on-vertices ent z)
              (princ (strcat "\nSet Z on every vertex of POLYLINE to " (rtos z 2 3)))))))))
  (princ))

(princ "\nPL-ELEV-SET loaded. Type PL-ELEV-SET to set polyline elevation.")
(princ)
