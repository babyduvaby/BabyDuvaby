'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface LivePreviewData {
  [key: string]: any
}

/**
 * Hook para conectar cualquier componente React con el modo Live Preview de Payload CMS 3.0.
 * Escucha mensajes del iframe del admin panel y sincroniza los datos en tiempo real.
 *
 * Uso:
 *   const { data, isLoading } = usePayloadLivePreview({ initialData, collectionSlug })
 *
 * En el componente:
 *   <Hero brand={data.brand} />
 *
 * El hook se actualiza automaticamente cuando el admin edita contenido en el panel de Payload.
 */
export function usePayloadLivePreview<T extends LivePreviewData>({
  initialData,
  collectionSlug,
  globalSlug,
}: {
  initialData: T
  collectionSlug?: string
  globalSlug?: string
}): {
  data: T
  isLoading: boolean
  isPreview: boolean
} {
  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [isPreview, setIsPreview] = useState(false)
  const dataRef = useRef(initialData)

  useEffect(() => {
    // Detectar si estamos en modo preview
    const params = new URLSearchParams(window.location.search)
    const previewMode = params.get('preview') === 'true'
    setIsPreview(previewMode)
  }, [])

  const handleMessage = useCallback((event: MessageEvent) => {
    // Verificar origen del mensaje (Payload CMS Live Preview)
    if (event.origin !== window.location.origin && event.data?.source !== 'payload-live-preview') {
      return
    }

    const { type, data: incomingData } = event.data || {}

    if (type === 'payload-live-preview' && incomingData) {
      // Sincronizar los datos recibidos del admin panel
      dataRef.current = { ...dataRef.current, ...incomingData }
      setData({ ...incomingData } as T)
      setIsLoading(false)
    }

    if (type === 'payload-live-preview-ready') {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isPreview) {
      setIsLoading(false)
      return
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [isPreview, handleMessage])

  // Si no estamos en preview, usar los datos iniciales
  useEffect(() => {
    if (!isPreview) {
      setData(initialData)
      setIsLoading(false)
    }
  }, [initialData, isPreview])

  return { data, isLoading, isPreview }
}

/**
 * Hook simplificado para obtener datos de Payload CMS via REST API
 * y opcionalmente conectar con Live Preview.
 */
export function usePayloadData<T>({
  apiUrl,
  collectionSlug,
  id,
  initialData,
}: {
  apiUrl?: string
  collectionSlug: string
  id?: string
  initialData?: T
}): {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
} {
  const [data, setData] = useState<T | null>(initialData || null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  const baseUrl = apiUrl || process.env.NEXT_PUBLIC_PAYLOAD_URL || '/api'

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      let url = `${baseUrl}/${collectionSlug}`
      if (id) {
        url += `/${id}`
      }

      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      setData(id ? result : result.docs?.[0] || result)
    } catch (err: any) {
      setError(err.message || 'Error al cargar datos de Payload')
    } finally {
      setIsLoading(false)
    }
  }, [apiUrl, collectionSlug, id, baseUrl])

  useEffect(() => {
    if (!initialData) {
      fetchData()
    }
  }, [fetchData, initialData])

  return { data, isLoading, error, refetch: fetchData }
}
