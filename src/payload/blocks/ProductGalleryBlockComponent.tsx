'use client'

import React from 'react'

interface ProductGalleryBlockData {
  sectionTitle?: string
  sectionSubtitle?: string
  columns?: string
}

export const ProductGalleryBlockComponent: React.FC<{ data: ProductGalleryBlockData }> = ({ data }) => {
  const {
    sectionTitle = 'Explora por categoria',
    sectionSubtitle = 'Catalogo principal',
    columns = '2',
  } = data || {}

  const gridCols = columns === '3' ? 'lg:grid-cols-3' : columns === '4' ? 'lg:grid-cols-4' : 'lg:grid-cols-2'

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6" aria-label="Galeria de Productos">
      <div className="mb-5 text-center">
        <p className="baby-kicker text-xs font-extrabold uppercase tracking-[0.24em]">
          {sectionSubtitle}
        </p>
        <h2 className="section-heading mt-2">{sectionTitle}</h2>
      </div>
      <div className={`grid grid-cols-2 gap-3 md:grid-cols-2 ${gridCols}`}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="baby-section-glow block overflow-hidden rounded-2xl border border-white/80 bg-white/85 p-2 shadow-candy"
          >
            <div className="mx-auto aspect-square w-full max-w-[10.75rem] sm:max-w-[12rem] lg:max-w-full rounded-xl bg-gradient-to-r from-[#fdeaf3] via-[#f4f6ff] to-[#e7f0ff] flex items-center justify-center text-xs font-bold text-[#7d8fab]">
              Producto {i}
            </div>
            <div className="flex min-h-[4.8rem] items-center justify-center px-1 py-2 text-center sm:min-h-[5.2rem] lg:min-h-[5.6rem]">
              <h3 className="text-[1.6rem] leading-[1] text-ink sm:text-[1.75rem]">
                Categoria {i}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
