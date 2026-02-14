import React from "react";
import { Link } from "react-router-dom";
import { ADMIN_PANEL_URL } from "../data/defaultContent";

// Pie de página con acceso rápido y datos de contacto.
export default function Footer({ categories }) {
  return (
    <footer className="mx-auto mt-4 w-full max-w-6xl px-4 pb-28 sm:px-6 sm:pb-10">
      <div className="glass-panel rounded-3xl p-6 shadow-candy">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <p className="font-title text-4xl leading-none">
              <span className="text-[#f27ea6]">Baby</span>{" "}
              <span className="text-[#6bb2ec]">Duvaby</span>
            </p>
            <p className="mt-2 text-sm font-semibold text-ink/85">
              Diseñado para mamás y papás que buscan ternura, calidad y estilo.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#6c84a3]">
              Categorías
            </h3>
            <div className="mt-2 flex flex-col gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categoria/${category.id}`}
                  className="text-sm font-bold text-ink/90 transition hover:text-[#f27ea6]"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#6c84a3]">
              Gestión
            </h3>
            <a
              href={ADMIN_PANEL_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex rounded-full border border-[#dce8ff] bg-[#f3f8ff] px-4 py-2 text-sm font-bold text-[#4e6788] transition hover:bg-white"
            >
              Panel Administrador
            </a>
            <p className="mt-3 text-sm font-semibold text-ink/85">
              WhatsApp: <span className="font-extrabold">960 476 670</span>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs font-bold text-[#7d8ca3]">
          © {new Date().getFullYear()} Baby Duvaby. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
