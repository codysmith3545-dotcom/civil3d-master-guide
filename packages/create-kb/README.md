# create-knowledge-base

Scaffolder CLI that forks the Civil 3D Master Guide framework into a new
domain — ArcGIS Pro Master Guide, Revit Master Guide, etc.

## Use

```bash
npx create-knowledge-base my-domain-guide
cd my-domain-guide
pnpm dev
```

## Flags

- `--non-interactive` — accept defaults for every prompt
- `--no-install` — skip `pnpm install`
- `--no-git` — skip `git init` and the first commit

## Prompts

1. Brand name
2. Primary color hex
3. Accent color hex
4. Knowledge scope (one sentence)
5. Primary jurisdiction (country/region)
6. Calculators to include (multi-select)
7. AI model preference (claude-opus-4-7 / claude-sonnet-4-6 / claude-haiku-4-5-20251001)
8. Auth mode (none / open / invite-only)
9. License (MIT / Apache-2.0 / CC-BY-4.0)

## Template substitutions

The minimal template uses a tiny handlebars subset implemented in
`src/scaffold.mjs`. Supported tags:

- `{{var}}` — simple substitution, dot paths allowed (e.g. `{{brand.name}}`)
- `{{#if var}}…{{/if}}`
- `{{#unless var}}…{{/unless}}`
- `{{#each list}}…{{/each}}` (use `{{this}}` / `{{this.foo}}` inside)

Variables exposed to templates:

| variable | from |
| --- | --- |
| `{{projectName}}` | CLI argument |
| `{{packageName}}` | sanitized npm-safe slug |
| `{{brand.name}}` | prompt |
| `{{brand.primary}}` | prompt (hex) |
| `{{brand.accent}}` | prompt (hex) |
| `{{knowledge.scope}}` | prompt |
| `{{knowledge.geography}}` | prompt |
| `{{ai.model}}` | prompt |
| `{{ai.persona}}` | derived |
| `{{auth.mode}}` | prompt |
| `{{auth.enabled}}` | derived |
| `{{license}}` | prompt |
| `{{calculators}}` | array of `{slug,name,category}` |
| `{{hasCalculators}}` | derived |
| `{{year}}` | runtime |

## Testing

```bash
pnpm --filter @civil3d-master-guide/create-kb test
```

## License

MIT.
