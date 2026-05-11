/* Civil 3D Master Guide service worker.
 *
 * Strategies:
 *  - /api/*                    : network-only (no caching of personalized/rate-limited data)
 *  - /tools, /tools/*          : cache-first with revalidation (calculators offline)
 *  - /embed/calc/*             : cache-first (embeddable calculator widgets)
 *  - /customization/lisp*      : network-first, fall back to cache (LISP library)
 *  - /jurisdictions/at/*       : cache-first (GPS lookup, served from cache when offline)
 *  - /offline-data/*           : cache-first (pre-cached at install)
 *  - /field, /field/*          : cache-first (field-day landing page + cheat sheet)
 *  - /docs/*                   : cache-first with background revalidation
 *  - /_next/static/*, common asset extensions : stale-while-revalidate
 *  - everything else           : stale-while-revalidate
 *
 * Skip caching responses larger than 5 MB. No external dependencies.
 */

const CACHE_VERSION = "c3d-cache-v1";
const PRECACHE_URLS = [
  "/",
  "/field",
  "/tools",
  "/manifest.json",
  "/search-index.json",
  "/offline-data/jurisdictions.json",
];
const MAX_CACHE_BYTES = 5 * 1024 * 1024;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) =>
        Promise.all(
          PRECACHE_URLS.map((url) =>
            cache
              .add(new Request(url, { credentials: "same-origin" }))
              .catch(() => undefined),
          ),
        ),
      ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("c3d-cache-") && k !== CACHE_VERSION)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data) return;
  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }
  // Allow the OfflineIndicator UI to ask "is this URL cached?"
  if (data.type === "IS_CACHED" && typeof data.url === "string") {
    const port = event.ports && event.ports[0];
    caches
      .match(data.url)
      .then((res) => {
        if (port) port.postMessage({ cached: !!res });
      })
      .catch(() => {
        if (port) port.postMessage({ cached: false });
      });
  }
});

function isTooLarge(response) {
  const len = response.headers.get("content-length");
  if (!len) return false;
  const n = Number(len);
  return Number.isFinite(n) && n > MAX_CACHE_BYTES;
}

async function safePut(cache, request, response) {
  if (!response || !response.ok) return;
  if (response.type === "opaque" || response.type === "opaqueredirect") return;
  if (isTooLarge(response)) return;
  try {
    await cache.put(request, response);
  } catch {
    // quota or other put errors are non-fatal
  }
}

async function networkOnly(request) {
  return fetch(request);
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then(async (resp) => {
      await safePut(cache, request, resp.clone());
      return resp;
    })
    .catch(() => undefined);
  return cached || (await network) || Response.error();
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  if (cached) {
    // Background revalidation
    fetch(request)
      .then((resp) => safePut(cache, request, resp.clone()))
      .catch(() => undefined);
    return cached;
  }
  try {
    const resp = await fetch(request);
    await safePut(cache, request, resp.clone());
    return resp;
  } catch {
    return Response.error();
  }
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const resp = await fetch(request);
    await safePut(cache, request, resp.clone());
    return resp;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return Response.error();
  }
}

// Route classifier — pure function so it can be unit-tested in isolation.
function routeStrategy(url) {
  if (url.origin !== self.location.origin) return null;
  const p = url.pathname;
  if (p.startsWith("/api/")) return "network-only";
  if (p === "/tools" || p.startsWith("/tools/")) return "cache-first";
  if (p.startsWith("/embed/calc/")) return "cache-first";
  if (p.startsWith("/customization/lisp")) return "network-first";
  if (p.startsWith("/jurisdictions/at/")) return "cache-first";
  if (p.startsWith("/offline-data/")) return "cache-first";
  if (p === "/field" || p.startsWith("/field/")) return "cache-first";
  if (p.startsWith("/docs/")) return "cache-first";
  if (p.startsWith("/_next/static/") || p.startsWith("/_next/image")) return "stale-while-revalidate";
  if (/\.(js|mjs|css|woff2?|png|jpg|jpeg|svg|ico|webp|gif)$/.test(p)) return "stale-while-revalidate";
  return "stale-while-revalidate";
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const strategy = routeStrategy(url);
  if (!strategy) return;

  switch (strategy) {
    case "network-only":
      event.respondWith(networkOnly(request));
      return;
    case "cache-first":
      event.respondWith(cacheFirst(request));
      return;
    case "network-first":
      event.respondWith(networkFirst(request));
      return;
    case "stale-while-revalidate":
    default:
      event.respondWith(staleWhileRevalidate(request));
      return;
  }
});

// Test hook — when this file is imported by the unit-test harness (which sets
// globalThis.__SW_TEST_HOOK__ before evaluating sw.js), publish the strategy
// primitives so they can be exercised against a fake CacheStorage and fetch.
if (typeof globalThis !== "undefined" && globalThis.__SW_TEST_HOOK__) {
  globalThis.__SW_TEST_HOOK__({
    cacheFirst,
    networkFirst,
    staleWhileRevalidate,
    networkOnly,
    routeStrategy,
    safePut,
    CACHE_VERSION,
  });
}
