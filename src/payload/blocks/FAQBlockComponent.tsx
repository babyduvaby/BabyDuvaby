'use client'

import React from 'react'

interface FAQBlockData {
  sectionTitle?: string
  items?: Array<{
    question?: string
    answer?: string
  }>
}

export const FAQBlockComponent: React.FC<{ data: FAQBlockData }> = ({ data }) => {
  const {
    sectionTitle = 'Preguntas Frecuentes',
    items = [],
  } = data || {}

  const [openId, setOpenId] = React.useState(0)

  if (!items.length) {
    return (
      <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <div className="rounded-3xl bg-white/70 p-5 text-center text-base font-semibold text-ink shadow-candy">
          Aun no hay preguntas frecuentes configuradas.
        </div>
      </section>
    )
  }

  return (
    <section id="preguntas-frecuentes" className="mx-auto max-w-4xl scroll-mt-28 px-4 pb-14 sm:scroll-mt-32 sm:px-6">
      <div className="glass-panel-baby baby-section-glow rounded-[2rem] p-5 shadow-candy sm:p-8">
        <h2 className="section-heading mb-5 text-center text-5xl sm:text-6xl">
          {sectionTitle}
        </h2>

        <div className="space-y-3">
          {items.map((item, index) => (
            <article
              key={index}
              className={`faq-accordion-item rounded-2xl p-0 text-ink ${
                index % 2 === 0 ? 'faq-card-soft-a' : 'faq-card-soft-b'
              } ${openId === index ? 'faq-accordion-item-open' : ''}`}
            >
              <button
                type="button"
                className="faq-accordion-trigger flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                aria-expanded={openId === index}
                onClick={() => setOpenId(openId === index ? -1 : index)}
              >
                <span className="text-lg font-extrabold">{item.question}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`h-5 w-5 shrink-0 text-[#5a7bab] transition-transform duration-300 ${
                    openId === index ? 'rotate-180' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div
                role="region"
                className={`faq-accordion-content ${openId === index ? 'is-open' : ''}`}
              >
                <div className={`faq-accordion-content-inner ${openId === index ? 'pb-4 opacity-100' : 'pb-0 opacity-0'}`}>
                  <p className="text-lg font-bold text-ink/85">{item.answer}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
