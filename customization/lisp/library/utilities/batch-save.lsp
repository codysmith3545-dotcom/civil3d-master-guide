;;; ------------------------------------------------------------
;;; Routine : BATCH-SAVE
;;; Purpose : Save every open drawing without closing any. Skips
;;;           drawings that have never been saved (no file path)
;;;           and reports them so the user can save-as manually.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun c:BATCH-SAVE ( / acad docs i n doc path saved unsaved unsaved-list)
  (vl-load-com)
  (setq acad (vlax-get-acad-object))
  (setq docs (vla-get-Documents acad))
  (setq i 0 n (vla-get-Count docs) saved 0 unsaved 0 unsaved-list nil)
  (princ (strcat "\nBATCH-SAVE: " (itoa n) " open document(s)."))
  (while (< i n)
    (setq doc (vla-Item docs i))
    (setq path (vla-get-FullName doc))
    (cond
      ((or (null path) (= path "") (null (vl-string-search "\\" path)))
        (setq unsaved (1+ unsaved))
        (setq unsaved-list (cons (vla-get-Name doc) unsaved-list)))
      (T
        (vla-Save doc)
        (setq saved (1+ saved))
        (princ (strcat "\n  saved " (vla-get-Name doc)))))
    (setq i (1+ i)))
  (princ (strcat "\n----- BATCH-SAVE summary: " (itoa saved) " saved, "
                 (itoa unsaved) " skipped (no path)."))
  (foreach name unsaved-list
    (princ (strcat "\n  SKIPPED (needs SAVEAS): " name)))
  (princ)
)

(princ "\nBATCH-SAVE loaded. Type BATCH-SAVE to save every open drawing.")
(princ)
