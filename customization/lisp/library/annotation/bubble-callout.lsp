;;; ------------------------------------------------------------
;;; Routine : BUBBLE-CALLOUT
;;; Purpose : Insert a numbered callout bubble (CIRCLE + centred
;;;           TEXT) at a picked point. Auto-increments the number
;;;           on each call within a session; stores the next
;;;           number on the BUBBLE-NEXT* global. The "table row"
;;;           link is an Xdata entry on the bubble that records
;;;           the number, so a downstream routine can collate.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(if (null BUBBLE-NEXT*) (setq BUBBLE-NEXT* 1))

(defun c:BUBBLE-RESET ( )
  (setq BUBBLE-NEXT* 1)
  (princ "\nBubble counter reset to 1.")
  (princ))

(defun c:BUBBLE-CALLOUT ( / p ht r ent c-ent old-cmd old-osm appid edata)
  (setq old-cmd (getvar "CMDECHO")
        old-osm (getvar "OSMODE"))
  (setvar "CMDECHO" 0)
  (setq appid "C3D_BUBBLE")
  (regapp appid)
  (setq ht (getvar "DIMTXT"))
  (setq r  (* ht 1.2))
  (setvar "OSMODE" 0)
  (while (setq p (getpoint (strcat "\nPick bubble centre for #"
                                   (itoa BUBBLE-NEXT*)
                                   " (Enter to quit): ")))
    (command "_.CIRCLE" p r)
    (setq c-ent (entlast))
    (command "_.TEXT" "_J" "_MC" p ht 0 (itoa BUBBLE-NEXT*))
    ;; Attach xdata with the bubble number so callers can find/group.
    (setq edata (entget c-ent))
    (setq edata (append edata
                  (list (list -3
                              (list appid
                                    (cons 1070 BUBBLE-NEXT*))))))
    (entmod edata)
    (princ (strcat "\n  Placed bubble #" (itoa BUBBLE-NEXT*)))
    (setq BUBBLE-NEXT* (1+ BUBBLE-NEXT*))
  )
  (setvar "OSMODE" old-osm)
  (setvar "CMDECHO" old-cmd)
  (princ)
)

(princ "\nBUBBLE-CALLOUT loaded. Type BUBBLE-CALLOUT to place numbered bubbles; BUBBLE-RESET to restart at 1.")
(princ)
