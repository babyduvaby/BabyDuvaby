import React from "react";

export default function FloatingWhatsappButton({
  whatsappHref,
  onWhatsappClick,
  label = "WhatsApp"
}) {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      onClick={() => onWhatsappClick("floating_button")}
      className="fixed bottom-4 right-4 z-50 inline-flex min-h-14 items-center gap-2 rounded-full bg-gradient-to-r from-[#24d366] to-[#18b957] px-5 text-sm font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_12px_30px_rgba(20,143,68,0.34)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#a8efc8]"
      aria-label="Abrir WhatsApp"
    >
      <span aria-hidden="true" className="text-xl leading-none">
        💬
      </span>
      <span>{label}</span>
    </a>
  );
}

