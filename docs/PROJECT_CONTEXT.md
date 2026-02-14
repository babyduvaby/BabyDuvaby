# PROJECT_CONTEXT

## Resumen
Landing page mobile-first para **Baby Duvaby** en React + Tailwind CSS con enfoque en conversión a WhatsApp.

## Objetivo funcional
- Mostrar hero principal, categorías y preguntas frecuentes.
- Facilitar contacto por WhatsApp con un CTA principal.
- Registrar contador de clics del CTA de WhatsApp.
- Ofrecer panel administrador protegido por contraseña para editar contenido visual/textual y número de WhatsApp.
- Persistir configuración y contador en `localStorage`.

## Arquitectura Frontend
- Runtime: React 18 con `react-scripts`.
- Estilos: Tailwind CSS + utilidades personalizadas en `src/index.css`.
- Estado:
  - Hook central `useLandingConfig` para persistencia de contenido y contador.
  - Configuración editable guardada en `localStorage`.

## Persistencia Local
- Clave de configuración: `baby_duvaby_config_v1`
- Clave de contador: `baby_duvaby_whatsapp_clicks_v1`

## Seguridad y alcance
- Panel admin con contraseña local en cliente (protección básica de interfaz).
- No hay backend en esta versión.
