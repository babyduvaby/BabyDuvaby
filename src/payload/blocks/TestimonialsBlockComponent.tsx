'use client'

import React from 'react'

interface TestimonialsBlockData {
  sectionTitle?: string
  sectionSubtitle?: string
  items?: Array<{
    name?: string
    quote?: string
    location?: string
    rating?: number
    avatar?: {
      url?: string
    }
  }>
}

function Stars({ rating }: { rating: number }) {
  return (
    <p className="mt-1 inline-flex items-center gap-0.5" aria-label={`${rating} estrellas`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const active = index < rating
        return (
          <svg
            key={`star-${index}`}
            viewBox="0 0 24 24"
            className={`h-4 w-4 ${active ? 'text-[#f4a11a]' : 'text-[#ced8ea]'}`}
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.6 6.1 20.5l1.2-6.5-4.8-4.6 6.6-.9L12 2.5Z" />
          </svg>
        )
      })}
    </p>
  )
}

export const TestimonialsBlockComponent: React.FC<{ data: TestimonialsBlockData }> = ({ data }) => {
  const {
    sectionTitle = 'Lo que dicen nuestras mamas',
    sectionSubtitle = 'Confianza real',
    items = [],
  } = data || {}

  const [activeIndex, setActiveIndex] = React.useState(0)
  const railRef = React.useRef<HTMLDivElement>(null)

  if (!items.length) return null

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6" aria-label="Testimonios">
      <div className="mb-5 text-center">
        <p className="baby-kicker text-xs font-extrabold uppercase tracking-[0.24em]">
          {sectionSubtitle}
        </p>
        <h2 className="section-heading mt-2">{sectionTitle}</h2>
      </div>

      <div className="relative">
        <div
          ref={railRef}
          className="testimonial-rail flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
        >
          {items.map((item, index) => (
            <article
              key={index}
              data-slide="1"
              className="testimonial-card-glow snap-start flex min-h-[15.5rem] w-[86%] shrink-0 flex-col rounded-3xl p-5 sm:w-[48%] lg:w-[32%]"
            >
              <div className="flex items-center gap-3">
                {item.avatar?.url ? (
                  <img
                    src={item.avatar.url}
                    alt={`Foto de ${item.name}`}
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-[#ffd6ea]"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#fdeaf3] to-[#e7f0ff] ring-2 ring-[#ffd6ea]" />
                )}
                <div>
                  <p className="text-sm font-extrabold text-[#5f789b]">{item.name}</p>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8797b2]">
                    {item.location}
                  </p>
                  <Stars rating={item.rating || 5} />
                </div>
              </div>
              <p className="mt-4 text-base font-bold text-ink/90">&ldquo;{item.quote}&rdquo;</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
