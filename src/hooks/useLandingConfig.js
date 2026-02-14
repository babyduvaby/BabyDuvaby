import { useEffect, useState } from "react";
import {
  defaultLandingConfig,
  STORAGE_KEYS
} from "../data/defaultContent";

// Hook central para hidratar, persistir y actualizar configuración/clicks.
export function useLandingConfig() {
  const [config, setConfig] = useState(defaultLandingConfig);
  const [clickCount, setClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const savedClicksRaw = localStorage.getItem(STORAGE_KEYS.clicks);

      if (savedClicksRaw) {
        const savedClicks = Number(savedClicksRaw);
        setClickCount(Number.isNaN(savedClicks) ? 0 : savedClicks);
      }
    } catch (loadError) {
      setError(
        "No se pudo leer la configuración guardada. Se cargaron valores por defecto."
      );
    } finally {
      setIsLoading(false);
    }
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

  return {
    config,
    clickCount,
    isLoading,
    error,
    setError,
    incrementWhatsAppClicks,
    resetClickCount,
    setConfig
  };
}
