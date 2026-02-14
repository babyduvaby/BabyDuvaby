// Configuración por defecto editable desde el panel administrador.
export const defaultLandingConfig = {
  brand: {
    name: "Baby Duvaby 🍼💕",
    subtitle: "Ropita y accesorios tiernos para tu bebé 💗",
    heroImage:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80",
    whatsappButtonText: "Escríbenos por WhatsApp 💬",
    shippingMessage: "✨ Envíos a todo el Perú 🇵🇪"
  },
  whatsapp: {
    phone: "51960476670",
    message: "Hola Baby Duvaby, quiero información sobre sus productos."
  },
  categories: [
    {
      id: "cat-1",
      title: "Pañaleras y Mochilas 🎒",
      image:
        "https://images.unsplash.com/photo-1544126592-e7d1e3a3f3f1?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "cat-2",
      title: "Mantas, Frazadas, Muselinas, Colchas 🧸",
      image:
        "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "cat-3",
      title: "Baberos y Mandiles 🍽️",
      image:
        "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "cat-4",
      title: "Gorros y Turbantes 🎀",
      image:
        "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "cat-5",
      title: "Accesorios ✨",
      image:
        "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=900&q=80"
    }
  ],
  faq: [
    {
      id: "faq-1",
      question: "¿Los productos tienen garantía?",
      answer: "Sí 💗"
    },
    {
      id: "faq-2",
      question: "¿Contra-entrega?",
      answer: "Solo en tienda 🏬"
    },
    {
      id: "faq-3",
      question: "¿Envíos?",
      answer: "A provincia y todo el Perú 🇵🇪"
    }
  ]
};

export const ADMIN_PASSWORD = "duvaby2026";
export const FIXED_WHATSAPP_PHONE = "51960476670";
export const STORAGE_KEYS = {
  config: "baby_duvaby_config_v1",
  clicks: "baby_duvaby_whatsapp_clicks_v1"
};
