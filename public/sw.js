const CACHE_VERSION = "v4";
const STATIC_CACHE = `baby-duvaby-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `baby-duvaby-runtime-${CACHE_VERSION}`;
const CACHE_PREFIX = "baby-duvaby-";
const STATIC_ASSET_DESTINATIONS = new Set([
  "script",
  "style",
  "font",
  "image",
  "worker"
]);
const PRECACHE_URLS = ["/manifest.webmanifest", "/favicon.svg", "/logo-baby-duvaby.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => Promise.resolve())
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (
            key.startsWith(CACHE_PREFIX) &&
            key !== STATIC_CACHE &&
            key !== RUNTIME_CACHE
          ) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      )
    )
  );
  self.clients.claim();
});

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const freshResponse = await fetch(request);
    if (freshResponse && freshResponse.status === 200) {
      cache.put(request, freshResponse.clone());
    }
    return freshResponse;
  } catch {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return fetch(request);
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  const networkFetch = fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);

  return cachedResponse || networkFetch;
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;

  if (!isSameOrigin) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request, RUNTIME_CACHE));
    return;
  }

  if (STATIC_ASSET_DESTINATIONS.has(event.request.destination)) {
    event.respondWith(staleWhileRevalidate(event.request, STATIC_CACHE));
    return;
  }

  event.respondWith(networkFirst(event.request, RUNTIME_CACHE));
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
