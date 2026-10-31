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
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-fg mb-4">Algo salió mal</h1>
        <p className="text-fg-muted mb-8">
          Tuvimos un problema al cargar esta página. Inténtalo de nuevo o escríbenos por WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover transition-colors min-h-[52px]"
          >
            <RefreshCw size={18} aria-hidden="true" />
            Reintentar
          </button>
          <a
            href={WA.general()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-4 rounded-xl border border-silver/30 text-fg font-semibold hover:border-silver/60 hover:bg-white/5 transition-colors min-h-[52px]"
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
