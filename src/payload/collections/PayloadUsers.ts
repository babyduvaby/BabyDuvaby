import { CollectionConfig } from 'payload'

export const PayloadUsers: CollectionConfig = {
  slug: 'payload-users',
  labels: {
    singular: 'Usuario Admin',
    plural: 'Usuarios Admin',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'site', 'createdAt'],
  },
  auth: true,
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return false
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre',
    },
    {
      name: 'site',
      type: 'relationship',
      label: 'Tienda Asignada',
      relationTo: 'sites',
      admin: {
        position: 'sidebar',
        description: 'Tienda a la que pertenece este usuario admin',
      },
    },
  ],
}
