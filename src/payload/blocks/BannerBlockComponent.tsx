'use client'

import React from 'react'

interface BannerBlockData {
  title?: string
  subtitle?: string
  image?: {
    url?: string
    alt?: string
  }
  ctaText?: string
  ctaLink?: string
  backgroundColor?: string
  layout?: 'full' | 'left-text' | 'right-text'
}

export const BannerBlockComponent: React.FC<{ data: BannerBlockData }> = ({ data }) => {
  const {
    title = 'Titulo del Banner',
    subtitle,
    image,
    ctaText = 'Ver mas',
    ctaLink,
    backgroundColor = '#fce9f2',
    layout = 'full',
  } = data || {}

  if (layout === 'left-text') {
    return (
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div
          className="glass-panel baby-section-glow rounded-[2rem] p-5 shadow-candy sm:p-8 flex flex-col sm:flex-row items-center gap-6"
          style={{ backgroundColor }}
        >
          <div className="flex-1 text-center sm:text-left">
            <h2 className="section-heading text-3xl sm:text-4xl">{title}</h2>
            {subtitle && <p className="mt-3 text-base font-bold text-ink/85">{subtitle}</p>}
            {ctaText && (
              <a
                href={ctaLink || '#'}
                className="baby-button-glow mt-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#49d8ab] to-[#22b191] px-6 py-3 text-base font-extrabold text-white shadow-candy"
              >
                {ctaText}
              </a>
            )}
          </div>
          {image?.url && (
            <div className="flex-1">
              <img
                src={image.url}
                alt={image.alt || title}
                className="rounded-2xl object-cover w-full h-64 sm:h-72"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </section>
    )
  }

  if (layout === 'right-text') {
    return (
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div
          className="glass-panel baby-section-glow rounded-[2rem] p-5 shadow-candy sm:p-8 flex flex-col sm:flex-row-reverse items-center gap-6"
          style={{ backgroundColor }}
        >
          <div className="flex-1 text-center sm:text-right">
            <h2 className="section-heading text-3xl sm:text-4xl">{title}</h2>
            {subtitle && <p className="mt-3 text-base font-bold text-ink/85">{subtitle}</p>}
            {ctaText && (
              <a
                href={ctaLink || '#'}
                className="baby-button-glow mt-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#49d8ab] to-[#22b191] px-6 py-3 text-base font-extrabold text-white shadow-candy"
              >
                {ctaText}
              </a>
            )}
          </div>
          {image?.url && (
            <div className="flex-1">
              <img
                src={image.url}
                alt={image.alt || title}
                className="rounded-2xl object-cover w-full h-64 sm:h-72"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
      <div
        className="glass-panel baby-section-glow rounded-[2rem] p-5 shadow-candy sm:p-8 text-center"
        style={{ backgroundColor }}
      >
        {image?.url && (
          <img
            src={image.url}
            alt={image.alt || title}
            className="mx-auto rounded-2xl object-cover w-full h-64 sm:h-80 mb-5"
            loading="lazy"
          />
        )}
        <h2 className="section-heading text-3xl sm:text-5xl">{title}</h2>
        {subtitle && <p className="mt-3 text-base font-bold text-ink/85">{subtitle}</p>}
        {ctaText && (
          <a
            href={ctaLink || '#'}
            className="baby-button-glow mt-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#49d8ab] to-[#22b191] px-6 py-3 text-base font-extrabold text-white shadow-candy"
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  )
}
