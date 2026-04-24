"use client";

import React from "react";

/**
 * AutoSaveIndicator — Small floating indicator showing save status.
 * - "saving": spinner + "Guardando..."
 * - "saved": green check + "Guardado" (fades after 2s)
 * - "error": red dot + error message
 * - "idle": hidden
 */
export default function AutoSaveIndicator({ status = "idle", errorMsg = "" }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (status !== "idle") {
      setVisible(true);
    }
  }, [status]);

  React.useEffect(() => {
    if (status === "idle" && visible) {
      const t = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(t);
    }
  }, [status, visible]);

  if (!visible && status === "idle") return null;

  return (
    <div
      className={`fixed top-4 right-4 z-[9998] flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold shadow-lg transition-all duration-300 ${
        status === "idle"
          ? "translate-y-[-8px] opacity-0"
          : "translate-y-0 opacity-100"
      } ${
        status === "saving"
          ? "border border-[#d6e5ff] bg-white text-[#5d7698]"
          : status === "saved"
          ? "border border-[#c9efd8] bg-[#effdf5] text-[#1f7e53]"
          : "border border-[#ffd3dd] bg-[#fff1f6] text-[#b03e66]"
      }`}
      role="status"
      aria-live="polite"
    >
      {status === "saving" && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {status === "saving" && "Guardando..."}
      {status === "saved" && (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {status === "saved" && "Guardado"}
      {status === "error" && (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )}
      {status === "error" && (errorMsg || "Error al guardar")}
    </div>
  );
}
