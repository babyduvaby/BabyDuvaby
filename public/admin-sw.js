/* ============================================
   Baby Duvaby Admin — Service Worker v1
   Dedicated PWA service worker for the admin panel.
   Caches admin interface for offline access and
   enables installability as a standalone app.
   ============================================ */

const CACHE_VERSION = "v1";
const ADMIN_CACHE = `baby-duvaby-admin-${CACHE_VERSION}`;
const ADMIN_RUNTIME_CACHE = `baby-duvaby-admin-runtime-${CACHE_VERSION}`;
const CACHE_PREFIX = "baby-duvaby-admin-";

/* Static assets to precache for the admin panel */
const PRECACHE_URLS = [
  "/admin/login",
  "/admin",
  "/manifest.admin.webmanifest",
  "/favicon.svg",
  "/logo-baby-duvaby.svg",
  "/icons/admin-icon-192.png",
  "/icons/admin-icon-512.png"
];

/* Destination types considered static assets */
const STATIC_ASSET_DESTINATIONS = new Set([
  "script",
  "style",
  "font",
  "image",
  "worker"
]);

/* ---- Install: Precache essential admin assets ---- */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(ADMIN_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(() => {
        /* If precache fails, skip silently and rely on runtime caching */
        self.skipWaiting();
      })
  );
});

/* ---- Activate: Clean old caches ---- */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (
            key.startsWith(CACHE_PREFIX) &&
            key !== ADMIN_CACHE &&
            key !== ADMIN_RUNTIME_CACHE
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

/* ---- Fetch Strategies ---- */

/**
 * Network-first strategy: tries network, falls back to cache.
 * Ideal for navigation and API calls where freshness matters.
 */
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

/**
 * Stale-while-revalidate: serves from cache immediately,
 * then updates cache in background.
 * Ideal for static assets (CSS, JS, images).
 */
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

/**
 * Cache-first strategy: serves from cache, only goes to network on miss.
 * Useful for static assets that rarely change.
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  const networkResponse = await fetch(request);
  if (networkResponse && networkResponse.status === 200) {
    cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}

/* ---- Main fetch handler ---- */
self.addEventListener("fetch", (event) => {
  /* Only handle GET requests */
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;

  /* Only intercept same-origin requests within /admin/ scope or shared assets */
  if (!isSameOrigin) {
    return;
  }

  /* Navigation requests: network-first with runtime cache */
  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request, ADMIN_RUNTIME_CACHE));
    return;
  }

  /* Static assets: stale-while-revalidate for fast loading */
  if (STATIC_ASSET_DESTINATIONS.has(event.request.destination)) {
    event.respondWith(staleWhileRevalidate(event.request, ADMIN_CACHE));
    return;
  }

  /* Firebase / external API calls: network-only (passthrough) */
  if (
    requestUrl.hostname.includes("firebaseio.com") ||
    requestUrl.hostname.includes("googleapis.com") ||
    requestUrl.hostname.includes("cloudinary.com")
  ) {
    return;
  }

  /* Other same-origin requests: network-first */
  event.respondWith(networkFirst(event.request, ADMIN_RUNTIME_CACHE));
});

/* ---- Message handler: Skip waiting on demand ---- */
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
