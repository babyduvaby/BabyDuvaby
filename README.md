# Baby Duvaby Landing

Landing page mobile-first en React + Tailwind CSS para Baby Duvaby.

## Requisitos
- Node.js 18+
- npm 9+

## Ejecutar en local
```bash
npm install
npm start
```

## Build de producción
```bash
npm run build
```

## Panel administrador
- URL: `https://baby-duvaby.vercel.app/admin/login`
- El panel ya no se muestra dentro de la landing pública.

## Deploy automatico a Vercel
En cada push a `main` se ejecuta `.github/workflows/vercel-production-deploy.yml`.

Configura estos secrets en GitHub (`Settings > Secrets and variables > Actions`):
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Cloudinary (subida de imagenes)
Configura estas variables en Vercel para que el panel admin pueda subir imagenes:
- `REACT_APP_CLOUDINARY_CLOUD_NAME`
- `REACT_APP_CLOUDINARY_UPLOAD_PRESET`

El `upload preset` debe ser de tipo unsigned.
- `REACT_APP_CLOUDINARY_DYNAMIC_FOLDER` (opcional, usar `1` solo si tu preset unsigned permite folder/public_id dinamico)
