export const APP_INSTALL_REQUEST_EVENT = "babyduvaby:install-app-request";
export const APP_INSTALL_BIP_READY_EVENT = "babyduvaby:beforeinstallprompt-ready";
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
