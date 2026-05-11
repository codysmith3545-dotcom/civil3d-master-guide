/**
 * @civil3d-master-guide/content
 *
 * Typed Frontmatter schema for markdown pages in `content/`. Plain TypeScript
 * interfaces with a hand-written parser that returns an object plus a list of
 * issues. Mirrors the loose Frontmatter shape used in `mcp-server/src/content.ts`
 * but adds typed jurisdiction-specific fields.
 *
 * Keep this file dependency-free; the linter scripts read it and the MCP server
 * imports the types.
 */

/** A single submittal-checklist item attached to a jurisdiction page. */
export interface ChecklistItem {
  /** Stable slug, e.g. "stamped-signed-by-licensed-surveyor". */
  id: string;
  label: string;
  category: "submittal" | "drafting" | "recording" | "review";
  /** Ordinance / code section citation. */
  citation?: string;
}

export interface ResidentialSetbacks {
  front_ft?: number;
  side_ft?: number;
  rear_ft?: number;
  corner_side_ft?: number;
}

export interface CommercialSetbacks {
  front_ft?: number;
  side_ft?: number;
  rear_ft?: number;
}

export interface AgriculturalSetbacks {
  front_ft?: number;
  side_ft?: number;
  rear_ft?: number;
}

export interface JurisdictionSetbacks {
  residential?: ResidentialSetbacks;
  commercial?: CommercialSetbacks;
  agricultural?: AgriculturalSetbacks;
  citations?: string[];
}

export interface StormwaterThresholds {
  detention_trigger_sqft?: number;
  water_quality_trigger_sqft?: number;
  bmp_required_above_sqft?: number;
  citations?: string[];
}

export type PaperSize = "8.5x11" | "8.5x14" | "11x17" | "18x24" | "24x36";
export type InkColor = "black" | "blue" | "black-or-blue";

export interface RecordingRequirements {
  paper_size?: PaperSize;
  margin_top_in?: number;
  margin_left_in?: number;
  margin_right_in?: number;
  margin_bottom_in?: number;
  ink_color?: InkColor;
  max_pages?: number;
  fee_first_page_usd?: number;
  fee_each_additional_usd?: number;
  citations?: string[];
}

export interface PlatRequirement {
  /** e.g. "north arrow", "surveyor seal", "monumentation table". */
  item: string;
  required: boolean;
  notes?: string;
}

export interface FrontmatterSource {
  title?: string;
  url?: string;
  verified?: string;
}

/**
 * The full Frontmatter shape recognised by the knowledge base. All fields are
 * optional from a TypeScript perspective; required-ness is enforced at lint
 * time (see `scripts/lint-content.mjs`).
 */
export interface Frontmatter {
  title?: string;
  section?: string;
  order?: number;
  visibility?: "public" | "invite";
  tags?: string[];
  appliesTo?: string[];
  relatedCommands?: string[];
  relatedCalculators?: string[];
  jurisdictionRefs?: string[];
  updated?: string;
  sources?: FrontmatterSource[];

  // Command pages
  category?: string;
  ribbon?: string;
  related?: string[];
  symptoms?: string[];

  // Jurisdiction pages
  state?: string;
  county?: string;
  municipality?: string;

  // NEW: typed jurisdiction-specific fields
  submittal_checklist?: ChecklistItem[];
  setbacks?: JurisdictionSetbacks;
  stormwater_thresholds?: StormwaterThresholds;
  recording_requirements?: RecordingRequirements;
  plat_requirements?: PlatRequirement[];

  // Allow forward-compatible extension without breaking existing pages.
  [key: string]: unknown;
}

