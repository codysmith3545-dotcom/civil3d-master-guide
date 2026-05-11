// Unit tests for scripts/audit-frontmatter.mjs
// Run with: node --test scripts/__tests__/audit-frontmatter.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { auditFile } from '../audit-frontmatter.mjs';

async function makeTempFile(name, content) {
  const dir = await mkdtemp(join(tmpdir(), 'audit-fm-'));
  // Mirror the content/<section> layout because the auditor derives expected
  // section from the path relative to content/. We simulate `<tmp>/content/<...>`.
  const contentDir = join(dir, 'content');
  await mkdir(contentDir, { recursive: true });
  const abs = join(contentDir, name);
  await mkdir(join(abs, '..'), { recursive: true });
  await writeFile(abs, content, 'utf8');
  return { dir, abs };
}

// NOTE: auditFile derives `expectedSection` from `relative(CONTENT_DIR, abs)`
// where CONTENT_DIR is the *repo's* content/ folder. Tests therefore use file
// paths under the repo's content/ directory by writing temp fixtures into a
// sub-folder of the repo content/ tree is overkill. We instead pass file names
// inside a temp tree but also accept that SECTION_MISMATCH will fire for the
// fixtures — we explicitly tolerate / assert that where relevant.

function findRule(audit, rule) {
  return audit.errors.find((e) => e.rule === rule) || audit.warnings.find((w) => w.rule === rule);
}

test('well-formed file has no required-field errors', async () => {
  const fm = [
    '---',
    'title: "Test"',
    'section: ""',
    'tags: [foo, bar-baz]',
    'updated: 2026-05-11',
    'visibility: public',
    'order: 10',
    '---',
    '',
    '> **TL;DR**',
    '> 1. Hello.',
    '',
  ].join('\n');
  const { dir, abs } = await makeTempFile('top.md', fm);
  const audit = await auditFile(abs);
  // No MISSING_REQUIRED, BAD_TAG, BAD_DATE_FORMAT, MISSING_TLDR
  assert.equal(findRule(audit, 'MISSING_REQUIRED'), undefined);
  assert.equal(findRule(audit, 'BAD_TAG'), undefined);
  assert.equal(findRule(audit, 'BAD_DATE_FORMAT'), undefined);
  assert.equal(findRule(audit, 'MISSING_TLDR'), undefined);
  assert.equal(findRule(audit, 'MISSING_FRONTMATTER'), undefined);
  await rm(dir, { recursive: true, force: true });
});

test('missing title produces MISSING_REQUIRED error', async () => {
  const fm = [
    '---',
    'section: ""',
    'tags: [foo]',
    'updated: 2026-05-11',
    '---',
    '',
    '> **TL;DR**',
    '> 1. Hello.',
  ].join('\n');
  const { dir, abs } = await makeTempFile('no-title.md', fm);
  const audit = await auditFile(abs);
  const err = audit.errors.find((e) => e.rule === 'MISSING_REQUIRED' && /title/.test(e.detail));
  assert.ok(err, 'expected MISSING_REQUIRED for title');
  await rm(dir, { recursive: true, force: true });
});

test('uppercase tag produces BAD_TAG error', async () => {
  const fm = [
    '---',
    'title: "T"',
    'section: ""',
    'tags: [FooBar, ok-one]',
    'updated: 2026-05-11',
    '---',
    '',
    '> **TL;DR**',
    '> 1. Hello.',
  ].join('\n');
  const { dir, abs } = await makeTempFile('bad-tag.md', fm);
  const audit = await auditFile(abs);
  const err = audit.errors.find((e) => e.rule === 'BAD_TAG' && /FooBar/.test(e.detail));
  assert.ok(err, 'expected BAD_TAG for FooBar');
  await rm(dir, { recursive: true, force: true });
});

test('US date format produces BAD_DATE_FORMAT error', async () => {
  const fm = [
    '---',
    'title: "T"',
    'section: ""',
    'tags: [ok]',
    'updated: "05/11/2026"',
    '---',
    '',
    '> **TL;DR**',
    '> 1. Hi.',
  ].join('\n');
  const { dir, abs } = await makeTempFile('us-date.md', fm);
  const audit = await auditFile(abs);
  const err = audit.errors.find((e) => e.rule === 'BAD_DATE_FORMAT');
  assert.ok(err, 'expected BAD_DATE_FORMAT');
  await rm(dir, { recursive: true, force: true });
});

test('missing TL;DR produces MISSING_TLDR error', async () => {
  const fm = [
    '---',
    'title: "T"',
    'section: ""',
    'tags: [ok]',
    'updated: 2026-05-11',
    '---',
    '',
    '## Heading',
    '',
    'Body text.',
  ].join('\n');
  const { dir, abs } = await makeTempFile('no-tldr.md', fm);
  const audit = await auditFile(abs);
  const err = audit.errors.find((e) => e.rule === 'MISSING_TLDR' || e.rule === 'TLDR_NOT_FIRST');
  assert.ok(err, 'expected MISSING_TLDR');
  await rm(dir, { recursive: true, force: true });
});

test('missing frontmatter produces MISSING_FRONTMATTER error', async () => {
  const body = '# No frontmatter here\n\nJust text.';
  const { dir, abs } = await makeTempFile('no-fm.md', body);
  const audit = await auditFile(abs);
  const err = audit.errors.find((e) => e.rule === 'MISSING_FRONTMATTER');
  assert.ok(err, 'expected MISSING_FRONTMATTER');
  await rm(dir, { recursive: true, force: true });
});
