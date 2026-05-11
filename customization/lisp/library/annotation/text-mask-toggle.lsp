;;; ------------------------------------------------------------
;;; Routine : TEXT-MASK-TOGGLE
;;; Purpose : Toggle the background mask on selected MTEXT
;;;           entities. If any in the selection have a mask, all
;;;           get masks removed; if none do, all get a mask added
;;;           using the drawing background colour and 1.5x offset.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun c:TEXT-MASK-TOGGLE ( / ss i n ent vobj any-masked target added removed)
  (vl-load-com)
  (princ "\nSelect MTEXT to toggle background mask: ")
  (setq ss (ssget '((0 . "MTEXT"))))
  (if (null ss)
    (prompt "\nNothing selected.")
    (progn
      (setq i 0 n (sslength ss) any-masked nil)
      (while (< i n)
        (setq vobj (vlax-ename->vla-object (ssname ss i)))
        (if (and (vlax-property-available-p vobj 'BackgroundFill)
                 (= :vlax-true (vla-get-BackgroundFill vobj)))
          (setq any-masked T))
        (setq i (1+ i)))
      (setq target (if any-masked :vlax-false :vlax-true))
      (setq added 0 removed 0)
      (setq i 0)
      (while (< i n)
        (setq vobj (vlax-ename->vla-object (ssname ss i)))
        (if (vlax-property-available-p vobj 'BackgroundFill)
          (progn
            (vla-put-BackgroundFill vobj target)
            (if (= target :vlax-true)
              (setq added (1+ added))
              (setq removed (1+ removed)))))
        (setq i (1+ i)))
      (princ (strcat "\nMask added: " (itoa added) "   removed: " (itoa removed)))
    )
  )
  (princ)
)

(princ "\nTEXT-MASK-TOGGLE loaded. Type TEXT-MASK-TOGGLE to toggle MTEXT background masks.")
(princ)
