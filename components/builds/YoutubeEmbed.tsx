'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

interface Props {
  videoId: string
  title: string
}

export function YoutubeEmbed({ videoId, title }: Props) {
  const [playing, setPlaying] = useState(false)

  if (!videoId) {
    return (
      <div className="aspect-video w-full bg-[#0D1120] flex flex-col items-center justify-center gap-3 rounded-t-2xl border-b border-white/8">
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <Play size={20} className="text-[#475569] ml-0.5" />
        </div>
        <span className="text-xs text-[#475569]">Video benchmark próximamente</span>
      </div>
    )
  }

  if (playing) {
    return (
      <div className="aspect-video w-full rounded-t-2xl overflow-hidden">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={`Benchmark: ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative aspect-video w-full group block rounded-t-2xl overflow-hidden focus:outline-none"
      aria-label={`Ver benchmark de ${title}`}
    >
      <Image
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt={`Benchmark ${title}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        unoptimized
      />
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#FF0000] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-200">
          <Play size={22} fill="white" stroke="none" className="ml-1" />
        </div>
      </div>
      <div className="absolute bottom-3 left-3 text-white text-[11px] font-semibold bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-sm">
        Ver benchmark completo
      </div>
    </button>
  )
}
