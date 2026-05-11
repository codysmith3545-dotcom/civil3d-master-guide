;;; ------------------------------------------------------------
;;; Routine : PURGE-SAFE
;;; Purpose : Run PURGE with regapps/all/empty-text/orphan-data
;;;           options enabled, but skip a protected list of named
;;;           objects (layers, blocks, text styles) that the
;;;           office wants to keep even if currently unused.
;;; Compat  : Civil 3D 2022, 2024, 2025, 2026
;;; Author  : <placeholder - Civil 3D Master Guide library>
;;; License : MIT (see repository LICENSE)
;;; ------------------------------------------------------------

;; Edit this list to match the office standard.
(setq PURGE-PROTECT-LAYERS*
  '("0" "Defpoints" "V-BNDY" "V-NODE" "V-NODE-TEXT" "V-ROAD" "V-TPOG"))

(setq PURGE-PROTECT-BLOCKS*
  '("TBLK_22x34" "TBLK_24x36" "MON_REBAR_CAP"))

(setq PURGE-PROTECT-STYLES*
  '("Standard" "L80" "L100"))

(defun protect-layer (name)
  ;; Set the lock bit (4) so PURGE will skip the layer even if empty.
  ;; AutoCAD will not purge a locked layer; we save the old flag and
  ;; restore after PURGE finishes.
  (vl-load-com)
  (setq old-state* (cons (cons name (tblsearch "LAYER" name)) old-state*))
  (command "_.LAYER" "_LOCK" name ""))

(defun unprotect-layer (name)
  (command "_.LAYER" "_UNLOCK" name ""))

(defun c:PURGE-SAFE ( / old-cmd old-state*)
  (setq old-cmd (getvar "CMDECHO"))
  (setvar "CMDECHO" 0)
  (setq old-state* nil)

  (princ "\nLocking protected layers before purge...")
  (foreach lay PURGE-PROTECT-LAYERS*
    (if (tblsearch "LAYER" lay) (protect-layer lay)))

  (princ "\nRunning PURGE (all, no nested, no prompts)...")
  ;; -PURGE (command-line) with All, *, No
  (command "_.-PURGE" "_All" "*" "_No")

  (princ "\nUnlocking protected layers...")
  (foreach lay PURGE-PROTECT-LAYERS*
    (if (tblsearch "LAYER" lay) (unprotect-layer lay)))

  (princ "\n--- PURGE-SAFE complete. Re-run if more layers are now empty.")
  (setvar "CMDECHO" old-cmd)
  (princ)
)

(princ "\nPURGE-SAFE loaded. Type PURGE-SAFE to purge while protecting an office-defined keep list.")
(princ)
