import { CollectionConfig } from 'payload'

export const Sites: CollectionConfig = {
  slug: 'sites',
  labels: {
    singular: 'Tienda',
    plural: 'Tiendas',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'domain', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre de la Tienda',
      required: true,
      unique: true,
    },
    {
      name: 'domain',
      type: 'text',
      label: 'Dominio / Site ID',
      required: true,
      unique: true,
      admin: {
        description: 'Identificador unico de la tienda (ej: baby-duvaby, tienda2)',
      },
    },
    {
      name: 'brandName',
      type: 'text',
      label: 'Nombre de Marca',
      defaultValue: 'Baby Duvaby',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitulo',
      defaultValue: 'Ropita y accesorios tiernos para tu bebe',
    },
    {
      name: 'whatsappPhone',
      type: 'text',
      label: 'Telefono WhatsApp',
      defaultValue: '51960476670',
    },
    {
      name: 'whatsappMessage',
      type: 'textarea',
      label: 'Mensaje por defecto WhatsApp',
      defaultValue: 'Hola Baby Duvaby, me gustaria informacion de sus productos.',
    },
    {
      name: 'heroImage',
      type: 'upload',
      label: 'Imagen Hero Principal',
      relationTo: 'media',
    },
    {
      name: 'logo',
      type: 'upload',
      label: 'Logo de la Tienda',
      relationTo: 'media',
    },
    {
      name: 'primaryColor',
      type: 'text',
      label: 'Color Primario (hex)',
      defaultValue: '#f7c3df',
    },
    {
      name: 'shippingMessage',
      type: 'text',
      label: 'Mensaje de Envios',
      defaultValue: 'Envios rapidos a todo el Peru',
    },
    {
      name: 'trustBadges',
      type: 'array',
      label: 'Badges de Confianza',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Texto del Badge',
        },
      ],
      defaultValue: [
        { badge: 'Entrega rapida' },
        { badge: 'Calidad garantizada' },
        { badge: 'Atencion por WhatsApp' },
      ],
    },
    {
      name: 'socials',
      type: 'group',
      label: 'Redes Sociales',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram URL',
        },
        {
          name: 'tiktok',
          type: 'text',
          label: 'TikTok URL',
        },
      ],
    },
  ],
}
