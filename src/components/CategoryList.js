import React from "react";
import { Link } from "react-router-dom";

// Grilla mobile-first para categorías destacadas.
export default function CategoryList({ categories }) {
  if (!categories.length) {
    return (
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="rounded-3xl bg-white/70 p-5 text-center text-base font-semibold text-ink shadow-candy">
          Aún no hay categorías publicadas.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <div className="mb-5 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#7088a6]">
          Catálogo principal
        </p>
        <h2 className="section-heading mt-2">Explora por categoría</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            to={`/categoria/${category.id}`}
            className="card-reveal group overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/90 shadow-candy transition duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className="relative">
              <img
                src={category.image}
                alt={category.title}
                className="h-40 w-full object-cover sm:h-44"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#2e46611f] to-transparent" />
            </div>
            <div className="min-h-24 p-3 text-center">
              <h3 className="font-title text-[1.95rem] leading-[1.02] text-ink">
                {category.title}
              </h3>
              <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#68809f]">
                Ver modelos
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
