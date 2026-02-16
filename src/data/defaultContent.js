// Contenido principal de la landing y catalogo por categoria/modelo.
export const defaultLandingConfig = {
  brand: {
    name: "Baby Duvaby",
    subtitle: "Ropita y accesorios tiernos para tu bebe",
    heroImage:
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1400&q=80",
    whatsappButtonText: "Escribenos por WhatsApp",
    shippingMessage: "Envios rapidos a todo el Peru",
    trustBadges: ["Entrega rapida", "Calidad garantizada", "Atencion por WhatsApp"]
  },
  whatsapp: {
    phone: "51960476670",
    message: "Hola Baby Duvaby, me gustaria informacion de sus productos."
  },
  categories: [
    {
      id: "cat-1",
      title: "Panaleras y Mochilas",
      image: "https://source.unsplash.com/900x700/?baby,diaper,bag,pastel,pink",
      secondaryImage: "https://source.unsplash.com/900x500/?baby,diaper,bag,accessories,pink",
      imageFocusX: 50,
      imageFocusY: 50,
      secondaryImageFocusX: 50,
      secondaryImageFocusY: 50
    },
    {
      id: "cat-2",
      title: "Mantas, Frazadas, Muselinas, Colchas",
      image: "https://source.unsplash.com/900x700/?baby,blanket,soft,pastel",
      secondaryImage: "https://source.unsplash.com/900x500/?baby,blanket,folded,pastel",
      imageFocusX: 50,
      imageFocusY: 50,
      secondaryImageFocusX: 50,
      secondaryImageFocusY: 50
    },
    {
      id: "cat-3",
      title: "Baberos y Mandiles",
      image: "https://source.unsplash.com/900x700/?baby,bib,clothes",
      secondaryImage: "https://source.unsplash.com/900x500/?baby,bib,set,pink",
      imageFocusX: 50,
      imageFocusY: 50,
      secondaryImageFocusX: 50,
      secondaryImageFocusY: 50
    },
    {
      id: "cat-4",
      title: "Gorros y Turbantes",
      image: "https://source.unsplash.com/900x700/?baby,hat,turban,pink",
      secondaryImage: "https://source.unsplash.com/900x500/?baby,turban,accessories,pastel",
      imageFocusX: 50,
      imageFocusY: 50,
      secondaryImageFocusX: 50,
      secondaryImageFocusY: 50
    },
    {
      id: "cat-5",
      title: "Accesorios",
      image: "https://source.unsplash.com/900x700/?baby,accessories,adorable",
      secondaryImage: "https://source.unsplash.com/900x500/?baby,accessories,pink,soft",
      imageFocusX: 50,
      imageFocusY: 50,
      secondaryImageFocusX: 50,
      secondaryImageFocusY: 50
    }
  ],
  faq: [
    {
      id: "faq-1",
      question: "Los productos tienen garantia?",
      answer: "Si, todos los productos se revisan antes del envio."
    },
    {
      id: "faq-2",
      question: "Trabajan contra-entrega?",
      answer: "Solo para recojo en punto acordado en Lima."
    },
    {
      id: "faq-3",
      question: "Hacen envios?",
      answer: "Si, enviamos a Lima y provincias."
    }
  ],
  testimonials: [
    {
      id: "t-1",
      name: "Daniela R.",
      quote:
        "Compre por WhatsApp en minutos y me ayudaron a elegir talla. Todo llego rapido y hermoso.",
      location: "Lima",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: "t-2",
      name: "Paola M.",
      quote:
        "Pedi por unidad para regalo y la presentacion fue preciosa. Excelente atencion por WhatsApp.",
      location: "Arequipa",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/63.jpg"
    },
    {
      id: "t-3",
      name: "Rosa L.",
      quote:
        "Hice compra por mayor para mi tienda y los descuentos salieron super bien. Mis clientas felices.",
      location: "Trujillo",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/26.jpg"
    },
    {
      id: "t-4",
      name: "Milagros C.",
      quote:
        "Las promociones por temporada son buenisimas. Recibi mi pedido en provincia sin problemas.",
      location: "Piura",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      id: "t-5",
      name: "Katherine V.",
      quote:
        "Compre baberos y mantas por unidad, todo suavecito y de muy buena calidad. Recomendado.",
      location: "Cusco",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/39.jpg"
    },
    {
      id: "t-6",
      name: "Vanessa T.",
      quote:
        "Hice pedido por WhatsApp para baby shower y me asesoraron super rapido. Quede feliz.",
      location: "Chiclayo",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    {
      id: "t-7",
      name: "Angie P.",
      quote:
        "La compra por mayor me ayudo mucho con precios. Todo llego ordenado y en excelente estado.",
      location: "Huancayo",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/women/50.jpg"
    },
    {
      id: "t-8",
      name: "Sheyla G.",
      quote:
        "Me encanto la rapidez y el trato por WhatsApp. Aproveche descuento y compre accesorios hermosos.",
      location: "Iquitos",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    {
      id: "t-9",
      name: "Brenda A.",
      quote:
        "Compre gorritos por unidad y luego hice otro pedido mayorista. Calidad top y envio puntual.",
      location: "Tacna",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/56.jpg"
    },
    {
      id: "t-10",
      name: "Yuliana F.",
      quote:
        "Excelente experiencia, siempre responden rapido por WhatsApp y tienen promociones lindas para bebes.",
      location: "Puno",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/women/71.jpg"
    }
  ]
};

const DEFAULT_PRODUCT_COLORS = [
  { name: "Rosado pastel", rgb: "#f6bfd8" },
  { name: "Celeste pastel", rgb: "#bfe4ff" },
  { name: "Crema", rgb: "#f9f1df" }
];

const DEFAULT_PRODUCT_SIZES = ["RN", "3M", "6M"];

const baseProductCatalog = [
  {
    id: "p-1",
    categoryId: "cat-1",
    model: "Panalera Nube Rosa",
    description: "Amplia, ligera y con bolsillos termicos para salidas diarias.",
    image: "https://source.unsplash.com/1200x900/?diaper,bag,pink,baby",
    price: 129.9,
    currency: "PEN"
  },
  {
    id: "p-2",
    categoryId: "cat-1",
    model: "Mochila Dulce Paseo",
    description: "Diseno moderno con compartimentos para biberon y panales.",
    image: "https://source.unsplash.com/1200x900/?baby,backpack,maternity",
    price: 119.9,
    currency: "PEN"
  },
  {
    id: "p-3",
    categoryId: "cat-2",
    model: "Muselina Dream Soft",
    description: "Tela respirable y suave para envolver al bebe con comodidad.",
    image: "https://source.unsplash.com/1200x900/?muslin,blanket,baby",
    price: 59.9,
    currency: "PEN"
  },
  {
    id: "p-4",
    categoryId: "cat-2",
    model: "Frazada Teddy Cloud",
    description: "Frazada acolchada con textura tierna y acabados premium.",
    image: "https://source.unsplash.com/1200x900/?baby,blanket,teddy",
    price: 79.9,
    currency: "PEN"
  },
  {
    id: "p-5",
    categoryId: "cat-3",
    model: "Babero Mini Smile",
    description: "Babero absorbente con ajuste comodo y estampado delicado.",
    image: "https://source.unsplash.com/1200x900/?baby,bib,cute",
    price: 24.9,
    currency: "PEN"
  },
  {
    id: "p-6",
    categoryId: "cat-3",
    model: "Mandil Clean Time",
    description: "Proteccion practica para comidas con material facil de limpiar.",
    image: "https://source.unsplash.com/1200x900/?baby,feeding,cloth",
    price: 29.9,
    currency: "PEN"
  },
  {
    id: "p-7",
    categoryId: "cat-4",
    model: "Gorrito Osito Plush",
    description: "Gorro termico con orejitas para look adorable y abrigado.",
    image: "https://source.unsplash.com/1200x900/?baby,hat,winter,cute",
    price: 34.9,
    currency: "PEN"
  },
  {
    id: "p-8",
    categoryId: "cat-4",
    model: "Turbante Bloom Pastel",
    description: "Turbante delicado en tonos pastel para outfits especiales.",
    image: "https://source.unsplash.com/1200x900/?baby,turban,pastel",
    price: 32.9,
    currency: "PEN"
  },
  {
    id: "p-9",
    categoryId: "cat-5",
    model: "Set Accesorios Sweet Day",
    description: "Pack de peineta, medias y guantes para recien nacidos.",
    image: "https://source.unsplash.com/1200x900/?baby,accessories,set",
    price: 49.9,
    currency: "PEN"
  },
  {
    id: "p-10",
    categoryId: "cat-5",
    model: "Kit Bienvenida Bebe",
    description: "Accesorios esenciales de primera etapa en tonos suaves.",
    image: "https://source.unsplash.com/1200x900/?newborn,essentials,baby",
    price: 89.9,
    currency: "PEN"
  }
];

export const productCatalog = baseProductCatalog.map((product, productIndex) => ({
  ...product,
  colors: DEFAULT_PRODUCT_COLORS.map((color, colorIndex) => ({
    id: `p${productIndex + 1}-color-${colorIndex + 1}`,
    name: color.name,
    rgb: color.rgb
  })),
  sizes: [...DEFAULT_PRODUCT_SIZES]
}));

export const FIXED_WHATSAPP_PHONE = "51960476670";
export const STORAGE_KEYS = {
  config: "baby_duvaby_config_v1",
  products: "baby_duvaby_products_v1",
  clicks: "baby_duvaby_whatsapp_clicks_v1",
  clickAnalytics: "baby_duvaby_whatsapp_click_analytics_v1",
  syncMeta: "baby_duvaby_sync_meta_v1",
  adminFallbackSession: "baby_duvaby_admin_fallback_session_v1"
};
