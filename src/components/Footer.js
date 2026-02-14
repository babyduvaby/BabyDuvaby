import React from "react";
import Link from "next/link";

// Pie de pagina publico sin accesos de administracion.
export default function Footer({ categories, brand, whatsappPhone }) {
  const [firstWord, secondWord, ...restWords] = (brand?.name || "Baby Duvaby").split(" ");
  const restLabel = restWords.join(" ");

  return (
    <footer className="mx-auto mt-4 w-full max-w-6xl px-4 pb-28 sm:px-6 sm:pb-10">
      <div className="glass-panel baby-section-glow rounded-3xl p-6 shadow-candy">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <p className="font-title text-4xl leading-none">
              <span className="text-[#f27ea6]">{firstWord || ""}</span>{" "}
              <span className="text-[#6bb2ec]">{secondWord || ""}</span>{" "}
              <span className="text-[#f27ea6]">{restLabel}</span>
            </p>
            <p className="mt-2 text-sm font-semibold text-ink/85">
              {brand?.subtitle ||
                "Disenado para mamas y papas que buscan ternura, calidad y estilo."}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#6c84a3]">
              Categorias
            </h3>
            <div className="mt-2 flex flex-col gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categoria/${category.id}`}
                  className="text-sm font-bold text-ink/90 transition hover:text-[#f27ea6]"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#6c84a3]">
              Contacto
            </h3>
            <p className="mt-3 text-sm font-semibold text-ink/85">
              WhatsApp: <span className="font-extrabold">{whatsappPhone}</span>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs font-bold text-[#7d8ca3]">
          &copy; {new Date().getFullYear()} Baby Duvaby. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
