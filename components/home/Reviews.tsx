'use client'

import { motion } from 'framer-motion'
import { Star, MapPin } from 'lucide-react'
import { REVIEWS, STATS } from '@/lib/constants'
import { staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'

export function Reviews() {
  return (
    <section className="bg-ink-800 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase text-brand-bright border border-brand-bright/25 rounded-full bg-brand/8">
            Clientes
          </span>
          <h2 className="text-fg mb-4">
            Lo que dicen{' '}
            <span className="gradient-text">nuestros clientes</span>
          </h2>
        </div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportConfig}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="text-center p-5 rounded-2xl bg-white/[0.03] border border-white/10"
            >
              <div className="price text-3xl font-black text-brand-bright mb-1">{stat.valor}</div>
              <div className="text-xs text-fg-muted">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Review cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportConfig}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {REVIEWS.map((review) => (
            <motion.div
              key={review.nombre}
              variants={staggerItem}
              className="glass-card rounded-2xl p-6 border border-white/10"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: review.estrellas }).map((_, i) => (
                  <Star key={i} size={14} className="fill-brand-bright text-brand-bright" />
                ))}
              </div>

              <p className="text-sm text-fg-muted leading-relaxed mb-5 italic">
                &ldquo;{review.comentario}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-brand/15 border border-brand-bright/25 text-xs font-bold text-brand-bright">
                  {review.iniciales}
                </div>
                <div>
                  <div className="text-sm font-semibold text-fg">{review.nombre}</div>
                  <div className="flex items-center gap-1 text-xs text-fg-subtle">
                    <MapPin size={10} />
                    {review.ciudad}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
