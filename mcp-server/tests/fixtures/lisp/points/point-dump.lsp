;;; POINT-DUMP — dump COGO points to a CSV. Test fixture only.
(defun c:POINT-DUMP ( / f)
  (setq f (open "points.csv" "w"))
  (write-line "PointNumber,Northing,Easting,Elevation,Description" f)
  (close f)
  (princ))
