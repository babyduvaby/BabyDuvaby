'use client'

import React, { useEffect, useState } from 'react'

/**
 * Componente que muestra indicadores de edicion en el frontend
 * cuando el admin tiene sesion iniciada en Payload CMS.
 * Solo visible para usuarios autenticados como admin.
 */
export function PayloadEditControls({ collectionSlug, documentId }: {
  collectionSlug: string
  documentId?: string
}) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // Verificar si hay sesion de admin de Payload
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/payload-users/me', {
          credentials: 'include',
        })
        const data = await response.json()
        setIsAdmin(data?.user != null)
      } catch {
        setIsAdmin(false)
      }
    }

    checkAdmin()
    // Verificar periodicamente la sesion
    const interval = setInterval(checkAdmin, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!isAdmin) return null

  const adminUrl = `/cms/collections/${collectionSlug}${documentId ? `/${documentId}` : ''}`

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] transition-all duration-300"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <a
        href={adminUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-2.5 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        {isHovering && (
          <span className="text-sm font-bold whitespace-nowrap">Editar en Payload CMS</span>
        )}
      </a>
    </div>
  )
}
