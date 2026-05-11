#!/usr/bin/env node
// Lints every markdown file under content/.
// Checks:
//   - frontmatter parses
//   - required fields: title, section, order, visibility, updated
//   - visibility in {public, invite}
//   - updated parses as ISO date
//   - body has '> **TL;DR**' within first 50 lines
//   - no emoji or other out-of-range characters in body
//   - jurisdiction pages: optional typed fields (submittal_checklist, setbacks,
//     stormwater_thresholds, recording_requirements, plat_requirements) validate
//     against the schema in `packages/content/src/index.ts`. Missing typed fields
//     emit a WARNING (not an error) on jurisdiction index pages.
//
// Exits non-zero if any file fails (warnings do not fail the build).

import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative, join, sep } from 'node:path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const CONTENT_DIR = resolve(ROOT, 'content');

const REQUIRED_FIELDS = ['title', 'section', 'order', 'visibility', 'updated'];
const ALLOWED_VISIBILITY = new Set(['public', 'invite']);

// Keep this in sync with JURISDICTION_TYPED_FIELDS in packages/content/src/index.ts.
const JURISDICTION_TYPED_FIELDS = [
  'submittal_checklist',
  'setbacks',
  'stormwater_thresholds',
  'recording_requirements',
  'plat_requirements',
];
const ALLOWED_PAPER_SIZES = new Set(['8.5x11', '8.5x14', '11x17', '18x24', '24x36']);
const ALLOWED_INK_COLORS = new Set(['black', 'blue', 'black-or-blue']);
const ALLOWED_CHECKLIST_CATEGORIES = new Set(['submittal', 'drafting', 'recording', 'review']);

// Allowed character ranges (covers ASCII + Latin-1/Latin-Extended-A/B + IPA + common
// typographic punctuation/spaces, math/currency we actually use, plus arrows).
// Anything outside these ranges (including emoji, dingbats, CJK, etc.) is rejected,
// with the exception of the explicit allowlist (★).
const CODEPOINT_ALLOWLIST = new Set([0x2605]); // ★

function isAllowedChar(cp) {
  if (CODEPOINT_ALLOWLIST.has(cp)) return true;
  // C0 controls: allow tab, LF, CR. Others not allowed.
  if (cp === 0x09 || cp === 0x0a || cp === 0x0d) return true;
  if (cp < 0x20) return false;
  // Basic Latin + Latin-1 Supplement + Latin Extended-A + Latin Extended-B + IPA + Spacing modifiers + Combining diacritics + Greek + Cyrillic
  if (cp >= 0x20 && cp <= 0x04ff) return true;
  // General punctuation block (en/em dashes, smart quotes, ellipsis, etc.)
  if (cp >= 0x2000 && cp <= 0x206f) return true;
  // Superscripts and subscripts
  if (cp >= 0x2070 && cp <= 0x209f) return true;
  // Currency symbols
  if (cp >= 0x20a0 && cp <= 0x20cf) return true;
  // Letterlike symbols (a few are useful: №, ™, ℃, ℉, etc.)
  if (cp >= 0x2100 && cp <= 0x214f) return true;
  // Number forms (½, ¼, etc. mostly live in Latin-1 but a few here)
  if (cp >= 0x2150 && cp <= 0x218f) return true;
  // Arrows
  if (cp >= 0x2190 && cp <= 0x21ff) return true;
  // Mathematical operators (×, ÷ are in Latin-1; ≤, ≥, ≈ here)
  if (cp >= 0x2200 && cp <= 0x22ff) return true;
  // Geometric shapes etc are 0x25xx -> mostly disallow, but we already allowlisted ★ above.
  // Box drawing (sometimes used in ASCII tables)
  if (cp >= 0x2500 && cp <= 0x257f) return true;
  return false;
}

function findOffendingChars(text) {
  const offenders = new Map();
  let i = 0;
  while (i < text.length) {
    const cp = text.codePointAt(i);
    if (!isAllowedChar(cp)) {
      const ch = String.fromCodePoint(cp);
      offenders.set(cp, (offenders.get(cp) || 0) + 1);
      // also note the line number of the first occurrence?
    }
    i += cp > 0xffff ? 2 : 1;
  }
  return offenders;
}

