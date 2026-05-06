---
title: "Topsoil Stripping"
section: "engineering/earthwork"
order: 35
visibility: public
tags: [earthwork, topsoil, stripping, stockpile, respread, erosion-control, indiana]
updated: 2026-05-06
---

> **TL;DR**
> 1. Topsoil stripping depth in Indiana is typically **6 to 12 inches**, determined by the geotechnical report or the local jurisdiction's grading ordinance. Strip before earthwork begins; stockpile on-site for respread.
> 2. Topsoil stripping and respread volumes are calculated **separately** from the main earthwork quantities. A common error is to include topsoil in the cut/fill balance, which inflates fill quantities and underestimates borrow needs.
> 3. Stockpiled topsoil must be protected from erosion (perimeter silt fence or compost filter sock) and kept away from drainage paths. Respread depth is typically **4 to 6 inches** (varies by jurisdiction and specification).

## Why strip topsoil

Topsoil is the upper layer of soil that contains organic matter, root material, and biological activity. It is stripped before grading for two reasons:

1. **Engineering.** Organic material is compressible and decomposes over time. Fill placed over unstripped topsoil will settle unevenly. Structural fills, road subgrades, and building pads require a stable mineral subgrade.
2. **Agronomic.** Topsoil supports vegetation. It is stockpiled and respread over finished grades to establish turf, landscaping, and erosion-resistant ground cover.

## Stripping depth

The stripping depth depends on the topsoil horizon thickness, which varies by location and land use:

| Context | Typical strip depth |
|---|---|
| Agricultural land (central Indiana) | 8 to 12 in. |
| Previously developed site | 4 to 6 in. (may be mixed with fill) |
| Wooded site | 4 to 8 in. (root mat, leaf litter, organic layer) |
| Floodplain / alluvial soils | 6 to 12 in. (silty, high organic) |

The geotechnical report should identify the topsoil horizon and recommend a stripping depth. If no geotech data is available, 6 inches is a common default assumption for estimating purposes. Verify with test pits or borings.

### Jurisdictional requirements

Some Indiana municipalities specify stripping and respread depths in their grading and drainage ordinances:

- Indianapolis/Marion County: check the Stormwater Design and Construction Manual.
- Hamilton County municipalities (Carmel, Fishers, Noblesville, Westfield): check individual design standards manuals for topsoil requirements in ROW restoration and development grading.
- INDOT: Standard Specifications address topsoil stripping for state highway projects.

## Calculating strip and respread volumes

### Strip volume

```
V_strip (CY) = strip_area (SF) x strip_depth (ft) / 27
```

Example: 5 acres (217,800 SF) stripped at 8 inches (0.667 ft):

```
V_strip = 217,800 x 0.667 / 27 = 5,380 CY (BCY)
```

### Respread volume

Respread depth is usually less than strip depth because:

- Not all areas receive topsoil (buildings, pavement, hardscape).
- The respread depth may be specified at a lesser depth than was stripped.
- Some topsoil is lost to erosion or contamination during stockpiling.

```
V_respread (CY) = respread_area (SF) x respread_depth (ft) / 27
```

Example: 3 acres (130,680 SF) respread at 4 inches (0.333 ft):

```
V_respread = 130,680 x 0.333 / 27 = 1,613 CY (LCY)
```

### Surplus or deficit

If strip volume (adjusted for swell to LCY) exceeds respread volume, the surplus must be wasted or hauled off-site. If respread volume exceeds stripped volume, additional topsoil must be imported.

## Separating topsoil from earthwork quantities

Topsoil stripping and respread are separate bid items from earthwork (cut/fill). The earthwork computation should:

1. **Subtract the topsoil layer** from the existing surface before computing cut/fill. In Civil 3D, create a "stripped existing" surface by lowering the existing ground surface by the strip depth within the grading limits.
2. **Compute cut/fill** between the stripped existing surface and the proposed subgrade (not the finished grade — the finished grade includes the topsoil respread layer).
3. **Compute topsoil** as a separate quantity: strip volume and respread volume.

If topsoil is not separated, the cut/fill calculation includes the topsoil as usable fill material, which it is not (it cannot be placed as structural fill). This inflates the apparent fill supply and hides a borrow deficit.

## Stockpile management

### Location

- Place the stockpile on a stable, well-drained area within the site.
- Keep away from drainage paths, wetlands, and buffer zones.
- Avoid placing the stockpile where it will need to be moved again.

### Erosion control

- Install silt fence or compost filter sock around the perimeter of the stockpile.
- Seed or cover with erosion blanket if the stockpile will sit for more than 14 days (or as required by the NPDES permit and SWPPP).
- Limit stockpile height to maintain stability (typically no more than 10 to 15 ft for topsoil).

### Topsoil quality

Respread topsoil must be free of debris, large rocks, construction waste, and invasive plant material. Some specifications require topsoil testing (organic content, pH, particle size) before respread. If the on-site topsoil does not meet the specification, imported topsoil is required.

## Related

- [Cut/fill quick checks](cut-fill-quick-checks.md)
- [Shrink and swell](shrink-swell.md)
- [Stockpile estimation](stockpile-estimation.md)
- [Volume methods](volume-methods.md)
