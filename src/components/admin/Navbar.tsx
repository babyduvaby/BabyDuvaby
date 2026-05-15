"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

/* ------------------------------------------------------------------ */
/*  Definicion de los items de navegacion                              */
/* ------------------------------------------------------------------ */

const NAV_ITEMS: NavItem[] = [
  {
    id: "categorias",
    label: "Categorias",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    href: "/admin",
  },
  {
    id: "secciones",
    label: "Secciones",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    href: "/admin",
  },
  {
    id: "productos",
    label: "Productos",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    href: "/admin",
  },
  {
    id: "ajustes",
    label: "Ajustes",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    href: "/admin",
  },
];

/* ------------------------------------------------------------------ */
/*  Item individual                                                     */
/* ------------------------------------------------------------------ */

function NavTab({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: (id: string) => void;
}) {
  const baseClasses =
    "relative inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap transition-all duration-200 select-none snap-start";

  const activeClasses =
    "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-indigo-500/25";

  const inactiveClasses =
    "bg-white/70 text-[#5d6a82] hover:bg-white hover:text-[#374151] active:scale-[0.97]";

  const mergedClasses = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;

  const handleClick = useCallback(() => {
    onClick(item.id);
  }, [item.id, onClick]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isActive}
      className={mergedClasses}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      <span>{item.label}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Indicador de scroll lateral (mobile)                               */
/* ------------------------------------------------------------------ */

function ScrollIndicator({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setShowLeft(scrollLeft > 4);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 4);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  if (!showLeft && !showRight) return null;

  return (
    <>
      {showLeft && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-white/95 to-transparent"
        />
      )}
      {showRight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-white/95 to-transparent"
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar Principal                                                   */
/* ------------------------------------------------------------------ */

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("categorias");
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  /* Sincronizar tab activa con el hash de la URL (#categorias, #secciones, ...) */
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (NAV_ITEMS.some((item) => item.id === hash)) {
      setActiveTab(hash);
    }
  }, [pathname]);

  /* Al cambiar tab, actualizar hash para navegacion y scroll suave a la seccion */
  const handleTabChange = useCallback(
    (id: string) => {
      setActiveTab(id);

      /* Actualizar hash sin recargar la pagina */
      const url = new URL(window.location.href);
      url.hash = id;
      window.history.replaceState(null, "", url.toString());

      /* Scroll suave a la seccion correspondiente si existe */
      const section = document.getElementById(`admin-section-${id}`);
      if (section) {
        const navbarHeight = 80;
        const top = section.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top, behavior: "smooth" });
      }
    },
    []
  );

  return (
    <nav
      role="navigation"
      aria-label="Navegacion del panel de administracion"
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200/80"
    >
      <div className="relative h-16 flex items-center">
        {/* ---- Mobile: scroll horizontal con snap ---- */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto px-4 h-full snap-x scrollbar-none md:justify-center md:overflow-x-visible"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {NAV_ITEMS.map((item) => (
            <NavTab
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              onClick={handleTabChange}
            />
          ))}
        </div>

        {/* Indicadores de scroll (solo mobile) */}
        <div className="md:hidden">
          <ScrollIndicator containerRef={scrollRef} />
        </div>
      </div>

      {/* Linea inferior animada */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] transition-all duration-300 ease-out"
        style={{
          width: `${100 / NAV_ITEMS.length}%`,
          transform: `translateX(${NAV_ITEMS.findIndex((item) => item.id === activeTab) * 100}%)`,
        }}
        aria-hidden="true"
      />
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook utilitario para que los hijos sepan que tab esta activa       */
/* ------------------------------------------------------------------ */

export function useActiveAdminTab() {
  const [activeTab, setActiveTab] = useState("categorias");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setActiveTab(hash);
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.replace("#", "");
      if (newHash) setActiveTab(newHash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return activeTab;
}
