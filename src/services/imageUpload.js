import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebaseStorage } from "../firebase";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function sanitizeFileName(fileName) {
  return fileName.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
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

  const safeFolder = folderName || "landing";
  const objectPath = `${safeFolder}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const fileRef = ref(firebaseStorage, objectPath);

  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

