function formatPrice(value, currency) {
  const amount = Number(value) || 0;
  const safeCurrency = currency || "PEN";

  try {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: safeCurrency,
      minimumFractionDigits: 2
    }).format(amount);
  } catch {
    return `${safeCurrency} ${amount.toFixed(2)}`;
  }
}

function normalizeInlineText(value, fallback = "") {
  const safe = String(value || "")
    .replace(/\s+/g, " ")
    .trim();
  return safe || fallback;
}

function normalizeQuantity(rawQuantity) {
  const numericQuantity = Number(rawQuantity);
  if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
    return 1;
  }

  return Math.max(1, Math.floor(numericQuantity));
}

function parseHexToRgb(hex) {
  const normalized = String(hex || "").trim().replace(/^#/, "");

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16)
  };
}

function getColorEmojiByName(colorName = "") {
  const text = String(colorName).toLowerCase();

  if (/rosa|rosado|pink|fucsia|magenta/.test(text)) return "\u{1F497}";
  if (/celeste|azul|blue/.test(text)) return "\u{1F499}";
  if (/verde|green/.test(text)) return "\u{1F49A}";
  if (/amarillo|yellow|dorado|gold/.test(text)) return "\u{1F49B}";
  if (/rojo|red/.test(text)) return "\u{2764}\u{FE0F}";
  if (/morado|lila|violeta|purple/.test(text)) return "\u{1F49C}";
  if (/naranja|orange/.test(text)) return "\u{1F9E1}";
  if (/crema|marfil|ivory/.test(text)) return "\u{1F90D}";
  if (/blanco|white/.test(text)) return "\u{1F90D}";
  if (/negro|black/.test(text)) return "\u{1F5A4}";
  if (/gris|gray|grey/.test(text)) return "\u{1FA76}";
  if (/marron|cafe|brown|beige/.test(text)) return "\u{1F90E}";

  return "";
}

function getColorEmojiByRgb(rgbHex = "") {
  const rgb = parseHexToRgb(rgbHex);
  if (!rgb) {
    return "\u{1F496}";
  }

  const { r, g, b } = rgb;

  if (r > 235 && g > 225 && b > 200) return "\u{1F90D}";
  if (r > 230 && g > 230 && b > 230) return "\u{1F90D}";
  if (r < 55 && g < 55 && b < 55) return "\u{1F5A4}";
  if (Math.abs(r - g) < 14 && Math.abs(g - b) < 14) return "\u{1FA76}";

  if (r >= g && r >= b) {
    if (g > 180 && b < 130) return "\u{1F49B}";
    if (g > 170 && b < 130) return "\u{1F9E1}";
    if (g > 130 && b > 130) return "\u{1F497}";
    return "\u{2764}\u{FE0F}";
  }

  if (g >= r && g >= b) return "\u{1F49A}";
  if (b >= r && b >= g) return "\u{1F499}";

  return "\u{1F496}";
}

export function getColorEmoji(color) {
  const nameEmoji = getColorEmojiByName(color?.name || "");
  if (nameEmoji) {
    return nameEmoji;
  }

  return getColorEmojiByRgb(color?.rgb || "");
}

export function getColorLabelForWhatsApp(color) {
  if (!color) {
    return "\u{1F3A8} No especificado";
  }

  const emoji = getColorEmoji(color);
  const safeName = String(color.name || "").trim();
  return safeName ? `${emoji} ${safeName}` : `${emoji} Color seleccionado`;
}

export function buildProductWhatsappMessage(product, category, selection) {
  const productModel = normalizeInlineText(product?.model, "Modelo no especificado");
  const categoryLabel = normalizeInlineText(category?.title, "Catalogo");
  const colorLabel = getColorLabelForWhatsApp(selection?.color);
  const sizeRaw = normalizeInlineText(selection?.size, "No especificada");
  const sizeLabel = sizeRaw;
  const quantity = normalizeQuantity(selection?.totalQuantity ?? selection?.quantity);
  const unitPrice = Number(product?.price) || 0;
  const totalEstimated = unitPrice * quantity;
  const quantityLabel = quantity === 1 ? "unidad" : "unidades";
  const currency = product?.currency || "PEN";

  return [
    "Hola Baby Duvaby \u{1F44B}\u{1F497}",
    "",
    "Quisiera pedir este modelito:",
    `\u{1F9F8} Modelo: ${productModel}`,
    `\u{1F4C2} Categoria: ${categoryLabel}`,
    `Color: ${colorLabel}`,
    `\u{1F4CF} Talla: ${sizeLabel}`,
    `\u{1F522} Cantidad: ${quantity} ${quantityLabel}`,
    `\u{1F4B8} Precio unitario: ${formatPrice(unitPrice, currency)}`,
    `\u{1F4B3} Total estimado: ${formatPrice(totalEstimated, currency)}`,
    "",
    "Quedo atenta para confirmar mi pedido. \u{2728}\u{1F64F}"
  ].join("\n");
}

export function formatProductPrice(value, currency) {
  return formatPrice(value, currency);
}
