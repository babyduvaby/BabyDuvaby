import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  defaultLandingConfig,
  productCatalog,
  STORAGE_KEYS
} from "../data/defaultContent";
import { firebaseDb } from "../firebase";

const LANDING_DOC_REF = doc(firebaseDb, "landing", "main");

const toJsonClone = (value) => JSON.parse(JSON.stringify(value));

const defaultConfigClone = () => toJsonClone(defaultLandingConfig);
const defaultProductsClone = () => toJsonClone(productCatalog);
const defaultSyncMeta = () => ({
  pendingSync: false,
  lastSavedAt: null
});
const defaultAnalytics = () => ({
  total: 0,
  byZone: {
    hero_cta: 0,
    mobile_bar: 0,
    product_card: 0,
    floating_button: 0,
    unknown: 0
  },
  byDay: {}
});

const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const clampPercent = (value, fallback = 50) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(100, Math.max(0, parsed));
};

function normalizeHexColor(value, fallback = "#f7bfd7") {
  const raw = String(value || "").trim();
  const candidate = raw.startsWith("#") ? raw : `#${raw}`;

  if (/^#[0-9a-fA-F]{6}$/.test(candidate)) {
    return candidate.toLowerCase();
  }

  return fallback;
}

function sanitizeProductColors(rawColors, fallbackColors = []) {
  const source = Array.isArray(rawColors) ? rawColors : fallbackColors;
  const normalized = source
    .filter((item) => isRecord(item))
    .map((item, index) => ({
      id: String(item.id || `color-${index + 1}`),
      name: String(item.name || `Color ${index + 1}`),
      rgb: normalizeHexColor(item.rgb, "#f7bfd7")
    }));

  return normalized;
}

function sanitizeProductSizes(rawSizes, fallbackSizes = []) {
  const source = Array.isArray(rawSizes) ? rawSizes : fallbackSizes;

  return source
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, 30);
}

function sanitizeConfig(rawConfig) {
  const defaults = defaultConfigClone();

  if (!isRecord(rawConfig)) {
    return defaults;
  }

  const categories = Array.isArray(rawConfig.categories)
    ? rawConfig.categories
        .filter((item) => isRecord(item))
        .map((item, index) => ({
          id: String(item.id || `cat-${index + 1}`),
          title: String(item.title || `Categoria ${index + 1}`),
          image: String(item.image || defaults.categories[index]?.image || ""),
          secondaryImage: String(
            item.secondaryImage || item.image || defaults.categories[index]?.secondaryImage || ""
          ),
          imageFocusX: clampPercent(item.imageFocusX, defaults.categories[index]?.imageFocusX ?? 50),
          imageFocusY: clampPercent(item.imageFocusY, defaults.categories[index]?.imageFocusY ?? 50),
          secondaryImageFocusX: clampPercent(
            item.secondaryImageFocusX,
            defaults.categories[index]?.secondaryImageFocusX ?? 50
          ),
          secondaryImageFocusY: clampPercent(
            item.secondaryImageFocusY,
            defaults.categories[index]?.secondaryImageFocusY ?? 50
          )
        }))
    : defaults.categories;

  const faq = Array.isArray(rawConfig.faq)
    ? rawConfig.faq
        .filter((item) => isRecord(item))
        .map((item, index) => ({
          id: String(item.id || `faq-${index + 1}`),
          question: String(item.question || `Pregunta ${index + 1}`),
          answer: String(item.answer || "")
        }))
    : defaults.faq;

  const testimonials = Array.isArray(rawConfig.testimonials)
    ? rawConfig.testimonials
        .filter((item) => isRecord(item))
        .map((item, index) => ({
          id: String(item.id || `t-${index + 1}`),
          name: String(item.name || `Cliente ${index + 1}`),
          quote: String(item.quote || ""),
          location: String(item.location || ""),
          rating: Math.max(1, Math.min(5, Number(item.rating) || 5)),
          avatar: String(item.avatar || "")
        }))
    : defaults.testimonials;

  const mergedTestimonials = testimonials.length
    ? [
        ...testimonials,
        ...defaults.testimonials.filter(
          (defaultItem) =>
            !testimonials.some((item) => String(item.id) === String(defaultItem.id))
        )
      ].slice(0, 10)
    : defaults.testimonials;

  const brandRaw = isRecord(rawConfig.brand) ? rawConfig.brand : {};
  const trustBadges = Array.isArray(brandRaw.trustBadges)
    ? brandRaw.trustBadges.map((item) => String(item || "")).filter(Boolean)
    : defaults.brand.trustBadges;

  return {
    brand: {
      ...defaults.brand,
      ...brandRaw,
      trustBadges
    },
    whatsapp: {
      ...defaults.whatsapp,
      ...(isRecord(rawConfig.whatsapp) ? rawConfig.whatsapp : {})
    },
    categories,
    faq,
    testimonials: mergedTestimonials
  };
}

