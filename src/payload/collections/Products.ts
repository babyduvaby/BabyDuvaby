import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Producto',
    plural: 'Productos',
  },
  admin: {
    useAsTitle: 'model',
    defaultColumns: ['model', 'category', 'price', 'site', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const siteId = data?.site?.id || data?.site || 'baby-duvaby'
        const categoryId = data?.category?.id || data?.category || 'cat-1'
        return `${process.env.NEXT_PUBLIC_SITE_URL || 'https://baby-duvaby.vercel.app'}/categoria/${categoryId}?preview=true&site=${siteId}`
      },
    },
  },
  access: {
    read: () => true,
  },
  fields: [
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
      name: 'model',
      type: 'text',
      label: 'Nombre del Modelo',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripcion',
    },
    {
      name: 'category',
      type: 'relationship',
      label: 'Categoria',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Imagen Principal',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galeria de Imagenes',
      fields: [
        {
          name: 'image',
          type: 'upload',
          label: 'Imagen',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'price',
      type: 'number',
      label: 'Precio',
      required: true,
      min: 0,
    },
    {
      name: 'currency',
      type: 'select',
      label: 'Moneda',
      options: [
        { label: 'PEN (Soles)', value: 'PEN' },
        { label: 'USD (Dolares)', value: 'USD' },
      ],
      defaultValue: 'PEN',
    },
    {
      name: 'stock',
      type: 'number',
      label: 'Stock (-1 = ilimitado)',
      defaultValue: -1,
      admin: {
        description: 'Usa -1 para stock ilimitado',
      },
    },
    {
      name: 'colors',
      type: 'array',
      label: 'Colores Disponibles',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nombre del Color',
          required: true,
        },
        {
          name: 'rgb',
          type: 'text',
          label: 'Codigo HEX',
          required: true,
          admin: {
            description: 'Ejemplo: #f6bfd8',
          },
        },
      ],
      defaultValue: [
        { name: 'Rosado pastel', rgb: '#f6bfd8' },
        { name: 'Celeste pastel', rgb: '#bfe4ff' },
        { name: 'Crema', rgb: '#f9f1df' },
      ],
    },
    {
      name: 'sizes',
      type: 'array',
      label: 'Tallas Disponibles',
      fields: [
        {
          name: 'size',
          type: 'text',
          label: 'Talla',
          required: true,
        },
      ],
      defaultValue: [
        { size: 'RN' },
        { size: '3M' },
        { size: '6M' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Producto Destacado',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
