'use client'

import { useEffect, useRef } from 'react'

type Palette = 'cyan' | 'purple' | 'mixed'

interface CircuitBackgroundProps {
  /** Combinación de color de las trazas y pulsos. */
  palette?: Palette
  /** Densidad de trazas relativa al área del contenedor (0.5 = la mitad, 2 = el doble). */
  density?: number
  /** Opacidad global del efecto — ajustar según cuánto deba notarse detrás del contenido. */
  opacity?: number
  className?: string
}

interface Point {
  x: number
  y: number
}

interface Trace {
  points: Point[]
  length: number
  cumulative: number[]
  color: string
}

interface Pulse {
  traceIndex: number
  t: number // 0..1 a lo largo de la traza
  speed: number
  size: number
}

const COLORS: Record<Palette, string[]> = {
  cyan: ['rgba(0,212,255,', 'rgba(0,168,204,'],
  purple: ['rgba(168,85,247,', 'rgba(126,58,196,'],
  mixed: ['rgba(0,212,255,', 'rgba(168,85,247,', 'rgba(0,168,204,'],
}

/** Genera una traza tipo PCB: segmentos ortogonales con giros a 90°. */
function buildTrace(w: number, h: number, color: string): Trace {
  const points: Point[] = []
  let x = Math.random() * w
  let y = Math.random() * h
  points.push({ x, y })

  const segments = 3 + Math.floor(Math.random() * 4)
  let horizontal = Math.random() > 0.5

  for (let i = 0; i < segments; i++) {
    const step = 60 + Math.random() * 180
    if (horizontal) {
      x += Math.random() > 0.5 ? step : -step
    } else {
      y += Math.random() > 0.5 ? step : -step
    }
    x = Math.max(-40, Math.min(w + 40, x))
    y = Math.max(-40, Math.min(h + 40, y))
    points.push({ x, y })
    horizontal = !horizontal
  }

  const cumulative: number[] = [0]
  let length = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    length += Math.sqrt(dx * dx + dy * dy)
    cumulative.push(length)
  }

  return { points, length, cumulative, color }
}

/** Posición interpolada a lo largo de una traza dado t en [0,1]. */
function pointAt(trace: Trace, t: number): Point {
  const target = t * trace.length
  const { points, cumulative } = trace
  for (let i = 1; i < cumulative.length; i++) {
    if (target <= cumulative[i]) {
      const segLen = cumulative[i] - cumulative[i - 1]
      const localT = segLen === 0 ? 0 : (target - cumulative[i - 1]) / segLen
      const a = points[i - 1]
      const b = points[i]
      return { x: a.x + (b.x - a.x) * localT, y: a.y + (b.y - a.y) * localT }
    }
  }
  return points[points.length - 1]
}

export function CircuitBackground({
  palette = 'mixed',
  density = 1,
  opacity = 1,
  className = '',
}: CircuitBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const colors = COLORS[palette]

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let traces: Trace[] = []
    let pulses: Pulse[] = []
    let beamX = -0.3 // 0..1.3, barrido de izquierda a derecha
    let visible = true
    let raf = 0

    const buildScene = () => {
      const area = width * height
      const count = Math.max(4, Math.round((area / 90000) * density))
      traces = Array.from({ length: count }, () =>
        buildTrace(width, height, colors[Math.floor(Math.random() * colors.length)])
      )
      pulses = traces.map((_, i) => ({
        traceIndex: i,
        t: Math.random(),
        speed: 0.06 + Math.random() * 0.1,
        size: 2 + Math.random() * 1.5,
      }))
      // Algunas trazas llevan un segundo pulso para dar sensación de más tráfico
      traces.forEach((_, i) => {
        if (Math.random() > 0.6) {
          pulses.push({ traceIndex: i, t: Math.random(), speed: 0.05 + Math.random() * 0.09, size: 1.5 + Math.random() })
        }
      })
    }

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildScene()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    resize()

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.lineWidth = 1
      traces.forEach((trace) => {
        ctx.beginPath()
        trace.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
        ctx.strokeStyle = trace.color + '0.16)'
        ctx.stroke()
        // Nodos en los giros — sensación de placa madre
        trace.points.forEach((p, i) => {
          if (i === 0 || i === trace.points.length - 1) return
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2)
          ctx.fillStyle = trace.color + '0.22)'
          ctx.fill()
        })
      })
    }

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height)

      // Trazas base
      ctx.lineWidth = 1
      traces.forEach((trace) => {
        ctx.beginPath()
        trace.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
        ctx.strokeStyle = trace.color + '0.14)'
        ctx.stroke()
      })

      // Barrido de luz suave (tipo scan-beam)
      const beamPx = beamX * (width * 1.3) - width * 0.15
      const beamGrad = ctx.createLinearGradient(beamPx - 90, 0, beamPx + 90, 0)
      beamGrad.addColorStop(0, 'rgba(0,212,255,0)')
      beamGrad.addColorStop(0.5, 'rgba(0,212,255,0.05)')
      beamGrad.addColorStop(1, 'rgba(0,212,255,0)')
      ctx.fillStyle = beamGrad
      ctx.fillRect(beamPx - 90, 0, 180, height)
      beamX += 0.0016
      if (beamX > 1.3) beamX = -0.3

      // Pulsos viajando por las trazas (datos fluyendo)
      pulses.forEach((pulse) => {
        pulse.t += pulse.speed * 0.016
        if (pulse.t > 1) pulse.t = 0
        const trace = traces[pulse.traceIndex]
        if (!trace) return
        const p = pointAt(trace, pulse.t)

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulse.size * 6)
        glow.addColorStop(0, trace.color + '0.9)')
        glow.addColorStop(1, trace.color + '0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, pulse.size * 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, pulse.size, 0, Math.PI * 2)
        ctx.fillStyle = trace.color + '1)'
        ctx.fill()
      })

      raf = requestAnimationFrame(drawFrame)
    }

    if (reducedMotion) {
      drawStatic()
    } else {
      // Primer frame sincrónico: evita un parpadeo en blanco mientras llega el primer rAF
      drawFrame()
    }

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      if (!visible) {
        cancelAnimationFrame(raf)
      } else if (!reducedMotion) {
        raf = requestAnimationFrame(drawFrame)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [palette, density])

  return (
    <div ref={wrapRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={{ opacity }} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
