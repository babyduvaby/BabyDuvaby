import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "../data/defaultContent";

/**
 * Hook for managing admin dark mode preference.
 * Supports:
 *   - System prefers-color-scheme: dark auto-detection
 *   - Manual toggle persisted to localStorage
 *   - data-admin-theme attribute on <html>
 *     "dark"  → force dark
 *     "light" → force light (overrides system dark)
 *     absent  → follow system preference
 */
export function useAdminDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    function applyTheme(preference) {
      if (preference === "dark") {
        document.documentElement.setAttribute("data-admin-theme", "dark");
        setIsDark(true);
      } else if (preference === "light") {
        document.documentElement.setAttribute("data-admin-theme", "light");
        setIsDark(false);
      } else {
        /* Follow system */
        document.documentElement.removeAttribute("data-admin-theme");
        const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
        setIsDark(systemDark);
      }
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.adminDarkMode);
      if (saved === "dark" || saved === "light") {
        applyTheme(saved);
      } else {
        /* No saved preference — detect system */
        applyTheme(window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      }
    } catch {
      applyTheme("light");
    }
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.adminDarkMode, next ? "dark" : "light");
        if (next) {
          document.documentElement.setAttribute("data-admin-theme", "dark");
        } else {
          document.documentElement.setAttribute("data-admin-theme", "light");
        }
      } catch {
        // no-op
      }
      return next;
    });
  }, []);

  return { isDark, toggle };
}

/**
 * Hook for tracking and reading visit analytics.
 * Increments on mount (once per session) and provides current count.
 */
export function useVisitCounter() {
  const [visitCount, setVisitCount] = useState(0);
  const [hasIncremented, setHasIncremented] = useState(false);

  useEffect(() => {
    if (hasIncremented) return;

    try {
      const rawCount = localStorage.getItem(STORAGE_KEYS.visitCount);
      const current = Number(rawCount) || 0;
      const newCount = current + 1;
      localStorage.setItem(STORAGE_KEYS.visitCount, String(newCount));

      const rawAnalytics = localStorage.getItem(STORAGE_KEYS.visitAnalytics);
      const analytics = rawAnalytics ? JSON.parse(rawAnalytics) : { total: 0, byDay: {} };
      const dayKey = new Date().toISOString().slice(0, 10);
      analytics.total = newCount;
      analytics.byDay = analytics.byDay || {};
      analytics.byDay[dayKey] = (Number(analytics.byDay[dayKey]) || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.visitAnalytics, JSON.stringify(analytics));

      setVisitCount(newCount);
      setHasIncremented(true);
    } catch {
      // no-op
    }
  }, [hasIncremented]);

  const getVisitAnalytics = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.visitAnalytics);
      return raw ? JSON.parse(raw) : { total: 0, byDay: {} };
    } catch {
      return { total: 0, byDay: {} };
    }
  }, []);

  const resetVisitCount = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.visitCount, "0");
      localStorage.setItem(STORAGE_KEYS.visitAnalytics, JSON.stringify({ total: 0, byDay: {} }));
      setVisitCount(0);
    } catch {
      // no-op
    }
  }, []);

  return { visitCount, getVisitAnalytics, resetVisitCount };
}

/**
 * Hook for managing 2FA PIN settings.
 */
export function use2FA() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [pin, setPin] = useState("");

  useEffect(() => {
    try {
      const enabled = localStorage.getItem(STORAGE_KEYS.admin2faEnabled) === "true";
      const savedPin = localStorage.getItem(STORAGE_KEYS.admin2faPin) || "";
      setIsEnabled(enabled);
      setPin(savedPin);
    } catch {
      // no-op
    }
  }, []);

  const enable2FA = useCallback((newPin) => {
    try {
      if (newPin && newPin.length >= 4) {
        localStorage.setItem(STORAGE_KEYS.admin2faEnabled, "true");
        localStorage.setItem(STORAGE_KEYS.admin2faPin, newPin);
        setIsEnabled(true);
        setPin(newPin);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const disable2FA = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.admin2faEnabled, "false");
      localStorage.removeItem(STORAGE_KEYS.admin2faPin);
      setIsEnabled(false);
      setPin("");
      return true;
    } catch {
      return false;
    }
  }, []);

  const verifyPin = useCallback(
    (inputPin) => {
      return isEnabled && inputPin === pin;
    },
    [isEnabled, pin]
  );

  return { isEnabled, enable2FA, disable2FA, verifyPin };
}

/**
 * Hook for managing notification permission.
 */
export function useNotificationPermission() {
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    if (typeof Notification === "undefined") return;
    setPermission(Notification.permission);

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.notificationPermission);
      if (saved) setPermission(saved);
    } catch {
      // no-op
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return "unsupported";

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      localStorage.setItem(STORAGE_KEYS.notificationPermission, result);
      return result;
    } catch {
      return "denied";
    }
  }, []);

  return { permission, requestPermission };
}
