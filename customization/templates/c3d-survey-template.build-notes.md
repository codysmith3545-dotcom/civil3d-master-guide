---
title: "Civil 3D Survey Template — Build Notes"
section: "customization/templates"
order: 20
visibility: public
tags: [template, dwt, build, civil3d, lisp, indiana]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "INDOT Standard Drawings"
    url: "https://www.in.gov/indot/engineering/design/standard-drawings/"
    verified: 2026-05-11
  - title: "Autodesk — Save a drawing as a template (DWT)"
    url: "https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-86E70BA1-A99B-4DA1-8E2B-4F5FB5F5B9A6"
    verified: 2026-05-11
    note: "URL stable across recent Civil 3D versions but help-site IDs do rotate — unverified for 2026"
---

> **TL;DR**
> 1. Start from `_AutoCAD Civil 3D (Imperial) NCS.dwt` shipped with Civil 3D.
> 2. Apply every section of this guide in order — the order matters because later styles reference earlier text styles and layers.
> 3. Save as `c3d-survey-template.dwt` in your office template path (typically a network share mapped via the `qnew` template path in Options).

This document is the **operator manual** for the spec bundle in this directory. Read it side-by-side with `c3d-survey-template.spec.yaml`. Estimated build time is 45–75 minutes for an experienced Civil 3D user.

## 0. Prerequisites

- Civil 3D 2022 or later installed (this guide is verified against 2024 and 2025; minor dialog drift in 2022 is noted inline).
- Write access to a working folder (not the office template path — save there only after testing).
- Optional: AutoLISP loader configured (Options > Files > Trusted Locations includes the folder containing the LISP routine in step 4).

## 1. Start from the imperial NCS template

1. Civil 3D > File > New > select `_AutoCAD Civil 3D (Imperial) NCS.dwt`.
2. Immediately `SAVEAS` > Drawing Template (`*.dwt`) > working folder > name `c3d-survey-template-WIP.dwt`.

Civil 3D's imperial NCS template already has a usable Civil 3D settings tree. We will overwrite layers and styles rather than start from `acad.dwt`, because keeping Civil 3D's default object styles avoids broken style references on object insertion.

## 2. Drawing settings (Civil 3D ambient)

Open Toolspace > Settings tab > right-click the drawing name > Edit Drawing Settings.

Set every value from `drawing-settings.yaml > ambient_settings`. Highlights:

- **Units and Zone**: Drawing Units = US Foot; Angular Units = Degrees; leave the coordinate-system zone unset.
- **Distance / Elevation / Coordinate / Direction / Angle**: precisions per the YAML. The most-checked one is Direction → format `bearings`, precision `4` (seconds with two decimals).
- **Object Layers**: open the Object Layers section and assign each Civil 3D object class its default layer from the YAML.
- **Abbreviations**: paste every key/value from `ambient_settings` adjacent abbreviations section.

Confirm by drawing a temporary line and running `LIST` on it — direction should display as `N 45-13-22.00 E`-style bearings.

## 3. Text styles

`STYLE` command (or Annotate ribbon > Text panel > Text Style dropdown > Manage Text Styles).

Create each row in `text-styles.csv`. For each:

- Name from column 1.
- Font name from column 2 — `.shx` fonts are SHX, Arial is TrueType.
- Height from column 3 (0 = variable, anything else = fixed; survey styles use fixed heights).
- Width factor from column 4; obliquing from column 5.

`SURVEY-100` is the workhorse — verify it is set Annotative.

## 4. Layers — load from CSV with the helper LISP

Rather than hand-typing 80 layer rows, use the helper routine:

```
APPLOAD
  -> select customization/lisp/library/layer/load-layers-from-csv.lsp
  -> Load
LAYERLOADCSV
  -> when prompted, pick customization/templates/layer-standard.csv
```

The routine creates each layer with the color index, linetype, lineweight, plot flag, and description from the CSV. Linetypes that do not exist in the drawing are loaded from `acad.lin` on demand. If a layer already exists it is updated in place (no duplicates).

If you prefer the manual path: `LAYER` > New, then enter each row. Keep `0` and `DEFPOINTS` untouched.

## 5. Linetypes

Run `LINETYPE` and load every linetype referenced in `layer-standard.csv` that is not yet present. The LISP routine handles this automatically but if you ran `LAYER` by hand you must load: `DASHED`, `DASHEDX2`, `HIDDEN`, `HIDDEN2`, `CENTER`, `PHANTOM`, `FENCELINE1`, `RAILROAD`.

