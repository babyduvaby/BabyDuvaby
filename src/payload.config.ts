import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { postgresAdapter } from '@payloadcms/db-postgres'

import { Sites } from './payload/collections/Sites'
import { Media } from './payload/collections/Media'
import { Pages } from './payload/collections/Pages'
import { Products } from './payload/collections/Products'
import { Categories } from './payload/collections/Categories'
import { PayloadUsers } from './payload/collections/PayloadUsers'
import { SiteConfig } from './payload/globals/SiteConfig'
import { supabaseStoragePlugin } from './payload/plugins/supabaseStorage'

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
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgresql://postgres:postgres@localhost:5432/babyduvaby_payload',
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    },
    idType: 'uuid',
    migrationDir: './src/payload/migrations',
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
