import React from "react";
import Link from "next/link";

// Barra superior fija con identidad visual de la marca.
export default function TopBar({ brand }) {
  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-6">
      <div className="baby-section-glow mx-auto flex w-full max-w-6xl items-center justify-center rounded-2xl px-3 py-2 sm:px-5 sm:py-3">
        <Link href="/" className="flex min-w-0 flex-col items-center gap-1 text-center">
          <img
            src="/logo-baby-duvaby.svg"
            alt="Logo Baby Duvaby"
            className="h-12 w-auto sm:h-14"
          />
          <p className="text-[11px] font-semibold tracking-[0.08em] text-[#66739a] sm:text-[13px]">
            {brand?.subtitle || "Ropita y accesorios tiernos para tu bebe"}
          </p>
        </Link>
      </div>
    </header>
  );
}
