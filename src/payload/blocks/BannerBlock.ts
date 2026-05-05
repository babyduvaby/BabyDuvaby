import { Block } from 'payload'

export const BannerBlock: Block = {
  slug: 'banner',
  labels: {
    singular: 'Banner Promocional',
    plural: 'Banners Promocionales',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titulo del Banner',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitulo / Descripcion',
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Imagen del Banner',
      relationTo: 'media',
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Texto del Boton CTA',
      defaultValue: 'Ver mas',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'URL del Boton CTA',
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Color de Fondo (hex)',
      defaultValue: '#fce9f2',
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      options: [
        { label: 'Completo (full width)', value: 'full' },
        { label: 'Izquierda texto, derecha imagen', value: 'left-text' },
        { label: 'Derecha texto, izquierda imagen', value: 'right-text' },
      ],
      defaultValue: 'full',
    },
  ],
}
