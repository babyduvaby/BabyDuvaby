# PROJECT_CONTEXT

## Resumen
Landing page mobile-first para Baby Duvaby en Next.js (App Router) + Tailwind CSS con enfoque en conversion a WhatsApp.

## Objetivo funcional
- Mostrar hero principal, categorias y preguntas frecuentes.
- Facilitar contacto por WhatsApp con un CTA principal.
- Mantener CTA flotante de WhatsApp visible en mobile y desktop.
- Abrir ruta de catalogo por categoria y modelos al hacer clic en cada card.
- Registrar contador de clics del CTA de WhatsApp.
- Persistir contador de clics en `localStorage`.
- Medir clics de WhatsApp por zona de conversion (hero, barra movil, tarjeta de producto).
- Mostrar precios por producto y mensaje de WhatsApp contextual por modelo.
- Incluir testimonios y badges de confianza para reforzar conversion.
- Aplicar SEO base (meta description + Open Graph) desde `app/layout.js`.

## Arquitectura Frontend
- Runtime: Next.js 14 con React 18.
- Enrutamiento: App Router (`app/`).
- Estilos: Tailwind CSS + utilidades personalizadas en `src/index.css`.
- Estado:
  - Hook central `useLandingConfig` para contenido editable y contador.
  - Catalogo por categoria/modelo definido en `src/data/defaultContent.js`.
  - Boton flotante global de WhatsApp con mensaje prellenado dinamico.

## Integraciones
- Firebase Web SDK inicializado en `src/firebase.js`.
- Firestore para contenido editable: documento `landing/main`.
- Firebase Auth para acceso admin real con email/password.
- Cloudinary para subida de imagenes desde el panel admin (carpetas `landing/hero`, `landing/categories`, `landing/products`).
- Transformaciones de entrega de Cloudinary en frontend (`f_auto,q_auto`) para optimizar peso y formato automaticamente.
- URLs de producto/hero/categoria optimizadas en runtime via util `src/utils/cloudinary.js`.

## Admin y gestion de contenido
- Ruta de login admin: `/admin/login` (formulario solo contrasena).
- Ruta protegida: `/admin`.
- Acceso admin oculto de la landing publica (sin botones en TopBar/Footer).
- Edicion completa desde panel: marca, WhatsApp, categorias, FAQ, modelos e imagenes.
- Carga de imagenes por drag and drop en hero, categorias y productos.
- Ajuste de encuadre por categoria (imagen superior/inferior con control horizontal y vertical) para corregir composicion en mobile.
- Ordenamiento por drag and drop y botones Subir/Bajar para categorias, FAQ y modelos.
- Grafico de clics WhatsApp por zona y resumen de ultimos 7 dias.
- Herramientas admin: exportar backup JSON e importar backup JSON.

## Persistencia y fallback
- Lectura/escritura principal en Firestore.
- Fallback local en `localStorage` para `config`, `products` y analitica si Firestore no responde.
- Login estable sin bucles de redireccion ni recargas continuas.

## Variables de entorno recomendadas
- `NEXT_PUBLIC_ADMIN_EMAIL`: email admin de Firebase Auth.
- `NEXT_PUBLIC_ADMIN_EMAILS`: lista separada por coma de emails admin para login por solo contrasena.
- `NEXT_PUBLIC_ADMIN_PASSWORD_FALLBACK`: contrasena local opcional de emergencia cuando Firebase Auth no este disponible.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: cloud name de Cloudinary.
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: upload preset unsigned para subir imagenes desde frontend.
- `NEXT_PUBLIC_CLOUDINARY_DYNAMIC_FOLDER`: `1` para permitir folder/public_id dinamico en uploads unsigned (por defecto `0`).

Compatibilidad temporal:
- Se aceptan tambien variables `REACT_APP_*` para no romper configuraciones previas.
