"use client";

import React from "react";
import { requestAppInstall } from "../utils/appInstall";

// Boton reutilizable para solicitar instalacion PWA manual.
export default function InstallAppButton({
  onAfterClick,
  className = "",
  label = "Instalar aplicación"
}) {
  const handleClick = () => {
    requestAppInstall();
    if (typeof onAfterClick === "function") {
      onAfterClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        "inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-extrabold",
        "bg-gradient-to-r from-[#ff7fb8] to-[#f658a4] text-white shadow-[0_10px_22px_rgba(246,88,164,0.35)]",
        "transition duration-200 hover:brightness-105 active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc2e1]",
        className
      ].join(" ")}
    >
      {label}
    </button>
  );
}
