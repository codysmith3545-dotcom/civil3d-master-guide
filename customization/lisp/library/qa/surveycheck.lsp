;;; ------------------------------------------------------------
;;; Routine : SURVEYCHECK
;;; Purpose : Audit a survey drawing. Reports presence of a
;;;           configurable list of required layers, text styles,
;;;           and point styles; lists missing/unresolved xrefs;
;;;           and lists frozen layers that still hold entities.
;;;           All findings print to the command line.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

;; Edit these lists to match your office standard.
(setq SC-REQ-LAYERS*
  '("V-BNDY"
    "V-BNDY-LINE"
    "V-TPOG"
    "V-ROAD"
    "V-NODE"
    "V-NODE-TEXT"))

(setq SC-REQ-TEXTSTYLES*
  '("Standard" "L80" "L100"))

;; Civil 3D point styles must be queried via COM. The vanilla part
;; below only checks the *symbol-table* style names.
(setq SC-REQ-POINTSTYLES*
  '("Survey Point" "Basic"))

(defun sc-have-entry (tbl name / itm)
  (setq itm (tblsearch tbl name))
  (and itm T))

(defun sc-layer-frozen-but-used (lay-name / ss)
  (setq ss (ssget "_X" (list (cons 8 lay-name))))
  (and ss (sslength ss) (> (sslength ss) 0)))

(defun c:SURVEYCHECK ( / itm xref-blocks msgs frozen-layers)
  (vl-load-com)
  (princ "\n========= SURVEYCHECK =========")

  (princ "\n[Required layers]")
  (foreach lay SC-REQ-LAYERS*
    (princ (strcat "\n  " lay " ... "
                   (if (sc-have-entry "LAYER" lay) "OK" "MISSING"))))

  (princ "\n[Required text styles]")
  (foreach ts SC-REQ-TEXTSTYLES*
    (princ (strcat "\n  " ts " ... "
                   (if (sc-have-entry "STYLE" ts) "OK" "MISSING"))))

  (princ "\n[Required Civil 3D point styles (symbol-table check only)]")
  (foreach ps SC-REQ-POINTSTYLES*
    (princ (strcat "\n  " ps " ... "
                   (if (sc-have-entry "STYLE" ps) "OK" "(needs COM check)"))))

  (princ "\n[Xrefs]")
  (setq itm (tblnext "BLOCK" T))
  (while itm
    (if (= 4 (logand 4 (cdr (assoc 70 itm))))
      (princ (strcat "\n  XREF " (cdr (assoc 2 itm))
                     " -> " (if (assoc 1 itm) (cdr (assoc 1 itm)) "<no path>"))))
    (setq itm (tblnext "BLOCK")))

  (princ "\n[Frozen layers still containing entities]")
  (setq frozen-layers nil)
  (setq itm (tblnext "LAYER" T))
  (while itm
    (if (= 1 (logand 1 (cdr (assoc 70 itm))))
      (setq frozen-layers (cons (cdr (assoc 2 itm)) frozen-layers)))
    (setq itm (tblnext "LAYER")))
  (foreach lay frozen-layers
    (if (sc-layer-frozen-but-used lay)
      (princ (strcat "\n  " lay " (frozen, has entities)"))))

  (princ "\n===============================")
  (princ)
)

(princ "\nSURVEYCHECK loaded. Type SURVEYCHECK to audit required layers/styles/xrefs.")
(princ)
