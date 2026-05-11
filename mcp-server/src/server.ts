import * as path from "node:path";
import { promises as fs } from "node:fs";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import matter from "gray-matter";

import {
  resolveKbRoot,
  contentDir,
  loadAllPages,
  getPage,
  type PageRecord,
} from "./content.js";
import { searchPages } from "./search.js";
import {
  GetPageInput,
  SearchKbInput,
  ListCommandsInput,
  ListJurisdictionsInput,
  JurisdictionAtInput,
  GetResourceIndexInput,
  RunCalculatorInput,
  ListLispRoutinesInput,
  GetLispInput,
} from "./schemas.js";
import { listLispRoutines, getLisp } from "./lisp.js";
import {
  verticalCurve,
  horizontalCurve,
  rationalMethod,
  manningsOpenChannel,
  statePlaneIndianaCsf,
  traverseClosure,
  metesAndBoundsWriter,
  inverse,
  bearingBearingIntersection,
  bearingDistanceIntersection,
  distanceDistanceIntersection,
  levelLoopAdjustment,
  areaByCoordinates,
  curveStakeout,
  trigLeveling,
  solarObservation,
  gridToGround,
} from "./calculators/index.js";

function jsonResult(data: unknown): CallToolResult {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

function errorResult(message: string): CallToolResult {
  return {
    isError: true,
    content: [{ type: "text", text: message }],
  };
}

function zodToJsonSchema(schema: z.ZodTypeAny): Record<string, unknown> {
  // Minimal hand-rolled converter for the simple shapes we use here. Sufficient
  // for the MCP tool listing — clients only need to know what fields exist.
  if (schema instanceof z.ZodObject) {
    const shape = (schema as z.ZodObject<z.ZodRawShape>).shape;
    const properties: Record<string, unknown> = {};
    const required: string[] = [];
    for (const [key, value] of Object.entries(shape)) {
      const sub = value as z.ZodTypeAny;
      properties[key] = zodToJsonSchema(sub);
      if (!sub.isOptional()) required.push(key);
    }
    const out: Record<string, unknown> = {
      type: "object",
      properties,
      additionalProperties: false,
    };
    if (required.length > 0) out.required = required;
    return out;
  }
  if (schema instanceof z.ZodString) {
    return { type: "string", description: schema.description };
  }
  if (schema instanceof z.ZodNumber) {
    return { type: "number", description: schema.description };
  }
  if (schema instanceof z.ZodBoolean) {
    return { type: "boolean", description: schema.description };
  }
  if (schema instanceof z.ZodEnum) {
    return { type: "string", enum: schema.options, description: schema.description };
  }
  if (schema instanceof z.ZodOptional) {
    return zodToJsonSchema(schema.unwrap());
  }
  if (schema instanceof z.ZodDefault) {
    const inner = zodToJsonSchema(schema._def.innerType);
    return { ...inner, default: schema._def.defaultValue() };
  }
  if (schema instanceof z.ZodLiteral) {
    return { const: schema.value };
  }
  if (schema instanceof z.ZodDiscriminatedUnion) {
    const opts = (schema as z.ZodDiscriminatedUnion<string, z.ZodObject<z.ZodRawShape>[]>).options;
    return { oneOf: opts.map((o) => zodToJsonSchema(o)) };
  }
  if (schema instanceof z.ZodArray) {
    return { type: "array", items: zodToJsonSchema((schema as z.ZodArray<z.ZodTypeAny>).element) };
  }
  return {};
}

// ---------------------------------------------------------------------------
// Resource index parser
// ---------------------------------------------------------------------------

function categoryFromFilename(name: string): string {
  const stem = name.replace(/\.md$/i, "");
  if (stem === "books") return "books";
  if (stem === "youtube-channels") return "youtube";
  if (stem === "blogs") return "blogs";
  if (stem === "forums-and-communities") return "forums";
  if (stem === "podcasts") return "podcasts";
  if (stem === "training-and-certs") return "training";
  if (stem === "tools-and-software") return "tools";
  return stem;
}

interface ResourceItem {
  text: string;
  url?: string;
  starred?: boolean;
}

function extractResources(body: string): ResourceItem[] {
  const items: ResourceItem[] = [];
  const lines = body.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\s*[-*]\s+(.*)$/);
    if (!m) continue;
    const raw = m[1]!.trim();
    const starred = /^[★]/.test(raw);
    const cleaned = raw.replace(/^[★]\s*/, "");
    // first markdown link if present
    const link = cleaned.match(/\[([^\]]+)\]\(([^)]+)\)/);
    items.push({
      text: cleaned,
      url: link ? link[2] : undefined,
      starred: starred || undefined,
    });
  }
  return items;
}

