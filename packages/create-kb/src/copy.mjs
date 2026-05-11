// Recursive copy + filesystem helpers. Pure node:fs.

import { readdirSync, statSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

// Files whose contents we treat as text (and run substitution on).
// Anything outside this set is copied as a binary buffer untouched.
const TEXT_EXTENSIONS = new Set([
  '.md', '.mdx', '.txt', '.json', '.yaml', '.yml', '.toml',
  '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx',
  '.css', '.scss', '.html', '.svg', '.gitignore', '.env',
]);

function isTextFile(name) {
  const lower = name.toLowerCase();
  if (lower === '.gitignore' || lower === '.env' || lower === '.env.example') return true;
  for (const ext of TEXT_EXTENSIONS) {
    if (lower.endsWith(ext)) return true;
  }
  return false;
}

export function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

// Walk `srcDir` and call cb(absolutePath, relativePath, isDirectory).
export function walk(srcDir, cb, _base = srcDir) {
  for (const entry of readdirSync(srcDir)) {
    const abs = join(srcDir, entry);
    const rel = relative(_base, abs);
    const stat = statSync(abs);
    if (stat.isDirectory()) {
      cb(abs, rel, true);
      walk(abs, cb, _base);
    } else {
      cb(abs, rel, false);
    }
  }
}

export function copyTree(srcRoot, dstRoot, transformText) {
  ensureDir(dstRoot);
  walk(srcRoot, (abs, rel, isDir) => {
    // Normalize special filename: ".gitignore.tmpl" -> ".gitignore"
    // (npm strips leading-dot files on publish in some setups, so templates
    // ship with a .tmpl suffix and we rename on materialization.)
    const outRelRaw = rel;
    const outRel = outRelRaw.replace(/\.tmpl$/, '');
    const dst = join(dstRoot, outRel);
    if (isDir) {
      ensureDir(dst);
      return;
    }
    ensureDir(join(dst, '..'));
    if (isTextFile(abs) && typeof transformText === 'function') {
      const content = readFileSync(abs, 'utf8');
      writeFileSync(dst, transformText(content, outRel));
    } else {
      // Binary copy
      writeFileSync(dst, readFileSync(abs));
    }
  });
}

export function fileExists(p) {
  return existsSync(p);
}