function sanitizeProducts(rawProducts, categories) {
  const defaults = defaultProductsClone();
  const categoryIds = new Set(categories.map((item) => item.id));
  const fallbackCategoryId = categories[0]?.id || defaults[0]?.categoryId || "cat-1";

  const sourceProducts = Array.isArray(rawProducts)
    ? rawProducts.filter((item) => isRecord(item))
    : defaults;

  return sourceProducts.map((item, index) => {
    const fallbackProduct = defaults[index] || defaults[0] || {};
    const candidateCategoryId = String(item.categoryId || "");
    const safeCategoryId = categoryIds.has(candidateCategoryId)
      ? candidateCategoryId
      : fallbackCategoryId;
    const colors = sanitizeProductColors(item.colors, fallbackProduct.colors || []);
    const sizes = sanitizeProductSizes(item.sizes, fallbackProduct.sizes || []);

    return {
      id: String(item.id || `p-${index + 1}`),
      categoryId: safeCategoryId,
      model: String(item.model || `Modelo ${index + 1}`),
      description: String(item.description || ""),
      image: String(item.image || ""),
      price: Number(item.price) || 0,
      currency: String(item.currency || "PEN"),
      colors,
      sizes
    };
  });
}

function sanitizeAnalytics(rawAnalytics) {
  const defaults = defaultAnalytics();

  if (!isRecord(rawAnalytics)) {
    return defaults;
  }

  const byZone = isRecord(rawAnalytics.byZone) ? rawAnalytics.byZone : {};
  const byDay = isRecord(rawAnalytics.byDay) ? rawAnalytics.byDay : {};

  return {
    total: Number(rawAnalytics.total) || 0,
    byZone: {
      hero_cta: Number(byZone.hero_cta) || 0,
      mobile_bar: Number(byZone.mobile_bar) || 0,
      product_card: Number(byZone.product_card) || 0,
      floating_button: Number(byZone.floating_button) || 0,
      unknown: Number(byZone.unknown) || 0
    },
    byDay: Object.keys(byDay).reduce((accumulator, key) => {
      const safeKey = String(key);
      const safeValue = Number(byDay[key]) || 0;
      accumulator[safeKey] = safeValue;
      return accumulator;
    }, {})
  };
}

function readLocalConfig() {
  try {
    const rawConfig = localStorage.getItem(STORAGE_KEYS.config);
    const rawProducts = localStorage.getItem(STORAGE_KEYS.products);
    const rawAnalytics = localStorage.getItem(STORAGE_KEYS.clickAnalytics);
    const rawSyncMeta = localStorage.getItem(STORAGE_KEYS.syncMeta);
    const rawClicks = localStorage.getItem(STORAGE_KEYS.clicks);
    const parsedConfig = rawConfig ? JSON.parse(rawConfig) : null;
    const parsedProducts = rawProducts ? JSON.parse(rawProducts) : null;
    const parsedAnalytics = rawAnalytics ? JSON.parse(rawAnalytics) : null;
    const parsedSyncMeta = rawSyncMeta ? JSON.parse(rawSyncMeta) : null;
    const config = sanitizeConfig(parsedConfig);
    const products = sanitizeProducts(parsedProducts, config.categories);
    const analytics = sanitizeAnalytics(parsedAnalytics);
    const legacyClicks = Number(rawClicks) || 0;
    analytics.total = Math.max(analytics.total, legacyClicks);

    const syncMeta = {
      pendingSync: Boolean(parsedSyncMeta?.pendingSync),
      lastSavedAt: parsedSyncMeta?.lastSavedAt || null
    };

    return { config, products, analytics, syncMeta };
  } catch {
    return {
      config: defaultConfigClone(),
      products: defaultProductsClone(),
      analytics: defaultAnalytics(),
      syncMeta: defaultSyncMeta()
    };
  }
}

