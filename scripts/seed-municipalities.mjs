#!/usr/bin/env node
// Seeds compact municipality stub pages under content/jurisdictions/indiana/<county>/municipalities/<muni>/index.md
// Idempotent: skips files that already exist.

import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..', 'content', 'jurisdictions', 'indiana');

// [county slug, municipality slug, display name, url, optional notes]
const MUNICIPALITIES = [
  // Marion (already seeded: indianapolis, beech-grove, lawrence)
  ['marion-county', 'southport', 'Southport', 'https://www.southportindiana.org/', 'Excluded city, southwest Marion County.'],
  ['marion-county', 'speedway', 'Speedway', 'https://speedwayin.gov/', 'Excluded town, home of Indianapolis Motor Speedway.'],

  // Hamilton
  ['hamilton-county', 'carmel', 'Carmel', 'https://www.carmel.in.gov/', 'Large city; own engineering and stormwater technical standards.'],
  ['hamilton-county', 'fishers', 'Fishers', 'https://www.fishers.in.us/', 'City since 2015; own engineering review.'],
  ['hamilton-county', 'noblesville', 'Noblesville', 'https://www.cityofnoblesville.org/', 'Hamilton County seat; own engineering and stormwater standards.'],
  ['hamilton-county', 'westfield', 'Westfield', 'https://www.westfield.in.gov/', 'Fast-growing city; own standards.'],
  ['hamilton-county', 'cicero', 'Cicero', 'https://townofcicero.in.gov/', 'Town in northern Hamilton County.'],
  ['hamilton-county', 'sheridan', 'Sheridan', 'https://townofsheridanin.gov/', 'Town in northwest Hamilton County.'],
  ['hamilton-county', 'arcadia', 'Arcadia', 'https://townofarcadia.in.gov/', 'Small town in northern Hamilton County.'],
  ['hamilton-county', 'atlanta', 'Atlanta', 'https://atlantaindiana.us/', 'Small town in northern Hamilton County.'],

  // Hancock
  ['hancock-county', 'greenfield', 'Greenfield', 'https://greenfieldin.org/', 'Hancock County seat.'],
  ['hancock-county', 'fortville', 'Fortville', 'https://fortville.in.gov/', 'Town on the Hancock/Hamilton border.'],
  ['hancock-county', 'mccordsville', 'McCordsville', 'https://mccordsville.org/', 'Fast-growing town.'],
  ['hancock-county', 'new-palestine', 'New Palestine', 'https://newpalestine.org/', 'Town in southern Hancock County.'],
  ['hancock-county', 'cumberland', 'Cumberland', 'https://www.town.cumberland.in.us/', 'Straddles Marion/Hancock county line.'],
  ['hancock-county', 'wilkinson', 'Wilkinson', '', 'Small town in northeast Hancock County. Verify official site.'],
  ['hancock-county', 'shirley', 'Shirley', '', 'Small town partially in Henry County. Verify official site.'],

  // Shelby
  ['shelby-county', 'shelbyville', 'Shelbyville', 'https://www.cityofshelbyvillein.com/', 'Shelby County seat.'],
  ['shelby-county', 'morristown', 'Morristown', 'https://townofmorristownin.gov/', 'Town in western Shelby County.'],
  ['shelby-county', 'fairland', 'Fairland', '', 'Unincorporated CDP in some references; verify governance.'],
  ['shelby-county', 'st-paul', 'St. Paul', '', 'Straddles Decatur/Shelby. Verify official site.'],
  ['shelby-county', 'edinburgh', 'Edinburgh', 'https://www.edinburgh.in.us/', 'Straddles Bartholomew, Johnson, and Shelby counties.'],

  // Johnson
  ['johnson-county', 'franklin', 'Franklin', 'https://www.franklin.in.gov/', 'Johnson County seat.'],
  ['johnson-county', 'greenwood', 'Greenwood', 'https://www.greenwood.in.gov/', 'Largest city in Johnson County; own engineering and stormwater standards.'],
  ['johnson-county', 'whiteland', 'Whiteland', 'https://www.whiteland.in.gov/', 'Town along I-65 corridor.'],
  ['johnson-county', 'bargersville', 'Bargersville', 'https://www.bargersville.org/', 'Town in western Johnson County.'],
  ['johnson-county', 'new-whiteland', 'New Whiteland', 'https://townofnewwhiteland.com/', 'Town on US-31.'],
  ['johnson-county', 'trafalgar', 'Trafalgar', 'https://www.trafalgarindiana.com/', 'Town in southern Johnson County.'],
  ['johnson-county', 'princes-lakes', 'Princes Lakes', '', 'Town in southern Johnson County. Verify official site.'],

  // Morgan
  ['morgan-county', 'martinsville', 'Martinsville', 'https://www.martinsville.in.gov/', 'Morgan County seat.'],
  ['morgan-county', 'mooresville', 'Mooresville', 'https://www.mooresville.in.gov/', 'Straddles Hendricks/Morgan; largest town in Morgan County.'],
  ['morgan-county', 'brooklyn', 'Brooklyn', '', 'Small town in northeast Morgan County. Verify official site.'],
  ['morgan-county', 'monrovia', 'Monrovia', '', 'Small town in northern Morgan County. Verify official site.'],
  ['morgan-county', 'paragon', 'Paragon', '', 'Small town in western Morgan County. Verify official site.'],
  ['morgan-county', 'morgantown', 'Morgantown', '', 'Straddles Brown/Morgan counties. Verify official site.'],

  // Hendricks
  ['hendricks-county', 'danville', 'Danville', 'https://www.danvillein.org/', 'Hendricks County seat.'],
  ['hendricks-county', 'plainfield', 'Plainfield', 'https://www.townofplainfield.com/', 'Major logistics/industrial; own standards.'],
  ['hendricks-county', 'avon', 'Avon', 'https://www.avongov.org/', 'Town with own engineering review.'],
  ['hendricks-county', 'brownsburg', 'Brownsburg', 'https://www.brownsburg.org/', 'Town with own engineering review.'],
  ['hendricks-county', 'pittsboro', 'Pittsboro', 'https://www.townofpittsboro.org/', 'Town in central Hendricks County.'],
  ['hendricks-county', 'lizton', 'Lizton', '', 'Small town in northern Hendricks County. Verify official site.'],
  ['hendricks-county', 'stilesville', 'Stilesville', '', 'Small town in southwest Hendricks County. Verify official site.'],
  ['hendricks-county', 'coatesville', 'Coatesville', '', 'Small town in western Hendricks County. Verify official site.'],
  ['hendricks-county', 'north-salem', 'North Salem', '', 'Small town in northwest Hendricks County. Verify official site.'],
  ['hendricks-county', 'clayton', 'Clayton', '', 'Small town in western Hendricks County. Verify official site.'],
  ['hendricks-county', 'amo', 'Amo', '', 'Small town in southwest Hendricks County. Verify official site.'],

  // Boone
  ['boone-county', 'lebanon', 'Lebanon', 'https://www.lebanon.in.gov/', 'Boone County seat.'],
  ['boone-county', 'zionsville', 'Zionsville', 'https://www.zionsville-in.gov/', 'Reorganized town; own engineering standards.'],
  ['boone-county', 'whitestown', 'Whitestown', 'https://www.whitestown.in.gov/', 'Fast-growing logistics/industrial.'],
  ['boone-county', 'thorntown', 'Thorntown', 'https://thorntownindiana.gov/', 'Town in northwest Boone County.'],
  ['boone-county', 'advance', 'Advance', '', 'Small town in western Boone County. Verify official site.'],
  ['boone-county', 'jamestown', 'Jamestown', '', 'Small town in southwest Boone County. Verify official site.'],
  ['boone-county', 'ulen', 'Ulen', '', 'Small town near Lebanon. Verify official site.'],
];

