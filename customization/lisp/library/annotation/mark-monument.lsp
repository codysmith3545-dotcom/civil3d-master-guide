;;; ------------------------------------------------------------
;;; Routine : MARK-MONUMENT
;;; Purpose : Insert a monument block at picked points. The block
;;;           name and monument type are prompted once at start.
;;;           If the block has attributes for NORTHING / EASTING /
;;;           ELEV / TYPE / DATE, they are auto-filled.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun fill-attribs (ins n e z typ dt / ent edata att-tag val)
  ;; Walk attributes of the block reference just inserted.
  (setq ent (entnext ins))
  (while (and ent (not (= "SEQEND" (cdr (assoc 0 (setq edata (entget ent)))))))
    (if (= "ATTRIB" (cdr (assoc 0 edata)))
      (progn
        (setq att-tag (strcase (cdr (assoc 2 edata))))
        (setq val nil)
        (cond
          ((= att-tag "NORTHING") (setq val (rtos n 2 3)))
          ((= att-tag "EASTING")  (setq val (rtos e 2 3)))
          ((= att-tag "ELEV")     (setq val (rtos z 2 2)))
          ((= att-tag "ELEVATION")(setq val (rtos z 2 2)))
          ((= att-tag "TYPE")     (setq val typ))
          ((= att-tag "DATE")     (setq val dt))
        )
        (if val
          (entmod (subst (cons 1 val) (assoc 1 edata) edata)))
      ))
    (setq ent (entnext ent))
  )
  (entupd ins)
)

(defun c:MARK-MONUMENT ( / blk typ dt p ins n e z old-cmd old-osm)
  (setq old-cmd (getvar "CMDECHO")
        old-osm (getvar "OSMODE"))
  (setvar "CMDECHO" 0)
  (setq blk (getstring T "\nMonument block name: "))
  (if (or (null blk) (= blk ""))
    (prompt "\nNo block name supplied.")
    (progn
      (setq typ (getstring T "\nMonument type (e.g. 5/8\" rebar w/cap): "))
      (setq dt  (getstring T "\nDate string (e.g. 2026-05-11): "))
      (setvar "OSMODE" 1) ;; endpoint
      (while (setq p (getpoint "\nPick monument point (Enter to quit): "))
        (setq n (cadr p)
              e (car  p)
              z (if (caddr p) (caddr p) 0.0))
        (command "_.-INSERT" blk p 1 1 0)
        (setq ins (entlast))
        (if (= 1 (cdr (assoc 66 (entget ins))))
          (fill-attribs ins n e z typ dt))
        (princ (strcat "\n  Placed " blk " at N=" (rtos n 2 3) " E=" (rtos e 2 3)))
      )
    )
  )
  (setvar "OSMODE" old-osm)
  (setvar "CMDECHO" old-cmd)
  (princ)
)

(princ "\nMARK-MONUMENT loaded. Type MARK-MONUMENT to insert monument blocks with auto-filled attributes.")
(princ)
