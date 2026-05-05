import { CollectionConfig } from 'payload'

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
        {
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
        },
        {
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
        },
        {
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
        },
        {
          slug: 'faq',
          labels: {
            singular: 'Seccion FAQ',
            plural: 'Secciones FAQ',
          },
          fields: [
            {
              name: 'sectionTitle',
              type: 'text',
              label: 'Titulo de Seccion',
              defaultValue: 'Preguntas Frecuentes',
            },
            {
              name: 'items',
              type: 'array',
              label: 'Preguntas',
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  label: 'Pregunta',
                  required: true,
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  label: 'Respuesta',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          slug: 'testimonials',
          labels: {
            singular: 'Seccion Testimonios',
            plural: 'Secciones Testimonios',
          },
          fields: [
            {
              name: 'sectionTitle',
              type: 'text',
              label: 'Titulo de Seccion',
              defaultValue: 'Lo que dicen nuestras mamas',
            },
            {
              name: 'sectionSubtitle',
              type: 'text',
              label: 'Subtitulo',
              defaultValue: 'Confianza real',
            },
            {
              name: 'items',
              type: 'array',
              label: 'Testimonios',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Nombre',
                  required: true,
                },
                {
                  name: 'quote',
                  type: 'textarea',
                  label: 'Cita / Testimonio',
                  required: true,
                },
                {
                  name: 'location',
                  type: 'text',
                  label: 'Ubicacion',
                },
                {
                  name: 'rating',
                  type: 'number',
                  label: 'Rating (1-5)',
                  min: 1,
                  max: 5,
                  defaultValue: 5,
                },
                {
                  name: 'avatar',
                  type: 'upload',
                  label: 'Foto del Cliente',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },
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