async function buildResourceIndex(root: string): Promise<Record<string, ResourceItem[]>> {
  const dir = path.join(contentDir(root), "resources");
  const out: Record<string, ResourceItem[]> = {};
  let entries: import("node:fs").Dirent[] = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    if (!ent.isFile() || !ent.name.toLowerCase().endsWith(".md")) continue;
    if (ent.name === "index.md") continue;
    const cat = categoryFromFilename(ent.name);
    const raw = await fs.readFile(path.join(dir, ent.name), "utf8");
    const parsed = matter(raw);
    out[cat] = extractResources(parsed.content);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Jurisdictions
// ---------------------------------------------------------------------------

interface JurisdictionEntry {
  state: string;
  county?: string;
  municipality?: string;
  title: string;
  path: string;
}

function parseJurisdictionFromPath(rel: string, fm: PageRecord["frontmatter"]): JurisdictionEntry | null {
  const parts = rel.split("/");
  if (parts[0] !== "jurisdictions") return null;
  const state = parts[1];
  if (!state) return null;
  const entry: JurisdictionEntry = {
    state,
    title: typeof fm.title === "string" ? fm.title : rel,
    path: rel,
  };
  // Patterns:
  //   jurisdictions/<state>/index.md
  //   jurisdictions/<state>/state/index.md
  //   jurisdictions/<state>/<county>/index.md
  //   jurisdictions/<state>/<county>/municipalities/<muni>/index.md
  //   jurisdictions/<state>/<county>/municipalities/<muni>/<page>.md
  if (parts[2] && parts[2] !== "state") {
    entry.county = parts[2];
  }
  const muniIdx = parts.indexOf("municipalities");
  if (muniIdx >= 0 && parts[muniIdx + 1]) {
    entry.municipality = parts[muniIdx + 1]!;
  }
  // Allow frontmatter overrides
  if (typeof fm.state === "string") entry.state = fm.state;
  if (typeof fm.county === "string") entry.county = fm.county;
  if (typeof fm.municipality === "string") entry.municipality = fm.municipality;
  return entry;
}

async function listJurisdictions(root: string, stateFilter?: string): Promise<JurisdictionEntry[]> {
  const pages = await loadAllPages(root);
  const out: JurisdictionEntry[] = [];
  for (const p of pages) {
    if (!p.relPath.startsWith("jurisdictions/")) continue;
    // Only pick "summary" pages: index.md at any level; skip leaf detail pages
    // to keep the list compact unless they're index pages.
    if (!p.relPath.endsWith("/index.md")) continue;
    const j = parseJurisdictionFromPath(p.relPath, p.frontmatter);
    if (!j) continue;
    if (stateFilter && j.state.toLowerCase() !== stateFilter.toLowerCase()) continue;
    out.push(j);
  }
  out.sort((a, b) => a.path.localeCompare(b.path));
  return out;
}

interface MunicipalityNode {
  slug: string;
  title: string;
  path: string;
}

interface CountyNode {
  slug: string;
  title: string;
  path: string;
  municipalities: MunicipalityNode[];
}

interface StateNode {
  slug: string;
  title: string;
  path: string;
  counties: CountyNode[];
}

interface JurisdictionTree {
  states: StateNode[];
  flat: JurisdictionEntry[];
}

function buildJurisdictionTree(flat: JurisdictionEntry[]): JurisdictionTree {
  const stateMap = new Map<string, StateNode>();
  const countyMap = new Map<string, CountyNode>(); // key: state/county

  // First pass: state and county nodes (entries with no municipality).
  for (const j of flat) {
    if (j.municipality) continue;
    if (j.county) {
      const key = `${j.state}/${j.county}`;
      if (!countyMap.has(key)) {
        countyMap.set(key, {
          slug: j.county,
          title: j.title,
          path: j.path,
          municipalities: [],
        });
      } else {
        const existing = countyMap.get(key)!;
        existing.title = j.title;
        existing.path = j.path;
      }
    } else {
      // state-level page (jurisdictions/<state>/index.md or .../state/index.md)
      if (!stateMap.has(j.state)) {
        stateMap.set(j.state, {
          slug: j.state,
          title: j.title,
          path: j.path,
          counties: [],
        });
      } else {
        // Prefer the top-level state index over the nested .../state/index.md.
        const existing = stateMap.get(j.state)!;
        const isTopLevel = j.path === `jurisdictions/${j.state}/index.md`;
        if (isTopLevel) {
          existing.title = j.title;
          existing.path = j.path;
        }
      }
    }
  }

  // Make sure every county has a parent state node, even if the state has no
  // top-level index.md.
  for (const j of flat) {
    if (!stateMap.has(j.state)) {
      stateMap.set(j.state, {
        slug: j.state,
        title: j.state,
        path: `jurisdictions/${j.state}`,
        counties: [],
      });
    }
  }

  // Second pass: attach municipalities to county nodes (creating county nodes
  // on the fly if a municipality appears under an undiscovered county).
  for (const j of flat) {
    if (!j.municipality || !j.county) continue;
    const key = `${j.state}/${j.county}`;
    if (!countyMap.has(key)) {
      countyMap.set(key, {
        slug: j.county,
        title: j.county,
        path: `jurisdictions/${j.state}/${j.county}`,
        municipalities: [],
      });
    }
    countyMap.get(key)!.municipalities.push({
      slug: j.municipality,
      title: j.title,
      path: j.path,
    });
  }

  // Attach counties to states.
  for (const [key, county] of countyMap) {
    const stateSlug = key.split("/")[0]!;
    const state = stateMap.get(stateSlug);
    if (state) state.counties.push(county);
  }

  // Sort everything for stable output.
  const states = Array.from(stateMap.values()).sort((a, b) => a.slug.localeCompare(b.slug));
  for (const s of states) {
    s.counties.sort((a, b) => a.slug.localeCompare(b.slug));
    for (const c of s.counties) {
      c.municipalities.sort((a, b) => a.slug.localeCompare(b.slug));
    }
  }

  return { states, flat };
}

// ---------------------------------------------------------------------------
// jurisdiction_at — find which jurisdiction(s) contain a GPS point
// ---------------------------------------------------------------------------

interface BoundedJurisdiction {
  state: string;
  county?: string;
  municipality?: string;
  title: string;
  slug: string;
  path: string;
  bounds: [number, number, number, number];
  level: "state" | "county" | "municipality";
}

function jurisdictionLevel(rel: string): "state" | "county" | "municipality" | null {
  // jurisdictions/<state>/index.md                    -> state
  // jurisdictions/<state>/state/index.md              -> state
  // jurisdictions/<state>/<county>/index.md           -> county
  // jurisdictions/<state>/<county>/municipalities/<m>/index.md -> municipality
  if (!rel.startsWith("jurisdictions/")) return null;
  if (!rel.endsWith("/index.md")) return null;
  const parts = rel.split("/");
  // parts[0]="jurisdictions", parts[1]=state
  if (parts.length === 3) return "state"; // jurisdictions/<state>/index.md
  if (parts.length === 4 && parts[2] === "state") return "state";
  if (parts.length === 4) return "county"; // jurisdictions/<state>/<county>/index.md
  if (parts.length === 6 && parts[3] === "municipalities") return "municipality";
  return null;
}

function pointInBounds(
  lat: number,
  lng: number,
  bounds: [number, number, number, number],
): boolean {
  const [minLng, minLat, maxLng, maxLat] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

function bboxArea(bounds: [number, number, number, number]): number {
  const [minLng, minLat, maxLng, maxLat] = bounds;
  return Math.abs(maxLng - minLng) * Math.abs(maxLat - minLat);
}

async function findJurisdictionAt(
  root: string,
  lat: number,
  lng: number,
): Promise<{
  match: BoundedJurisdiction | null;
  parents: BoundedJurisdiction[];
  hint?: string;
  candidatesEvaluated: number;
}> {
  const pages = await loadAllPages(root);
  const candidates: BoundedJurisdiction[] = [];
  for (const p of pages) {
    if (!p.relPath.startsWith("jurisdictions/")) continue;
    const level = jurisdictionLevel(p.relPath);
    if (!level) continue;
    const fm = p.frontmatter;
    const bounds = fm.bounds;
    if (!Array.isArray(bounds) || bounds.length !== 4) continue;
    if (!bounds.every((n) => typeof n === "number" && Number.isFinite(n))) continue;
    const j = parseJurisdictionFromPath(p.relPath, fm);
    if (!j) continue;
    // Re-derive county/municipality from level so the state-level index page
    // (jurisdictions/<state>/index.md) doesn't get a spurious county.
    const partsArr = p.relPath.split("/");
    let county: string | undefined;
    let municipality: string | undefined;
    if (level === "county") {
      county = partsArr[2];
    } else if (level === "municipality") {
      county = partsArr[2];
      municipality = partsArr[4];
    }
    candidates.push({
      state: j.state,
      county: county ?? (typeof fm.county === "string" ? fm.county : undefined),
      municipality:
        municipality ?? (typeof fm.municipality === "string" ? fm.municipality : undefined),
      title: j.title,
      slug: p.slug,
      path: p.relPath,
      bounds: bounds as [number, number, number, number],
      level,
    });
  }

  if (candidates.length === 0) {
    return {
      match: null,
      parents: [],
      hint:
        "No jurisdictions in the knowledge base have `bounds` frontmatter. Add a [minLng, minLat, maxLng, maxLat] bbox to enable GPS lookup.",
      candidatesEvaluated: 0,
    };
  }

  const hits = candidates.filter((c) => pointInBounds(lat, lng, c.bounds));
  if (hits.length === 0) {
    return {
      match: null,
      parents: [],
      hint: `No jurisdiction with defined bounds contains the point (${lat}, ${lng}). It may be outside the covered area, or the containing jurisdictions have no bounds defined.`,
      candidatesEvaluated: candidates.length,
    };
  }

  // Most-specific = smallest bbox area. Tie-break by level rank (muni > county > state).
  const levelRank: Record<BoundedJurisdiction["level"], number> = {
    municipality: 3,
    county: 2,
    state: 1,
  };
  hits.sort((a, b) => {
    const r = levelRank[b.level] - levelRank[a.level];
    if (r !== 0) return r;
    return bboxArea(a.bounds) - bboxArea(b.bounds);
  });
  const match = hits[0]!;
  // Build parent chain from remaining hits that share state/county lineage.
  const parents: BoundedJurisdiction[] = [];
  for (const h of hits) {
    if (h === match) continue;
    if (h.state !== match.state) continue;
    if (match.county && h.county && h.county !== match.county) continue;
    parents.push(h);
  }
  // Order parents from broadest -> narrowest.
  parents.sort((a, b) => levelRank[a.level] - levelRank[b.level]);

  return { match, parents, candidatesEvaluated: candidates.length };
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

interface CommandEntry {
  command: string;
  category?: string;
  ribbon?: string;
  related?: string[];
  symptoms?: string[];
  slug: string;
  title: string;
}

async function listCommands(root: string, categoryFilter?: string): Promise<CommandEntry[]> {
  const pages = await loadAllPages(root);
  const out: CommandEntry[] = [];
  for (const p of pages) {
    if (!p.relPath.startsWith("civil3d/commands/")) continue;
    // Skip index/aggregate pages
    const base = path.basename(p.relPath, ".md");
    if (base === "index" || base === "shortcuts" || base === "command-line-cheatsheet" || base === "_template") {
      continue;
    }
    const fm = p.frontmatter;
    const command = typeof fm["command"] === "string" ? (fm["command"] as string) : base;
    const category = typeof fm.category === "string" ? fm.category : undefined;
    if (categoryFilter && (category ?? "").toLowerCase() !== categoryFilter.toLowerCase()) continue;
    out.push({
      command,
      category,
      ribbon: typeof fm.ribbon === "string" ? fm.ribbon : undefined,
      related: Array.isArray(fm.related) ? (fm.related as string[]) : undefined,
      symptoms: Array.isArray(fm.symptoms) ? (fm.symptoms as string[]) : undefined,
      slug: p.slug,
      title: p.title,
    });
  }
  out.sort((a, b) => a.command.localeCompare(b.command));
  return out;
}

// ---------------------------------------------------------------------------
// Server wiring
// ---------------------------------------------------------------------------

interface ToolDef {
  name: string;
  description: string;
  schema: z.ZodTypeAny;
  handler: (args: unknown) => Promise<CallToolResult>;
}

export function buildTools(): ToolDef[] {
  return [
    {
      name: "get_page",
      description:
        "Fetch a single markdown page from the Civil 3D Master Guide knowledge base. Returns title, section, frontmatter, raw markdown body, and source citations.",
      schema: GetPageInput,
      handler: async (args) => {
        const parsed = GetPageInput.parse(args);
        const root = await resolveKbRoot();
        const page = await getPage(root, parsed.slug);
        if (!page) return errorResult(`Page not found: ${parsed.slug}`);
        return jsonResult({
          slug: page.slug,
          title: page.title,
          section: page.section,
          frontmatter: page.frontmatter,
          body: page.body,
          sources: page.sources,
        });
      },
    },
    {
      name: "search_kb",
      description:
        "Full-text search the Civil 3D Master Guide. Returns the top N matches with slug, title, score, and excerpt. Uses token-overlap scoring with frontmatter-tag boosts.",
      schema: SearchKbInput,
      handler: async (args) => {
        const parsed = SearchKbInput.parse(args);
        const root = await resolveKbRoot();
        const pages = await loadAllPages(root);
        const hits = searchPages(pages, parsed.query, parsed.limit ?? 10);
        return jsonResult({ query: parsed.query, hits });
      },
    },
    {
      name: "list_commands",
      description:
        "List Civil 3D commands from the catalog at content/civil3d/commands/. Optionally filter by frontmatter `category` (e.g. 'survey').",
      schema: ListCommandsInput,
      handler: async (args) => {
        const parsed = ListCommandsInput.parse(args);
        const root = await resolveKbRoot();
        const items = await listCommands(root, parsed.category);
        return jsonResult({ count: items.length, items });
      },
    },
    {
      name: "list_jurisdictions",
      description:
        "List jurisdictional pages (state, county, municipality) under content/jurisdictions/, returned as a state -> county -> municipality tree. Optionally filter by state slug. The legacy flat array is preserved on the `flat` field for backward compatibility.",
      schema: ListJurisdictionsInput,
      handler: async (args) => {
        const parsed = ListJurisdictionsInput.parse(args);
        const root = await resolveKbRoot();
        const items = await listJurisdictions(root, parsed.state);
        const tree = buildJurisdictionTree(items);
        return jsonResult({
          states: tree.states,
          flat: tree.flat,
          count: tree.flat.length,
        });
      },
    },
    {
      name: "jurisdiction_at",
      description:
        "Look up which jurisdiction(s) contain a GPS point. Inputs: { lat, lng } in decimal degrees. Returns the most-specific match (municipality > county > state) plus its parent chain, based on `bounds: [minLng, minLat, maxLng, maxLat]` frontmatter on jurisdiction index pages. Returns match=null with a hint if nothing matches.",
      schema: JurisdictionAtInput,
      handler: async (args) => {
        const parsed = JurisdictionAtInput.parse(args);
        const root = await resolveKbRoot();
        const result = await findJurisdictionAt(root, parsed.lat, parsed.lng);
        return jsonResult({
          query: { lat: parsed.lat, lng: parsed.lng },
          match: result.match,
          parents: result.parents,
          hint: result.hint,
          candidatesEvaluated: result.candidatesEvaluated,
        });
      },
    },
    {
      name: "get_resource_index",
      description:
        "Return the curated outside-resource index parsed from content/resources/ (books, youtube, blogs, forums, podcasts, training, tools).",
      schema: GetResourceIndexInput,
      handler: async (args) => {
        GetResourceIndexInput.parse(args ?? {});
        const root = await resolveKbRoot();
        const index = await buildResourceIndex(root);
        return jsonResult(index);
      },
    },
    {
      name: "list_lisp_routines",
      description:
        "List all LISP routines available in the curated library at customization/lisp/library/. Returns metadata only (name, command, category, summary, appliesTo). Use `get_lisp` to fetch a routine's source and full markdown documentation.",
      schema: ListLispRoutinesInput,
      handler: async (args) => {
        ListLispRoutinesInput.parse(args ?? {});
        const items = await listLispRoutines();
        return jsonResult({ count: items.length, items });
      },
    },
    {
      name: "get_lisp",
      description:
        "Fetch a single LISP routine from the library by its `name` slug. Returns the AutoLISP source, the markdown documentation, and metadata.",
      schema: GetLispInput,
      handler: async (args) => {
        const parsed = GetLispInput.parse(args);
        const result = await getLisp(parsed.name);
        if (!result) return errorResult(`LISP routine not found: ${parsed.name}`);
        return jsonResult(result);
      },
    },
    {
      name: "run_calculator",
      description:
        "Run a built-in engineering calculator. Available calculators: 'vertical_curve', 'horizontal_curve', 'rational_method', 'mannings_open_channel', 'state_plane_indiana_csf', 'traverse_closure', 'metes_and_bounds', 'inverse', 'bearing_bearing_intersection', 'bearing_distance_intersection', 'distance_distance_intersection', 'level_loop_adjustment', 'area_by_coordinates', 'curve_stakeout', 'trig_leveling', 'solar_observation', 'grid_to_ground'. Provide `name` and the corresponding `inputs` object.",
      schema: RunCalculatorInput,
      handler: async (args) => {
        const parsed = RunCalculatorInput.parse(args);
        switch (parsed.name) {
          case "vertical_curve":
            return jsonResult(verticalCurve(parsed.inputs));
          case "horizontal_curve":
            return jsonResult(horizontalCurve(parsed.inputs));
          case "rational_method":
            return jsonResult(rationalMethod(parsed.inputs));
          case "mannings_open_channel":
            return jsonResult(manningsOpenChannel(parsed.inputs));
          case "state_plane_indiana_csf":
            return jsonResult(statePlaneIndianaCsf(parsed.inputs));
          case "traverse_closure":
            return jsonResult(traverseClosure(parsed.inputs));
          case "metes_and_bounds":
            return jsonResult(metesAndBoundsWriter(parsed.inputs));
          case "inverse":
            return jsonResult(inverse(parsed.inputs));
          case "bearing_bearing_intersection":
            return jsonResult(bearingBearingIntersection(parsed.inputs));
          case "bearing_distance_intersection":
            return jsonResult(bearingDistanceIntersection(parsed.inputs));
          case "distance_distance_intersection":
            return jsonResult(distanceDistanceIntersection(parsed.inputs));
          case "level_loop_adjustment":
            return jsonResult(levelLoopAdjustment(parsed.inputs));
          case "area_by_coordinates":
            return jsonResult(areaByCoordinates(parsed.inputs));
          case "curve_stakeout":
            return jsonResult(curveStakeout(parsed.inputs));
          case "trig_leveling":
            return jsonResult(trigLeveling(parsed.inputs));
          case "solar_observation":
            return jsonResult(solarObservation(parsed.inputs));
          case "grid_to_ground":
            return jsonResult(gridToGround(parsed.inputs));
        }
      },
    },
  ];
}

export const SERVER_VERSION = "0.1.0";

export function createServer(): Server {
  const server = new Server(
    {
      name: "civil3d-master-guide",
      version: SERVER_VERSION,
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  const tools = buildTools();
  const byName = new Map(tools.map((t) => [t.name, t] as const));

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: tools.map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: zodToJsonSchema(t.schema),
      })),
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const tool = byName.get(req.params.name);
    if (!tool) {
      return errorResult(`Unknown tool: ${req.params.name}`);
    }
    try {
      return await tool.handler(req.params.arguments ?? {});
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResult(`Error in ${tool.name}: ${msg}`);
    }
  });

  return server;
}
