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

  if (/rosa|rosado|pink|fucsia|magenta/.test(text)) return "💗";
  if (/celeste|azul|blue/.test(text)) return "💙";
  if (/verde|green/.test(text)) return "💚";
  if (/amarillo|yellow|dorado|gold/.test(text)) return "💛";
  if (/rojo|red/.test(text)) return "❤️";
  if (/morado|lila|violeta|purple/.test(text)) return "💜";
  if (/naranja|orange/.test(text)) return "🧡";
  if (/blanco|white/.test(text)) return "🤍";
  if (/negro|black/.test(text)) return "🖤";
  if (/gris|gray|grey/.test(text)) return "🩶";
  if (/marron|cafe|brown|beige/.test(text)) return "🤎";

  return "";
}

function getColorEmojiByRgb(rgbHex = "") {
  const rgb = parseHexToRgb(rgbHex);
  if (!rgb) {
    return "🎨";
  }

  const { r, g, b } = rgb;

  if (r > 230 && g > 230 && b > 230) return "🤍";
  if (r < 55 && g < 55 && b < 55) return "🖤";

  if (r >= g && r >= b) {
    if (g > 170 && b < 130) return "🧡";
    if (g > 130 && b > 130) return "💗";
    return "❤️";
  }

  if (g >= r && g >= b) return "💚";
  if (b >= r && b >= g) return "💙";

  return "🎨";
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
    return "🎨 No especificado";
  }

  const emoji = getColorEmoji(color);
  const safeName = String(color.name || "").trim();
  return safeName ? `${emoji} ${safeName}` : `${emoji} Color seleccionado`;
}

export function buildProductWhatsappMessage(product, category, selection) {
  const colorLabel = getColorLabelForWhatsApp(selection?.color);
  const sizeLabel = selection?.size ? `📏 ${selection.size}` : "📏 No especificada";
  const categoryLabel = category?.title || "Catalogo";

  return [
    "Hola Baby Duvaby 👋💗",
    "Quisiera informacion de este modelito, por favor:",
    `🧸 Modelo: ${product.model}`,
    `📂 Categoria: ${categoryLabel}`,
    `🎨 Color elegido: ${colorLabel}`,
    `📐 Talla elegida: ${sizeLabel}`,
    `💸 Precio referencial: ${formatPrice(product.price, product.currency)}`,
    "¿Me ayudas con disponibilidad? 🙏"
  ].join(" ");
}

export function formatProductPrice(value, currency) {
  return formatPrice(value, currency);
}

