const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.REACT_APP_CLOUDINARY_CLOUD_NAME ||
  "";
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
  process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET ||
  "";
const CLOUDINARY_DYNAMIC_FOLDER =
  process.env.NEXT_PUBLIC_CLOUDINARY_DYNAMIC_FOLDER ||
  process.env.REACT_APP_CLOUDINARY_DYNAMIC_FOLDER ||
  "";

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

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Faltan variables de Cloudinary. Configura NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const payload = new FormData();
  payload.append("file", file);
  payload.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  // Muchos presets unsigned bloquean public_id y folder dinamico.
  // Solo enviar folder si se habilito explicitamente por variable de entorno.
  if (CLOUDINARY_DYNAMIC_FOLDER === "1" && folderName) {
    payload.append("folder", folderName);
    payload.append("public_id", `${Date.now()}-${sanitizePublicId(file.name)}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
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

  const canonicalUrl = buildCanonicalCloudinaryUrl(CLOUDINARY_CLOUD_NAME, result);
  if (canonicalUrl) {
    return canonicalUrl;
  }

  throw new Error("Cloudinary no devolvio una URL utilizable.");
}
