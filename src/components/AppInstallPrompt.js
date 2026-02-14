import React from "react";

const INSTALLED_KEY = "baby_duvaby_app_installed_v1";
const DISMISSED_SESSION_KEY = "baby_duvaby_app_install_prompt_dismissed_session_v1";

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

export default function AppInstallPrompt({ enabled = true, onVisibilityChange }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [mode, setMode] = React.useState("native");
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);

  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      setIsOpen(false);
      return undefined;
    }

    const storedInstalled = localStorage.getItem(INSTALLED_KEY) === "1";
    const installedNow = storedInstalled || isStandaloneMode();

    if (installedNow) {
      localStorage.setItem(INSTALLED_KEY, "1");
      setIsInstalled(true);
      setIsOpen(false);
      return undefined;
    }

    if (sessionStorage.getItem(DISMISSED_SESSION_KEY) === "1") {
      return undefined;
    }

    if (isIosSafari()) {
      setMode("ios");
      setIsOpen(true);
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setMode("native");
      setIsOpen(true);
    };

    const handleInstalled = () => {
      localStorage.setItem(INSTALLED_KEY, "1");
      setIsInstalled(true);
      setIsOpen(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, [enabled]);

  React.useEffect(() => {
    if (typeof onVisibilityChange === "function") {
      onVisibilityChange(isOpen && !isInstalled);
    }
  }, [isOpen, isInstalled, onVisibilityChange]);

  const closePrompt = () => {
    sessionStorage.setItem(DISMISSED_SESSION_KEY, "1");
    setIsOpen(false);
  };

  const installApp = async () => {
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
  };

  if (!enabled || !isOpen || isInstalled) {
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

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {mode === "native" ? (
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
