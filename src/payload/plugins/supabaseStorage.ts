/**
 * Supabase Storage Plugin para Payload CMS 3.0
 *
 * Sube archivos (imágenes, documentos) a un bucket de Supabase Storage
 * en vez de guardarlos localmente o en Vercel Blob.
 *
 * Uso en payload.config.ts:
 *   import { supabaseStoragePlugin } from './plugins/supabaseStorage'
 *   plugins: [ supabaseStoragePlugin({ collections: { media: true } }) ]
 */
import { Config, Plugin } from 'payload'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface SupabaseStorageOptions {
  /** Colecciones cuyos uploads deben ir a Supabase Storage */
  collections: {
    [slug: string]: boolean | {
      bucket?: string
      prefix?: string
      generateURL?: (file: SupabaseFileData) => string
    }
  }
  /** Nombre del bucket por defecto (se crea si no existe) */
  defaultBucket?: string
  /** Prefijo de carpeta por defecto dentro del bucket */
  defaultPrefix?: string
  /** Si es true, hace upload público (genera URL pública) */
  publicBucket?: boolean
}

export interface SupabaseFileData {
  key: string
  bucket: string
  prefix: string
  filename: string
  mimeType: string
  size: number
  url: string
}

function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      '[Supabase Storage Plugin] Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY'
    )
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

async function ensureBucketExists(supabase: SupabaseClient, bucketName: string, isPublic: boolean) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()

  if (listError) {
    console.error('[Supabase Storage] Error listando buckets:', listError.message)
    return
  }

  const exists = buckets?.some((b) => b.name === bucketName)

  if (!exists) {
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: isPublic,
      fileSizeLimit: 10485760, // 10 MB
      allowedMimeTypes: [
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/avif',
      ],
    })

    if (createError) {
      console.error('[Supabase Storage] Error creando bucket:', createError.message)
    } else {
      console.log(`[Supabase Storage] Bucket "${bucketName}" creado (public=${isPublic})`)
    }
  }
}

function buildPublicUrl(supabase: SupabaseClient, bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const supabaseStoragePlugin =
  (options: SupabaseStorageOptions): Plugin =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }

    const defaultBucket = options.defaultBucket || 'payload-media'
    const defaultPrefix = options.defaultPrefix || ''
    const isPublic = options.publicBucket !== false

    // Modificar las colecciones configuradas para usar Supabase Storage
    config.collections = (config.collections || []).map((collection) => {
      const slug = collection.slug
      const collectionOption = options.collections?.[slug]

      if (!collectionOption) {
        return collection
      }

      const bucketName =
        typeof collectionOption === 'object' ? collectionOption.bucket || defaultBucket : defaultBucket
      const prefix =
        typeof collectionOption === 'object' ? collectionOption.prefix || defaultPrefix : defaultPrefix
      const customGenerateURL =
        typeof collectionOption === 'object' ? collectionOption.generateURL : undefined

      // Añadir hook afterRead para inyectar la URL de Supabase
      const existingAfterRead = collection.hooks?.afterRead || []

      const supabaseAfterReadHook: typeof existingAfterRead[0] = async ({ doc, req }) => {
        if (doc.filename && !doc.url?.includes('supabase')) {
          const supabase = getSupabaseClient()
          const filePath = prefix ? `${prefix}/${doc.filename}` : doc.filename
          const publicUrl = customGenerateURL
            ? customGenerateURL({
                key: filePath,
                bucket: bucketName,
                prefix,
                filename: doc.filename,
                mimeType: doc.mimeType || 'image/jpeg',
                size: doc.filesize || 0,
                url: buildPublicUrl(supabase, bucketName, filePath),
              })
            : buildPublicUrl(supabase, bucketName, filePath)

          doc.url = publicUrl

          // Añadir URLs para los tamaños de imagen
          if (doc.sizes && typeof doc.sizes === 'object') {
            const sizes = { ...doc.sizes }
            for (const sizeKey of Object.keys(sizes)) {
              const sizeData = sizes[sizeKey]
              if (sizeData?.filename && !sizeData.url?.includes('supabase')) {
                const sizePath = prefix ? `${prefix}/${sizeData.filename}` : sizeData.filename
                sizeData.url = buildPublicUrl(supabase, bucketName, sizePath)
              }
            }
            doc.sizes = sizes
          }
        }

        return doc
      }

      // Añadir hook afterChange para subir archivos a Supabase Storage
      const existingAfterChange = collection.hooks?.afterChange || []

      const supabaseAfterChangeHook: typeof existingAfterChange[0] = async ({ doc, req, operation }) => {
        if (operation === 'create' || operation === 'update') {
          // Inicializar bucket si no existe
          const supabase = getSupabaseClient()
          await ensureBucketExists(supabase, bucketName, isPublic)

          // Si hay archivo temporal, subir a Supabase
          const file = req.file
          if (file && file.data) {
            const filePath = prefix ? `${prefix}/${doc.filename}` : doc.filename

            const { error: uploadError } = await supabase.storage
              .from(bucketName)
              .upload(filePath, file.data, {
                contentType: doc.mimeType || file.mimetype || 'image/jpeg',
                upsert: true,
              })

            if (uploadError) {
              console.error('[Supabase Storage] Error subiendo archivo:', uploadError.message)
            } else {
              doc.url = buildPublicUrl(supabase, bucketName, filePath)
            }
          }
        }

        return doc
      }

      // Añadir hook afterDelete para limpiar archivos de Supabase
      const existingAfterDelete = collection.hooks?.afterDelete || []

      const supabaseAfterDeleteHook: typeof existingAfterDelete[0] = async ({ doc }) => {
        if (doc.filename) {
          const supabase = getSupabaseClient()
          const filePath = prefix ? `${prefix}/${doc.filename}` : doc.filename

          // Eliminar archivo principal
          const { error: deleteError } = await supabase.storage
            .from(bucketName)
            .remove([filePath])

          if (deleteError) {
            console.error('[Supabase Storage] Error eliminando archivo:', deleteError.message)
          }

          // Eliminar tamaños de imagen
          if (doc.sizes && typeof doc.sizes === 'object') {
            const pathsToRemove: string[] = []
            for (const sizeKey of Object.keys(doc.sizes)) {
              const sizeData = doc.sizes[sizeKey]
              if (sizeData?.filename) {
                const sizePath = prefix ? `${prefix}/${sizeData.filename}` : sizeData.filename
                pathsToRemove.push(sizePath)
              }
            }
            if (pathsToRemove.length > 0) {
              await supabase.storage.from(bucketName).remove(pathsToRemove)
            }
          }
        }

        return doc
      }

      return {
        ...collection,
        hooks: {
          ...collection.hooks,
          afterRead: [...existingAfterRead, supabaseAfterReadHook],
          afterChange: [...existingAfterChange, supabaseAfterChangeHook],
          afterDelete: [...existingAfterDelete, supabaseAfterDeleteHook],
        },
        upload: {
          ...(typeof collection.upload === 'object' ? collection.upload : {}),
          // Deshabilitar almacenamiento local de Payload
          disableLocalStorage: true,
          // Usar handlers custom para Supabase
          handlers: [],
        },
      }
    })

    return config
  }
