# PROJECT_CONTEXT

## Resumen
Landing page mobile-first para Baby Duvaby en React + Tailwind CSS con enfoque en conversion a WhatsApp.

## Objetivo funcional
- Mostrar hero principal, categorias y preguntas frecuentes.
- Facilitar contacto por WhatsApp con un CTA principal.
- Mantener CTA de WhatsApp fijo en la parte inferior en movil.
- Abrir ruta de catalogo por categoria y modelos al hacer clic en cada card.
- Registrar contador de clics del CTA de WhatsApp.
- Persistir contador de clics en `localStorage`.
- Medir clics de WhatsApp por zona de conversion (hero, barra movil, tarjeta de producto).

## Arquitectura Frontend
- Runtime: React 18 con `react-scripts`.
- Enrutamiento: `react-router-dom`.
- Estilos: Tailwind CSS + utilidades personalizadas en `src/index.css`.
- Estado:
  - Hook central `useLandingConfig` para contenido editable y contador.
  - Catalogo por categoria/modelo definido en `src/data/defaultContent.js`.

## Integraciones
- Firebase Web SDK inicializado en `src/firebase.js`.
- Firestore para contenido editable: documento `landing/main`.
- Firebase Auth para acceso admin real con email/password.
- Cloudinary para subida de imagenes desde el panel admin (carpetas `landing/hero`, `landing/categories`, `landing/products`).
- Transformaciones de entrega de Cloudinary en frontend (`f_auto,q_auto`) para optimizar peso y formato automaticamente.

## Admin y gestion de contenido
- Ruta de login admin: `/admin/login` (formulario solo contrasena).
- Ruta protegida: `/admin`.
- Acceso admin oculto de la landing publica (sin botones en TopBar/Footer).
- Edicion completa desde panel: marca, WhatsApp, categorias, FAQ, modelos e imagenes.
- Carga de imagenes por drag and drop en hero, categorias y productos.
- Ordenamiento por drag and drop para categorias y modelos.
- Grafico de clics WhatsApp por zona y resumen de ultimos 7 dias.
- Herramientas admin: exportar backup JSON e importar backup JSON.

## Persistencia y fallback
- Lectura/escritura principal en Firestore.
- Fallback local en `localStorage` para `config`, `products` y analitica si Firestore no responde.
- Login estable sin bucles de redireccion ni recargas continuas.

## Variables de entorno recomendadas
- `REACT_APP_ADMIN_EMAIL`: email admin de Firebase Auth.
- `REACT_APP_ADMIN_EMAILS`: lista separada por coma de emails admin para login por solo contrasena.
- `REACT_APP_ADMIN_PASSWORD_FALLBACK`: contrasena local opcional de emergencia cuando Firebase Auth no este disponible.
- `REACT_APP_CLOUDINARY_CLOUD_NAME`: cloud name de Cloudinary.
- `REACT_APP_CLOUDINARY_UPLOAD_PRESET`: upload preset unsigned para subir imagenes desde frontend.
- `REACT_APP_CLOUDINARY_DYNAMIC_FOLDER`: `1` para permitir folder/public_id dinamico en uploads unsigned (por defecto `0`).
