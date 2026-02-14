import React from "react";
import Hero from "./components/Hero";
import CategoryList from "./components/CategoryList";
import FAQ from "./components/FAQ";
import AdminPanel from "./components/AdminPanel";
import { useLandingConfig } from "./hooks/useLandingConfig";

export default function App() {
  const {
    config,
    clickCount,
    isLoading,
    error,
    setError,
    saveConfig,
    incrementWhatsAppClicks,
    resetClickCount
  } = useLandingConfig();

  // Normaliza el número para construir un enlace wa.me válido.
  const sanitizedPhone = config.whatsapp.phone.replace(/[^\d]/g, "");
  const whatsappHref = `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(
    config.whatsapp.message
  )}`;

  const handleWhatsappClick = (event) => {
    if (!sanitizedPhone) {
      event.preventDefault();
      setError("Configura un número de WhatsApp válido desde el panel administrador.");
      return;
    }
    setError("");
    incrementWhatsAppClicks();
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#fce9f2] to-[#deebff] px-4 py-12">
        <div className="mx-auto max-w-xl animate-pulse rounded-3xl bg-white/70 p-6 shadow-candy">
          <div className="h-8 w-3/4 rounded-xl bg-[#e9f2ff]" />
          <div className="mt-3 h-5 w-full rounded-xl bg-[#e9f2ff]" />
          <div className="mt-6 h-72 rounded-3xl bg-[#e9f2ff]" />
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell min-h-screen overflow-x-hidden bg-gradient-to-b from-[#fce9f2] via-[#f8f4fb] to-[#deebff] text-ink">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="ambient ambient-top" />
        <div className="ambient ambient-bottom" />
      </div>

      {error ? (
        <div className="mx-auto mb-4 mt-3 max-w-3xl rounded-2xl border border-[#ffc6d9] bg-[#fff0f6] px-4 py-3 text-sm font-semibold text-[#b53d69]">
          {error}
        </div>
      ) : null}

      <Hero
        brand={config.brand}
        whatsappHref={whatsappHref}
        onWhatsappClick={handleWhatsappClick}
        clickCount={clickCount}
      />

      <CategoryList categories={config.categories} />
      <FAQ faqItems={config.faq} />

      <AdminPanel
        config={config}
        clickCount={clickCount}
        onSaveConfig={saveConfig}
        onResetClicks={resetClickCount}
      />
    </main>
  );
}