If `RAILROAD` is not in `acad.lin`, define it in `acad.lin` (or use `FENCELINE2` as a substitute) and reload.

## 6. Dimension styles

`DIMSTYLE` > New for each entry in `dim-styles.yaml`. Set the variables under each style's `variables:` block on the appropriate tab of the Modify Dimension Style dialog. Use the Override option for child styles (`SURVEY-FT-CHAIN`, `SURVEY-BEARING`, `SURVEY-ALIGNED`, `SURVEY-RADIAL`) so they inherit from `SURVEY-FT`.

Make `SURVEY-FT` current. Verify annotative-scale toggle is on for every style.

## 7. Multileader styles

`MLEADERSTYLE` > New for each entry in `mleader-styles.yaml`. The block-based style `SURVEY-FOUND-MON` references block `SURVEY-MON-FND-CALLOUT`; create that block in step 9 first if you want the style to resolve immediately, otherwise the style will save with a placeholder and resolve on first use.

## 8. Table styles

`TABLESTYLE` > New for each entry in `table-styles.yaml`. The column widths are inches at 1:1; tables placed at viewport scale will scale via annotation scale.

## 9. Civil 3D Point Styles and Point Label Styles

Toolspace > Settings tab > Point > Point Styles > right-click > New.

For each entry in `point-styles.yaml > point_styles`:

1. **Marker** tab: set the marker type, symbol or block, size, and "Size in plotted units".
2. **3D Geometry** tab: orientation.
3. **Display** tab: turn the View Direction visibility on for Plan/Profile/Section/Model.
4. **Layer** tab: set the layer reference.

For each entry in `point-styles.yaml > label_styles`:

1. Toolspace > Point > Label Styles > right-click > New.
2. Add a Text component for each `components` entry; paste the `content:` expression into the Contents property.
3. Set the anchor and offset per the YAML.

Some styles reference blocks (`SAN-MH`, `STM-CB`, `TREE-SYMBOL`, etc.). Either:

- Insert pre-built blocks from your office block library, or
- Use Civil 3D's built-in marker symbols as a stop-gap and replace later.

## 10. Point Groups and Description Key Sets

Toolspace > Prospector tab > Point Groups > right-click > New. Create the recommended starter groups:

| Group | Filter |
|---|---|
| _All Points | empty filter |
| Control | Raw Description matches `CP*`, `TBM*`, `BM*`, `BENCH*` |
| Boundary | Raw Description matches `IP*`, `MON*`, `RB*`, `CONC-MON*`, `MAG*`, `RR-SPIKE*`, `X-CONC*` |
| Topo | Raw Description matches `TBC*`, `TC*`, `EOP*`, `GR-*`, `BLDG*`, `WALK*` |
| Utility | Raw Description matches `SAN-*`, `STM-*`, `STO-*`, `WV*`, `WM*`, `FH*`, `GV*`, `GAS-*`, `ELEC-*`, `TEL-*`, `CATV-*` |
| Vegetation | Raw Description matches `TR-*`, `BRUSH*`, `FIELD-EDGE*` |

For Description Key Sets, see `customization/description-keys/`. Import the appropriate `.deskey.yaml` for the collector you use (Trimble Access, Topcon MAGNET, or Carlson SurvCE).

## 11. Viewport-only and paperspace setup

1. Layout1 — rename to `D-SIZE-24x36`. Add a single viewport on layer `V-VPORT`.
2. Layout2 — rename to `B-SIZE-11x17`. Same.
3. Page setups: paste from your office page-setup template (or create at print time).

## 12. Survey database link (optional)

Toolspace > Survey tab > Survey Databases > New Local Survey Database. Configure equipment database, figure-prefix database, and linework-code set per office convention. None of these are stored in the .dwt; they are pulled by file path on open.

## 13. Audit and save

1. `AUDIT` > Yes.
2. `PURGE` > all (twice).
3. `OVERKILL` is **not** appropriate on a template; skip it.
4. `SAVEAS` > Drawing Template (`*.dwt`) > network template path > `c3d-survey-template.dwt`.
5. In Options > Files > Template Settings, set the default template for `QNEW` to the new file.

## Helper: layer-from-CSV LISP routine

Save the following as `customization/lisp/library/layer/load-layers-from-csv.lsp`. It is referenced by step 4.

