import { CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/HeroBlock'
import { ProductGalleryBlock } from '../blocks/ProductGalleryBlock'
import { BannerBlock } from '../blocks/BannerBlock'
import { FAQBlock } from '../blocks/FAQBlock'
import { TestimonialsBlock } from '../blocks/TestimonialsBlock'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Pagina',
    plural: 'Paginas',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'site', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const siteId = data?.site?.id || data?.site || 'baby-duvaby'
        return `${process.env.NEXT_PUBLIC_SITE_URL || 'https://baby-duvaby.vercel.app'}/?preview=true&site=${siteId}`
      },
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titulo de la Pagina',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL amigable: mi-pagina (sin barras)',
      },
    },
    {
      name: 'site',
      type: 'relationship',
      label: 'Tienda',
      relationTo: 'sites',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Bloques de Contenido',
      blocks: [
        HeroBlock,
        ProductGalleryBlock,
        BannerBlock,
        FAQBlock,
        TestimonialsBlock,
      ],
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO / Meta',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Descripcion',
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Keywords',
        },
      ],
    },
  ],
}
