/**
 * Pure types and small helpers for the jurisdictions feature.
 *
 * Keep this file free of any Node-only imports (fs, path, gray-matter, etc.)
 * so it can be imported by `"use client"` components.
 */
import type { Frontmatter, Page } from "@/lib/content";

export type BoundsBox = {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
};

export type ChecklistItem = {
  id?: string;
  label: string;
  description?: string;
  required?: boolean;
  source?: string;
};

export type JurisdictionSetbacks = {
  front_ft?: number;
  side_ft?: number;
  rear_ft?: number;
  corner_side_ft?: number;
  notes?: string;
  source?: string;
};

export type StormwaterThresholds = {
  detention_trigger_sqft?: number;
  water_quality_trigger_sqft?: number;
  release_rate_cfs_per_acre?: number;
  design_storm_years?: number[];
  source?: string;
};

export type RecordingRequirements = {
  paper_size?: string;
  margins_in?: string;
  signature_block_required?: boolean;
  mylar_required?: boolean;
  recording_fee_usd?: number;
  source?: string;
};

export type PlatRequirement = {
  id?: string;
  label: string;
  source?: string;
};

export type JurisdictionFrontmatter = Frontmatter & {
  bounds?: BoundsBox;
  submittal_checklist?: ChecklistItem[];
  setbacks?: JurisdictionSetbacks;
  stormwater_thresholds?: StormwaterThresholds;
  recording_requirements?: RecordingRequirements;
  plat_requirements?: PlatRequirement[];
};

export type JurisdictionPage = Page & {
  jurisdictionSlug: string;
  breadcrumb: string[];
  level: "state" | "county" | "municipality";
  bounds?: BoundsBox;
  fm: JurisdictionFrontmatter;
};

export type DeltaRow = {
  key: string;
  label: string;
  from: unknown;
  to: unknown;
};

export function pointInBounds(
  lat: number,
  lng: number,
  b: BoundsBox,
): boolean {
  return (
    lat >= b.minLat &&
    lat <= b.maxLat &&
    lng >= b.minLng &&
    lng <= b.maxLng
  );
}

export function boundsArea(b: BoundsBox): number {
  return Math.max(0, (b.maxLat - b.minLat) * (b.maxLng - b.minLng));
}

export function jurisdictionAt(
  lat: number,
  lng: number,
  pages: JurisdictionPage[],
): { best: JurisdictionPage | null; containing: JurisdictionPage[] } {
  const containing = pages.filter(
    (j) => j.bounds && pointInBounds(lat, lng, j.bounds),
  );
  if (containing.length === 0) return { best: null, containing: [] };
  let best = containing[0];
  let bestArea = boundsArea(best.bounds!);
  for (const j of containing.slice(1)) {
    const a = boundsArea(j.bounds!);
    if (a < bestArea) {
      best = j;
      bestArea = a;
    }
  }
  return { best, containing };
}

