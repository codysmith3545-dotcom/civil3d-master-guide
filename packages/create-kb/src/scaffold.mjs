// Template processing — handlebars subset.
//
// Supported syntax (deliberately small):
//   {{var}}                       — simple substitution; nested keys via dot path
//   {{#if var}}...{{/if}}         — keeps block when truthy
//   {{#unless var}}...{{/unless}} — keeps block when falsy
//   {{#each list}}...{{/each}}    — repeats block. Inside, "this" = current item;
//                                    "this.foo" = property of object item.
//
// Output is written to disk by copyTree(); we just supply the per-file transform.

import { copyTree } from './copy.mjs';

function getPath(ctx, dotted) {
  if (dotted === 'this') return ctx.__this__ ?? ctx;
  const parts = dotted.split('.');
  let cur;
  if (parts[0] === 'this') {
    cur = ctx.__this__ ?? ctx;
    parts.shift();
  } else {
    cur = ctx;
  }
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function truthy(v) {
  if (Array.isArray(v)) return v.length > 0;
  return !!v;
}

// Render a string template against a context.
export function render(template, context) {
  // Process the outermost block constructs first via a recursive scanner.
  // We repeatedly find #if / #unless / #each blocks (innermost first) and
  // replace them with their rendered content.

  let out = template;

  const blockRe = /\{\{#(if|unless|each)\s+([^}\s]+)\s*\}\}([\s\S]*?)\{\{\/\1\}\}/;
  // To handle nesting correctly, repeat until no more block tags remain;
  // because the regex is non-greedy and lazy, the innermost block matches first
  // only when the outer tags differ. To be safe, we do multiple passes.
  let safety = 0;
  while (blockRe.test(out)) {
    if (++safety > 1000) throw new Error('template: too many block iterations');
    out = out.replace(blockRe, (_m, kind, varName, body) => {
      const val = getPath(context, varName);
      if (kind === 'if') return truthy(val) ? render(body, context) : '';
      if (kind === 'unless') return !truthy(val) ? render(body, context) : '';
      if (kind === 'each') {
        if (!Array.isArray(val)) return '';
        return val
          .map((item) => {
            const childCtx = { ...context, __this__: item };
            return render(body, childCtx);
          })
          .join('');
      }
      return '';
    });
  }

  // Simple {{var}} substitution.
  out = out.replace(/\{\{\s*([^}\s][^}]*?)\s*\}\}/g, (_m, expr) => {
    const v = getPath(context, expr);
    return v === undefined || v === null ? '' : String(v);
  });

  return out;
}

// Top-level entry: copy template tree into target, substituting variables.
export async function scaffold({ templateDir, targetDir, answers }) {
  const ctx = buildContext(answers);
  copyTree(templateDir, targetDir, (text) => render(text, ctx));
}

// Map the flat prompt-answer object into a richer nested context.
export function buildContext(a) {
  const slug = a.projectName;
  const nameForPackage = slug.startsWith('@')
    ? slug
    : slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  return {
    projectName: slug,
    packageName: nameForPackage,
    brand: {
      name: a.brandName,
      primary: a.brandPrimary,
      accent: a.brandAccent,
    },
    knowledge: {
      scope: a.knowledgeScope,
      geography: a.geography,
    },
    ai: {
      model: a.aiModel,
      persona: `a domain expert for ${a.brandName}`,
    },
    auth: {
      mode: a.auth,
      enabled: a.auth !== 'none',
    },
    license: a.license,
    calculators: a.calculators || [],
    hasCalculators: (a.calculators || []).length > 0,
    year: new Date().getUTCFullYear(),
  };
}
