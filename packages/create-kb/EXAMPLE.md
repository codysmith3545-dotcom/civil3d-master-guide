# Sample run — ArcGIS Pro Master Guide

Below is a transcript of scaffolding a fresh "ArcGIS Pro Master Guide" using
`create-knowledge-base`. Lines starting with `>` are user input.

```text
$ npx create-knowledge-base arcgis-pro-master-guide

create-knowledge-base — interactive scaffolder
Press Enter to accept the [default].

Brand name [Arcgis Pro Master Guide]:
> ArcGIS Pro Master Guide
Primary color hex [#0f3d2e]:
> #134e6f
Accent color hex [#c89b3c]:
> #ffb000
Knowledge scope (1 sentence) [A reference knowledge base for a professional domain, with curated standards and workflows.]:
> A reference knowledge base for ArcGIS Pro: geoprocessing, cartography, and enterprise GIS workflows.
Primary jurisdiction (country/region) [US]:
> US
Calculators to include (comma-separated numbers, or blank for none):
  1) Vertical Curve (engineering)
  2) Horizontal Curve (engineering)
  3) Rational Method (engineering)
  4) Manning's Equation (engineering)
  5) Inverse (survey)
  6) Bearing-Bearing Intersection (survey)
  ...
 17) State Plane Indiana CSF (survey)
Numbers (comma-separated), "all", or blank for none:
> 5,16
AI model preference:
  * 1) claude-opus-4-7
    2) claude-sonnet-4-6
    3) claude-haiku-4-5-20251001
Choose [claude-opus-4-7]:
>
Auth mode:
  * 1) none
    2) open
    3) invite-only
Choose [none]:
> 3
License:
  * 1) MIT
    2) Apache-2.0
    3) CC-BY-4.0
Choose [MIT]:
>

Scaffolding arcgis-pro-master-guide -> /work/arcgis-pro-master-guide
Installing dependencies (pnpm install)...
Done.

Next steps:
  cd arcgis-pro-master-guide
  pnpm dev
```

## Resulting `config.yaml`

```yaml
brand:
  name: "ArcGIS Pro Master Guide"
  short_name: "ArcGIS Pro Master Guide"
  primary_color: "#134e6f"
  accent_color: "#ffb000"
  footer: "Original content licensed MIT."

knowledge:
  focus: "A reference knowledge base for ArcGIS Pro: geoprocessing, cartography, and enterprise GIS workflows."
  geography: "US"
  content_dir: "content"

ai:
  model: "claude-opus-4-7"
  persona: "a domain expert for ArcGIS Pro Master Guide"
  citation_style: "always cite the source page path"
  system_prompt_template: "prompts/system.md"

auth:
  mode: "invite-only"

calculators:
  enabled:
    - { slug: "inverse", name: "Inverse", category: "survey" }
    - { slug: "grid-to-ground", name: "Grid-to-Ground", category: "survey" }

deploy:
  web: "vercel"
```

## Resulting `package.json`

```json
{
  "name": "arcgis-pro-master-guide",
  "version": "0.1.0",
  "private": true,
  "description": "A reference knowledge base for ArcGIS Pro: geoprocessing, cartography, and enterprise GIS workflows.",
  "license": "MIT",
  "packageManager": "pnpm@9.12.0",
  "workspaces": ["web", "mcp-server", "packages/*"]
}
```
