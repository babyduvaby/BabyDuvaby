import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { sqliteAdapter } from '@payloadcms/db-sqlite'

import { Sites } from './payload/collections/Sites'
import { Media } from './payload/collections/Media'
import { Pages } from './payload/collections/Pages'
import { Products } from './payload/collections/Products'
import { Categories } from './payload/collections/Categories'
import { PayloadUsers } from './payload/collections/PayloadUsers'
import { SiteConfig } from './payload/globals/SiteConfig'

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
  db: sqliteAdapter({
    client: {
      url: 'file:./babyduvaby.db',
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
    vercelBlobStorage({
      enabled: process.env.VERCEL_BLOB_READ_WRITE_TOKEN !== undefined,
      token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN || '',
      collections: {
        media: true,
      },
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
