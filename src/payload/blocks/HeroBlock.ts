import { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero / Banner Principal',
    plural: 'Hero / Banners Principales',
  },
  fields: [
    {
      name: 'headlineLead',
      type: 'text',
      label: 'Titulo Principal (Lead)',
      defaultValue: 'Viste de ternura a tu',
    },
    {
      name: 'headlineStrong',
      type: 'text',
      label: 'Titulo Destacado (Strong)',
      defaultValue: 'pequeno gran amor.',
    },
    {
      name: 'heroImage',
      type: 'upload',
      label: 'Imagen Hero',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'whatsappButtonText',
      type: 'text',
      label: 'Texto Boton WhatsApp',
      defaultValue: 'Escribenos por WhatsApp',
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
    },
  ],
}
