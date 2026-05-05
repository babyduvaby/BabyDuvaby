/**
 * Payload CMS 3.0 Configuration - Baby Duvaby
 *
 * Soporta dos modos:
 * 1. DESARROLLO LOCAL: SQLite (por defecto, no requiere Supabase)
 * 2. PRODUCCION: PostgreSQL en Supabase (cuando DATABASE_URI apunta a Supabase)
 *
 * El Storage plugin se activa solo cuando las credenciales de Supabase estan configuradas.
 */
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'

import { Sites } from './payload/collections/Sites'
import { Media } from './payload/collections/Media'
import { Pages } from './payload/collections/Pages'
import { Products } from './payload/collections/Products'
import { Categories } from './payload/collections/Categories'
import { PayloadUsers } from './payload/collections/PayloadUsers'
import { SiteConfig } from './payload/globals/SiteConfig'
import { supabaseStoragePlugin } from './payload/plugins/supabaseStorage'

// Detectar si usar PostgreSQL (Supabase) o SQLite (local)
const databaseUri = process.env.DATABASE_URI || ''
const useSupabaseDB = databaseUri.includes('supabase') || databaseUri.includes('pooler')

console.log(`[Payload CMS] Base de datos: ${useSupabaseDB ? 'PostgreSQL (Supabase)' : 'SQLite (Local)'}`)

export default buildConfig({
  admin: {
    user: 'payload-users',
    livePreview: {
      url: ({ data }) => {
        const siteId = data?.site || 'baby-duvaby'
        return `${process.env.NEXT_PUBLIC_SITE_URL || 'https://baby-duvaby.vercel.app'}/?preview=true&site=${siteId}`
      },
      collections: ['pages', 'products', 'categories'],
      globals: ['site-config'],
    },
  },
  editor: lexicalEditor(),
  db: useSupabaseDB
    ? postgresAdapter({
        pool: {
          connectionString: databaseUri,
          ssl: { rejectUnauthorized: false },
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        },
        idType: 'uuid',
        migrationDir: './src/payload/migrations',
      })
    : sqliteAdapter({
        client: {
          url: 'file:./babyduvaby_payload.db',
        },
      }),
  collections: [PayloadUsers, Sites, Media, Pages, Products, Categories],
  globals: [SiteConfig],
  plugins: [
    multiTenantPlugin({
      tenantsSlug: 'sites',
      collections: {
        pages: {},
        products: {},
        categories: {},
        media: {},
      },
    }),
    supabaseStoragePlugin({
      collections: {
        media: {
          bucket: 'payload-media',
          prefix: 'media',
        },
      },
      defaultBucket: 'payload-media',
      defaultPrefix: 'media',
      publicBucket: true,
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || 'baby-duvaby-payload-secret-key-2024',
  typescript: {
    outputFile: 'src/payload/payload-types.ts',
  },
  cors: [
    process.env.NEXT_PUBLIC_SITE_URL || 'https://baby-duvaby.vercel.app',
    'http://localhost:3000',
  ].filter(Boolean),
  csrf: [
    process.env.NEXT_PUBLIC_SITE_URL || 'https://baby-duvaby.vercel.app',
    'http://localhost:3000',
  ].filter(Boolean),
})
