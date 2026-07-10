import type { Metadata } from 'next'
import { EMPRESA } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y manejo de datos personales de TECKWARE SpA.',
  robots: { index: false, follow: false },
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#080B14] pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-[#F1F5F9] mb-2">Política de Privacidad</h1>
        <p className="text-[#475569] text-sm mb-10">Última actualización: Mayo 2026</p>

        <div className="space-y-8 text-[#94A3B8] text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-[#F1F5F9] mb-3">1. Quiénes somos</h2>
            <p>
              {EMPRESA.nombre}, RUT {EMPRESA.rut}, con domicilio en {EMPRESA.direccion},
              es responsable del tratamiento de los datos personales que recopilamos a través
              de nuestro sitio web <strong className="text-[#F1F5F9]">teckware.cl</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F1F5F9] mb-3">2. Datos que recopilamos</h2>
            <p>Recopilamos únicamente los datos que el usuario proporciona voluntariamente:</p>
            <ul className="mt-2 ml-4 space-y-1 list-disc">
              <li>Nombre completo</li>
              <li>Número de teléfono</li>
              <li>Correo electrónico (opcional)</li>
              <li>Descripción del problema técnico</li>
            </ul>
            <p className="mt-3">
              No utilizamos cookies de seguimiento ni sistemas de analítica invasivos.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F1F5F9] mb-3">3. Uso de los datos</h2>
            <p>Los datos recopilados se usan exclusivamente para:</p>
            <ul className="mt-2 ml-4 space-y-1 list-disc">
              <li>Responder a su solicitud de servicio técnico</li>
              <li>Enviar presupuestos y cotizaciones</li>
              <li>Coordinar la entrega y recepción de equipos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F1F5F9] mb-3">4. No vendemos sus datos</h2>
            <p>
              TECKWARE SpA no vende, arrienda ni transfiere datos personales a terceros.
              La información proporcionada es confidencial y se usa únicamente para prestar
              el servicio solicitado.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F1F5F9] mb-3">5. Seguridad</h2>
            <p>
              Aplicamos medidas de seguridad acordes a nuestra especialización en Ciberseguridad:
              comunicaciones cifradas (HTTPS/TLS), cabeceras HTTP de seguridad y controles
              de acceso estrictos sobre cualquier dato almacenado.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F1F5F9] mb-3">6. Sus derechos</h2>
            <p>Conforme a la Ley 19.628 de Chile, usted tiene derecho a:</p>
            <ul className="mt-2 ml-4 space-y-1 list-disc">
              <li>Solicitar acceso a sus datos personales</li>
              <li>Solicitar la rectificación de datos incorrectos</li>
              <li>Solicitar la eliminación de sus datos</li>
            </ul>
            <p className="mt-3">
              Para ejercer estos derechos escríbanos a{' '}
              <a href={`mailto:${EMPRESA.email}`} className="text-[#00D4FF] hover:underline">
                {EMPRESA.email}
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F1F5F9] mb-3">7. Contacto</h2>
            <p>
              Consultas sobre privacidad:{' '}
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
