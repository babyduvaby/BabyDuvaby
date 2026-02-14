import React from "react";
import { Link } from "react-router-dom";

// Barra superior fija con identidad visual de la marca.
export default function TopBar({ brand }) {
  const [firstWord, secondWord, ...restWords] = (brand?.name || "Baby Duvaby").split(" ");
  const restLabel = restWords.join(" ");

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
              <span className="text-[#f27ea6]">{firstWord || ""}</span>{" "}
              <span className="text-[#6bb2ec]">{secondWord || ""}</span>{" "}
              <span className="text-[#f27ea6]">{restLabel}</span>
            </p>
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-[#6d83a1]">
              {brand?.subtitle || "Ropita y accesorios tiernos"}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
