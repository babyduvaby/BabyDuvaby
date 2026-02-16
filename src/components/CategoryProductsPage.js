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

function buildProductWhatsappMessage(product, category, selection) {
  const selectedColor = selection?.color;
  const selectedSize = selection?.size;
  const colorText = selectedColor
    ? `${selectedColor.name || "Color"} (${selectedColor.rgb})`
    : "No especificado";
  const sizeText = selectedSize || "No especificada";

  return [
    `Hola Baby Duvaby, me interesa el modelo ${product.model} de ${category.title}.`,
    `Color elegido: ${colorText}.`,
    `Talla elegida: ${sizeText}.`,
    `Precio: ${formatPrice(product.price, product.currency)}.`
  ].join(" ");
}

function ProductCard({
  product,
  category,
  onWhatsappClick,
  buildWhatsappHref,
  onProductContextChange
}) {
  const availableColors = Array.isArray(product.colors) ? product.colors : [];
  const availableSizes = Array.isArray(product.sizes) ? product.sizes.filter(Boolean) : [];

  const [selectedColorId, setSelectedColorId] = React.useState(availableColors[0]?.id || "");
  const [selectedSize, setSelectedSize] = React.useState(availableSizes[0] || "");

  React.useEffect(() => {
    setSelectedColorId(availableColors[0]?.id || "");
    setSelectedSize(availableSizes[0] || "");
  }, [product.id, availableColors, availableSizes]);

  const selectedColor =
    availableColors.find((item) => item.id === selectedColorId) || availableColors[0] || null;
  const normalizedSelectedSize =
    availableSizes.find((item) => item === selectedSize) || availableSizes[0] || "";
  const selection = React.useMemo(
    () => ({
      color: selectedColor
        ? {
            id: selectedColor.id,
            name: selectedColor.name,
            rgb: selectedColor.rgb
          }
        : null,
      size: normalizedSelectedSize || null
    }),
    [selectedColor, normalizedSelectedSize]
  );

  React.useEffect(() => {
    onProductContextChange?.(product, category, selection);
  }, [product, category, selection, onProductContextChange]);

  const whatsappMessage = buildProductWhatsappMessage(product, category, selection);
  const whatsappHref = buildWhatsappHref(whatsappMessage);

  return (
    <article
      className="overflow-hidden rounded-3xl border border-white/80 bg-white/95 shadow-candy transition duration-300 hover:-translate-y-1"
      onMouseEnter={() => onProductContextChange?.(product, category, selection)}
    >
      <img
        src={getOptimizedCloudinaryUrl(product.image, {
          width: 1080
        })}
        alt={product.model}
        className="aspect-square w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7f93b0]">
          Modelo
        </p>
        <h2 className="mt-1 font-title text-[2rem] leading-tight text-ink">{product.model}</h2>
        <p className="mt-1 text-base font-extrabold text-[#2f936f]">
          {formatPrice(product.price, product.currency)}
        </p>
        <p className="mt-2 text-sm font-semibold text-ink/85">{product.description}</p>

        {availableColors.length ? (
          <div className="mt-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
              Color
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {availableColors.map((color) => {
                const isSelected = color.id === selectedColor?.id;
                const colorValue = String(color.rgb || "#f7bfd7");

                return (
                  <button
                    key={color.id}
                    type="button"
                    title={`${color.name || "Color"} (${colorValue})`}
                    onClick={() => setSelectedColorId(color.id)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                      isSelected
                        ? "border-[#5b7ca7] ring-2 ring-[#d7e8ff]"
                        : "border-white ring-1 ring-[#dce8ff]"
                    }`}
                    aria-label={`Elegir color ${color.name || colorValue}`}
                  >
                    <span
                      className="h-5 w-5 rounded-full border border-[#ffffff99]"
                      style={{ backgroundColor: colorValue }}
                    />
                  </button>
                );
              })}
            </div>
            <p className="mt-1 text-xs font-semibold text-[#687f9f]">
              Seleccionado: {selectedColor?.name || selectedColor?.rgb}
            </p>
          </div>
        ) : null}

        {availableSizes.length ? (
          <div className="mt-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
              Talla
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {availableSizes.map((size) => {
                const isSelected = size === normalizedSelectedSize;

                return (
                  <button
                    key={`${product.id}-${size}`}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-[0.08em] transition ${
                      isSelected
                        ? "border-[#6a90c4] bg-[#eaf2ff] text-[#4f6e97]"
                        : "border-[#d8e6ff] bg-white text-[#6b83a1] hover:bg-[#f5f9ff]"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            onProductContextChange?.(product, category, selection);
            onWhatsappClick("product_card");
          }}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#45d4a6] to-[#24b191] px-4 text-base font-extrabold text-white transition duration-300 hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9af2d7]"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </article>
  );
}

// Vista por categoria con productos agrupados por modelo.
export default function CategoryProductsPage({
  categoryId,
  categories,
  products,
  onWhatsappClick,
  buildWhatsappHref,
  onProductContextChange
}) {
  const category = categories.find((item) => item.id === categoryId);
  const categoryProducts = products.filter((item) => item.categoryId === categoryId);

  if (!category) {
    return (
      <section
        className="mx-auto max-w-5xl px-4 pb-12 pt-6 sm:px-6"
        aria-label="Categoria no encontrada"
      >
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
    <section
      className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6"
      aria-label="Catalogo por categoria"
    >
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
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                category={category}
                onWhatsappClick={onWhatsappClick}
                buildWhatsappHref={buildWhatsappHref}
                onProductContextChange={onProductContextChange}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#f4f8ff] p-4 text-center text-sm font-bold text-[#617896]">
            Aun no hay modelos cargados para esta categoria.
          </div>
        )}
      </div>
    </section>
  );
}
