import React from "react";

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
    <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((category, index) => (
          <article
            key={category.id}
            className="card-reveal group overflow-hidden rounded-3xl bg-white/80 shadow-candy transition duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <img
              src={category.image}
              alt={category.title}
              className="h-36 w-full object-cover sm:h-44"
              loading="lazy"
            />
            <div className="min-h-20 p-3 text-center">
              <h3 className="font-title text-2xl leading-tight text-ink">
                {category.title}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
