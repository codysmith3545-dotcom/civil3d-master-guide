;;; ------------------------------------------------------------
;;; Routine : IMPORTPNT-FROMDC
;;; Purpose : Import points from a data-collector CSV. Auto-detects
;;;           Trimble (PNEZD), Topcon (PENZD), and Carlson (PNEZD with
;;;           optional code column) layouts by looking at the first
;;;           non-blank row. Creates AutoCAD POINT entities with text
;;;           labels - NOT Civil 3D COGO points (to keep the routine
;;;           runnable without the Aecc COM hookup).
;;; Compat  : AutoCAD / Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------
;;; Notes   : Auto-detect rules:
;;;             - If first field is non-numeric (e.g. has letters)
;;;               we assume the file has a header row and skip it.
;;;             - If row has 4 columns -> PNEZD without description.
;;;             - If row has 5 columns and field 2 looks bigger than
;;;               field 3 (Northing > Easting in U.S. state plane)
;;;               we call it PNEZD; otherwise PENZD.
;;;             - More than 5 columns -> assume Carlson "P,N,E,Z,D,note"
;;;               and ignore extras.
;;;           This is a heuristic - prompt the user to confirm.

(defun split-csv (s / out cur i ch len)
  (setq out '() cur "" i 0 len (strlen s))
  (while (< i len)
    (setq ch (substr s (1+ i) 1))
    (cond
      ((= ch ",")
        (setq out (cons cur out))
        (setq cur ""))
      (T
        (setq cur (strcat cur ch))))
    (setq i (1+ i)))
  (setq out (cons cur out))
  (reverse out))

(defun looks-numeric (s)
  (and s (> (strlen s) 0)
       (or (numberp (read s))
           ;; read returns symbol for non-numeric; numberp on read
           (= s "0"))))

(defun c:IMPORTPNT-FROMDC ( / fpath fh line first parts ncol fmt
                              ans i p n e z d cnt has-header)
  (setq fpath (getstring T "\nData collector CSV path: "))
  (cond
    ((or (null fpath) (= fpath ""))
      (prompt "\nNo path. Cancelled.")
      (princ))
    (T
      (setq fh (open fpath "r"))
      (cond
        ((null fh) (alert (strcat "Cannot open " fpath)))
        (T
          ;; sniff the first non-blank line
          (setq first nil)
          (while (and (null first) (setq line (read-line fh)))
            (if (> (strlen line) 0) (setq first line)))
          (cond
            ((null first) (alert "File is empty.") (close fh))
            (T
              (setq parts (split-csv first))
              (setq ncol (length parts))
              (setq has-header (not (looks-numeric (nth 0 parts))))
              (cond
                ((= ncol 4) (setq fmt "PNEZ"))
                ((= ncol 5)
                  (setq fmt
                    (if (and (looks-numeric (nth 1 parts))
                             (looks-numeric (nth 2 parts))
                             (> (atof (nth 1 parts)) (atof (nth 2 parts))))
                      "PNEZD"
                      "PENZD")))
                (T (setq fmt "PNEZD")))
              (prompt (strcat "\nDetected format: " fmt
                              (if has-header " (with header row)" "")))
              (prompt "\nProceed? [Y/N] <Y>: ")
              (setq ans (getstring))
              (cond
                ((and ans (or (= (strcase ans) "N") (= (strcase ans) "NO")))
                  (prompt "\nCancelled by user.")
                  (close fh))
                (T
                  (close fh)
                  (setq fh (open fpath "r"))
                  (if has-header (read-line fh))
                  (setq cnt 0)
                  (while (setq line (read-line fh))
                    (cond
                      ((> (strlen line) 0)
                        (setq parts (split-csv line))
                        (cond
                          ((= fmt "PNEZ")
                            (setq p (nth 0 parts) n (nth 1 parts)
                                  e (nth 2 parts) z (nth 3 parts) d ""))
                          ((= fmt "PNEZD")
                            (setq p (nth 0 parts) n (nth 1 parts)
                                  e (nth 2 parts) z (nth 3 parts)
                                  d (if (>= (length parts) 5) (nth 4 parts) "")))
                          ((= fmt "PENZD")
                            (setq p (nth 0 parts) e (nth 1 parts)
                                  n (nth 2 parts) z (nth 3 parts)
                                  d (if (>= (length parts) 5) (nth 4 parts) ""))))
                        ;; draw a POINT at (E,N,Z) and label with P + D
                        (command "_.POINT" (list (atof e) (atof n) (atof z)))
                        (command "_.TEXT" (list (+ (atof e) 1.0)
                                                (+ (atof n) 1.0)
                                                (atof z))
                                 2.0 0 (strcat p " " d))
                        (setq cnt (1+ cnt)))))
                  (close fh)
                  (prompt (strcat "\nImported " (itoa cnt) " point(s) as POINT+TEXT pairs."))))))))))
  (princ))
(princ)
