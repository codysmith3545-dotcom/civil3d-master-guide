/**
 * Public-API test harness.
 *
 * The web/ workspace has no test runner wired up yet. Rather than introduce a
 * new dependency, this file is a self-contained Node script: each `test()`
 * is run sequentially, failures throw, and a final summary line is printed.
 *
 * Run with:
 *   pnpm --filter web exec tsx web/__tests__/public-api.test.ts
 * or any equivalent ts runner. When a runner is later added (vitest/jest),
 * the `test()` shim below can be replaced by the runner's globals without
 * changing the body of the assertions.
 *
 * The tests instantiate the route handlers directly and pass synthetic
 * `Request` objects. This avoids spinning up the Next dev server and keeps
 * the harness fast (<1s on a cold start).
 */

import { GET as pagesGet } from "../app/api/v1/pages/[...slug]/route";
import { GET as searchGet } from "../app/api/v1/search/route";
import { GET as commandsGet } from "../app/api/v1/commands/route";
import { GET as jurisdictionsGet } from "../app/api/v1/jurisdictions/route";
import { GET as jurAtGet } from "../app/api/v1/jurisdictions/at/route";
import { GET as jurRulesGet } from "../app/api/v1/jurisdictions/rules/route";
import {
  GET as calcListGet,
  OPTIONS as calcListOptions,
} from "../app/api/v1/calculators/route";
import {
  GET as calcOneGet,
  POST as calcOnePost,
} from "../app/api/v1/calculators/[name]/route";
import { GET as lispListGet } from "../app/api/v1/lisp/route";
import { POST as decodeDeedPost } from "../app/api/v1/decode-deed/route";
import { GET as resourcesGet } from "../app/api/v1/resources/route";
import { GET as openapiGet } from "../app/api/v1/openapi.json/route";
import { __resetRateLimit } from "../lib/api/rate-limit";

type NextLike = Request & { ip?: string };

function mkReq(url: string, init: RequestInit & { ip?: string } = {}): NextLike {
  const headers = new Headers(init.headers);
  if (!headers.get("x-forwarded-for")) {
    headers.set("x-forwarded-for", init.ip ?? `127.0.0.${Math.floor(Math.random() * 250) + 1}`);
  }
  const req = new Request(url, { ...init, headers }) as NextLike;
  return req;
}

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    passed += 1;
    // eslint-disable-next-line no-console
    console.log(`  ok  ${name}`);
  } catch (err) {
    failed += 1;
    const msg = err instanceof Error ? err.stack ?? err.message : String(err);
    failures.push(`${name}\n${msg}`);
    // eslint-disable-next-line no-console
    console.log(`  FAIL ${name}\n${msg}`);
  }
}

