/**
 * Server-only jurisdiction loaders. Imports `lib/content` (which uses
 * `node:fs`), so this module must not be imported by client components.
 * Client components should import from `lib/jurisdictions-types` instead.
 *
 * Bounds, setbacks, stormwater thresholds, recording requirements, and
 * plat requirements are OPTIONAL frontmatter that Agent 5A-Schema is
 * adding to packages/content. Until those fields land on every page,
 * we fall back to a small built-in approximation for the Indianapolis
 * MSA so the GPS lookup still works end-to-end.
 *
 * IMPORTANT: bounds are intentionally approximate (axis-aligned
 * bounding boxes). They are good enough for "which jurisdiction
 * applies, approximately" but should not be used for legal
 * determinations. The user-facing copy always warns about this.
 */
import { listAll, type Page } from "@/lib/content";
import type {
  BoundsBox,
  JurisdictionFrontmatter,
  JurisdictionPage,
} from "@/lib/jurisdictions-types";

export * from "@/lib/jurisdictions-types";

/**
 * Fallback approximate bounding boxes for Indianapolis-area jurisdictions.
 * Used only when a page lacks `bounds:` frontmatter. Source: public
 * county/municipal shapefiles, simplified to axis-aligned boxes.
 *
 * Slug keys match the on-disk path under `content/jurisdictions/`.
 */
const FALLBACK_BOUNDS: Record<string, BoundsBox> = {
  // Counties
  "indiana/marion-county": {
    minLat: 39.632, minLng: -86.328, maxLat: 39.928, maxLng: -85.937,
  },
  "indiana/hamilton-county": {
    minLat: 39.927, minLng: -86.246, maxLat: 40.193, maxLng: -85.823,
  },
  "indiana/hancock-county": {
    minLat: 39.722, minLng: -85.985, maxLat: 39.988, maxLng: -85.677,
  },
  "indiana/shelby-county": {
    minLat: 39.426, minLng: -85.967, maxLat: 39.722, maxLng: -85.583,
  },
  "indiana/johnson-county": {
    minLat: 39.343, minLng: -86.235, maxLat: 39.632, maxLng: -85.939,
  },
  "indiana/morgan-county": {
    minLat: 39.343, minLng: -86.585, maxLat: 39.692, maxLng: -86.235,
  },
  "indiana/hendricks-county": {
    minLat: 39.632, minLng: -86.625, maxLat: 39.928, maxLng: -86.328,
  },
  "indiana/boone-county": {
    minLat: 39.928, minLng: -86.625, maxLat: 40.234, maxLng: -86.246,
  },

  // Selected municipalities (very approximate)
  "indiana/hamilton-county/municipalities/carmel": {
    minLat: 39.927, minLng: -86.247, maxLat: 40.030, maxLng: -86.025,
  },
  "indiana/hamilton-county/municipalities/fishers": {
    minLat: 39.927, minLng: -86.057, maxLat: 40.012, maxLng: -85.879,
  },
  "indiana/hamilton-county/municipalities/noblesville": {
    minLat: 40.000, minLng: -86.085, maxLat: 40.120, maxLng: -85.910,
  },
  "indiana/hamilton-county/municipalities/westfield": {
    minLat: 40.000, minLng: -86.235, maxLat: 40.115, maxLng: -86.055,
  },
  "indiana/marion-county/municipalities/indianapolis": {
    minLat: 39.632, minLng: -86.328, maxLat: 39.928, maxLng: -85.937,
  },
  "indiana/marion-county/municipalities/beech-grove": {
    minLat: 39.708, minLng: -86.110, maxLat: 39.738, maxLng: -86.060,
  },
  "indiana/marion-county/municipalities/lawrence": {
    minLat: 39.806, minLng: -86.075, maxLat: 39.890, maxLng: -85.952,
  },
  "indiana/marion-county/municipalities/southport": {
    minLat: 39.660, minLng: -86.135, maxLat: 39.682, maxLng: -86.100,
  },
  "indiana/marion-county/municipalities/speedway": {
    minLat: 39.790, minLng: -86.275, maxLat: 39.830, maxLng: -86.225,
  },
  "indiana/hendricks-county/municipalities/avon": {
    minLat: 39.732, minLng: -86.450, maxLat: 39.795, maxLng: -86.350,
  },
  "indiana/hendricks-county/municipalities/brownsburg": {
    minLat: 39.815, minLng: -86.435, maxLat: 39.880, maxLng: -86.355,
  },
  "indiana/hendricks-county/municipalities/plainfield": {
    minLat: 39.660, minLng: -86.435, maxLat: 39.725, maxLng: -86.310,
  },
  "indiana/boone-county/municipalities/zionsville": {
    minLat: 39.928, minLng: -86.330, maxLat: 40.030, maxLng: -86.190,
  },
  "indiana/boone-county/municipalities/whitestown": {
    minLat: 39.965, minLng: -86.400, maxLat: 40.025, maxLng: -86.305,
  },
  "indiana/boone-county/municipalities/lebanon": {
    minLat: 40.025, minLng: -86.510, maxLat: 40.090, maxLng: -86.420,
  },
  "indiana/johnson-county/municipalities/greenwood": {
    minLat: 39.580, minLng: -86.165, maxLat: 39.660, maxLng: -86.040,
  },
  "indiana/johnson-county/municipalities/franklin": {
    minLat: 39.450, minLng: -86.085, maxLat: 39.515, maxLng: -85.985,
  },
  "indiana/hancock-county/municipalities/greenfield": {
    minLat: 39.760, minLng: -85.815, maxLat: 39.820, maxLng: -85.720,
  },
  "indiana/hancock-county/municipalities/mccordsville": {
    minLat: 39.880, minLng: -85.945, maxLat: 39.940, maxLng: -85.850,
  },
  "indiana/shelby-county/municipalities/shelbyville": {
    minLat: 39.485, minLng: -85.825, maxLat: 39.560, maxLng: -85.725,
  },
  "indiana/morgan-county/municipalities/mooresville": {
    minLat: 39.580, minLng: -86.405, maxLat: 39.640, maxLng: -86.330,
  },
  "indiana/morgan-county/municipalities/martinsville": {
    minLat: 39.395, minLng: -86.470, maxLat: 39.460, maxLng: -86.380,
  },
};

