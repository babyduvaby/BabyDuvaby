import React from "react";
import Link from "next/link";
import { getOptimizedCloudinaryUrl } from "../utils/cloudinary";

function CategoryImage({
  primarySrc,
  fallbackSrc,
  alt,
  heightClass,
  optimizeOptions
}) {
  const [safeSrc, setSafeSrc] = React.useState(primarySrc || fallbackSrc || "");
  const [hasTriedFallback, setHasTriedFallback] = React.useState(false);

  React.useEffect(() => {
    setSafeSrc(primarySrc || fallbackSrc || "");
    setHasTriedFallback(false);
  }, [primarySrc, fallbackSrc]);

  if (!safeSrc) {
    return (
      <div
        className={`${heightClass} flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#fdeaf3] via-[#f4f6ff] to-[#e7f0ff] text-xs font-bold text-[#7d8fab]`}
      >
        Imagen no disponible
      </div>
    );
  }

  return (
    <img
      src={getOptimizedCloudinaryUrl(safeSrc, optimizeOptions)}
      alt={alt}
      className={`${heightClass} w-full rounded-xl object-cover`}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (!hasTriedFallback && fallbackSrc && fallbackSrc !== safeSrc) {
          setSafeSrc(fallbackSrc);
          setHasTriedFallback(true);
          return;
        }

        setSafeSrc("");
      }}
    />
  );
}

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

      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <article
            key={category.id}
            className="card-reveal"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <Link
              href={`/categoria/${category.id}`}
              className="baby-section-glow group block overflow-hidden rounded-2xl border border-white/80 bg-white/85 p-2 shadow-candy transition duration-300 hover:-translate-y-1"
              aria-label={`Ver modelos de ${category.title}`}
            >
              <CategoryImage
                primarySrc={category.image}
                fallbackSrc={
                  category.secondaryImage || firstProductImageByCategory[category.id] || ""
                }
                alt={category.title}
                heightClass="h-24 sm:h-28 lg:h-36"
                optimizeOptions={{
                  width: 900,
                  height: 560,
                  crop: "fill",
                  gravity: "auto"
                }}
              />

              <div className="flex min-h-[4.8rem] items-center justify-center px-1 py-2 text-center sm:min-h-[5.2rem] lg:min-h-[5.6rem]">
                <h3 className="text-[1.6rem] leading-[1] text-ink sm:text-[1.75rem]">
                  {category.title}
                </h3>
              </div>

              <CategoryImage
                primarySrc={
                  category.secondaryImage || firstProductImageByCategory[category.id] || ""
                }
                fallbackSrc={category.image}
                alt={`${category.title} - referencia inferior`}
                heightClass="h-16 sm:h-20 lg:h-24"
                optimizeOptions={{
                  width: 900,
                  height: 360,
                  crop: "fill",
                  gravity: "auto"
                }}
              />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
