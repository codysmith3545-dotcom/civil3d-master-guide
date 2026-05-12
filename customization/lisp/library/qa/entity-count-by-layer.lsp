;;; ------------------------------------------------------------
;;; Routine : ENTITY-COUNT-BY-LAYER
;;; Purpose : Count model-space entities grouped by layer and
;;;           write the result to a CSV file. Columns: layer,
;;;           entity_type, count.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

(defun bump (key store / pair)
  ;; store is an assoc list ((key . count) ...).  Returns updated list.
  (setq pair (assoc key store))
  (if pair
    (subst (cons key (1+ (cdr pair))) pair store)
    (cons (cons key 1) store)))

(defun c:ENTITY-COUNT-BY-LAYER ( / ss i n ent edata lay typ key store path fp rec)
  (princ "\nCounting model-space entities by layer + type...")
  (setq ss (ssget "_X" '((410 . "Model"))))
  (setq store nil)
  (if ss
    (progn
      (setq i 0 n (sslength ss))
      (while (< i n)
        (setq ent (ssname ss i))
        (setq edata (entget ent))
        (setq lay (cdr (assoc 8 edata)))
        (setq typ (cdr (assoc 0 edata)))
        (setq key (strcat lay "|" typ))
        (setq store (bump key store))
        (setq i (1+ i)))
    ))
  (setq path (getstring T "\nCSV output path (e.g. C:/temp/entity-count.csv): "))
  (if (or (null path) (= path ""))
    (prompt "\nNo output path supplied; report only on command line.")
    (progn
      (setq fp (open path "w"))
      (if (null fp)
        (prompt (strcat "\nCould not open " path " for writing."))
        (progn
          (write-line "layer,entity_type,count" fp)
          (foreach rec (vl-sort store (function (lambda (a b) (< (car a) (car b)))))
            (write-line
              (strcat (car (parse-key (car rec))) ","
                      (cadr (parse-key (car rec))) ","
                      (itoa (cdr rec))) fp))
          (close fp)
          (princ (strcat "\nWrote " (itoa (length store)) " rows to " path))))))
  (princ "\nSummary on command line:")
  (foreach rec (vl-sort store (function (lambda (a b) (< (car a) (car b)))))
    (princ (strcat "\n  " (car rec) "  " (itoa (cdr rec)))))
  (princ)
)

(defun parse-key (k / pos)
  ;; split "LAYER|TYPE" -> ("LAYER" "TYPE")
  (setq pos (vl-string-search "|" k))
  (if pos
    (list (substr k 1 pos) (substr k (+ pos 2)))
    (list k "")))

(princ "\nENTITY-COUNT-BY-LAYER loaded. Type ENTITY-COUNT-BY-LAYER to export an entity census CSV.")
(princ)
