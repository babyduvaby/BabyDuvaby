import React from "react";
import { useNavigate } from "react-router-dom";
import { uploadLandingImage } from "../services/imageUpload";

const clone = (value) => JSON.parse(JSON.stringify(value));

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[#d8e6ff] bg-white px-3 text-sm font-semibold text-ink outline-none transition focus:border-[#7ca2d9] focus:ring-4 focus:ring-[#dce9ff]"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="min-h-24 w-full rounded-xl border border-[#d8e6ff] bg-white px-3 py-2 text-sm font-semibold text-ink outline-none transition focus:border-[#7ca2d9] focus:ring-4 focus:ring-[#dce9ff]"
      />
    </label>
  );
}

export default function AdminPanelPage({
  config,
  products,
  clickCount,
  isSaving,
  onSaveContent,
  onRestoreDefaultContent,
  onResetClickCount,
  onLogout
}) {
  const navigate = useNavigate();
  const [draftConfig, setDraftConfig] = React.useState(() => clone(config));
  const [draftProducts, setDraftProducts] = React.useState(() => clone(products));
  const [status, setStatus] = React.useState("");
  const [error, setError] = React.useState("");
  const [uploadingKey, setUploadingKey] = React.useState("");

  React.useEffect(() => {
    setDraftConfig(clone(config));
    setDraftProducts(clone(products));
  }, [config, products]);

  const runUpload = async (file, key, folderName, onUrlReady) => {
    if (!file) {
      return;
    }

    setStatus("");
    setError("");
    setUploadingKey(key);

    try {
      const imageUrl = await uploadLandingImage(file, folderName);
      onUrlReady(imageUrl);
      setStatus("Imagen subida correctamente.");
    } catch (uploadError) {
      setError(uploadError.message || "No se pudo subir la imagen.");
    } finally {
      setUploadingKey("");
    }
  };

  const updateBrandField = (field, value) => {
    setDraftConfig((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        [field]: value
      }
    }));
  };

  const updateWhatsappField = (field, value) => {
    setDraftConfig((prev) => ({
      ...prev,
      whatsapp: {
        ...prev.whatsapp,
        [field]: value
      }
    }));
  };

  const updateCategory = (index, field, value) => {
    setDraftConfig((prev) => {
      const nextCategories = [...prev.categories];
      nextCategories[index] = {
        ...nextCategories[index],
        [field]: value
      };
      return {
        ...prev,
        categories: nextCategories
      };
    });
  };

  const addCategory = () => {
    setDraftConfig((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          id: createId("cat"),
          title: "Nueva categoria",
          image: ""
        }
      ]
    }));
  };

  const removeCategory = (id) => {
    setDraftConfig((prev) => ({
      ...prev,
      categories: prev.categories.filter((item) => item.id !== id)
    }));
    setDraftProducts((prev) => prev.filter((item) => item.categoryId !== id));
  };

  const updateFaq = (index, field, value) => {
    setDraftConfig((prev) => {
      const nextFaq = [...prev.faq];
      nextFaq[index] = {
        ...nextFaq[index],
        [field]: value
      };
      return {
        ...prev,
        faq: nextFaq
      };
    });
  };

  const addFaq = () => {
    setDraftConfig((prev) => ({
      ...prev,
      faq: [
        ...prev.faq,
        {
          id: createId("faq"),
          question: "Nueva pregunta",
          answer: "Nueva respuesta"
        }
      ]
    }));
  };

  const removeFaq = (id) => {
    setDraftConfig((prev) => ({
      ...prev,
      faq: prev.faq.filter((item) => item.id !== id)
    }));
  };

  const updateProduct = (index, field, value) => {
    setDraftProducts((prev) => {
      const nextProducts = [...prev];
      nextProducts[index] = {
        ...nextProducts[index],
        [field]: value
      };
      return nextProducts;
    });
  };

  const addProduct = () => {
    const firstCategoryId = draftConfig.categories[0]?.id || "cat-1";
    setDraftProducts((prev) => [
      ...prev,
      {
        id: createId("p"),
        categoryId: firstCategoryId,
        model: "Nuevo modelo",
        description: "",
        image: ""
      }
    ]);
  };

  const removeProduct = (id) => {
    setDraftProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    setStatus("");
    setError("");
    const persistedInFirebase = await onSaveContent(draftConfig, draftProducts);

    if (persistedInFirebase) {
      setStatus("Cambios guardados en Firebase.");
      return;
    }

    setStatus("Cambios guardados localmente.");
  };

  const handleRestore = async () => {
    setStatus("");
    setError("");
    await onRestoreDefaultContent();
    setStatus("Contenido restaurado.");
  };

  const handleLogout = async () => {
    await onLogout();
    navigate("/admin/login", { replace: true });
  };

  const categoryOptions = draftConfig.categories.map((item) => ({
    id: item.id,
    label: item.title
  }));

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#6e88a8]">
            Panel Administrador
          </p>
          <h1 className="font-title text-5xl text-ink sm:text-6xl">Gestion de contenido</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#4ed0a9] to-[#27b494] px-5 text-sm font-extrabold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={handleRestore}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#d8e6ff] bg-white px-5 text-sm font-extrabold text-[#5d7698] transition hover:bg-[#f4f8ff]"
          >
            Restaurar defaults
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ffd6df] bg-[#fff3f7] px-5 text-sm font-extrabold text-[#a54a69] transition hover:bg-[#ffe8ef]"
          >
            Cerrar sesion
          </button>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-[#dce8ff] bg-[#f4f8ff] px-4 py-3 text-sm font-bold text-[#5a7395]">
        Clics WhatsApp acumulados: {clickCount}
        <button
          type="button"
          onClick={onResetClickCount}
          className="ml-3 rounded-full border border-[#cde0ff] bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#5f799b] transition hover:bg-[#eff5ff]"
        >
          Reiniciar contador
        </button>
      </div>

      {status ? (
        <p className="mb-3 rounded-xl border border-[#c9efd8] bg-[#effdf5] px-4 py-3 text-sm font-bold text-[#1f7e53]">
          {status}
        </p>
      ) : null}
      {error ? (
        <p className="mb-3 rounded-xl border border-[#ffd3dd] bg-[#fff1f6] px-4 py-3 text-sm font-bold text-[#b03e66]">
          {error}
        </p>
      ) : null}

      <div className="space-y-4">
        <article className="glass-panel rounded-3xl p-5 shadow-candy sm:p-6">
          <h2 className="font-title text-4xl text-ink">Marca y Hero</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="Nombre de marca"
              value={draftConfig.brand.name}
              onChange={(event) => updateBrandField("name", event.target.value)}
            />
            <Field
              label="Texto boton WhatsApp"
              value={draftConfig.brand.whatsappButtonText}
              onChange={(event) => updateBrandField("whatsappButtonText", event.target.value)}
            />
          </div>
          <div className="mt-3">
            <TextArea
              label="Subtitulo"
              value={draftConfig.brand.subtitle}
              onChange={(event) => updateBrandField("subtitle", event.target.value)}
            />
          </div>
          <div className="mt-3">
            <Field
              label="Mensaje de envio"
              value={draftConfig.brand.shippingMessage}
              onChange={(event) => updateBrandField("shippingMessage", event.target.value)}
            />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <Field
              label="URL imagen principal"
              value={draftConfig.brand.heroImage}
              onChange={(event) => updateBrandField("heroImage", event.target.value)}
            />
            <label className="block">
              <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
                Subir archivo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  runUpload(file, "hero", "landing/hero", (url) =>
                    updateBrandField("heroImage", url)
                  );
                  event.target.value = "";
                }}
                className="w-full rounded-xl border border-[#d8e6ff] bg-white px-3 py-2 text-sm font-semibold text-ink file:mr-3 file:rounded-full file:border-0 file:bg-[#eef5ff] file:px-3 file:py-1 file:text-xs file:font-extrabold file:text-[#5b7698]"
              />
              {uploadingKey === "hero" ? (
                <p className="mt-1 text-xs font-bold text-[#5f7a9c]">Subiendo imagen...</p>
              ) : null}
            </label>
          </div>
        </article>

        <article className="glass-panel rounded-3xl p-5 shadow-candy sm:p-6">
          <h2 className="font-title text-4xl text-ink">WhatsApp</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="Numero"
              value={draftConfig.whatsapp.phone}
              onChange={(event) => updateWhatsappField("phone", event.target.value)}
            />
            <Field
              label="Mensaje predeterminado"
              value={draftConfig.whatsapp.message}
              onChange={(event) => updateWhatsappField("message", event.target.value)}
            />
          </div>
        </article>

        <article className="glass-panel rounded-3xl p-5 shadow-candy sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-title text-4xl text-ink">Categorias</h2>
            <button
              type="button"
              onClick={addCategory}
              className="rounded-full border border-[#d6e5ff] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#5d7698] transition hover:bg-[#f5f9ff]"
            >
              Agregar categoria
            </button>
          </div>

          <div className="space-y-3">
            {draftConfig.categories.map((category, index) => (
              <div key={category.id} className="rounded-2xl border border-[#dce8ff] bg-white/90 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-extrabold text-ink">ID: {category.id}</p>
                  <button
                    type="button"
                    onClick={() => removeCategory(category.id)}
                    className="rounded-full border border-[#ffd5df] bg-[#fff3f7] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#a64b6b] transition hover:bg-[#ffe8ef]"
                  >
                    Eliminar
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Titulo"
                    value={category.title}
                    onChange={(event) => updateCategory(index, "title", event.target.value)}
                  />
                  <Field
                    label="URL imagen"
                    value={category.image}
                    onChange={(event) => updateCategory(index, "image", event.target.value)}
                  />
                </div>
                <label className="mt-3 block">
                  <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
                    Subir imagen categoria
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      runUpload(file, `category-${category.id}`, "landing/categories", (url) =>
                        updateCategory(index, "image", url)
                      );
                      event.target.value = "";
                    }}
                    className="w-full rounded-xl border border-[#d8e6ff] bg-white px-3 py-2 text-sm font-semibold text-ink file:mr-3 file:rounded-full file:border-0 file:bg-[#eef5ff] file:px-3 file:py-1 file:text-xs file:font-extrabold file:text-[#5b7698]"
                  />
                  {uploadingKey === `category-${category.id}` ? (
                    <p className="mt-1 text-xs font-bold text-[#5f7a9c]">Subiendo imagen...</p>
                  ) : null}
                </label>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-panel rounded-3xl p-5 shadow-candy sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-title text-4xl text-ink">FAQ</h2>
            <button
              type="button"
              onClick={addFaq}
              className="rounded-full border border-[#d6e5ff] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#5d7698] transition hover:bg-[#f5f9ff]"
            >
              Agregar pregunta
            </button>
          </div>
          <div className="space-y-3">
            {draftConfig.faq.map((faqItem, index) => (
              <div key={faqItem.id} className="rounded-2xl border border-[#dce8ff] bg-white/90 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-extrabold text-ink">ID: {faqItem.id}</p>
                  <button
                    type="button"
                    onClick={() => removeFaq(faqItem.id)}
                    className="rounded-full border border-[#ffd5df] bg-[#fff3f7] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#a64b6b] transition hover:bg-[#ffe8ef]"
                  >
                    Eliminar
                  </button>
                </div>
                <Field
                  label="Pregunta"
                  value={faqItem.question}
                  onChange={(event) => updateFaq(index, "question", event.target.value)}
                />
                <div className="mt-3">
                  <TextArea
                    label="Respuesta"
                    value={faqItem.answer}
                    onChange={(event) => updateFaq(index, "answer", event.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-panel rounded-3xl p-5 shadow-candy sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-title text-4xl text-ink">Modelos y productos</h2>
            <button
              type="button"
              onClick={addProduct}
              className="rounded-full border border-[#d6e5ff] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#5d7698] transition hover:bg-[#f5f9ff]"
            >
              Agregar modelo
            </button>
          </div>

          <div className="space-y-3">
            {draftProducts.map((product, index) => (
              <div key={product.id} className="rounded-2xl border border-[#dce8ff] bg-white/90 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-extrabold text-ink">ID: {product.id}</p>
                  <button
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    className="rounded-full border border-[#ffd5df] bg-[#fff3f7] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#a64b6b] transition hover:bg-[#ffe8ef]"
                  >
                    Eliminar
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Nombre del modelo"
                    value={product.model}
                    onChange={(event) => updateProduct(index, "model", event.target.value)}
                  />
                  <label className="block">
                    <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
                      Categoria
                    </span>
                    <select
                      value={product.categoryId}
                      onChange={(event) => updateProduct(index, "categoryId", event.target.value)}
                      className="h-11 w-full rounded-xl border border-[#d8e6ff] bg-white px-3 text-sm font-semibold text-ink outline-none transition focus:border-[#7ca2d9] focus:ring-4 focus:ring-[#dce9ff]"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="mt-3">
                  <TextArea
                    label="Descripcion"
                    value={product.description}
                    onChange={(event) => updateProduct(index, "description", event.target.value)}
                  />
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="URL imagen"
                    value={product.image}
                    onChange={(event) => updateProduct(index, "image", event.target.value)}
                  />
                  <label className="block">
                    <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
                      Subir imagen
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        runUpload(file, `product-${product.id}`, "landing/products", (url) =>
                          updateProduct(index, "image", url)
                        );
                        event.target.value = "";
                      }}
                      className="w-full rounded-xl border border-[#d8e6ff] bg-white px-3 py-2 text-sm font-semibold text-ink file:mr-3 file:rounded-full file:border-0 file:bg-[#eef5ff] file:px-3 file:py-1 file:text-xs file:font-extrabold file:text-[#5b7698]"
                    />
                    {uploadingKey === `product-${product.id}` ? (
                      <p className="mt-1 text-xs font-bold text-[#5f7a9c]">Subiendo imagen...</p>
                    ) : null}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
