import React from "react";
import { Link } from "react-router-dom";
import { ADMIN_PANEL_URL } from "../data/defaultContent";

// Barra superior fija con identidad visual de la marca.
export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-6">
      <div className="glass-panel mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl px-3 py-2 shadow-candy sm:px-5 sm:py-3">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src="/logo-baby-duvaby.svg"
            alt="Logo Baby Duvaby"
            className="h-11 w-11 rounded-xl bg-[#f8e4ef] p-1 sm:h-12 sm:w-12"
          />
          <div className="min-w-0">
            <p className="truncate font-title text-3xl leading-none">
              <span className="text-[#f27ea6]">Baby</span>{" "}
              <span className="text-[#6bb2ec]">Duvaby</span>
            </p>
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-[#6d83a1]">
              Ropita y accesorios tiernos
            </p>
          </div>
        </Link>

        <a
          href={ADMIN_PANEL_URL}
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-full border border-[#d7e6ff] bg-[#f4f9ff] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#5f789b] transition hover:bg-white sm:inline-flex"
        >
          Admin
        </a>
      </div>
    </header>
  );
}
