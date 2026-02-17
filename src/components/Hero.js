import React from "react";
import { getOptimizedCloudinaryUrl } from "../utils/cloudinary";

// Seccion principal con propuesta de valor y CTA de conversion.
export default function Hero({
  brand,
  whatsappHref,
  onWhatsappClick
}) {
  const trustBadges = Array.isArray(brand.trustBadges) ? brand.trustBadges : [];
  const heroHeadlineLead = brand?.heroHeadlineLead || "Viste de ternura a tu";
  const heroHeadlineStrong = brand?.heroHeadlineStrong || "pequeño gran amor.";

  return (
    <section className="relative z-10 mx-auto max-w-xl px-4 pb-10 pt-7 text-center sm:max-w-2xl sm:px-6" aria-label="Presentacion de la marca">
      <div className="glass-panel baby-section-glow relative overflow-hidden rounded-[2rem] p-5 shadow-candy sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#ffd7ea]/70 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-[#cbe7ff]/70 blur-2xl" />

        <div className="mx-auto mb-4 inline-flex rounded-full bg-white/80 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#60789b] shadow-sm">
          Tienda de ropita para bebe
        </div>

        <div className="hero-impact-wrap mt-1">
          <span
            aria-hidden="true"
            className="hero-heart hero-heart-left"
          >
            💖
          </span>
          <h1 className="hero-impact-title">
            <span className="hero-impact-lead">{heroHeadlineLead}</span>{" "}
            <span className="hero-impact-strong">{heroHeadlineStrong}</span>
          </h1>
          <span
            aria-hidden="true"
            className="hero-heart hero-heart-right"
          >
            💖
          </span>
        </div>

        <div className="hero-image-shell mt-6">
          <img
            src={getOptimizedCloudinaryUrl(brand.heroImage, {
              width: 1080
            })}
            alt="Bebe con ropa tierna de Baby Duvaby"
            className="hero-image hero-image-blend h-[18rem] w-full object-cover sm:h-[24rem]"
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
              <a
                key={badge}
                href="#preguntas-frecuentes"
                aria-label={`Ir a preguntas frecuentes sobre ${badge}`}
                className="baby-button-glow rounded-full border border-[#f2d8e9] bg-[#fff5fb] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[#7a86aa]"
              >
                {badge}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