export interface ParseIssue {
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface ParseResult {
  frontmatter: Frontmatter;
  issues: ParseIssue[];
}

const PAPER_SIZES: ReadonlySet<PaperSize> = new Set<PaperSize>([
  "8.5x11",
  "8.5x14",
  "11x17",
  "18x24",
  "24x36",
]);

const INK_COLORS: ReadonlySet<InkColor> = new Set<InkColor>([
  "black",
  "blue",
  "black-or-blue",
]);

const CHECKLIST_CATEGORIES: ReadonlySet<ChecklistItem["category"]> = new Set([
  "submittal",
  "drafting",
  "recording",
  "review",
]);

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function checkOptionalNumber(
  obj: Record<string, unknown>,
  key: string,
  path: string,
  issues: ParseIssue[],
): void {
  if (!(key in obj)) return;
  const v = obj[key];
  if (v === null || v === undefined) return;
  if (typeof v !== "number" || Number.isNaN(v)) {
    issues.push({
      field: `${path}.${key}`,
      message: `expected number, got ${typeof v}`,
      severity: "error",
    });
  }
}

function validateChecklistItem(
  v: unknown,
  path: string,
  issues: ParseIssue[],
): ChecklistItem | null {
  if (!isPlainObject(v)) {
    issues.push({ field: path, message: "expected object", severity: "error" });
    return null;
  }
  const id = v.id;
  const label = v.label;
  const category = v.category;
  if (typeof id !== "string" || id.length === 0) {
    issues.push({ field: `${path}.id`, message: "expected non-empty string", severity: "error" });
    return null;
  }
  if (typeof label !== "string" || label.length === 0) {
    issues.push({ field: `${path}.label`, message: "expected non-empty string", severity: "error" });
    return null;
  }
  if (typeof category !== "string" || !CHECKLIST_CATEGORIES.has(category as ChecklistItem["category"])) {
    issues.push({
      field: `${path}.category`,
      message: `expected one of ${[...CHECKLIST_CATEGORIES].join(", ")}`,
      severity: "error",
    });
    return null;
  }
  const out: ChecklistItem = { id, label, category: category as ChecklistItem["category"] };
  if (typeof v.citation === "string") out.citation = v.citation;
  return out;
}

function validateSetbacks(
  v: unknown,
  path: string,
  issues: ParseIssue[],
): JurisdictionSetbacks | null {
  if (!isPlainObject(v)) {
    issues.push({ field: path, message: "expected object", severity: "error" });
    return null;
  }
  const out: JurisdictionSetbacks = {};
  for (const sub of ["residential", "commercial", "agricultural"] as const) {
    if (sub in v && v[sub] !== null && v[sub] !== undefined) {
      const inner = v[sub];
      if (!isPlainObject(inner)) {
        issues.push({ field: `${path}.${sub}`, message: "expected object", severity: "error" });
        continue;
      }
      const keys =
        sub === "residential"
          ? (["front_ft", "side_ft", "rear_ft", "corner_side_ft"] as const)
          : (["front_ft", "side_ft", "rear_ft"] as const);
      const sanitized: Record<string, number> = {};
      for (const k of keys) {
        checkOptionalNumber(inner, k, `${path}.${sub}`, issues);
        if (typeof inner[k] === "number") sanitized[k] = inner[k] as number;
      }
      (out as Record<string, unknown>)[sub] = sanitized;
    }
  }
  if ("citations" in v && v.citations !== null && v.citations !== undefined) {
    if (!isStringArray(v.citations)) {
      issues.push({ field: `${path}.citations`, message: "expected string[]", severity: "error" });
    } else {
      out.citations = v.citations;
    }
  }
  return out;
}

function validateStormwater(
  v: unknown,
  path: string,
  issues: ParseIssue[],
): StormwaterThresholds | null {
  if (!isPlainObject(v)) {
    issues.push({ field: path, message: "expected object", severity: "error" });
    return null;
  }
  const out: StormwaterThresholds = {};
  for (const k of [
    "detention_trigger_sqft",
    "water_quality_trigger_sqft",
    "bmp_required_above_sqft",
  ] as const) {
    checkOptionalNumber(v, k, path, issues);
    if (typeof v[k] === "number") (out as Record<string, unknown>)[k] = v[k];
  }
  if ("citations" in v && v.citations !== null && v.citations !== undefined) {
    if (!isStringArray(v.citations)) {
      issues.push({ field: `${path}.citations`, message: "expected string[]", severity: "error" });
    } else {
      out.citations = v.citations;
    }
  }
  return out;
}

function validateRecording(
  v: unknown,
  path: string,
  issues: ParseIssue[],
): RecordingRequirements | null {
  if (!isPlainObject(v)) {
    issues.push({ field: path, message: "expected object", severity: "error" });
    return null;
  }
  const out: RecordingRequirements = {};
  if (typeof v.paper_size === "string") {
    if (!PAPER_SIZES.has(v.paper_size as PaperSize)) {
      issues.push({
        field: `${path}.paper_size`,
        message: `expected one of ${[...PAPER_SIZES].join(", ")}`,
        severity: "error",
      });
    } else {
      out.paper_size = v.paper_size as PaperSize;
    }
  }
  for (const k of [
    "margin_top_in",
    "margin_left_in",
    "margin_right_in",
    "margin_bottom_in",
    "max_pages",
    "fee_first_page_usd",
    "fee_each_additional_usd",
  ] as const) {
    checkOptionalNumber(v, k, path, issues);
    if (typeof v[k] === "number") (out as Record<string, unknown>)[k] = v[k];
  }
  if (typeof v.ink_color === "string") {
    if (!INK_COLORS.has(v.ink_color as InkColor)) {
      issues.push({
        field: `${path}.ink_color`,
        message: `expected one of ${[...INK_COLORS].join(", ")}`,
        severity: "error",
      });
    } else {
      out.ink_color = v.ink_color as InkColor;
    }
  }
  if ("citations" in v && v.citations !== null && v.citations !== undefined) {
    if (!isStringArray(v.citations)) {
      issues.push({ field: `${path}.citations`, message: "expected string[]", severity: "error" });
    } else {
      out.citations = v.citations;
    }
  }
  return out;
}

function validatePlatItem(
  v: unknown,
  path: string,
  issues: ParseIssue[],
): PlatRequirement | null {
  if (!isPlainObject(v)) {
    issues.push({ field: path, message: "expected object", severity: "error" });
    return null;
  }
  if (typeof v.item !== "string" || v.item.length === 0) {
    issues.push({ field: `${path}.item`, message: "expected non-empty string", severity: "error" });
    return null;
  }
  if (typeof v.required !== "boolean") {
    issues.push({ field: `${path}.required`, message: "expected boolean", severity: "error" });
    return null;
  }
  const out: PlatRequirement = { item: v.item, required: v.required };
  if (typeof v.notes === "string") out.notes = v.notes;
  return out;
}

/**
 * Parse / validate a raw frontmatter object (e.g. the output of gray-matter).
 * Returns a typed Frontmatter and a list of issues. Unknown keys are preserved
 * on the result via index-signature so the loader behaves like a strict-superset
 * of the previous untyped shape.
 */
export function parseFrontmatter(raw: unknown): ParseResult {
  const issues: ParseIssue[] = [];
  if (!isPlainObject(raw)) {
    return {
      frontmatter: {},
      issues: [{ field: "<root>", message: "frontmatter is not an object", severity: "error" }],
    };
  }
  const fm: Frontmatter = { ...raw } as Frontmatter;

  if ("submittal_checklist" in raw && raw.submittal_checklist !== null && raw.submittal_checklist !== undefined) {
    if (!Array.isArray(raw.submittal_checklist)) {
      issues.push({ field: "submittal_checklist", message: "expected array", severity: "error" });
      delete fm.submittal_checklist;
    } else {
      const out: ChecklistItem[] = [];
      raw.submittal_checklist.forEach((item, i) => {
        const v = validateChecklistItem(item, `submittal_checklist[${i}]`, issues);
        if (v) out.push(v);
      });
      fm.submittal_checklist = out;
    }
  }

  if ("setbacks" in raw && raw.setbacks !== null && raw.setbacks !== undefined) {
    const v = validateSetbacks(raw.setbacks, "setbacks", issues);
    if (v) fm.setbacks = v;
    else delete fm.setbacks;
  }

  if (
    "stormwater_thresholds" in raw &&
    raw.stormwater_thresholds !== null &&
    raw.stormwater_thresholds !== undefined
  ) {
    const v = validateStormwater(raw.stormwater_thresholds, "stormwater_thresholds", issues);
    if (v) fm.stormwater_thresholds = v;
    else delete fm.stormwater_thresholds;
  }

  if (
    "recording_requirements" in raw &&
    raw.recording_requirements !== null &&
    raw.recording_requirements !== undefined
  ) {
    const v = validateRecording(raw.recording_requirements, "recording_requirements", issues);
    if (v) fm.recording_requirements = v;
    else delete fm.recording_requirements;
  }

  if ("plat_requirements" in raw && raw.plat_requirements !== null && raw.plat_requirements !== undefined) {
    if (!Array.isArray(raw.plat_requirements)) {
      issues.push({ field: "plat_requirements", message: "expected array", severity: "error" });
      delete fm.plat_requirements;
    } else {
      const out: PlatRequirement[] = [];
      raw.plat_requirements.forEach((item, i) => {
        const v = validatePlatItem(item, `plat_requirements[${i}]`, issues);
        if (v) out.push(v);
      });
      fm.plat_requirements = out;
    }
  }

  return { frontmatter: fm, issues };
}

/** True if a frontmatter object looks like a jurisdiction index page. */
export function isJurisdictionPage(fm: Frontmatter): boolean {
  if (typeof fm.section !== "string") return false;
  return fm.section.startsWith("jurisdictions/");
}

/** Field names that the lint script checks for on jurisdiction pages. */
export const JURISDICTION_TYPED_FIELDS = [
  "submittal_checklist",
  "setbacks",
  "stormwater_thresholds",
  "recording_requirements",
  "plat_requirements",
] as const;
