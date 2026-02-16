export const APP_INSTALL_REQUEST_EVENT = "babyduvaby:install-app-request";

export function requestAppInstall() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(APP_INSTALL_REQUEST_EVENT));
}

