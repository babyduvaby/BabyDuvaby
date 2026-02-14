import React from "react";

// FAQ desplegable con borde activo en foco de conversion.
export default function FAQ({ faqItems }) {
  const [openId, setOpenId] = React.useState(() => faqItems[0]?.id || "");

  React.useEffect(() => {
    if (!faqItems.length) {
      setOpenId("");
      return;
    }

    const stillExists = faqItems.some((item) => item.id === openId);
    if (!stillExists) {
      setOpenId(faqItems[0].id);
    }
  }, [faqItems, openId]);

  if (!faqItems.length) {
    return (
      <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <div className="rounded-3xl bg-white/70 p-5 text-center text-base font-semibold text-ink shadow-candy">
          Aun no hay preguntas frecuentes.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 pb-14 sm:px-6">
      <div className="glass-panel-baby baby-section-glow rounded-[2rem] p-5 shadow-candy sm:p-8">
        <h2 className="section-heading mb-5 text-center text-5xl sm:text-6xl">
          Preguntas Frecuentes
        </h2>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <article
              key={item.id}
              className={`faq-accordion-item rounded-2xl p-0 text-ink ${
                index % 2 === 0 ? "faq-card-soft-a" : "faq-card-soft-b"
              } ${openId === item.id ? "faq-accordion-item-open" : ""}`}
            >
              <button
                type="button"
                className="faq-accordion-trigger flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                aria-expanded={openId === item.id}
                aria-controls={`faq-panel-${item.id}`}
                onClick={() =>
                  setOpenId((currentId) => (currentId === item.id ? "" : item.id))
                }
              >
                <span className="text-lg font-extrabold">{item.question}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`h-5 w-5 shrink-0 text-[#5a7bab] transition-transform duration-300 ${
                    openId === item.id ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div
                id={`faq-panel-${item.id}`}
                role="region"
                aria-hidden={openId !== item.id}
                className={`faq-accordion-content ${openId === item.id ? "is-open" : ""}`}
              >
                <div
                  className={`faq-accordion-content-inner ${
                    openId === item.id ? "pb-4 opacity-100" : "pb-0 opacity-0"
                  }`}
                >
                  <p className="text-lg font-bold text-ink/85">{item.answer}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
