'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

/**
 * PayloadLivePreviewProvider - Proveedor de contexto para sincronizar
 * datos de Live Preview de Payload CMS en toda la aplicacion.
 *
 * Este componente debe envolver los componentes editables en el frontend.
 * Cuando el admin edita contenido en el panel de Payload, los cambios
 * se reflejan instantaneamente sin necesidad de refrescar la pagina.
 */

interface LivePreviewContextType {
  data: any
  isPreview: boolean
  isLoading: boolean
  updateData: (newData: any) => void
}

const LivePreviewContext = createContext<LivePreviewContextType>({
  data: null,
  isPreview: false,
  isLoading: false,
  updateData: () => {},
})

export function useLivePreview() {
  return useContext(LivePreviewContext)
}

interface PayloadLivePreviewProviderProps {
  children: React.ReactNode
  initialData?: any
  collectionSlug?: string
  globalSlug?: string
}

export function PayloadLivePreviewProvider({
  children,
  initialData,
  collectionSlug,
  globalSlug,
}: PayloadLivePreviewProviderProps) {
  const [data, setData] = useState(initialData || {})
  const [isPreview, setIsPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const previewMode = params.get('preview') === 'true'
    setIsPreview(previewMode)
    setIsLoading(false)
  }, [])

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data?.source !== 'payload-live-preview') return

    const { type, data: incomingData } = event.data || {}

    if (type === 'payload-live-preview' && incomingData) {
      setData((prev: any) => ({ ...prev, ...incomingData }))
    }

    if (type === 'payload-live-preview-ready') {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isPreview) return

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [isPreview, handleMessage])

  const updateData = useCallback((newData: any) => {
    setData((prev: any) => ({ ...prev, ...newData }))
  }, [])

  return (
    <LivePreviewContext.Provider value={{ data, isPreview, isLoading, updateData }}>
      {children}
    </LivePreviewContext.Provider>
  )
}
