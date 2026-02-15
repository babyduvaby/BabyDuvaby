const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const LOCAL_CLOUD_NAME_KEY = "baby_duvaby_cloudinary_cloud_name_v1";
const LOCAL_UPLOAD_PRESET_KEY = "baby_duvaby_cloudinary_upload_preset_v1";

function readLocalCloudinaryConfig() {
  try {
    const cloudName = String(localStorage.getItem(LOCAL_CLOUD_NAME_KEY) || "").trim();
    const uploadPreset = String(localStorage.getItem(LOCAL_UPLOAD_PRESET_KEY) || "").trim();
    return { cloudName, uploadPreset };
  } catch {
    return { cloudName: "", uploadPreset: "" };
  }
}

function readEnvCloudinaryConfig() {
  // En Next.js (client), solo NEXT_PUBLIC_* se inyecta en el bundle.
  const cloudName = String(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "").trim();
  const uploadPreset = String(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "").trim();
  const dynamicFolder = String(process.env.NEXT_PUBLIC_CLOUDINARY_DYNAMIC_FOLDER || "").trim();
  return { cloudName, uploadPreset, dynamicFolder };
}

export function getCloudinaryConfig() {
  const env = readEnvCloudinaryConfig();
  const local = readLocalCloudinaryConfig();
  const cloudName = env.cloudName || local.cloudName;
  const uploadPreset = env.uploadPreset || local.uploadPreset;

  return {
    cloudName,
    uploadPreset,
    dynamicFolder: env.dynamicFolder || "",
    source: env.cloudName || env.uploadPreset ? "env" : local.cloudName || local.uploadPreset ? "local" : "none"
  };
}

export function saveCloudinaryConfigLocal({ cloudName, uploadPreset }) {
  const safeCloudName = String(cloudName || "").trim();
  const safeUploadPreset = String(uploadPreset || "").trim();
  localStorage.setItem(LOCAL_CLOUD_NAME_KEY, safeCloudName);
  localStorage.setItem(LOCAL_UPLOAD_PRESET_KEY, safeUploadPreset);
  return { cloudName: safeCloudName, uploadPreset: safeUploadPreset };
}

export function clearCloudinaryConfigLocal() {
  localStorage.removeItem(LOCAL_CLOUD_NAME_KEY);
  localStorage.removeItem(LOCAL_UPLOAD_PRESET_KEY);
}

function sanitizePublicId(fileName) {
  const baseName = String(fileName || "image")
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  return baseName || "image";
}

function buildCanonicalCloudinaryUrl(cloudName, uploadResult) {
  const version = uploadResult?.version ? `v${uploadResult.version}` : "";
  const publicId = uploadResult?.public_id || "";
  const format = uploadResult?.format ? `.${uploadResult.format}` : "";

  if (!publicId) {
    return "";
  }

  const versionSegment = version ? `${version}/` : "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${versionSegment}${publicId}${format}`;
}

export async function uploadLandingImage(file, folderName) {
  if (!file) {
    throw new Error("Selecciona una imagen.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("La imagen supera 5MB.");
  }

  const config = getCloudinaryConfig();

  if (!config.cloudName || !config.uploadPreset) {
    throw new Error(
      "Cloudinary no configurado. En Vercel agrega NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET y redeploy. Si ya las agregaste pero sigue fallando, abre /index.html para limpiar cache o configura Cloudinary desde el panel admin."
    );
  }

  const payload = new FormData();
  payload.append("file", file);
  payload.append("upload_preset", config.uploadPreset);

  // Muchos presets unsigned bloquean public_id y folder dinamico.
  // Solo enviar folder si se habilito explicitamente por variable de entorno.
  if (config.dynamicFolder === "1" && folderName) {
    payload.append("folder", folderName);
    payload.append("public_id", `${Date.now()}-${sanitizePublicId(file.name)}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    {
      method: "POST",
      body: payload,
      signal: controller.signal
    }
  ).finally(() => clearTimeout(timeoutId));

  const result = await response.json();

  if (!response.ok) {
    const cloudinaryMessage =
      result?.error?.message ||
      result?.message ||
      "No se pudo subir imagen a Cloudinary.";
    throw new Error(cloudinaryMessage);
  }

  if (!result?.secure_url) {
    throw new Error("Cloudinary no devolvio una URL valida.");
  }

  // Preferir URL oficial devuelta por Cloudinary.
  const secureUrl = String(result.secure_url || "");
  if (secureUrl) {
    return secureUrl;
  }

  const canonicalUrl = buildCanonicalCloudinaryUrl(config.cloudName, result);
  if (canonicalUrl) {
    return canonicalUrl;
  }

  throw new Error("Cloudinary no devolvio una URL utilizable.");
}
