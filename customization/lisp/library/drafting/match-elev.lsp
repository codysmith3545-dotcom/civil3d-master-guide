;;; ------------------------------------------------------------
;;; Routine : MATCH-ELEV
;;; Purpose : Copy the Z (elevation) of one entity to one or many
;;;           target entities. Source picks read DXF group 10
;;;           (elevation for LWPOLYLINE, insertion Z for INSERT/
;;;           TEXT/MTEXT/POINT) and write it back to each target.
;;;           For LWPOLYLINE this updates group 38 (elevation).
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun get-z (ent / edata typ pt)
  (setq edata (entget ent))
  (setq typ (cdr (assoc 0 edata)))
  (cond
    ((= typ "LWPOLYLINE")
      (if (assoc 38 edata) (cdr (assoc 38 edata)) 0.0))
    ((member typ '("INSERT" "TEXT" "MTEXT" "POINT" "CIRCLE" "LINE"))
      (setq pt (cdr (assoc 10 edata)))
      (if (and pt (caddr pt)) (caddr pt) 0.0))
    (T 0.0)))

(defun set-z (ent z / edata typ pt new-edata)
  (setq edata (entget ent))
  (setq typ (cdr (assoc 0 edata)))
  (cond
    ((= typ "LWPOLYLINE")
      (setq new-edata
        (if (assoc 38 edata)
          (subst (cons 38 z) (assoc 38 edata) edata)
          (append edata (list (cons 38 z)))))
      (entmod new-edata))
    ((member typ '("INSERT" "TEXT" "MTEXT" "POINT" "CIRCLE"))
      (setq pt (cdr (assoc 10 edata)))
      (setq pt (list (car pt) (cadr pt) z))
      (entmod (subst (cons 10 pt) (assoc 10 edata) edata)))
    ((= typ "LINE")
      (setq edata (subst (cons 10 (list (car (cdr (assoc 10 edata)))
                                        (cadr (cdr (assoc 10 edata)))
                                        z))
                         (assoc 10 edata) edata))
      (setq edata (subst (cons 11 (list (car (cdr (assoc 11 edata)))
                                        (cadr (cdr (assoc 11 edata)))
                                        z))
                         (assoc 11 edata) edata))
      (entmod edata))))

(defun c:MATCH-ELEV ( / src-ent z ss i n)
  (princ "\nPick source entity (its elevation will be copied): ")
  (setq src-ent (car (entsel)))
  (if (null src-ent)
    (prompt "\nNothing selected.")
    (progn
      (setq z (get-z src-ent))
      (princ (strcat "\nSource Z = " (rtos z 2 3)))
      (princ "\nSelect target entities: ")
      (setq ss (ssget))
      (if (null ss)
        (prompt "\nNothing selected.")
        (progn
          (setq i 0 n (sslength ss))
          (while (< i n)
            (set-z (ssname ss i) z)
            (setq i (1+ i)))
          (princ (strcat "\nSet Z=" (rtos z 2 3) " on " (itoa n) " entities."))))))
  (princ))

(princ "\nMATCH-ELEV loaded. Type MATCH-ELEV to copy elevation between picked entities.")
(princ)
