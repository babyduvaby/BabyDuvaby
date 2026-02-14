import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Hero from "./components/Hero";
import CategoryList from "./components/CategoryList";
import FAQ from "./components/FAQ";
import MobileWhatsappBar from "./components/MobileWhatsappBar";
import CategoryProductsPage from "./components/CategoryProductsPage";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import AdminLoginPage from "./components/AdminLoginPage";
import AdminPanelPage from "./components/AdminPanelPage";
import { FIXED_WHATSAPP_PHONE } from "./data/defaultContent";
import { useLandingConfig } from "./hooks/useLandingConfig";
import { useAdminSession } from "./hooks/useAdminSession";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const {
    config,
    products,
    clickCount,
    clickAnalytics,
    isLoading,
    isSaving,
    error,
    setError,
    incrementWhatsAppClicks,
    resetClickCount,
    saveContent,
    restoreDefaultContent,
    importLandingSnapshot
  } = useLandingConfig();

  const { isAdminAuthenticated, isAuthLoading, loginWithPassword, logout } =
    useAdminSession();

  const rawPhone = config?.whatsapp?.phone || FIXED_WHATSAPP_PHONE;
  const sanitizedPhone = String(rawPhone).replace(/\D/g, "") || FIXED_WHATSAPP_PHONE;

  const buildWhatsappHref = (customMessage) =>
    `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(
      customMessage || config.whatsapp.message
    )}`;

  const whatsappHref = buildWhatsappHref();

  const handleWhatsappClick = (zone) => {
    setError("");
    incrementWhatsAppClicks(zone);
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
    <main
      className={`app-shell min-h-screen overflow-x-hidden bg-gradient-to-b from-[#fce9f2] via-[#f8f4fb] to-[#deebff] text-ink ${
        isAdminRoute ? "pb-8" : "pb-28 sm:pb-0"
      }`}
    >
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="ambient ambient-top" />
        <div className="ambient ambient-bottom" />
      </div>

      <TopBar brand={config.brand} />

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
              products={products}
              clickCount={clickCount}
              onWhatsappClick={handleWhatsappClick}
              buildWhatsappHref={buildWhatsappHref}
            />
          }
        />
        <Route
          path="/admin/login"
          element={
            isAuthLoading ? (
              <AdminAuthLoading />
            ) : isAdminAuthenticated ? (
              <Navigate replace to="/admin" />
            ) : (
              <AdminLoginPage onLogin={loginWithPassword} />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAuthLoading ? (
              <AdminAuthLoading />
            ) : isAdminAuthenticated ? (
              <AdminPanelPage
                config={config}
                products={products}
                clickCount={clickCount}
                clickAnalytics={clickAnalytics}
                isSaving={isSaving}
                onSaveContent={saveContent}
                onRestoreDefaultContent={restoreDefaultContent}
                onResetClickCount={resetClickCount}
                onImportSnapshot={importLandingSnapshot}
                onLogout={logout}
              />
            ) : (
              <Navigate replace to="/admin/login" />
            )
          }
        />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>

      {!isAdminRoute ? (
        <Footer
          categories={config.categories}
          brand={config.brand}
          whatsappPhone={sanitizedPhone}
        />
      ) : null}

      {!isAdminRoute ? (
        <MobileWhatsappBar
          whatsappHref={whatsappHref}
          onWhatsappClick={handleWhatsappClick}
          buttonText="Contactar por WhatsApp"
        />
      ) : null}
    </main>
  );
}

function AdminAuthLoading() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-xl items-center px-4 py-8 sm:px-6">
      <div className="glass-panel w-full animate-pulse rounded-3xl p-6 shadow-candy sm:p-8">
        <div className="h-4 w-32 rounded bg-[#e1ecff]" />
        <div className="mt-3 h-8 w-56 rounded bg-[#e1ecff]" />
        <div className="mt-6 h-12 w-full rounded-xl bg-[#e1ecff]" />
      </div>
    </section>
  );
}
