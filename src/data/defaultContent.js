// Contenido principal de la landing y catálogo por categoría/modelo.
export const defaultLandingConfig = {
  brand: {
    name: "Baby Duvaby",
    subtitle: "Ropita y accesorios tiernos para tu bebé 💗",
    heroImage:
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1400&q=80",
    whatsappButtonText: "Escríbenos por WhatsApp 💬",
    shippingMessage: "✨ Envíos a todo el Perú 🇵🇪"
  },
  whatsapp: {
    phone: "51960476670",
    message: "Hola Baby Duvaby, me gustaría información de sus productos."
  },
  categories: [
    {
      id: "cat-1",
      title: "Pañaleras y Mochilas 🎒",
      image:
        "https://source.unsplash.com/900x700/?baby,diaper,bag,pastel,pink"
    },
    {
      id: "cat-2",
      title: "Mantas, Frazadas, Muselinas, Colchas 🧸",
      image:
        "https://source.unsplash.com/900x700/?baby,blanket,soft,pastel"
    },
    {
      id: "cat-3",
      title: "Baberos y Mandiles 🍽️",
      image: "https://source.unsplash.com/900x700/?baby,bib,clothes"
    },
    {
      id: "cat-4",
      title: "Gorros y Turbantes 🎀",
      image: "https://source.unsplash.com/900x700/?baby,hat,turban,pink"
    },
    {
      id: "cat-5",
      title: "Accesorios ✨",
      image: "https://source.unsplash.com/900x700/?baby,accessories,adorable"
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

export const productCatalog = [
  {
    id: "p-1",
    categoryId: "cat-1",
    model: "Pañalera Nube Rosa",
    description: "Amplia, ligera y con bolsillos térmicos para salidas diarias.",
    image: "https://source.unsplash.com/1200x900/?diaper,bag,pink,baby"
  },
  {
    id: "p-2",
    categoryId: "cat-1",
    model: "Mochila Dulce Paseo",
    description: "Diseño moderno con compartimentos para biberón y pañales.",
    image: "https://source.unsplash.com/1200x900/?baby,backpack,maternity"
  },
  {
    id: "p-3",
    categoryId: "cat-2",
    model: "Muselina Dream Soft",
    description: "Tela respirable y suave para envolver al bebé con comodidad.",
    image: "https://source.unsplash.com/1200x900/?muslin,blanket,baby"
  },
  {
    id: "p-4",
    categoryId: "cat-2",
    model: "Frazada Teddy Cloud",
    description: "Frazada acolchada con textura tierna y acabados premium.",
    image: "https://source.unsplash.com/1200x900/?baby,blanket,teddy"
  },
  {
    id: "p-5",
    categoryId: "cat-3",
    model: "Babero Mini Smile",
    description: "Babero absorbente con ajuste cómodo y estampado delicado.",
    image: "https://source.unsplash.com/1200x900/?baby,bib,cute"
  },
  {
    id: "p-6",
    categoryId: "cat-3",
    model: "Mandil Clean Time",
    description: "Protección práctica para comidas con material fácil de limpiar.",
    image: "https://source.unsplash.com/1200x900/?baby,feeding,cloth"
  },
  {
    id: "p-7",
    categoryId: "cat-4",
    model: "Gorrito Osito Plush",
    description: "Gorro térmico con orejitas para look adorable y abrigado.",
    image: "https://source.unsplash.com/1200x900/?baby,hat,winter,cute"
  },
  {
    id: "p-8",
    categoryId: "cat-4",
    model: "Turbante Bloom Pastel",
    description: "Turbante delicado en tonos pastel para outfits especiales.",
    image: "https://source.unsplash.com/1200x900/?baby,turban,pastel"
  },
  {
    id: "p-9",
    categoryId: "cat-5",
    model: "Set Accesorios Sweet Day",
    description: "Pack de peineta, medias y guantes para recién nacidos.",
    image: "https://source.unsplash.com/1200x900/?baby,accessories,set"
  },
  {
    id: "p-10",
    categoryId: "cat-5",
    model: "Kit Bienvenida Bebé",
    description: "Accesorios esenciales de primera etapa en tonos suaves.",
    image: "https://source.unsplash.com/1200x900/?newborn,essentials,baby"
  }
];

export const FIXED_WHATSAPP_PHONE = "51960476670";
export const ADMIN_PANEL_URL = "https://baby-duvaby.vercel.app/admin/login";
export const STORAGE_KEYS = {
  config: "baby_duvaby_config_v1",
  clicks: "baby_duvaby_whatsapp_clicks_v1"
};

