;;; ------------------------------------------------------------
;;; Routine : C3D-STYLECHECK
;;; Purpose : Audit Civil 3D style collections. Counts point
;;;           styles, point-label styles, surface styles, and
;;;           alignment styles present in the active drawing.
;;;           Uses the AeccApplication COM API. Output is
;;;           command-line summary only - no edits made.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun c3d-doc ( / acad app c3d ver progid)
  ;; AeccXUiLand.AeccApplication.<ver> - version differs per release.
  ;; Probe known progids and return the active document object.
  (vl-load-com)
  (setq acad (vlax-get-acad-object))
  (setq progid nil)
  (foreach v '("13.5" "13.4" "13.3" "13.2" "13.1" "13.0" "12.0" "11.0")
    (if (null progid)
      (if (not (vl-catch-all-error-p
                (vl-catch-all-apply
                  (function (lambda ()
                    (setq app (vla-GetInterfaceObject acad
                                (strcat "AeccXUiLand.AeccApplication." v))))))))
        (setq progid v))))
  (if (null app) (alert "Could not bind AeccApplication COM interface."))
  (if app (vlax-get-property app 'ActiveDocument)))

(defun count-collection (col / )
  (if col (vla-get-Count col) 0))

(defun c:C3D-STYLECHECK ( / doc roots ps pls ss als sa)
  (vl-load-com)
  (setq doc (c3d-doc))
  (if (null doc)
    (princ "\nNo Civil 3D document interface available.")
    (progn
      (setq roots (vla-get-Styles doc))
      (setq ps   (vla-get-PointStyles      roots))
      (setq pls  (vla-get-PointLabelStyles roots))
      (setq ss   (vla-get-SurfaceStyles    roots))
      (setq sa   (vla-get-AlignmentStyles  roots))
      (princ "\n========= C3D-STYLECHECK =========")
      (princ (strcat "\n  Point styles        : " (itoa (count-collection ps))))
      (princ (strcat "\n  Point label styles  : " (itoa (count-collection pls))))
      (princ (strcat "\n  Surface styles      : " (itoa (count-collection ss))))
      (princ (strcat "\n  Alignment styles    : " (itoa (count-collection sa))))
      (princ "\n=================================")
    ))
  (princ)
)

(princ "\nC3D-STYLECHECK loaded. Type C3D-STYLECHECK to count Civil 3D style collections.")
(princ)
