import { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Categoria',
    plural: 'Categorias',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'site', 'createdAt'],
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
      name: 'title',
      type: 'text',
      label: 'Nombre de la Categoria',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      admin: {
        description: 'Identificador unico para la URL (ej: panales-y-mochilas)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Imagen Principal',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'secondaryImage',
      type: 'upload',
      label: 'Imagen Secundaria',
      relationTo: 'media',
    },
    {
      name: 'imageFocusX',
      type: 'number',
      label: 'Foco X de Imagen Principal (%)',
      min: 0,
      max: 100,
      defaultValue: 50,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'imageFocusY',
      type: 'number',
      label: 'Foco Y de Imagen Principal (%)',
      min: 0,
      max: 100,
      defaultValue: 50,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'secondaryImageFocusX',
      type: 'number',
      label: 'Foco X de Imagen Secundaria (%)',
      min: 0,
      max: 100,
      defaultValue: 50,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'secondaryImageFocusY',
      type: 'number',
      label: 'Foco Y de Imagen Secundaria (%)',
      min: 0,
      max: 100,
      defaultValue: 50,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripcion de la Categoria',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Orden de Visualizacion',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Numero menor = aparece primero',
      },
    },
  ],
}
