#!/usr/bin/env node
// create-knowledge-base — fork the Civil 3D Master Guide framework
// into a new domain (e.g. "ArcGIS Pro Master Guide").
//
// Usage:
//   npx create-knowledge-base <project-name>
//   npx create-knowledge-base <project-name> --non-interactive
//   npx create-knowledge-base <project-name> --no-install --no-git
//
// All runtime is pure Node — no external dependencies.

import { existsSync, readdirSync } from 'node:fs';
import { resolve, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ask, confirm, multiSelect, select, closeRl } from '../src/prompts.mjs';
import { scaffold } from '../src/scaffold.mjs';
import { runGitInit } from '../src/git-init.mjs';
import { CALCULATORS, MODELS, AUTH_MODES, LICENSES } from '../src/defaults.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const PKG_ROOT = resolve(HERE, '..');
const TEMPLATE_ROOT = join(PKG_ROOT, 'templates', 'minimal');

function parseArgs(argv) {
  const args = { positional: [], flags: {} };
  for (const a of argv) {
    if (a.startsWith('--')) {
      const [k, v] = a.replace(/^--/, '').split('=');
      args.flags[k] = v === undefined ? true : v;
    } else {
      args.positional.push(a);
    }
  }
  return args;
}

function defaultsFor(name) {
  return {
    projectName: name,
    brandName: toTitleCase(name),
    brandPrimary: '#0f3d2e',
    brandAccent: '#c89b3c',
    knowledgeScope:
      'A reference knowledge base for a professional domain, with curated standards and workflows.',
    geography: 'US',
    calculators: [],
    aiModel: 'claude-opus-4-7',
    auth: 'none',
    license: 'MIT',
  };
}

function toTitleCase(s) {
  return s
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

function isHexColor(s) {
  return /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(String(s || '').trim());
}

function normalizeHex(s) {
  const t = String(s).trim();
  return t.startsWith('#') ? t : '#' + t;
}

async function interactivePrompts(defaults) {
  console.log('\ncreate-knowledge-base — interactive scaffolder');
  console.log('Press Enter to accept the [default].\n');

  const brandName = (await ask(`Brand name [${defaults.brandName}]: `)) || defaults.brandName;

  let primary = (await ask(`Primary color hex [${defaults.brandPrimary}]: `)) || defaults.brandPrimary;
  while (!isHexColor(primary)) {
    primary = (await ask(`  Invalid hex. Primary color hex [${defaults.brandPrimary}]: `)) || defaults.brandPrimary;
  }
  let accent = (await ask(`Accent color hex [${defaults.brandAccent}]: `)) || defaults.brandAccent;
  while (!isHexColor(accent)) {
    accent = (await ask(`  Invalid hex. Accent color hex [${defaults.brandAccent}]: `)) || defaults.brandAccent;
  }

  const scope =
    (await ask(`Knowledge scope (1 sentence) [${defaults.knowledgeScope}]: `)) ||
    defaults.knowledgeScope;
  const geography = (await ask(`Primary jurisdiction (country/region) [${defaults.geography}]: `)) || defaults.geography;

  const calcs = await multiSelect(
    'Calculators to include (comma-separated numbers, or blank for none):',
    CALCULATORS.map((c) => `${c.name} (${c.category})`)
  );
  const selectedCalcs = calcs.map((i) => CALCULATORS[i]);

  const model = await select('AI model preference:', MODELS, defaults.aiModel);
  const auth = await select('Auth mode:', AUTH_MODES, defaults.auth);
  const license = await select('License:', LICENSES, defaults.license);

  return {
    ...defaults,
    brandName,
    brandPrimary: normalizeHex(primary),
    brandAccent: normalizeHex(accent),
    knowledgeScope: scope,
    geography,
    calculators: selectedCalcs,
    aiModel: model,
    auth,
    license,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const positional = args.positional[0];
  const nonInteractive = !!args.flags['non-interactive'];
  const noInstall = !!args.flags['no-install'];
  const noGit = !!args.flags['no-git'];

  if (!positional) {
    console.error('Usage: create-knowledge-base <project-name> [--non-interactive] [--no-install] [--no-git]');
    process.exit(1);
  }

  const targetDir = resolve(process.cwd(), positional);
  const projectName = basename(targetDir);

  // Existing non-empty directory guard.
  if (existsSync(targetDir)) {
    const entries = readdirSync(targetDir).filter((n) => !n.startsWith('.'));
    if (entries.length > 0) {
      if (nonInteractive) {
        console.error(`Target ${targetDir} exists and is not empty. Aborting (non-interactive).`);
        process.exit(2);
      }
      const ok = await confirm(`Directory "${projectName}" exists and is not empty. Overwrite/merge? [y/N] `, false);
      if (!ok) {
        console.error('Aborted.');
        closeRl();
        process.exit(2);
      }
    }
  }

  const defaults = defaultsFor(projectName);

  let answers;
  if (nonInteractive) {
    answers = defaults;
  } else {
    answers = await interactivePrompts(defaults);
  }
  closeRl();

  console.log(`\nScaffolding ${projectName} -> ${targetDir}`);
  await scaffold({
    templateDir: TEMPLATE_ROOT,
    targetDir,
    answers,
  });

  // pnpm install
  if (!noInstall) {
    try {
      const { spawnSync } = await import('node:child_process');
      console.log('Installing dependencies (pnpm install)...');
      const r = spawnSync('pnpm', ['install'], { cwd: targetDir, stdio: 'inherit' });
      if (r.status !== 0) {
        console.warn('  pnpm install did not complete cleanly — run it manually later.');
      }
    } catch (e) {
      console.warn(`  Skipped pnpm install: ${e.message}`);
    }
  }

  // git init + first commit
  if (!noGit) {
    try {
      await runGitInit(targetDir, `Initial scaffold: ${answers.brandName}`);
    } catch (e) {
      console.warn(`  Skipped git init: ${e.message}`);
    }
  }

  console.log(`\nDone.

Next steps:
  cd ${positional}
  pnpm dev   # if your web/ workspace is wired

See README.md for the rest.`);
}

main().catch((err) => {
  console.error('create-knowledge-base failed:', err.stack || err.message);
  closeRl();
  process.exit(1);
});
