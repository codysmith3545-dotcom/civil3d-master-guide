---
title: "Distributing Templates"
section: "customization/templates-and-kits"
order: 40
visibility: public
tags: [dwt, template, distribution, network-share, deployment, versioning]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Autodesk Civil 3D Help — Deploying and Managing Templates"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3A17C7E1-6E82-4E27-AE43-12BCC3F19F06
    verified: 2026-05-06
---

> **TL;DR**
> 1. Deploy the company DWT via a **network share** pointed to by Civil 3D's template path setting. All users create new drawings from the same template.
> 2. **Lock down the DWT** — set the file to read-only on the network and restrict write access to the CAD manager. This prevents accidental modification.
> 3. **Version the DWT** with a name like `CompanyName-C3D-2025-v3.dwt`. Keep previous versions archived so you can roll back if needed.

## Network share deployment

The simplest and most common approach:

1. Place the DWT on a network share accessible to all CAD users (e.g., `\\server\cad-standards\templates\`).
2. In each user's Civil 3D: Options > Files > Template Settings > Drawing Template File Location — point to the network folder.
3. When users create a new drawing (QNEW or File > New), they see the company template listed.
4. Set the QNEW default template to the company DWT so that QNEW always starts from the correct template.

### QNEW configuration

Set the system variable `QNEW` template via the deployment or a startup script:

```
Options > Files > Template Settings > Default Template File Name for QNEW
```

Point this to the network DWT path.

## Locking down the template

Prevent unintended modifications:

- Set the DWT file to **read-only** on the file system.
- Grant **write access only to the CAD manager** (or a CAD standards group).
- Use a version-controlled repository (Git) for the DWT source, with the network share holding only the released version.
- Audit the DWT periodically for unauthorized style additions (compare layer/style counts to the baseline).

## Versioning strategies

### Filename versioning

Use a naming convention that includes the Civil 3D version and a revision number:

```
CompanyName-C3D-2025-v1.dwt
CompanyName-C3D-2025-v2.dwt
CompanyName-C3D-2025-v3.dwt
```

Archive previous versions in a subfolder (`\\server\cad-standards\templates\archive\`). The active version is always in the main folder.

### Changelog

Maintain a text file alongside the DWT documenting each change:

```
v3 (2026-05-06): Updated pipe styles for HDPE, added inlet Type C style
v2 (2026-02-15): Added roundabout alignment styles, fixed contour label precision
v1 (2025-10-01): Initial release based on US Imperial NCS kit
```

## Deployment via Civil 3D deployment image

For organizations that create Autodesk deployment images for new installations:

1. Customize the deployment to include the company DWT in the template folder.
2. Set the template path and QNEW default in the deployment configuration.
3. Include the CTB file and any referenced resources (font files, linetype files).

This ensures every new installation is configured correctly from day one.

## Startup script approach

For users who already have Civil 3D installed:

1. Create a login script or Group Policy that copies the current DWT from the network share to the local template folder.
2. This provides a local copy for performance (faster drawing creation) while maintaining central control.
3. The script runs at each login, updating the local copy to the latest version.

Be cautious with this approach — if the network copy is corrupted, the script propagates the corruption.

## Preventing template drift

Over time, individual drawings diverge from the template (users add custom styles, rename layers, change settings). Mitigate drift by:

- Periodically running `PURGE` on project drawings to remove unused styles.
- Using a style-comparison tool (or a simple layer-count comparison) to identify unauthorized additions.
- Training users to modify objects, not styles — if they need a different appearance, request a new style from the CAD manager.
- Keeping the template lean — fewer styles means less opportunity for confusion.

## Related

- [DWT setup](dwt-setup.md)
- [Migrating templates](migrating-templates.md)
- [Template layers](template-layers.md)
- [Template page setups](template-page-setups.md)
