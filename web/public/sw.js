/* Civil 3D Master Guide service worker.
 * Strategies:
 *  - /api/*          : network-only (no caching of personalized/rate-limited data)
 *  - /docs/*         : cache-first with background revalidation
 *  - everything else : stale-while-revalidate
 * Skip caching responses larger than 5 MB.
 */

const CACHE_VERSION = "c3d-cache-v1";
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/search-index.json",
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
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
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

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkOnly(request));
    return;
  }

  if (url.pathname.startsWith("/docs/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});
