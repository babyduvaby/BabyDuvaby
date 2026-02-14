import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "../data/defaultContent";
import {
  getDefaultLandingState,
  loadLandingState,
  saveLandingState
} from "../services/landingRepository";

export function useLandingConfig() {
  const defaults = getDefaultLandingState();
  const [config, setConfig] = useState(defaults.config);
  const [products, setProducts] = useState(defaults.products);
  const [clickCount, setClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function hydrateLanding() {
      try {
        const savedClicksRaw = localStorage.getItem(STORAGE_KEYS.clicks);

        if (savedClicksRaw) {
          const parsedClicks = Number(savedClicksRaw);
          if (!Number.isNaN(parsedClicks) && isMounted) {
            setClickCount(parsedClicks);
          }
        }

        const loadedState = await loadLandingState();

        if (!isMounted) {
          return;
        }

        setConfig(loadedState.config);
        setProducts(loadedState.products);
      } catch {
        if (isMounted) {
          setError("No se pudo cargar el contenido. Se usaron valores por defecto.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    hydrateLanding();

    return () => {
      isMounted = false;
    };
  }, []);

  const incrementWhatsAppClicks = () => {
    setClickCount((prevCount) => {
      const nextCount = prevCount + 1;
      localStorage.setItem(STORAGE_KEYS.clicks, String(nextCount));
      return nextCount;
    });
  };

  const resetClickCount = () => {
    setClickCount(0);
    localStorage.setItem(STORAGE_KEYS.clicks, "0");
  };

  const saveContent = async (nextConfig, nextProducts) => {
    setIsSaving(true);
    setError("");

    const saveResult = await saveLandingState(nextConfig, nextProducts);
    setConfig(saveResult.config);
    setProducts(saveResult.products);

    if (!saveResult.persistedInFirebase) {
      setError("Guardado local completado. No se pudo sincronizar con Firebase.");
    }

    setIsSaving(false);
    return saveResult.persistedInFirebase;
  };

  const restoreDefaultContent = async () => {
    const defaultState = getDefaultLandingState();
    return saveContent(defaultState.config, defaultState.products);
  };

  return {
    config,
    products,
    clickCount,
    isLoading,
    isSaving,
    error,
    setError,
    setConfig,
    setProducts,
    incrementWhatsAppClicks,
    resetClickCount,
    saveContent,
    restoreDefaultContent
  };
}
