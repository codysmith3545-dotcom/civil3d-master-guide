// Unit tests for the scaffolder. Run with: node --test tests/scaffold.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { scaffold, buildContext, render } from '../src/scaffold.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const PKG_ROOT = resolve(HERE, '..');
const TEMPLATE_ROOT = join(PKG_ROOT, 'templates', 'minimal');

function defaultsFor(name) {
  return {
    projectName: name,
    brandName: 'My Domain Guide',
    brandPrimary: '#0f3d2e',
    brandAccent: '#c89b3c',
    knowledgeScope: 'A reference knowledge base for testing.',
    geography: 'US',
    calculators: [],
    aiModel: 'claude-opus-4-7',
    auth: 'none',
    license: 'MIT',
  };
}

function mkTmp() {
  return mkdtempSync(join(tmpdir(), 'create-kb-test-'));
}

test('render: simple substitution', () => {
  const out = render('Hello {{name}}!', { name: 'world' });
  assert.equal(out, 'Hello world!');
});

test('render: dot-path substitution', () => {
  const out = render('{{a.b.c}}', { a: { b: { c: 'deep' } } });
  assert.equal(out, 'deep');
});

test('render: #if truthy', () => {
  const out = render('{{#if x}}YES{{/if}}', { x: true });
  assert.equal(out, 'YES');
});

test('render: #if falsy', () => {
  const out = render('{{#if x}}YES{{/if}}', { x: false });
  assert.equal(out, '');
});

test('render: #unless falsy', () => {
  const out = render('{{#unless x}}NO{{/unless}}', { x: false });
  assert.equal(out, 'NO');
});

test('render: #each over object array', () => {
  const out = render(
    '{{#each items}}- {{this.name}}\n{{/each}}',
    { items: [{ name: 'a' }, { name: 'b' }] }
  );
  assert.equal(out, '- a\n- b\n');
});

test('scaffold: all-defaults answers produce a viable tree', async () => {
  const tmp = mkTmp();
  try {
    const target = join(tmp, 'demo-guide');
    const answers = defaultsFor('demo-guide');
    await scaffold({ templateDir: TEMPLATE_ROOT, targetDir: target, answers });

    // Required directories exist.
    for (const d of ['content', 'mcp-server', 'web', 'packages', 'scripts']) {
      assert.ok(existsSync(join(target, d)), `missing directory: ${d}`);
    }

    // config.yaml parses (basic shape check — we don't depend on a yaml lib).
    const configRaw = readFileSync(join(target, 'config.yaml'), 'utf8');
    assert.match(configRaw, /^brand:/m);
    assert.match(configRaw, /name: "My Domain Guide"/);
    assert.match(configRaw, /primary_color: "#0f3d2e"/);
    assert.doesNotMatch(configRaw, /\{\{/, 'unsubstituted handlebars remain in config.yaml');

    // prompts/system.md substituted variables.
    const sys = readFileSync(join(target, 'prompts', 'system.md'), 'utf8');
    assert.match(sys, /My Domain Guide/);
    assert.doesNotMatch(sys, /\{\{/, 'unsubstituted handlebars remain in prompts/system.md');

    // package.json name matches the project name.
    const pkg = JSON.parse(readFileSync(join(target, 'package.json'), 'utf8'));
    assert.equal(pkg.name, 'demo-guide');
    assert.equal(pkg.license, 'MIT');

    // .gitignore rename (.gitignore.tmpl -> .gitignore) happened.
    assert.ok(existsSync(join(target, '.gitignore')), 'missing .gitignore');
    assert.ok(!existsSync(join(target, '.gitignore.tmpl')), '.gitignore.tmpl should have been renamed');
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('scaffold: calculators are rendered when selected', async () => {
  const tmp = mkTmp();
  try {
    const target = join(tmp, 'with-calcs');
    const answers = {
      ...defaultsFor('with-calcs'),
      calculators: [
        { slug: 'vertical-curve', name: 'Vertical Curve', category: 'engineering' },
        { slug: 'inverse', name: 'Inverse', category: 'survey' },
      ],
    };
    await scaffold({ templateDir: TEMPLATE_ROOT, targetDir: target, answers });

    const cfg = readFileSync(join(target, 'config.yaml'), 'utf8');
    assert.match(cfg, /slug: "vertical-curve"/);
    assert.match(cfg, /slug: "inverse"/);

    const sys = readFileSync(join(target, 'prompts', 'system.md'), 'utf8');
    assert.match(sys, /Vertical Curve/);
    assert.match(sys, /Inverse/);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('buildContext: derives packageName + hasCalculators', () => {
  const ctx = buildContext({
    projectName: 'ArcGIS Pro Guide',
    brandName: 'ArcGIS Pro Guide',
    brandPrimary: '#000',
    brandAccent: '#fff',
    knowledgeScope: 'test',
    geography: 'US',
    calculators: [{ slug: 'x', name: 'X', category: 'y' }],
    aiModel: 'claude-opus-4-7',
    auth: 'open',
    license: 'MIT',
  });
  assert.equal(ctx.packageName, 'arcgis-pro-guide');
  assert.equal(ctx.hasCalculators, true);
  assert.equal(ctx.auth.enabled, true);
});
