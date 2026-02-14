import React from "react";
import { Link } from "react-router-dom";
import { getOptimizedCloudinaryUrl } from "../utils/cloudinary";

// Grilla responsive enfocada en conversion por categoria.
export default function CategoryList({ categories, products }) {
  const firstProductImageByCategory = React.useMemo(() => {
    return products.reduce((acc, product) => {
      if (!acc[product.categoryId] && product.image) {
        acc[product.categoryId] = product.image;
      }
      return acc;
    }, {});
  }, [products]);

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

      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, index) => (
          <article
            key={category.id}
            className="card-reveal"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <Link
              to={`/categoria/${category.id}`}
              className="group block overflow-hidden rounded-2xl border border-white/80 bg-white/85 p-2 shadow-candy transition duration-300 hover:-translate-y-1"
              aria-label={`Ver modelos de ${category.title}`}
            >
              <div className="relative h-24 overflow-hidden rounded-xl sm:h-28">
                <img
                  src={getOptimizedCloudinaryUrl(category.image, {
                    width: 560,
                    height: 360,
                    crop: "fill",
                    gravity: "auto"
                  })}
                  alt={category.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="flex min-h-[4.8rem] items-center justify-center px-1 py-2 text-center sm:min-h-[5.2rem]">
                <h3 className="text-[1.6rem] leading-[1] text-ink sm:text-[1.75rem]">
                  {category.title}
                </h3>
              </div>

              <div className="relative h-16 overflow-hidden rounded-xl sm:h-20">
                <img
                  src={getOptimizedCloudinaryUrl(
                    firstProductImageByCategory[category.id] || category.image,
                    {
                      width: 560,
                      height: 260,
                      crop: "fill",
                      gravity: "auto"
                    }
                  )}
                  alt={`${category.title} - referencia inferior`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