const COUNTY_TITLES: Record<string, string> = {
  "marion-county": "Marion County",
  "hamilton-county": "Hamilton County",
  "hancock-county": "Hancock County",
  "shelby-county": "Shelby County",
  "johnson-county": "Johnson County",
  "morgan-county": "Morgan County",
  "hendricks-county": "Hendricks County",
  "boone-county": "Boone County",
};

function prettify(slug: string): string {
  return slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function toJurisdictionPage(p: Page): JurisdictionPage | null {
  if (!p.slug.startsWith("jurisdictions/")) return null;
  if (!p.slug.endsWith("/index")) return null;
  const jurisdictionSlug = p.slug
    .replace(/^jurisdictions\//, "")
    .replace(/\/index$/, "");
  if (jurisdictionSlug === "indiana") return null;
  if (jurisdictionSlug === "indiana/state") return null;

  const parts = jurisdictionSlug.split("/");
  let level: JurisdictionPage["level"];
  const breadcrumb: string[] = ["Indiana"];
  if (parts.length === 2) {
    level = "county";
    breadcrumb.push(COUNTY_TITLES[parts[1]] ?? prettify(parts[1]));
  } else if (parts.length === 4 && parts[2] === "municipalities") {
    level = "municipality";
    breadcrumb.push(
      COUNTY_TITLES[parts[1]] ?? prettify(parts[1]),
      (p.frontmatter.title as string) ?? prettify(parts[3]),
    );
  } else {
    return null;
  }

  const fm = p.frontmatter as JurisdictionFrontmatter;
  const bounds = fm.bounds ?? FALLBACK_BOUNDS[jurisdictionSlug];

  return {
    ...p,
    jurisdictionSlug,
    breadcrumb,
    level,
    bounds,
    fm,
  };
}

export function listJurisdictions(): JurisdictionPage[] {
  const out: JurisdictionPage[] = [];
  for (const p of listAll()) {
    const j = toJurisdictionPage(p);
    if (j) out.push(j);
  }
  out.sort((a, b) => a.jurisdictionSlug.localeCompare(b.jurisdictionSlug));
  return out;
}

export function getJurisdictionBySlug(slug: string): JurisdictionPage | null {
  const cleaned = slug.replace(/^\/+|\/+$/g, "");
  for (const j of listJurisdictions()) {
    if (j.jurisdictionSlug === cleaned) return j;
  }
  return null;
}
