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
    <section className="mx-auto max-w-3xl px-4 pb-12 sm:px-6">
      <div className="rounded-[2rem] bg-white/85 p-4 shadow-candy sm:p-8">
        <h2 className="mb-5 text-center font-title text-4xl text-ink sm:text-5xl">
          Preguntas Frecuentes
        </h2>
        <div className="space-y-3">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white bg-[#f6f9ff] p-4 text-ink"
            >
              <p className="text-lg font-bold">{item.question}</p>
              <p className="mt-1 text-lg font-semibold text-ink/90">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

