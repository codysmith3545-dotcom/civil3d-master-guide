;;; ------------------------------------------------------------
;;; Routine : LINETYPE-AUDIT
;;; Purpose : List entities whose linetype, color, or lineweight
;;;           is explicitly set (not ByLayer / ByBlock). Helps
;;;           enforce NCS / office "everything ByLayer" policy.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun c:LINETYPE-AUDIT ( / ss i n ent edata lay ltype col lw flagged reason)
  (princ "\nScanning model space for overridden properties...")
  (setq ss (ssget "_X" '((410 . "Model"))))
  (setq flagged 0)
  (if ss
    (progn
      (setq i 0 n (sslength ss))
      (while (< i n)
        (setq ent   (ssname ss i))
        (setq edata (entget ent))
        (setq lay   (cdr (assoc 8 edata)))
        (setq ltype (if (assoc 6 edata)  (cdr (assoc 6 edata))  "BYLAYER"))
        (setq col   (if (assoc 62 edata) (cdr (assoc 62 edata)) 256))
        (setq lw    (if (assoc 370 edata) (cdr (assoc 370 edata)) -1))
        (setq reason nil)
        (if (not (or (= (strcase ltype) "BYLAYER")
                     (= (strcase ltype) "BYBLOCK")))
          (setq reason (cons (strcat "linetype=" ltype) reason)))
        (if (not (or (= col 256) (= col 0)))
          (setq reason (cons (strcat "color=" (itoa col)) reason)))
        (if (not (or (= lw -1) (= lw -2) (= lw -3)))
          (setq reason (cons (strcat "lw=" (itoa lw)) reason)))
        (if reason
          (progn
            (setq flagged (1+ flagged))
            (princ (strcat "\n  "
                           (cdr (assoc 0 edata))
                           " on " lay " :: "
                           (apply 'strcat
                             (mapcar (function (lambda (r) (strcat r " "))) reason))))
          ))
        (setq i (1+ i)))
    ))
  (princ (strcat "\n----- Flagged " (itoa flagged) " entities with overridden properties."))
  (princ)
)

(princ "\nLINETYPE-AUDIT loaded. Type LINETYPE-AUDIT to list entities that override layer properties.")
(princ)
