import { Block } from 'payload'

export const FAQBlock: Block = {
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
}
