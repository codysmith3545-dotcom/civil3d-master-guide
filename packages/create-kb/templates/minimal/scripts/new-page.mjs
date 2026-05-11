#!/usr/bin/env node
// Create a new content page with frontmatter. Usage: node scripts/new-page.mjs <relative-path>

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const rel = process.argv[2];
if (!rel) {
  console.error('Usage: node scripts/new-page.mjs <content-relative-path>');
  process.exit(1);
}
const path = resolve('content', rel + (rel.endsWith('.md') ? '' : '.md'));
if (existsSync(path)) {
  console.error(`Refusing to overwrite ${path}`);
  process.exit(2);
}
mkdirSync(dirname(path), { recursive: true });
const title = rel.split('/').pop();
const body = `---
title: "${title}"
section: ${rel.split('/')[0]}
tags: []
sources: []
---

> TL;DR — replace this paragraph.

## Body

`;
writeFileSync(path, body);
console.log('Created', path);
