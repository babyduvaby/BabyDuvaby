export const APP_INSTALL_REQUEST_EVENT = "babyduvaby:install-app-request";
export const APP_INSTALL_BIP_READY_EVENT = "babyduvaby:beforeinstallprompt-ready";
export const APP_INSTALL_INSTALLED_KEY = "baby_duvaby_app_installed_v1";
const DEFERRED_PROMPT_KEY = "__BABY_DUVABY_DEFERRED_PROMPT__";

export function requestAppInstall() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(APP_INSTALL_REQUEST_EVENT));
}

export function getStoredDeferredInstallPrompt() {
  if (typeof window === "undefined") {
    return null;
  }

  return window[DEFERRED_PROMPT_KEY] || null;
}

export function setStoredDeferredInstallPrompt(promptEvent) {
  if (typeof window === "undefined") {
    return;
  }

  window[DEFERRED_PROMPT_KEY] = promptEvent || null;
}

export function clearStoredDeferredInstallPrompt() {
  if (typeof window === "undefined") {
    return;
  }

  window[DEFERRED_PROMPT_KEY] = null;
}

export function isStandaloneMode() {
  if (typeof window === "undefined") {
    return false;
  }

  const matchStandalone = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const navigatorStandalone = window.navigator?.standalone === true;
  return Boolean(matchStandalone || navigatorStandalone);
}

export async function hasInstalledRelatedApps() {
  if (typeof window === "undefined") {
    return false;
  }

  if (typeof window.navigator?.getInstalledRelatedApps !== "function") {
    return false;
  }

  try {
    const relatedApps = await window.navigator.getInstalledRelatedApps();
    return Array.isArray(relatedApps) && relatedApps.length > 0;
  } catch {
    return false;
  }
}

function hasStoredInstalledFlag() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(APP_INSTALL_INSTALLED_KEY) === "1";
  } catch {
    return false;
  }
}

export async function isAppInstalled() {
  const standalone = isStandaloneMode();
  const relatedInstalled = await hasInstalledRelatedApps();
  const storedInstalled = hasStoredInstalledFlag();
  return standalone || relatedInstalled || storedInstalled;
}
