"use client";

import React from "react";
import Hero from "./Hero";
import CategoryList from "./CategoryList";
import FAQ from "./FAQ";
import TopBar from "./TopBar";
import Footer from "./Footer";
import Testimonials from "./Testimonials";
import FloatingWhatsappButton from "./FloatingWhatsappButton";
import AppInstallPrompt from "./AppInstallPrompt";
import InstallAppButton from "./InstallAppButton";
import { FIXED_WHATSAPP_PHONE } from "../data/defaultContent";
import { useLandingConfig } from "../hooks/useLandingConfig";
import useAppInstalledState from "../hooks/useAppInstalledState";

export default function HomePageClient() {
  const [floatingMessage, setFloatingMessage] = React.useState("");
  const { isInstalled: isAppInstalled, isReady: isInstallStateReady } = useAppInstalledState();
  const {
    config,
    products,
    clickCount,
    isLoading,
    error,
    setError,
    incrementWhatsAppClicks
  } = useLandingConfig();

  const rawPhone = config?.whatsapp?.phone || FIXED_WHATSAPP_PHONE;
  const sanitizedPhone = String(rawPhone).replace(/\D/g, "") || FIXED_WHATSAPP_PHONE;

  const buildWhatsappHref = (customMessage) =>
    `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(
      customMessage || config.whatsapp.message
    )}`;

  const whatsappHref = buildWhatsappHref(floatingMessage || config.whatsapp.message);

  const handleWhatsappClick = (zone) => {
    setError("");
    incrementWhatsAppClicks(zone);
  };

  React.useEffect(() => {
    setFloatingMessage(config.whatsapp.message);
  }, [config.whatsapp.message]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#fce9f2] to-[#deebff] px-4 py-12">
        <div className="mx-auto max-w-xl animate-pulse rounded-3xl bg-white/80 p-6 shadow-candy">
          <div className="h-8 w-3/4 rounded-xl bg-[#e9f2ff]" />
          <div className="mt-3 h-5 w-full rounded-xl bg-[#e9f2ff]" />
          <div className="mt-6 h-72 rounded-3xl bg-[#e9f2ff]" />
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell min-h-screen overflow-x-hidden bg-gradient-to-b from-[#fce9f2] via-[#f8f4fb] to-[#deebff] pb-28 text-ink sm:pb-0">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="ambient ambient-top" />
        <div className="ambient ambient-bottom" />
      </div>

      <TopBar brand={config.brand} categories={config.categories} pinToViewport />

      {error ? (
        <div className="mx-auto mb-4 mt-3 max-w-3xl rounded-2xl border border-[#ffc6d9] bg-[#fff0f6] px-4 py-3 text-sm font-semibold text-[#b53d69]">
          {error}
        </div>
      ) : null}

      <Hero brand={config.brand} whatsappHref={whatsappHref} onWhatsappClick={handleWhatsappClick} />
      <CategoryList categories={config.categories} products={products} />
      <FAQ faqItems={config.faq} />
      <Testimonials items={config.testimonials} />

      {isInstallStateReady && !isAppInstalled ? (
        <section className="mx-auto w-full max-w-6xl px-4 pb-4 sm:hidden">
          <div className="glass-panel baby-section-glow rounded-2xl px-4 py-4 text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8a4f74]">
              Instala Baby Duvaby
            </p>
            <p className="mt-1 text-sm font-semibold text-[#6d7390]">
              Accede mas rapido a la tienda desde tu pantalla de inicio.
            </p>
            <InstallAppButton className="mt-3 w-full" label="Instalar aplicación" />
          </div>
        </section>
      ) : null}

      <Footer categories={config.categories} brand={config.brand} whatsappPhone={sanitizedPhone} />
      <FloatingWhatsappButton
        whatsappHref={whatsappHref}
        onWhatsappClick={handleWhatsappClick}
        label="WhatsApp"
      />
      <AppInstallPrompt enabled />

      <p className="sr-only">Clics acumulados en WhatsApp: {clickCount}</p>
    </main>
  );
}
