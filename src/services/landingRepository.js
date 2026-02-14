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

function readLocalConfig() {
  try {
    const rawConfig = localStorage.getItem(STORAGE_KEYS.config);
    const rawProducts = localStorage.getItem(STORAGE_KEYS.products);
    const parsedConfig = rawConfig ? JSON.parse(rawConfig) : null;
    const parsedProducts = rawProducts ? JSON.parse(rawProducts) : null;
    const config = sanitizeConfig(parsedConfig);
    const products = sanitizeProducts(parsedProducts, config.categories);

    return { config, products };
  } catch {
    return { config: defaultConfigClone(), products: defaultProductsClone() };
  }
}

function writeLocalConfig(config, products) {
  localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
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
    writeLocalConfig(config, products);

    return { config, products, source: "firebase" };
  } catch {
    return { ...localState, source: "local" };
  }
}

export async function saveLandingState(nextConfig, nextProducts) {
  const config = sanitizeConfig(nextConfig);
  const products = sanitizeProducts(nextProducts, config.categories);
  writeLocalConfig(config, products);

  try {
    await setDoc(
      LANDING_DOC_REF,
      {
        config,
        products,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    return { config, products, persistedInFirebase: true };
  } catch (error) {
    return { config, products, persistedInFirebase: false, error };
  }
}

export function getDefaultLandingState() {
  const config = defaultConfigClone();
  const products = defaultProductsClone();
  return { config, products };
}

