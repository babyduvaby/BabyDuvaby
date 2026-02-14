import React from "react";
import { Link } from "react-router-dom";
import { getOptimizedCloudinaryUrl } from "../utils/cloudinary";

const CATEGORY_ICONS = {
  "cat-1": "??",
  "cat-2": "??",
  "cat-3": "???",
  "cat-4": "??",
  "cat-5": "?"
};

// Grilla responsive enfocada en conversion por categoria.
export default function CategoryList({ categories }) {
  if (!categories.length) {
    return (
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="rounded-3xl bg-white/70 p-5 text-center text-base font-semibold text-ink shadow-candy">
          Aun no hay categorias publicadas.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6" aria-label="Categorias principales">
      <div className="mb-5 text-center">
        <p className="baby-kicker text-xs font-extrabold uppercase tracking-[0.24em]">
          Catalogo principal
        </p>
        <h2 className="section-heading mt-2">Explora por categoria</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            to={`/categoria/${category.id}`}
            className="card-reveal group overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/90 shadow-candy transition duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${index * 90}ms` }}
            aria-label={`Ver modelos de ${category.title}`}
          >
            <div className="relative aspect-[4/3]">
              <img
                src={getOptimizedCloudinaryUrl(category.image, {
                  width: 900,
                  height: 700,
                  crop: "fill",
                  gravity: "auto"
                })}
                alt={category.title}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#2e46611f] to-transparent" />
            </div>
            <div className="flex min-h-[8.8rem] flex-col items-center justify-between p-3 text-center">
              <div className="w-full">
                <h3 className="font-title text-[1.95rem] leading-[1.02] text-ink">
                  {category.title}
                </h3>
                <div className="mt-2 h-7 text-3xl leading-none">
                  {CATEGORY_ICONS[category.id] || "??"}
                </div>
              </div>
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
