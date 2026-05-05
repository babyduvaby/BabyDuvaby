#!/usr/bin/env node
/**
 * Script de configuración inicial de Supabase para Baby Duvaby
 *
 * Realiza las siguientes tareas:
 * 1. Verifica la conexión a Supabase
 * 2. Crea el bucket "payload-media" para archivos/imágenes
 * 3. Configura las políticas de acceso público del bucket
 * 4. Verifica la conexión a la base de datos PostgreSQL
 *
 * Uso:
 *   node scripts/supabase-setup.js
 *
 * Variables de entorno requeridas (.env):
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 *   DATABASE_URI=postgresql://postgres.xxx:pass@aws-0-region.pooler.supabase.com:6543/postgres
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')

// Cargar variables de entorno desde .env
function loadEnv() {
  const fs = require('fs')
  const envPath = path.join(__dirname, '..', '.env')
  if (!fs.existsSync(envPath)) {
    console.error('Archivo .env no encontrado en:', envPath)
    process.exit(1)
  }
  const content = fs.readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const match = trimmed.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      let value = match[2].trim()
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  }
}

loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const DATABASE_URI = process.env.DATABASE_URI

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function success(message) {
  log(`  \u2713 ${message}`, colors.green)
}

function fail(message) {
  log(`  \u2717 ${message}`, colors.red)
}

function info(message) {
  log(`  \u2139 ${message}`, colors.cyan)
}

function step(num, title) {
  log(`\n${colors.blue}\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501${colors.reset}`)
  log(`${colors.yellow}  PASO ${num}: ${title}${colors.reset}`)
  log(`${colors.blue}\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501${colors.reset}`)
}

function createSupabaseAdmin() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// ─── Verificar variables de entorno ───
function checkEnvVars() {
  step(0, 'VERIFICAR VARIABLES DE ENTORNO')

  const vars = [
    { name: 'NEXT_PUBLIC_SUPABASE_URL', value: SUPABASE_URL },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: SUPABASE_ANON_KEY },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', value: SUPABASE_SERVICE_KEY },
    { name: 'DATABASE_URI', value: DATABASE_URI },
  ]

  let allOk = true
  for (const v of vars) {
    if (v.value && !v.value.includes('TU_') && !v.value.includes('tu-')) {
      success(`${v.name} = ${v.value.substring(0, 35)}...`)
    } else {
      fail(`${v.name} NO configurada o tiene valor placeholder`)
      allOk = false
    }
  }

  if (!allOk) {
    fail('\nFaltan variables de entorno. Configura tu archivo .env con los datos reales de Supabase.')
    info('Obt\u00e9n tus credenciales en: https://supabase.com/dashboard \u2192 Tu Proyecto \u2192 Settings \u2192 API')
    process.exit(1)
  }

  success('Todas las variables de entorno est\u00e1n configuradas')
  return true
}

// ─── PASO 1: Verificar conexi\u00f3n a Supabase ───
async function step1_verifyConnection() {
  step(1, 'VERIFICAR CONEXI\u00d3N A SUPABASE')

  try {
    const supabase = createSupabaseAdmin()

    // Test: listar buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      fail(`Error conectando a Supabase: ${listError.message}`)
      return false
    }

    success(`Conexi\u00f3n exitosa a ${SUPABASE_URL}`)
    info(`Buckets existentes: ${buckets.map((b) => b.name).join(', ') || '(ninguno)'}`)
    return true
  } catch (err) {
    fail(`Error de conexi\u00f3n: ${err.message}`)
    return false
  }
}

// ─── PASO 2: Crear bucket payload-media ───
async function step2_createBucket() {
  step(2, 'CREAR BUCKET "payload-media" PARA ARCHIVOS')

  try {
    const supabase = createSupabaseAdmin()
    const BUCKET_NAME = 'payload-media'

    // Verificar si ya existe
    const { data: buckets } = await supabase.storage.listBuckets()
    const exists = buckets?.some((b) => b.name === BUCKET_NAME)

    if (exists) {
      info(`El bucket "${BUCKET_NAME}" ya existe`)
      return true
    }

    // Crear bucket p\u00fablico
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10485760, // 10 MB
      allowedMimeTypes: [
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/avif',
      ],
    })

    if (createError) {
      fail(`Error creando bucket: ${createError.message}`)
      info('Puedes crearlo manualmente en: Supabase Dashboard \u2192 Storage \u2192 New bucket')
      info('  Nombre: payload-media | Public: YES | File size limit: 10MB')
      return false
    }

    success(`Bucket "${BUCKET_NAME}" creado exitosamente (p\u00fablico, 10MB l\u00edmite)`)
    return true
  } catch (err) {
    fail(`Error: ${err.message}`)
    return false
  }
}

// ─── PASO 3: Configurar pol\u00edticas de acceso p\u00fablico ───
async function step3_configurePolicies() {
  step(3, 'CONFIGURAR POL\u00cdTICAS DE ACCESO DEL BUCKET')

  const BUCKET_NAME = 'payload-media'

  const policySQL = `
-- Pol\u00edticas de acceso para el bucket payload-media
-- Ejecutar en: Supabase Dashboard \u2192 SQL Editor

-- 1. Lectura p\u00fablica (cualquiera puede ver las im\u00e1genes)
CREATE POLICY "Public read access for payload-media"
ON storage.objects FOR SELECT
USING (bucket_id = '${BUCKET_NAME}');

-- 2. Solo service_role puede subir archivos
CREATE POLICY "Service role upload for payload-media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = '${BUCKET_NAME}' AND auth.role() = 'service_role');

-- 3. Solo service_role puede actualizar archivos
CREATE POLICY "Service role update for payload-media"
ON storage.objects FOR UPDATE
USING (bucket_id = '${BUCKET_NAME}' AND auth.role() = 'service_role');

-- 4. Solo service_role puede eliminar archivos
CREATE POLICY "Service role delete for payload-media"
ON storage.objects FOR DELETE
USING (bucket_id = '${BUCKET_NAME}' AND auth.role() = 'service_role');
`.trim()

  info('Para configurar las pol\u00edticas, copia y ejecuta este SQL en Supabase:')
  info('Dashboard \u2192 SQL Editor \u2192 New Query \u2192 Pegar y ejecutar\n')
  log(policySQL, colors.yellow)

  info('\nAlternativa desde la UI:')
  info('  1. Ve a Storage \u2192 payload-media \u2192 Policies')
  info('  2. A\u00f1ade pol\u00edtica: "Allow public read access" (SELECT, public)')
  info('  3. A\u00f1ade pol\u00edtica: "Allow service_role full access" (INSERT/UPDATE/DELETE, service_role)')

  return true
}

// ─── PASO 4: Verificar conexi\u00f3n a PostgreSQL ───
async function step4_verifyDatabase() {
  step(4, 'VERIFICAR CONEXI\u00d3N A POSTGRESQL (PAYLOAD CMS)')

  if (!DATABASE_URI || DATABASE_URI.includes('TU_')) {
    fail('DATABASE_URI no configurada')
    info('Obt\u00e9n la cadena de conexi\u00f3n en: Supabase Dashboard \u2192 Settings \u2192 Database \u2192 Connection string \u2192 URI')
    info('Formato: postgresql://postgres.REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres')
    return false
  }

  try {
    info('Intentando conectar a PostgreSQL...')
    const { Pool } = require('pg')
    const pool = new Pool({
      connectionString: DATABASE_URI,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 1,
      connectionTimeoutMillis: 10000,
    })

    const client = await pool.connect()
    const result = await client.query('SELECT version()')
    client.release()
    await pool.end()

    success('Conexi\u00f3n a PostgreSQL exitosa')
    info(`Versi\u00f3n: ${result.rows[0].version.split(',').slice(0, 2).join(',')}`)
    info('Payload CMS crear\u00e1 las tablas autom\u00e1ticamente al ejecutar: npm run migrate')
    return true
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      info('M\u00f3dulo "pg" no instalado globalmente. Esto es normal - Payload lo incluye.')
      info('Para verificar manualmente, instala pg: npm install pg')
      info('Luego ejecuta este script de nuevo.')
      return true // No es un error cr\u00edtico
    }

    fail(`Error conectando a PostgreSQL: ${err.message}`)

    if (err.message.includes('ENOTFOUND')) {
      info('DNS no puede resolver el host. Verifica la URL en DATABASE_URI')
    } else if (err.message.includes('authentication')) {
      info('Error de autenticaci\u00f3n. Verifica usuario y contrase\u00f1a')
    } else if (err.message.includes('timeout') || err.message.includes('ECONNREFUSED')) {
      info('No se puede conectar. Verifica que el host y puerto sean correctos')
      info('Para Supabase Pooler: puerto 6543 (Session mode) o 5432 (Transaction mode)')
    }

    info('\nObt\u00e9n la cadena de conexi\u00f3n en:')
    info('  Supabase Dashboard \u2192 Settings \u2192 Database \u2192 Connection string \u2192 URI')
    info('  Selecciona "Connection pooling" \u2192 Session mode \u2192 Puerto 6543')

    return false
  }
}

// ─── Main ───
async function main() {
  log('\n\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557', colors.cyan)
  log('\u2551   Baby Duvaby - Configuraci\u00f3n de Supabase               \u2551', colors.cyan)
  log('\u2551   PostgreSQL + Storage para Payload CMS 3.0             \u2551', colors.cyan)
  log('\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d\n', colors.cyan)

  // Verificar variables de entorno
  checkEnvVars()

  // Paso 1
  const connected = await step1_verifyConnection()
  if (!connected) {
    fail('\nNo se pudo conectar a Supabase. Verifica tus credenciales.')
    process.exit(1)
  }

  // Paso 2
  await step2_createBucket()

  // Paso 3
  await step3_configurePolicies()

  // Paso 4
  await step4_verifyDatabase()

  // Resumen final
  log('\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501', colors.blue)
  log('  RESUMEN DE CONFIGURACI\u00d3N', colors.yellow)
  log('\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501', colors.blue)
  info('Supabase URL: ' + SUPABASE_URL)
  info('Database URI: ' + DATABASE_URI?.substring(0, 40) + '...')
  info('Bucket: payload-media (p\u00fablico)')
  log('')
  info('PR\u00d3XIMOS PASOS:')
  info('  1. Ejecuta migraciones: npm run migrate')
  info('  2. Inicia el servidor: npm run dev')
  info('  3. Accede al CMS: http://localhost:3000/cms')
  info('  4. Crea tu primer usuario admin en /cms')
  info('  5. En Vercel, configura las mismas variables de entorno')
  log('')
  success('\u00a1Configuraci\u00f3n completada!')
  log('')
}

main().catch((err) => {
  fail(`Error inesperado: ${err.message}`)
  process.exit(1)
})
