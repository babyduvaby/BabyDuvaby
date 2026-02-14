import React from "react";

// Bloque FAQ con diseño de tarjetas suaves.
export default function FAQ({ faqItems }) {
  if (!faqItems.length) {
    return (
      <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <div className="rounded-3xl bg-white/70 p-5 text-center text-base font-semibold text-ink shadow-candy">
          Aún no hay preguntas frecuentes.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 pb-14 sm:px-6">
      <div className="glass-panel rounded-[2rem] p-5 shadow-candy sm:p-8">
        <h2 className="mb-5 text-center font-title text-5xl text-ink sm:text-6xl">
          Preguntas Frecuentes
        </h2>
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={item.id}
              className={`rounded-2xl border border-white p-4 text-ink ${
                index % 2 === 0 ? "bg-[#f6f9ff]" : "bg-[#fff5fb]"
              }`}
            >
              <p className="text-lg font-extrabold">{item.question}</p>
              <p className="mt-1 text-lg font-bold text-ink/85">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
