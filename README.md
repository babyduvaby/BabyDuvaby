# Baby Duvaby Landing

Landing page mobile-first en Next.js + Tailwind CSS para Baby Duvaby.

## Requisitos
- Node.js 18+
- npm 9+

## Ejecutar en local
```bash
npm install
npm run dev
```

## Build de produccion
```bash
npm run build
npm run start
```

## Panel administrador
- URL: `https://baby-duvaby.vercel.app/admin/login`
- El panel ya no se muestra dentro de la landing publica.

## Deploy automatico a Vercel
En cada push a `main` se ejecuta `.github/workflows/vercel-production-deploy.yml`.

Configura estos secrets en GitHub (`Settings > Secrets and variables > Actions`):
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Cloudinary (subida de imagenes)
Configura estas variables en Vercel para que el panel admin pueda subir imagenes:
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

El `upload preset` debe ser de tipo unsigned.
- `NEXT_PUBLIC_CLOUDINARY_DYNAMIC_FOLDER` (opcional, usar `1` solo si tu preset unsigned permite folder/public_id dinamico)

## Variables de admin
- `NEXT_PUBLIC_ADMIN_EMAIL` (opcional)
- `NEXT_PUBLIC_ADMIN_EMAILS`
- `NEXT_PUBLIC_ADMIN_PASSWORD_FALLBACK` (opcional)
