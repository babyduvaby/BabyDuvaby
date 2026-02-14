import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Hero from "./components/Hero";
import CategoryList from "./components/CategoryList";
import FAQ from "./components/FAQ";
import MobileWhatsappBar from "./components/MobileWhatsappBar";
import CategoryProductsPage from "./components/CategoryProductsPage";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import { useLandingConfig } from "./hooks/useLandingConfig";
import {
  ADMIN_PANEL_URL,
  FIXED_WHATSAPP_PHONE,
  productCatalog
} from "./data/defaultContent";

export default function App() {
  const {
    config,
    clickCount,
    isLoading,
    error,
    setError,
    incrementWhatsAppClicks
  } = useLandingConfig();

  // Se usa siempre el número comercial fijo solicitado por el cliente.
  const sanitizedPhone = FIXED_WHATSAPP_PHONE;
  const buildWhatsappHref = (customMessage) =>
    `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(
      customMessage || config.whatsapp.message
    )}`;

  const whatsappHref = buildWhatsappHref();

  const handleWhatsappClick = () => {
    setError("");
    incrementWhatsAppClicks();
  };

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

      <TopBar />

      {error ? (
        <div className="mx-auto mb-4 mt-3 max-w-3xl rounded-2xl border border-[#ffc6d9] bg-[#fff0f6] px-4 py-3 text-sm font-semibold text-[#b53d69]">
          {error}
        </div>
      ) : null}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero
                brand={config.brand}
                whatsappHref={whatsappHref}
                onWhatsappClick={handleWhatsappClick}
                clickCount={clickCount}
              />
              <CategoryList categories={config.categories} />
              <FAQ faqItems={config.faq} />
            </>
          }
        />
        <Route
          path="/categoria/:categoryId"
          element={
            <CategoryProductsPage
              categories={config.categories}
              products={productCatalog}
              clickCount={clickCount}
              onWhatsappClick={handleWhatsappClick}
              buildWhatsappHref={buildWhatsappHref}
            />
          }
        />
        <Route
          path="/admin/login"
          element={<ExternalAdminRedirect url={ADMIN_PANEL_URL} />}
        />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>

      <Footer categories={config.categories} />

      <MobileWhatsappBar
        whatsappHref={whatsappHref}
        onWhatsappClick={handleWhatsappClick}
        buttonText="Contactar por WhatsApp"
      />
    </main>
  );
}

function ExternalAdminRedirect({ url }) {
  React.useEffect(() => {
    window.location.replace(url);
  }, [url]);

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 text-center">
      <p className="text-sm font-bold text-ink/80">Redirigiendo al panel administrador...</p>
    </section>
  );
}