function expect(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

async function asJson(res: Response): Promise<unknown> {
  return JSON.parse(await res.text());
}

async function run() {
  // -------------------------------------------------------------------------
  // CORS preflight
  // -------------------------------------------------------------------------
  await test("OPTIONS preflight sets CORS headers", async () => {
    const res = await calcListOptions();
    expect(res.status === 204, `expected 204, got ${res.status}`);
    expect(res.headers.get("access-control-allow-origin") === "*", "no CORS *");
    expect(
      (res.headers.get("access-control-allow-methods") ?? "").includes("GET"),
      "GET not allowed",
    );
  });

  // -------------------------------------------------------------------------
  // GET /calculators — list shape
  // -------------------------------------------------------------------------
  await test("GET /calculators returns 17 calculators with input schemas", async () => {
    __resetRateLimit();
    const res = await calcListGet(mkReq("http://t/api/v1/calculators"));
    expect(res.status === 200, `status ${res.status}`);
    expect(res.headers.get("access-control-allow-origin") === "*", "no CORS");
    expect(
      (res.headers.get("cache-control") ?? "").includes("max-age=300"),
      "missing cache-control",
    );
    const body = (await asJson(res)) as { count: number; items: { name: string; inputSchema: unknown }[] };
    expect(body.count === 17, `expected 17 calcs, got ${body.count}`);
    expect(body.items.every((i) => i.inputSchema && typeof i.inputSchema === "object"), "missing inputSchema");
  });

  // -------------------------------------------------------------------------
  // POST /calculators/traverse_closure — happy path
  // -------------------------------------------------------------------------
  await test("POST /calculators/traverse_closure returns numeric perimeter", async () => {
    __resetRateLimit();
    const body = {
      legs: [
        { bearing_deg: 0, distance_ft: 100 },
        { bearing_deg: 90, distance_ft: 100 },
        { bearing_deg: 180, distance_ft: 100 },
        { bearing_deg: 270, distance_ft: 100 },
      ],
    };
    const res = await calcOnePost(
      mkReq("http://t/api/v1/calculators/traverse_closure", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "content-type": "application/json" },
      }),
      { params: { name: "traverse_closure" } },
    );
    expect(res.status === 200, `status ${res.status}`);
    const json = (await asJson(res)) as { name: string; result: { perimeter_ft?: number } };
    expect(json.name === "traverse_closure", "wrong name");
    expect(typeof json.result.perimeter_ft === "number", "no perimeter_ft");
    expect(Math.abs((json.result.perimeter_ft as number) - 400) < 0.5, "perimeter ~400");
  });

  // -------------------------------------------------------------------------
  // POST /calculators/{name} — invalid input
  // -------------------------------------------------------------------------
  await test("POST /calculators/rational_method rejects missing fields with 400", async () => {
    __resetRateLimit();
    const res = await calcOnePost(
      mkReq("http://t/api/v1/calculators/rational_method", {
        method: "POST",
        body: JSON.stringify({ c: 0.5 }),
        headers: { "content-type": "application/json" },
      }),
      { params: { name: "rational_method" } },
    );
    expect(res.status === 400, `status ${res.status}`);
    const json = (await asJson(res)) as { error: { code: string } };
    expect(json.error?.code === "invalid_input", "wrong error code");
  });

  await test("POST /decode-deed rejects empty body with 400", async () => {
    __resetRateLimit();
    const res = await decodeDeedPost(
      mkReq("http://t/api/v1/decode-deed", {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "content-type": "application/json" },
      }),
    );
    expect(res.status === 400, `status ${res.status}`);
  });

  await test("POST /decode-deed parses a simple deed", async () => {
    __resetRateLimit();
    const text =
      'Thence N 12° 34\' 56" E, 100.00 feet; thence S 77° 25\' 04" E, 100.00 feet.';
    const res = await decodeDeedPost(
      mkReq("http://t/api/v1/decode-deed", {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: { "content-type": "application/json" },
      }),
    );
    expect(res.status === 200, `status ${res.status}`);
    const json = (await asJson(res)) as { courses: unknown[] };
    expect(json.courses.length === 2, `expected 2 courses, got ${json.courses.length}`);
  });

  // -------------------------------------------------------------------------
  // GET /search
  // -------------------------------------------------------------------------
  await test("GET /search requires q", async () => {
    __resetRateLimit();
    const res = await searchGet(mkReq("http://t/api/v1/search"));
    expect(res.status === 400, `status ${res.status}`);
  });

  await test("GET /search returns array of hits", async () => {
    __resetRateLimit();
    const res = await searchGet(mkReq("http://t/api/v1/search?q=civil"));
    expect(res.status === 200, `status ${res.status}`);
    const json = (await asJson(res)) as { hits: unknown[] };
    expect(Array.isArray(json.hits), "hits is not an array");
  });

  // -------------------------------------------------------------------------
  // GET /commands
  // -------------------------------------------------------------------------
  await test("GET /commands returns { count, items }", async () => {
    __resetRateLimit();
    const res = await commandsGet(mkReq("http://t/api/v1/commands"));
    expect(res.status === 200, `status ${res.status}`);
    const json = (await asJson(res)) as { count: number; items: unknown[] };
    expect(typeof json.count === "number", "no count");
    expect(Array.isArray(json.items), "no items[]");
  });

  // -------------------------------------------------------------------------
  // GET /jurisdictions
  // -------------------------------------------------------------------------
  await test("GET /jurisdictions returns states + flat", async () => {
    __resetRateLimit();
    const res = await jurisdictionsGet(mkReq("http://t/api/v1/jurisdictions"));
    expect(res.status === 200, `status ${res.status}`);
    const json = (await asJson(res)) as { states: unknown[]; flat: unknown[] };
    expect(Array.isArray(json.states), "no states");
    expect(Array.isArray(json.flat), "no flat");
  });

  await test("GET /jurisdictions/at rejects missing lat", async () => {
    __resetRateLimit();
    const res = await jurAtGet(mkReq("http://t/api/v1/jurisdictions/at?lng=-86"));
    expect(res.status === 400, `status ${res.status}`);
  });

  await test("GET /jurisdictions/rules requires slug or lat/lng", async () => {
    __resetRateLimit();
    const res = await jurRulesGet(mkReq("http://t/api/v1/jurisdictions/rules"));
    expect(res.status === 400, `status ${res.status}`);
  });

  // -------------------------------------------------------------------------
  // GET /pages
  // -------------------------------------------------------------------------
  await test("GET /pages/glossary returns the glossary", async () => {
    __resetRateLimit();
    const res = await pagesGet(
      mkReq("http://t/api/v1/pages/glossary"),
      { params: { slug: ["glossary"] } },
    );
    expect(res.status === 200, `status ${res.status}`);
    const json = (await asJson(res)) as { slug: string; body: string };
    expect(json.slug === "glossary", `wrong slug ${json.slug}`);
    expect(typeof json.body === "string" && json.body.length > 0, "no body");
  });

  await test("GET /pages/nonsense returns 404", async () => {
    __resetRateLimit();
    const res = await pagesGet(
      mkReq("http://t/api/v1/pages/does-not-exist"),
      { params: { slug: ["does-not-exist"] } },
    );
    expect(res.status === 404, `status ${res.status}`);
  });

  // -------------------------------------------------------------------------
  // GET /lisp
  // -------------------------------------------------------------------------
  await test("GET /lisp returns an items array", async () => {
    __resetRateLimit();
    const res = await lispListGet(mkReq("http://t/api/v1/lisp"));
    expect(res.status === 200, `status ${res.status}`);
    const json = (await asJson(res)) as { items: unknown[] };
    expect(Array.isArray(json.items), "no items");
  });

  // -------------------------------------------------------------------------
  // GET /resources
  // -------------------------------------------------------------------------
  await test("GET /resources returns category buckets", async () => {
    __resetRateLimit();
    const res = await resourcesGet(mkReq("http://t/api/v1/resources"));
    expect(res.status === 200, `status ${res.status}`);
    const json = (await asJson(res)) as Record<string, unknown>;
    expect(typeof json === "object" && json !== null, "no object");
  });

  // -------------------------------------------------------------------------
  // GET /openapi.json
  // -------------------------------------------------------------------------
  await test("GET /openapi.json declares paths and components", async () => {
    const res = await openapiGet(mkReq("http://t/api/v1/openapi.json"));
    expect(res.status === 200, `status ${res.status}`);
    const json = (await asJson(res)) as { openapi: string; paths: Record<string, unknown>; components: { schemas: Record<string, unknown> } };
    expect(json.openapi.startsWith("3."), `bad openapi version ${json.openapi}`);
    expect(typeof json.paths["/calculators"] === "object", "no /calculators path");
    expect(json.components.schemas["Error"], "no Error schema");
  });

  // -------------------------------------------------------------------------
  // Rate limit: 60/min/IP, 61st gets 429
  // -------------------------------------------------------------------------
  await test("Rate limit: 61st request from one IP returns 429", async () => {
    __resetRateLimit();
    const ip = "10.0.0.1";
    let lastStatus = 0;
    for (let i = 0; i < 60; i++) {
      const r = await calcListGet(mkReq("http://t/api/v1/calculators", { ip }));
      lastStatus = r.status;
    }
    expect(lastStatus === 200, `expected 60th to be 200, got ${lastStatus}`);
    const r = await calcListGet(mkReq("http://t/api/v1/calculators", { ip }));
    expect(r.status === 429, `expected 429, got ${r.status}`);
    const json = (await asJson(r)) as { error: { code: string } };
    expect(json.error.code === "rate_limited", "wrong code");
  });

  // -------------------------------------------------------------------------
  // API key bypass
  // -------------------------------------------------------------------------
  await test("X-API-Key bypasses the rate limit", async () => {
    __resetRateLimit();
    process.env.PUBLIC_API_KEYS = "letmein";
    const ip = "10.0.0.2";
    for (let i = 0; i < 70; i++) {
      const r = await calcListGet(
        mkReq("http://t/api/v1/calculators", {
          ip,
          headers: { "x-api-key": "letmein" },
        }),
      );
      expect(r.status === 200, `req ${i} got ${r.status}`);
    }
    delete process.env.PUBLIC_API_KEYS;
  });

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  // eslint-disable-next-line no-console
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});