export function isValidLatLng(lat: unknown, lng: unknown): lat is number {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export function parseLatLng(
  rawLat: string,
  rawLng: string,
): { lat: number; lng: number } | null {
  const lat = Number(rawLat);
  const lng = Number(rawLng);
  if (!isValidLatLng(lat, lng)) return null;
  return { lat, lng };
}

export function diffJurisdictions(
  from: JurisdictionPage,
  to: JurisdictionPage,
): DeltaRow[] {
  const rows: DeltaRow[] = [];
  const a = from.fm;
  const b = to.fm;
  const cmp = (k: string, label: string, av: unknown, bv: unknown) => {
    const aj = JSON.stringify(av ?? null);
    const bj = JSON.stringify(bv ?? null);
    if (aj !== bj) rows.push({ key: k, label, from: av, to: bv });
  };
  cmp("setbacks.front_ft", "Front setback (ft)", a.setbacks?.front_ft, b.setbacks?.front_ft);
  cmp("setbacks.side_ft", "Side setback (ft)", a.setbacks?.side_ft, b.setbacks?.side_ft);
  cmp("setbacks.rear_ft", "Rear setback (ft)", a.setbacks?.rear_ft, b.setbacks?.rear_ft);
  cmp(
    "setbacks.corner_side_ft",
    "Corner-side setback (ft)",
    a.setbacks?.corner_side_ft,
    b.setbacks?.corner_side_ft,
  );
  cmp(
    "stormwater.detention_trigger_sqft",
    "Detention trigger (sqft)",
    a.stormwater_thresholds?.detention_trigger_sqft,
    b.stormwater_thresholds?.detention_trigger_sqft,
  );
  cmp(
    "stormwater.water_quality_trigger_sqft",
    "Water-quality trigger (sqft)",
    a.stormwater_thresholds?.water_quality_trigger_sqft,
    b.stormwater_thresholds?.water_quality_trigger_sqft,
  );
  cmp(
    "stormwater.release_rate_cfs_per_acre",
    "Release rate (cfs/ac)",
    a.stormwater_thresholds?.release_rate_cfs_per_acre,
    b.stormwater_thresholds?.release_rate_cfs_per_acre,
  );
  cmp(
    "stormwater.design_storm_years",
    "Design storms (yr)",
    a.stormwater_thresholds?.design_storm_years,
    b.stormwater_thresholds?.design_storm_years,
  );
  cmp(
    "recording.paper_size",
    "Plat paper size",
    a.recording_requirements?.paper_size,
    b.recording_requirements?.paper_size,
  );
  cmp(
    "recording.margins_in",
    "Plat margins (in)",
    a.recording_requirements?.margins_in,
    b.recording_requirements?.margins_in,
  );
  cmp(
    "recording.mylar_required",
    "Mylar required",
    a.recording_requirements?.mylar_required,
    b.recording_requirements?.mylar_required,
  );
  cmp(
    "recording.recording_fee_usd",
    "Recording fee (USD)",
    a.recording_requirements?.recording_fee_usd,
    b.recording_requirements?.recording_fee_usd,
  );
  cmp(
    "plat_requirements.count",
    "Plat requirement count",
    a.plat_requirements?.length ?? 0,
    b.plat_requirements?.length ?? 0,
  );
  return rows;
}

export const COMPARE_ROWS: {
  key: string;
  label: string;
  get: (fm: JurisdictionFrontmatter) => unknown;
}[] = [
  { key: "front_ft", label: "Front setback (ft)", get: (fm) => fm.setbacks?.front_ft },
  { key: "side_ft", label: "Side setback (ft)", get: (fm) => fm.setbacks?.side_ft },
  { key: "rear_ft", label: "Rear setback (ft)", get: (fm) => fm.setbacks?.rear_ft },
  {
    key: "corner_side_ft",
    label: "Corner-side setback (ft)",
    get: (fm) => fm.setbacks?.corner_side_ft,
  },
  {
    key: "detention_trigger_sqft",
    label: "Detention trigger (sqft)",
    get: (fm) => fm.stormwater_thresholds?.detention_trigger_sqft,
  },
  {
    key: "water_quality_trigger_sqft",
    label: "Water-quality trigger (sqft)",
    get: (fm) => fm.stormwater_thresholds?.water_quality_trigger_sqft,
  },
  {
    key: "release_rate_cfs_per_acre",
    label: "Release rate (cfs/ac)",
    get: (fm) => fm.stormwater_thresholds?.release_rate_cfs_per_acre,
  },
  {
    key: "design_storm_years",
    label: "Design storms (yr)",
    get: (fm) =>
      Array.isArray(fm.stormwater_thresholds?.design_storm_years)
        ? fm.stormwater_thresholds!.design_storm_years!.join(", ")
        : undefined,
  },
  {
    key: "paper_size",
    label: "Plat paper size",
    get: (fm) => fm.recording_requirements?.paper_size,
  },
  {
    key: "margins_in",
    label: "Plat margins (in)",
    get: (fm) => fm.recording_requirements?.margins_in,
  },
  {
    key: "mylar_required",
    label: "Mylar required",
    get: (fm) =>
      fm.recording_requirements?.mylar_required === undefined
        ? undefined
        : fm.recording_requirements.mylar_required
        ? "Yes"
        : "No",
  },
  {
    key: "recording_fee_usd",
    label: "Recording fee (USD)",
    get: (fm) => fm.recording_requirements?.recording_fee_usd,
  },
  {
    key: "plat_requirement_count",
    label: "Plat requirements (count)",
    get: (fm) => fm.plat_requirements?.length ?? 0,
  },
];

export const COVERED_COUNTIES = [
  "Marion County",
  "Hamilton County",
  "Hancock County",
  "Shelby County",
  "Johnson County",
  "Morgan County",
  "Hendricks County",
  "Boone County",
];
