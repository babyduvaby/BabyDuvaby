"use client";

import { useEffect } from "react";

/**
 * Registers the dedicated admin service worker (admin-sw.js)
 * only when visiting /admin/* routes.
 * Uses scope "/admin/" to avoid conflicting with the main site SW.
 */
export default function AdminServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) {
      return;
    }

    const CACHE_PREFIX = "baby-duvaby-admin-";

    const register = async () => {
      try {
        /* Clean up old admin caches from previous versions */
        if ("caches" in window) {
          const cacheKeys = await caches.keys();
          await Promise.all(
            cacheKeys
              .filter((key) => key.startsWith(CACHE_PREFIX))
              .map((key) => caches.delete(key))
          );
        }

        /* Register the admin-specific service worker with scope /admin/ */
        const registration = await navigator.serviceWorker.register("/admin-sw.js", {
          scope: "/admin/"
        });

        await registration.update();

        /* Activate new worker immediately if waiting */
        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }

        /* Listen for future updates */
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;

          worker.addEventListener("statechange", () => {
            if (
              worker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              worker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      } catch {
        /* Registration failed silently — admin still works without SW */
      }
    };

    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
