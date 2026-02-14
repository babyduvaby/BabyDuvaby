import React, { useEffect, useState } from "react";
import { ADMIN_PASSWORD, FIXED_WHATSAPP_PHONE } from "../data/defaultContent";

// Panel local para administrar textos, imágenes y WhatsApp.
export default function AdminPanel({
  config,
  clickCount,
  onSaveConfig,
  onResetClicks
}) {
  const [inputPassword, setInputPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [draft, setDraft] = useState(config);

  useEffect(() => {
    setDraft(config);
  }, [config]);

  const unlockPanel = (event) => {
    event.preventDefault();
    if (inputPassword === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      setAuthError("");
      return;
    }
    setAuthError("Contraseña incorrecta.");
  };

  const updateBrand = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        [field]: value
      }
    }));
  };

  const updateWhatsapp = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      whatsapp: {
        ...prev.whatsapp,
        [field]: value
      }
    }));
  };

  const updateCategory = (index, field, value) => {
    setDraft((prev) => ({
      ...prev,
      categories: prev.categories.map((category, categoryIndex) =>
        categoryIndex === index
          ? {
              ...category,
              [field]: value
            }
          : category
      )
    }));
  };

  const updateFaq = (index, field, value) => {
    setDraft((prev) => ({
      ...prev,
      faq: prev.faq.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value
            }
          : item
      )
    }));
  };

  const saveChanges = () => {
    onSaveConfig(draft);
    setSaveMessage("Cambios guardados correctamente.");
    window.setTimeout(() => setSaveMessage(""), 2500);
  };

  const inputClassName =
    "mt-1 w-full rounded-xl border border-[#d2def2] bg-white/90 px-3 py-2 text-sm text-ink outline-none transition focus-visible:ring-2 focus-visible:ring-[#9cc7ff]";

  if (!isUnlocked) {
    return (
      <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <div className="rounded-3xl bg-white/85 p-5 shadow-candy sm:p-7">
          <h3 className="font-title text-3xl text-ink">Panel Administrador</h3>
          <p className="mt-1 text-sm font-semibold text-ink/80">
            Ingresa la contraseña para editar contenido.
          </p>
          <form onSubmit={unlockPanel} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="w-full text-sm font-semibold text-ink">
              Contraseña
              <input
                type="password"
                className={inputClassName}
                value={inputPassword}
                onChange={(event) => setInputPassword(event.target.value)}
                placeholder="Escribe la contraseña"
              />
            </label>
            <button
              type="submit"
              className="rounded-xl bg-[#5b8cc4] px-5 py-3 text-sm font-bold text-white transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9cc7ff]"
            >
              Entrar
            </button>
          </form>
          {authError ? (
            <p className="mt-3 text-sm font-bold text-[#d94f7d]">{authError}</p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
      <div className="rounded-3xl bg-white/90 p-5 shadow-candy sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-title text-3xl text-ink sm:text-4xl">Panel Administrador</h3>
          <p className="rounded-full bg-[#f2f7ff] px-4 py-2 text-sm font-bold text-ink">
            Clics WhatsApp: {clickCount}
          </p>
        </div>

        <div className="mt-6 grid gap-5">
          <div className="rounded-2xl border border-[#e7edf9] p-4">
            <h4 className="font-title text-2xl text-ink">Hero</h4>
            <div className="mt-3 grid gap-3">
              <label className="text-sm font-semibold text-ink">
                Nombre del negocio
                <input
                  className={inputClassName}
                  value={draft.brand.name}
                  onChange={(event) => updateBrand("name", event.target.value)}
                />
              </label>
              <label className="text-sm font-semibold text-ink">
                Subtítulo
                <input
                  className={inputClassName}
                  value={draft.brand.subtitle}
                  onChange={(event) => updateBrand("subtitle", event.target.value)}
                />
              </label>
              <label className="text-sm font-semibold text-ink">
                Texto botón WhatsApp
                <input
                  className={inputClassName}
                  value={draft.brand.whatsappButtonText}
                  onChange={(event) =>
                    updateBrand("whatsappButtonText", event.target.value)
                  }
                />
              </label>
              <label className="text-sm font-semibold text-ink">
                Texto de envíos
                <input
                  className={inputClassName}
                  value={draft.brand.shippingMessage}
                  onChange={(event) =>
                    updateBrand("shippingMessage", event.target.value)
                  }
                />
              </label>
              <label className="text-sm font-semibold text-ink">
                URL imagen hero
                <input
                  className={inputClassName}
                  value={draft.brand.heroImage}
                  onChange={(event) => updateBrand("heroImage", event.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e7edf9] p-4">
            <h4 className="font-title text-2xl text-ink">WhatsApp</h4>
            <div className="mt-3 grid gap-3">
              <label className="text-sm font-semibold text-ink">
                Número de WhatsApp fijo
                <input
                  className={inputClassName}
                  value="960 476 670"
                  readOnly
                />
              </label>
              <p className="text-xs font-semibold text-ink/70">
                Se usa automáticamente +{FIXED_WHATSAPP_PHONE} en todos los botones.
              </p>
              <label className="text-sm font-semibold text-ink">
                Mensaje predefinido
                <textarea
                  className={inputClassName}
                  rows={3}
                  value={draft.whatsapp.message}
                  onChange={(event) => updateWhatsapp("message", event.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e7edf9] p-4">
            <h4 className="font-title text-2xl text-ink">Categorías</h4>
            <div className="mt-3 grid gap-4">
              {draft.categories.map((category, index) => (
                <div
                  key={category.id}
                  className="rounded-xl border border-[#eff3fb] bg-[#fbfdff] p-3"
                >
                  <label className="text-sm font-semibold text-ink">
                    Título
                    <input
                      className={inputClassName}
                      value={category.title}
                      onChange={(event) =>
                        updateCategory(index, "title", event.target.value)
                      }
                    />
                  </label>
                  <label className="mt-2 block text-sm font-semibold text-ink">
                    URL imagen
                    <input
                      className={inputClassName}
                      value={category.image}
                      onChange={(event) =>
                        updateCategory(index, "image", event.target.value)
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#e7edf9] p-4">
            <h4 className="font-title text-2xl text-ink">Preguntas frecuentes</h4>
            <div className="mt-3 grid gap-4">
              {draft.faq.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#eff3fb] bg-[#fbfdff] p-3"
                >
                  <label className="text-sm font-semibold text-ink">
                    Pregunta
                    <input
                      className={inputClassName}
                      value={item.question}
                      onChange={(event) => updateFaq(index, "question", event.target.value)}
                    />
                  </label>
                  <label className="mt-2 block text-sm font-semibold text-ink">
                    Respuesta
                    <input
                      className={inputClassName}
                      value={item.answer}
                      onChange={(event) => updateFaq(index, "answer", event.target.value)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveChanges}
            className="rounded-xl bg-[#24b191] px-5 py-3 text-sm font-bold text-white transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ce9cf]"
          >
            Guardar cambios
          </button>
          <button
            type="button"
            onClick={onResetClicks}
            className="rounded-xl bg-[#d94f7d] px-5 py-3 text-sm font-bold text-white transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9a6c1]"
          >
            Resetear contador WhatsApp
          </button>
          {saveMessage ? (
            <p className="self-center text-sm font-bold text-[#24b191]">{saveMessage}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
