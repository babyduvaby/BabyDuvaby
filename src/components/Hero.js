import React from "react";
import { getOptimizedCloudinaryUrl } from "../utils/cloudinary";

// Seccion principal con propuesta de valor y CTA de conversion.
export default function Hero({
  brand,
  whatsappHref,
  onWhatsappClick
}) {
  const [firstWord, secondWord, ...restWords] = (brand.name || "Baby Duvaby").split(" ");
  const restLabel = restWords.join(" ");
  const trustBadges = Array.isArray(brand.trustBadges) ? brand.trustBadges : [];

  return (
    <section className="relative z-10 mx-auto max-w-xl px-4 pb-10 pt-7 text-center sm:max-w-2xl sm:px-6" aria-label="Presentacion de la marca">
      <div className="glass-panel baby-section-glow relative overflow-hidden rounded-[2rem] p-5 shadow-candy sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#ffd7ea]/70 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-[#cbe7ff]/70 blur-2xl" />

        <div className="mx-auto mb-4 inline-flex rounded-full bg-white/80 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#60789b] shadow-sm">
          Tienda de ropita para bebe
        </div>

        <h1 className="font-title text-5xl leading-none sm:text-7xl">
          <span className="text-[#f27ea6]">{firstWord || ""}</span>{" "}
          <span className="text-[#6bb2ec]">{secondWord || ""}</span>{" "}
          <span className="text-[#f27ea6]">{restLabel}</span>
        </h1>
        <p className="mt-3 mx-auto max-w-xl text-lg font-semibold text-ink/90 sm:text-xl">
          {brand.subtitle}
        </p>

        <div className="baby-section-glow relative mt-6 overflow-hidden rounded-[2rem] bg-white/70 p-2 shadow-candy">
          <img
            src={getOptimizedCloudinaryUrl(brand.heroImage, {
              width: 1600,
              height: 1000,
              crop: "fill",
              gravity: "auto"
            })}
            alt="Bebe con ropa tierna de Baby Duvaby"
            className="hero-image h-[18rem] w-full rounded-[1.5rem] object-cover sm:h-[24rem]"
            loading="eager"
            decoding="async"
          />
        </div>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          onClick={() => onWhatsappClick("hero_cta")}
          className="baby-button-glow cta-pulse mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#49d8ab] to-[#22b191] px-6 text-lg font-extrabold text-white shadow-candy transition duration-300 hover:scale-[1.01] hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#89f0ce] sm:w-auto sm:text-xl"
        >
          {brand.whatsappButtonText}
        </a>

        <p className="mt-4 text-lg font-extrabold text-ink/90">{brand.shippingMessage}</p>

        {trustBadges.length ? (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2" aria-label="Indicadores de confianza">
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="baby-button-glow rounded-full border border-[#f2d8e9] bg-[#fff5fb] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[#7a86aa]"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
