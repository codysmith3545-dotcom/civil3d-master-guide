#!/usr/bin/env node
// Build offline-cacheable JSON for the covered Indiana counties (+state).
// Walks content/jurisdictions/indiana/**/index.md, extracts typed rules
// (setbacks, stormwater_thresholds, recording_requirements, plat_requirements,
// submittal_checklist) plus a county-centroid bbox, and emits
// web/public/offline-data/jurisdictions.json.
//
// The bounds are hard-coded county bounding boxes (US Census TIGER bbox
// approximations) because the source frontmatter does not yet carry geometry.
// They are good enough for "find county at GPS" lookups in the field; for
// parcel-level work the user must consult county GIS.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'content/jurisdictions/indiana');
const OUT_DIR = join(ROOT, 'web/public/offline-data');
const OUT_FILE = join(OUT_DIR, 'jurisdictions.json');

// County bounding boxes [west, south, east, north] approximated from US Census
// TIGER county shapefiles. Used for the GPS "what county am I in?" feature.
const COUNTY_BOUNDS = {
  'marion-county':    { west: -86.328, south: 39.633, east: -85.937, north: 39.927 },
  'hamilton-county':  { west: -86.323, south: 39.927, east: -85.917, north: 40.275 },
  'hendricks-county': { west: -86.696, south: 39.612, east: -86.328, north: 39.927 },
  'boone-county':     { west: -86.696, south: 39.927, east: -86.323, north: 40.279 },
  'hancock-county':   { west: -85.957, south: 39.633, east: -85.633, north: 39.927 },
  'shelby-county':    { west: -85.957, south: 39.382, east: -85.633, north: 39.665 },
  'johnson-county':   { west: -86.328, south: 39.382, east: -85.957, north: 39.665 },
  'morgan-county':    { west: -86.696, south: 39.382, east: -86.328, north: 39.665 },
  'madison-county':   { west: -85.957, south: 39.927, east: -85.633, north: 40.275 },
};

function listCountyIndexFiles(dir) {
  const out = [];
  const entries = readdirSync(dir);
  for (const e of entries) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) {
      const idx = join(p, 'index.md');
      try {
        statSync(idx);
        out.push({ slug: e, file: idx });
      } catch {
        // no index in this dir
      }
    }
  }
  return out;
}

function pick(obj, keys) {
  const out = {};
  for (const k of keys) if (obj && obj[k] !== undefined) out[k] = obj[k];
  return out;
}

function build() {
  const stateIdx = join(SRC, 'state/index.md');
  let stateFm = {};
  try {
    stateFm = matter(readFileSync(stateIdx, 'utf8')).data || {};
  } catch {}

  const all = listCountyIndexFiles(SRC).filter((e) => e.slug !== 'state');

  const counties = [];
  for (const { slug, file } of all) {
    const fm = matter(readFileSync(file, 'utf8')).data || {};
    const bounds = COUNTY_BOUNDS[slug] || null;

    counties.push({
      slug,
      title: fm.title || slug,
      section: fm.section || `jurisdictions/indiana/${slug}`,
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      bounds,
      rules: pick(fm, [
        'setbacks',
        'stormwater_thresholds',
        'recording_requirements',
        'plat_requirements',
        'submittal_checklist',
      ]),
    });
  }

  counties.sort((a, b) => a.slug.localeCompare(b.slug));

  const payload = {
    generatedAt: new Date().toISOString(),
    state: {
      slug: 'state',
      title: stateFm.title || 'State of Indiana',
      rules: pick(stateFm, [
        'recording_requirements',
        'plat_requirements',
        'submittal_checklist',
      ]),
    },
    counties,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + '\n');
  const bytes = readFileSync(OUT_FILE).length;
  console.log(`build-offline-data: wrote ${OUT_FILE} (${(bytes / 1024).toFixed(1)} KB, ${counties.length} counties)`);
}

build();
