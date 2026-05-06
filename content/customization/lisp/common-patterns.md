---
title: "Common LISP Patterns"
section: "customization/lisp"
order: 35
visibility: public
tags: [lisp, autolisp, selection-set, ssget, entget, error-handling, user-input, file-io]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "AutoCAD AutoLISP Developer's Guide"
    url: https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-A0E9D801-8BE9-4BF1-85E8-3807E15F3B71
    verified: 2026-05-06
---

> **TL;DR**
> 1. **Selection sets** (`ssget` with DXF filter lists) are the primary way to collect entities. Master the filter syntax for entity type, layer, color, and property matching.
> 2. **Entity data** (`entget`/`entmod`) lets you read and modify any entity's DXF properties directly. This is how you change layers, colors, text values, and geometry without commands.
> 3. **Error handling** with `*error*` or `vl-catch-all-apply` prevents your routine from leaving the drawing in a bad state when something goes wrong.

## Selection sets

### Basic selection

```lisp
;; Interactive selection (user picks objects)
(setq ss (ssget))

;; Select all entities in the drawing
(setq ss (ssget "X"))

;; Select all entities on a specific layer
(setq ss (ssget "X" '((8 . "C-ROAD-CNTR"))))

;; Select all TEXT entities
(setq ss (ssget "X" '((0 . "TEXT"))))

;; Select LWPOLYLINE entities on layer C-BLDG
(setq ss (ssget "X" '((0 . "LWPOLYLINE") (8 . "C-BLDG"))))
```

### Filter list DXF codes

| DXF code | Meaning | Example |
|---|---|---|
| 0 | Entity type | `(0 . "LINE")` |
| 8 | Layer name | `(8 . "V-TOPO")` |
| 62 | Color number | `(62 . 1)` for red |
| 1 | Text value / block name | `(1 . "BENCH*")` for wildcard match |
| 2 | Block name (for INSERT) | `(2 . "MON_FOUND")` |
| 10 | Start point / insertion point | — |
| 40 | Text height / radius | — |

Wildcard matching uses AutoCAD patterns: `*` (any chars), `?` (single char), `#` (digit), `@` (alpha), `~` (NOT).

### Iterating a selection set

```lisp
(setq i 0)
(repeat (sslength ss)
  (setq ent (ssname ss i))
  (setq data (entget ent))
  ;; Process entity data here
  (setq i (1+ i))
)
```

## Entity data (entget / entmod)

### Reading entity data

```lisp
(setq ent (car (entsel "\nSelect entity: ")))
(setq data (entget ent))
;; data is an association list of DXF groups:
;; ((-1 . <Entity name>) (0 . "LINE") (8 . "C-ROAD") (10 100.0 200.0 0.0) (11 300.0 400.0 0.0) ...)

(cdr (assoc 8 data))   ; Layer name
(cdr (assoc 0 data))   ; Entity type
(cdr (assoc 10 data))  ; Start point (or insertion point)
```

### Modifying entity data

```lisp
;; Change the layer of an entity
(setq data (subst (cons 8 "C-ROAD-CNTR") (assoc 8 data) data))
(entmod data)
(entupd ent)  ; Refresh display
```

`entmod` writes the modified association list back to the database. `entupd` forces a display update (necessary for complex entities like polylines).

## Iterating layers

```lisp
;; Using the layer table
(setq lay (tblnext "LAYER" T))  ; T = rewind to first
(while lay
  (princ (strcat "\n" (cdr (assoc 2 lay))))
  (setq lay (tblnext "LAYER"))
)

;; Using COM (more powerful)
(vl-load-com)
(vlax-for lay (vla-get-Layers (vla-get-ActiveDocument (vlax-get-acad-object)))
  (princ (strcat "\n" (vla-get-Name lay)
                 " Frozen=" (if (= (vla-get-Freeze lay) :vlax-true) "Y" "N")))
)
```

## Error handling

### Custom *error* function

```lisp
(defun c:MyCommand (/ *error* old-osmode ss)
  ;; Save state and define error handler
  (setq old-osmode (getvar "OSMODE"))
  (defun *error* (msg)
    (setvar "OSMODE" old-osmode)  ; Restore state
    (if (/= msg "Function cancelled")
      (princ (strcat "\nError: " msg))
    )
    (princ)
  )
  ;; Main logic
  (setvar "OSMODE" 0)
  ;; ... do work ...
  ;; Restore state on normal exit
  (setvar "OSMODE" old-osmode)
  (princ)
)
```

### vl-catch-all-apply

```lisp
(setq result (vl-catch-all-apply 'some-function (list arg1 arg2)))
(if (vl-catch-all-error-p result)
  (princ (strcat "\nCaught error: " (vl-catch-all-error-message result)))
  (princ (strcat "\nResult: " (vl-princ-to-string result)))
)
```

## User input

```lisp
(setq pt (getpoint "\nPick a point: "))
(setq dist (getdist "\nEnter distance: "))
(setq ang (getangle "\nEnter angle: "))
(setq str (getstring T "\nEnter name: "))   ; T allows spaces
(setq int (getint "\nEnter count: "))

;; Keyword input
(initget "Yes No")
(setq kw (getkword "\nContinue? [Yes/No]: "))
```

## File I/O

```lisp
;; Writing to a file
(setq fp (open "C:\\output\\report.csv" "w"))
(write-line "Point,Northing,Easting,Elevation" fp)
(write-line "1,1000.00,2000.00,850.50" fp)
(close fp)

;; Reading from a file
(setq fp (open "C:\\input\\data.csv" "r"))
(while (setq line (read-line fp))
  (princ (strcat "\n" line))
)
(close fp)
```

## Related

- [Useful routines index](useful-routines-index.md)
- [Loading at startup](loading-at-startup.md)
- [vl-load-com and COM access](vl-load-com.md)
- [Visual LISP IDE](visual-lisp-ide.md)
