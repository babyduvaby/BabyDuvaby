import React from "react";
import {
  clearCloudinaryConfigLocal,
  getCloudinaryConfig,
  saveCloudinaryConfigLocal,
  uploadLandingImage
} from "../services/imageUpload";

const clone = (value) => JSON.parse(JSON.stringify(value));

const ZONE_LABELS = {
  hero_cta: "Hero CTA",
  mobile_bar: "Barra movil",
  product_card: "Tarjeta producto",
  floating_button: "Boton flotante",
  unknown: "Sin zona"
};

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function moveItem(items, fromIndex, toIndex) {
  if (fromIndex === toIndex) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

function clampPercentage(value, fallback = 50) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(100, Math.max(0, parsed));
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

function RangeField({ label, value, onChange }) {
  const safeValue = clampPercentage(value, 50);

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
        {label} ({Math.round(safeValue)}%)
      </span>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={safeValue}
        onChange={(event) => onChange(clampPercentage(event.target.value, safeValue))}
        className="h-11 w-full cursor-pointer accent-[#6f9ad0]"
      />
    </label>
  );
}

function ImageDropField({ label, onFileSelected, isUploading }) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <div>
      <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
        {label}
      </span>
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-24 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed px-4 py-4 text-center text-sm font-bold transition ${
          isDragging
            ? "border-[#7ca2d9] bg-[#eef5ff] text-[#496a91]"
            : "border-[#d8e6ff] bg-white text-[#5f799b]"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onFileSelected(file);
            }
            event.target.value = "";
          }}
          className="hidden"
        />
        {isUploading ? "Subiendo imagen..." : "Arrastra imagen aqui o haz clic para subir"}
      </label>
      <p className="mt-1 text-[11px] font-semibold text-[#7a90ad]">
        Recomendado: 1080 x 1080 px (cuadrada).
      </p>
    </div>
  );
}

