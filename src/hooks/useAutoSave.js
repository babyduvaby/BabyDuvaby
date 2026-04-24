import { useState, useRef, useCallback, useEffect } from "react";

/**
 * useAutoSave — Auto-save hook with debounce and visual feedback.
 *
 * - Triggers save on field blur (onBlur)
 * - Debounces slider / long-text changes (default 800ms)
 * - Returns { autoSaveProps, status, indicator } for UI integration
 *
 * @param {Function} saveFn  — async function to persist data
 * @param {Object}   data    — current draft data to save
 * @param {Object}   [opts]
 * @param {number}   [opts.debounceMs=800]   — debounce delay for onChange triggers
 * @param {number}   [opts.successMs=2000]    — how long the "saved" indicator shows
 * @param {number}   [opts.retryMs=3000]      — delay before auto-retry on failure
 * @param {number}   [opts.maxRetries=2]      — max auto-retries before giving up
 */
export function useAutoSave(saveFn, data, opts = {}) {
  const {
    debounceMs = 800,
    successMs = 2000,
    retryMs = 3000,
    maxRetries = 2
  } = opts;

  const [status, setStatus] = useState("idle"); // idle | saving | saved | error
  const [errorMsg, setErrorMsg] = useState("");
  const retryCountRef = useRef(0);
  const debounceRef = useRef(null);
  const statusTimerRef = useRef(null);
  const lastSavedRef = useRef(null);

  /* Cleanup timers on unmount */
  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
      clearTimeout(statusTimerRef.current);
    };
  }, []);

  /* Compare current data with last saved snapshot */
  const dataChanged = useCallback(() => {
    if (!lastSavedRef.current) return true;
    return JSON.stringify(data) !== JSON.stringify(lastSavedRef.current);
  }, [data]);

  const clearTimers = useCallback(() => {
    clearTimeout(debounceRef.current);
    clearTimeout(statusTimerRef.current);
    debounceRef.current = null;
    statusTimerRef.current = null;
  }, []);

  /* Core save execution */
  const executeSave = useCallback(async () => {
    if (!dataChanged()) return;
    if (typeof saveFn !== "function") return;

    clearTimers();
    setStatus("saving");
    setErrorMsg("");

    try {
      const result = await saveFn(data);
      lastSavedRef.current = JSON.parse(JSON.stringify(data));
      retryCountRef.current = 0;
      setStatus("saved");

      statusTimerRef.current = setTimeout(() => setStatus("idle"), successMs);
      return result;
    } catch (err) {
      const msg = err?.message || "Error al guardar";

      if (retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        setErrorMsg(`${msg}, reintentando...`);
        setStatus("error");
        setTimeout(() => executeSave(), retryMs);
      } else {
        setErrorMsg(msg);
        setStatus("error");
        statusTimerRef.current = setTimeout(() => setStatus("idle"), successMs);
      }
    }
  }, [saveFn, data, dataChanged, clearTimers, successMs, retryMs, maxRetries]);

  /* --- Public API --- */

  /* For onBlur: saves immediately */
  const handleBlur = useCallback(() => {
    if (dataChanged()) {
      executeSave();
    }
  }, [dataChanged, executeSave]);

  /* For onChange / slider: debounced save */
  const handleChange = useCallback(() => {
    clearTimers();
    setStatus("idle");
    debounceRef.current = setTimeout(() => {
      if (dataChanged()) {
        executeSave();
      }
    }, debounceMs);
  }, [dataChanged, executeSave, clearTimers, debounceMs]);

  /* Force immediate save (e.g. for "Guardar" button) */
  const saveNow = useCallback(async () => {
    clearTimers();
    return executeSave();
  }, [executeSave, clearTimers]);

  return { status, errorMsg, handleBlur, handleChange, saveNow };
}
