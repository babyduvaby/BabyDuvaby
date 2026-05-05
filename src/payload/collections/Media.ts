import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Imagen / Media',
    plural: 'Imagenes / Media',
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  upload: {
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        crop: 'center',
      },
      {
        name: 'small',
        width: 600,
        height: 600,
        crop: 'center',
      },
      {
        name: 'medium',
        width: 900,
        height: 900,
        crop: 'center',
      },
      {
        name: 'large',
        width: 1400,
        height: 1400,
        crop: 'center',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        crop: 'center',
      },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto Alternativo',
      required: true,
      admin: {
        description: 'Descripcion de la imagen para accesibilidad y SEO',
      },
    },
    {
      name: 'site',
      type: 'relationship',
      label: 'Tienda',
      relationTo: 'sites',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
