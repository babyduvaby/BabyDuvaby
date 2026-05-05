'use client'

import React from 'react'

interface HeroBlockData {
  headlineLead?: string
  headlineStrong?: string
  heroImage?: {
    url?: string
    alt?: string
  }
  whatsappButtonText?: string
  shippingMessage?: string
  trustBadges?: Array<{ badge?: string }>
}

export const HeroBlockComponent: React.FC<{ data: HeroBlockData }> = ({ data }) => {
  const {
    headlineLead = 'Viste de ternura a tu',
    headlineStrong = 'pequeno gran amor.',
    heroImage,
    whatsappButtonText = 'Escribenos por WhatsApp',
    shippingMessage = 'Envios rapidos a todo el Peru',
    trustBadges = [],
  } = data || {}

  return (
    <section className="relative z-10 mx-auto max-w-xl px-4 pb-10 pt-7 text-center sm:max-w-2xl sm:px-6" aria-label="Presentacion de la marca">
      <div className="glass-panel baby-section-glow relative overflow-hidden rounded-[2rem] p-5 shadow-candy sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#ffd7ea]/70 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-[#cbe7ff]/70 blur-2xl" />

        <div className="mx-auto mb-4 inline-flex rounded-full bg-white/80 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#60789b] shadow-sm">
          Tienda de ropita para bebe
        </div>

        <div className="hero-impact-wrap mt-1">
          <h1 className="hero-impact-title">
            <span className="hero-impact-lead">{headlineLead}</span>{' '}
            <span className="hero-impact-strong">{headlineStrong}</span>
          </h1>
        </div>

        {heroImage?.url && (
          <div className="hero-image-shell mt-6">
            <img
              src={heroImage.url}
              alt={heroImage.alt || 'Imagen principal'}
              className="hero-image hero-image-blend h-[18rem] w-full object-cover sm:h-[24rem]"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        <button
          type="button"
          className="baby-button-glow cta-pulse mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#49d8ab] to-[#22b191] px-6 text-lg font-extrabold text-white shadow-candy sm:w-auto sm:text-xl"
        >
          {whatsappButtonText}
        </button>

        <p className="mt-4 text-lg font-extrabold text-ink/90">{shippingMessage}</p>

        {trustBadges?.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {trustBadges.map((badge, index) => (
              <span
                key={index}
                className="baby-button-glow rounded-full border border-[#f2d8e9] bg-[#fff5fb] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[#7a86aa]"
              >
                {badge.badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
