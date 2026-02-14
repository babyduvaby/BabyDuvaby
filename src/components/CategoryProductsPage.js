import React from "react";
import Link from "next/link";
import { getOptimizedCloudinaryUrl } from "../utils/cloudinary";

function formatPrice(value, currency) {
  const amount = Number(value) || 0;
  const safeCurrency = currency || "PEN";

  try {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: safeCurrency,
      minimumFractionDigits: 2
    }).format(amount);
  } catch {
    return `${safeCurrency} ${amount.toFixed(2)}`;
  }
}

// Vista por categoria con productos agrupados por modelo.
export default function CategoryProductsPage({
  categoryId,
  categories,
  products,
  clickCount,
  onWhatsappClick,
  buildWhatsappHref,
  onProductContextChange
}) {
  const category = categories.find((item) => item.id === categoryId);
  const categoryProducts = products.filter((item) => item.categoryId === categoryId);

  React.useEffect(() => {
    if (categoryProducts.length && onProductContextChange) {
      onProductContextChange(categoryProducts[0], category);
    }
  }, [categoryProducts, category, onProductContextChange]);

  if (!category) {
    return (
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-6 sm:px-6" aria-label="Categoria no encontrada">
        <div className="glass-panel rounded-3xl p-6 text-center shadow-candy">
          <h1 className="font-title text-4xl text-ink">Categoria no encontrada</h1>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-full bg-[#5b8cc4] px-5 py-3 text-sm font-bold text-white transition hover:brightness-105"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6" aria-label="Catalogo por categoria">
      <div className="glass-panel rounded-3xl p-5 shadow-candy sm:p-7">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#6f84a2]">
              Catalogo por modelo
            </p>
            <h1 className="font-title text-4xl leading-tight text-ink sm:text-5xl">
              {category.title}
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full bg-[#eef4ff] px-4 py-2 text-sm font-bold text-[#526988] transition hover:bg-[#e1ecff]"
          >
            Volver
          </Link>
        </div>

        {categoryProducts.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categoryProducts.map((product) => {
              const message = `Hola Baby Duvaby, me interesa el modelo ${product.model} de ${category.title}. Precio: ${formatPrice(product.price, product.currency)}.`;
              const whatsappHref = buildWhatsappHref(message);

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-3xl border border-white/80 bg-white/95 shadow-candy transition duration-300 hover:-translate-y-1"
                  onMouseEnter={() => onProductContextChange?.(product, category)}
                >
                  <img
                    src={getOptimizedCloudinaryUrl(product.image, {
                      width: 1200,
                      height: 900,
                      crop: "fill",
                      gravity: "auto"
                    })}
                    alt={product.model}
                    className="h-52 w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7f93b0]">
                      Modelo
                    </p>
                    <h2 className="mt-1 font-title text-[2rem] leading-tight text-ink">
                      {product.model}
                    </h2>
                    <p className="mt-1 text-base font-extrabold text-[#2f936f]">
                      {formatPrice(product.price, product.currency)}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-ink/85">
                      {product.description}
                    </p>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        onProductContextChange?.(product, category);
                        onWhatsappClick("product_card");
                      }}
                      className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#45d4a6] to-[#24b191] px-4 text-base font-extrabold text-white transition duration-300 hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9af2d7]"
                    >
                      Consultar por WhatsApp
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#f4f8ff] p-4 text-center text-sm font-bold text-[#617896]">
            Aun no hay modelos cargados para esta categoria.
          </div>
        )}

        <p className="mt-5 text-center text-sm font-semibold text-ink/80">
          Clics acumulados en WhatsApp: {clickCount}
        </p>
      </div>
    </section>
  );
}