const TODAY = new Date().toISOString().slice(0, 10);

const exists = async (p) => {
  try { await access(p); return true; } catch { return false; }
};

const titleize = (slug) =>
  slug.split('-').map((w) => w === 'st' ? 'St.' : w[0].toUpperCase() + w.slice(1)).join(' ');

const renderMuniPage = ({ county, slug, name, url, notes }) => {
  const sourcesBlock = url
    ? `sources:\n  - title: "${name}"\n    url: "${url}"\n    verified: ${TODAY}\n`
    : '';
  const tldr = url
    ? `> **TL;DR**\n> 1. ${notes || `Municipality in ${titleize(county.replace('-county',''))} County, Indiana.`}\n> 2. Visit the official site for current ordinances, design standards, and submittal requirements: ${url}\n> 3. Page is a stub; expand with engineering contact, adopted standards manual, plan-review checklist.\n`
    : `> **TL;DR**\n> 1. ${notes || `Municipality in ${titleize(county.replace('-county',''))} County, Indiana.`}\n> 2. Official website not yet verified — confirm before relying.\n> 3. Page is a stub; expand with engineering contact, adopted standards manual, plan-review checklist.\n`;
  const officialLink = url
    ? `- **Official site** — ${url}\n`
    : `- Official site to be verified.\n`;
  return `---
title: "${name}"
section: "jurisdictions/indiana/${county}/municipalities/${slug}"
order: 100
visibility: public
tags: [indiana, ${county.replace('-county','-county')}, ${slug}]
updated: ${TODAY}
${sourcesBlock}---

${tldr}
## Authorities

${officialLink}- ${titleize(county.replace('-county',''))} County government — see [county page](../../index.md).

## Codes & standards

- Code of ordinances (verify current link via Municode or American Legal).
- Adopted stormwater / drainage / subdivision standards (verify currently adopted edition).

## Related

- [${titleize(county.replace('-county',''))} County](../../index.md)
- [State of Indiana](../../../state/index.md)
`;
};

let created = 0;
let skipped = 0;

for (const [county, slug, name, url, notes] of MUNICIPALITIES) {
  const dir = resolve(ROOT, county, 'municipalities', slug);
  const file = resolve(dir, 'index.md');
  if (await exists(file)) {
    skipped++;
    continue;
  }
  await mkdir(dir, { recursive: true });
  await writeFile(file, renderMuniPage({ county, slug, name, url, notes }));
  created++;
}

console.log(`Created ${created} municipality stubs; skipped ${skipped} existing.`);
