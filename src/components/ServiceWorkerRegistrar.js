"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) {
      return;
    }

    const CACHE_PREFIX = "baby-duvaby-";
    const CURRENT_SW_CACHE_VERSION = "v3";
    let didRefresh = false;

    const register = async () => {
      try {
        if ("caches" in window) {
          const cacheKeys = await caches.keys();
          await Promise.all(
            cacheKeys
              .filter(
                (key) =>
                  key.startsWith(CACHE_PREFIX) && !key.includes(CURRENT_SW_CACHE_VERSION)
              )
              .map((key) => caches.delete(key))
          );
        }

        const registration = await navigator.serviceWorker.register("/sw.js");
        await registration.update();

        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) {
            return;
          }

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
        // no-op
      }
    };

    const handleControllerChange = () => {
      if (didRefresh) {
        return;
      }
      didRefresh = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
    window.addEventListener("load", register);
    return () => {
      window.removeEventListener("load", register);
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, []);

  return null;
}
