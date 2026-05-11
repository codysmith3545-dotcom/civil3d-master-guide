;;; LFRZ-PATTERN — freeze all layers matching a wildcard pattern.
;;; Test fixture only; not for production use.
(defun c:LFRZ-PATTERN ( / pat lst)
  (setq pat (getstring T "\nLayer name pattern (wild-card): "))
  (setq lst (vla-get-layers (vla-get-activedocument (vlax-get-acad-object))))
  (vlax-for lay lst
    (if (wcmatch (vla-get-name lay) pat)
      (vla-put-freeze lay :vlax-true)))
  (princ))
