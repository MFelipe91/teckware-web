import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #03040A 0%, #0D1120 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Cyan glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(0,212,255,0.12)',
            filter: 'blur(80px)',
          }}
        />
        {/* Logo */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 900,
            letterSpacing: '-2px',
            color: '#F1F5F9',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'baseline',
            gap: '0px',
          }}
        >
          <span style={{ color: '#00D4FF' }}>[</span>
          <span>TECK</span>
          <span style={{ color: '#00D4FF' }}>]</span>
          <span style={{ color: '#00D4FF', fontSize: '20px', verticalAlign: 'super', margin: '0 2px' }}>●</span>
          <span>WARE</span>
        </div>
        {/* Tagline */}
        <div style={{ fontSize: '28px', color: '#94A3B8', marginBottom: '48px' }}>
          Tu tecnología, nuestra prioridad.
        </div>
        {/* Pills */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {['Diagnóstico', 'Formateo', 'Mantención', 'PC Gamer'].map((s) => (
            <div
              key={s}
              style={{
                background: 'rgba(0,212,255,0.10)',
                border: '1px solid rgba(0,212,255,0.30)',
                borderRadius: '20px',
                padding: '8px 20px',
                color: '#00D4FF',
                fontSize: '18px',
              }}
            >
              {s}
            </div>
          ))}
        </div>
        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            color: '#475569',
            fontSize: '16px',
          }}
        >
          teckware.cl · La Serena, Chile · +56 9 3020 9427
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
