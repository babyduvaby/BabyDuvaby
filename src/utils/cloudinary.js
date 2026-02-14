const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";

function buildTransformString(options = {}) {
  const parts = ["f_auto", "q_auto"];

  if (options.width) {
    parts.push(`w_${options.width}`);
  }

  if (options.height) {
    parts.push(`h_${options.height}`);
  }

  if (options.crop) {
    parts.push(`c_${options.crop}`);
  }

  if (options.gravity) {
    parts.push(`g_${options.gravity}`);
  }

  return parts.join(",");
}

// Aplica optimizacion solo si la URL pertenece a Cloudinary.
export function getOptimizedCloudinaryUrl(url, options = {}) {
  const sourceUrl = String(url || "");
  const segmentIndex = sourceUrl.indexOf(CLOUDINARY_UPLOAD_SEGMENT);

  if (segmentIndex < 0) {
    return sourceUrl;
  }

  const prefix = sourceUrl.slice(0, segmentIndex + CLOUDINARY_UPLOAD_SEGMENT.length);
  const remainder = sourceUrl.slice(segmentIndex + CLOUDINARY_UPLOAD_SEGMENT.length);
  const transform = buildTransformString(options);

  if (!remainder) {
    return `${prefix}${transform}`;
  }

  // Si ya hay transformaciones, no duplicar.
  const firstPart = remainder.split("/")[0];
  const seemsTransform =
    firstPart.includes(",") ||
    firstPart.startsWith("c_") ||
    firstPart.startsWith("w_") ||
    firstPart.startsWith("h_") ||
    firstPart.startsWith("q_") ||
    firstPart.startsWith("f_");

  if (seemsTransform) {
    return sourceUrl;
  }

  return `${prefix}${transform}/${remainder}`;
}

