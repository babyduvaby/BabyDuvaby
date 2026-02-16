import React from "react";
import { APP_INSTALL_REQUEST_EVENT } from "../utils/appInstall";

const INSTALLED_KEY = "baby_duvaby_app_installed_v1";

function isStandaloneMode() {
  if (typeof window === "undefined") {
    return false;
  }

  const matchStandalone = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const navigatorStandalone = window.navigator?.standalone === true;
  return Boolean(matchStandalone || navigatorStandalone);
}

function isIos() {
  if (typeof window === "undefined") {
    return false;
  }

  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isIosSafari() {
  if (typeof window === "undefined") {
    return false;
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
  const isWebkitSafari =
    /safari/.test(userAgent) && !/crios|fxios|edgios|opios|android/.test(userAgent);

  return isIosDevice && isWebkitSafari;
}

async function hasInstalledRelatedApps() {
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

export default function AppInstallPrompt({ enabled = true, onVisibilityChange }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [mode, setMode] = React.useState("native");
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);
  const [isReady, setIsReady] = React.useState(false);

  const closePrompt = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const installWithDeferredPrompt = React.useCallback(async () => {
    if (!deferredPrompt) {
      return false;
    }

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result?.outcome === "accepted") {
      localStorage.setItem(INSTALLED_KEY, "1");
      setIsInstalled(true);
      setIsOpen(false);
      setDeferredPrompt(null);
      return true;
    }

    setDeferredPrompt(null);
    return false;
  }, [deferredPrompt]);

  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      setIsOpen(false);
      setIsInstalled(false);
      setIsReady(false);
      return undefined;
    }

    let isActive = true;
    setIsReady(false);

    const bootstrapInstallState = async () => {
      const standalone = isStandaloneMode();
      const relatedInstalled = await hasInstalledRelatedApps();
      const storedInstalled = localStorage.getItem(INSTALLED_KEY) === "1";
      const installedNow = standalone || relatedInstalled || storedInstalled;

      if (!isActive) {
        return;
      }

      setIsInstalled(installedNow);
      setIsOpen(false);
      setIsReady(true);
    };

    bootstrapInstallState();

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      localStorage.removeItem(INSTALLED_KEY);

      if (!isActive) {
        return;
      }

      setIsInstalled(false);
      setDeferredPrompt(event);
    };

    const handleInstalled = () => {
      localStorage.setItem(INSTALLED_KEY, "1");

      if (!isActive) {
        return;
      }

      setIsInstalled(true);
      setIsOpen(false);
      setDeferredPrompt(null);
    };

    const handleVisibilityBack = () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      if (isStandaloneMode()) {
        localStorage.setItem(INSTALLED_KEY, "1");
        setIsInstalled(true);
        setIsOpen(false);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    document.addEventListener("visibilitychange", handleVisibilityBack);

    return () => {
      isActive = false;
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      document.removeEventListener("visibilitychange", handleVisibilityBack);
    };
  }, [enabled]);

  React.useEffect(() => {
    if (typeof onVisibilityChange === "function") {
      onVisibilityChange(isOpen && !isInstalled);
    }
  }, [isOpen, isInstalled, onVisibilityChange]);

  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return undefined;
    }

    const handleInstallRequest = async () => {
      if (isInstalled) {
        return;
      }

      if (deferredPrompt) {
        const installed = await installWithDeferredPrompt();

        if (!installed) {
          setMode("native");
          setIsOpen(true);
        }
        return;
      }

      if (isIosSafari()) {
        setMode("ios");
        setIsOpen(true);
        return;
      }

      if (isIos()) {
        setMode("ios_non_safari");
        setIsOpen(true);
        return;
      }

      setMode("unavailable");
      setIsOpen(true);
    };

    window.addEventListener(APP_INSTALL_REQUEST_EVENT, handleInstallRequest);
    return () => {
      window.removeEventListener(APP_INSTALL_REQUEST_EVENT, handleInstallRequest);
    };
  }, [deferredPrompt, enabled, installWithDeferredPrompt, isInstalled]);

  if (!enabled || !isReady || !isOpen || isInstalled) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-[#20102766] p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Instalar aplicacion Baby Duvaby"
    >
      <div className="install-app-modal w-full max-w-md rounded-3xl p-5 text-white shadow-[0_24px_44px_rgba(248,73,177,0.44)] sm:p-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ffe6f7]">
          Instala nuestra app
        </p>
        <h2 className="mt-2 text-3xl font-extrabold leading-none sm:text-4xl">
          Baby Duvaby
        </h2>
        <p className="mt-3 text-sm font-semibold text-[#ffeefe] sm:text-base">
          Accede rapido al catalogo y compra por WhatsApp en un toque.
        </p>

        {mode === "ios" ? (
          <div className="mt-4 rounded-2xl bg-[#ffffff1a] px-4 py-3 text-sm font-bold text-[#fff6fd]">
            <p>Para iPhone/iPad en Safari:</p>
            <p>1. Toca el boton Compartir.</p>
            <p>2. Elige "Agregar a pantalla de inicio".</p>
          </div>
        ) : null}

        {mode === "ios_non_safari" ? (
          <p className="mt-4 rounded-2xl bg-[#ffffff1a] px-4 py-3 text-sm font-bold text-[#fff6fd]">
            En iPhone/iPad instala desde Safari. Abre este sitio en Safari y toca
            "Agregar a pantalla de inicio".
          </p>
        ) : null}

        {mode === "unavailable" ? (
          <p className="mt-4 rounded-2xl bg-[#ffffff1a] px-4 py-3 text-sm font-bold text-[#fff6fd]">
            Aun no esta disponible la instalacion automatica en este navegador. Intenta en
            Chrome movil actualizado.
          </p>
        ) : null}

        {mode === "native" ? (
          <p className="mt-4 rounded-2xl bg-[#ffffff1a] px-4 py-3 text-sm font-bold text-[#fff6fd]">
            La instalacion fue cancelada. Vuelve a tocar "Instalar aplicacion" para intentarlo de
            nuevo.
          </p>
        ) : null}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={closePrompt}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#ffd4f3] bg-[#ffffff1a] px-5 text-sm font-extrabold text-white transition hover:bg-[#ffffff2b]"
          >
            Ahora no
          </button>
        </div>
      </div>
    </div>
  );
}

