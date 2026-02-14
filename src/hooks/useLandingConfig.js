import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "../data/defaultContent";
import {
  buildNextAnalytics,
  clearAnalytics,
  getDefaultLandingState,
  loadLandingState,
  saveLandingState
} from "../services/landingRepository";

export function useLandingConfig() {
  const defaults = getDefaultLandingState();
  const [config, setConfig] = useState(defaults.config);
  const [products, setProducts] = useState(defaults.products);
  const [clickAnalytics, setClickAnalytics] = useState(defaults.analytics);
  const [clickCount, setClickCount] = useState(defaults.analytics.total);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function hydrateLanding() {
      try {
        const loadedState = await loadLandingState();

        if (!isMounted) {
          return;
        }

        setConfig(loadedState.config);
        setProducts(loadedState.products);
        setClickAnalytics(loadedState.analytics);
        setClickCount(loadedState.analytics.total);
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

  const incrementWhatsAppClicks = (zone = "unknown") => {
    setClickAnalytics((prevAnalytics) => {
      const nextAnalytics = buildNextAnalytics(prevAnalytics, zone);
      setClickCount(nextAnalytics.total);
      localStorage.setItem(STORAGE_KEYS.clickAnalytics, JSON.stringify(nextAnalytics));
      localStorage.setItem(STORAGE_KEYS.clicks, String(nextAnalytics.total));

      // Sincronizacion no bloqueante para no impactar el click de conversion.
      saveLandingState(config, products, nextAnalytics);
      return nextAnalytics;
    });
  };

  const resetClickCount = () => {
    const emptyAnalytics = clearAnalytics();
    setClickAnalytics(emptyAnalytics);
    setClickCount(0);
    localStorage.setItem(STORAGE_KEYS.clickAnalytics, JSON.stringify(emptyAnalytics));
    localStorage.setItem(STORAGE_KEYS.clicks, "0");
    saveLandingState(config, products, emptyAnalytics);
  };

  const saveContent = async (nextConfig, nextProducts, nextAnalytics = clickAnalytics) => {
    setIsSaving(true);
    setError("");

    const saveResult = await saveLandingState(nextConfig, nextProducts, nextAnalytics);
    setConfig(saveResult.config);
    setProducts(saveResult.products);
    setClickAnalytics(saveResult.analytics);
    setClickCount(saveResult.analytics.total);

    if (!saveResult.persistedInFirebase) {
      setError("Guardado local completado. No se pudo sincronizar con Firebase.");
    }

    setIsSaving(false);
    return saveResult.persistedInFirebase;
  };

  const restoreDefaultContent = async () => {
    const defaultState = getDefaultLandingState();
    return saveContent(defaultState.config, defaultState.products, defaultState.analytics);
  };

  const importLandingSnapshot = async (snapshotData) => {
    const nextConfig = snapshotData?.config || config;
    const nextProducts = snapshotData?.products || products;
    const nextAnalytics = snapshotData?.analytics || clickAnalytics;
    return saveContent(nextConfig, nextProducts, nextAnalytics);
  };

  return {
    config,
    products,
    clickCount,
    clickAnalytics,
    isLoading,
    isSaving,
    error,
    setError,
    setConfig,
    setProducts,
    incrementWhatsAppClicks,
    resetClickCount,
    saveContent,
    restoreDefaultContent,
    importLandingSnapshot
  };
}
