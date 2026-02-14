import React from "react";

// Sección principal con CTA prioritario a WhatsApp.
export default function Hero({
  brand,
  whatsappHref,
  onWhatsappClick,
  clickCount
}) {
  const [firstWord, secondWord, ...restWords] = brand.name.split(" ");
  const restLabel = restWords.join(" ");

  return (
    <section className="relative z-10 mx-auto max-w-xl px-4 pb-12 pt-7 text-center sm:max-w-2xl sm:px-6">
      <div className="glass-panel relative overflow-hidden rounded-[2rem] p-5 shadow-candy sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#ffd7ea]/70 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-[#cbe7ff]/70 blur-2xl" />

        <div className="mx-auto mb-4 inline-flex rounded-full bg-white/80 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#60789b] shadow-sm">
          Tienda de ropita para bebé
        </div>

        <h1 className="font-title text-5xl leading-none sm:text-7xl">
          <span className="text-[#f27ea6]">{firstWord || ""}</span>{" "}
          <span className="text-[#6bb2ec]">{secondWord || ""}</span>{" "}
          <span className="text-[#f27ea6]">{restLabel}</span>
        </h1>
        <p className="mt-1 text-2xl">💗 ✨ 💗</p>
        <p className="mx-auto mt-4 max-w-xl text-lg font-semibold text-ink/90 sm:text-xl">
          {brand.subtitle}
        </p>

        <div className="relative mt-6 overflow-hidden rounded-[2rem] bg-white p-2 shadow-candy">
          <img
            src={brand.heroImage}
            alt="Bebé sonriente con ropa tierna"
            className="hero-image h-[18rem] w-full rounded-[1.5rem] object-cover sm:h-[24rem]"
          />
        </div>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          onClick={onWhatsappClick}
          className="cta-pulse mt-7 hidden min-h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#49d8ab] to-[#22b191] px-6 text-xl font-extrabold text-white shadow-candy transition duration-300 hover:scale-[1.01] hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#89f0ce] sm:inline-flex sm:w-auto"
        >
          {brand.whatsappButtonText}
        </a>

        <p className="mt-4 text-lg font-extrabold text-ink/90">{brand.shippingMessage}</p>
        <p className="mt-2 text-sm font-semibold text-ink/80">
          Clics en WhatsApp: {clickCount}
        </p>
      </div>
    </section>
  );
}
