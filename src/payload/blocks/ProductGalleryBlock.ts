import { Block } from 'payload'

export const ProductGalleryBlock: Block = {
  slug: 'product-gallery',
  labels: {
    singular: 'Galeria de Productos',
    plural: 'Galerias de Productos',
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      label: 'Titulo de la Seccion',
      defaultValue: 'Explora por categoria',
    },
    {
      name: 'sectionSubtitle',
      type: 'text',
      label: 'Subtitulo',
      defaultValue: 'Catalogo principal',
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Columnas',
      options: [
        { label: '2 columnas', value: '2' },
        { label: '3 columnas', value: '3' },
        { label: '4 columnas', value: '4' },
      ],
      defaultValue: '2',
    },
  ],
}