function writeLocalConfig(config, products, analytics, syncMeta = defaultSyncMeta()) {
  localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  localStorage.setItem(STORAGE_KEYS.clickAnalytics, JSON.stringify(analytics));
  localStorage.setItem(STORAGE_KEYS.clicks, String(Number(analytics.total) || 0));
  localStorage.setItem(STORAGE_KEYS.syncMeta, JSON.stringify(syncMeta));
}

export async function loadLandingState() {
  const localState = readLocalConfig();

  if (localState.syncMeta.pendingSync) {
    return { ...localState, source: "local-pending-sync" };
  }

  try {
    const snapshot = await getDoc(LANDING_DOC_REF);

    if (!snapshot.exists()) {
      return { ...localState, source: "local" };
    }

    const remoteData = snapshot.data();
    const config = sanitizeConfig(remoteData?.config);
    const products = sanitizeProducts(remoteData?.products, config.categories);
    const analytics = sanitizeAnalytics(remoteData?.analytics);
    writeLocalConfig(config, products, analytics, defaultSyncMeta());

    return { config, products, analytics, syncMeta: defaultSyncMeta(), source: "firebase" };
  } catch {
    return { ...localState, source: "local" };
  }
}

export async function saveLandingState(nextConfig, nextProducts, nextAnalytics) {
  const config = sanitizeConfig(nextConfig);
  const products = sanitizeProducts(nextProducts, config.categories);
  const analytics = sanitizeAnalytics(nextAnalytics);
  const optimisticMeta = {
    pendingSync: true,
    lastSavedAt: new Date().toISOString()
  };
  writeLocalConfig(config, products, analytics, optimisticMeta);

  try {
    await setDoc(
      LANDING_DOC_REF,
      {
        config,
        products,
        analytics,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    writeLocalConfig(config, products, analytics, {
      pendingSync: false,
      lastSavedAt: new Date().toISOString()
    });

    return {
      config,
      products,
      analytics,
      syncMeta: {
        pendingSync: false,
        lastSavedAt: new Date().toISOString()
      },
      persistedInFirebase: true
    };
  } catch (error) {
    const reason =
      error?.code === "permission-denied"
        ? "permission-denied"
        : error?.code === "unavailable"
          ? "network-unavailable"
          : "firebase-write-failed";

    return {
      config,
      products,
      analytics,
      syncMeta: optimisticMeta,
      persistedInFirebase: false,
      error,
      reason
    };
  }
}

export function getDefaultLandingState() {
  const config = defaultConfigClone();
  const products = defaultProductsClone();
  const analytics = defaultAnalytics();
  return { config, products, analytics };
}

export function buildNextAnalytics(previousAnalytics, zone) {
  const safeZone = zone || "unknown";
  const previous = sanitizeAnalytics(previousAnalytics);
  const dayKey = new Date().toISOString().slice(0, 10);

  return {
    ...previous,
    total: previous.total + 1,
    byZone: {
      ...previous.byZone,
      [safeZone]: (Number(previous.byZone[safeZone]) || 0) + 1
    },
    byDay: {
      ...previous.byDay,
      [dayKey]: (Number(previous.byDay[dayKey]) || 0) + 1
    }
  };
}

export function clearAnalytics() {
  return defaultAnalytics();
}