function ImagePreview({
  src,
  alt,
  objectPosition = "50% 50%",
  imageClassName = "aspect-square"
}) {
  const [hasError, setHasError] = React.useState(false);
  const safeSrc = String(src || "");

  React.useEffect(() => {
    setHasError(false);
  }, [safeSrc]);

  if (!safeSrc) {
    return (
      <div className="aspect-square rounded-xl border border-dashed border-[#d8e6ff] bg-white p-3 text-xs font-semibold text-[#7188a7]">
        <div className="flex h-full items-center justify-center text-center">
          Sin imagen para previsualizar.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#d8e6ff] bg-white p-2">
      {!hasError ? (
        <img
          src={safeSrc}
          alt={alt}
          onError={() => setHasError(true)}
          className={`${imageClassName} w-full rounded-lg object-cover`}
          style={{ objectPosition }}
          loading="lazy"
        />
      ) : (
        <div className="rounded-lg bg-[#fff1f6] px-3 py-4 text-xs font-bold text-[#b03e66]">
          No se pudo cargar la previsualizacion. Revisa la URL de la imagen.
        </div>
      )}
    </div>
  );
}

function WhatsAppAnalyticsChart({ analytics }) {
  const byZone = analytics?.byZone || {};
  const zoneRows = Object.entries(byZone).map(([zone, count]) => ({
    zone,
    label: ZONE_LABELS[zone] || zone,
    count: Number(count) || 0
  }));
  const maxClicks = Math.max(1, ...zoneRows.map((item) => item.count));

  const byDay = analytics?.byDay || {};
  const dailyRows = Object.keys(byDay)
    .sort((a, b) => a.localeCompare(b))
    .slice(-7)
    .map((key) => ({ date: key, count: Number(byDay[key]) || 0 }));

  return (
    <article className="glass-panel rounded-3xl p-5 shadow-candy sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-title text-4xl text-ink">Analitica WhatsApp</h2>
        <p className="rounded-full border border-[#d8e6ff] bg-white px-4 py-2 text-sm font-extrabold text-[#5f789b]">
          Total: {analytics?.total || 0}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {zoneRows.map((row) => (
          <div key={row.zone}>
            <div className="mb-1 flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
              <span>{row.label}</span>
              <span>{row.count} clics</span>
            </div>
            <div className="h-3 rounded-full bg-[#e8f0ff]">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-[#5f93d1] to-[#49c6ad]"
                style={{ width: `${(row.count / maxClicks) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
          Ultimos 7 dias
        </p>
        {dailyRows.length ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {dailyRows.map((row) => (
              <div key={row.date} className="rounded-xl border border-[#dce8ff] bg-white p-3 text-center">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#738bab]">
                  {row.date.slice(5)}
                </p>
                <p className="mt-1 text-lg font-extrabold text-[#4f6f97]">{row.count}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[#dce8ff] bg-white p-3 text-sm font-semibold text-[#5f799b]">
            Aun no hay clics registrados por dia.
          </div>
        )}
      </div>
    </article>
  );
}

export default function AdminPanelPage({
  config,
  products,
  clickCount,
  clickAnalytics,
  syncMeta,
  isSaving,
  onSaveContent,
  onRestoreDefaultContent,
  onResetClickCount,
  onImportSnapshot,
  onLogout,
  onLoggedOut
}) {
  const [draftConfig, setDraftConfig] = React.useState(() => clone(config));
  const [draftProducts, setDraftProducts] = React.useState(() => clone(products));
  const [status, setStatus] = React.useState("");
  const [error, setError] = React.useState("");
  const [uploadingKey, setUploadingKey] = React.useState("");
  const [dragMeta, setDragMeta] = React.useState(null);
  const [cloudinaryConfig, setCloudinaryConfig] = React.useState(() => getCloudinaryConfig());
  const [cloudNameDraft, setCloudNameDraft] = React.useState(() => cloudinaryConfig.cloudName || "");
  const [uploadPresetDraft, setUploadPresetDraft] = React.useState(
    () => cloudinaryConfig.uploadPreset || ""
  );

  React.useEffect(() => {
    setDraftConfig(clone(config));
    setDraftProducts(clone(products));
  }, [config, products]);

  React.useEffect(() => {
    const nextConfig = getCloudinaryConfig();
    setCloudinaryConfig(nextConfig);
    setCloudNameDraft((prev) => prev || nextConfig.cloudName || "");
    setUploadPresetDraft((prev) => prev || nextConfig.uploadPreset || "");
  }, []);

  const runUpload = async (file, key, folderName, onUrlReady) => {
    if (!file) {
      return;
    }

    setStatus("");
    setError("");
    setUploadingKey(key);

    try {
      setCloudinaryConfig(getCloudinaryConfig());
      const imageUrl = await uploadLandingImage(file, folderName);
      onUrlReady(imageUrl);
      setStatus("Imagen subida correctamente.");
    } catch (uploadError) {
      setError(uploadError.message || "No se pudo subir la imagen.");
    } finally {
      setUploadingKey("");
    }
  };

  const handleSaveCloudinaryLocal = () => {
    try {
      saveCloudinaryConfigLocal({
        cloudName: cloudNameDraft,
        uploadPreset: uploadPresetDraft
      });
      const nextConfig = getCloudinaryConfig();
      setCloudinaryConfig(nextConfig);
      setStatus("Cloudinary configurado localmente para este navegador.");
      setError("");
    } catch {
      setError("No se pudo guardar configuracion local de Cloudinary.");
    }
  };

  const handleClearCloudinaryLocal = () => {
    try {
      clearCloudinaryConfigLocal();
      const nextConfig = getCloudinaryConfig();
      setCloudinaryConfig(nextConfig);
      setStatus("Configuracion local de Cloudinary eliminada.");
      setError("");
    } catch {
      setError("No se pudo limpiar configuracion local de Cloudinary.");
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

  const reorderCategories = (fromIndex, toIndex) => {
    setDraftConfig((prev) => ({
      ...prev,
      categories: moveItem(prev.categories, fromIndex, toIndex)
    }));
  };

  const addCategory = () => {
    setDraftConfig((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          id: createId("cat"),
          title: "Nueva categoria",
          image: "",
          secondaryImage: "",
          imageFocusX: 50,
          imageFocusY: 50,
          secondaryImageFocusX: 50,
          secondaryImageFocusY: 50
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

  const reorderFaq = (fromIndex, toIndex) => {
    setDraftConfig((prev) => ({
      ...prev,
      faq: moveItem(prev.faq, fromIndex, toIndex)
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

  const reorderProducts = (fromIndex, toIndex) => {
    setDraftProducts((prev) => moveItem(prev, fromIndex, toIndex));
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
        image: "",
        price: 0,
        currency: "PEN"
      }
    ]);
  };

  const removeProduct = (id) => {
    setDraftProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    setStatus("");
    setError("");
    const persistedInFirebase = await onSaveContent(draftConfig, draftProducts, clickAnalytics);

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

  const handleExportBackup = () => {
    const payload = {
      config: draftConfig,
      products: draftProducts,
      analytics: clickAnalytics,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = `baby-duvaby-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
    setStatus("Backup exportado correctamente.");
  };

  const handleImportBackup = async (file) => {
    if (!file) {
      return;
    }

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw);
      await onImportSnapshot(parsed);
      setStatus("Backup importado y aplicado.");
      setError("");
    } catch {
      setError("No se pudo importar el backup. Verifica formato JSON.");
    }
  };

  const handleLogout = async () => {
    await onLogout();
    onLoggedOut?.();
  };

  const handleDropReorder = (type, toIndex) => {
    if (!dragMeta || dragMeta.type !== type) {
      return;
    }

    if (type === "category") {
      reorderCategories(dragMeta.index, toIndex);
    }

    if (type === "product") {
      reorderProducts(dragMeta.index, toIndex);
    }

    if (type === "faq") {
      reorderFaq(dragMeta.index, toIndex);
    }

    setDragMeta(null);
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
          Limpiar analitica
        </button>
      </div>

      {syncMeta?.pendingSync ? (
        <p className="mb-3 rounded-xl border border-[#ffe0b8] bg-[#fff7eb] px-4 py-3 text-sm font-bold text-[#9a6b2f]">
          Cambios guardados localmente y pendientes de sincronizar con Firebase.
        </p>
      ) : null}

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
        <WhatsAppAnalyticsChart analytics={clickAnalytics} />

        <article className="glass-panel rounded-3xl p-5 shadow-candy sm:p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-title text-4xl text-ink">Herramientas admin</h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className="rounded-full border border-[#d6e5ff] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#5d7698] transition hover:bg-[#f5f9ff]"
              >
                Exportar backup
              </button>
              <label className="cursor-pointer rounded-full border border-[#d6e5ff] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#5d7698] transition hover:bg-[#f5f9ff]">
                Importar backup
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    handleImportBackup(file);
                    event.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>
          <p className="text-sm font-semibold text-[#5f799b]">
            Arrastra tarjetas o usa los botones Subir/Bajar para cambiar el orden de categorias,
            FAQ y modelos. Tambien puedes arrastrar imagenes en cada bloque para actualizar rapido.
          </p>

          <div className="mt-4 rounded-2xl border border-[#dce8ff] bg-white/80 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
                Cloudinary
              </p>
              <span className="rounded-full border border-[#dce8ff] bg-[#f6f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#5f799b]">
                {cloudinaryConfig.source === "env"
                  ? "Configurado (Vercel env)"
                  : cloudinaryConfig.source === "local"
                    ? "Configurado (local)"
                    : "No configurado"}
              </span>
            </div>

            {cloudinaryConfig.source === "none" ? (
              <p className="mt-2 text-sm font-semibold text-[#b03e66]">
                No se podran subir imagenes hasta configurar Cloudinary. Si ya agregaste env vars en
                Vercel, haz Redeploy y limpia cache abriendo <span className="font-extrabold">/index.html</span>.
              </p>
            ) : (
              <p className="mt-2 text-sm font-semibold text-[#5f799b]">
                Si estas viendo este panel con Cloudinary configurado pero la subida falla, lo mas
                comun es cache vieja: abre <span className="font-extrabold">/index.html</span> y recarga.
              </p>
            )}

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                label="Cloud name"
                value={cloudNameDraft}
                onChange={(event) => setCloudNameDraft(event.target.value)}
                placeholder="dcrh6nlvf"
              />
              <Field
                label="Upload preset (Unsigned)"
                value={uploadPresetDraft}
                onChange={(event) => setUploadPresetDraft(event.target.value)}
                placeholder="tu_preset_unsigned"
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSaveCloudinaryLocal}
                className="rounded-full border border-[#d6e5ff] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#5d7698] transition hover:bg-[#f5f9ff]"
              >
                Guardar local
              </button>
              <button
                type="button"
                onClick={handleClearCloudinaryLocal}
                className="rounded-full border border-[#ffd5df] bg-[#fff3f7] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#a64b6b] transition hover:bg-[#ffe8ef]"
              >
                Limpiar local
              </button>
            </div>
          </div>
        </article>

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
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="URL imagen principal"
              value={draftConfig.brand.heroImage}
              onChange={(event) => updateBrandField("heroImage", event.target.value)}
            />
            <ImageDropField
              label="Subir o arrastrar imagen"
              isUploading={uploadingKey === "hero"}
              onFileSelected={(file) =>
                runUpload(file, "hero", "landing/hero", (url) => updateBrandField("heroImage", url))
              }
            />
          </div>
          <div className="mt-3">
            <ImagePreview src={draftConfig.brand.heroImage} alt="Previsualizacion Hero" />
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
              <div
                key={category.id}
                draggable
                onDragStart={() => setDragMeta({ type: "category", index })}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDropReorder("category", index)}
                className="rounded-2xl border border-[#dce8ff] bg-white/90 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-extrabold text-ink">
                    ID: {category.id} | Orden: {index + 1}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-[#dce8ff] bg-[#f6f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#5f799b]">
                      Arrastrar
                    </span>
                    <button
                      type="button"
                      onClick={() => reorderCategories(index, index - 1)}
                      disabled={index === 0}
                      className="rounded-full border border-[#dce8ff] bg-[#f6f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#5f799b] transition hover:bg-[#edf4ff] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Subir
                    </button>
                    <button
                      type="button"
                      onClick={() => reorderCategories(index, index + 1)}
                      disabled={index === draftConfig.categories.length - 1}
                      className="rounded-full border border-[#dce8ff] bg-[#f6f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#5f799b] transition hover:bg-[#edf4ff] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Bajar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCategory(category.id)}
                      className="rounded-full border border-[#ffd5df] bg-[#fff3f7] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#a64b6b] transition hover:bg-[#ffe8ef]"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Titulo"
                    value={category.title}
                    onChange={(event) => updateCategory(index, "title", event.target.value)}
                  />
                  <Field
                    label="URL imagen superior"
                    value={category.image}
                    onChange={(event) => updateCategory(index, "image", event.target.value)}
                  />
                </div>
                <div className="mt-3">
                  <Field
                    label="URL imagen inferior"
                    value={category.secondaryImage || ""}
                    onChange={(event) =>
                      updateCategory(index, "secondaryImage", event.target.value)
                    }
                  />
                </div>
                <div className="mt-3 rounded-2xl border border-[#e2ecff] bg-[#f7faff] p-3">
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
                    Ajuste encuadre imagen superior
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <RangeField
                      label="Horizontal"
                      value={category.imageFocusX ?? 50}
                      onChange={(value) => updateCategory(index, "imageFocusX", value)}
                    />
                    <RangeField
                      label="Vertical"
                      value={category.imageFocusY ?? 50}
                      onChange={(value) => updateCategory(index, "imageFocusY", value)}
                    />
                  </div>
                </div>
                <div className="mt-3 rounded-2xl border border-[#e2ecff] bg-[#f7faff] p-3">
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
                    Ajuste encuadre imagen inferior
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <RangeField
                      label="Horizontal"
                      value={category.secondaryImageFocusX ?? 50}
                      onChange={(value) => updateCategory(index, "secondaryImageFocusX", value)}
                    />
                    <RangeField
                      label="Vertical"
                      value={category.secondaryImageFocusY ?? 50}
                      onChange={(value) => updateCategory(index, "secondaryImageFocusY", value)}
                    />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ImageDropField
                    label="Subir o arrastrar imagen superior"
                    isUploading={uploadingKey === `category-${category.id}`}
                    onFileSelected={(file) =>
                      runUpload(file, `category-${category.id}`, "landing/categories", (url) =>
                        updateCategory(index, "image", url)
                      )
                    }
                  />
                  <ImageDropField
                    label="Subir o arrastrar imagen inferior"
                    isUploading={uploadingKey === `category-secondary-${category.id}`}
                    onFileSelected={(file) =>
                      runUpload(
                        file,
                        `category-secondary-${category.id}`,
                        "landing/categories",
                        (url) => updateCategory(index, "secondaryImage", url)
                      )
                    }
                  />
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
                      Previsualizacion superior
                    </p>
                    <ImagePreview
                      src={category.image}
                      alt={`Previsualizacion superior categoria ${category.title}`}
                      objectPosition={`${clampPercentage(category.imageFocusX)}% ${clampPercentage(category.imageFocusY)}%`}
                      imageClassName="aspect-square"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
                      Previsualizacion inferior
                    </p>
                    <ImagePreview
                      src={category.secondaryImage || category.image}
                      alt={`Previsualizacion inferior categoria ${category.title}`}
                      objectPosition={`${clampPercentage(category.secondaryImageFocusX)}% ${clampPercentage(category.secondaryImageFocusY)}%`}
                      imageClassName="aspect-square"
                    />
                  </div>
                </div>
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
              <div
                key={faqItem.id}
                draggable
                onDragStart={() => setDragMeta({ type: "faq", index })}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDropReorder("faq", index)}
                className="rounded-2xl border border-[#dce8ff] bg-white/90 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-extrabold text-ink">
                    ID: {faqItem.id} | Orden: {index + 1}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-[#dce8ff] bg-[#f6f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#5f799b]">
                      Arrastrar
                    </span>
                    <button
                      type="button"
                      onClick={() => reorderFaq(index, index - 1)}
                      disabled={index === 0}
                      className="rounded-full border border-[#dce8ff] bg-[#f6f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#5f799b] transition hover:bg-[#edf4ff] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Subir
                    </button>
                    <button
                      type="button"
                      onClick={() => reorderFaq(index, index + 1)}
                      disabled={index === draftConfig.faq.length - 1}
                      className="rounded-full border border-[#dce8ff] bg-[#f6f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#5f799b] transition hover:bg-[#edf4ff] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Bajar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFaq(faqItem.id)}
                      className="rounded-full border border-[#ffd5df] bg-[#fff3f7] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#a64b6b] transition hover:bg-[#ffe8ef]"
                    >
                      Eliminar
                    </button>
                  </div>
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
              <div
                key={product.id}
                draggable
                onDragStart={() => setDragMeta({ type: "product", index })}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDropReorder("product", index)}
                className="rounded-2xl border border-[#dce8ff] bg-white/90 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-extrabold text-ink">
                    ID: {product.id} | Orden: {index + 1}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-[#dce8ff] bg-[#f6f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#5f799b]">
                      Arrastrar
                    </span>
                    <button
                      type="button"
                      onClick={() => reorderProducts(index, index - 1)}
                      disabled={index === 0}
                      className="rounded-full border border-[#dce8ff] bg-[#f6f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#5f799b] transition hover:bg-[#edf4ff] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Subir
                    </button>
                    <button
                      type="button"
                      onClick={() => reorderProducts(index, index + 1)}
                      disabled={index === draftProducts.length - 1}
                      className="rounded-full border border-[#dce8ff] bg-[#f6f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#5f799b] transition hover:bg-[#edf4ff] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Bajar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      className="rounded-full border border-[#ffd5df] bg-[#fff3f7] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#a64b6b] transition hover:bg-[#ffe8ef]"
                    >
                      Eliminar
                    </button>
                  </div>
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
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
                      Precio
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={Number(product.price) || 0}
                      onChange={(event) =>
                        updateProduct(index, "price", Number(event.target.value || 0))
                      }
                      className="h-11 w-full rounded-xl border border-[#d8e6ff] bg-white px-3 text-sm font-semibold text-ink outline-none transition focus:border-[#7ca2d9] focus:ring-4 focus:ring-[#dce9ff]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#6d87a7]">
                      Moneda
                    </span>
                    <input
                      type="text"
                      value={product.currency || "PEN"}
                      onChange={(event) => updateProduct(index, "currency", event.target.value)}
                      className="h-11 w-full rounded-xl border border-[#d8e6ff] bg-white px-3 text-sm font-semibold text-ink outline-none transition focus:border-[#7ca2d9] focus:ring-4 focus:ring-[#dce9ff]"
                    />
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
                  <ImageDropField
                    label="Subir o arrastrar imagen"
                    isUploading={uploadingKey === `product-${product.id}`}
                    onFileSelected={(file) =>
                      runUpload(file, `product-${product.id}`, "landing/products", (url) =>
                        updateProduct(index, "image", url)
                      )
                    }
                  />
                </div>
                <div className="mt-3">
                  <ImagePreview
                    src={product.image}
                    alt={`Previsualizacion producto ${product.model}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
