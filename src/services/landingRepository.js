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
const defaultAnalytics = () => ({
  total: 0,
  byZone: {
    hero_cta: 0,
    mobile_bar: 0,
    product_card: 0,
    unknown: 0
  },
  byDay: {}
});

const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

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
          image: String(item.image || "")
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

  return {
    brand: {
      ...defaults.brand,
      ...(isRecord(rawConfig.brand) ? rawConfig.brand : {})
    },
    whatsapp: {
      ...defaults.whatsapp,
      ...(isRecord(rawConfig.whatsapp) ? rawConfig.whatsapp : {})
    },
    categories,
    faq
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
    const candidateCategoryId = String(item.categoryId || "");
    const safeCategoryId = categoryIds.has(candidateCategoryId)
      ? candidateCategoryId
      : fallbackCategoryId;

    return {
      id: String(item.id || `p-${index + 1}`),
      categoryId: safeCategoryId,
      model: String(item.model || `Modelo ${index + 1}`),
      description: String(item.description || ""),
      image: String(item.image || "")
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
    const rawClicks = localStorage.getItem(STORAGE_KEYS.clicks);
    const parsedConfig = rawConfig ? JSON.parse(rawConfig) : null;
    const parsedProducts = rawProducts ? JSON.parse(rawProducts) : null;
    const parsedAnalytics = rawAnalytics ? JSON.parse(rawAnalytics) : null;
    const config = sanitizeConfig(parsedConfig);
    const products = sanitizeProducts(parsedProducts, config.categories);
    const analytics = sanitizeAnalytics(parsedAnalytics);
    const legacyClicks = Number(rawClicks) || 0;
    analytics.total = Math.max(analytics.total, legacyClicks);

    return { config, products, analytics };
  } catch {
    return {
      config: defaultConfigClone(),
      products: defaultProductsClone(),
      analytics: defaultAnalytics()
    };
  }
}

function writeLocalConfig(config, products, analytics) {
  localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  localStorage.setItem(STORAGE_KEYS.clickAnalytics, JSON.stringify(analytics));
  localStorage.setItem(STORAGE_KEYS.clicks, String(Number(analytics.total) || 0));
}

export async function loadLandingState() {
  const localState = readLocalConfig();

  try {
    const snapshot = await getDoc(LANDING_DOC_REF);

    if (!snapshot.exists()) {
      return { ...localState, source: "local" };
    }

    const remoteData = snapshot.data();
    const config = sanitizeConfig(remoteData?.config);
    const products = sanitizeProducts(remoteData?.products, config.categories);
    const analytics = sanitizeAnalytics(remoteData?.analytics);
    writeLocalConfig(config, products, analytics);

    return { config, products, analytics, source: "firebase" };
  } catch {
    return { ...localState, source: "local" };
  }
}

export async function saveLandingState(nextConfig, nextProducts, nextAnalytics) {
  const config = sanitizeConfig(nextConfig);
  const products = sanitizeProducts(nextProducts, config.categories);
  const analytics = sanitizeAnalytics(nextAnalytics);
  writeLocalConfig(config, products, analytics);

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

    return { config, products, analytics, persistedInFirebase: true };
  } catch (error) {
    return { config, products, analytics, persistedInFirebase: false, error };
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
