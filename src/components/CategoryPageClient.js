"use client";

import React from "react";
import TopBar from "./TopBar";
import Footer from "./Footer";
import CategoryProductsPage from "./CategoryProductsPage";
import FloatingWhatsappButton from "./FloatingWhatsappButton";
import AppInstallPrompt from "./AppInstallPrompt";
import { FIXED_WHATSAPP_PHONE } from "../data/defaultContent";
import { useLandingConfig } from "../hooks/useLandingConfig";

export default function CategoryPageClient({ categoryId }) {
  const [floatingMessage, setFloatingMessage] = React.useState("");
  const {
    config,
    products,
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

  const handleProductContextChange = React.useCallback((product, category, selection) => {
    if (!product) {
      return;
    }

    const productPrice = Number(product.price) || 0;
    const currency = product.currency || "PEN";
    const formattedPrice = new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency
    }).format(productPrice);
    const selectedColor = selection?.color;
    const selectedSize = selection?.size;
    const colorSummary = selectedColor
      ? `${selectedColor.name || "Color"} (${selectedColor.rgb})`
      : "No especificado";
    const sizeSummary = selectedSize || "No especificada";

    setFloatingMessage(
      `Hola Baby Duvaby, me interesa el modelo ${product.model} de ${category?.title || "catalogo"}. Color elegido: ${colorSummary}. Talla elegida: ${sizeSummary}. Precio: ${formattedPrice}.`
    );
  }, []);

  React.useEffect(() => {
    setFloatingMessage(config.whatsapp.message);
  }, [config.whatsapp.message, categoryId]);

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

      <TopBar brand={config.brand} categories={config.categories} />

      {error ? (
        <div className="mx-auto mb-4 mt-3 max-w-3xl rounded-2xl border border-[#ffc6d9] bg-[#fff0f6] px-4 py-3 text-sm font-semibold text-[#b53d69]">
          {error}
        </div>
      ) : null}

      <CategoryProductsPage
        categoryId={categoryId}
        categories={config.categories}
        products={products}
        onWhatsappClick={handleWhatsappClick}
        buildWhatsappHref={buildWhatsappHref}
        onProductContextChange={handleProductContextChange}
      />

      <Footer categories={config.categories} brand={config.brand} whatsappPhone={sanitizedPhone} />
      <FloatingWhatsappButton
        whatsappHref={whatsappHref}
        onWhatsappClick={handleWhatsappClick}
        label="WhatsApp"
      />
      <AppInstallPrompt enabled />
    </main>
  );
}
