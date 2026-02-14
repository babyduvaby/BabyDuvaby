const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "";

function sanitizePublicId(fileName) {
  const baseName = String(fileName || "image")
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  return baseName || "image";
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
      "Faltan variables de Cloudinary. Configura REACT_APP_CLOUDINARY_CLOUD_NAME y REACT_APP_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const payload = new FormData();
  payload.append("file", file);
  payload.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  payload.append("folder", folderName || "landing");
  payload.append("public_id", `${Date.now()}-${sanitizePublicId(file.name)}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: payload
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo subir imagen a Cloudinary.");
  }

  const result = await response.json();
  if (!result?.secure_url) {
    throw new Error("Cloudinary no devolvio una URL valida.");
  }

  return result.secure_url;
}

