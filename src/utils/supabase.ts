/**
 * Cliente Supabase centralizado para Baby Duvaby
 *
 * Provee acceso a:
 * - Supabase Auth (gestión de sesiones)
 * - Supabase Storage (archivos/imágenes)
 * - Supabase Database (PostgreSQL - opcional para queries directas)
 *
 * Variables de entorno requeridas:
 * - NEXT_PUBLIC_SUPABASE_URL: URL del proyecto Supabase
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Clave pública (anon)
 * - SUPABASE_SERVICE_ROLE_KEY: Clave de servicio (solo servidor)
 * - DATABASE_URI: Connection string PostgreSQL de Supabase
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

/**
 * Cliente Supabase para uso en el navegador (cliente)
 * Usa la clave anon - permisos limitados por RLS
 */
let browserClient: SupabaseClient | null = null

export function getSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        '[Supabase] Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY'
      )
    }
    browserClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return browserClient
}

/**
 * Cliente Supabase para uso en servidor (admin)
 * Usa la service role key - permisos completos, ignora RLS
 */
let serverClient: SupabaseClient | null = null

export function getSupabaseServerClient(): SupabaseClient {
  if (!serverClient) {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        '[Supabase] Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY'
      )
    }
    serverClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
  return serverClient
}

/**
 * Construye la URL pública de un archivo en Supabase Storage
 */
export function getSupabasePublicUrl(bucket: string, path: string): string {
  const client = getSupabaseServerClient()
  const { data } = client.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Sube un archivo a Supabase Storage
 */
export async function uploadToSupabaseStorage(
  bucket: string,
  path: string,
  file: Buffer | ArrayBuffer | Blob,
  options?: {
    contentType?: string
    upsert?: boolean
    cacheControl?: string
  }
): Promise<{ url: string; path: string; error: string | null }> {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: options?.contentType || 'image/jpeg',
    upsert: options?.upsert ?? true,
    cacheControl: options?.cacheControl || 'public, max-age=31536000, immutable',
  })

  if (error) {
    return { url: '', path, error: error.message }
  }

  const url = getSupabasePublicUrl(bucket, path)
  return { url, path, error: null }
}

/**
 * Elimina un archivo de Supabase Storage
 */
export async function deleteFromSupabaseStorage(
  bucket: string,
  paths: string[]
): Promise<{ error: string | null }> {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.storage.from(bucket).remove(paths)
  return { error: error?.message || null }
}

/**
 * Lista archivos en un bucket/carpeta de Supabase Storage
 */
export async function listSupabaseFiles(
  bucket: string,
  folder?: string,
  options?: {
    limit?: number
    offset?: number
    sortBy?: { column: string; order: 'asc' | 'desc' }
  }
) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.storage.from(bucket).list(folder || '', {
    limit: options?.limit || 100,
    offset: options?.offset || 0,
    sortBy: options?.sortBy || { column: 'created_at', order: 'desc' },
  })

  if (error) {
    return { files: [], error: error.message }
  }

  return { files: data || [], error: null }
}

/**
 * Genera una URL firmada para acceso temporal a archivos privados
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<{ url: string; error: string | null }> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

  if (error) {
    return { url: '', error: error.message }
  }

  return { url: data?.signedUrl || '', error: null }
}

/**
 * Verifica la conexión a Supabase
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean
  url: string
  error: string | null
}> {
  try {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.from('_payload_health_check').select('id').limit(1)
    // Es normal que la tabla no exista - solo verificamos que la conexión funciona
    const connected = !error || error.code === '42P01' // 42P01 = tabla no existe, pero conexión OK
    return {
      connected,
      url: supabaseUrl,
      error: connected ? null : error.message,
    }
  } catch (err: any) {
    return {
      connected: false,
      url: supabaseUrl,
      error: err.message || 'Error de conexión',
    }
  }
}