```lisp
;; load-layers-from-csv.lsp — bulk-create AutoCAD layers from a CSV.
;; Expected header:
;;   name,color_index,linetype,lineweight,plot,description,ncs_reference,source
;; Usage:
;;   APPLOAD this file, then run command LAYERLOADCSV and pick the CSV.
;;
;; Notes:
;;   - Linetypes not present in the drawing are loaded from acad.lin.
;;   - Lineweight values that are not standard AutoCAD lineweights
;;     fall back to "Default".
;;   - Existing layers are updated (color, linetype, lineweight, plot,
;;     description) but never deleted.

(defun c:LAYERLOADCSV ( / file fh line first parts name color ltype lwt plot desc ncs src)
  (setq file (getfiled "Select layer CSV" "" "csv" 0))
  (if (and file (setq fh (open file "r")))
    (progn
      (setq first T)
      (while (setq line (read-line fh))
        (if first
          (setq first nil)
          (progn
            (setq parts (LAYERCSV:split line ","))
            (if (and parts (>= (length parts) 5))
              (progn
                (setq name  (nth 0 parts)
                      color (atoi (nth 1 parts))
                      ltype (nth 2 parts)
                      lwt   (nth 3 parts)
                      plot  (nth 4 parts)
                      desc  (if (> (length parts) 5) (nth 5 parts) "")
                      ncs   (if (> (length parts) 6) (nth 6 parts) "")
                      src   (if (> (length parts) 7) (nth 7 parts) ""))
                (LAYERCSV:ensure-linetype ltype)
                (LAYERCSV:make-or-update name color ltype lwt plot desc))))))
      (close fh)
      (princ (strcat "\nLayers loaded from " file)))
    (princ "\nNo CSV selected or could not open file."))
  (princ))

(defun LAYERCSV:split (s sep / pos result)
  (setq result '())
  (while (setq pos (vl-string-search sep s))
    (setq result (cons (substr s 1 pos) result))
    (setq s (substr s (+ pos 2))))
  (setq result (cons s result))
  (reverse result))

(defun LAYERCSV:ensure-linetype (lt)
  (if (and lt (/= lt "") (/= (strcase lt) "CONTINUOUS"))
    (if (not (tblsearch "ltype" lt))
      (command "._linetype" "_load" lt "acad.lin" ""))))

(defun LAYERCSV:make-or-update (name color ltype lwt plot desc / lw-val)
  (setq lw-val (LAYERCSV:lineweight lwt))
  (if (tblsearch "layer" name)
    (command "._-layer" "_color" color name "_ltype" ltype name
             "_lw" lw-val name "_plot" (if (= (strcase plot) "NO") "_n" "_y") name
             "_description" desc name "")
    (command "._-layer" "_make" name "_color" color name "_ltype" ltype name
             "_lw" lw-val name "_plot" (if (= (strcase plot) "NO") "_n" "_y") name
             "_description" desc name "")))

(defun LAYERCSV:lineweight (s / n)
  ;; Map common entries to AutoCAD lineweight numbers (in 0.01 mm units).
  ;; Anything unrecognized => "Default".
  (cond
    ((= (strcase s) "DEFAULT") "")
    ((= s "0.05") "5")
    ((= s "0.09") "9")
    ((= s "0.13") "13")
    ((= s "0.15") "15")
    ((= s "0.18") "18")
    ((= s "0.20") "20")
    ((= s "0.25") "25")
    ((= s "0.30") "30")
    ((= s "0.35") "35")
    ((= s "0.40") "40")
    ((= s "0.50") "50")
    ((= s "0.53") "53")
    ((= s "0.60") "60")
    ((= s "0.70") "70")
    ((= s "0.80") "80")
    ((= s "0.90") "90")
    ((= s "1.00") "100")
    (T "")))

(princ "\nLAYERLOADCSV loaded. Type LAYERLOADCSV to bulk-create layers from a CSV.")
(princ)
```

## Changelog

- **2026-05-11** — initial spec (v1.0.0-spec). No binary `.dwt` built in this repo; produced by an automated agent.

## Known gaps and follow-ups

- The `RAILROAD` linetype is not in stock `acad.lin`; surveys without rail crossings can ignore.
- Tree blocks (`TREE-SYMBOL`) are stubbed — replace with your office's symbol library before publishing.
- The Indiana State Plane zones are listed but not assigned — assigning a zone at the template level forces every new drawing into the wrong zone half the time, so leave it unset.
- ALTA Table A items 6b, 9, and 10 have layers but no automated workflows — those remain manual until a dedicated ALTA module is added.
