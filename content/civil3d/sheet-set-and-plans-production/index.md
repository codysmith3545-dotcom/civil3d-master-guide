---
title: "Sheet Sets and Plans Production"
section: "civil3d/sheet-set-and-plans-production"
order: 115
visibility: public
tags: [sheet-set, ssm, plans-production, view-frame, plan-profile, viewport]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEVIEWFRAMES, CREATESHEETS, NEWSHEETSET]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - About Plan Production"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-7E1F2C1A-FAB2-4D5F-92C7-7A8AF3CE2D58"
    verified: 2026-05-11
---

> **TL;DR**
> 1. Plan Production in Civil 3D drives Sheet Set Manager (SSM) end-to-end: view frames + match lines on the alignment, sheets in their own drawings, an SSM `.dst` that ties them together.
> 2. Plan-profile sheets are the most common output; sections-only and plan-only sheets use the same view-frame-group infrastructure.
> 3. Viewport scale and annotation scale must match per viewport so labels render at the correct paper size.

## Pages

- [Sheet Set Manager (SSM) with Civil 3D](sheet-set-manager-civil3d.md)
- [Plan-profile plotting](plan-profile-plotting.md)
- [Viewport scale and annotation scale](viewport-scale-and-annotation-scale.md)
- [Create sheets by alignment (end-to-end)](create-sheets-by-alignment.md)

## Related

- [Plan production overview](../plan-production/index.md)
- [View frame groups](../plan-production/view-frame-groups.md)
- [Sheet templates](../plan-production/sheet-templates.md)
