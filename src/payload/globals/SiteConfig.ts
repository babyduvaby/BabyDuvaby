import { GlobalConfig } from 'payload'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: {
    singular: 'Configuracion Global del Sitio',
    plural: 'Configuracion Global del Sitio',
  },
  access: {
    read: () => true,
  },
  fields: [
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
      name: 'shippingMessage',
      type: 'text',
      label: 'Mensaje de Envios',
      defaultValue: 'Envios rapidos a todo el Peru',
    },
    {
      name: 'maintenanceMode',
      type: 'checkbox',
      label: 'Modo Mantenimiento',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Activa para mostrar pagina de mantenimiento al publico',
      },
    },
    {
      name: 'analytics',
      type: 'group',
      label: 'Analiticas',
      fields: [
        {
          name: 'trackWhatsAppClicks',
          type: 'checkbox',
          label: 'Rastrear clics en WhatsApp',
          defaultValue: true,
        },
        {
          name: 'trackPageViews',
          type: 'checkbox',
          label: 'Rastrear visitas',
          defaultValue: true,
        },
      ],
    },
  ],
}
