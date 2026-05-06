---
title: "CreateProfileLayout"
section: "civil3d/commands"
order: 231
visibility: public
command: CreateProfileLayout
category: profiles
ribbon: "Home tab > Create Design panel > Profile > Profile Creation Tools"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreateProfileFromSurface, CreateProfileView, EditProfileGeometry]
symptoms:
  - "How do I draw a finished-grade (FG) profile?"
  - "How do I set PVI elevations and add vertical curves?"
  - "How do I make the profile snap to design criteria K-values?"
  - "Why are my K-values reading as warnings?"
  - "How do I draw a vertical curve with a specific length or K?"
tags: [profiles, layout, fg, design-profile, vertical-curves, k-value]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Profile Layout Tools"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-66F8BFE3-2F0A-4DDA-9D7E-EF9C9A2AE2B7
    verified: 2026-05-06
---

> **TL;DR**
> 1. Opens the Profile Layout Tools toolbar in a chosen profile view to draw a design (FG) profile by PVI plus vertical curves.
> 2. Entity types parallel alignment layout: fixed, floating, free. Free vertical curves are the everyday choice between two tangents.
> 3. Design criteria + check sets attached to the parent alignment also evaluate K-values, grade differences, and curve lengths on this profile.

## When to use

When the EG profile is in place and you need to design the finished-grade (or subgrade) profile that the corridor will follow.

## Workflow

1. Make sure a profile view exists for the alignment; if not, run `CreateProfileView` first.
2. Run `CreateProfileLayout` (Home ribbon → **Profile** → **Profile Creation Tools**).
3. Pick the profile view to draw in.
4. Fill in **Name**, **Profile style**, **Label set** (band-friendly), and ensure **Design criteria** is enabled if criteria are attached to the alignment.
5. The Profile Layout Tools toolbar appears. Pick **Draw Tangents Without Curves**, click PVIs in the profile view to set grade breaks.
6. After tangents are placed, switch to **Free Vertical Curve (Parameter)** and click between two tangents — enter the K-value or length to land the curve.
7. Use the PVI editor (toolbar icon) to type exact stations and elevations; common in U.S. work to round elevations to 0.01 ft.
8. Watch Panorama Events for criteria violations and resolve.

## Common gotchas

- Drawing tangents through PVIs picked in canvas can introduce micro-grade breaks. Use the PVI editor to clean elevations and station rounding.
- Free vertical curves require a tangent on each side; you can't fillet against an empty grade.
- K-value direction sign matters: crest curves have negative K parameters in some tools; Civil 3D presents K as positive but distinguishes crest/sag.
- Editing a profile after a corridor is built leaves the corridor out of date until rebuilt.

## Related commands

- [CreateProfileFromSurface](createprofilefromsurface.md)
- [CreateProfileView](createprofileview.md)
- [EditProfileGeometry](editprofilegeometry.md)
