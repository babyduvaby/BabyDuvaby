import React from "react";

export default function Testimonials({ items }) {
  if (!Array.isArray(items) || !items.length) {
    return null;
  }

  return (
    <section
      className="mx-auto max-w-6xl px-4 pb-12 sm:px-6"
      aria-label="Testimonios de clientes"
    >
      <div className="mb-5 text-center">
        <p className="baby-kicker text-xs font-extrabold uppercase tracking-[0.24em]">
          Confianza real
        </p>
        <h2 className="section-heading mt-2">Lo que dicen nuestras mamas</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="glass-panel-baby baby-section-glow rounded-3xl border border-white/80 p-5 shadow-candy"
          >
            <p className="text-base font-bold text-ink/90">"{item.quote}"</p>
            <p className="mt-4 text-sm font-extrabold text-[#5f789b]">
              {item.name}
            </p>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8797b2]">
              {item.location}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
