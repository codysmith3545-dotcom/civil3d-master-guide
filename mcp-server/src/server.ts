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
  GetResourceIndexInput,
  RunCalculatorInput,
} from "./schemas.js";
import {
  verticalCurve,
  horizontalCurve,
  rationalMethod,
  manningsOpenChannel,
  statePlaneIndianaCsf,
  traverseClosure,
  metesAndBoundsWriter,
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
        "List jurisdictional pages (state, county, municipality) under content/jurisdictions/. Optionally filter by state slug.",
      schema: ListJurisdictionsInput,
      handler: async (args) => {
        const parsed = ListJurisdictionsInput.parse(args);
        const root = await resolveKbRoot();
        const items = await listJurisdictions(root, parsed.state);
        return jsonResult({ count: items.length, items });
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
      name: "run_calculator",
      description:
        "Run a built-in engineering calculator. Available calculators: 'vertical_curve', 'horizontal_curve', 'rational_method', 'mannings_open_channel', 'state_plane_indiana_csf', 'traverse_closure', 'metes_and_bounds'. Provide `name` and the corresponding `inputs` object.",
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
        }
      },
    },
  ];
}

export function createServer(): Server {
  const server = new Server(
    {
      name: "civil3d-master-guide",
      version: "0.1.0",
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
