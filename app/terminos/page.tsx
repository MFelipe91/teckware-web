import type { Metadata } from 'next'
import { EMPRESA } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Términos de Servicio',
  description: 'Términos y condiciones del servicio técnico de TECKWARE SpA.',
  robots: { index: false, follow: false },
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#080B14] pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-[#F1F5F9] mb-2">Términos de Servicio</h1>
        <p className="text-[#475569] text-sm mb-10">Última actualización: Mayo 2026</p>

        <div className="space-y-8 text-[#94A3B8] text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-[#F1F5F9] mb-3">1. Partes</h2>
            <p>
              El presente contrato se establece entre {EMPRESA.nombre} (en adelante "TECKWARE")
              y el cliente que solicita servicios técnicos.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F1F5F9] mb-3">2. Servicios</h2>
            <p>
              TECKWARE ofrece servicios de diagnóstico, reparación, formateo, mantenimiento
              y armado de equipos informáticos. Los precios están publicados en nuestro sitio
              web y pueden cambiar sin previo aviso, aplicándose el precio vigente al momento
              de la cotización aceptada.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F1F5F9] mb-3">3. Presupuesto previo</h2>
            <p>
              Antes de realizar cualquier intervención, TECKWARE entregará un presupuesto
              escrito al cliente. Ningún trabajo se ejecuta sin aprobación previa.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F1F5F9] mb-3">4. Garantía</h2>
            <p>
              Todos los servicios tienen garantía de <strong className="text-[#F1F5F9]">30 días
              calendario</strong> desde la fecha de entrega del equipo. La garantía cubre
              defectos directamente relacionados con el trabajo realizado. Quedan excluidos
              daños por mal uso, golpes, líquidos o modificaciones posteriores.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F1F5F9] mb-3">5. Datos del cliente</h2>
            <p>
              TECKWARE no accede a los archivos personales del cliente sin su autorización
              expresa. Si el trabajo requiere acceso a datos, el cliente lo autoriza explícitamente
              al momento de dejar el equipo.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F1F5F9] mb-3">6. Responsabilidad</h2>
            <p>
              TECKWARE no se hace responsable por pérdida de información preexistente al
              servicio solicitado. Se recomienda al cliente realizar un respaldo de sus datos
              antes de dejar el equipo.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F1F5F9] mb-3">7. Equipos no retirados</h2>
            <p>
              Los equipos que no sean retirados dentro de 30 días corridos tras ser notificada
              su reparación podrán ser sujetos a cargo de bodegaje. Pasados 90 días sin retiro
              ni comunicación del cliente, TECKWARE queda eximido de responsabilidad.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F1F5F9] mb-3">8. Ley aplicable</h2>
            <p>
              El presente contrato se rige por las leyes de la República de Chile, especialmente
              la Ley 19.496 de Protección al Consumidor.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F1F5F9] mb-3">9. Contacto</h2>
            <p>
              Consultas:{' '}
              <a href={`mailto:${EMPRESA.email}`} className="text-[#00D4FF] hover:underline">
                {EMPRESA.email}
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
