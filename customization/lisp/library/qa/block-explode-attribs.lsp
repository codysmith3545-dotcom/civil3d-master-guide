;;; ------------------------------------------------------------
;;; Routine : BLOCK-EXPLODE-ATTRIBS
;;; Purpose : Explode selected block references but preserve each
;;;           ATTRIB value as an MText drawn at the attribute's
;;;           insertion point with its layer, height, and
;;;           rotation. Vanilla EXPLODE turns attributes back into
;;;           ATTDEF tags - this routine keeps the values.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun gather-attribs (ins / sub edata att-list)
  ;; Walk attribute sub-entities of INS and return
  ;; ((insertion-pt height rotation layer value) ...)
  (setq sub (entnext ins) att-list nil)
  (while (and sub (not (= "SEQEND" (cdr (assoc 0 (setq edata (entget sub)))))))
    (if (= "ATTRIB" (cdr (assoc 0 edata)))
      (setq att-list
        (cons (list (cdr (assoc 10 edata))
                    (cdr (assoc 40 edata))
                    (if (assoc 50 edata) (cdr (assoc 50 edata)) 0.0)
                    (cdr (assoc 8  edata))
                    (cdr (assoc 1  edata)))
              att-list)))
    (setq sub (entnext sub)))
  (reverse att-list))

(defun c:BLOCK-EXPLODE-ATTRIBS ( / ss i n ent atts old-cmd old-osm)
  (setq old-cmd (getvar "CMDECHO")
        old-osm (getvar "OSMODE"))
  (setvar "CMDECHO" 0)
  (setvar "OSMODE" 0)
  (princ "\nSelect block references to explode (attributes preserved as MText): ")
  (setq ss (ssget '((0 . "INSERT"))))
  (if (null ss)
    (prompt "\nNothing selected.")
    (progn
      (setq i 0 n (sslength ss))
      (while (< i n)
        (setq ent (ssname ss i))
        (setq atts
          (if (= 1 (cdr (assoc 66 (entget ent))))
            (gather-attribs ent)
            nil))
        (command "_.EXPLODE" ent)
        (foreach a atts
          (command "_.-MTEXT" (car a)
                              "_H" (cadr a)
                              "_J" "_BL"
                              "_R" (* (caddr a) (/ 180.0 pi))
                              "_W" 0.0
                              (nth 4 a) ""))
        (setq i (1+ i)))
      (princ (strcat "\nExploded " (itoa n) " block(s), attribute values preserved as MText."))
    )
  )
  (setvar "OSMODE" old-osm)
  (setvar "CMDECHO" old-cmd)
  (princ)
)

(princ "\nBLOCK-EXPLODE-ATTRIBS loaded. Type BLOCK-EXPLODE-ATTRIBS to explode blocks while keeping attribute values.")
(princ)
