---
title: "vl-load-com and COM/ActiveX Access"
section: "customization/lisp"
order: 25
visibility: public
tags: [lisp, autolisp, vl-load-com, com, activex, vla, vlax]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "AutoCAD AutoLISP Developer's Guide — ActiveX/COM Support"
    url: https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-A0E9D801-8BE9-4BF1-85E8-3807E15F3B71
    verified: 2026-05-06
---

> **TL;DR**
> 1. Call **(vl-load-com)** at the start of any LISP routine that uses COM/ActiveX functions (vla-*, vlax-*). It loads the Visual LISP COM support module. Calling it multiple times is harmless.
> 2. COM access lets you read and write object properties that are not available through basic entity data (entget/entmod), such as document properties, layout settings, and some Civil 3D-exposed properties.
> 3. The vla-* functions mirror the AutoCAD ActiveX object model: `vla-get-PropertyName` to read, `vla-put-PropertyName` to write, `vlax-invoke-method` to call methods.

## Loading COM support

```lisp
(vl-load-com)  ; Must be called before using any vla-* or vlax-* function
```

This loads the Visual LISP extensions for COM interop. It is fast and idempotent — calling it when already loaded has no effect. Place it at the top of any file that uses COM functions.

## Core COM functions

### Getting the application and document objects

```lisp
(vl-load-com)
(setq acad-app (vlax-get-acad-object))           ; Application object
(setq doc (vla-get-ActiveDocument acad-app))       ; Active document
(setq mspace (vla-get-ModelSpace doc))             ; Model space block
(setq db (vla-get-Database doc))                   ; Database
```

### Reading properties

```lisp
(vla-get-Name obj)         ; Get the Name property
(vla-get-Layer obj)        ; Get the Layer property
(vla-get-Color obj)        ; Get the Color (integer)
(vla-get-StartPoint obj)   ; Get start point (variant/safearray)
```

### Writing properties

```lisp
(vla-put-Layer obj "C-ROAD-CNTR")   ; Set the layer
(vla-put-Color obj 1)                ; Set color to red
```

### Converting data types

COM functions return and accept variants and safearrays, not native LISP lists. Convert between them:

```lisp
;; Variant/safearray to LISP point list
(setq pt (vlax-safearray->list (vlax-variant-value (vla-get-StartPoint obj))))

;; LISP point list to variant (for passing to COM methods)
(setq var-pt (vlax-3d-point '(100.0 200.0 0.0)))
```

### Iterating collections

```lisp
;; Iterate all layers
(vlax-for lay (vla-get-Layers doc)
  (princ (strcat "\n" (vla-get-Name lay)))
)
```

`vlax-for` iterates any COM collection (Layers, Blocks, Layouts, TextStyles, etc.).

## Useful COM operations not available through entget

| Task | COM approach |
|---|---|
| Get drawing file path | `(vla-get-FullName doc)` |
| Get/set document summary info | `(vla-get-SummaryInfo doc)` then `(vla-get-Author info)` etc. |
| Access layouts and viewports | `(vla-get-Layouts doc)` |
| Plot a layout | `(vla-Plot (vla-get-Plot doc))` |
| Access selection sets programmatically | `(vla-get-SelectionSets doc)` |
| Get block attribute values | `(vlax-invoke blk-ref 'GetAttributes)` returns an array of attribute reference objects |

## Civil 3D objects via COM

The Civil 3D COM/ActiveX type library exposes some (but not all) Civil 3D objects. Access is limited compared to the .NET API. For example:

- Surface objects can be accessed to read name and some properties.
- Alignment objects expose basic properties (name, length, station range).
- Many Civil 3D-specific operations (creating corridors, editing profiles) are not exposed via COM.

For full Civil 3D object model access, use the .NET API — see [Working with objects (.NET)](../dotnet-api/working-with-objects.md).

## Error handling with COM

COM calls can fail with automation errors. Wrap them in error handling:

```lisp
(setq result (vl-catch-all-apply 'vla-get-Name (list obj)))
(if (vl-catch-all-error-p result)
  (princ (strcat "\nError: " (vl-catch-all-error-message result)))
  (princ (strcat "\nName: " result))
)
```

## Related

- [Calling Civil 3D from LISP](calling-civil3d-from-lisp.md)
- [Common patterns](common-patterns.md)
- [Visual LISP IDE](visual-lisp-ide.md)
- [Working with objects (.NET)](../dotnet-api/working-with-objects.md)
