;;; ------------------------------------------------------------
;;; Routine : PNTRENUM
;;; Purpose : Renumber selected Civil 3D COGO points sequentially in
;;;           the order the user picks them. Prompts for a starting
;;;           number and an increment.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : Civil 3D Master Guide contributors
;;; License : MIT
;;; ------------------------------------------------------------
;;; Caveats : Renumbering can collide with existing point numbers.
;;;           The routine checks for collisions and bails before
;;;           committing any change.

(vl-load-com)

(defun pnt-numbers-in-use ( / ss i obj nums)
  (setq nums '())
  (setq ss (ssget "_X" '((0 . "AECC_COGO_POINT"))))
  (if ss
    (progn
      (setq i 0)
      (while (< i (sslength ss))
        (setq obj (vlax-ename->vla-object (ssname ss i)))
        (setq nums (cons (fix (vlax-get obj 'Number)) nums))
        (setq i (1+ i)))))
  nums)

(defun c:PNTRENUM ( / sel start incr i ent obj cur newnum
                      existing collisions sel-nums)
  (prompt "\nSelect COGO points in the order you want them renumbered: ")
  (setq sel (ssget '((0 . "AECC_COGO_POINT"))))
  (cond
    ((null sel)
      (prompt "\nNo points selected.")
      (princ))
    (T
      (setq start (getint "\nStarting point number: "))
      (setq incr  (getint "\nIncrement <1>: "))
      (if (or (null incr) (= incr 0)) (setq incr 1))
      (cond
        ((null start) (prompt "\nNo start. Cancelled."))
        (T
          ;; build list of selected points' current numbers
          (setq sel-nums '() i 0)
          (while (< i (sslength sel))
            (setq obj (vlax-ename->vla-object (ssname sel i)))
            (setq sel-nums (cons (fix (vlax-get obj 'Number)) sel-nums))
            (setq i (1+ i)))
          ;; precompute new numbers and check collisions against in-use
          ;; numbers excluding the selection itself
          (setq existing (pnt-numbers-in-use))
          (foreach n sel-nums
            (setq existing (vl-remove n existing)))
          (setq collisions '() i 0 cur start)
          (while (< i (sslength sel))
            (if (member cur existing)
              (setq collisions (cons cur collisions)))
            (setq cur (+ cur incr))
            (setq i (1+ i)))
          (cond
            (collisions
              (alert (strcat "Renumbering would collide with point number(s): "
                             (apply 'strcat
                               (mapcar '(lambda (x) (strcat (itoa x) " "))
                                       collisions))
                             "Aborting before any change.")))
            (T
              ;; commit the renumber
              (setq i 0 cur start)
              (while (< i (sslength sel))
                (setq obj (vlax-ename->vla-object (ssname sel i)))
                (vlax-put obj 'Number cur)
                (setq cur (+ cur incr))
                (setq i (1+ i)))
              (prompt (strcat "\nRenumbered " (itoa (sslength sel))
                              " point(s) starting at " (itoa start)
                              " (step " (itoa incr) ")."))))))))
  (princ))
(princ)
