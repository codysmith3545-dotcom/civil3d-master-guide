import type { NextRequest } from "next/server";
import { listCalculators } from "@/lib/api/calculators";
import { jsonResponse, optionsResponse } from "@/lib/api/response";

export const runtime = "nodejs";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const serverUrl = `${url.protocol}//${url.host}/api/v1`;
  const calcEnum = listCalculators().map((c) => c.name);

  const spec = {
    openapi: "3.1.0",
    info: {
      title: "Civil 3D Master Guide — Public API",
      version: "1.0.0",
      description:
        "Read-only HTTP mirror of the Civil 3D Master Guide MCP server. Lets external integrators consume the knowledge base (pages, search, commands, jurisdictions, calculators, resources) without standing up an MCP client.",
      license: { name: "CC-BY-SA-4.0 AND MIT" },
    },
    servers: [{ url: serverUrl }],
    components: {
      schemas: {
        Error: {
          type: "object",
          required: ["error"],
          properties: {
            error: {
              type: "object",
              required: ["code", "message"],
              properties: {
                code: {
                  type: "string",
                  enum: ["invalid_input", "not_found", "rate_limited", "internal"],
                },
                message: { type: "string" },
              },
            },
          },
        },
        Page: {
          type: "object",
          required: ["slug", "title", "frontmatter", "body"],
          properties: {
            slug: { type: "string" },
            href: { type: "string" },
            title: { type: "string" },
            section: { type: ["string", "null"] },
            frontmatter: { type: "object", additionalProperties: true },
            body: { type: "string" },
          },
        },
        SearchHit: {
          type: "object",
          required: ["slug", "title", "score", "excerpt"],
          properties: {
            slug: { type: "string" },
            href: { type: "string" },
            title: { type: "string" },
            score: { type: "number" },
            excerpt: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
          },
        },
      },
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
          description:
            "Optional. Bypasses the 60 req/min IP rate limit when the supplied key matches `PUBLIC_API_KEYS` on the server.",
        },
      },
    },
    paths: {
      "/pages/{slug}": {
        get: {
          summary: "Fetch a single markdown page",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              description: "Path-style slug (e.g. `civil3d/commands/index`).",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Page" } } },
            },
            "404": { description: "Page not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            "429": { description: "Rate limited", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/search": {
        get: {
          summary: "Full-text search the knowledge base",
          parameters: [
            { name: "q", in: "query", required: true, schema: { type: "string" } },
            { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 10 } },
          ],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      query: { type: "string" },
                      count: { type: "integer" },
                      hits: { type: "array", items: { $ref: "#/components/schemas/SearchHit" } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/commands": {
        get: {
          summary: "List Civil 3D commands",
          parameters: [{ name: "category", in: "query", required: false, schema: { type: "string" } }],
          responses: { "200": { description: "OK" } },
        },
      },
      "/jurisdictions": {
        get: {
          summary: "List jurisdictions as a state -> county -> municipality tree",
          parameters: [{ name: "state", in: "query", required: false, schema: { type: "string" } }],
          responses: { "200": { description: "OK" } },
        },
      },
      "/jurisdictions/at": {
        get: {
          summary: "Find the jurisdiction containing a GPS point",
          parameters: [
            { name: "lat", in: "query", required: true, schema: { type: "number", minimum: -90, maximum: 90 } },
            { name: "lng", in: "query", required: true, schema: { type: "number", minimum: -180, maximum: 180 } },
          ],
          responses: { "200": { description: "OK" } },
        },
      },
      "/jurisdictions/rules": {
        get: {
          summary: "Typed rules for a jurisdiction (cascades muni -> county -> state)",
          parameters: [
            { name: "slug", in: "query", required: false, schema: { type: "string" } },
            { name: "lat", in: "query", required: false, schema: { type: "number" } },
            { name: "lng", in: "query", required: false, schema: { type: "number" } },
          ],
          responses: { "200": { description: "OK" } },
        },
      },
      "/calculators": {
        get: { summary: "List available calculators with JSON Schema for each input", responses: { "200": { description: "OK" } } },
      },
      "/calculators/{name}": {
        get: {
          summary: "Describe a calculator (input schema, invocation hint)",
          parameters: [{ name: "name", in: "path", required: true, schema: { type: "string", enum: calcEnum } }],
          responses: { "200": { description: "OK" }, "404": { description: "Calculator not found" } },
        },
        post: {
          summary: "Run a calculator",
          parameters: [{ name: "name", in: "path", required: true, schema: { type: "string", enum: calcEnum } }],
          requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
          responses: { "200": { description: "OK" }, "400": { description: "Invalid input" }, "404": { description: "Calculator not found" } },
        },
      },
      "/lisp": { get: { summary: "List curated LISP routines", responses: { "200": { description: "OK" } } } },
      "/lisp/{name}": {
        get: {
          summary: "Fetch a LISP routine's source and documentation",
          parameters: [{ name: "name", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "OK" }, "404": { description: "Routine not found" } },
        },
      },
      "/decode-deed": {
        post: {
          summary: "Parse a metes-and-bounds deed description into courses",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { type: "object", required: ["text"], properties: { text: { type: "string", maxLength: 50000 } } },
              },
            },
          },
          responses: { "200": { description: "OK" }, "400": { description: "Invalid input" } },
        },
      },
      "/resources": { get: { summary: "Curated outside-resource index", responses: { "200": { description: "OK" } } } },
    },
    security: [{}, { ApiKeyAuth: [] }],
  };
  return jsonResponse(spec);
}
