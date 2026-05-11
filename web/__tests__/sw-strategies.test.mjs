/**
 * Sibling of sw-strategies.test.ts that uses Node's built-in test runner so
 * the strategy primitives can be exercised with zero npm deps.
 *
 * Run with:  node --test web/__tests__/sw-strategies.test.mjs
 */

import { test, before, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

class FakeCache {
  constructor() {
    this.store = new Map();
  }
  async match(req) {
    const key = typeof req === "string" ? req : req.url;
    const r = this.store.get(key);
    return r ? r.clone() : undefined;
  }
  async put(req, res) {
    const key = typeof req === "string" ? req : req.url;
    this.store.set(key, res);
  }
  async add(req) {
    const r = await fetch(typeof req === "string" ? req : req.url);
    if (r.ok) await this.put(req, r);
  }
  async addAll(reqs) {
    await Promise.all(reqs.map((r) => this.add(r)));
  }
}

const fakeCacheStorage = {
  caches: new Map(),
  async open(name) {
    if (!this.caches.has(name)) this.caches.set(name, new FakeCache());
    return this.caches.get(name);
  },
  async match(req) {
    for (const c of this.caches.values()) {
      const r = await c.match(req);
      if (r) return r;
    }
    return undefined;
  },
  async keys() {
    return Array.from(this.caches.keys());
  },
  async delete(name) {
    return this.caches.delete(name);
  },
};

let internals;
const originalFetch = globalThis.fetch;

before(() => {
  globalThis.self = globalThis;
  globalThis.self.location = { origin: "https://example.test" };
  globalThis.self.skipWaiting = () => {};
  globalThis.self.clients = { claim: async () => {} };
  globalThis.self.addEventListener = () => {};
  globalThis.caches = fakeCacheStorage;
  globalThis.__SW_TEST_HOOK__ = (i) => {
    internals = i;
  };
  const swSrc = readFileSync(resolve(__dirname, "../public/sw.js"), "utf8");
  // eslint-disable-next-line no-new-func
  new Function(swSrc)();
});

beforeEach(() => {
  fakeCacheStorage.caches.clear();
  globalThis.fetch = originalFetch;
});

const u = (p) => new URL(p, "https://example.test");

test("routeStrategy: network-only for /api/*", () => {
  assert.equal(internals.routeStrategy(u("/api/chat")), "network-only");
});
test("routeStrategy: cache-first for calculator pages", () => {
  assert.equal(internals.routeStrategy(u("/tools/traverse-closure")), "cache-first");
  assert.equal(internals.routeStrategy(u("/tools")), "cache-first");
});
test("routeStrategy: cache-first for embed widgets", () => {
  assert.equal(internals.routeStrategy(u("/embed/calc/inverse")), "cache-first");
});
test("routeStrategy: network-first for the LISP library", () => {
  assert.equal(internals.routeStrategy(u("/customization/lisp/index")), "network-first");
});
test("routeStrategy: cache-first for GPS jurisdiction lookup", () => {
  assert.equal(internals.routeStrategy(u("/jurisdictions/at/39.97/-86.12")), "cache-first");
});
test("routeStrategy: cache-first for /offline-data/*", () => {
  assert.equal(internals.routeStrategy(u("/offline-data/jurisdictions.json")), "cache-first");
});
test("routeStrategy: cache-first for /field and /field/lisp-cheatsheet", () => {
  assert.equal(internals.routeStrategy(u("/field")), "cache-first");
  assert.equal(internals.routeStrategy(u("/field/lisp-cheatsheet")), "cache-first");
});
test("routeStrategy: stale-while-revalidate for static assets", () => {
  assert.equal(internals.routeStrategy(u("/_next/static/chunks/abc.js")), "stale-while-revalidate");
  assert.equal(internals.routeStrategy(u("/icons/icon-192.png")), "stale-while-revalidate");
});
test("routeStrategy: rejects cross-origin URLs", () => {
  assert.equal(internals.routeStrategy(new URL("https://other/foo")), null);
});

test("cacheFirst: returns cached response", async () => {
  const url = "https://example.test/tools/inverse";
  const cache = await fakeCacheStorage.open(internals.CACHE_VERSION);
  await cache.put(url, new Response("from-cache", { status: 200 }));
  globalThis.fetch = async () => new Response("from-net", { status: 200 });
  const res = await internals.cacheFirst(new Request(url));
  assert.equal(await res.text(), "from-cache");
});

test("cacheFirst: falls back to fetch and stores result", async () => {
  const url = "https://example.test/tools/new";
  globalThis.fetch = async () => new Response("net-body", { status: 200 });
  const res = await internals.cacheFirst(new Request(url));
  assert.equal(await res.text(), "net-body");
  const cache = await fakeCacheStorage.open(internals.CACHE_VERSION);
  const cached = await cache.match(url);
  assert.ok(cached);
  assert.equal(await cached.text(), "net-body");
});

test("networkFirst: prefers network, updates cache", async () => {
  const url = "https://example.test/customization/lisp/index";
  const cache = await fakeCacheStorage.open(internals.CACHE_VERSION);
  await cache.put(url, new Response("stale", { status: 200 }));
  globalThis.fetch = async () => new Response("fresh", { status: 200 });
  const res = await internals.networkFirst(new Request(url));
  assert.equal(await res.text(), "fresh");
  assert.equal(await (await cache.match(url)).text(), "fresh");
});

test("networkFirst: falls back to cache on network failure", async () => {
  const url = "https://example.test/customization/lisp/index";
  const cache = await fakeCacheStorage.open(internals.CACHE_VERSION);
  await cache.put(url, new Response("offline-copy", { status: 200 }));
  globalThis.fetch = async () => {
    throw new Error("net down");
  };
  const res = await internals.networkFirst(new Request(url));
  assert.equal(await res.text(), "offline-copy");
});

test("staleWhileRevalidate: returns cached immediately", async () => {
  const url = "https://example.test/_next/static/x.js";
  const cache = await fakeCacheStorage.open(internals.CACHE_VERSION);
  await cache.put(url, new Response("cached", { status: 200 }));
  globalThis.fetch = async () => new Response("fresh", { status: 200 });
  const res = await internals.staleWhileRevalidate(new Request(url));
  assert.equal(await res.text(), "cached");
});

test("staleWhileRevalidate: falls through to fetch on miss", async () => {
  const url = "https://example.test/_next/static/y.js";
  globalThis.fetch = async () => new Response("fresh", { status: 200 });
  const res = await internals.staleWhileRevalidate(new Request(url));
  assert.equal(await res.text(), "fresh");
});
