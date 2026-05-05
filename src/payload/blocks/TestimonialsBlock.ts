import { Block } from 'payload'

export const TestimonialsBlock: Block = {
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
}
