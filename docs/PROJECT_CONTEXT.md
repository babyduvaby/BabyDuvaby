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

## Arquitectura Frontend
- Runtime: React 18 con `react-scripts`.
- Enrutamiento: `react-router-dom`.
- Estilos: Tailwind CSS + utilidades personalizadas en `src/index.css`.
- Estado:
  - Hook central `useLandingConfig` para contenido editable y contador.
  - Catalogo por categoria/modelo definido en `src/data/defaultContent.js`.

## Integraciones Firebase
- Firebase Web SDK inicializado en `src/firebase.js`.
- Firestore para contenido editable: documento `landing/main`.
- Firebase Storage para imagenes: `landing/hero`, `landing/categories`, `landing/products`.
- Firebase Auth para acceso admin real con email/password.

## Admin y gestion de contenido
- Ruta de login admin: `/admin/login` (formulario solo contrasena).
- Ruta protegida: `/admin`.
- Acceso admin oculto de la landing publica (sin botones en TopBar/Footer).
- Edicion completa desde panel: marca, WhatsApp, categorias, FAQ, modelos e imagenes.

## Persistencia y fallback
- Lectura/escritura principal en Firestore.
- Fallback local en `localStorage` para `config` y `products` si Firestore no responde.
- Login estable sin bucles de redireccion ni recargas continuas.

## Variables de entorno recomendadas
- `REACT_APP_ADMIN_EMAIL`: email admin de Firebase Auth.
