/**
 * Unit tests for the service-worker strategy primitives.
 *
 * Uses vitest (available in the monorepo root). The service-worker source is
 * evaluated with `new Function(...)` against a fake CacheStorage and a stubbed
 * fetch so the strategy functions can be exercised in isolation.
 *
 * A sibling sw-strategies.test.mjs covers the same checks using Node's
 * built-in test runner for environments where vitest is unavailable.
 */

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

type SWInternals = {
  cacheFirst: (req: Request) => Promise<Response>;
  networkFirst: (req: Request) => Promise<Response>;
  staleWhileRevalidate: (req: Request) => Promise<Response>;
  routeStrategy: (url: URL) => string | null;
  CACHE_VERSION: string;
};

class FakeCache {
  store = new Map<string, Response>();
  async match(req: Request | string) {
    const key = typeof req === "string" ? req : req.url;
    const r = this.store.get(key);
    return r ? r.clone() : undefined;
  }
  async put(req: Request | string, res: Response) {
    const key = typeof req === "string" ? req : req.url;
    this.store.set(key, res);
  }
  async add(req: Request | string) {
    const r = await fetch(typeof req === "string" ? req : req.url);
    if (r.ok) await this.put(req, r);
  }
  async addAll(reqs: Array<Request | string>) {
    await Promise.all(reqs.map((r) => this.add(r)));
  }
}

const fakeCacheStorage = {
  caches: new Map<string, FakeCache>(),
  async open(name: string) {
    if (!this.caches.has(name)) this.caches.set(name, new FakeCache());
    return this.caches.get(name)!;
  },
  async match(req: Request | string) {
    for (const c of this.caches.values()) {
      const r = await c.match(req);
      if (r) return r;
    }
    return undefined;
  },
  async keys() {
    return Array.from(this.caches.keys());
  },
  async delete(name: string) {
    return this.caches.delete(name);
  },
};

let internals: SWInternals;

beforeAll(() => {
  (globalThis as any).self = globalThis;
  (globalThis as any).self.location = { origin: "https://example.test" };
  (globalThis as any).self.skipWaiting = () => {};
  (globalThis as any).self.clients = { claim: async () => {} };
  (globalThis as any).self.addEventListener = () => {};
  (globalThis as any).caches = fakeCacheStorage;
  (globalThis as any).__SW_TEST_HOOK__ = (i: SWInternals) => {
    internals = i;
  };

  const swSrc = readFileSync(resolve(__dirname, "../public/sw.js"), "utf8");
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  new Function(swSrc)();
});

afterEach(() => {
  fakeCacheStorage.caches.clear();
  vi.restoreAllMocks();
});

describe("routeStrategy", () => {
  const u = (p: string) => new URL(p, "https://example.test");

  it("uses network-only for /api/*", () => {
    expect(internals.routeStrategy(u("/api/chat"))).toBe("network-only");
  });
  it("caches calculator pages", () => {
    expect(internals.routeStrategy(u("/tools/traverse-closure"))).toBe("cache-first");
    expect(internals.routeStrategy(u("/tools"))).toBe("cache-first");
  });
  it("caches embed widgets", () => {
    expect(internals.routeStrategy(u("/embed/calc/inverse"))).toBe("cache-first");
  });
  it("uses network-first for the LISP library", () => {
    expect(internals.routeStrategy(u("/customization/lisp/index"))).toBe("network-first");
  });
  it("caches GPS jurisdiction lookup", () => {
    expect(internals.routeStrategy(u("/jurisdictions/at/39.97/-86.12"))).toBe("cache-first");
  });
  it("caches /offline-data/*", () => {
    expect(internals.routeStrategy(u("/offline-data/jurisdictions.json"))).toBe("cache-first");
  });
  it("caches /field and /field/lisp-cheatsheet", () => {
    expect(internals.routeStrategy(u("/field"))).toBe("cache-first");
    expect(internals.routeStrategy(u("/field/lisp-cheatsheet"))).toBe("cache-first");
  });
  it("uses stale-while-revalidate for static assets", () => {
    expect(internals.routeStrategy(u("/_next/static/chunks/abc.js"))).toBe("stale-while-revalidate");
    expect(internals.routeStrategy(u("/icons/icon-192.png"))).toBe("stale-while-revalidate");
  });
  it("rejects cross-origin URLs", () => {
    expect(internals.routeStrategy(new URL("https://other/foo"))).toBe(null);
  });
});

describe("cacheFirst", () => {
  it("returns the cached response when present", async () => {
    const url = "https://example.test/tools/inverse";
    const cache = await fakeCacheStorage.open(internals.CACHE_VERSION);
    await cache.put(url, new Response("from-cache", { status: 200 }));
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("from-net", { status: 200 }),
    );
    const res = await internals.cacheFirst(new Request(url));
    expect(await res.text()).toBe("from-cache");
  });

  it("falls back to fetch when cache is empty and stores the result", async () => {
    const url = "https://example.test/tools/new";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("net-body", { status: 200 }),
    );
    const res = await internals.cacheFirst(new Request(url));
    expect(await res.text()).toBe("net-body");
    const cache = await fakeCacheStorage.open(internals.CACHE_VERSION);
    expect(await (await cache.match(url))?.text()).toBe("net-body");
  });
});

describe("networkFirst", () => {
  it("prefers the network and updates cache", async () => {
    const url = "https://example.test/customization/lisp/index";
    const cache = await fakeCacheStorage.open(internals.CACHE_VERSION);
    await cache.put(url, new Response("stale", { status: 200 }));
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("fresh", { status: 200 }),
    );
    const res = await internals.networkFirst(new Request(url));
    expect(await res.text()).toBe("fresh");
    expect(await (await cache.match(url))?.text()).toBe("fresh");
  });

  it("falls back to cache on network failure", async () => {
    const url = "https://example.test/customization/lisp/index";
    const cache = await fakeCacheStorage.open(internals.CACHE_VERSION);
    await cache.put(url, new Response("offline-copy", { status: 200 }));
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("net down"));
    const res = await internals.networkFirst(new Request(url));
    expect(await res.text()).toBe("offline-copy");
  });
});

describe("staleWhileRevalidate", () => {
  it("returns cached value immediately", async () => {
    const url = "https://example.test/_next/static/x.js";
    const cache = await fakeCacheStorage.open(internals.CACHE_VERSION);
    await cache.put(url, new Response("cached", { status: 200 }));
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("fresh", { status: 200 }),
    );
    const res = await internals.staleWhileRevalidate(new Request(url));
    expect(await res.text()).toBe("cached");
  });

  it("falls through to fetch on cache miss", async () => {
    const url = "https://example.test/_next/static/y.js";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("fresh", { status: 200 }),
    );
    const res = await internals.staleWhileRevalidate(new Request(url));
    expect(await res.text()).toBe("fresh");
  });
});
