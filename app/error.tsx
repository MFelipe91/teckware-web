'use client'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { WA } from '@/lib/whatsapp'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="bg-ink-950 px-4 sm:px-6 lg:px-8 pt-40 pb-24">
      <div className="max-w-[76rem] mx-auto">
        <h1 className="mb-4">Algo salió mal</h1>
        <p className="text-fg-muted mb-8">
          Tuvimos un problema al cargar esta página. Inténtalo de nuevo o escríbenos por WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="btn btn-primario"
          >
            <RefreshCw size={18} aria-hidden="true" />
            Reintentar
          </button>
          <a
            href={WA.general()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secundario"
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
