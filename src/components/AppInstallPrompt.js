import React from "react";
import { APP_INSTALL_REQUEST_EVENT } from "../utils/appInstall";

const INSTALLED_KEY = "baby_duvaby_app_installed_v1";
const DAILY_PROMPT_STATE_KEY = "baby_duvaby_app_install_prompt_daily_v1";
const MAX_DAILY_PROMPT_SHOWS = 3;

function isStandaloneMode() {
  if (typeof window === "undefined") {
    return false;
  }

  const matchStandalone = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const navigatorStandalone = window.navigator?.standalone === true;
  return Boolean(matchStandalone || navigatorStandalone);
}

function isIosSafari() {
  if (typeof window === "undefined") {
    return false;
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(userAgent);
  const isWebkitSafari =
    /safari/.test(userAgent) && !/crios|fxios|edgios|opios|android/.test(userAgent);

  return isIos && isWebkitSafari;
}

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readDailyPromptState() {
  const today = getLocalDateKey();

  try {
    const raw = localStorage.getItem(DAILY_PROMPT_STATE_KEY);
    if (!raw) {
      return { day: today, shown: 0 };
    }

    const parsed = JSON.parse(raw);
    if (parsed?.day !== today) {
      return { day: today, shown: 0 };
    }

    return {
      day: today,
      shown: Math.max(0, Number(parsed?.shown) || 0)
    };
  } catch {
    return { day: today, shown: 0 };
  }
}

function canShowPromptToday() {
  const state = readDailyPromptState();
  return state.shown < MAX_DAILY_PROMPT_SHOWS;
}

function registerPromptShown() {
  const state = readDailyPromptState();
  const nextState = {
    day: state.day,
    shown: Math.min(MAX_DAILY_PROMPT_SHOWS, state.shown + 1)
  };

  localStorage.setItem(DAILY_PROMPT_STATE_KEY, JSON.stringify(nextState));
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
  const [manualUnavailable, setManualUnavailable] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  const showPromptIfAllowed = React.useCallback((nextMode) => {
    if (!canShowPromptToday()) {
      return false;
    }

    registerPromptShown();
    setMode(nextMode);
    setIsOpen(true);
    return true;
  }, []);

  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      setIsOpen(false);
      setIsInstalled(false);
      setIsReady(false);
      return undefined;
    }

    let isActive = true;
    setIsReady(false);

    const applyInstallState = (installed) => {
      if (!isActive) {
        return;
      }

      setIsInstalled(installed);
      setIsOpen(false);

      if (installed) {
        localStorage.setItem(INSTALLED_KEY, "1");
      }
    };

    const bootstrapInstallState = async () => {
      const standalone = isStandaloneMode();
      const relatedInstalled = await hasInstalledRelatedApps();
      const storedInstalled = localStorage.getItem(INSTALLED_KEY) === "1";
      const installedNow = standalone || relatedInstalled || storedInstalled;

      applyInstallState(installedNow);
      if (!isActive) {
        return;
      }

      setIsReady(true);

      if (!installedNow && isIosSafari()) {
        showPromptIfAllowed("ios");
      }
    };

    bootstrapInstallState();

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();

      // Si este evento aparece, la app no esta instalada (o se desinstalo).
      localStorage.removeItem(INSTALLED_KEY);
      if (!isActive) {
        return;
      }

      setIsInstalled(false);
      setDeferredPrompt(event);
      setManualUnavailable(false);
      showPromptIfAllowed("native");
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

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      isActive = false;
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, [enabled, showPromptIfAllowed]);

  React.useEffect(() => {
    if (typeof onVisibilityChange === "function") {
      onVisibilityChange(isOpen && !isInstalled);
    }
  }, [isOpen, isInstalled, onVisibilityChange]);

  const closePrompt = () => {
    setIsOpen(false);
  };

  const installApp = React.useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result?.outcome === "accepted") {
      localStorage.setItem(INSTALLED_KEY, "1");
      setIsInstalled(true);
      setIsOpen(false);
    } else {
      closePrompt();
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return undefined;
    }

    const handleInstallRequest = () => {
      if (isInstalled) {
        return;
      }

      if (deferredPrompt) {
        void installApp();
        return;
      }

      if (isIosSafari()) {
        setManualUnavailable(false);
        setMode("ios");
        setIsOpen(true);
        return;
      }

      setManualUnavailable(true);
      setMode("native");
      setIsOpen(true);
    };

    window.addEventListener(APP_INSTALL_REQUEST_EVENT, handleInstallRequest);
    return () => {
      window.removeEventListener(APP_INSTALL_REQUEST_EVENT, handleInstallRequest);
    };
  }, [deferredPrompt, enabled, installApp, isInstalled]);

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
          <p className="mt-4 rounded-2xl bg-[#ffffff1a] px-4 py-3 text-sm font-bold text-[#fff6fd]">
            En iPhone/iPad: toca compartir y luego "Agregar a pantalla de inicio".
          </p>
        ) : null}

        {manualUnavailable ? (
          <p className="mt-4 rounded-2xl bg-[#ffffff1a] px-4 py-3 text-sm font-bold text-[#fff6fd]">
            En este momento no se puede instalar automaticamente. Abre el sitio en Chrome
            movil y vuelve a tocar "Instalar aplicación".
          </p>
        ) : null}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {mode === "native" && deferredPrompt ? (
            <button
              type="button"
              onClick={installApp}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#ffd4f3] bg-white px-5 text-sm font-extrabold text-[#c22f8e] transition hover:bg-[#fff0fb]"
            >
              Instalar app
            </button>
          ) : null}

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
