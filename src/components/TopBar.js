import React from "react";
import Link from "next/link";
import InstallAppButton from "./InstallAppButton";

// Barra superior fija con identidad visual de la marca.
export default function TopBar({ brand, categories = [], pinToViewport = false }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {pinToViewport ? <div aria-hidden="true" className="h-[5.25rem] sm:h-[5.75rem]" /> : null}
      <header
        className={`z-40 px-3 pt-3 sm:px-6 ${
          pinToViewport ? "fixed inset-x-0 top-0" : "sticky top-0"
        }`}
      >
        <div className="baby-section-glow mx-auto grid w-full max-w-6xl grid-cols-[2.5rem,1fr,2.5rem] items-center rounded-2xl px-2 py-2 sm:grid-cols-[3.25rem,1fr,3.25rem] sm:px-4 sm:py-3">
          <button
            type="button"
            aria-label="Abrir menu de categorias"
            aria-expanded={isMenuOpen}
            aria-controls="baby-menu-categorias"
            onClick={() => setIsMenuOpen(true)}
            className="baby-menu-trigger inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#ff5ea7] sm:h-11 sm:w-11"
          >
            <span className="sr-only">Menu</span>
            <span className="flex w-4 flex-col gap-1 sm:w-5 sm:gap-1.5">
              <span className="h-[2px] w-full rounded-full bg-current sm:h-[2.5px]" />
              <span className="h-[2px] w-full rounded-full bg-current sm:h-[2.5px]" />
              <span className="h-[2px] w-full rounded-full bg-current sm:h-[2.5px]" />
            </span>
          </button>

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

          <span className="h-9 w-9 sm:h-11 sm:w-11" aria-hidden="true" />
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          onClick={closeMenu}
          className="absolute inset-0 h-full w-full bg-[#1f2442]/35"
          aria-label="Cerrar menu"
        />
        <aside
          id="baby-menu-categorias"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de categorias"
          className={`baby-side-menu relative flex h-full w-[50vw] flex-col px-3 py-5 transition-transform duration-300 sm:w-80 sm:px-4 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#944576]">
              Menu
            </p>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Cerrar"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/55 text-xl font-black text-[#8f4675]"
            >
              x
            </button>
          </div>

          <nav aria-label="Categorias principales" className="flex-1 space-y-2 overflow-y-auto pr-1">
            <Link
              href="/"
              onClick={closeMenu}
              className="baby-side-link block rounded-xl px-3 py-3 text-base font-extrabold text-[#7d3f67]"
            >
              Inicio
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.id}`}
                onClick={closeMenu}
                className="baby-side-link block rounded-xl px-3 py-3 text-base font-extrabold text-[#7d3f67]"
              >
                {category.title}
              </Link>
            ))}
          </nav>

          <div className="mt-4 border-t border-white/45 pt-4">
            <InstallAppButton
              className="w-full"
              label="Instalar aplicación"
              onAfterClick={closeMenu}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
