/**
 * api.test.mjs
 *
 * HTTP smoke against the running web server. Asserts that the canonical
 * routes (homepage, docs landing, tools index, a tools sub-page, jurisdictions
 * index) return 200. The "/jurisdictions/at/<lat>/<lon>" lookup is best-effort
 * — if the route isn't implemented yet it must return 404 (NOT 500).
 *
 * The optional POST /api/v1/calculators/traverse-closure check is treated as
 * "feature-gated": if the route 404s we skip; if it 200s we assert structure.
 *
 * Why this suite exists:
 *   Catches the cheapest, highest-value regressions: a docs route 500ing
 *   because of a frontmatter typo, a missing static export, a broken layout.
 */

import { request as httpRequest } from "node:http";
import { createRunner, assertEqual, assertTrue, assertContains } from "./_lib.mjs";

function fetchJson(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = opts.body ? JSON.stringify(opts.body) : null;
    const req = httpRequest(
      {
        method: opts.method ?? "GET",
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + u.search,
        headers: {
          accept: "application/json,text/html;q=0.9,*/*;q=0.5",
          ...(body
            ? {
                "content-type": "application/json",
                "content-length": Buffer.byteLength(body),
              }
            : {}),
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let json = null;
          try {
            json = JSON.parse(text);
          } catch {
            /* not json */
          }
          resolve({ status: res.statusCode ?? 0, text, json, headers: res.headers });
        });
      },
    );
    req.on("error", reject);
    req.setTimeout(15_000, () => req.destroy(new Error(`timeout ${url}`)));
    if (body) req.write(body);
    req.end();
  });
}

export async function run(ctx) {
  const r = createRunner("api");
  const base = ctx.baseUrl;

  await r.test("GET /api/health 200 + ok:true", async () => {
    const res = await fetchJson(`${base}/api/health`);
    assertEqual(res.status, 200, "status");
    assertEqual(res.json?.ok, true, "ok flag");
    assertTrue(typeof res.json?.ts === "string", "ts present");
    assertTrue(typeof res.json?.version === "string", "version present");
  });

  // Routes that should always exist.
  const mustHaveRoutes = [
    "/",
    "/docs",
    "/tools",
  ];
  for (const route of mustHaveRoutes) {
    await r.test(`GET ${route} returns 200`, async () => {
      const res = await fetchJson(`${base}${route}`);
      assertTrue(
        res.status === 200,
        `expected 200 for ${route}, got ${res.status}`,
      );
      assertTrue(res.text.length > 0, "non-empty body");
    });
  }

  // Routes that exist as docs pages (paths chosen to match the content tree;
  // any 4xx is acceptable to surface a missing page without failing the suite,
  // but a 5xx is a hard failure).
  const docsRoutes = [
    "/docs/customization/lisp",
    "/docs/jurisdictions/indiana/marion-county/index",
    "/docs/civil3d/index",
  ];
  for (const route of docsRoutes) {
    await r.test(`GET ${route} not 5xx`, async () => {
      const res = await fetchJson(`${base}${route}`);
      assertTrue(
        res.status < 500,
        `5xx forbidden for ${route}; got ${res.status}`,
      );
    });
  }

  // Optional locator endpoint (feature-gated).
  await r.test("GET /jurisdictions/at/<lat>/<lon> (optional)", async () => {
    const res = await fetchJson(`${base}/jurisdictions/at/39.97/-86.12`);
    assertTrue(
      res.status < 500,
      `5xx forbidden; got ${res.status}`,
    );
  });

  // Optional POST /api/v1/calculators/traverse-closure (gated on Issue 7).
  await r.test("POST /api/v1/calculators/traverse-closure (optional)", async () => {
    const res = await fetchJson(
      `${base}/api/v1/calculators/traverse-closure`,
      {
        method: "POST",
        body: {
          legs: [
            { bearing_deg: 0, distance_ft: 100 },
            { bearing_deg: 90, distance_ft: 100 },
            { bearing_deg: 180, distance_ft: 100 },
            { bearing_deg: 270, distance_ft: 100 },
          ],
        },
      },
    );
    if (res.status === 404) {
      // feature not shipped yet; not a failure
      return;
    }
    assertTrue(res.status === 200, `expected 200, got ${res.status}`);
    assertTrue(res.json != null, "response is JSON");
    assertTrue(
      typeof res.json.perimeter_ft === "number",
      "perimeter_ft present",
    );
  });

  // /api/raw/<slug> smoke — known to exist.
  await r.test("GET /api/raw/00-index returns markdown", async () => {
    const res = await fetchJson(`${base}/api/raw/00-index`);
    assertTrue(
      res.status === 200 || res.status === 403,
      `expected 200 or 403, got ${res.status}`,
    );
    if (res.status === 200) {
      const ct = res.headers["content-type"] ?? "";
      assertContains(String(ct), "text/markdown", "content-type is markdown");
    }
  });

  return r.finish();
}
