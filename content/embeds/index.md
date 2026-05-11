---
title: Embeddable calculator widgets
section: resources
tags:
  - embeds
  - calculators
  - iframe
  - teaching
appliesTo: []
relatedCommands: []
sources: []
updated: 2026-05-11
---

> Drop any Civil 3D Master Guide calculator into a class page, departmental
> intranet, or blog with a one-line iframe. Free for non-commercial
> educational use with attribution.

## What this is

Every interactive calculator on this site is also published at a stable
`/embed/calc/<slug>` URL with no global navigation, no footer, and no
search bar. Embed it in an iframe and your students or readers can run
the same math without leaving your page.

Source code stays on this domain. Inputs and outputs are computed in
your reader's browser — no data is sent to a server.

## Available widgets

The seventeen widgets mirror the calculators at `/tools`:

### Engineering

- `/embed/calc/vertical-curve` — AASHTO K and L; SSD/PSD crest, headlight sag.
- `/embed/calc/horizontal-curve` — T, L, M, E, LC and PC/PT stationing.
- `/embed/calc/rational-method` — Q = CiA with optional Kirpich tc.
- `/embed/calc/mannings` — Open-channel velocity and discharge.

### Survey

- `/embed/calc/inverse` — Azimuth, bearing, and distance between two points.
- `/embed/calc/bearing-bearing-intersection`
- `/embed/calc/bearing-distance-intersection`
- `/embed/calc/distance-distance-intersection`
- `/embed/calc/traverse-closure` — Compass (Bowditch) adjustment.
- `/embed/calc/metes-and-bounds` — Legal description writer.
- `/embed/calc/area-by-coordinates` — Shoelace area and perimeter.
- `/embed/calc/curve-stakeout` — Deflection-angle and chord table.
- `/embed/calc/level-loop` — Differential leveling adjustment.
- `/embed/calc/trig-leveling`
- `/embed/calc/solar-observation`
- `/embed/calc/grid-to-ground` — State Plane grid/ground conversions.
- `/embed/calc/state-plane-indiana` — Approximate CSF for SPC East/West.

## How to embed

Paste this into your CMS, replacing the calculator slug as needed.

```html
<iframe
  src="https://civil3d-master-guide.example/embed/calc/traverse-closure"
  title="Traverse closure calculator"
  width="100%"
  height="720"
  style="border: 1px solid #e5e7eb; border-radius: 8px;"
  loading="lazy"
></iframe>
```

A live, copy-pasteable browser of all snippets lives at
`/embed` on the deployment.

## Allow-listing your domain

The site sets a `Content-Security-Policy: frame-ancestors` header on
`/embed/*` so browsers will only frame these widgets from approved
origins. By default the only allowed origin is the site itself.

To add your domain, the operator must set the environment variable
`EMBED_ALLOWED_FRAME_ANCESTORS` to a whitespace-separated list before
the next deploy. Example:

```bash
EMBED_ALLOWED_FRAME_ANCESTORS="https://your-campus.edu https://*.your-campus.edu"
```

If you need a new domain added, open an issue against the repository
with the origin and a sentence describing the intended use.

## License and attribution

The calculator widgets and surrounding UI are released under the same
terms as the rest of this repository (see `LICENSE`):

- Original written content is **CC BY-SA 4.0**.
- Code (including the calculator components) is **MIT**.

Non-commercial educational use is encouraged. Please retain the
"Powered by Civil 3D Master Guide" link that appears at the bottom of
each embedded widget so readers can find the underlying reference
material and verify any output that affects a permit or construction
document.

## Demo

A static demo of two embeds living side-by-side is available at
`/embed-demo.html` on the deployment.