function isValidIsoDate(value) {
  if (value instanceof Date) return !isNaN(value.getTime());
  if (typeof value !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

function isPlainObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function validateJurisdictionTypedFields(fm, errors, warnings) {
  // submittal_checklist
  if (fm.submittal_checklist !== undefined && fm.submittal_checklist !== null) {
    if (!Array.isArray(fm.submittal_checklist)) {
      errors.push('submittal_checklist must be an array');
    } else {
      fm.submittal_checklist.forEach((item, i) => {
        if (!isPlainObject(item)) {
          errors.push(`submittal_checklist[${i}] must be an object`);
          return;
        }
        if (typeof item.id !== 'string' || !item.id) errors.push(`submittal_checklist[${i}].id required`);
        if (typeof item.label !== 'string' || !item.label) errors.push(`submittal_checklist[${i}].label required`);
        if (!ALLOWED_CHECKLIST_CATEGORIES.has(item.category)) {
          errors.push(`submittal_checklist[${i}].category invalid: ${item.category}`);
        }
      });
    }
  }
  // setbacks
  if (fm.setbacks !== undefined && fm.setbacks !== null) {
    if (!isPlainObject(fm.setbacks)) {
      errors.push('setbacks must be an object');
    } else {
      for (const sub of ['residential', 'commercial', 'agricultural']) {
        if (fm.setbacks[sub] !== undefined && fm.setbacks[sub] !== null && !isPlainObject(fm.setbacks[sub])) {
          errors.push(`setbacks.${sub} must be an object`);
        }
      }
    }
  }
  // stormwater_thresholds
  if (fm.stormwater_thresholds !== undefined && fm.stormwater_thresholds !== null) {
    if (!isPlainObject(fm.stormwater_thresholds)) {
      errors.push('stormwater_thresholds must be an object');
    } else {
      for (const k of ['detention_trigger_sqft', 'water_quality_trigger_sqft', 'bmp_required_above_sqft']) {
        const v = fm.stormwater_thresholds[k];
        if (v !== undefined && v !== null && typeof v !== 'number') {
          errors.push(`stormwater_thresholds.${k} must be a number or null`);
        }
      }
    }
  }
  // recording_requirements
  if (fm.recording_requirements !== undefined && fm.recording_requirements !== null) {
    if (!isPlainObject(fm.recording_requirements)) {
      errors.push('recording_requirements must be an object');
    } else {
      const r = fm.recording_requirements;
      if (r.paper_size !== undefined && r.paper_size !== null && !ALLOWED_PAPER_SIZES.has(r.paper_size)) {
        errors.push(`recording_requirements.paper_size invalid: ${r.paper_size}`);
      }
      if (r.ink_color !== undefined && r.ink_color !== null && !ALLOWED_INK_COLORS.has(r.ink_color)) {
        errors.push(`recording_requirements.ink_color invalid: ${r.ink_color}`);
      }
    }
  }
  // plat_requirements
  if (fm.plat_requirements !== undefined && fm.plat_requirements !== null) {
    if (!Array.isArray(fm.plat_requirements)) {
      errors.push('plat_requirements must be an array');
    } else {
      fm.plat_requirements.forEach((item, i) => {
        if (!isPlainObject(item)) {
          errors.push(`plat_requirements[${i}] must be an object`);
          return;
        }
        if (typeof item.item !== 'string' || !item.item) errors.push(`plat_requirements[${i}].item required`);
        if (typeof item.required !== 'boolean') errors.push(`plat_requirements[${i}].required must be boolean`);
      });
    }
  }
}

function isJurisdictionIndex(rel, fm) {
  // Only warn on jurisdiction "index" pages (county or municipality index.md), not on
  // every page within the jurisdiction tree.
  if (!rel.startsWith('content/jurisdictions/')) return false;
  if (!rel.endsWith('/index.md')) return false;
  // Skip the top-level jurisdictions/index.md and state/index.md.
  const depth = rel.split('/').length;
  // content/jurisdictions/indiana/<county>/index.md  -> depth 5
  // content/jurisdictions/indiana/<county>/municipalities/<m>/index.md -> depth 7
  if (depth !== 5 && depth !== 7) return false;
  return true;
}

async function lintFile(abs) {
  const errors = [];
  const warnings = [];
  const raw = await readFile(abs, 'utf8');

  let parsed;
  try {
    parsed = matter(raw);
  } catch (err) {
    errors.push(`frontmatter parse error: ${err.message}`);
    return { errors, warnings };
  }

  const fm = parsed.data || {};
  // Required: key must be present with a defined, non-null value. An empty string is
  // tolerated for `section` (used for top-level pages like 00-index.md and glossary.md).
  for (const f of REQUIRED_FIELDS) {
    const v = fm[f];
    if (v === undefined || v === null) {
      errors.push(`missing required frontmatter field: ${f}`);
      continue;
    }
    if (v === '' && f !== 'section') {
      errors.push(`required frontmatter field is empty: ${f}`);
    }
  }

  if (fm.visibility !== undefined && !ALLOWED_VISIBILITY.has(fm.visibility)) {
    errors.push(`invalid visibility: ${fm.visibility} (must be 'public' or 'invite')`);
  }

  if (fm.updated !== undefined && !isValidIsoDate(fm.updated)) {
    errors.push(`updated is not an ISO date: ${fm.updated}`);
  }

  if (typeof fm.order !== 'number') {
    if (fm.order !== undefined) {
      errors.push(`order must be a number, got ${typeof fm.order}: ${fm.order}`);
    }
  }

  // TL;DR check within the first 50 lines of the body (post-frontmatter content).
  const body = parsed.content || '';
  const first50 = body.split('\n').slice(0, 50);
  const tldrRegex = /^>\s*\*\*TL;DR\*\*/;
  if (!first50.some((ln) => tldrRegex.test(ln))) {
    errors.push(`missing '> **TL;DR**' blockquote within first 50 lines of body`);
  }

  // Emoji / out-of-range character check on body
  const offenders = findOffendingChars(body);
  if (offenders.size) {
    const sample = [...offenders.entries()]
      .slice(0, 5)
      .map(([cp, count]) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')} (${String.fromCodePoint(cp)}) x${count}`)
      .join(', ');
    errors.push(`disallowed characters in body: ${sample}`);
  }

  // Typed jurisdiction frontmatter validation (errors for malformed values,
  // warnings for jurisdiction index pages missing the new fields).
  validateJurisdictionTypedFields(fm, errors, warnings);
  const rel = relative(ROOT, abs).split(sep).join('/');
  if (isJurisdictionIndex(rel, fm)) {
    for (const f of JURISDICTION_TYPED_FIELDS) {
      if (fm[f] === undefined) {
        warnings.push(`jurisdiction index page missing typed field: ${f}`);
      }
    }
  }

  return { errors, warnings };
}

async function main() {
  const files = (await walk(CONTENT_DIR)).sort();
  let pass = 0;
  let fail = 0;
  let warnCount = 0;
  const failures = [];

  for (const abs of files) {
    const { errors, warnings } = await lintFile(abs);
    const rel = relative(ROOT, abs).split(sep).join('/');
    if (errors.length === 0) {
      if (warnings.length > 0) {
        console.log(`PASS  ${rel}  (${warnings.length} warning(s))`);
        for (const w of warnings) console.log(`        ! ${w}`);
        warnCount += warnings.length;
      } else {
        console.log(`PASS  ${rel}`);
      }
      pass++;
    } else {
      console.log(`FAIL  ${rel}`);
      for (const e of errors) console.log(`        - ${e}`);
      for (const w of warnings) console.log(`        ! ${w}`);
      warnCount += warnings.length;
      fail++;
      failures.push({ rel, errors });
    }
  }

  console.log('');
  console.log(`Summary: ${pass} passed, ${fail} failed, ${warnCount} warning(s) (out of ${files.length})`);

  if (fail > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
