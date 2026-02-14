# PROJECT_CONTEXT

## Resumen
Landing page mobile-first para **Baby Duvaby** en React + Tailwind CSS con enfoque en conversión a WhatsApp.

## Objetivo funcional
- Mostrar hero principal, categorías y preguntas frecuentes.
- Facilitar contacto por WhatsApp con un CTA principal.
- Mantener CTA de WhatsApp fijo en la parte inferior en móvil.
- Abrir ruta de catálogo por categoría y modelos al hacer clic en cada card.
- Registrar contador de clics del CTA de WhatsApp.
- Persistir contador de clics en `localStorage`.

## Arquitectura Frontend
- Runtime: React 18 con `react-scripts`.
- Enrutamiento: `react-router-dom`.
- Estilos: Tailwind CSS + utilidades personalizadas en `src/index.css`.
- Estado:
  - Hook central `useLandingConfig` para estado de landing y contador.
  - Catálogo por categoría/modelo definido en `src/data/defaultContent.js`.

## Persistencia Local
- Clave de contador: `baby_duvaby_whatsapp_clicks_v1`

## Regla comercial actual
- Número de WhatsApp fijo para todos los botones: `+51 960 476 670`
- Acceso admin externo: `https://baby-duvaby.vercel.app/admin/login`

## Seguridad y alcance
- Panel admin local eliminado de la landing.
- No hay backend en esta versión.
