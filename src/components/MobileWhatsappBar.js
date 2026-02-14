import React from "react";

// Botón fijo inferior para móvil, inspirado en la referencia visual del cliente.
export default function MobileWhatsappBar({ whatsappHref, onWhatsappClick, buttonText }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/60 bg-gradient-to-r from-[#fff4fa] via-[#f7f8ff] to-[#eef8ff] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_26px_rgba(86,99,127,0.16)] sm:hidden">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        onClick={onWhatsappClick}
        className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#46d6aa] to-[#20af90] px-5 text-xl font-extrabold text-white transition duration-300 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#89f0ce]"
      >
        {buttonText} 💬
      </a>
    </div>
  );
}
