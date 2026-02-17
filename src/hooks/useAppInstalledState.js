"use client";

import React from "react";
import {
  APP_INSTALL_INSTALLED_KEY,
  isAppInstalled
} from "../utils/appInstall";

export default function useAppInstalledState({ enabled = true } = {}) {
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      setIsInstalled(false);
      setIsReady(false);
      return undefined;
    }

    let isActive = true;
    const displayModeMedia = window.matchMedia?.("(display-mode: standalone)");

    const refreshInstalledState = async () => {
      const installedNow = await isAppInstalled();

      if (!isActive) {
        return;
      }

      setIsInstalled(installedNow);
      setIsReady(true);
    };

    refreshInstalledState();

    const handleInstalled = () => {
      try {
        window.localStorage.setItem(APP_INSTALL_INSTALLED_KEY, "1");
      } catch {}

      if (!isActive) {
        return;
      }

      setIsInstalled(true);
      setIsReady(true);
    };

    const handleVisibilityBack = () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      refreshInstalledState();
    };

    const handleDisplayModeChange = () => {
      refreshInstalledState();
    };

    window.addEventListener("appinstalled", handleInstalled);
    document.addEventListener("visibilitychange", handleVisibilityBack);
    displayModeMedia?.addEventListener?.("change", handleDisplayModeChange);

    return () => {
      isActive = false;
      window.removeEventListener("appinstalled", handleInstalled);
      document.removeEventListener("visibilitychange", handleVisibilityBack);
      displayModeMedia?.removeEventListener?.("change", handleDisplayModeChange);
    };
  }, [enabled]);

  return { isInstalled, isReady };
}
